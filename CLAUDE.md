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
| **DimaagBatti** | Hindi explainers (Dhruv-Rathee style: economy/geopolitics/how-it-works) | this repo (`src/dimaagbatti`) | Rohan, Cartesia Hindi `4877b818-…`; whiteboard + Devanagari overlays; see `docs/guides/HINDI-CHANNEL-BRIEF.md` |
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
| **mindwired** (this repo) | Custom long-form episodes (`src/orbit-style` comps, `src/attractor`, `src/scariest`, `src/gtavi`), the **viral shorts engine** (`src/viral`), packaging docs (`docs/metadata/`, `docs/guides/THUMBNAILS.md`), finished uploads at repo root / `out/` |
| **singaloo** (`../singaloo`) | The **cosmic explainer engine** (`src/videos/cosmic`) that mass-produces mindwired long-forms, plus the kids-channel content. Cosmic videos are authored there and the mp4 copied here for publishing |

## Repo docs layout (2026-07-13 — keep the root clean)

All human-facing docs live under `docs/`. **Only `CLAUDE.md` + `README.md` stay at
the repo root.** New docs go in the matching subfolder, never loose at root:
- `docs/metadata/` — per-video packaging, one `METADATA-<slug>.md` per upload
- `docs/guides/` — how-to / specs: HOSTS, THUMBNAILS, BLACKBOX-PIPELINE-SPEC,
  HINDI-CHANNEL-BRIEF, HOOK-LAB, CLIPS, SHORTS-SCRIPTS, REELS-SETUP
- `docs/publishing/` — YOUTUBE-UPLOAD-KIT, YOUTUBE-CHAPTERS, PUBLISH-PROMPT-*
- `docs/planning/` — ROADMAP, IDEAS-MINDWIRED, TOPIC-QUEUE, HANDOFF
(Subdir READMEs like `src/viral/README.md` stay where they are.)

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

**AI avatar hosts (all niches):** see `docs/guides/HOSTS.md`. Registry `src/viral/hosts.json`
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

## Black Box Breakdown — Evidence Engine (LIVE 2026-07-13)

Full episode runbook: **docs/guides/BLACKBOX-PIPELINE-SPEC.md** (read it before any Black
Box episode). The channel's signature capability:

- `scripts/fetch_ntsb_docket.py "<accident>" --types audio,pdf,image [--faa-audio]`
  — real ATC audio, CVR transcripts, photos from NTSB/FAA dockets (US-gov
  public domain) → `public/shorts/_evidence/<slug>/` + SOURCES.md. Source
  ranking in `scripts/SOURCES-GUIDE.md` (NTSB→FAA→archive.org; LiveATC only
  with permission).
- `scripts/radio_recreate.py <slug>` — scenes with a `speaker` field become
  radio-EQ'd Cartesia recreations (run BEFORE build_doc_vo.py).
- DocWide `RadioScene` (scene has speaker/timestamp/radioLabel): waveform +
  transcript beat. **HONESTY RULE: "ACTUAL ATC RECORDING" only for real docket
  audio; recreations are labeled "CVR RECREATION". Never mislabel; never use
  leaked CVR audio.** Reference comp: `RadioTest` (US1549).
- The gov-docket evidence pattern also serves the other channels: NTSB covers
  maritime/rail/pipeline too; NASA mishap reports/mission audio (PD) for
  mindwired space docs; IAEA/NRC for nuclear; congressional/court records for
  DimaagBatti. Same labeling rule everywhere.
- US1549 ("Miracle on the Hudson") evidence is already fetched and is a
  validated future episode.

**Packaging standard (every title/description request):** full-SEO package by
default — title+A/B, big searchable description, parser-safe chapters, ~495-char
tags, 15 hashtags, pinned comment, category/license lines; Shorts sets get one
search-query cluster each. Reference: docs/metadata/METADATA-boeing737max.md.

