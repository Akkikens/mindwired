#!/usr/bin/env python3
"""kickoffdaily90 — "Messi vs Mo Salah: World Cup Anime Edition" narration.

One mp3 per beat into public/messi-vs-salah/audio/<id>.mp3 via Cartesia (cloned
English channel narrator, tone per beat), then prints each clip's real duration
so the Remotion comp scene list can be filled in accurately.

Story = Argentina's real 3-2 comeback vs Egypt, Round of 16, 2026 World Cup
(Jul 7 2026): Egypt led 2-0, Messi missed a penalty, then dragged Argentina back
(assist + 84' equaliser), Enzo Fernandez won it 90+2. Messi's 8th of the tourney,
past Mbappe and Haaland.

Idempotent: skips a beat whose mp3 already exists (never re-spends). --force to
regenerate. Run with the lipsync venv (has httpx):

    .venv-lipsync/bin/python scripts/build_messi_vo.py [--only egypt,...] [--force]
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "messi-vs-salah" / "audio"

# (id, VO line, tone). Scores spelled phonetically so TTS doesn't mangle them.
BEATS: list[tuple[str, str, str]] = [
    ("walkout",   "Two of the best on the planet. One World Cup knockout. Messi's Argentina, against Mo Salah's Egypt.", "confidence"),
    ("egypt",     "And Egypt were flying. Two nil up, and cruising.", "shock"),
    ("pen",       "Messi had even missed a penalty. With eight minutes left, Argentina looked finished.", "fear"),
    ("powerup",   "And then... the greatest of all time woke up.", "confidence"),
    ("equalizer", "Eighty fourth minute. Messi drags them level. Two, two.", "excitement"),
    ("winner",    "Stoppage time. Enzo Fernandez. Three, two. The greatest comeback of the World Cup.", "excitement"),
    ("salah_out", "Salah goes home.", "confidence"),
    ("clash",     "Messi: eight goals. Past Mbappe. Past Haaland. He's not human.", "confidence"),
]


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True,
    )
    try:
        return float(out.stdout.strip())
    except ValueError:
        return 0.0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma-separated beat ids")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    durations: list[tuple[str, float]] = []
    for bid, text, tone in BEATS:
        if only and bid not in only:
            continue
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {bid} (exists)")
        else:
            audio = cartesia.tts(text, tone=tone, speed=0.96)
            dst.write_bytes(audio)
            print(f"->  {bid}.mp3  ({len(audio)} bytes)")
        durations.append((bid, duration(dst)))

    print("\n--- durations (paste into comp SCENES) ---")
    for bid, d in durations:
        print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
