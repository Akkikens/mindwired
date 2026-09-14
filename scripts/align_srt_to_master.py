#!/usr/bin/env python3
"""Re-time a doc's SRT against the ACTUAL rendered master.

Why this exists (2026-09-13, apollo1): a CHUNKED render's concatenated master
does not carry the ideal timeline. apollo1 rendered 41,719 frames — 1390.6s at
30fps — but the container reports 1398.7s, and every narration clip sits
progressively LATER than scripts/lib/doctiming.py predicts (measured +7.6s by
the closing act). Audio and video drift together, so the video itself is fine;
what breaks is every timestamp computed from the model — the .srt and the
description's CHAPTERS block. This is the real cause of the "gen_doc_srt.py
drifted 19s" symptom banked on noradtapes: the script was right about the
composition, the master just isn't the composition.

Rather than guess a scale factor, this measures each scene. Every VO clip is a
known waveform, so each one is located inside the master by normalised
cross-correlation over a search window around its predicted position, at 10ms
resolution. Cues are then emitted at MEASURED positions.

    scripts/align_srt_to_master.py <slug> <master.mp4> [--out x.srt] [--window 40]

Each match reports a confidence score; anything weak is listed so it can be
eyeballed instead of silently shipped.
"""
from __future__ import annotations
import argparse, json, subprocess, sys, wave
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from doctiming import DOCS, load, scene_spans  # noqa: E402

SR = 16000
HOP = 160          # 10 ms envelope resolution


def wav_of(src: Path | str, extra: list[str] | None = None) -> np.ndarray:
    cmd = ["ffmpeg", "-v", "error"] + (extra or []) + ["-i", str(src),
           "-vn", "-ac", "1", "-ar", str(SR), "-f", "wav", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    i = raw.find(b"data")
    d = np.frombuffer(raw[i + 8:], dtype=np.int16).astype(np.float32)
    return d / (np.abs(d).max() or 1.0)


def env(x: np.ndarray) -> np.ndarray:
    n = len(x) // HOP * HOP
    return np.abs(x[:n]).reshape(-1, HOP).mean(1)


def locate(master_env: np.ndarray, clip_env: np.ndarray, centre_s: float,
           window_s: float) -> tuple[float, float]:
    """Return (start_seconds, confidence 0-1) of clip inside master."""
    lo = max(0, int((centre_s - window_s) * SR / HOP))
    hi = min(len(master_env), int((centre_s + window_s) * SR / HOP) + len(clip_env))
    seg = master_env[lo:hi]
    if len(seg) <= len(clip_env):
        return centre_s, 0.0
    c = (clip_env - clip_env.mean()) / (clip_env.std() or 1)
    # normalised correlation: subtract local mean / divide local std per lag
    n = len(c)
    cs = np.cumsum(np.insert(seg, 0, 0.0))
    cs2 = np.cumsum(np.insert(seg * seg, 0, 0.0))
    lags = len(seg) - n + 1
    sums = cs[n:n + lags] - cs[:lags]
    sqs = cs2[n:n + lags] - cs2[:lags]
    means = sums / n
    stds = np.sqrt(np.maximum(sqs / n - means * means, 1e-9))
    corr = np.correlate(seg, c, "valid")[:lags]
    score = (corr - n * means * c.mean()) / (n * stds)
    b = int(np.argmax(score))
    return (lo + b) * HOP / SR, float(score[b])


def ts(t: float) -> str:
    h = int(t // 3600); m = int(t % 3600 // 60); s = int(t % 60)
    return f"{h:02d}:{m:02d}:{s:02d},{int(round((t - int(t)) * 1000)):03d}"


def split_cues(text: str, start: float, dur: float, limit: int = 96):
    """Break a scene's narration into caption-length cues, time-shared by length."""
    import re
    parts, buf = [], ""
    for sent in re.split(r"(?<=[.!?])\s+", text.strip()):
        if not sent:
            continue
        if len(buf) + len(sent) + 1 <= limit:
            buf = f"{buf} {sent}".strip()
        else:
            if buf:
                parts.append(buf)
            while len(sent) > limit:
                cut = sent.rfind(" ", 0, limit)
                cut = cut if cut > 0 else limit
                parts.append(sent[:cut].strip()); sent = sent[cut:].strip()
            buf = sent
    if buf:
        parts.append(buf)
    total = sum(len(p) for p in parts) or 1
    out, t = [], start
    for p in parts:
        d = dur * len(p) / total
        out.append((t, t + d, p)); t += d
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug"); ap.add_argument("master")
    ap.add_argument("--out", default=None)
    ap.add_argument("--window", type=float, default=40.0)
    a = ap.parse_args()

    doc, man = load(a.slug)
    spans = scene_spans(doc, man["durations"])
    print(f"extracting master audio from {a.master} …")
    me = env(wav_of(a.master))
    print(f"master audio: {len(me) * HOP / SR:.1f}s")

    aud = Path("public/shorts") / a.slug / "audio"
    rows, weak = [], []
    for s, model_start, model_end in spans:
        clip = aud / f"{s['id']}.mp3"
        if not clip.exists():
            continue
        ce = env(wav_of(clip))
        # LEAD frames of silence precede the narration inside each scene
        got, score = locate(me, ce, model_start + 0.35, a.window)
        rows.append((s, got, len(ce) * HOP / SR, score, model_start))
        if score < 0.30:
            weak.append((s["id"], score, model_start, got))

    # enforce monotonic starts — a weak match must never reorder the transcript
    rows.sort(key=lambda r: r[4])
    fixed, last = [], -1.0
    for s, got, dur, score, model_start in rows:
        if got <= last:
            got = last + 0.05
        fixed.append((s, got, dur, score, model_start)); last = got

    cues = []
    for s, got, dur, score, _ in fixed:
        text = (s.get("text") or "").strip()
        if not text:
            continue
        cues.extend(split_cues(text, got, dur))

    out = Path(a.out or f"{a.slug}_aligned.srt")
    with out.open("w") as f:
        for i, (st, en, tx) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(st)} --> {ts(en)}\n{tx}\n\n")

    drift = [(g - m) for _, g, _, sc, m in fixed if sc >= 0.30]
    print(f"\n{len(cues)} cues -> {out}")
    if drift:
        print(f"measured drift vs doctiming model: {min(drift):+.2f}s .. {max(drift):+.2f}s")
    print("\nCHAPTERS (measured off the master)")
    print("0:00 Opening")
    for s, got, _, _, _ in fixed:
        if s.get("chapter") and s["id"] != "title":
            lab = s["chapter"].replace("\n", " — ")
            print(f"{int(got)//60}:{int(got)%60:02d} {lab}")
    if weak:
        print(f"\n⚠ {len(weak)} weak match(es) — eyeball these:")
        for sid, sc, m, g in weak:
            print(f"   {sid}: score {sc:.2f}, model {m:.1f}s -> measured {g:.1f}s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
