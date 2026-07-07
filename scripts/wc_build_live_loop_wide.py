#!/usr/bin/env python3
"""Concats the 5 kickoffdaily90 WC stat videos' 16:9 WIDE renders into one
loop file for the second live stream. Re-encodes with a 2s keyframe interval
(-g 60 at 30fps) for the same reason as wc_build_live_loop.py — YouTube Live
needs frequent keyframes; Remotion's default long GOP causes "Poor" health.

Usage: python3 scripts/wc_build_live_loop_wide.py
"""
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "out"
PARTS = ["wc_nextup_wide.mp4", "wc_results_wide.mp4", "wc_groupwinners_wide.mp4",
         "wc_topscorers_wide.mp4", "wc_topscorers_teams_wide.mp4"]
FINAL = OUT / "wc_live_loop_wide.mp4"
TMP_LIST = OUT / "_live_loop_wide_concat.txt"
TMP_OUT = OUT / "_wc_live_loop_wide.tmp.mp4"


def main() -> None:
    for name in PARTS:
        if not (OUT / name).exists():
            sys.exit(f"missing {name} — render the -wide comps first")

    TMP_LIST.write_text("".join(f"file '{OUT / name}'\n" for name in PARTS))

    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(TMP_LIST),
         "-c:v", "libx264", "-preset", "veryfast", "-g", "60", "-keyint_min", "60",
         "-sc_threshold", "0", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
         str(TMP_OUT), "-v", "error"],
        cwd=REPO, check=True)

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1", str(TMP_OUT)],
        cwd=REPO, capture_output=True, text=True)
    if probe.returncode != 0 or probe.stderr.strip() or not probe.stdout.strip():
        sys.exit(f"ffprobe reported a problem on concat output: {probe.stderr}")

    TMP_OUT.rename(FINAL)
    TMP_LIST.unlink()
    print(f"[live-loop-wide] rebuilt {FINAL} ({probe.stdout.strip()})")


if __name__ == "__main__":
    main()
