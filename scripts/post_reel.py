#!/usr/bin/env python3
"""Post a rendered vertical mp4 to Instagram Reels via Meta's official
Content Publishing API — video_url flow (a public URL, NOT resumable byte
upload). Confirmed 2026-07-06: the API now rejects container creation with
"video_url is required" even when upload_type=resumable is set — the
resumable/direct-byte-upload path this script originally used no longer
works, at least not for this app/account. Since Instagram's servers need to
fetch the file over HTTP, this script uploads it to a public GCS bucket
first (gs://kickoffdaily90-reels-tmp), then passes that URL.

One-time setup (see REELS-SETUP.md): Instagram Professional (Creator/Business)
account + a Meta app + a long-lived access token with instagram_business_
content_publish. Put in .env:
  IG_USER_ID=<your instagram user id>
  IG_ACCESS_TOKEN=<long-lived token>

Requires: gcloud CLI authenticated with access to the GCS bucket (created
one-time via `gsutil mb` + `gsutil iam ch allUsers:objectViewer`).

Usage:
  python3 scripts/post_reel.py --video out/kickoffdaily90_short_x.mp4 \
      --caption "Portugal vs Spain is a FINAL in disguise 😤 #WorldCup2026 ..." \
      [--share-to-feed] [--thumb-offset-ms 1500]

Flow: (1) upload the file to the public GCS bucket, (2) create a REELS media
container with video_url pointing at it, (3) poll the container status until
FINISHED, (4) publish. Reels specs: 9:16, ≤15 min, mp4/mov.
"""
import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
GRAPH = "https://graph.instagram.com/v21.0"
GCS_BUCKET = "kickoffdaily90-reels-tmp"


def load_env(key: str) -> str:
    if os.environ.get(key):
        return os.environ[key]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit(f"{key} not set — see REELS-SETUP.md for the one-time setup")


def upload_to_gcs(video: Path) -> str:
    dest = f"gs://{GCS_BUCKET}/{video.name}"
    subprocess.run(["gsutil", "cp", str(video), dest], check=True)
    url = f"https://storage.googleapis.com/{GCS_BUCKET}/{video.name}"
    r = httpx.head(url, timeout=30)
    if r.status_code != 200:
        sys.exit(f"uploaded but not publicly fetchable ({r.status_code}) — "
                  f"check bucket IAM: gsutil iam ch allUsers:objectViewer gs://{GCS_BUCKET}")
    print(f"  uploaded -> {url}")
    return url


def post_reel(video: Path, caption: str, share_to_feed: bool = True,
              thumb_offset_ms: int | None = None):
    user_id = load_env("IG_USER_ID")
    token = load_env("IG_ACCESS_TOKEN")

    # 1) public-host the file, then create container pointing at it
    video_url = upload_to_gcs(video)
    params = {"media_type": "REELS", "video_url": video_url,
              "caption": caption, "share_to_feed": str(share_to_feed).lower(),
              "access_token": token}
    if thumb_offset_ms is not None:
        params["thumb_offset"] = str(thumb_offset_ms)
    r = httpx.post(f"{GRAPH}/{user_id}/media", params=params, timeout=60)
    if r.status_code != 200:
        sys.exit(f"container create failed {r.status_code}: {r.text[:400]}")
    container_id = r.json()["id"]
    print(f"  container {container_id}")

    # 2) poll processing
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
