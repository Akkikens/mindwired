#!/usr/bin/env python3
"""Lip-sync a still portrait + audio into a talking-head clip via zf-kbot/sonic on
Replicate — a modern diffusion talking-head model. Unlike SadTalker (cjwbw/sadtalker),
Sonic can keep the source resolution (keep_resolution) instead of downscaling/cropping
to a soft face, so the output stays as sharp as the input photo.

Requires: replicate  (repo venv: .venv-lipsync)  |  Env: REPLICATE_API_TOKEN in .env

Usage:
  .venv-lipsync/bin/python lipsync/sonic_client.py \
      --image public/host/orion_v3_vertical.png \
      --audio public/shorts/neutronstar/audio/hook.mp3 \
      --out lipsync/out/hook_sonic_v3.mp4
"""
import argparse
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# zf-kbot/sonic — verified live via `models.get(...).latest_version` on 2026-07-03.
# If this ever 404s, re-fetch the current hash the same way (see lipsync/README.md).
MODEL = os.environ.get(
    "REPLICATE_SONIC_MODEL",
    "zf-kbot/sonic:c6d80220ce71d8df04d5dbf2b189b70b9f4937aea6a030de12cb46951b24d134",
)


def load_token() -> str:
    if os.environ.get("REPLICATE_API_TOKEN"):
        return os.environ["REPLICATE_API_TOKEN"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("REPLICATE_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("REPLICATE_API_TOKEN not set — add it to mindwired/.env")


def run(image: Path, audio: Path, out: Path, dynamic_scale: float = 1.0,
        keep_resolution: bool = True, inference_steps: int = 25):
    import replicate

    os.environ["REPLICATE_API_TOKEN"] = load_token()
    out.parent.mkdir(parents=True, exist_ok=True)

    print(f"  lip-syncing {audio.name} onto {image.name} via Sonic "
          f"(keep_resolution={keep_resolution}, dynamic_scale={dynamic_scale})...")
    output = replicate.run(
        MODEL,
        input={
            "image": open(image, "rb"),
            "audio": open(audio, "rb"),
            "dynamic_scale": dynamic_scale,
            "keep_resolution": keep_resolution,
            "inference_steps": inference_steps,
        },
    )
    url = output if isinstance(output, str) else getattr(output, "url", None) or str(output)
    tmp = out.with_suffix(out.suffix + ".part")
    urllib.request.urlretrieve(url, tmp)
    # a truncated/interrupted download still "succeeds" as far as urlretrieve is
    # concerned — verify the MP4 actually has its moov atom before publishing it
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                             "-of", "csv=p=0", str(tmp)], capture_output=True, text=True)
    if probe.returncode != 0 or not probe.stdout.strip():
        tmp.unlink(missing_ok=True)
        sys.exit(f"downloaded clip failed to verify (corrupt/truncated): {probe.stderr.strip()[:300]}")
    tmp.rename(out)
    print(f"  -> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--dynamic-scale", type=float, default=1.0,
                    help="movement intensity; lower = calmer host (default 1.0)")
    ap.add_argument("--steps", type=int, default=25, help="diffusion steps (default 25)")
    ap.add_argument("--no-keep-resolution", action="store_true",
                    help="let the model downscale (not recommended)")
    args = ap.parse_args()
    run(args.image, args.audio, args.out, dynamic_scale=args.dynamic_scale,
        keep_resolution=not args.no_keep_resolution, inference_steps=args.steps)
