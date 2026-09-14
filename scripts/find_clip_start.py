#!/usr/bin/env python3
"""Find the first second of a clip that is real footage, not a title slate.

Born 2026-09-13 on hadalpollution. NOAA Ocean Exploration clips open on a logo
slate ("SEAMOUNTS: A GEOLOGIC PUZZLE", "Okeanos Explorer EX1304 Dive 13",
"DEEP SEARCH 2019 / ROV Jason"), and many carry a burned-in species label over
the first seconds ("VENT SHRIMP", "SCALE WORM", "PIZZA FISH"). DocWide starts
every clip at frame 0, so whatever sits there is exactly what the viewer sees.
A fixed -ss guess does not work: some slates run 3s, some run 15s.

A slate is a near-black frame carrying a small bright graphic, so it is
separable from real footage by two cheap statistics — the share of near-black
pixels and the colour spread. Deep-sea footage is dark too, which is why BOTH
are needed: a slate is dark AND flat AND colourless.

    scripts/find_clip_start.py <file.mp4> [--max 30]
"""
from __future__ import annotations
import argparse, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image


def duration(p: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout.strip()
    try:
        return float(out)
    except ValueError:
        return 0.0


def frame_stats(p: Path, t: float, tmp: Path) -> tuple[float, float, float]:
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", f"{t:.2f}", "-i", str(p),
                    "-frames:v", "1", "-vf", "scale=240:-1", str(tmp), "-y"], check=False)
    if not tmp.exists():
        return 1.0, 0.0, 0.0
    a = np.asarray(Image.open(tmp).convert("RGB")).astype(np.float32)
    g = a.mean(axis=2)
    black = float((g < 18).mean())          # slates are mostly black
    spread = float(g.std())                  # …and flat
    sat = float(np.abs(a - g[..., None]).mean())  # …and colourless
    return black, spread, sat


def find_start(path: Path, max_scan: float = 30.0) -> float:
    d = duration(path)
    if d <= 0:
        return 0.0
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / "f.png"
        limit = min(max_scan, max(0.0, d - 4))
        t = 0.0
        while t <= limit:
            black, spread, sat = frame_stats(path, t, tmp)
            # real footage: not overwhelmingly black, and either textured or coloured
            if black < 0.55 and (spread > 14 or sat > 6):
                return t
            t += 1.0
    return min(5.0, max(0.0, d * 0.2))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("file", type=Path)
    ap.add_argument("--max", type=float, default=30.0)
    a = ap.parse_args()
    print(f"{find_start(a.file, a.max):.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
