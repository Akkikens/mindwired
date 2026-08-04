# CLAUDE.md — Mindwired video factory

Mindwired is a faceless YouTube channel: cinematic space/science mystery
explainers (the gaming/tech lane is PARKED as of 2026-08 — see the channel table
below). Everything is code-generated: Remotion (React → MP4), React Three
Fiber for 3D, TTS narration with word-level timings. This file is the production
manual — read it before making or editing any video.

## The 5 channels (2026-07)

> **ALWAYS confirm which channel a video is for BEFORE the first render** (Akshay,
> 2026-07-13). Branding (theme/wordmark) + the subscribe outro are per-channel and
> bake into the render — deciding mid-render forces a full re-render. Ask up front,
> set the comp's `channel` theme, plan the matching outro. One render, fully branded.

| Channel | Lane | Where | Voice / host |
|---|---|---|---|
| **mindwired** | faceless space/science mystery (gaming/tech lane PARKED 2026-08 — mixed-identity subs suppress cold-start; see icahn-validate Step 0) | this repo | Orion host; narrator = cloned Cartesia voice `00d3c951-…` (was George/Hume) |
| **Black Box Breakdown** | disaster & corporate-catastrophe forensics (aviation/maritime/industrial/corporate; 40+ high-RPM). @Watch-BlackBox | this repo, doc engine, `channel:"blackbox"` (theme accent `#FF9500`, wordmark "Black Box") | host **Reid** (`public/host/reid_wide.png`); narrator = cloned Cartesia `00d3c951-…` |
| **Criminal Record** | true crime built on the primary legal record (affidavits/dockets/filings, not the crime). @WatchCriminalRecord — created 2026-08-03 | this repo, doc engine, `channel:"criminalrecord"` (accent `#7FB4FF`, wordmark "Criminal Record") | faceless for now; narrator = cloned Cartesia `00d3c951-…`. **Has its own opening rule — see `docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md`** |
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

## Repo docs layout (2026-07-13, root cleanup 2026-08-02 — keep the root clean)

All human-facing docs live under `docs/`. **Only `CLAUDE.md` + `README.md` +
`ONBOARDING.md` stay at the repo root.** New docs go in the matching subfolder,
never loose at root:
- `docs/metadata/` — per-video packaging, one `METADATA-<slug>.md` per upload
- `docs/guides/` — how-to / specs: HOSTS, THUMBNAILS, BLACKBOX-PIPELINE-SPEC,
  HINDI-CHANNEL-BRIEF, HOOK-LAB, CLIPS, SHORTS-SCRIPTS, REELS-SETUP
- `docs/publishing/` — YOUTUBE-UPLOAD-KIT, YOUTUBE-CHAPTERS, PUBLISH-PROMPT-*
- `docs/planning/` — ROADMAP, IDEAS-MINDWIRED, TOPIC-QUEUE, HANDOFF
(Subdir READMEs like `src/viral/README.md` stay where they are.)

**Root also stays clear of loose captions/thumbnails.** The finished
`<Title>.mp4` + `<Title>.srt` pair for the video currently being packaged/
uploaded lives at repo root (per "Renders for upload live at repo root"
below) — but once a video has shipped, its `.srt` and any loose thumbnail/
screenshot PNGs/JPGs move to `archive/captions/` and `archive/thumbnails/`
respectively (`git mv`, not delete — these are historical record, not
clutter). Don't leave a shipped episode's caption file sitting at root next
to the next episode's in-progress one.

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

## Real-footage-first pipeline (anti-"AI slop" — 2026-07-19)

Born from real viewer comments ("Bloody AI slop!", "Poorly visuals") and two MH370
videos shipping the same takeoff clip. Research + verification log:
docs/planning/FOOTAGE-UPGRADE.md; per-niche source rankings: scripts/SOURCES-GUIDE.md.

