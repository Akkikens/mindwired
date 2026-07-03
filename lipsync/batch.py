#!/usr/bin/env python3
"""Lip-sync every scene clip of a viral-shorts plan against the host image, then
stitch the talking clips end-to-end (with the same per-scene durations the
Remotion timeline uses) into one talking-head mp4 — no Remotion needed for this cut.

Usage: python3 lipsync/batch.py <slug>   # e.g. neutronstar
Reads:  src/viral/plans/<slug>.json (must have a "host" field), public/shorts/<slug>/audio/*.mp3
Writes: lipsync/out/<slug>/<sceneId>.mp4 (per-scene) + lipsync/out/<slug>_full.mp4 (stitched)
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from client import run as lipsync_run, load_url  # noqa: E402


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: batch.py <slug>")
    slug = sys.argv[1]
    plan = json.loads((REPO / "src/viral/plans" / f"{slug}.json").read_text())
    host = plan.get("host")
    if not host:
        sys.exit(f"plan '{slug}' has no \"host\" field — add one (see neutronstar.json)")
    image = REPO / "public" / host
    audio_dir = REPO / "public/shorts" / slug / "audio"
    out_dir = REPO / "lipsync/out" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    url = load_url()

    clips = []
    for sc in plan["scenes"]:
        mp3 = audio_dir / f"{sc['id']}.mp3"
        mp4 = out_dir / f"{sc['id']}.mp4"
        if not mp3.exists():
            sys.exit(f"missing audio {mp3} — run scripts/build_short.py {slug} first")
        if not mp4.exists():
            print(f"[{sc['id']}] lip-syncing...")
            lipsync_run(image, mp3, mp4, url)
        else:
            print(f"[{sc['id']}] skip (exists)")
        clips.append(mp4)

    # stitch with a concat list (re-encode for safety across variable SadTalker outputs)
    concat_file = out_dir / "concat.txt"
    concat_file.write_text("\n".join(f"file '{c.resolve()}'" for c in clips))
    full = REPO / "lipsync/out" / f"{slug}_full.mp4"
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
                    "-c:v", "libx264", "-c:a", "aac", "-r", "30", str(full)], check=True)
    print(f"\nStitched -> {full}")


if __name__ == "__main__":
    main()
