#!/usr/bin/env python3
"""Concats the 3 kickoffdaily90 WC stat videos into one loop file for the
24/7 live stream. Re-encodes with a 2s keyframe interval (-g 60 at 30fps) —
NOT -c copy — because Remotion's render output uses long GOPs (~8s) tuned
for on-demand playback, which YouTube Live's ingest flagged as "keyframe
frequency of four seconds or less" required (measured 2026-07-06, stream
health went "Poor" with 7.6-8.3s keyframe spacing). Re-encoding happens HERE
(once, on a fast local machine) specifically so the restream supervisor on
the underpowered VM can still push with plain -c:v copy — zero live CPU
cost, correct keyframe spacing already baked into the file.

Writes to a temp file then atomically renames over the live file, so the
restream supervisor never reads a half-written file.

Usage: python3 scripts/wc_build_live_loop.py
"""
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "out"
PARTS = ["wc_tournament_status.mp4", "wc_nextup.mp4", "wc_results.mp4", "wc_groupwinners.mp4", "wc_topscorers.mp4", "wc_topscorers_teams.mp4"]
FINAL = OUT / "wc_live_loop.mp4"
TMP_LIST = OUT / "_live_loop_concat.txt"
TMP_OUT = OUT / "_wc_live_loop.tmp.mp4"


def main() -> None:
    for name in PARTS:
        if not (OUT / name).exists():
            sys.exit(f"missing {name} — run wc_check_and_refresh.py first")

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

    TMP_OUT.rename(FINAL)  # atomic on same filesystem
    TMP_LIST.unlink()
    print(f"[live-loop] rebuilt {FINAL} ({probe.stdout.strip()})")


if __name__ == "__main__":
    main()
