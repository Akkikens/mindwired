#!/usr/bin/env python3
"""Word-accurate SRT captions from a rendered master, via local Whisper.

The existing gen_doc_srt.py derives cue timing from the doc manifest (per-clip
durations + LEAD/HOLD math) — good for CHAPTERS, but cue boundaries are
estimates, not the actual spoken words. This script transcribes the finished
audio itself (faster-whisper, runs locally, $0) so every cue snaps to what the
narrator actually says in the final mix — including any drift from SFX beds,
extraHold beats, or the baked outro.

Usage:
  .venv-agent/bin/python3 scripts/whisper_srt.py out/<slug>_gce.mp4 \
      [--out mindwired_<slug>.srt] [--model small.en] [--body-end SECONDS]

  --model     faster-whisper model (default small.en — fast + accurate for our
              clean single-narrator VO; use medium.en if a proper noun misses)
  --body-end  stop emitting cues at this timestamp (e.g. body end, to leave the
              subscribe outro uncaptioned). Default: caption everything.

Chapters still come from gen_doc_srt.py (scene-based) — run both:
  gen_doc_srt.py for the CHAPTERS block, this for the uploaded .srt file.
"""
import argparse
import sys
from pathlib import Path

MAX_CUE_CHARS = 84   # ~2 lines at 42 chars
MAX_CUE_SECONDS = 5.0
CUE_BREAK_PUNCT = ".?!,;:"


def fmt_ts(t: float) -> str:
    if t < 0:
        t = 0.0
    h = int(t // 3600)
    m = int(t % 3600 // 60)
    s = int(t % 60)
    ms = int(round((t - int(t)) * 1000))
    if ms == 1000:  # rounding edge
        ms = 0
        s += 1
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def words_to_cues(words):
    """Group whisper word objects into readable SRT cues."""
    cues = []
    cur = []
    cur_start = None
    for w in words:
        token = w.word.strip()
        if not token:
            continue
        if cur_start is None:
            cur_start = w.start
        cur.append((token, w.start, w.end))
        text = " ".join(t for t, _, _ in cur)
        too_long = len(text) >= MAX_CUE_CHARS
        too_slow = (w.end - cur_start) >= MAX_CUE_SECONDS
        at_break = token[-1:] in CUE_BREAK_PUNCT and len(text) > 24
        if too_long or too_slow or at_break:
            cues.append((cur_start, w.end, text))
            cur = []
            cur_start = None
    if cur:
        cues.append((cur_start, cur[-1][2], " ".join(t for t, _, _ in cur)))
    return cues


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="rendered master (mp4/mp3/wav)")
    ap.add_argument("--out", default=None, help="output .srt path")
    ap.add_argument("--model", default="small.en")
    ap.add_argument("--body-end", type=float, default=None,
                    help="drop cues starting after this many seconds")
    args = ap.parse_args()

    src = Path(args.input)
    if not src.exists():
        sys.exit(f"input not found: {src}")
    out = Path(args.out) if args.out else src.with_suffix(".srt")

    from faster_whisper import WhisperModel  # import late: heavy
    print(f"[whisper] loading {args.model} (first run downloads the model)…")
    model = WhisperModel(args.model, device="cpu", compute_type="int8")

    print(f"[whisper] transcribing {src.name}…")
    segments, info = model.transcribe(
        str(src), language="en", word_timestamps=True,
        vad_filter=True,  # skips the music-only/silent gaps cleanly
    )

    words = []
    for seg in segments:
        if seg.words:
            words.extend(seg.words)
    if not words:
        sys.exit("[whisper] no speech found — wrong file?")

    cues = words_to_cues(words)
    if args.body_end is not None:
        cues = [c for c in cues if c[0] < args.body_end]

    with open(out, "w", encoding="utf-8") as f:
        for i, (start, end, text) in enumerate(cues, 1):
            f.write(f"{i}\n{fmt_ts(start)} --> {fmt_ts(end)}\n{text}\n\n")

    dur = words[-1].end
    print(f"[whisper] {len(cues)} cues, speech to {fmt_ts(dur)} -> {out}")


if __name__ == "__main__":
    main()
