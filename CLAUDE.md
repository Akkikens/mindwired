# CLAUDE.md — Mindwired video factory

Mindwired is a faceless YouTube channel: cinematic space/science explainers plus a
gaming/tech lane. Everything is code-generated: Remotion (React → MP4), React Three
Fiber for 3D, TTS narration with word-level timings. This file is the production
manual — read it before making or editing any video.

## The 5 channels (2026-07)

> **ALWAYS confirm which channel a video is for BEFORE the first render** (Akshay,
> 2026-07-13). Branding (theme/wordmark) + the subscribe outro are per-channel and
> bake into the render — deciding mid-render forces a full re-render. Ask up front,
> set the comp's `channel` theme, plan the matching outro. One render, fully branded.

| Channel | Lane | Where | Voice / host |
|---|---|---|---|
| **mindwired** | faceless space/science + gaming/tech | this repo | Orion host; narrator = cloned Cartesia voice `00d3c951-…` (was George/Hume) |
| **Black Box Breakdown** | disaster & corporate-catastrophe forensics (aviation/maritime/industrial/corporate; 40+ high-RPM). @Watch-BlackBox | this repo, doc engine, `channel:"blackbox"` (theme accent `#FF9500`, wordmark "Black Box") | host **Reid** (`public/host/reid_wide.png`); narrator = cloned Cartesia `00d3c951-…` |
| **DimaagBatti** | Hindi explainers (Dhruv-Rathee style: economy/geopolitics/how-it-works) | this repo (`src/dimaagbatti`) | Rohan, Cartesia Hindi `4877b818-…`; whiteboard + Devanagari overlays; see `HINDI-CHANNEL-BRIEF.md` |
| **KickOffDaily90** | football / World Cup (separate YT+IG brand) | this repo, viral engine, `channel:"kickoffdaily90"` | host Jamie |
| **Singaloo.kids** | kids singalongs + animated | **singaloo repo** (`../singaloo`) | host Melody |

Each finished video gets its channel's subscribe outro appended (see "Subscribe outro").

> **Before you call any video done: append the subscribe outro.** See
> "Subscribe outro — MANDATORY on every video" below. Subscriber growth is
> currently the channel's #1 problem — do not skip this step. **Always ASK which
> channel (Black Box Breakdown / mindwired / KickOffDaily90 / DimaagBatti) before
> rendering** so the right branding + outro are baked in on the first render.

## The two repos

| Repo | What lives here |
|---|---|
| **mindwired** (this repo) | Custom long-form episodes (`src/orbit-style` comps, `src/attractor`, `src/scariest`, `src/gtavi`), the **viral shorts engine** (`src/viral`), packaging docs (`METADATA-*.md`, `THUMBNAILS.md`), finished uploads at repo root / `out/` |
| **singaloo** (`../singaloo`) | The **cosmic explainer engine** (`src/videos/cosmic`) that mass-produces mindwired long-forms, plus the kids-channel content. Cosmic videos are authored there and the mp4 copied here for publishing |

## The three video systems

### 1. Cosmic explainer engine (long-form, 3D) — singaloo repo
Data-driven WebGL explainers, 1-10 min. One JSON per video.

- Topic file: `singaloo/src/videos/cosmic/topics/<slug>.json` — `{id, title, subtitle, lines:[{id, text, scene, arg?}]}`. Each line = one narration sentence + one scene.
- Scene vocabulary (`Cosmos3D.tsx`): title, star/sun, supernova/flash, redgiant, whitedwarf, nebula, earth/earthdark/earthfrozen, blackhole, galaxy, wormhole, saturn, comet, pulsar, bigbang, warp, moon, mars, jupiter, neptune, planet (arg="#colA,#colB"), word (arg=BIG TEXT), outro — plus place/story scenes: void, attractor, ton618, magnetar, roguebh, cmb, horizon, signal, probe. Add new scenes in `Cosmos3D.tsx` (component + CameraRig case + router case) when a topic needs its own visual identity.
- Build: `python3 scripts/cosmic/build_topic.py <slug>` (TTS) → `python3 scripts/cosmic/gen_registry.py` → `npx remotion render <CompId> out/<name>.mp4 --gl=angle`. **WebGL comps always need `--gl=angle`** (stills too).
- Copy the finished mp4 into the mindwired repo root for upload.

### 2. Viral shorts engine (vertical, DOM/SVG) — this repo
See `src/viral/README.md` for full docs. Summary: plan JSON in `src/viral/plans/` →
`python3 scripts/build_short.py <slug>` → register in `src/Root.tsx` →
`npx remotion render Short<Name> out/<name>.mp4` (no --gl flag). Pacing knobs:
`HOLD` / `LEAD` in `src/viral/lib/plan.ts`. Tone→motion grammar: `src/viral/lib/tone.ts`.

