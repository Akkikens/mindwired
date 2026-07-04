# HOSTS.md — the AI avatar host system

Photoreal recurring presenters for every content lane, lip-synced from a single
4K master image each. One face per niche, consistent forever.

## The roster (src/viral/hosts.json)

| id | lane | image (4K master) | voice (ElevenLabs) |
|---|---|---|---|
| `orion` | space & science docs | `public/host/orion_v4c_4k.png` | George |
| `sterling` | finance & money | `public/host/sterling_4k.png` | Adam |
| `rio` | football / World Cup | `public/host/rio_4k.png` | Daniel |
| `vex` | gaming / GTA VI / tech | `public/host/vex_4k.png` | Brian |
| `melody` | singaloo kids (animated, lives in ../singaloo/public/host/) | — | (kids voice, TBD) |

A plan JSON activates a host with one field: `"host": "rio"`. The registry
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
  --out public/host/rio_celebrating.png --ref public/host/rio.png --aspect 9:16 \
  --prompt "Use the man in the reference photo — exact same face... now arms raised celebrating"
.venv-lipsync/bin/python lipsync/upscale.py --image public/host/rio_celebrating.png \
  --out public/host/rio_celebrating_4k.png --scale 4
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

## Engine behavior (src/viral/ShortEngine.tsx)

- `plan.host` set → host mode. Per scene: talking clip if
  `public/shorts/<slug>/host/<sceneId>.mp4` exists (`hostClipExists`, set by
  batch.py), else the still 4K master. `board: true` scenes render the full
  kinetic scene instead (opaque, covers the host).
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
| lip-sync | zf-kbot/sonic on Replicate, keep_resolution=True | ~$0.10-0.25/clip |

SadTalker (cjwbw/sadtalker) is deprecated here — blurry. Sonic replaced it.
