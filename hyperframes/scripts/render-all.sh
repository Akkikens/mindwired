#!/bin/sh
# Render every built scene to its own MP4 in out/scene-kit/ (repo-root `out/` is gitignored).
#   scripts/render-all.sh [episode] [resolution] [quality]
# Defaults: episode=helios522, resolution=landscape-4k (3840x2160 from the 1920x1080 comp, like
# DocWide's --scale 2), quality=delivery. fps is pinned to 30 to match DocWide.
set -e
cd "$(dirname "$0")/.."
EP="${1:-helios522}"; RES="${2:-landscape-4k}"; Q="${3:-delivery}"
OUT="../out/scene-kit"; mkdir -p "$OUT"
node scripts/build.mjs --episode "$EP" >/dev/null
for f in scenes/*.html; do
  n="$(basename "$f" .html)"
  echo "== $n"
  ./scripts/hf render --composition "$f" --resolution "$RES" --fps 30 --quality "$Q" --output "$OUT/$EP-$n.mp4" 2>&1 | grep -E "MB|capture|Error|error" || true
done
for m in "$OUT"/"$EP"-*.mp4; do
  printf '%s  ' "$(basename "$m")"; ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0 "$m" | tr '\n' ' '; echo
done
