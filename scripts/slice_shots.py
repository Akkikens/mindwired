#!/usr/bin/env python3
"""Cut a long source clip into its distinct SHOTS, so one file stops carrying
a quarter of an episode.

Banked 2026-09-13 from noradtapes, which shipped with one ops-floor clip on 32
of 123 scenes and 23 back-to-back repeats. The clips were never the problem —
a 9-minute DVIDS piece holds a dozen different setups. The problem was using
the whole file as a single asset and letting DocWide start it from frame 0
every time, so the audience saw the same six seconds over and over.

This finds real cut points with ffmpeg scene detection, keeps segments long
enough to be usable, and writes each as its own <prefix>_N.mp4. Preflight's
visual-monotony gate then has a wide pool to work with.

    scripts/slice_shots.py public/shorts/<slug>/video/<file>.mp4 \
        --prefix rampshots --min 3.5 --max 14 --limit 12

Every slice inherits the source's licence — log the SOURCE file once in
ATTRIBUTION.md; these are the same work, not new ones.
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def scene_cuts(path: Path, threshold: float) -> list[float]:
    """Timestamps where the picture changes materially."""
    r = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "info", "-i", str(path),
         "-filter:v", f"select='gt(scene,{threshold})',showinfo",
         "-f", "null", "-"],
        capture_output=True, text=True)
    cuts = []
    for line in (r.stderr or "").splitlines():
        if "pts_time:" in line:
            try:
                cuts.append(float(line.split("pts_time:")[1].split()[0]))
            except (IndexError, ValueError):
                pass
    return sorted(set(cuts))


def segments(cuts: list[float], dur: float, lo: float, hi: float) -> list[tuple[float, float]]:
    """Turn cut points into usable spans, dropping anything too short."""
    bounds = [0.0] + cuts + [dur]
    out = []
    for a, b in zip(bounds, bounds[1:]):
        # trim a beat off each end so we never sit on the dissolve itself
        a2, b2 = a + 0.35, min(b - 0.35, a + 0.35 + hi)
        if b2 - a2 >= lo:
            out.append((a2, b2))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", type=Path)
    ap.add_argument("--prefix", required=True,
                    help="output basename; files land as <prefix>_1.mp4, _2.mp4 …")
    ap.add_argument("--min", type=float, default=3.5, help="shortest usable shot (s)")
    ap.add_argument("--max", type=float, default=14.0, help="longest slice to take (s)")
    ap.add_argument("--threshold", type=float, default=0.28)
    ap.add_argument("--limit", type=int, default=14)
    ap.add_argument("--outdir", type=Path, default=None)
    a = ap.parse_args()

    src = a.source.resolve()
    if not src.exists():
        print(f"no such file: {src}", file=sys.stderr)
        return 2
    outdir = (a.outdir or src.parent).resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    dur = probe_duration(src)
    cuts = scene_cuts(src, a.threshold)
    segs = segments(cuts, dur, a.min, a.max)
    print(f"{src.name}: {dur:.0f}s, {len(cuts)} cut(s) detected -> {len(segs)} usable shot(s)")

    if not segs:
        print("  !! no distinct shots found — lower --threshold, or this really is "
              "one locked-off take (use it once and source something else)")
        return 1

    # spread the picks across the whole clip rather than taking the first N
    if len(segs) > a.limit:
        step = len(segs) / a.limit
        segs = [segs[int(i * step)] for i in range(a.limit)]

    written = []
    for i, (start, end) in enumerate(segs, 1):
        dst = outdir / f"{a.prefix}_{i}.mp4"
        subprocess.run(
            ["ffmpeg", "-nostdin", "-v", "error", "-ss", f"{start:.2f}",
             "-t", f"{end - start:.2f}", "-i", str(src),
             "-vf", "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,"
                    "crop=1920:1080",
             "-c:v", "libx264", "-crf", "18", "-preset", "medium",
             "-pix_fmt", "yuv420p", "-an", str(dst), "-y"],
            check=True)
        written.append(dst.name)
        print(f"  -> {dst.name}  [{start:6.1f}s - {end:6.1f}s]")

    print(f"\n{len(written)} shot(s) from one source. They share the source's "
          f"licence — credit the SOURCE once in ATTRIBUTION.md, not each slice.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