- **Doc-driven sourcing (default): `scripts/fetch_doc_footage.py <slug> [--uhd]`**
  reads the doc spec (scene `query`/`videoQuery`/`stock` fields + doc `niche`)
  and fetches the whole episode's real visuals in one command through the
  ranked sources below.
- **ONE fetcher for real footage+photos:** `scripts/fetch_footage.py "<query>"
  --niche aviation|space|ocean|history|football|tech|generic --kind video|image
  --out <dir> --prefix <p> --count N` — tries 12 free sources in ranked order
  (NARA/archive.org/NASA/SVS/ESO/LoC/NOAA/Commons/DVIDS/Pexels/Pixabay/Openverse),
  PD/CC0/CC-BY/CC-BY-SA only, transcodes to 1080p H.264, logs ATTRIBUTION.md,
  drops a contact sheet in out/qa/. **EYEBALL every contact sheet** — search APIs
  return junk confidently. Optional free keys unlock more: PEXELS_API_KEY,
  PIXABAY_API_KEY, DVIDS_API_KEY in .env.
- **Real thing > real category > stock > AI.** Every concrete noun the narration
  dwells on (a plane, a ship, a place, a person) gets REAL footage of that thing
  when it exists. AI/stylized shots only for abstractions or unfilmable moments —
  never for real people/events with archival coverage. Pexels/Pixabay are generic
  modern b-roll only, never presented as archival.
- **NEW VIDEO = NEW FOOTAGE (Akshay, 2026-07-19).** Never copy another slug's
  media dir; research every episode fresh. The first ~30s hook using ANY file
  another video already used is a render-BLOCKING preflight failure.
- **FIRST 30 SECONDS = REAL VIDEO, never stills (Akshay, 2026-07-31: "stills
  for first 30 secs doesnt explode").** ONE documented exception: **Criminal
  Record** may open on real documents/photos + code-generated data animation,
  because state criminal cases have no federal-PD film pool to draw on (probed
  and confirmed 2026-08-03). The opening must still MOVE, and the motion must
  come from real material — see `docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md`.
  This exception does NOT extend to any other channel. Every cold-open/hook scene before
  ~30s carries a `video` field with real motion footage — photos with camera
  moves don't hold scrollers. Secure the hook video FIRST when sourcing; a
  topic with zero real video anywhere is a topic to reconsider. See memory
  `hook-first-30s-real-video`.
- **Relevance gate:** `python3 scripts/audit_scene_relevance.py <slug>` checks
  every scene's narration against what its assigned file actually IS (source
  title from ATTRIBUTION.md): MISMATCH/WEAK/UNSOURCED/REUSE warnings + the
  HOOK-REUSE block. Runs inside preflight_doc.py automatically — fix flags by
  refetching real footage, not by hoping.
- **The one honest exception — "unfilmable moment" beats:** `dossier: true`
  scenes (`DossierScene`, docs/guides/DOSSIER-SCENES.md) render a hand-cut
  "case file" reconstruction — torn newsprint, a rubber-stamp label, a
  permanent "RECONSTRUCTION" tag — for the rare beat with genuinely zero real
  footage/photo coverage. Native Remotion animation, no paid video-gen. Use
  sparingly (a handful of beats per episode) and never for a real person/event
  that has archival coverage — that's still real footage/`ExhibitScene`'s job.

## VO quality (the "AI voice" complaint — 2026-07-19)

Verified against docs.cartesia.ai; A/B evidence in out/qa/vo_ab/ (listen!).
- **No blanket `<break>` tags** — Cartesia's docs warn they degrade naturalness
  (the old per-sentence breaks = ~19% injected dead air, measured). Punctuation
  drives prosody; the writer marker `[pause]` in scene text = one deliberate
  750ms beat before a reveal. Use sparingly.
- Speed near-natural: cartesia.tts default 1.0, build_doc_vo default 0.97
  (chapter cards −0.02). A global slowdown reads robotic.
