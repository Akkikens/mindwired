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
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import master  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
# doc_* beds are BANNED (Akshay 2026-07-25, "irritating", repeated viewer
# complaints — memory music-beds-banned-2026-07); they stay on disk only so
# old comps don't 404. Nothing before this line stopped them being passed.
BANNED_BEDS = {"doc_awe.mp3", "doc_tension.mp3", "doc_open.mp3", "doc_somber.mp3"}


def check_music_bed(p: Path | None):
    if not p:
        return
    if p.name in BANNED_BEDS:
        sys.exit(f"music bed {p.name} is BANNED (Akshay 2026-07-25 — use the "
                 f"bed_* set in public/beds/, see LICENSES.md)")
    if not p.name.startswith("bed_"):
        print(f"[master] NOTE: {p.name} is outside the approved bed_* set — intended?")


def clear_webpack_cache():
    """A stale webpack bundle silently served pre-edit doc JSON into renders
    TWICE in one session (memory starfishprime-video-10fps-bug, fifth lesson).
    Clearing costs seconds; a stale render costs a full re-render."""
    shutil.rmtree(REPO / "node_modules" / ".cache" / "webpack", ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("compId", help="Remotion composition id (as registered in Root.tsx)")
    ap.add_argument("out", type=Path, help="final -14 LUFS output path")
    ap.add_argument("--music", type=Path, help="optional music bed to duck under the voice")
    ap.add_argument("--music-gain-db", type=float, default=-18.0,
                    help="base attenuation of the music bed (default -18 dB)")
    ap.add_argument("--windows", metavar="SLUG",
                    help="doc slug: score the bed in windows (cold open, chapter "
                         "transitions, closing) computed from the doc manifest, "
                         "instead of looping the whole runtime — the standing rule "
                         "for docs over ~8 min. Requires --music.")
    ap.add_argument("--props", help="JSON string or @path.json passed to remotion --props")
    ap.add_argument("--gl", help="Remotion --gl backend (use 'angle' for WebGL/R3F comps)")
    ap.add_argument("--scale", type=float,
                    help="Remotion --scale (2 = 4K from a 1080p comp; text/SVG stay "
                         "lossless, expect ~2-4x render time)")
    ap.add_argument("--concurrency", type=int,
                    help="Remotion render concurrency (default ~cores/2; on a "
                         "32-core render VM pass ~28 to actually use the cores)")
    ap.add_argument("--remotion-timeout", type=int,
                    help="Remotion --timeout ms (raise for OffthreadVideo-heavy "
                         "4K comps — frame seeks can exceed the 30s default)")
    args = ap.parse_args()

    out: Path = args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.music and not args.music.exists():
        sys.exit(f"music not found: {args.music}")
    if args.windows and not args.music:
        sys.exit("--windows requires --music")
    check_music_bed(args.music)
    clear_webpack_cache()

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / f"{out.stem}_raw.mp4"

        cmd = ["npx", "remotion", "render", args.compId, str(tmp)]
        if args.props:
            cmd += ["--props", args.props]
        if args.gl:
            cmd += [f"--gl={args.gl}"]
        if args.scale:
            cmd += [f"--scale={args.scale}"]
        if args.concurrency:
            cmd += [f"--concurrency={args.concurrency}"]
        if args.remotion_timeout:
            cmd += [f"--timeout={args.remotion_timeout}"]
        print(f"[render] {' '.join(cmd)}")
        r = subprocess.run(cmd)
        if r.returncode != 0:
            sys.exit(f"remotion render failed for {args.compId} (exit {r.returncode})")

        before = master.probe_loudness(tmp)
        print(f"[master] {tmp.name}: {before if before is None else f'{before:.1f}'} LUFS in")

        if args.music and args.windows:
            import doctiming
            doc, man = doctiming.load(args.windows)
            wins = doctiming.music_windows(doc, man["durations"])
            print(f"[master] windowed bed {args.music.name}: " +
                  ", ".join(f"{a:.0f}-{b:.0f}s" for a, b in wins))
            master.mix_music_windowed(tmp, args.music, out, wins,
                                      music_gain_db=args.music_gain_db)
        elif args.music:
            print(f"[master] ducking {args.music.name} under the voice + normalizing …")
            master.mix_music_ducked(tmp, args.music, out, music_gain_db=args.music_gain_db)
        else:
            print("[master] normalizing to -14 LUFS …")
            master.master_video(tmp, out)

    after = master.probe_loudness(out)
    print(f"[master] -> {out}  ({after if after is None else f'{after:.1f}'} LUFS)")


if __name__ == "__main__":
    main()
