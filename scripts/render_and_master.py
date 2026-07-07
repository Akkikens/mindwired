#!/usr/bin/env python3
"""Render a Remotion composition AND master it to -14 LUFS in one shot — so no
upload can skip the mandatory master step (CLAUDE.md targets -14 LUFS for
YouTube). This is the wrapper to reach for instead of a bare `npx remotion
render`: it renders to a temp file, runs the same master pass as
scripts/master_video.py, and writes the final -14 LUFS file at <out>.

Usage:
  python3 scripts/render_and_master.py ShortBrokenTime out/brokentime.mp4
      -> renders the comp, then loudnorms to -14 LUFS at out/brokentime.mp4

  # WebGL / R3F comps need the angle backend:
  python3 scripts/render_and_master.py WhatIfSunExploded out/sun.mp4 --gl angle

  # duck a music bed under the voice before normalizing:
  python3 scripts/render_and_master.py ShortX out/x.mp4 --music public/beds/space.mp3

  # pass props through to remotion (JSON string or @file.json):
  python3 scripts/render_and_master.py MyComp out/c.mp4 --props '{"slug":"foo"}'

Prints measured LUFS before and after so you can confirm the target was hit.
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import master  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("compId", help="Remotion composition id (as registered in Root.tsx)")
    ap.add_argument("out", type=Path, help="final -14 LUFS output path")
    ap.add_argument("--music", type=Path, help="optional music bed to duck under the voice")
    ap.add_argument("--music-gain-db", type=float, default=-18.0,
                    help="base attenuation of the music bed (default -18 dB)")
    ap.add_argument("--props", help="JSON string or @path.json passed to remotion --props")
    ap.add_argument("--gl", help="Remotion --gl backend (use 'angle' for WebGL/R3F comps)")
    args = ap.parse_args()

    out: Path = args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.music and not args.music.exists():
        sys.exit(f"music not found: {args.music}")

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / f"{out.stem}_raw.mp4"

        cmd = ["npx", "remotion", "render", args.compId, str(tmp)]
        if args.props:
            cmd += ["--props", args.props]
        if args.gl:
            cmd += [f"--gl={args.gl}"]
        print(f"[render] {' '.join(cmd)}")
        r = subprocess.run(cmd)
        if r.returncode != 0:
            sys.exit(f"remotion render failed for {args.compId} (exit {r.returncode})")

        before = master.probe_loudness(tmp)
        print(f"[master] {tmp.name}: {before if before is None else f'{before:.1f}'} LUFS in")

        if args.music:
            print(f"[master] ducking {args.music.name} under the voice + normalizing …")
            master.mix_music_ducked(tmp, args.music, out, music_gain_db=args.music_gain_db)
        else:
            print("[master] normalizing to -14 LUFS …")
            master.master_video(tmp, out)

    after = master.probe_loudness(out)
    print(f"[master] -> {out}  ({after if after is None else f'{after:.1f}'} LUFS)")


if __name__ == "__main__":
    main()
