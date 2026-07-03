# Lip-sync — SadTalker on GCP (for Mac/AMD users with no local CUDA GPU)

Your Mac (Apple M5) and your PC (AMD RX 5070) can't run the good open-source
lip-sync models locally — they all need NVIDIA CUDA. This kit runs
[SadTalker](https://github.com/OpenTalker/SadTalker) — the model built for exactly
your case: **one still portrait photo + an audio clip → a talking-head video** with
natural head motion and lip sync — on a rented GCP GPU, callable from your Mac.

**Cost:** an L4 GPU VM is ~$0.65/hr on-demand (cheaper with spot). A batch of 7
short clips (one Short) takes ~5-10 minutes of GPU time → **under $0.15 per Short**.
**You must stop the VM when done** or it keeps billing — commands below.

---

## One-time setup (run these yourself; I can't run gcloud from here)

```bash
# 0. Install gcloud CLI if you don't have it: https://cloud.google.com/sdk/docs/install
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

## Every time you want to generate lip-synced Shorts

```bash
# start the VM (billing starts)
gcloud compute instances start lipsync-vm --zone=us-central1-a

# wait ~30s for Docker to come up, then check health
curl http://<VM_IP>:8080/    # should print {"ok": true, ...}

# generate narration audio for the plan first (if not already built)
python3 scripts/build_short.py neutronstar

# lip-sync every scene + stitch into one talking-head video
python3 lipsync/batch.py neutronstar
# -> lipsync/out/neutronstar_full.mp4

# STOP THE VM — this is the step people forget and get billed for
gcloud compute instances stop lipsync-vm --zone=us-central1-a
```

## Using the output
`lipsync/out/<slug>_full.mp4` is a raw talking-head video (SadTalker's native
output resolution/framing, not yet your kinetic-caption overlay). Two options:
1. **Use it as-is** as a plain talking Short — SadTalker already looks clean.
2. **Layer it into the Remotion engine**: drop it as an `<OffthreadVideo>` inside
   `HostLayer` in `src/viral/ShortEngine.tsx` (replacing the static `<Img>`), so you
   keep the kinetic captions/progress bar/branding on top of the moving, talking host.
   Ask Claude to wire this once you have a working `_full.mp4` to test against.

## Tuning
- `--preprocess full` (default) keeps the whole framing (desk, mic, nebula) instead
  of cropping to a tight face — better for the "podcast host" look.
- `--still` (default on) keeps head motion minimal/natural instead of exaggerated
  swaying — usually more premium/calmer for a documentary host.
- `enhancer=gfpgan` sharpens the face; drop it (`enhancer=""`) for faster/cheaper runs.

## If something errors
Paste the `curl` response or the `batch.py` error back to Claude — the Docker
container logs (`gcloud compute ssh lipsync-vm --command="sudo docker logs $(sudo docker ps -q)"`)
usually show the real SadTalker traceback.