- Model pinned to the dated snapshot (`sonic-3.5-2026-05-04`) so idempotent
  per-clip rebuilds can't drift timbre mid-episode; auto-fallback to `sonic-3.5`.
- **Never ALL-CAPS in spoken text** (TTS spells it letter-by-letter — "ERASED"
  → E-R-A-S-E-D); emphasis caps belong in cap/stat/mainText only. Lint enforces.
- ship_doc.py now has a run-by-EAR gate: it splices hook+middle+last VO clips
  into out/qa/<slug>_vo_sample.mp3 — LISTEN before continuing.
- Scene-level paragraph requests are correct (per-sentence = prosody seams);
  keep scenes multi-sentence.

## Doc-engine studio layer (SFX / music scoring / motion / gates — 2026-07-18)

Backlog + rationale: docs/planning/STUDIO-UPGRADE.md.

- **One command per episode:** `python3 scripts/ship_doc.py <slug> <CompId>
  [--music public/beds/<bed>.mp3] [--windowed] [--yes]` runs every gate in the
  mandatory order (lint → radio_recreate → build_doc_vo → VO ear-check →
  image audit → preflight → 4 stills → ONE render_and_master → SRT) with human
  checkpoints at the VO sample, contact sheets and stills. Prefer it over
  running the steps by hand.
- **Preflight is a hard gate:** `scripts/preflight_doc.py <slug>` BLOCKS the
  render on stale manifests, missing img/video/diagram refs, empty Cartesia
  clips, unlabeled radio scenes, unknown sfx names, TTS-lint hits, and
  hook-footage reused from another video (audit_scene_relevance.py); warns on
  scene<->visual mismatches and hook-checklist violations
  (docs/guides/HOOK-CHECKLIST.md). Never render a doc that hasn't passed it.
- **SFX layer (baked into the ONE render):** `public/sfx/` holds the owned,
  ffmpeg-synthesized kit (`scripts/gen_sfx_kit.py`; license log in
  public/sfx/LICENSES.md). DocWide plays automatic cues — radio key-up squelch
  + low static bed + mic-cut around every RadioScene (label stays honest),
  `chapter_boom` on chapter cards, `stat_hit` at each stat reveal — and scenes
  can add explicit cues: `"sfx":[{"name":"alarm","at":"in","volume":0.2}]`
  (`noAutoSfx: true` silences the automatic ones). Levels sit well under VO.
- **Windowed music without a one-off script:**
  `render_and_master.py <Comp> out/x.mp4 --music <bed> --windows <slug>`
  computes the windows (cold open, each chapter transition, closing) from the
  doc manifest via `scripts/lib/doctiming.py` — the ONE Python mirror of
  DocWide's LEAD/HOLD; gen_doc_srt uses it too, so timing constants live in
  exactly two places (DocWide.tsx + doctiming.py) that must match.
- **Motion:** photo scenes take `"camera": "push"|"pull"|"drift"` (default
  alternates push/pull, smoothstep-eased); footage scenes get slow scale drift
  + grade; a film-grain + vignette layer covers the body (never the outro).