**AI avatar hosts (all niches):** see `HOSTS.md`. Registry `src/viral/hosts.json`
(orion=space, sterling=finance, rio=football, vex=gaming; melody=singaloo kids).
Plan field `"host": "<id>"` → host mode; `"board": true` scenes render kinetic
graphics instead of the face. Lip-sync: `lipsync/batch.py <slug> --only <ids>`
(Sonic on Replicate — only lip-sync chapter leads, the still covers the rest).
Master plans with `"shortCuts"` → `scripts/cut_shorts.py <slug>` derives vertical
Shorts from the same audio/clips (register `<slug>.shorts.json` comps in Root).
Host images: Gemini (identity via --ref) → Real-ESRGAN 4x → Sonic. Never Flux,
never GFPGAN face_enhance.

### 3. Hand-built episodes — this repo
One-off cinematic comps (orbit, attractor, gtavi, scariest). Shared primitives in
`src/components` (kinetic.tsx, Captions.tsx, Camera.tsx, effects.tsx) and `src/lib`
(theme.ts palette + fonts, manifest.ts word-timing helpers). Only build one of these
when the topic needs bespoke visuals the engines can't produce; prefer the engines.

## Voice / TTS (shared rules)

- Priority: **Hume Octave** (expressive, per-tone acting directions) → **ElevenLabs**
  (voice pinned to **George**; `with-timestamps` gives real word timings) → offline
  estimated manifest (video still renders; rerun the build script later — all
  builders are idempotent per clip and never re-spend quota on existing clips).
- Check ElevenLabs quota before big builds:
  creator tier ~121K chars/mo. A short ≈ 500-600 chars; a long-form ≈ 4-7K.
- Hume ran out of credits 2026-06-30 (platform.hume.ai/billing to top up). Its lib
  `sys.exit`s on HTTP errors — catch `BaseException` when wrapping it.
- Keys live in each repo's `.env` (ELEVENLABS_API_KEY, HUME_API_KEY).

## Writing scripts that retain viewers

- **Long-form opening structure (channel convention, 2026-07-01):**
  1. **0-10s teaser** — 1-2 hook lines over dramatic *content* visuals (never the
     logo): the most shocking true fact or question of the video.
  2. **Then the wordmark intro** — one line on scene "intro" (slow mindwired
     wordmark bloom + tagline).
  3. **Then the title card and the video begins.**
  In cosmic topic JSONs: line 1 = hook scene (void/blackhole/etc.), line 2 =
  scene "intro", line 3 = scene "title". Shorts skip the wordmark entirely —
  vertical formats stay logo-free.
- **Hook in the first line.** No greetings, no "in this video", no cold logo opens.
  State the most shocking true fact immediately.
- Short declarative sentences, one idea per line (each line is one scene cut).
- Numbers numeric ("66 billion suns"), no year-stamping the narration ("right now"),
  spell numbers phonetically only when TTS mangles them ("TON six eighteen").
- Long-forms: listicle/ranked structure ("8 theories… each more unsettling") — this
  is the proven format for the niche (see memory: icahn-scary-space-niche).
  Use `word` scenes as chapter cards; vary the scene every 1-2 lines; give each
  list item its own dedicated scene type — NEVER cycle the same 3 generic scenes
  (repetitive-animation feedback, 2026-07-01).
- Shorts: hook (0-3s) → curiosity gap → story → twist → CTA. mainText is NOT the
  transcript — shorter and punchier, with 1-2 emphasis words.
- End every video with the standard outro line ("…subscribe to mindwired").

## Picking topics (don't skip this)

Use the Icahn method: only make videos whose demand is proven by an outlier —
100K+ views on a <100K-sub channel at 5:1+ views:subs with mediocre packaging.
Run YouTube searches (Videos filter), collect candidates, compute ratios. Current
validated niche: **scary/unsettling space compilations**. Research log in memory
(`icahn-scary-space-niche`); queued winners belong in that file.

## Subscribe outro — MANDATORY on every video (2026-07-05)

**This channel is not getting new subscribers. Fixing that is a top priority.**
Every finished render — every long-form and every Short, on BOTH mindwired and
kickoffdaily90 — must have the matching subscribe outro appended at the very
end before it counts as "done." This is not optional polish; treat a video as
incomplete without it.

**The permanent assets** (each hosts talking on camera, Veo-generated,
asking directly and sincerely for the subscribe — do not regenerate/reword
these casually, they were purpose-built and reviewed). **Confirm the video's
channel FIRST, then append that channel's matching outro:**

| File | Duration | Aspect | Use on |
|---|---|---|---|
| `assets/subscribe-outro/subscribe_mindwired_long.mp4` | 17.6s | 1920×1080 | every mindwired long-form |
| `assets/subscribe-outro/subscribe_mindwired_short.mp4` | 8.9s | 1080×1920 | every mindwired Short |
| `assets/subscribe-outro/subscribe_kickoffdaily90_long.mp4` | 17.6s | 1920×1080 | every kickoffdaily90 long-form |
| `assets/subscribe-outro/subscribe_kickoffdaily90_short.mp4` | 8.9s | 1080×1920 | every kickoffdaily90 Short |
| `assets/subscribe-outro/subscribe_blackbox_long.mp4` | 16.1s | 1920×1080 | every Black Box Breakdown long-form (host Reid; comp `SubscribeBlackBoxLong`) |
| _blackbox short — TBD_ | — | 1080×1920 | Black Box Shorts (build when first Short ships) |

