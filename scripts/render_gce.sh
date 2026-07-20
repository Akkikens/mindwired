#!/usr/bin/env bash
# Cloud render box — burst a GCE Spot VM, render a comp at 4K, fetch the master,
# delete the VM (2026-07-20, "no CPU load" render path).
#
#   scripts/render_gce.sh <CompId> <slug> [extra render_and_master args...]
#   e.g. scripts/render_gce.sh TenerifeDoc tenerife \
#          --music public/beds/doc_tension.mp3 --windows tenerife --music-gain-db -20
#
# What it does:
#   1. creates a c2d-standard-32 SPOT VM (32 AMD cores, ~$0.4-0.7/hr spot)
#   2. rsyncs ONLY what the render needs (src/, scripts/, package files,
#      public/{fonts,sfx,mascot,outro,beds,shorts/<slug>})
#   3. installs node22 + pnpm + ffmpeg + chrome deps, pnpm install
#   4. runs render_and_master.py --scale 2 (4K) remotely under nohup
#   5. polls until done, scps the mp4 back to out/<slug>_gce.mp4
#   6. ALWAYS deletes the VM on exit (trap), success or failure
#
# Requirements: gcloud authed (project set), billing enabled, Compute API on.
# Run detached locally (nohup ... &) — total wall time ≈ setup ~6min + render.
set -euo pipefail

COMP="${1:?usage: render_gce.sh <CompId> <slug> [render args...]}"
SLUG="${2:?usage: render_gce.sh <CompId> <slug> [render args...]}"
shift 2
EXTRA_ARGS=("$@")

ZONE="${GCE_ZONE:-us-central1-a}"
MACHINE="${GCE_MACHINE:-c2d-standard-32}"
NAME="render-${SLUG}-$(date +%s | tail -c 5)"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE=mindwired

cleanup() {
  echo "[gce] deleting VM ${NAME}…"
  gcloud compute instances delete "$NAME" --zone "$ZONE" --quiet 2>/dev/null || true
}
trap cleanup EXIT

echo "[gce] creating spot VM ${NAME} (${MACHINE}, ${ZONE})…"
gcloud compute instances create "$NAME" \
  --zone "$ZONE" --machine-type "$MACHINE" \
  --provisioning-model=SPOT --instance-termination-action=DELETE \
  --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud \
  --boot-disk-size=120GB --boot-disk-type=pd-ssd

echo "[gce] waiting for SSH…"
for i in $(seq 1 30); do
  gcloud compute ssh "$NAME" --zone "$ZONE" --command "true" 2>/dev/null && break
  sleep 10
done

echo "[gce] installing node/ffmpeg/chrome deps…"
gcloud compute ssh "$NAME" --zone "$ZONE" --command "
  set -e
  sudo apt-get update -qq
  sudo apt-get install -y -qq ffmpeg rsync python3 curl \
    libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libasound2t64 libpango-1.0-0 libcairo2 > /dev/null
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - > /dev/null
  sudo apt-get install -y -qq nodejs > /dev/null
  node --version && ffmpeg -version | head -1
"

echo "[gce] syncing project (selective)…"
RSYNC_RSH="$(gcloud compute ssh "$NAME" --zone "$ZONE" --dry-run 2>/dev/null | sed 's/ [^ ]*$//')"
# use gcloud's own ssh wrapper for rsync transport
tar czf /tmp/render_src.tgz -C "$REPO_DIR" \
  package.json pnpm-lock.yaml tsconfig.json remotion.config.ts src scripts \
  public/fonts public/sfx public/mascot public/outro public/beds \
  "public/shorts/${SLUG}" 2>/dev/null || \
tar czf /tmp/render_src.tgz -C "$REPO_DIR" \
  package.json pnpm-lock.yaml tsconfig.json src scripts \
  public/fonts public/sfx public/mascot public/outro public/beds \
  "public/shorts/${SLUG}"
gcloud compute scp /tmp/render_src.tgz "$NAME":~/render_src.tgz --zone "$ZONE"
rm -f /tmp/render_src.tgz

echo "[gce] installing deps + starting render…"
gcloud compute ssh "$NAME" --zone "$ZONE" --command "
  set -e
  mkdir -p $REMOTE && cd $REMOTE && tar xzf ~/render_src.tgz
  rm -f pnpm-lock.yaml
  # npm (not pnpm): runs postinstall build scripts non-interactively, so the
  # esbuild/chrome binaries actually land (pnpm v10 silently skips them)
  npm install --no-audit --no-fund 2>&1 | tail -4
  ls node_modules/.bin/remotion || { echo INSTALL_BROKEN; exit 1; }
  npx remotion browser ensure 2>&1 | tail -2
  mkdir -p out
  nohup python3 scripts/render_and_master.py '$COMP' out/${SLUG}.mp4 --scale 2 ${EXTRA_ARGS[*]} \
    > out/render.log 2>&1 &
  echo started
"

echo "[gce] render running — polling every 2 min…"
while true; do
  sleep 120
  STATUS=$(gcloud compute ssh "$NAME" --zone "$ZONE" --command "
    if grep -q -- '-> out/${SLUG}.mp4' $REMOTE/out/render.log 2>/dev/null; then echo DONE;
    elif grep -qiE 'Traceback|render failed|GATE FAILED' $REMOTE/out/render.log 2>/dev/null; then echo FAILED;
    else grep -oE 'Rendered [0-9]+/[0-9]+' $REMOTE/out/render.log | tail -1; fi" 2>/dev/null || echo "ssh-retry")
  echo "[gce] $(date +%H:%M) ${STATUS}"
  [ "$STATUS" = "DONE" ] && break
  if [ "$STATUS" = "FAILED" ]; then
    echo "[gce] FAILURE DIAGNOSTICS:"
    gcloud compute ssh "$NAME" --zone "$ZONE" --command "
      tail -40 $REMOTE/out/render.log
      echo '--- npm debug (if any):'
      tail -30 ~/.npm/_logs/*.log 2>/dev/null | tail -30" || true
    exit 1
  fi
done

echo "[gce] fetching master…"
gcloud compute scp "$NAME":~/$REMOTE/out/${SLUG}.mp4 "$REPO_DIR/out/${SLUG}_gce.mp4" --zone "$ZONE"
gcloud compute ssh "$NAME" --zone "$ZONE" --command "tail -4 $REMOTE/out/render.log"
echo "[gce] done -> out/${SLUG}_gce.mp4 (VM auto-deletes now)"
