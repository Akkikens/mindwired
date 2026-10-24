#!/bin/sh
# Render every built scene to its own MP4 in out/scene-kit/ (repo-root `out/` is gitignored).
#   scripts/render-all.sh [episode] [resolution] [quality] [channel]
# channel defaults to the doc spec's "channel" (build.mjs resolves it); pass one to override.
# Defaults: episode=helios522, resolution=landscape-4k (3840x2160 from the 1920x1080 comp, like
# DocWide's --scale 2), quality=delivery. fps is pinned to 30 to match DocWide.
set -e
cd "$(dirname "$0")/.."
EP="${1:-helios522}"; RES="${2:-landscape-4k}"; Q="${3:-delivery}"; CH="${4:-}"
OUT="../out/scene-kit"; mkdir -p "$OUT"
node scripts/build.mjs --episode "$EP" ${CH:+--channel "$CH"} >/dev/null
# Render exactly what this build produced (build.mjs writes the list), not whatever sits in scenes/.
LIST=".hyperframes/built-$EP.json"
NAMES="$(node -e 'const b=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); console.error(`channel ${b.channel} (${b.accent})`); console.log(b.scenes.join("\n"))' "$LIST")"
for n in $NAMES; do
  f="scenes/$n.html"
  echo "== $n"
  ./scripts/hf render --composition "$f" --resolution "$RES" --fps 30 --quality "$Q" --output "$OUT/$EP-$n.mp4" 2>&1 | grep -E "MB|capture|Error|error" || true
done
for n in $NAMES; do
  m="$OUT/$EP-$n.mp4"
  printf '%s  ' "$(basename "$m")"; ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0 "$m" | tr '\n' ' '; echo
done
