#!/usr/bin/env python3
"""Build the long-form evolving rain+music bed for the 24/7 rain sleep stream.

Design goals (Akshay, 2026-08-01: "bigger blends… at least 30 min rain
different"):
  - The rain must NEVER sound like a short loop. Every 5-minute segment is
    generated from a DIFFERENT noise seed AND a different filter shape, then
    crossfaded into the next, so the texture continuously evolves.
  - Music is the 22-track artist-direct Scott Buckley set (CC BY 4.0, first-
    party provenance — see public/rain/LICENSES.md), sequenced with long
    crossfades so tracks melt into each other.
  - Everything here is either generated in-house (rain = ours outright) or
    first-party CC BY. Nothing sourced from reuploader/aggregator accounts —
    that pattern is what got the previous stream Content-ID claimed.

Usage:
  python3 scripts/build_rain_stream_audio.py --hours 2.5
  python3 scripts/build_rain_stream_audio.py --hours 0.5 --out out/rain_test.mp3
"""
from __future__ import annotations
import argparse, math, random, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MUSIC = ROOT / "public" / "rain" / "music"
WORK_DEFAULT = Path("/tmp/rainbuild")

# (label, noise colour, amplitude, highpass, lowpass, tremolo f, tremolo d, gain)
# NOTE: ffmpeg's tremolo filter rejects f < 0.1 Hz ("Result too large") — keep all
# tremolo frequencies >= 0.10 or generation fails on that texture only.
# Deliberately varied: bright downpours, muffled window rain, soft drizzle,
# mid steady rain. Sequencing walks through these so the weather "changes".
TEXTURES = [
    ("steady",   "white", 0.90, 400, 9000,  0.12, 0.12, "-6dB"),
    ("heavy",    "white", 1.00, 250, 12000, 0.10, 0.08, "-5dB"),
    ("window",   "pink",  1.00, 180, 4500,  0.14, 0.15, "-7dB"),
    ("drizzle",  "brown", 1.00, 300, 6000,  0.11, 0.10, "-8dB"),
    ("distant",  "brown", 0.95, 220, 5200,  0.13, 0.13, "-9dB"),
    ("rooftop",  "pink",  1.00, 320, 7800,  0.16, 0.11, "-6dB"),
    ("soft",     "brown", 0.85, 260, 4000,  0.10, 0.14, "-9dB"),
    ("downpour", "white", 1.00, 300, 11000, 0.15, 0.09, "-5dB"),
]

SEG = 300          # seconds per generated rain segment (300 is ffmpeg-safe here)
XF = 12            # crossfade seconds between rain segments
MUSIC_XF = 10      # crossfade seconds between music tracks


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{' '.join(cmd[:12])}…\n{r.stderr[-1500:]}")


def dur(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def gen_rain_segment(work: Path, idx: int, tex, seed: int) -> Path:
    label, colour, amp, hp, lp, tf, td, gain = tex
    out = work / f"rain_{idx:03d}_{label}.flac"
    if out.exists():
        return out
    run(["ffmpeg", "-y", "-f", "lavfi",
         "-i", f"anoisesrc=color={colour}:amplitude={amp}:duration={SEG}:seed={seed}",
         "-af", f"highpass=f={hp},lowpass=f={lp},tremolo=f={tf}:d={td},volume={gain}",
         "-ac", "2", "-ar", "48000", "-c:a", "flac", "-compression_level", "0", str(out)])
    return out


def crossfade_chain(work: Path, parts: list[Path], xf: int, tag: str) -> Path:
    """Pairwise acrossfade — ffmpeg's filter graph gets unwieldy past a few
    inputs, so fold left one at a time."""
    cur = parts[0]
    for i, nxt in enumerate(parts[1:], 1):
        out = work / f"{tag}_fold_{i:03d}.flac"
        if not out.exists():
            run(["ffmpeg", "-y", "-i", str(cur), "-i", str(nxt),
                 "-filter_complex", f"[0:a][1:a]acrossfade=d={xf}:c1=tri:c2=tri",
                 "-ac", "2", "-ar", "48000", "-c:a", "flac", "-compression_level", "0", str(out)])
        if cur != parts[0]:
            cur.unlink(missing_ok=True)
        cur = out
    return cur


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--hours", type=float, default=2.5)
    ap.add_argument("--out", default=str(ROOT / "out" / "rain_stream_bed.mp3"))
    ap.add_argument("--rain-only", action="store_true",
                    help="skip the music layer (pure rain bed)")
    ap.add_argument("--music-gain", default="0.85")
    ap.add_argument("--rain-gain", default="0.55")
    ap.add_argument("--work", default=str(WORK_DEFAULT))
    ap.add_argument("--keep-work", action="store_true")
    args = ap.parse_args()

    work = Path(args.work)
    work.mkdir(parents=True, exist_ok=True)
    target = args.hours * 3600
    rng = random.Random(20260801)

    # ── rain: walk the texture list so the weather changes, never the same
    #    seed twice, crossfaded into one continuous evolving bed ────────────
    n_seg = max(2, math.ceil((target + XF) / (SEG - XF)))
    print(f"rain: {n_seg} segments × {SEG}s (seeded distinct) → ~{args.hours:.1f}h")
    order = []
    for i in range(n_seg):
        # step through textures with a little jitter so it isn't a fixed cycle
        order.append(TEXTURES[(i * 3 + rng.randint(0, 1)) % len(TEXTURES)])
    parts = [gen_rain_segment(work, i, t, 1000 + i * 7919)
             for i, t in enumerate(order)]
    print(f"  generated {len(parts)} unique rain segments")
    rain = crossfade_chain(work, parts, XF, "rain")
    print(f"  rain bed: {dur(rain)/3600:.2f}h")

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    if args.rain_only:
        run(["ffmpeg", "-y", "-i", str(rain), "-t", str(target),
             "-af", "loudnorm=I=-18:TP=-1.5", "-c:a", "libmp3lame", "-q:a", "2",
             str(out)])
    else:
        tracks = sorted(MUSIC.glob("*.mp3"))
        if not tracks:
            sys.exit(f"no music in {MUSIC}")
        # repeat the shuffled album until it covers the target
        seq, total = [], 0.0
        while total < target:
            album = tracks[:]
            rng.shuffle(album)
            for t in album:
                seq.append(t)
                total += dur(t) - MUSIC_XF
                if total >= target:
                    break
        print(f"music: {len(seq)} track-slots ({total/3600:.2f}h) from "
              f"{len(tracks)} unique tracks")
        wavs = []
        for i, t in enumerate(seq):
            w = work / f"mus_{i:03d}.flac"
            if not w.exists():
                run(["ffmpeg", "-y", "-i", str(t), "-ac", "2", "-ar", "48000",
                     "-c:a", "flac", "-compression_level", "0", str(w)])
            wavs.append(w)
        music = crossfade_chain(work, wavs, MUSIC_XF, "mus")
        print(f"  music bed: {dur(music)/3600:.2f}h")

        print("mixing rain under music…")
        run(["ffmpeg", "-y", "-i", str(music), "-i", str(rain),
             "-filter_complex",
             f"[0:a]volume={args.music_gain}[m];"
             f"[1:a]volume={args.rain_gain}[r];"
             f"[m][r]amix=inputs=2:duration=shortest:dropout_transition=0,"
             f"loudnorm=I=-18:TP=-1.5",
             "-t", str(target), "-c:a", "libmp3lame", "-q:a", "2", str(out)])

    print(f"\n-> {out}  ({dur(out)/3600:.2f}h)")
    if not args.keep_work:
        shutil.rmtree(work, ignore_errors=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
