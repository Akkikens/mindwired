# Black Box Breakdown — Episode Production Pipeline Spec v1
*(spec authored on Fable, 2026-07-13 — execution runbook for Opus sessions.
Channel: @Watch-BlackBox · host Reid · accent #FF9500 · narrator = cloned
Cartesia voice 00d3c951-… · first episode: boeing737max, 26:01)*

## 0. What already exists — do NOT rebuild
The "scrape → data.json → TTS → Remotion" architecture is already implemented,
better than the naive version:

| Generic idea | Our implementation (use this) | Why ours is better |
|---|---|---|
| Scrape a website with BeautifulSoup | Research agents (WebSearch/WebFetch fan-out) + `scripts/fetch_media.py` (license-filtered Commons/Openverse) | legal images w/ auto-ATTRIBUTION.md; multi-source verified facts, not one page |
| One `voiceover.wav` | `scripts/build_doc_vo.py <slug>` — per-scene mp3s, idempotent | per-scene timing, re-record one line without re-spending quota |
| `getAudioDurationInSeconds` at render | `docs/<slug>.manifest.json` (ffprobe'd durations, static import) | deterministic; Root imports statically; scene cuts land exactly on VO |
| One composition reading data.json | `src/mindwired-doc/DocWide.tsx` (channel:"blackbox" theme) + `src/blackbox/BlackBoxShort.tsx` | Ken Burns, chapter cards, stat chips, branding, per-prefix image rotation |

## 1. Episode pipeline (phases + gates)
**Topic → Research → Script → Assets → AUDIT → VO → Register → Stills → ONE
render → Master → Outro → Package → Shorts.** Every gate below is mandatory —
each exists because skipping it burned us once.

### Phase T — Topic (Icahn gate)
- Pick from §3 queue only if validated: an outlier video on the same disaster
  with 100K+ views on a <100K-sub channel (5:1+ ratio). Log evidence in the
  queue file. High-RPM lanes: aviation, maritime, industrial, corporate fraud.

### Phase R — Research (agents, ~30 min)
Fan out 2 background agents:
1. **Facts**: official reports first (NTSB/BEA/AAIB dockets, congressional
   reports, court records, Wikipedia as index only). Output
   `src/mindwired-doc/docs/research/<slug>.md`: timeline, actors, numbers with
   confidence levels (EST/PROB/DISPUTED), verbatim-quotable documented lines
   (e.g. Forkner's "Jedi mind tricks"), and a LEGAL box: what is *found* by
   investigations vs alleged — name individuals only with documented findings,
   hedge disputed tolls in-text.
2. **Competitor blueprint**: top 2-3 videos on this disaster — their structure,
   what commenters loved/missed = our angle.

### Phase S — Script (agent brief template)
`docs/<slug>.json` — `{slug, title, language:"en", voice:"00d3c951-…",
channel:"blackbox", scenes:[…]}`. House voice = the 737max register:
- **Cold open on the machine, not the disaster**: "This exact aircraft has six
  weeks left to exist." Present tense, dramatic irony, no gore.
- 100–130 scenes (~20–35 words) ≈ 22–28 min. 8-beat hook → title card
  ("BLACK BOX — <disaster>") → 8–10 chapters, each ends on a cliffhanger.
- Chapter names = curiosity gaps ("Deleted From the Manual", "One Sensor").
- Last chapter = "The Real Cause" (systemic, forensic-neutral — the corporate
  physics, not villain cartoons). Final scene: subscribe CTA + next-episode tease.
- `cap` = punchy on-screen line (NOT transcript). `stat` chips = dates/numbers,
  statColor #FF4D4D for death tolls. NEVER start text with "..." (empty-mp3 bug).
- Scene `img` keys must come from the Phase-A prefix vocabulary given to the agent.

### Phase A — Assets ($0 rule)
1. **Free video archives FIRST** (memory: free-video-archives-before-genai):
   NARA/DVIDS/agency footage, Commons video, Pexels/Pixabay (CC0) for generic
   b-roll (runways, oceans, factories, courtrooms). Then `fetch_media.py`
   images per subject (`--prefix`), canonical photos via Commons
   `Special:FilePath/<exact name>` when search misses.
2. Pool depth ≥1 file per 2 uses of a prefix. Contact-sheet QA (PIL montage) —
   eyeball, prune junk (theater recreations, modern stock, burned-in text — crop
   labels with ffmpeg), refetch.
3. Optional Veo hero shots ONLY for moments no archive can show (cockpit dusk,
   sinking hull) — style-bible prompt, per-clip frame QA, ≤$10/episode.

### Phase Q — Audit gates (all three, before any render)
1. `audit_doc_images.py <slug>` — every scene's text vs the EXACT file shown;
   narration may only describe what a verified image shows.
2. ffprobe scan of every VO mp3 (catches Cartesia empty-clip bug).
3. `npx remotion still` ×4 spread across the comp — look at them.
4. **VO back-check — `scripts/verify_vo.py <slug> [--only ids] [--json]`**
   (ship_doc step 3c, right after the VO + hf builds). Local faster-whisper
   (same path as `whisper_srt.py`) transcribes every clip and aligns it
   against the respelled scene text, number runs normalized ("ninety three"
   = "93"). **BLOCK**: any sentence with <60% of its words heard
   (`--threshold`) — the TTS dropped or garbled it; fix with `build_doc_vo.py
   --only <id> --force`. **WARN**: clip similarity <0.85, misses on radio
   recreations (EQ hurts whisper), and phonetic leaks — the transcript
   carrying a respelled code ("seven three seven") whose written form
   ("737") belongs in the uploaded .srt. "ACTUAL ATC RECORDING" clips are
   skipped. Cached by text+clip hash in `out/qa/<slug>_vo_check.json`; exit 3
   = faster-whisper missing (gate not run — ship_doc stops at a checkpoint).

### Phase V→P — Build & publish
1. **Preferred: `python3 scripts/ship_doc.py <slug> <CompId> --music
   public/beds/doc_tension.mp3 --windowed`** — runs lint → radio_recreate →
   build_doc_vo → image audit → `preflight_doc.py` (hard gate) → stills →
   the ONE render+master (windowed bed per the long-doc music rule) → SRT,
   with checkpoints at the sheets and stills. Register `makeDocComp` in Root
   + typecheck before running it. Manual fallback: `build_doc_vo.py <slug>`
   (speed 0.94) → stills → **ONE** `render_and_master.py` run (crash-restart ≠
   checkpoint; never re-render for review). SFX (radio squelch/static, chapter
   booms, stat hits) are automatic in DocWide — see CLAUDE.md "Doc-engine
   studio layer".
2. Append `assets/subscribe-outro/subscribe_blackbox_long.mp4` (16.1s) via the
   CLAUDE.md concat command → ffprobe + splice frame + LUFS verify.
3. Package (`METADATA-<slug>.md`): title (ownable, not "Air Crash
   Investigation" — that's NatGeo's trademark; use it only in tags), A/B alts,
   description w/ parser-safe chapters (0:00 start, ≥10s, plain hyphens),
   ~495-char tags, 15 hashtags, pinned comment, Category Education·Concept
   overview, Standard license, AI-disclosure No, ATTRIBUTION paste note, SRT
   via the manifest sentence-split generator.

### Phase F — Shorts funnel (converts the first 100 subs)
- `src/blackbox/BlackBoxShort.tsx` is now generic: props {startId, endId, hook,
  cta} over any blackbox doc. Pick 3–4 windows of 45–58s that are
  self-contained stories; register comps; render 1080×1920; master.
- Hook card ≤2.5s, big 3-line claim; CTA card funnels to the full doc.
- Post 1/day, strongest hook first; caption = hook + "Full breakdown on the
  channel"; pinned comment links the long-form.
- TODO (first time only): build `subscribe_blackbox_short.mp4` (~9s vertical).

## 2. Cost & time model per episode
$0 images/footage + ~$1 Cartesia (≈3.5K words) + optional ≤$10 Veo.
Wall-clock: research+script ~1h (agents) · assets+audit ~1h · render ~1.5h bg.

## 3. Topic queue (validate before building)
Candidates (high-RPM, archival-rich): Titan submersible* · Chernobyl-adjacent
industrial (Bhopal, Texas City) · Costa Concordia · Tenerife 1977 · Air France
447 · Deepwater Horizon · Rana Plaza · Theranos/FTX (corporate lane) · Hindenburg
· Piper Alpha. *Titan: news imagery mostly copyrighted — verify asset pool
before committing (the pool decides feasibility, not the story).

## 4. Definition of done
- [ ] Icahn evidence logged  - [ ] research brief w/ confidence levels
- [ ] all 3 audit gates passed  - [ ] ONE full render only
- [ ] −14 LUFS verified  - [ ] blackbox outro appended + splice checked
- [ ] METADATA complete (chapters parser-safe)  - [ ] SRT generated
- [ ] 3–4 Shorts rendered  - [ ] attribution files noted for description

## 5. Evidence Engine (Phase E — runs inside Phase A for aviation episodes)
The channel's signature: real recordings + labeled recreations.
1. **Docket pull**: `scripts/fetch_ntsb_docket.py "<accident>" --types audio,pdf,image`
   → `public/shorts/_evidence/<slug>/` + SOURCES.md. NTSB docket material is US
   gov public domain: real ATC audio, CVR TRANSCRIPTS (audio itself is almost
   never released — US law), FDR plots, photos, official animations. Foreign
   boards (BEA/AAIB/KNKT) publish transcript PDFs in final reports.
2. **Radio beats in the doc spec**: scenes with `speaker` ("CAPT"/"FO"/"ATC"),
   `timestamp`, `radioLabel`, text = the documented transcript line VERBATIM
   (no dramatization — the real words are always stronger).
3. **Recreations**: `scripts/radio_recreate.py <slug>` BEFORE build_doc_vo —
   Cartesia per speaker (pitch-differentiated; optional `voices` map in the doc
   spec for distinct stock voices) + ffmpeg radio chain (250–3200Hz bandpass,
   compression, pink-noise bed) → audio/<id>.mp3.
4. **Real audio**: trim docket ATC recordings per scene (ffmpeg -ss/-t) into
   the same audio/<id>.mp3 slots.
5. **HONESTY RULE (hard)**: radioLabel must be "ACTUAL ATC RECORDING" (green)
   only for genuine docket audio; recreations are "CVR RECREATION" (orange).
   DocWide's RadioScene renders the label full-screen — never mislabel, never
   use leaked CVR audio of people dying even if findable.
6. Reference example: doc `docs/radiotest.json` + comp `RadioTest` (US1549
   lines) — render it to hear the radio chain.
7. **Shorts**: a 45–58s pure-radio exchange (waveform + transcript) is a
   proven standalone viral format — cut at least one per episode.

## 6. Visual system — DocWide 2027 chrome (revamp §3.3, Phase 2 #5)
Everything below is **opt-in** except the archival grade: a blackbox doc that
sets none of these fields renders exactly as before, plus the grade.
1. **ArchivalPlate + `Theme.grade`** (default for channel `blackbox`): every
   real photo/footage plate (Illus, Video, chapter/kinetic backdrops, radio
   plates) goes through one component carrying the channel grade token
   (`src/lib/theme.ts` `BLACKBOX_GRADE`: desaturate + sepia, lifted blue-black
   shadows, faint warm highlights, extra plate grain). Other channels use
   `LEGACY_GRADE` = the old filters, pixel-identical. Scene fields: `plate`
   (`blurfill` default | `fill` | `pillar`), `graphic: true` (report figure /
   chart PNG — no grade/grain/stamp), `stamp: "APR 17 2016"` (date-stamp
   chrome; must be the real date of that footage/photo). `hf` scenes never
   touch the plate.
2. **Doc-level switch `"visual": "2027"`** turns on the rest: Black Box lockup
   (recorder glyph + mono wordmark + `"caseId": "NTSB DCA02MA001"`) hidden for
   the first 30 s hook; SourceLine on; ChapterCard progress ticks + the next
   scene's footage as the chapter plate; RadioScene v2. `caseId` alone also
   enables the lockup + Black Box sting (`sting: true`).
3. **SceneChrome layouts** (photo/footage/diagram scenes): `caption` (default
   lower-third) · `slate` — `"slate": {"date", "place", "clock"}` for Fern
   cold opens and dated turns (`clock` = verbatim CLAIMS time; it advances in
   real time only, never toward a figure — replaces faking a slate in `stat`)
   · `quote` — `cap` = the verbatim quote, `"quoteBy"` = attribution line ·
   `none` — footage that should breathe. Preflight WARNs when one layout sits
   on >70% of a 2027 doc's chrome-bearing scenes.
4. **SourceLine** (small mono, bottom-left): `source` text, else the shown
   file's provenance record (`manifest.assets`/`videos`); per scene
   `"sourceLine": true|false|"<text>"`, doc-wide `"sourceLine": true`.
5. **ChapterCard tease-first**: `"kicker"` (short mono tag) and `"tease"` (the
   curiosity question, lands BEFORE the title, which then rises word by word).
6. **RadioScene v2**: the scene's `video`/`img` as a heavily dimmed plate, the
   transcript lit word by word, a CVR/ATC strip whose first and largest
   element is the honesty label (wording/colours unchanged), a level track
   from `manifest.level[id]` (falls back to the mouth track, else a flat idle
   line — never a synthetic waveform), the `timestamp` clock (HH:MM:SS
   advances in real time) and `source`; `quoteBy` adds an attribution line.
7. **Exhibits**: `"paperTone": "warm"|"cool"|"neutral"`, and
   `"exhibitMode": "document"` — the page covers the frame and drifts down to
   the `highlight` (portrait report/filing pages; keep `push` for landscape).
