#!/usr/bin/env bash
# 24/7 supervisor for mindwired's calm-space-facts stream -> YouTube Live,
# WITH the live "Supporter Spotlight" overlay (unlike kickoffdaily90's
# wc_restream.sh, which stays pure -c:v copy because its e2-small VM can't
# sustain a real encode — see that script's own comments). This stream runs
# on a DEDICATED e2-standard-2 VM (mindwired-stream) specifically so it CAN
# afford a real libx264 encode for the drawtext overlay.
#
# The whole card (kicker/name/amount/message) is ONE drawtext filter reading
# ONE text file (public/live/supporter_card.txt) with reload=1 — when
# scripts/superchat_watcher.py clears that file to empty, the box+text both
# vanish as a single unit; no separate PNG, no leftover empty frame between
# shoutouts. See SupporterSpotlight.tsx for the "canonical" designed version
# of this card (used for one-off preview renders) — this drawtext block is
# the live, low-moving-parts equivalent of that design.
#
# Requires: MINDWIRED_STREAM_KEY env var. Usage:
#   nohup scripts/mindwired_restream.sh [file] > /tmp/mindwired_restream.log 2>&1 &

set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="${1:-$REPO/out/sleepspacefacts_final.mp4}"
CARD_FILE="$REPO/public/live/supporter_card.txt"
RTMP_URL="rtmp://a.rtmp.youtube.com/live2/${MINDWIRED_STREAM_KEY:?set MINDWIRED_STREAM_KEY}"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

mkdir -p "$(dirname "$CARD_FILE")"
[ -f "$CARD_FILE" ] || : > "$CARD_FILE"

# lower-third-right card box, sized to comfortably fit the 6-line block
# (kicker / blank / name / amount / blank / "message") at fontsize=28
# 1080p, restored once the VM moved from e2-standard-2 -> e2-standard-4.
# The 720p downscale was a workaround for CPU exhaustion on the smaller box
# (100% system CPU, load avg >4 on 2 cores) — with 4 vCPUs the same encode
# runs at ~35% total CPU, load avg <1, plenty of headroom for full 1080p.
SCALE="scale=1920:1080"
DRAWTEXT="drawtext=textfile=${CARD_FILE}:reload=1:fontfile=${FONT}:fontsize=28:fontcolor=white:line_spacing=10:box=1:boxcolor=0x05070CCC:boxborderw=24:bordercolor=0x4DD8FF:borderw=2:x=w-tw-90:y=h-th-110"

echo "[restream] starting supervisor, pushing $FILE -> YouTube Live (encoded, Supporter Spotlight overlay live)"

while true; do
  if [ ! -f "$FILE" ]; then
    echo "[restream] $FILE missing, waiting 5s..."
    sleep 5
    continue
  fi
  echo "[restream] $(date '+%H:%M:%S') starting continuous encode (input loops internally, RTMP connection never drops)"
  ffmpeg -nostdin -re -stream_loop -1 -i "$FILE" \
    -vf "${SCALE},${DRAWTEXT}" \
    -c:v libx264 -preset superfast -tune zerolatency -x264-params "nal-hrd=cbr" \
    -b:v 4500k -maxrate 4500k -bufsize 4500k \
    -pix_fmt yuv420p -g 60 -r 30 \
    -c:a aac -b:a 128k -ar 44100 \
    -f flv "$RTMP_URL" \
    -v warning
  status=$?
  echo "[restream] $(date '+%H:%M:%S') encoder exited (status $status) — this should only happen on a real error, not a normal loop; reconnecting"
  sleep 1
done