These live in `assets/`, not `out/` — `out/` gets bulk-cleared for disk space
periodically, `assets/` does not. **Never delete `assets/subscribe-outro/`.**

**How to append (last step of every render, before declaring a video done):**
```bash
ffmpeg -i out/<your_video>.mp4 -i assets/subscribe-outro/<matching_outro>.mp4 \
  -filter_complex "[0:v]scale=1920:1080,setsar=1[v0];[1:v]scale=1920:1080,setsar=1[v1]; \
  [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" out/<your_video>_final.mp4
```
(swap `1920:1080` for `1080:1920` on Shorts). Verify the concatenated file with
ffprobe + a frame check same as any other render — the outro must play cleanly
with no black-frame gap or audio pop at the splice point.

**Source (only touch if the outro itself needs to change):** plans in
`src/viral/plans/subscribe-mindwired-{long,short}.json` and
`subscribe-kickoffdaily90-{long,short}.json`, registered as `SubscribeMindwiredLong`
/ `SubscribeMindwiredShort` / `SubscribeKickoffLong` / `SubscribeKickoffShort` in
`src/Root.tsx`. Built with Veo talking clips (~$8 total across all 4, one-time
cost) — see memory `subscribe-outro-standing-asset` for the full design
rationale, including why shorts run ~9s instead of a literal 5s (Veo's talking
clips have a fixed ~8s floor).

## Packaging & publishing

- Every video gets a `METADATA-<slug>.md` here: primary title + A/B alternates,
  SEO description with CHAPTERS timestamps, tags, pinned comment. Follow the
  existing files' format (e.g. METADATA-attractor.md).
- **Descriptions: English ONLY** for every channel (mindwired, Black Box Breakdown,
  KickOffDaily90) EXCEPT **DimaagBatti**, whose descriptions are **Hindi only**
  (Akshay, 2026-07-13 — do NOT add a Hindi block to the English channels; this
  supersedes the earlier "English + Hindi block" rule). Tags: maximize toward YouTube's 500-char
  limit (~25-35 tags: broad + niche + long-tail), don't stop at ~15. Every
  upload also gets **15 hashtags** (first 3 display above the title).
- Thumbnails: follow `THUMBNAILS.md` — image-model generation (Workflow A) for
  scene+text posters, or Remotion still + text overlay (Workflow B). House style:
  3-5 word ALL-CAPS yellow/white text, one dramatic scene, dark background.
- Renders for upload live at repo root as `mindwired_<slug>.mp4`.
- Loudness target −14 LUFS for YouTube. **Every finished render must be passed
  through `scripts/master_video.py` (or `scripts/render_and_master.py`, which
  renders + masters in one step) to hit −14 LUFS before it counts as done** —
  nothing else enforces the target. Verify the printed before/after LUFS.

## Gotchas

- zsh: `echo ===` fails (`==` is a glob operator) — use `---` as a separator.
- Remotion: registry/Root imports JSON statically — a comp's manifest must exist
  before typecheck/render, so always run the audio builder (even offline-estimate
  mode) before registering a comp.
- `Date.now()`/`Math.random()` are fine in Remotion code only if deterministic per
  frame — prefer the seeded `rng()` pattern used across the 3D components.
- Verify renders: ffprobe duration + extract a mid-video frame and *look at it*
  before declaring done. For WebGL comps also render 2-3 stills of new scenes
  before committing to a full render.
- **Confirm the target channel BEFORE the first render (Akshay, 2026-07-13).**
  Theme/wordmark + subscribe outro are per-channel and bake into the render; picking
  the channel mid-render = a wasted full re-render (this happened once on the
  Black Box 737 MAX doc). Ask which channel, set `channel` in the doc/plan, render once.
- **ONE full render per long video (Akshay, 2026-07-12 — don't waste CPU).** When
  building a long comp chapter-by-chapter, verify each new chapter with
  `npx remotion still <Comp> --frame=N` and (if motion/audio needs checking) a tiny
  `--frames=A-B` range render of JUST the new chapter — NEVER re-render the whole
  growing comp as a checkpoint. Remotion re-encodes from frame 0 every time, so
  cumulative checkpoint renders burn hours of CPU for footage nobody reviews. The
  only full render+master happens once, at the end. Exception: an explicit user
  review checkpoint — and even then render only the frame range they'll watch.
- Composite footage through Remotion, not ffmpeg: this box's ffmpeg has no
  libass, so burned captions / text overlays must be drawn by the Remotion comp
  (the subscribe-outro concat in this doc is a bare stream splice, which is
  fine — but never rely on ffmpeg's `subtitles`/`ass`/`drawtext` for the actual
  composite).
