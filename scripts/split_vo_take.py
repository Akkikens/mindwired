#!/usr/bin/env python3
"""Split ONE human-recorded narration take into per-scene doc-engine clips.

Built for appeal/host videos where the narrator is a real person reading the
doc spec's scene texts top-to-bottom in a single recording (first use:
mindwiredprocess — Akshay's own voice). The doc engine wants one mp3 per
scene id; this produces them WITHOUT any TTS.

  python3 scripts/split_vo_take.py <slug> <take.(m4a|mp3|wav)> [--dry-run]

How: faster-whisper word timestamps -> align each scene's opening words
against the transcript (monotonic, fuzzy) -> cut at the silence midpoints
between scenes -> public/shorts/<slug>/audio/<id>.mp3. Then run:

  python3 scripts/build_doc_vo.py <slug> --manifest-only

Low-confidence alignments are printed loudly — LISTEN to those clips before
trusting them. Requires: pip install faster-whisper; ffmpeg on PATH.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from difflib import SequenceMatcher
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"

PAD = 0.08          # seconds kept before/after a scene inside the gap
ANCHOR_WORDS = 6    # scene-opening words used to find each boundary
MIN_RATIO = 0.55    # below this, the match is flagged for human review


def norm(t: str) -> list[str]:
    t = t.lower().replace("'", "'")
    t = re.sub(r"[^a-z0-9' ]+", " ", t)
    return [w for w in t.split() if w]


def transcribe(wav: Path):
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(str(wav), word_timestamps=True, language="en")
    words = []
    for seg in segs:
        for w in seg.words or []:
            words.append((norm(w.word)[0] if norm(w.word) else "", w.start, w.end))
    return [w for w in words if w[0]]


def find_anchor(words, anchor, from_idx):
    """Best fuzzy position of `anchor` (list of words) at/after from_idx."""
    best, best_i = -1.0, from_idx
    hay = [w[0] for w in words]
    for i in range(from_idx, len(words) - len(anchor) + 1):
        r = SequenceMatcher(None, anchor, hay[i:i + len(anchor)]).ratio()
        if r > best:
            best, best_i = r, i
            if r > 0.92:
                break
    return best_i, best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("take", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    scenes = doc["scenes"]
    if not args.take.exists():
        sys.exit(f"take not found: {args.take}")
    out_dir = REPO / "public" / "shorts" / args.slug / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "take.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.take),
                        "-ac", "1", "-ar", "16000", str(wav)], check=True)
        print("[split] transcribing (faster-whisper small, cpu)…")
        words = transcribe(wav)
    if not words:
        sys.exit("no words transcribed — is the take audible?")
    total = words[-1][2]
    print(f"[split] {len(words)} words, {total/60:.1f} min of audio")

    # locate the START of every scene by its opening words, strictly monotonic
    starts, flags, idx = [], [], 0
    for s in scenes:
        anchor = norm(s["text"])[:ANCHOR_WORDS]
        i, r = find_anchor(words, anchor, idx)
        starts.append(i)
        flags.append(r)
        idx = i + max(1, len(anchor) // 2)
    # scene ranges: start word .. word before next scene's start
    cuts = []
    for n, s in enumerate(scenes):
        w_start = words[starts[n]][1]
        w_end = words[starts[n + 1] - 1][2] if n + 1 < len(scenes) else words[-1][2]
        nxt_start = words[starts[n + 1]][1] if n + 1 < len(scenes) else total
        gap = max(0.0, nxt_start - w_end)
        t0 = max(0.0, w_start - PAD if n else 0.0)
        t1 = min(total, w_end + min(PAD, gap / 2) if n + 1 < len(scenes) else total)
        cuts.append((s["id"], t0, t1, flags[n]))

    print(f"\n{'id':<8}{'start':>8}{'end':>8}{'dur':>7}  match")
    bad = []
    for sid, t0, t1, r in cuts:
        mark = "OK " if r >= MIN_RATIO else "?? "
        if r < MIN_RATIO:
            bad.append(sid)
        print(f"{sid:<8}{t0:>8.2f}{t1:>8.2f}{t1-t0:>7.2f}  {mark}{r:.2f}")
    if args.dry_run:
        return
    for sid, t0, t1, _ in cuts:
        dst = out_dir / f"{sid}.mp3"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.take),
                        "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}",
                        "-ar", "44100", "-b:a", "192k", str(dst)], check=True)
    print(f"\n[split] {len(cuts)} clips -> {out_dir}")
    if bad:
        print(f"[split] !! LISTEN before trusting (weak alignment): {', '.join(bad)}")
    print(f"[split] next: python3 scripts/build_doc_vo.py {args.slug} --manifest-only")


if __name__ == "__main__":
    main()
