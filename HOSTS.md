# HOSTS.md — the AI avatar host system

Photoreal recurring presenters for every content lane, lip-synced from a single
4K master image each. One face per niche, consistent forever.

## The roster (src/viral/hosts.json)

| id | lane | image (4K master) | voice (ElevenLabs) |
|---|---|---|---|
| `orion` | space & science docs | `public/host/orion_v4c_4k.png` | George |
| `sterling` | finance & money | `public/host/sterling_4k.png` | Adam |
| `jamie` | football / World Cup (primary, most photoreal, built for Veo) | `public/host/jamie_b.png` | Daniel |
| `vex` | gaming / GTA VI / tech | `public/host/vex_4k.png` | Brian |
| `melody` | singaloo kids (animated, lives in ../singaloo/public/host/) | — | (kids voice, TBD) |

`rio` (an earlier football host) was retired and fully deleted 2026-07-06 —
Akshay found Jamie more visually realistic. Use `jamie` for all football
content going forward.

A plan JSON activates a host with one field: `"host": "jamie"`. The registry
resolves the image, the TTS voice (Hume description + ElevenLabs name), and the
Sonic movement intensity (`dynamicScale`).

## The recipe that fixed "it looks AI" (don't regress)

1. **Generate with Gemini** (`lipsync/gemini_host.py`), never Flux — Gemini does
   real skin. Prompt must demand: candid photojournalistic, 85mm f/1.4, visible
   pores/stray hairs/asymmetry, "not airbrushed, not CGI".
2. **Lip-sync framing rules** (this is why the first avatars failed):
   face FRONTAL and dominant in frame, eyes to lens, mouth fully unobstructed
   (mic away from the jaw), 9:16.
3. **Upscale 4x** with `lipsync/upscale.py` (Real-ESRGAN, `face_enhance` OFF —
   GFPGAN re-airbrushes). Gemini caps ~1K px; Sonic keeps source resolution, so
   the 4K master is what makes the talking clips sharp.
4. **Identity consistency forever**: new poses/outfits/angles = re-generate with
   `--ref public/host/<id>.png` ("same man, now …"), never from scratch.

```bash
# new pose for an existing host
.venv-lipsync/bin/python lipsync/gemini_host.py \
  --out public/host/jamie_celebrating.png --ref public/host/jamie_b.png --aspect 9:16 \
  --prompt "Use the man in the reference photo — exact same face... now arms raised celebrating"
.venv-lipsync/bin/python lipsync/upscale.py --image public/host/jamie_celebrating.png \
  --out public/host/jamie_celebrating_4k.png --scale 4
```

## Producing a host video (any lane)

```bash
# 1. plan JSON in src/viral/plans/<slug>.json with "host": "<registry id>"
#    Scenes: host scenes (captions over the talking host) + "board": true scenes
#    (full kinetic score/stat/comparison graphics). Alternate them.
python3 scripts/build_short.py <slug> --voice eleven   # 2. narration (host's own voice)
.venv-lipsync/bin/python lipsync/batch.py <slug> --only hook,p1,cta  # 3. lip-sync the scenes that earn it
# 4. register in src/Root.tsx (manifest must exist first), then:
npx remotion render Short<Name> out/<name>.mp4          # no --gl flag for viral comps
```

**Replicate budget rule:** lip-sync is the only per-second cost. `--only` the
chapter-lead scenes (~1 in 7); the engine's still-host covers the rest and
`board` scenes cover the info-dense stretches. A 10-min video needs ~10 clips,
not 70.

## Long-forms + shorts from one plan

A master plan with `"shortCuts": [...]` produces both:
- the 16:9 long-form (`<Comp>Wide`, 1920×1080)
- N vertical Shorts via `python3 scripts/cut_shorts.py <slug>` →
  `src/viral/plans/<slug>.shorts.json` — same audio, same lip-sync clips,
  zero extra spend. Each cut = 4-6 scene ids from the master (15-60s), opening
  scene auto-promoted to hook.

## Two shoots per host: 9:16 AND 16:9 (don't skip the wide one)

Every host needs **two** portraits: `image`/`sourceImage` (9:16, for Shorts)
and `imageWide`/`sourceImageWide` (native 16:9, for long-forms). A 9:16
portrait force-cropped to fill a 16:9 frame ("cover") only shows a thin band
near whatever vertical anchor you pick — for a face that means hairline-only,
mouth cut off entirely, which is fatal for a talking host (learned the hard
way 2026-07-04). Shoot the wide version for real:

```bash
.venv-lipsync/bin/python lipsync/gemini_host.py \
  --out public/host/<id>_wide.png --ref public/host/<id>.png --aspect 16:9 \
  --prompt "Use the man in the reference photo — exact same face... Wide
  landscape broadcast shot: positioned left-of-center, chest-up, open negative
  space to the right for graphics..."
.venv-lipsync/bin/python lipsync/upscale.py --image public/host/<id>_wide.png \
  --out public/host/<id>_wide_4k.png --scale 4
```
Then set `imageWide`/`sourceImageWide` in hosts.json. `resolveHostImage(host,
wide)` picks the right one; a host with no `imageWide` yet falls back to a
pillarboxed 9:16 (full face still visible, just not edge-to-edge) rather than
the old crop-the-mouth-off behavior.

