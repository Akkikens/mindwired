#!/usr/bin/env python3
"""One-off windowed-music master pass for astronautbodies — music only at the
cold open, chapter transitions, and the closing (not the whole 11-min runtime).
See scripts/lib/master.py: mix_music_windowed()."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from lib.master import mix_music_windowed, probe_loudness

REPO = Path(__file__).parent.parent
SRC = REPO / "out/ab_raw_nomusic.mp4"
MUSIC = REPO / "public/beds/doc_awe.mp3"
OUT = REPO / "out/What Happened to the Bodies of Every Astronaut Who Ever Died.mp4"

WINDOWS = [
    (0.0, 49.83),      # cold open through Ch1 title card
    (157.53, 164.5),   # Ch2 transition
    (245.8, 253.63),   # Ch3 transition
    (383.0, 390.6),    # Ch4 transition
    (525.07, 531.47),  # Ch5 transition
    (590.87, 671.1),   # closing wrap-up, stops right before the outro Sequence
]

if __name__ == "__main__":
    print(f"[master] windowed doc_awe mix: {len(WINDOWS)} windows, "
          f"{sum(e - s for s, e in WINDOWS):.0f}s of {671.1:.0f}s body")
    mix_music_windowed(SRC, MUSIC, OUT, WINDOWS)
    print(f"[master] -> {OUT}  ({probe_loudness(OUT):.1f} LUFS)")
