#!/usr/bin/env bash
# Retry wrapper around render_gce.sh for transient "NO CAPACITY" failures.
#
#   scripts/render_gce_retry.sh <CompId> <slug> [render args…]
#
# render_gce.sh walks a ladder of 32-core machines/zones and gives up if every
# one is full. That happens (observed 2026-08-03: capacity vanished region-wide
# minutes after the same script had created VMs happily). This wrapper retries
# with backoff and, after the first couple of attempts, drops to 16-core types —
# slower per render but far more likely to be available, and still a cloud box
# rather than the user's laptop.
#
# Stops immediately once out/<slug>_gce.mp4 exists, and never runs more than
# MAX_ATTEMPTS creations so a capacity outage can't spin VMs forever.
set -uo pipefail

COMP="${1:?usage: render_gce_retry.sh <CompId> <slug> [args…]}"
SLUG="${2:?usage: render_gce_retry.sh <CompId> <slug> [args…]}"
shift 2
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$REPO_DIR/out/${SLUG}_gce.mp4"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-8}"
SLEEP_S="${RETRY_SLEEP:-180}"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if [ -s "$OUT" ]; then
    echo "[retry] ${SLUG}: master already present — nothing to do"
    exit 0
  fi
  # attempts 1-2: the default 32-core ladder. 3+: 16-core (much better availability)
  if [ "$attempt" -ge 3 ]; then
    export GCE_MACHINE="c2d-highcpu-16"
    export GCE_CONCURRENCY="${GCE_CONCURRENCY_16:-8}"
    echo "[retry] ${SLUG}: attempt ${attempt} — falling back to 16-core"
  else
    echo "[retry] ${SLUG}: attempt ${attempt} — 32-core ladder"
  fi

  bash "$REPO_DIR/scripts/render_gce.sh" "$COMP" "$SLUG" "$@"
  rc=$?

  if [ -s "$OUT" ]; then
    echo "[retry] ${SLUG}: SUCCESS on attempt ${attempt} -> out/${SLUG}_gce.mp4"
    exit 0
  fi
  echo "[retry] ${SLUG}: attempt ${attempt} failed (rc=${rc}); sleeping ${SLEEP_S}s"
  sleep "$SLEEP_S"
done

echo "[retry] ${SLUG}: gave up after ${MAX_ATTEMPTS} attempts — no cloud capacity"
exit 1
