#!/usr/bin/env python3
"""Post a rendered vertical mp4 to Instagram Reels via Meta's official
Content Publishing API (resumable upload — no public hosting needed).

One-time setup (see REELS-SETUP.md): Instagram Professional (Creator/Business)
account + a Meta app + a long-lived access token with instagram_business_
content_publish. Put in .env:
  IG_USER_ID=<your instagram user id>
  IG_ACCESS_TOKEN=<long-lived token>

Usage:
  python3 scripts/post_reel.py --video out/kickoffdaily90_short_x.mp4 \
      --caption "Portugal vs Spain is a FINAL in disguise 😤 #WorldCup2026 ..." \
      [--share-to-feed] [--thumb-offset-ms 1500]

Flow per Meta docs: (1) create a REELS media container in resumable-upload
mode, (2) POST the raw bytes to rupload.facebook.com, (3) poll the container
status until FINISHED, (4) publish. Reels specs: 9:16, ≤15 min, mp4/mov.
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
GRAPH = "https://graph.instagram.com/v21.0"
RUPLOAD = "https://rupload.facebook.com/ig-api-upload/v21.0"


def load_env(key: str) -> str:
    if os.environ.get(key):
        return os.environ[key]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit(f"{key} not set — see REELS-SETUP.md for the one-time setup")


def post_reel(video: Path, caption: str, share_to_feed: bool = True,
              thumb_offset_ms: int | None = None):
    user_id = load_env("IG_USER_ID")
    token = load_env("IG_ACCESS_TOKEN")

    # 1) create container (resumable upload mode)
    params = {"media_type": "REELS", "upload_type": "resumable",
              "caption": caption, "share_to_feed": str(share_to_feed).lower(),
              "access_token": token}
    if thumb_offset_ms is not None:
        params["thumb_offset"] = str(thumb_offset_ms)
    r = httpx.post(f"{GRAPH}/{user_id}/media", params=params, timeout=60)
    if r.status_code != 200:
        sys.exit(f"container create failed {r.status_code}: {r.text[:400]}")
    container_id = r.json()["id"]
    print(f"  container {container_id}")

    # 2) upload bytes
    data = video.read_bytes()
    r = httpx.post(f"{RUPLOAD}/{container_id}",
                   headers={"Authorization": f"OAuth {token}",
                            "offset": "0", "file_size": str(len(data))},
                   content=data, timeout=600)
    if r.status_code != 200 or not r.json().get("success", True):
        sys.exit(f"upload failed {r.status_code}: {r.text[:400]}")
    print(f"  uploaded {len(data)//1024//1024}MB")

    # 3) poll processing
    for _ in range(60):
        time.sleep(5)
        s = httpx.get(f"{GRAPH}/{container_id}",
                      params={"fields": "status_code,status", "access_token": token},
                      timeout=30).json()
        code = s.get("status_code")
        if code == "FINISHED":
            break
        if code == "ERROR":
            sys.exit(f"processing error: {json.dumps(s)[:400]}")
        print(f"  processing... ({code})")
    else:
        sys.exit("timed out waiting for processing — container may still finish; "
                 f"retry publish later with container id {container_id}")

    # 4) publish
    r = httpx.post(f"{GRAPH}/{user_id}/media_publish",
                   params={"creation_id": container_id, "access_token": token}, timeout=60)
    if r.status_code != 200:
        sys.exit(f"publish failed {r.status_code}: {r.text[:400]}")
    print(f"  ✅ published — media id {r.json()['id']}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True, type=Path)
    ap.add_argument("--caption", required=True)
    ap.add_argument("--share-to-feed", action="store_true", default=True)
    ap.add_argument("--thumb-offset-ms", type=int, default=None)
    args = ap.parse_args()
    post_reel(args.video, args.caption, args.share_to_feed, args.thumb_offset_ms)