**Packaging standard (every title/description request — UPDATED 2026-08-03 from
the growth-research sweep, see .claude/skills/ctr-engine):** title (30-50 chars,
negative-emotion statement) + 2 A/B alternates, big searchable description,
parser-safe chapters, quick ~10-15 tags (10 seconds max — tags are officially
near-worthless now), **3-5 hashtags** (supersedes the old 15-hashtag rule; only
the 3 displayed matter), pinned comment (+ one-line Hype ask), category/license
lines, **and 3 BUILT thumbnail files** (`out/thumbs/<slug>_A/B/C.png`, House
Style 2.0 — see docs/guides/THUMBNAILS.md header; a concept without image files
is an incomplete package). Every long-form runs Test & Compare. Packaging is
locked at Icahn-validation time (packaging-first gate), not post-render. Layout
reference: docs/metadata/METADATA-boeing737max.md.

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
- **Music beds: use the `public/beds/bed_*.mp3` set (replaced the banned
  doc_* set, Akshay-approved 2026-07-31).** 8 tracks by The Grey Room /
  Density & Time from the YouTube Audio Library (free license, monetized-OK,
  no attribution; full log in `public/beds/LICENSES.md`) — deliberately
  picked from the library's FRESHEST additions (Jun–Aug 2025) so viewers
  don't recognize them from other channels (Akshay's criterion: famous/
  overused library staples read as content-farm). Tone map: `bed_awe_*`
  (pulsar/eventhorizon/singularity/laniakea — cosmic wonder, mindwired) /
  `bed_tension_*` (falsevacuum/rud — disaster dread, Black Box) /
  `bed_somber_*` (redshift/kayak — memorial beats). Rotate within a family
  across episodes; don't ship the same bed on consecutive uploads. These are
  cleared for YouTube uploads only — NOT the 24/7 live stream or
  off-platform use.
- **The old `doc_awe/doc_tension/doc_open/doc_somber.mp3` files stay BANNED
  (Akshay, 2026-07-25: "irritating," repeated viewer complaints)** — never
  pass them to `--music`; they remain on disk only so old comps don't 404.
  See memory `music-beds-banned-2026-07`.
- Master with `--music public/beds/bed_<tone>_<name>.mp3` — sidechain-ducked
  under the voice at −18 dB by `master_video.py` / `render_and_master.py`,
  so it swells in gaps and drops under narration. Add `--music` to the ONE
  render+master pass, not as an extra encode.
- **But music should NOT loop the whole runtime on long/serious docs (Akshay
  feedback, 2026-07-17 — continuous music under an 11-min disaster doc "ruined
  the whole video experience").** For docs over ~8-10 min or heavy subject
  matter, use `scripts/lib/master.py:mix_music_windowed()` instead of the plain
  `--music` flag: pass explicit `(start_sec, end_sec)` windows (compute from the
  manifest, same LEAD/HOLD math as chapter timestamps) so the bed only plays at
  the cold open, chapter transitions, and the closing — leave the dense factual
  narration in between dry. Never let the bed bleed into the baked-in subscribe
  outro's own audio (stop the last window at body-end, before the outro
  Sequence). Short-form docs (~5 min or less, like spaceanimals) can keep the
  plain continuous `--music` flag — this only bites on longer/heavier docs.
- Long-forms: listicle/ranked structure ("8 theories… each more unsettling") — this
  is the proven format for the niche (see memory: icahn-scary-space-niche).
  Use `word` scenes as chapter cards; vary the scene every 1-2 lines; give each
  list item its own dedicated scene type — NEVER cycle the same 3 generic scenes
  (repetitive-animation feedback, 2026-07-01).
- **Cold-open formula (the "Fern" documentary-writing shape, 2026-07-28):** open
  on a precise date, a named location, and one small concrete action, in that
  order — "November 24, 1971. Portland International Airport. A man in a dark
  suit pays cash for a one-way ticket." No throat-clearing, no rhetorical
  question, no "imagine this" — the story starts inside a moment. This is the
  concrete version of doc-episode's "Cold-open 2.0 — a dated scene with a
  person in tension" (see hook-doctor for the full rewrite process).
- **Causal/temporal connective tissue:** carry scenes forward with *then, by
  morning, three days later, within the hour, because of this, which meant,
  what nobody knew was* — placed at chapter/scene turns so every beat reads as
  caused by the last, not just sequenced after it. Combine with the existing
  one-idea-per-sentence rule (every sentence = one scene cut) so causality
  survives the cut into visual beats.
