# Lip-sync — two paths (for Mac/AMD users with no local CUDA GPU)

Your Mac (Apple M5) and your PC (AMD RX 5070) can't run the good open-source
lip-sync models locally — they all need NVIDIA CUDA. Two ways to get real
lip-sync (still photo + audio → talking video) without one:

## ⭐ Path A — Replicate (recommended: cheap, no idle-billing risk)

Pay only for actual GPU **seconds used**, not VM-hours. A single lip-sync run
costs a few cents; nothing stays "on" between runs, so you can't get billed for
forgetting to stop a server. Simplest setup: one API token, no Docker, no gcloud.

### Setup
1. Sign up at [replicate.com](https://replicate.com) → **Account → API tokens** → copy your token.
2. Add to `mindwired/.env`: `REPLICATE_API_TOKEN=r8_...`
3. `pip install replicate`
4. Pick a model: go to [replicate.com/explore](https://replicate.com/explore), search
   "lipsync" or "sadtalker", open a model's **API** tab, and copy the exact
   `owner/model:version` string it shows (this changes over time — don't reuse an
   old hash from a tutorial). Set it as `REPLICATE_LIPSYNC_MODEL=owner/model:version`
   in `.env`, or edit `MODEL = ...` directly in `lipsync/replicate_client.py`.

### Run
```bash
python3 scripts/build_short.py neutronstar     # generate narration if not built yet
python3 lipsync/replicate_client.py \
  --image public/host/orion.png \
  --audio public/shorts/neutronstar/audio/hook.mp3 \
  --out lipsync/out/hook_talking.mp4
```
Run once per scene clip (hook, what, crush, dense, spin, magnet, cta for the
neutronstar plan), then stitch with ffmpeg concat (see `lipsync/batch.py` for the
concat pattern — swap its `lipsync_run` import to `replicate_client.run` to batch
all scenes of a plan in one command).

---

## Path B — Self-hosted on GCP (cheaper per-second, but you manage a VM)

Runs [SadTalker](https://github.com/OpenTalker/SadTalker) yourself on a rented GPU.
Only worth it if you're doing high enough volume that Replicate's per-run
convenience fee stops being worth it — for occasional Shorts, Path A is simpler
and safer. **Real risk here: forgetting to stop the VM bills you per hour, on,
whether you're using it or not.**

### One-time setup
```bash
# 0. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>
gcloud services enable compute.googleapis.com

# 1. Create a GPU VM (L4 = good price/perf; T4 is cheaper/slower, also fine)
gcloud compute instances create lipsync-vm \
  --zone=us-central1-a \
  --machine-type=g2-standard-8 \
  --accelerator=type=nvidia-l4,count=1 \
  --image-family=common-cu121-debian-11 \
  --image-project=deeplearning-platform-release \
  --maintenance-policy=TERMINATE \
  --boot-disk-size=100GB

# 2. Copy this folder to the VM and build the image there
gcloud compute scp --recurse lipsync lipsync-vm:~/lipsync --zone=us-central1-a
gcloud compute ssh lipsync-vm --zone=us-central1-a --command="cd ~/lipsync && sudo docker build -t lipsync . && sudo docker run -d --gpus all -p 8080:8080 lipsync"

# 3. Open the firewall for port 8080 (once)
gcloud compute firewall-rules create allow-lipsync --allow=tcp:8080 --target-tags=lipsync-vm
gcloud compute instances add-tags lipsync-vm --tags=lipsync-vm --zone=us-central1-a

# 4. Get the VM's external IP and set it in mindwired/.env
gcloud compute instances describe lipsync-vm --zone=us-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
# add to mindwired/.env:
#   LIPSYNC_URL=http://<THAT_IP>:8080
```

### Every time you want to generate lip-synced Shorts
```bash
gcloud compute instances start lipsync-vm --zone=us-central1-a   # billing starts
curl http://<VM_IP>:8080/                                         # {"ok": true, ...}
python3 lipsync/batch.py neutronstar                               # -> lipsync/out/neutronstar_full.mp4
gcloud compute instances stop lipsync-vm --zone=us-central1-a    # STOP — don't forget this
```

---

## Using the output (either path)
The raw talking-head clip is native SadTalker/model framing, not yet your kinetic-
caption overlay. Two options:
1. **Use it as-is** as a plain talking Short.
2. **Layer it into the Remotion engine**: drop it as an `<OffthreadVideo>` inside
   `HostLayer` in `src/viral/ShortEngine.tsx` (replacing the static `<Img>`), so you
   keep the kinetic captions/progress bar/branding on top of the moving, talking host.
   Ask Claude to wire this once you have a working clip to test against.

## Tuning (Path B / SadTalker-specific flags)
- `--preprocess full` (default) keeps the whole framing (desk, mic, nebula) instead
  of cropping to a tight face — better for the "podcast host" look.
- `--still` (default on) keeps head motion minimal/natural instead of exaggerated
  swaying — usually more premium/calmer for a documentary host.
- `enhancer=gfpgan` sharpens the face; drop it (`enhancer=""`) for faster/cheaper runs.

## If something errors
Paste the error back to Claude. For Path A, the Replicate dashboard
(replicate.com/account) shows full logs per run. For Path B, check
`gcloud compute ssh lipsync-vm --command="sudo docker logs $(sudo docker ps -q)"`.