**Talking clips are 9:16 ONLY (verdict 2026-07-04).** We tried wide talking
clips with both engines and Akshay rejected both: Wav2Lip freezes everything
except a small mouth crop (visible chin seam, dead body), and even Sonic
degrades badly on 16:9 — the face is a smaller region of the frame, so its
animate-crop-and-paste-back leaves a visible seam down the face edge and soft
blur. **Policy: 16:9 long-forms use the still `imageWide` host with the Ken
Burns drift (looks clean and intentional); talking clips only ever ship in
9:16 Shorts where the face fills the frame.** The `--wide` batch flag and
`hostClipExistsWide` plumbing still exist if a better model ever changes this,
but don't burn credit re-testing Sonic/Wav2Lip on wide shots.

## Engine behavior (src/viral/ShortEngine.tsx)

- `plan.host` set → host mode. Per scene: talking clip if
  `public/shorts/<slug>/host/<sceneId>.mp4` (or `host-wide/` on a 16:9 render)
  exists, else the still master for that aspect. `board: true` scenes render
  the full kinetic scene instead (opaque, covers the host).
- Talking clips are muted; the scene mp3 stays the audio source (keeps
  word-synced kinetic captions). Clips fade out over their last 6 frames into
  the still for the HOLD beat.
- When any talking clip exists the Ken Burns zoom is frozen so still/video
  stay pixel-aligned.

## Models & costs

| step | model | cost |
|---|---|---|
| portrait | gemini-2.5-flash-image (own GEMINI_API_KEY) | ~$0.04/image |
| upscale | nightmareai/real-esrgan on Replicate | ~$0.01/image |
| lip-sync (paid) | zf-kbot/sonic on Replicate, keep_resolution=True | ~$0.10-0.25/clip |
| lip-sync (free) | Wav2Lip, local, `batch.py --engine wav2lip` | $0, CPU, ~1-2x realtime |
| talking hook (best) | Veo 3.1 Fast via GEMINI_API_KEY, `batch.py --engine veo` | ~$1-2 per 8s clip |

**Veo (`--engine veo`, lipsync/veo_client.py) is the quality ceiling** —
image-to-video with full facial acting + its own generated voice (British
accent per the prompt), not a mouth-paste. Approved by Akshay 2026-07-04 as
"actually looks like a human speaking." How it integrates: batch.py generates
the clip from the scene's `voiceover` as spoken dialogue, extracts Veo's audio
OVER the scene's ElevenLabs mp3, forced-aligns the text against it (ElevenLabs
forced-alignment, cheap) so kinetic captions stay word-synced, and updates the
manifest duration. The engine still plays "the mp3" + "the muted clip" — both
now from the same Veo generation, so they can't drift. Caveats: 8s clips, 9:16
only for now, voice varies slightly between generations (no voice pinning), so
use for hook + CTA scenes, not every scene. Scenes must NOT be `board: true`
(board scenes never show the host).

SadTalker (cjwbw/sadtalker) is deprecated here — blurry. Sonic replaced it.
Wav2Lip is the free fallback when Replicate is out of credit — visibly softer
around the mouth than Sonic, but a real, working local option. Setup:

```bash
python3 -m venv .venv-wav2lip
.venv-wav2lip/bin/pip install torch torchvision numpy opencv-python librosa numba tqdm
git clone --depth 1 https://github.com/Rudrabha/Wav2Lip lipsync/wav2lip/repo
curl -L -o lipsync/wav2lip/repo/checkpoints/wav2lip_gan.pth \
  https://huggingface.co/camenduru/Wav2Lip/resolve/main/checkpoints/wav2lip_gan.pth
curl -L -o lipsync/wav2lip/repo/face_detection/detection/sfd/s3fd.pth \
  https://huggingface.co/camenduru/Wav2Lip/resolve/main/face_detection/detection/sfd/s3fd.pth
```
Then patch `lipsync/wav2lip/repo/audio.py`'s `librosa.filters.mel(...)` call to
use keyword args (`sr=`, `n_fft=`) — modern librosa made them keyword-only and
the repo is pinned to a 2019-era librosa API. `lipsync/wav2lip_client.py`
wraps it with the same `run(image, audio, out)` signature as `sonic_client`,
so `batch.py --engine wav2lip` is the only thing callers need to know about.

## Reliability notes (learned 2026-07-04)

- **Feed Sonic 1080p, not the 4K master.** batch.py auto-generates a cached
  `<image>_sonic.png` at ~1080p for the Sonic call — the 4K master is for the
  still layer/re-poses only. Sending it 4K directly was slow enough to hang a
  job and once produced a truncated/corrupt mp4 (`moov atom not found`).
  sonic_client.py now ffprobes every download before publishing it, so a
  truncated transfer fails loudly instead of silently landing a broken clip.
- **Low Replicate credit throttles to 6 predictions/min** (HTTP 429, "Request
  was throttled... while you have less than $5.0 in credit"). batch.py now
  paces clips 11s apart and sonic_client.py retries 429s/timeouts with backoff.
  If a whole batch run dies anyway, just rerun the same command — both scripts
  are idempotent and pick up only the missing clips. Top up credit at
  replicate.com/account/billing if this keeps happening.
