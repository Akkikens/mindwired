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

### Phase V→P — Build & publish
1. `build_doc_vo.py <slug>` (speed 0.94) → register `makeDocComp` in Root →
   typecheck → stills → **ONE** `render_and_master.py` run (crash-restart ≠
   checkpoint; never re-render for review).
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
