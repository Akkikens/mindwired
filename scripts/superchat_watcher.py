#!/usr/bin/env python3
"""24/7 watcher: polls YouTube's live chat for Super Chat / Super Sticker
events on a mindwired live broadcast and writes them out as plain text files
for an ffmpeg `drawtext(reload=1)` filter to pick up live — the
"Supporter Spotlight" feature (see src/mindwired-doc/SupporterSpotlight.tsx
for the matching visual chrome, rendered once as a static overlay PNG that
these text files get drawn on top of).

Why polling + text files, not a fancier compositor: the technical research
this session (memory `mindwired-247-ambient-research`) found ffmpeg
drawtext/overlay fed by a small watcher script is the standard, lowest-
moving-parts architecture for an unattended VM — headless OBS needs a virtual
display + window manager + websocket bridge for no real benefit here.

API: liveChatMessages.list is the real-time path (superChatEvents.list is
only a 30-day historical report, not live). Public read-only data — an API
key is sufficient, no OAuth. Respects the API's own pollingIntervalMillis
rather than hardcoding a poll rate, per the official docs.

Requires: YOUTUBE_DATA_API_KEY env var (or .env). Usage:
    python3 scripts/superchat_watcher.py <video_id>
(<video_id> is the live broadcast's video ID, shown in the Studio "Go Live"
URL — auto-discovery of "whichever broadcast is live right now" is a
possible v2; for the pilot, pass it explicitly.)
"""
from __future__ import annotations

import json
import os
import sys
import threading
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
API = "https://www.googleapis.com/youtube/v3"
ALERT_DIR = REPO / "public" / "live"
CARD_VISIBLE_SECONDS = 18  # how long a supporter's card stays on screen


def _api_key() -> str:
    k = os.environ.get("YOUTUBE_DATA_API_KEY")
    if k:
        return k
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("YOUTUBE_DATA_API_KEY="):
                return line.split("=", 1)[1].strip()
    sys.exit("YOUTUBE_DATA_API_KEY not found. Set the env var or add it to .env")


def _get(url: str, params: dict) -> dict:
    q = urllib.parse.urlencode(params)
    with urllib.request.urlopen(f"{url}?{q}", timeout=15) as r:
        return json.loads(r.read())


def get_live_chat_id(video_id: str, api_key: str) -> str:
    data = _get(f"{API}/videos", {
        "part": "liveStreamingDetails", "id": video_id, "key": api_key,
    })
    items = data.get("items") or []
    if not items:
        sys.exit(f"No video found for id {video_id}")
    chat_id = items[0].get("liveStreamingDetails", {}).get("activeLiveChatId")
    if not chat_id:
        sys.exit(f"Video {video_id} has no active live chat — is it actually live right now?")
    return chat_id


CARD_FILE = ALERT_DIR / "supporter_card.txt"


def _safe(s: str) -> str:
    # drawtext textfile has no real escaping story for ':'/newlines-in-source —
    # keep it to plain readable characters, drop anything that could break the
    # filter graph rather than trying to escape it.
    return "".join(c for c in s if c.isprintable() and c not in ":\\")[:120]


def write_alert(name: str, amount: str, message: str, kind: str) -> None:
    ALERT_DIR.mkdir(parents=True, exist_ok=True)
    kicker = "SUPER CHAT" if kind == "superchat" else "GIFT RECEIVED"
    # one combined block so a single drawtext+box draws (and un-draws) the
    # WHOLE card as one unit — no separate PNG needed, no leftover empty
    # frame sitting on screen between shoutouts.
    lines = [
        f"● {kicker}",
        "",
        _safe(name),
        _safe(amount),
        "",
        f'"{_safe(message)}"',
    ]
    CARD_FILE.write_text("\n".join(lines))
    print(f"[superchat] SHOWING: {name} — {amount} — \"{message}\" ({kind})", flush=True)


def clear_alert() -> None:
    ALERT_DIR.mkdir(parents=True, exist_ok=True)
    CARD_FILE.write_text("")


def handle_event(item: dict) -> None:
    snippet = item.get("snippet", {})
    kind = snippet.get("type")
    author = item.get("authorDetails", {}).get("displayName", "a viewer")

    if kind == "superChatEvent":
        d = snippet.get("superChatDetails", {})
        write_alert(author, d.get("amountDisplayString", ""), d.get("userComment", ""), "superchat")
    elif kind == "superStickerEvent":
        d = snippet.get("superStickerDetails", {})
        write_alert(author, d.get("amountDisplayString", ""), "sent a Super Sticker", "gift")
    else:
        return  # not a Super Chat/Sticker — ignore regular chat messages

    # hide the card again after CARD_VISIBLE_SECONDS, without blocking the poll loop
    threading.Timer(CARD_VISIBLE_SECONDS, clear_alert).start()


def watch(video_id: str) -> None:
    api_key = _api_key()
    live_chat_id = get_live_chat_id(video_id, api_key)
    print(f"[superchat] watching live chat {live_chat_id} for video {video_id}", flush=True)
    clear_alert()

    page_token = None
    while True:
        params = {"liveChatId": live_chat_id, "part": "snippet,authorDetails", "key": api_key}
        if page_token:
            params["pageToken"] = page_token
        try:
            data = _get(f"{API}/liveChat/messages", params)
        except Exception as e:  # noqa: BLE001 — this must never crash the watcher
            print(f"[superchat] poll error (will retry): {e}", flush=True)
            time.sleep(10)
            continue

        for item in data.get("items", []):
            handle_event(item)

        page_token = data.get("nextPageToken")
        # respect the API's own pacing hint rather than hardcoding a poll rate
        wait_ms = data.get("pollingIntervalMillis", 8000)
        time.sleep(max(wait_ms, 2000) / 1000)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python3 scripts/superchat_watcher.py <live_video_id>")
    watch(sys.argv[1])
