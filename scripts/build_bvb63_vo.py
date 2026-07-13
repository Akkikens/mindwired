#!/usr/bin/env python3
"""'63' — Bellingham/Haaland BVB short — sparse Nolan-style narration (Cartesia).
Facts verified 2026-07-11: Haaland to BVB Jan 2020, Bellingham summer 2020 (17),
63 appearances together, 2021 DFB-Pokal, Haaland->City 2022, Bellingham->Madrid 2023,
ENG 2-1 NOR aet (Bellingham brace). The "promise" is framed as narrative device, not quote.

Run: .venv-lipsync/bin/python scripts/build_bvb63_vo.py [--force]
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "bvb63" / "audio"

BEATS: list[tuple[str, str, str]] = [
    ("v_open",   "Every story ends where it began. This one... begins at the end.", "calm"),
    ("v_rewind", "So run it backwards.", "calm"),
    ("v_snow",   "January, twenty twenty. A nineteen-year-old giant steps off a bus into the snow.", "calm"),
    ("v_summer", "Six months later, a seventeen-year-old walks into the same yellow cathedral... carrying everything he owns.", "calm"),
    ("v_63",     "Sixty-three games. Side by side. Two kids learning to be giants in a wall of yellow noise.", "awe"),
    ("v_cup",    "One cup, lifted by four hands. And a promise neither of them ever said out loud... meet me on the biggest stage.", "awe"),
    ("v_split",  "Then time did what time always does. It split them.", "fear"),
    ("v_clocks", "Two clocks. Ticking in different cities. One sky blue. One white.", "calm"),
    ("v_fate",   "But a bracket is just fate, drawn as lines. And every line they ever walked... was bending back toward one night in Miami.", "confidence"),
    ("v_duel",   "The biggest stage. Exactly as promised. Except only one of them gets to stay.", "fear"),
    ("v_result", "Extra time. Borrowed time. The kid in white ends it — twice. And the giant in red... walks into the dark.", "shock"),
    ("v_end",    "The promise was never about winning. It was about meeting there. Sixty-three games. One cup. One goodbye.", "calm"),
]


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1", str(path)], capture_output=True, text=True)
    try: return float(out.stdout.strip())
    except ValueError: return 0.0


def main() -> None:
    ap = argparse.ArgumentParser(); ap.add_argument("--force", action="store_true")
    args = ap.parse_args(); OUT.mkdir(parents=True, exist_ok=True)
    durs = []
    for bid, text, tone in BEATS:
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {bid}")
        else:
            dst.write_bytes(cartesia.tts(text, tone=tone, speed=0.88))
            print(f"->  {bid}.mp3")
        durs.append((bid, duration(dst)))
    print(f"\n--- durations (total {sum(d for _,d in durs):.0f}s) ---")
    for bid, d in durs: print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
