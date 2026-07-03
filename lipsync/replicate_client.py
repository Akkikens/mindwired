#!/usr/bin/env python3
"""Lip-sync via Replicate (pay-per-second, no VM to manage/forget).
Recommended over the raw GCP VM kit (Dockerfile/server.py/client.py) — same
SadTalker-quality output, but you pay cents per run instead of per VM-hour,
and there's no idle-billing risk since nothing stays "on" between runs.

Requires: pip install replicate
Env: REPLICATE_API_TOKEN=... in mindwired/.env (or exported)

Usage:
  python3 lipsync/replicate_client.py --image public/host/orion.png \\
      --audio public/shorts/neutronstar/audio/hook.mp3 \\
      --out lipsync/out/hook_talking.mp4
"""
import argparse
import os
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# Model to run on Replicate. IMPORTANT: fill this in yourself before first run —
# go to the model's page on replicate.com (e.g. replicate.com/lucataco/sync-lipsync
# or replicate.com/cjwbw/sadtalker), click "API", and copy the exact
# "owner/model:version_hash" string shown there. Do not guess a hash here —
# Replicate requires the real current version id and it changes over time.
MODEL = os.environ.get("REPLICATE_LIPSYNC_MODEL", "")


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


def run(image: Path, audio: Path, out: Path):
    try:
        import replicate
    except ImportError:
        sys.exit("pip install replicate")

    os.environ["REPLICATE_API_TOKEN"] = load_token()
    if not MODEL:
        sys.exit("Set REPLICATE_LIPSYNC_MODEL (or edit MODEL in this file) to the exact "
                 "'owner/model:version' string from the model's page on replicate.com/explore "
                 "— search 'lipsync' or 'sadtalker' and copy it from the API tab.")
    out.parent.mkdir(parents=True, exist_ok=True)

    print(f"  lip-syncing {audio.name} onto {image.name} via Replicate...")
    output = replicate.run(
        MODEL,
        input={
            "face": open(image, "rb"),
            "audio": open(audio, "rb"),
        },
    )
    # replicate.run returns a FileOutput or URL depending on model version
    url = output if isinstance(output, str) else getattr(output, "url", None) or str(output)
    import urllib.request
    urllib.request.urlretrieve(url, out)
    print(f"  -> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    run(args.image, args.audio, args.out)
