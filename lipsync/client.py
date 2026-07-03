#!/usr/bin/env python3
"""Client for the GCP-hosted SadTalker lip-sync service (see lipsync/README.md).

Usage:
  python3 lipsync/client.py \\
      --image public/host/orion.png \\
      --audio public/shorts/neutronstar/audio/hook.mp3 \\
      --out lipsync/out/hook_talking.mp4 \\
      --url https://<your-cloud-run-or-vm-url>

Set LIPSYNC_URL in .env to skip --url. Retries once on 5xx (cold GPU/model load).
"""
import argparse
import os
import sys
import time
from pathlib import Path

import requests

REPO = Path(__file__).resolve().parent.parent


def load_url() -> str:
    if os.environ.get("LIPSYNC_URL"):
        return os.environ["LIPSYNC_URL"].rstrip("/")
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("LIPSYNC_URL="):
                return line.split("=", 1)[1].strip().strip('"').rstrip("/")
    sys.exit("LIPSYNC_URL not set (pass --url or add LIPSYNC_URL=... to .env)")


def run(image: Path, audio: Path, out: Path, url: str, still: bool = True):
    out.parent.mkdir(parents=True, exist_ok=True)
    files = {"image": open(image, "rb"), "audio": open(audio, "rb")}
    params = {"still": str(still).lower()}
    for attempt in range(2):
        try:
            r = requests.post(f"{url}/lipsync", files=files, params=params, timeout=600)
            if r.status_code == 200:
                out.write_bytes(r.content)
                print(f"  -> {out} ({len(r.content)/1e6:.1f} MB)")
                return
            print(f"  attempt {attempt+1} failed: {r.status_code} {r.text[:300]}")
        except requests.exceptions.RequestException as e:
            print(f"  attempt {attempt+1} network error: {e}")
        time.sleep(5)
        files = {"image": open(image, "rb"), "audio": open(audio, "rb")}  # re-open, streams consumed
    sys.exit(f"lipsync failed for {audio.name} after 2 attempts")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--url", default=None)
    ap.add_argument("--no-still", action="store_true", help="allow more head motion")
    args = ap.parse_args()
    run(args.image, args.audio, args.out, args.url or load_url(), still=not args.no_still)
