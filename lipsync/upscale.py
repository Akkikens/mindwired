#!/usr/bin/env python3
"""Upscale a host portrait to 4K with Real-ESRGAN on Replicate.

Gemini's image model caps out around 1024-1408px, which is too soft to survive a
lip-sync pass + a 1080x1920 Shorts render. Real-ESRGAN 4x restores a crisp master.
face_enhance stays OFF by default — GFPGAN re-airbrushes skin, which is exactly the
"AI look" we fought to remove.

Requires: replicate (repo venv: .venv-lipsync)  |  Env: REPLICATE_API_TOKEN in .env

Usage:
  .venv-lipsync/bin/python lipsync/upscale.py \
      --image public/host/orion_v4c.png --out public/host/orion_v4c_4k.png --scale 4
"""
import argparse
import os
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

MODEL = os.environ.get("REPLICATE_UPSCALE_MODEL", "nightmareai/real-esrgan")


def load_token() -> str:
    if os.environ.get("REPLICATE_API_TOKEN"):
        return os.environ["REPLICATE_API_TOKEN"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("REPLICATE_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("REPLICATE_API_TOKEN not set — add it to mindwired/.env")


def run(image: Path, out: Path, scale: int = 4, face_enhance: bool = False):
    import replicate

    os.environ["REPLICATE_API_TOKEN"] = load_token()
    out.parent.mkdir(parents=True, exist_ok=True)

    print(f"  upscaling {image.name} x{scale} via {MODEL} (face_enhance={face_enhance})...")
    output = replicate.run(
        MODEL,
        input={"image": open(image, "rb"), "scale": scale, "face_enhance": face_enhance},
    )
    url = output if isinstance(output, str) else getattr(output, "url", None) or str(output)
    urllib.request.urlretrieve(url, out)
    print(f"  -> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--scale", type=int, default=4)
    ap.add_argument("--face-enhance", action="store_true",
                    help="GFPGAN face restore (OFF by default — re-airbrushes skin)")
    args = ap.parse_args()
    run(args.image, args.out, scale=args.scale, face_enhance=args.face_enhance)
