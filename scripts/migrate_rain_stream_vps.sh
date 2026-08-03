#!/usr/bin/env bash
# Move the 24/7 rain stream OFF Google Cloud onto a flat-bandwidth VPS.
#
# WHY: the stream is a dumb passthrough — it copies bytes from a file into an
# RTMP socket. It needs ~1 TB/month of egress and almost no CPU. GCP meters
# egress (~$0.12/GB → ~$117-175/mo); budget hosts (Hetzner, Contabo, OVH…)
# INCLUDE ~20 TB with a ~€4-5/mo box. Same job, ~95% cheaper. Compute was
# never the cost — bandwidth was.
#
# PREREQUISITE (you do this once, by hand):
#   1. Create a small VPS (1-2 vCPU, 1-2 GB RAM, >=20 GB disk, generous or
#      unmetered traffic). Ubuntu 22.04/24.04.
#   2. Add your SSH key so `ssh user@host` works without a password.
#   3. Note the host/IP.
#
# THEN:
#   scripts/migrate_rain_stream_vps.sh root@203.0.113.10 [videofile]
#
# It installs ffmpeg, copies the broadcast file + the passthrough script,
# writes the systemd unit with your stream key, and starts it. Idempotent —
# safe to re-run to push a new video file.
set -euo pipefail

HOST="${1:?usage: migrate_rain_stream_vps.sh user@host [videofile]}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIDEO="${2:-$REPO/out/rain_stream_lean.mp4}"
[ -f "$VIDEO" ] || VIDEO="$REPO/out/rain_stream_3mbps.mp4"
[ -f "$VIDEO" ] || VIDEO="$REPO/out/rain_stream_final.mp4"
[ -f "$VIDEO" ] || { echo "no broadcast file found — build one first"; exit 1; }

# stream key comes from the repo .env; never hardcode it in a script
KEY="$(grep -E '^MINDWIRED_STREAM_KEY=' "$REPO/.env" | cut -d= -f2-)"
[ -n "$KEY" ] || { echo "MINDWIRED_STREAM_KEY missing from .env"; exit 1; }

echo "[migrate] host=$HOST"
echo "[migrate] file=$VIDEO ($(du -h "$VIDEO" | cut -f1))"

echo "[migrate] installing ffmpeg…"
ssh "$HOST" 'command -v ffmpeg >/dev/null || (apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg)'
ssh "$HOST" 'mkdir -p /opt/rainstream'

echo "[migrate] copying broadcast file (the slow part)…"
rsync -avP --inplace "$VIDEO" "$HOST:/opt/rainstream/rain_stream_final.mp4"

echo "[migrate] installing runner + unit…"
# self-contained runner: one ffmpeg process, input loops internally so the
# RTMP session never drops (a per-lap relaunch is what made YouTube mint a
# new video ID twice on the old GCE stream).
ssh "$HOST" "cat > /opt/rainstream/run.sh" <<'RUNNER'
#!/usr/bin/env bash
set -u
FILE=/opt/rainstream/rain_stream_final.mp4
RTMP="rtmp://a.rtmp.youtube.com/live2/${MINDWIRED_STREAM_KEY:?}"
while true; do
  [ -f "$FILE" ] || { echo "waiting for $FILE"; sleep 15; continue; }
  echo "$(date '+%F %H:%M:%S') starting passthrough push"
  ffmpeg -nostdin -re -stream_loop -1 -i "$FILE" \
    -c:v copy -c:a copy -f flv "$RTMP" -v warning
  echo "$(date '+%F %H:%M:%S') ffmpeg exited ($?) — retrying in 5s"
  sleep 5
done
RUNNER
ssh "$HOST" "chmod +x /opt/rainstream/run.sh"

ssh "$HOST" "printf 'MINDWIRED_STREAM_KEY=%s\n' '$KEY' > /opt/rainstream/.env && chmod 600 /opt/rainstream/.env"

ssh "$HOST" "cat > /etc/systemd/system/rainstream.service" <<'UNIT'
[Unit]
Description=mindwired 24/7 Space Rain stream (passthrough)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
EnvironmentFile=/opt/rainstream/.env
ExecStart=/opt/rainstream/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
UNIT

echo "[migrate] starting…"
ssh "$HOST" 'systemctl daemon-reload && systemctl enable --now rainstream.service && sleep 20 && systemctl is-active rainstream.service && echo "--- cpu ---" && top -bn1 | head -3 | tail -1'

cat <<EOF

[migrate] DONE — stream now serving from $HOST

NEXT (important, in this order):
  1. Confirm the stream is live and healthy in YouTube Studio.
  2. ONLY THEN stop the GCE box so you're not paying for both, and not
     double-pushing the same key (two encoders on one key = YouTube errors):
       gcloud compute ssh mindwired-stream --zone=us-central1-f \\
         --command='sudo systemctl disable --now mindwired-rain.service'
       gcloud compute instances stop mindwired-stream --zone=us-central1-f
  3. Once you're happy after a day or two, delete the GCE VM entirely:
       gcloud compute instances delete mindwired-stream --zone=us-central1-f

To push a new video later: re-run this script with the new file.
EOF