**Published Black Box URLs (use in every "▶ MORE FROM" block — NO more `[paste URL]`
placeholders; full copy in memory `blackbox-published-urls`):**
- Playlist (Air Crash Investigations): https://www.youtube.com/playlist?list=PLGVCiFZm8sRw
- Colgan Air 3407 ("Too Tired to Fly"): https://youtu.be/Oh8YpgbudHQ
- Boeing 737 MAX ("How Boeing Killed 346 People"): https://youtu.be/d4_Rk50GkBg
- Air France 447 ("Titanic of the Skies"): https://youtu.be/ZvD4n8uNnuk
- Subscribe deep-link: https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

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
- **TTS pronunciation lint — MANDATORY before every VO build (2026-07-14):** run
  `python3 scripts/lint_tts_text.py` (or pass specific files). Born from viewer
  complaints on the 737 MAX doc — TTS read "737" as "seven hundred and thirty seven".
  Spoken `text`/`voiceover` fields spell things the way a narrator SAYS them
  ("seven three seven MAX", "A three twenty", "Flight six ten"); on-screen
  cap/stat/mainText keep written forms ("737 MAX"). Clock times ("3:20") and
  decades ("1960s") usually read fine — verify by ear.
- **Music bed on every documentary (2026-07-14, viewer feedback: VO-only feels
  flat/"aloof"):** master with `--music public/beds/doc_awe.mp3` (cosmic/melancholy),
  `doc_tension.mp3` (disaster/dread), or `doc_open.mp3` — sidechain-ducked under the
  voice at −18 dB by `master_video.py` / `render_and_master.py`, so it swells in
  gaps and drops under narration. Beds are ElevenLabs-generated (owned). Add
  `--music` to the ONE render+master pass, not as an extra encode.
- Long-forms: listicle/ranked structure ("8 theories… each more unsettling") — this
  is the proven format for the niche (see memory: icahn-scary-space-niche).
  Use `word` scenes as chapter cards; vary the scene every 1-2 lines; give each
  list item its own dedicated scene type — NEVER cycle the same 3 generic scenes
  (repetitive-animation feedback, 2026-07-01).
- Shorts: hook (0-3s) → curiosity gap → story → twist → CTA. mainText is NOT the
  transcript — shorter and punchier, with 1-2 emphasis words.
- End every video with the standard outro line ("…subscribe to mindwired").
- **Verbal bridge in the final line (2026-07-14):** before the subscribe line, the
  narration names a SPECIFIC next video with a curiosity tease — "If X shocked you,
  wait until you see Y…" — a spoken narrative handoff, not just an end-screen card.
  (Session watch-time is a core ranking signal; a spoken bridge converts far better
  than a silent link. Ref: lostcosmonauts scene e8.)

## How the YouTube algorithm actually distributes (2026 — apply to every strategy call)

The recommender **pulls** videos per-viewer (predicted long-term satisfaction); it never
"pushes" content. Two-stage pipeline: candidate generation (broad recall from watch
history/search/subs embeddings) → ranking (heavy model scoring ~hundreds of features;
core objective ≈ expected watch time per impression + satisfaction). Consequences:

- **Quality CTR, not raw CTR:** high CTR + instant bounce = flagged deceptive; ~5% CTR
  with ~70% retention beats 12% CTR that craters. Packaging must promise EXACTLY what
  the video delivers — the honesty rules in this file are algorithm strategy, not just
  ethics.
- **Valued watch time:** minutes watched × retention. Long videos with early cliffs
  lose to shorter videos that hold. The first 30s is monitored hardest → teaser-first
  cold opens (see "Writing scripts"), never slow intros.
- **Cold start = subscribers first.** A new upload is tested on subs + similar-creator
  audiences; their engagement decides wider rollout. So (a) never upload off-lane
  content on a niche channel — sub apathy kills distribution; (b) Shorts bypass channel
  authority (judged on own first-3s) → the Shorts funnel is how small channels break out.
- **Recency dominates:** recent viewer history outweighs old. Drip related Shorts ~24h
  apart while the audience the algorithm just learned is still warm; long-form first,
  Shorts funnel starting next day with pinned links to the live video.
- **Satisfaction signals:** rewatches, session length, likes, surveys, "don't
  recommend". Session watch-time is why every description ends with the MORE FROM
  block; loops/replays are why Shorts end where they began.
