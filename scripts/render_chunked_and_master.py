#!/usr/bin/env python3
"""Same CLI/behavior as scripts/render_and_master.py, but the render step is
split into small chunks (fresh `npx remotion render` process per chunk) and
concatenated, instead of one continuous render — a workaround for a real,
still-not-fully-diagnosed intermittent Remotion font-loading race that gets
more likely to trigger the longer a single render process runs (see memory
`starfishprime-video-10fps-bug`, first hit 2026-08-24).

Reach for this INSTEAD of render_and_master.py when a plain render has
already failed once with a "delayRender... font ... was called but not
cleared" timeout at a seemingly-random frame — don't re-debug it, this is
the validated fix. Safe to use as the default for any long (>15 min) doc
episode even before a failure is observed.

Usage: identical to render_and_master.py, plus:
  --chunk-size N       frames per chunk (default 250, the validated size)
  --parallel-chunks N  concurrent chunk-render processes (default 5)
  --chunk-retries N    retries per chunk before giving up (default 6)
"""
import argparse
import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import master          # noqa: E402
import chunked_render  # noqa: E402

# import the shared guards from the plain wrapper (banned-bed deny-list,
# webpack cache clear) so the two render paths can't drift apart
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_and_master import check_music_bed, clear_webpack_cache  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("compId")
    ap.add_argument("out", type=Path)
    ap.add_argument("--music", type=Path)
    ap.add_argument("--music-gain-db", type=float, default=-18.0)
    ap.add_argument("--windows", metavar="SLUG")
    ap.add_argument("--props")
    ap.add_argument("--gl")
    ap.add_argument("--scale", type=float)
    ap.add_argument("--concurrency", type=int,
                    help="remotion --concurrency PER CHUNK (keep modest — this "
                         "multiplies with --parallel-chunks for total Chrome tabs)")
    ap.add_argument("--remotion-timeout", type=int)
    # 4×3 = 12 concurrent tabs, the shape validated on swissair111 after 24
    # tabs reliably starved video-heavy chunks
    ap.add_argument("--chunk-size", type=int, default=250)
    ap.add_argument("--parallel-chunks", type=int, default=4)
    ap.add_argument("--chunk-retries", type=int, default=6)
    args = ap.parse_args()

    out: Path = args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.music and not args.music.exists():
        sys.exit(f"music not found: {args.music}")
    if args.windows and not args.music:
        sys.exit("--windows requires --music")
    check_music_bed(args.music)
    clear_webpack_cache()

    # 24 concurrent Chrome tabs reliably starved video-heavy chunks on a
    # 32-core box (swissair111, 2026-08-24) — 12 passed clean. Overcommit
    # needs an explicit opt-in, not a silent env tweak.
    tabs = (args.parallel_chunks or 5) * (args.concurrency or 3)
    if tabs > 12 and os.environ.get("ALLOW_TAB_OVERCOMMIT") != "1":
        sys.exit(f"parallel_chunks×concurrency = {tabs} concurrent Chrome tabs "
                 f"(>12) — this reliably failed video-heavy chunks before "
                 f"(swissair111). Reduce, or set ALLOW_TAB_OVERCOMMIT=1 to force.")

    extra_args = []
    if args.props:
        extra_args += ["--props", args.props]
    if args.gl:
        extra_args += [f"--gl={args.gl}"]
    if args.scale:
        extra_args += [f"--scale={args.scale}"]
    if args.concurrency:
        extra_args += [f"--concurrency={args.concurrency}"]
    if args.remotion_timeout:
        extra_args += [f"--timeout={args.remotion_timeout}"]

    # Persistent (not tempfile.TemporaryDirectory) so a crash or Ctrl-C keeps
    # already-rendered chunks — re-running the same command resumes instead
    # of starting the whole render over. Deleted only after a clean finish.
    chunk_dir = out.parent / f".chunks_{out.stem}"
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / f"{out.stem}_raw.mp4"

        chunked_render.render_chunked(
            args.compId, tmp, chunk_dir,
            chunk_size=args.chunk_size,
            parallel_chunks=args.parallel_chunks,
            retries=args.chunk_retries,
            extra_args=extra_args,
        )

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

    import shutil
    shutil.rmtree(chunk_dir, ignore_errors=True)

    after = master.probe_loudness(out)
    print(f"[master] -> {out}  ({after if after is None else f'{after:.1f}'} LUFS)")


if __name__ == "__main__":
    main()
