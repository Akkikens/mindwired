#!/bin/zsh
# DimaagBatti 24/7 live loop — stream-copies the playlist to YouTube Live.
# No re-encode (files are already YT-ready h264/aac); auto-restarts on drop.
# Key lives in .env (DIMAAGBATTI_STREAM_KEY). Logs: /tmp/dimaagbatti_live.log
cd "$(dirname "$0")/.."
export $(grep DIMAAGBATTI_STREAM_KEY .env)
while true; do
  ffmpeg -hide_banner -loglevel warning -re \
    -f concat -safe 0 -stream_loop -1 -i scripts/dimaagbatti_live_playlist.txt \
    -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/${DIMAAGBATTI_STREAM_KEY}" \
    >> /tmp/dimaagbatti_live.log 2>&1
  echo "$(date) stream dropped (exit $?), restarting in 10s" >> /tmp/dimaagbatti_live.log
  sleep 10
done