- Optimize for the viewer, not the algorithm — the model just imitates viewer behavior.
- **Reinvestment loop (Akshay's policy call, noted 2026-07-14):** channel revenue goes
  back into production capability (TTS/API tiers, archival tooling, animation) rather
  than being pocketed — compounding quality is the growth engine at this stage.

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

> **HARD RULE — NEVER generate a new outro (Akshay, 2026-07-14).** The set above is
> complete and permanent; the one-time Veo cost is already paid. For EVERY video,
> just append the channel's existing standing outro (Black Box → `subscribe_blackbox_long.mp4`).
> Do NOT build per-video or new per-channel outros — "do not spend unnecessarily."

**PREFERRED — bake the outro INTO the render (ONE render, no second encode).**
Akshay hates the render-then-ffmpeg-append double-encode (2026-07-14: "why 2-2
render everytime"). For DocWide doc-engine videos, pass the outro to the comp so it
renders in a single pass — the outro is the final Sequence inside the composition:
```
const BB_OUTRO = { file: "outro/subscribe_blackbox_long.mp4", frames: 483 }; // dur*30
makeDocComp(doc, manifest, BB_OUTRO)      // in Root.tsx
docTotalFrames(doc, manifest, BB_OUTRO)
```
Outros are **copied (real files, NOT symlinks — Remotion does not bundle symlinks,
they 404 at render)** into `public/outro/`. One
`scripts/render_and_master.py <Comp> out/<slug>.mp4` call = the fully-branded,
−14 LUFS final with the outro already on it. **No ffmpeg concat step.** Verify with
ffprobe duration + a frame at the splice. Frame counts: blackbox 483, mindwired 527,
kickoffdaily90 527 (@30fps).

**Fallback ONLY for non-DocWide videos** (bare stream splice, still one extra encode):
```bash
ffmpeg -i out/<your_video>.mp4 -i assets/subscribe-outro/<matching_outro>.mp4 \
  -filter_complex "[0:v]scale=1920:1080,setsar=1,fps=30[v0];[1:v]scale=1920:1080,setsar=1,fps=30[v1]; \
  [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" out/<your_video>_final.mp4
```
(swap `1920:1080` for `1080:1920` on Shorts).

**Source (only touch if the outro itself needs to change):** plans in
`src/viral/plans/subscribe-mindwired-{long,short}.json` and
`subscribe-kickoffdaily90-{long,short}.json`, registered as `SubscribeMindwiredLong`
/ `SubscribeMindwiredShort` / `SubscribeKickoffLong` / `SubscribeKickoffShort` in
`src/Root.tsx`. Built with Veo talking clips (~$8 total across all 4, one-time
cost) — see memory `subscribe-outro-standing-asset` for the full design
rationale, including why shorts run ~9s instead of a literal 5s (Veo's talking
clips have a fixed ~8s floor).

## Packaging & publishing

- Every video gets a `docs/metadata/METADATA-<slug>.md`: primary title + A/B alternates,
  SEO description with CHAPTERS timestamps, tags, pinned comment. Follow the
  existing files' format (e.g. docs/metadata/METADATA-attractor.md).
- **Every description ends with a "▶ MORE FROM <CHANNEL>" block** (Akshay, 2026-07-14):
  2-4 related-video links + the channel's playlist URL + the subscribe deep-link
  `https://www.youtube.com/@<handle>?sub_confirmation=1` — funnels viewers to more
  videos (session watch-time), like Mayday: Air Disaster. Use `[paste URL]` placeholders
  when real upload URLs aren't known; never fabricate URLs. See memory `channel-description-playbook`.
- **Descriptions: English ONLY** for every channel (mindwired, Black Box Breakdown,
  KickOffDaily90) EXCEPT **DimaagBatti**, whose descriptions are **Hindi only**
  (Akshay, 2026-07-13 — do NOT add a Hindi block to the English channels; this
  supersedes the earlier "English + Hindi block" rule). Tags: maximize toward YouTube's 500-char
  limit (~25-35 tags: broad + niche + long-tail), don't stop at ~15. Every
  upload also gets **15 hashtags** (first 3 display above the title).
- Thumbnails: follow `docs/guides/THUMBNAILS.md` — image-model generation (Workflow A) for
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