- **Five cliffhanger-ending patterns** for a script's final line (≤12 words,
  landing on a noun/name/date) — pick whichever fits the fact base: (1) **the
  unresolved object** — a physical thing that still exists and still holds the
  mystery ("The parachute has never been found"); (2) **the dated forward
  jump** — leap to a later date that reopens the case ("Then, in 1980, a boy
  found the money"); (3) **the missing piece** — name the one thing
  investigators never got ("They had his tie. They never had his name"); (4)
  **the quiet contradiction** — a fact that undermines everything before it
  ("The man in seat 18C never existed"); (5) **the price line** — the human or
  financial cost, stated flat ("The paintings are still worth half a billion
  dollars"). Pairs with, and comes right before, the existing verbal-bridge +
  subscribe line below — the cliffhanger closes the episode's own loop, the
  bridge opens the next video's.
- **No bare black-screen-and-text scenes — EVER (Akshay, 2026-07-25: "70-80% of
  the video is black screen... it should be a podcast instead why are we doing
  this a video").** Chapter cards (`chapter`) and kinetic stat/word reveals
  (`kinetic`) in the doc-engine (`src/mindwired-doc/DocWide.tsx`) now render a
  dimmed/blurred real photo behind the text (`TextSceneBg`) whenever the scene
  has an `img` — **always give these scenes an `img`** (reuse whatever real
  photo the surrounding segment already established; don't fetch new). A scene
  with `chapter`/`kinetic` and NO `img` still falls back to flat black — that
  fallback exists for when literally no real photo fits, not as the default.
  Treat the channel like it already has a million subscribers: every frame
  should look considered, not like a placeholder.
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
| `assets/subscribe-outro/subscribe_criminalrecord_long.mp4` | 14.06s | 1920×1080 | every Criminal Record long-form (comp `SubscribeCriminalRecordLong`, 420f) |
| `assets/subscribe-outro/subscribe_criminalrecord_short.mp4` | 14.06s | 1080×1920 | every Criminal Record Short (comp `SubscribeCriminalRecordShort`, 420f) |
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
  supersedes the earlier "English + Hindi block" rule). Tags: ~10-15 obvious terms,
  10 seconds of effort max (2026-08 update — YouTube says tags are near-worthless
  beyond misspellings; the old maximize-to-500-chars policy is retired). Every
  upload gets **3-5 hashtags** (first 3 display above the title; the old 15-hashtag
  rule is retired).
- Thumbnails: follow `docs/guides/THUMBNAILS.md` — **House Style 2.0 (2026-08-03,
  see that file's header): zero text or ONE word ≤10 chars, one bright focal
  element on dark, real archival asset as the subject; the old 3-5-word ALL-CAPS
  style is retired.** Tooling: image-model keyart (Workflow A, scene-only) or
  Remotion still (Workflow B). Deliverable is 3 built PNGs in `out/thumbs/` +
  Test & Compare on every long-form — concepts alone are an incomplete package.
- Renders for upload live at repo root as the bare `<Title>.mp4` + `<Title>.srt`
  pair (mp4-filename-is-title rule; no channel prefix, slugs only for working
  files — unified 2026-08-03 across doc-episode/publish-video after the eval
  found three competing conventions).
- **4K is the DEFAULT (Akshay, 2026-07-20):** ship_doc.py renders --scale 2
  automatically (--hd opts out); for manual renders use
  `scripts/render_and_master.py <Comp> out.mp4 --scale 2` (still ONE render).
  Pair with `fetch_doc_footage.py --uhd` so b-roll sources stay 2160p. Text/SVG/paper layers scale losslessly (verified: sketch demo still
  at 3840×2160, razor sharp). Best for sketch-brand + doc-engine episodes;
  expect ~2-4× render time + ~4× file size. Raster b-roll gets Lanczos-upscaled
  unless fetched 4K: `fetch_footage.py --uhd` keeps 2160p sources (Pixabay
  `large` is often real 4K). YouTube gives 4K uploads the higher-bitrate VP9
  ladder, which visibly improves quality even for upscaled sources. WebGL
  comps: test cost first (GPU time ~4×). The subscribe outros are 1080p — they
  upscale at the splice, acceptable.
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
