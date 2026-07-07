#!/usr/bin/env bash
# 24/7 supervisor for the kickoffdaily90 stats loop → YouTube Live.
# Each outer iteration streams the CURRENT out/wc_live_loop.mp4 start-to-finish
# (~2.5 min), then loops. Because it reopens the file fresh every iteration
# (not ffmpeg's -stream_loop, which keeps one fd open), a hot-swap from
# wc_check_and_refresh.py is picked up on the next lap without restarting the
# whole stream key/session — only a fast reconnect between laps.
#
# Direct -c:v copy passthrough of the vertical (1080x1920) source — NO
# re-encode, NO pillarbox. Tried 1080p and 720p pillarbox (static-bg overlay
# + libx264) first; both pegged the e2-small's burstable 2 vCPU near/at 100%
# and YouTube reported "not receiving enough video to maintain smooth
# streaming" (buffering) within a couple minutes — the box can't sustain
# real-time encoding at all, only remuxing. This is why: no libx264 work,
# just container repackaging, near-zero CPU. Trade-off: stream is vertical
# only, no 16:9 pillarbox, no YouTube auto-crop-to-Shorts. Revisit pillarbox
# only after resizing to a dedicated-vCPU machine type (e.g. e2-standard-2).
#
# Takes the loop file as $1 (defaults to out/wc_live_loop.mp4) so the same
# script drives all 3 concurrent streams — YouTube allows up to 3 active
# streams per stream key, so all 3 reuse the same YOUTUBE_STREAM_KEY:
#   wc_restream.sh                              (stream 1: vertical stats loop)
#   wc_restream.sh out/wc_live_loop_wide.mp4     (stream 2: 16:9 widescreen)
#   wc_restream.sh out/wc_goldenboot_ticker.mp4  (stream 3: Golden Boot ticker)
#
# Requires: YOUTUBE_STREAM_KEY env var (from YouTube Studio > Go Live > Stream).
# Usage: nohup scripts/wc_restream.sh [file] > /tmp/wc_restream.log 2>&1 &

set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="${1:-$REPO/out/wc_live_loop.mp4}"
RTMP_URL="rtmp://a.rtmp.youtube.com/live2/${YOUTUBE_STREAM_KEY:?set YOUTUBE_STREAM_KEY}"

echo "[restream] starting supervisor, pushing $FILE -> YouTube Live (vertical passthrough, no re-encode)"

while true; do
  if [ ! -f "$FILE" ]; then
    echo "[restream] $FILE missing, waiting 5s..."
    sleep 5
    continue
  fi
  echo "[restream] $(date '+%H:%M:%S') lap start"
  ffmpeg -nostdin -re -i "$FILE" \
    -c:v copy -c:a copy \
    -f flv "$RTMP_URL" \
    -v warning
  status=$?
  echo "[restream] $(date '+%H:%M:%S') lap ended (exit $status), reconnecting"
  sleep 1
done
