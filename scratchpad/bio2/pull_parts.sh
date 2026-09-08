#!/usr/bin/env bash
# Pull the 13 split parts with per-part retries, reassemble, verify md5.
cd ~/Documents/GitHub/mindwired
VM=render-biosphere2-3243; ZONE=us-central1-f; D=out/_bio2parts
EXPECT=c3759978ae7d7a37a4f97220400cdb99
for i in $(seq -w 0 12); do
  f="part_$i"
  if [ -f "$D/$f" ] && [ "$(stat -f%z "$D/$f" 2>/dev/null)" -gt 0 ]; then
    echo "[$f] already present ($(stat -f%z "$D/$f") bytes) — skipping"; continue
  fi
  for try in 1 2 3 4 5; do
    echo "[$f] attempt $try"
    if gcloud compute scp --tunnel-through-iap --zone="$ZONE" \
         "$VM:~/mindwired/out/$f" "$D/$f" 2>/dev/null; then
      echo "[$f] OK ($(stat -f%z "$D/$f") bytes)"; break
    fi
    echo "[$f] failed, retrying"; rm -f "$D/$f"; sleep 10
  done
  [ -f "$D/$f" ] || { echo "[$f] GAVE UP after 5 tries"; exit 1; }
done
echo "=== all parts down — reassembling ==="
cat "$D"/part_* > out/biosphere2_gce.mp4
echo "=== verifying ==="
GOT=$(md5 -q out/biosphere2_gce.mp4)
echo "expected: $EXPECT"
echo "got:      $GOT"
if [ "$GOT" = "$EXPECT" ]; then
  echo "✅ MD5 MATCH — master intact"
  rm -rf "$D"
  ls -lh out/biosphere2_gce.mp4
else
  echo "❌ MD5 MISMATCH — do NOT use this file"; exit 1
fi
