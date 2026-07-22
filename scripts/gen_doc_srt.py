#!/usr/bin/env python3
"""Generate word-perfect .srt captions + chapter timestamps for a mindwired-doc
video, straight from the doc spec + manifest (no transcription — the script IS
the transcript). Cue timing matches DocWide.tsx (LEAD/HOLD must stay in sync).

    .venv-lipsync/bin/python scripts/gen_doc_srt.py <slug> [--out mindwired_<slug>.srt]
Prints the CHAPTERS block for the METADATA description as a side effect.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from doctiming import DOCS, FPS, HOLD, LEAD, REPO  # noqa: E402,F401 — single source of timing truth


def ts(t: float) -> str:
    h = int(t // 3600); mn = int(t % 3600 // 60); s = int(t % 60)
    return f"{h:02d}:{mn:02d}:{s:02d},{int((t - int(t)) * 1000):03d}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    m = json.loads((DOCS / f"{args.slug}.manifest.json").read_text())["durations"]

    cues, chapters, cursor = [], ["00:00 " + "Opening"], 0.0
    for sc in doc["scenes"]:
        aud = m[sc["id"]]
        if "chapter" in sc:
            mm, ss = divmod(int(cursor), 60); hh, mm = divmod(mm, 60)
            stamp = f"{hh}:{mm:02d}:{ss:02d}" if hh else f"{mm:02d}:{ss:02d}"
            _cl = sc["chapter"].splitlines()
            chapters.append(f"{stamp} {_cl[1] if len(_cl) > 1 else _cl[0]}")
        start = cursor + LEAD / FPS
        # strip the [pause] dramatic-beat marker (TTS-only, see cartesia.with_pauses)
        # so it never ships in subtitles or skews the per-word cue timing
        spoken = re.sub(r"\s*\[pause\]\s*", " ", sc["text"]).strip()
        sents = [x.strip() for x in re.split(r"(?<=[.!?])\s+", spoken) if x.strip()]
        groups, cur = [], ""
        for x in sents:
            if cur and len(cur) + len(x) + 1 > 90:
                groups.append(cur); cur = x
            else:
                cur = (cur + " " + x).strip()
        if cur:
            groups.append(cur)
        tot = sum(len(g.split()) for g in groups)
        t = start
        for g in groups:
            dur = aud * len(g.split()) / tot
            cues.append((t, t + dur, g)); t += dur
        cursor += (LEAD + round(aud * FPS) + HOLD) / FPS

    out = Path(args.out or REPO / f"mindwired_{args.slug}.srt")
    with out.open("w") as f:
        for i, (a, b, txt) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")
    print(f"{len(cues)} cues -> {out.name}\n\nCHAPTERS")
    print("\n".join(chapters))
    mm, ss = divmod(int(cursor), 60); hh, mm = divmod(mm, 60)
    print(f"TOTAL {hh}:{mm:02d}:{ss:02d}")


if __name__ == "__main__":
    main()
