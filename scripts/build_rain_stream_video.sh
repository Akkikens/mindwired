#!/usr/bin/env bash
# Assemble the final broadcast file for the 24/7 space-rain sleep stream.
#
#   video: out/rainstream_loop.mp4        (60s seamless Remotion loop, 1080p)
#   audio: out/rain_stream_bed_3h.mp3     (3h evolving rain + Buckley music)
#   ->     out/rain_stream_final.mp4      (3h, 1080p30, encoded ONCE)
#
# Everything is encoded here, once, so the live VM can run pure passthrough
# (see rain_restream.sh) — that's what keeps the stream on a small VM.
#
# 1080p @ ~4.5 Mbps is deliberate (Akshay, 2026-08-01): at 24/7 the egress
# bill dominates, and 4K on a dark slow rain scene buys almost nothing.
#
# Usage: scripts/build_rain_stream_video.sh [loop.mp4] [audio.mp3] [out.mp4]
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOOP="${1:-$REPO/out/rainstream_loop.mp4}"
AUDIO="${2:-$REPO/out/rain_stream_bed_3h.mp3}"
OUT="${3:-$REPO/out/rain_stream_final.mp4}"
BITRATE="${BITRATE:-4500k}"   # 3000k is plenty for this dark slow scene; cuts egress ~1/3
SCALE="${SCALE:-1920:1080}"   # 1280:720 halves egress again; fine for a dark ambient scene
FPS="${FPS:-30}"              # 24 trims a little more; the visual barely moves either way

[ -f "$LOOP" ]  || { echo "missing video loop: $LOOP"; exit 1; }
[ -f "$AUDIO" ] || { echo "missing audio bed: $AUDIO"; exit 1; }

AUD_SEC=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AUDIO")
echo "[build] audio ${AUD_SEC}s — tiling the 60s visual loop to match"

# -stream_loop -1 on the video + -shortest ends exactly at the audio length.
# GOP 60 (2s) with keyframes aligned is what YouTube Live wants for clean
# segmenting; CBR-ish via maxrate/bufsize so the passthrough push is smooth.
ffmpeg -y \
  -stream_loop -1 -i "$LOOP" \
  -i "$AUDIO" \
  -map 0:v:0 -map 1:a:0 -shortest \
  -c:v libx264 -preset medium -profile:v high -level 4.1 \
  -b:v "$BITRATE" -maxrate "$BITRATE" -bufsize 9000k \
  -vf "scale=$SCALE" \
  -pix_fmt yuv420p -r "$FPS" -g $((FPS*2)) -keyint_min $((FPS*2)) -sc_threshold 0 \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  "$OUT"

echo "[build] done -> $OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 "$OUT"
