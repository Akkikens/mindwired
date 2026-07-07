#!/usr/bin/env python3
"""Master a finished render to YouTube spec (-14 LUFS) — the mandatory last
audio step before a video is "done". Optionally mixes a music bed under the
voice with sidechain ducking.

Usage:
  python3 scripts/master_video.py out/video.mp4
      -> out/video_master.mp4  (loudnorm to -14 LUFS)

  python3 scripts/master_video.py out/video.mp4 --music public/beds/space.mp3
      -> out/video_master.mp4  (music ducked under voice, then loudnorm)

  python3 scripts/master_video.py out/video.mp4 --out out/final.mp4 --inplace

Verifies the result: prints measured LUFS before and after so you can confirm
the target was hit before uploading.
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import master  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("--music", type=Path, help="optional music bed to duck under the voice")
    ap.add_argument("--music-gain-db", type=float, default=-18.0,
                    help="base attenuation of the music bed (default -18 dB)")
    ap.add_argument("--out", type=Path, help="output path (default: <name>_master.mp4)")
    ap.add_argument("--inplace", action="store_true", help="overwrite the input after mastering")
    args = ap.parse_args()

    src: Path = args.video
    if not src.exists():
        sys.exit(f"not found: {src}")
    out = args.out or src.with_name(f"{src.stem}_master{src.suffix}")

    before = master.probe_loudness(src)
    print(f"[master] {src.name}: {before if before is None else f'{before:.1f}'} LUFS in")

    if args.music:
        if not args.music.exists():
            sys.exit(f"music not found: {args.music}")
        print(f"[master] ducking {args.music.name} under the voice + normalizing …")
        master.mix_music_ducked(src, args.music, out, music_gain_db=args.music_gain_db)
    else:
        print("[master] normalizing to -14 LUFS …")
        master.master_video(src, out)

    after = master.probe_loudness(out)
    print(f"[master] -> {out}  ({after if after is None else f'{after:.1f}'} LUFS)")

    if args.inplace:
        out.replace(src)
        print(f"[master] moved over {src}")


if __name__ == "__main__":
    main()
