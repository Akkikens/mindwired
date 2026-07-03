#!/usr/bin/env python3
"""Lip-sync via Replicate (pay-per-second, no VM to manage/forget).
Recommended over the raw GCP VM kit (Dockerfile/server.py/client.py) — same
SadTalker-quality output, but you pay cents per run instead of per VM-hour,
and there's no idle-billing risk since nothing stays "on" between runs.

Model: cjwbw/sadtalker — takes a still portrait + audio, outputs a talking
head video with natural head motion. (sync/lipsync-2 was considered but needs
an existing video as input, not a still photo, so it doesn't fit this use case.)

Requires: pip install replicate  (repo venv: .venv-lipsync)
Env: REPLICATE_API_TOKEN=... in mindwired/.env

Usage:
  python3 lipsync/replicate_client.py --image public/host/orion.png \\
      --audio public/shorts/neutronstar/audio/hook.mp3 \\
      --out lipsync/out/hook_talking.mp4
"""
import argparse
import os
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# Verified live via `client.models.get("cjwbw/sadtalker").latest_version` on
# 2026-07-03 — Replicate version hashes do change over time; if this run ever
# 404s, re-fetch the current hash the same way (see lipsync/README.md) rather
# than guessing.
MODEL = os.environ.get(
    "REPLICATE_LIPSYNC_MODEL",
    "cjwbw/sadtalker:a519cc0cfebaaeade068b23899165a11ec76aaa1d2b313d40d214f204ec957a3",
)


def load_token() -> str:
    if os.environ.get("REPLICATE_API_TOKEN"):
        return os.environ["REPLICATE_API_TOKEN"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("REPLICATE_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("REPLICATE_API_TOKEN not set — get one at replicate.com/account/api-tokens "
             "and add it to mindwired/.env")


def run(image: Path, audio: Path, out: Path, still: bool = True, enhance: bool = False):
    try:
        import replicate
    except ImportError:
        sys.exit("pip install replicate  (or: source .venv-lipsync/bin/activate)")

    os.environ["REPLICATE_API_TOKEN"] = load_token()
    out.parent.mkdir(parents=True, exist_ok=True)

    print(f"  lip-syncing {audio.name} onto {image.name} via Replicate ({MODEL.split(':')[0]})...")
    output = replicate.run(
        MODEL,
        input={
            "source_image": open(image, "rb"),
            "driven_audio": open(audio, "rb"),
            "preprocess": "full",       # keep the full framing (desk/mic/nebula), not a tight face crop
            "still_mode": still,        # natural, minimal head motion — calmer documentary-host look
            "use_enhancer": enhance,    # GFPGAN sharpening — costs more render time, off by default
        },
    )
    url = output if isinstance(output, str) else getattr(output, "url", None) or str(output)
    urllib.request.urlretrieve(url, out)
    print(f"  -> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--no-still", action="store_true", help="allow more expressive head motion")
    ap.add_argument("--enhance", action="store_true", help="GFPGAN face enhancer (slower, sharper)")
    args = ap.parse_args()
    run(args.image, args.audio, args.out, still=not args.no_still, enhance=args.enhance)
