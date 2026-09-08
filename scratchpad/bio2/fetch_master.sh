#!/usr/bin/env bash
# The GCE orchestrator died on an expired auth token while the render carried on.
# Poll the surviving VM, fetch the master when it appears, then delete the VM.
set -uo pipefail
VM=render-biosphere2-3243; ZONE=us-central1-f; R="~/mindwired/out"
cd ~/Documents/GitHub/mindwired
for i in $(seq 1 90); do
  out=$(gcloud compute ssh "$VM" --zone="$ZONE" --tunnel-through-iap --command \
        "ls -1 $R/biosphere2.mp4 2>/dev/null; tail -1 $R/render.log" 2>/dev/null)
  echo "[poll $i] $(echo "$out" | tail -1)"
  if echo "$out" | grep -q 'biosphere2.mp4'; then
    echo "MASTER EXISTS — fetching"
    gcloud compute scp --tunnel-through-iap --zone="$ZONE" \
      "$VM:$R/biosphere2.mp4" out/biosphere2_gce.mp4 && echo "FETCHED"
    ls -lh out/biosphere2_gce.mp4
    gcloud compute instances delete "$VM" --zone="$ZONE" --quiet && echo "VM DELETED"
    exit 0
  fi
  if echo "$out" | grep -qiE 'FATAL|render failed|Traceback'; then
    echo "REMOTE FAILURE DETECTED"; echo "$out"; exit 1
  fi
  sleep 60
done
echo "TIMED OUT after 90 minutes — VM left alive deliberately, do not lose it"; exit 2
