#!/usr/bin/env bash
# 24/7 supervisor for mindwired's "space rain" sleep stream -> YouTube Live.
#
# DELIBERATELY PASSTHROUGH (-c:v copy -c:a copy). Unlike the retired
# mindwired_restream.sh, this stream has NO live overlay (Akshay dropped the
# Super Chat spotlight, 2026-08-01: "i dont want real superchats to be shown
# atleast this time in video so we can keep the compute less"). With nothing
# to draw per-frame there is nothing to encode — ffmpeg just remuxes an
# already-encoded file to RTMP. Consequences:
#   * CPU is ~2-5% instead of ~190% — the overload that plagued the old
#     stream is structurally gone, not merely tuned around.
#   * A small shared-core VM (e2-small) is sufficient; no 4-vCPU box needed.
#   * The source file MUST already be exactly what we want on air:
#     1080p30, yuv420p, ~4.5 Mbps CBR-ish, AAC 128k 44.1kHz. build the file
#     with scripts/build_rain_stream_video.sh, not here.
#
# 1080p, not 4K (Akshay's call, 2026-08-01): at 24/7 the egress bill is the
# real cost driver — ~1.5 TB/mo at 1080p vs ~4.9 TB/mo at 4K, for a dark slow
# scene most viewers watch on a phone or in a background tab.
#
# Requires: MINDWIRED_STREAM_KEY in the environment (systemd EnvironmentFile).
# Usage: nohup scripts/rain_restream.sh [file] > /tmp/rain_restream.log 2>&1 &

set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="${1:-$REPO/out/rain_stream_final.mp4}"
RTMP_URL="rtmp://a.rtmp.youtube.com/live2/${MINDWIRED_STREAM_KEY:?set MINDWIRED_STREAM_KEY}"

echo "[rain] supervisor starting — passthrough (no re-encode), source: $FILE"

while true; do
  if [ ! -f "$FILE" ]; then
    echo "[rain] $FILE missing, waiting 15s…"
    sleep 15
    continue
  fi
  echo "[rain] $(date '+%F %H:%M:%S') starting continuous push (input loops internally)"
  # -stream_loop -1 keeps ONE ffmpeg process and ONE RTMP session alive across
  # loops. The retired script relaunched ffmpeg per lap, and one of those
  # reconnects made YouTube end the broadcast and mint a new video ID — the
  # bug that broke the Super Chat watcher twice. Never go back to per-lap relaunch.
  ffmpeg -nostdin -re -stream_loop -1 -i "$FILE" \
    -c:v copy -c:a copy \
    -f flv "$RTMP_URL" \
    -v warning
  status=$?
  echo "[rain] $(date '+%F %H:%M:%S') ffmpeg exited ($status) — should only happen on a real error; retrying in 5s"
  sleep 5
done
