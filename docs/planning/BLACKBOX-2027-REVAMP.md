# Black Box Breakdown — 2027 revamp spec

Status: proposed 2026-10-23, built from the 5-pillar audit (hyperframes / footage / visual / packaging / benchmark) + critique.
Scope: channel `blackbox`, doc engine `src/mindwired-doc/DocWide.tsx`, scripts under `scripts/`, kit under `hyperframes/`.
Branch state at writing: `scene-kit-hyperframes` is 2 commits ahead of `main` (46e9d83, 6a5103e), 0 behind. Nothing newer on main.

## 1. Thesis

The real-footage pipeline stays the spine — real archival of the actual thing, fetched fresh per episode, honesty-labelled, gated by preflight. The revamp adds two layers on top of it and one layer after it: (a) HyperFrames data scenes (maps, true-scale timelines, FDR charts, report-figure diagrams) declared in the doc JSON and rendered by the same ship command, never in the hook and never displacing real footage of the subject; (b) a visual system inside DocWide that stops archival from looking pillarboxed and templated (blur-fill plates, conditional chrome, real cuts, chapter cards that tease); (c) a packaging/launch layer that turns prose checklists into scripts (publish_kit, thumbs, Shorts from the doc JSON, measured diagnosis). Every new surface that puts a number, a time or a line of dialogue on screen gets a machine trace to `CLAIMS-<slug>.md`.

**"2027 standard" concretely (benchmark audit):**
- Data viz is the moat: fern (5.6M, 23 min avg, maps + timelines + motion graphics), LEMMiNO (custom 3D maps/paths, one accent), neo/Wendover (animated maps, measured narration). Sources: https://outlierkit.com/channel/fern-tv , https://outlierkit.com/channel/lemmino , https://outlierkit.com/channel/waitwhat-24-7
- Report-driven mechanism visuals own aviation forensics (Mentour Pilot / Green Dot: what the crew saw, system diagrams from the final report). https://mighil.com/high-altitudes-deep-insights , https://www.rokuguide.com/node/22956
- Dense curiosity-gap chaptering: YESTERDAY ships 20+ question chapters per 30-44 min video (memory `yesterday-channel-study`); manual chapters override YouTube's auto-chapters, which are now a search signal. https://www.searchenginejournal.com/youtube-seo/205565/
- AI label is now under the player, auto-detected, and PERMANENT for Veo/Dream Screen content (May 27 2026); July 16 2026 demonetises template-based/"inauthentic" videos and AI personas on sensitive topics. https://support.google.com/youtube/answer/14328491 , https://9to5google.com/2026/05/27/youtube-updating-ai-content-labels/ , https://outlierkit.com/blog/youtube-updates-july-2026
- Test & Compare runs title AND thumbnail (3 variants, winner by watch-time share, ~2 weeks). Thumbnails: one subject, 0-5 words that add a fact the title lacks. https://support.google.com/youtube/answer/13861714 , https://www.unilink.us/blog/youtube-thumbnail-design-2026

## 2. Non-negotiables (kept, all from CLAUDE.md / memory)

- Real thing > real category > stock > AI. `fetch_doc_footage.py` remains the sourcing path; NEW VIDEO = NEW FOOTAGE; hook-reuse is render-blocking.
- First ~30 s = real motion video. An `hf` scene is treated as a still by the gate (it must FAIL the first-25s check), not as video.
- Never broadcast news footage; `--niche briefing` for official podiums only.
- Exactly two audio honesty labels: "ACTUAL ATC RECORDING" (docket audio) / "CVR RECREATION". Quoted-transcript gate: every `speaker` line verbatim from CLAIMS. New text-transcript surfaces route through the same `radioLabel` logic and gate.
- No count-up figures (memory `no-count-up-number-animation`). Clocks may advance in real time from a verbatim CLAIMS timestamp; a payoff figure still lands instantly; nothing counts toward a stat value.
- Outro baked into the ONE render (`BB_OUTRO`, 483 f, DocWide.tsx:989-995). NEVER generate a new outro. The vertical Black Box outro is sanctioned ("build when first Short ships") and must be a Remotion re-crop of the existing Reid clip, no Veo spend.
- One full render per episode; 4K default; −14 LUFS; `bed_tension_*` windowed via `--windows`; `doc_*` beds banned.
- No black text cards; chapter/kinetic always carry `img`. Narrator = Cartesia Grant `d46abd1d-…`.
- Every manually-caught defect becomes a preflight gate in the same commit (memory `preflight-lesson-gates`).
- `docs/` layout: root holds only CLAUDE.md / README.md / ONBOARDING.md.

Non-goals: burned-in subtitles (auto-dubbing in 27 languages makes burned English text the worst outcome — subtitles stay OFF, the SRT is uploaded instead); replacing the Veo outro (Akshay decision, Q1); a GCE HyperFrames renderer (HF renders locally, clips ride in `public/shorts/<slug>/video`).

## 3. The four pillars

### 3.1 HyperFrames data scenes

**Current state.** `hyperframes/` is a standalone kit: `scripts/build.mjs` (104 lines) bakes `data/<episode>/*.json` + `templates/<scene>.html` + `theme/mindwired.css` into `scenes/<name>.html`; `scripts/render-all.sh` loops `scenes/*.html` through `hf render --resolution landscape-4k --fps 30` into `out/scene-kit/<ep>-<name>.mp4`. 6 templates (route-map, chart, timeline, exhibit, diagram, title-card), 7 helios522 sample clips rendered at 3840x2160. DocWide consumes nothing from it: `DocScene` (DocWide.tsx:84-184) has no `hf` field, `helios522.json` references zero kit clips, `ship_doc.py` (lines 9-18) has no HF step, `preflight_doc.py` `VISUAL_FIELDS` (115-117) lacks it, `audit_scene_relevance.py:213` would flag any kit clip UNSOURCED.

| Gap | Impact | Effort | Files |
|---|---|---|---|
| No `hf` field; kit clips are hand-copied undeclared `video` scenes (README 81-120) | high | M | DocWide.tsx, scripts/build_hf_scenes.py (new), ship_doc.py, build.mjs, lib/doctiming.py |
| VideoScene grade/drift/gradient (DocWide.tsx:612-615) flattens kit chrome at top 64px / timeline rail 860px | high | S | DocWide.tsx, preflight_doc.py |
| Channel accent dropped: render-all.sh:10 omits `--channel`, build.mjs:25 defaults mindwired cyan | high | S | build.mjs, render-all.sh, preflight_doc.py |
| Stale-scene leak: build.mjs never clears `scenes/`; render-all globs `scenes/*.html` | medium | S | build.mjs, render-all.sh |
| No freshness hash data-JSON/template/theme vs rendered mp4 (VO has `texthash`, preflight 327-338; hf has nothing) | high | M | build_hf_scenes.py, preflight_doc.py, build_doc_vo.py |
| `_facts` is prose; no machine trace of chart `v`, timeline `t`, exhibit `text` to CLAIMS | high | M | preflight_doc.py, hyperframes/data/* |
| Gates misfire: hf passes first-25s real-video (preflight 411-422), blocked on chapter (283-290), UNSOURCED in audit | high | M | preflight_doc.py, audit_scene_relevance.py, gen_doc_srt.py, DocWide.tsx |
| GSAP from jsdelivr CDN (build.mjs:39) — offline/GCE render freezes | medium | S | build.mjs, hyperframes/assets/vendor/ |
| Forensic vocabulary missing: transcript, multi-series chart, clock, instrument, system schematic, debris-map, seat-map | high | L | hyperframes/templates/*.html, README.md |
| Render cost unmeasured, serial (~1-1.5 min per 15 s scene inferred from mtimes) | medium | M | render-all.sh, build_hf_scenes.py |
| Pipeline docs silent on the kit (BLACKBOX-PIPELINE-SPEC, doc-episode SKILL, CLAUDE.md) | medium | S | docs/guides/BLACKBOX-PIPELINE-SPEC.md, .claude/skills/doc-episode/SKILL.md, CLAUDE.md |

**Design decisions (conflicts resolved).**
- **Schema: `hf?: string`** (audit 1 wins over `{scene,data}`). Value = basename of `hyperframes/data/<slug>/<hf>.json`; the data file already carries `scene`; duplicating the type in the doc invites drift. DocWide router resolves `s.hf` to `video: "hf_<hf>.mp4"` before the `s.video` branch (DocWide.tsx:880-923).
- **Ordering: HF renders AFTER `build_doc_vo`** (audit 1 wins over benchmark). `build_hf_scenes.py` writes each data file's `duration = doctiming.scene_frames(scene, manifest)/30 + 0.5` so a clip can never end before the VO. The benchmark quick-win "drop clips in as plain `video` before wiring lands" is rejected: it trips UNSOURCED, the hook gate and the hook-reuse basemap check.
- **Hook rule.** `hf` is added to `VISUAL_FIELDS` and the first-25s gate treats it like a still (BLOCK). Editorial rule in the pipeline spec: HF scenes sit between real footage, never before ~30 s, never replacing real footage of the actual aircraft/ship/place when it exists.
- **Chapter cards: ChapterCard owns the text** (audit 3 wins over audit 1 gap 7(2)). `chapter` + `hf` stays BLOCKED like `chapter` + `video` today, so chapter numbering (preflight 299-313) and `gen_doc_srt` CHAPTERS keep one source. ChapterCard ports the HF title-card choreography (word-by-word, `tease` mono sub line, `kicker`, progress ticks) in Phase 2; the HF `title-card` template is reserved for standalone section plates (`hf` scene with no `chapter` string).
- **Frame ownership on hf scenes: HyperFrames owns the whole frame.** VideoScene branches on `s.hf`: no drift, no filter, no gradient, no `Brand`, no `StatChip`, no `CaptionBar`, no `SourceLine`. Preflight BLOCKS `stat`/`cap` on hf scenes. On every other scene DocWide owns all four corners. This also resolves the top-right Brand/HF-chrome and bottom-right SourceLine/HF-credit collisions.
- **Freshness.** `manifest.hf[sceneId] = {file, sha16(data json + template + theme + build.mjs + hyperframes version), duration, renderedAt}`; preflight BLOCKS on missing entry, hash drift ("rerun build_hf_scenes.py --only <id>"), `ffprobe` duration < scene seconds, or not 3840x2160@30.
- **Claims gate for data JSON.** Walk string values under `{t,time,label,text,tag,sub,title,stamp,source,exitTime,exitLabel}` and numeric `v`/`value`; times `HH:MM[:SS]` and numbers ≥3 digits must appear in `claims_norm`; quoted strings ≥25 chars verbatim (same normaliser as the radio gate, preflight 210-215). `_facts` missing = WARN. Anchors (`## ANCHORS`, §4.1) replace prose `_facts` over time.
- **Transcript template labels.** `transcript` is a silent text surface stamped `TRANSCRIPT · <source doc>` (never "RECORDING"); every line passes the verbatim gate; a following RadioScene with recreated audio keeps `CVR RECREATION`. `clock` template: real-time advance from a verbatim start time only; no T-minus to a stat.
- **Render: local, parallel (`xargs -P 3`), logged** to `out/qa/<slug>_hf_render.log` (wall s, bytes per scene). GCE stays Remotion-only; an `HF_ON_GCE=1` branch only if an episode exceeds ~15 hf scenes and the log proves the need.
- **Attribution.** `build_hf_scenes.py` appends `hf_<name>.mp4 — HyperFrames scene-kit <scene> generated from data/<slug>/<name>.json (CLAIMS-<slug>.md)` to `video/ATTRIBUTION.md` and a PROVENANCE row (`source: hyperframes`, `license: generated`); `audit_scene_relevance.py` skips relevance/UNSOURCED for the `hf_` prefix, keeps reuse counting.

### 3.2 Real-footage + honesty pipeline

**Current state.** `scripts/lib/footage.py`: `transcode()` L835-855 hard-cuts every clip to 20 s from `min(10%, 45 s)`; `verify_relevance()` L935-981 sends ONE frame (~30%, ≤8 s) with a subject-only prompt and fails open; `download_assets()` L984-1099 commits the first `need` passing candidates; `log_attribution()` L858-869 writes free-text markdown only. `fetch_doc_footage.py` reads doc-level `niche` only (L106). `find_clip_start.py` exists but nothing calls it; DocWide starts every clip at `videoFrom ?? 0` (DocWide.tsx:610). Preflight has no license, `videoFrom`, clip-length or era logic. Live evidence: `public/shorts/columbia/video/ATTRIBUTION.md` holds Starlink 2024, Roman Telescope 2024 and a 2019 obituary in a 2003 story; columbia needed 16 hand-set `videoFrom`s.

| Gap | Impact | Effort | Files |
|---|---|---|---|
| 20 s slice truncation; kept slice never what the title/vision check described (memory `footage-20s-slice-root-cause`) | high | M | lib/footage.py, fetch_doc_footage.py, fetch_footage.py, lib/doctiming.py |
| Vision check = 1 frame, subject only; no era/identity/slate; fails open silently | high | M | lib/footage.py, fetch_doc_footage.py, preflight_doc.py |
| Pick-first-not-best: no quality score, no best-of-N (memory `footage-pick-best-not-first`) | high | L | lib/footage.py, fetch_footage.py, fetch_doc_footage.py |
| No auto `videoFrom`; no freeze-frame gate (clip − videoFrom < scene); no shared-clip offset check | high | M | lib/footage.py, find_clip_start.py, fetch_doc_footage.py, preflight_doc.py |
| Niche bias: doc-global ranking, no per-scene niche/sources, no blocklist, no CLAIMS-first fetch | medium | M | fetch_doc_footage.py, fetch_footage.py, lib/footage.py, SOURCES-GUIDE.md, preflight_doc.py |
| Provenance only in free-text ATTRIBUTION.md; four regex shapes to parse back (audit_scene_relevance 65-100) | high | M | lib/footage.py, build_doc_vo.py, audit_scene_relevance.py, preflight_doc.py, provenance_backfill.py (new) |
| No license parse-back at preflight (TSB Crown Copyright reached 41 swissair111 scenes) | high | M | preflight_doc.py, lib/licenses.py (new), lib/footage.py, ship_doc.py |
| Verify verdict never persisted; `--no-verify` leaves no trace | medium | S | lib/footage.py, fetch_doc_footage.py, preflight_doc.py, ship_doc.py |

**Design decisions.**
- **PROVENANCE.jsonl first** (top12 #3, zero behaviour change). One row per file: `{file, sha256, media, source, title, page, url, author, license, lic_key, query, niche, fetched_at, slice:{start,end,source_duration}, suggested_from, verify:{model, frames, verdict, status: verified|skipped|error, era, identity, overlay, quality, reason}, scores}`. ATTRIBUTION.md becomes a human export generated from it. `build_doc_vo.py` embeds `manifest.assets` + `manifest.videos`. Gates read the manifest first, md fallback. `provenance_backfill.py` marks legacy rows `verify.verdict: legacy-unverified`.
- **Slice-aware fetch** (top12 #4): per-prefix `max_seconds` = sum of referencing scene durations (+LEAD/HOLD from doctiming), floor 20, cap 120 for PD/CC archival; start chosen by a frame scan (0/8/15 s and 10/30/50/70/90%) through the vision check, window around the first match, else MISMATCH. `contact_sheet()` renders 3 frames (0/8/15 s) per video tile. `find_clip_start` runs after transcode → `suggested_from`; `--write-back` sets missing `videoFrom` and stepped offsets for consecutive scenes on one clip. Preflight: BLOCK `clip_dur − videoFrom < scene_s − 0.5`; WARN identical offsets on a shared clip; WARN slate at `videoFrom`.
- **Era gate with an aftermath exemption** (critique conflict resolved): doc-level `era: [from, to]`; verify prompt rejects ANACHRONISTIC; but a scene may set `era: "aftermath"` (or use `niche: "briefing"`), which switches the prompt to "footage must be after {to}". Without this the gate deletes exactly the NTSB/NASA briefing footage CLAUDE.md asks for.
- **Vision verdict = strict JSON over 3 frames in one call**: `{subject, era, identity, overlay, quality 1-5, reason}`. `identity: recognisable_person` feeds the caption-identity gate (preflight 180-196) so it can BLOCK instead of guess. Preflight WARN on any unverified asset, BLOCK when it sits in the first-25s window; ship_doc refuses the footage checkpoint with unverified hook assets.
- **Best-of-N stays opt-in** (`--candidates N`, `--keep-candidates`) until the spend ledger (§4.6) exists; `clip_score` = 0.4 vision quality + 0.2 width + 0.15 motion + 0.15 sharpness + 0.1 duration fit, minus overlay/stock penalties. Losing candidates' scores logged in the sidecar.
- **License gate** via `scripts/lib/licenses.py` extending `license_key`: `ogl` allowed+credit, `crown` BLOCK, `tsb-ca`/`atsb`/`bea` WARN with URL unless terms recorded, `pexels`/`pixabay` BLOCK on `speaker`/`exhibit`/real-person caption scenes, `unknown` BLOCK in hook window and exhibits. CC-BY/BY-SA/OGL author strings must appear in `METADATA-<slug>.md` (WARN pre-metadata, BLOCK at publish_kit). Calibrate against the catalog before enabling BLOCKs (SYSTEM-GATES-BACKLOG rule).
- **Niche overrides**: per-scene `niche` / `sources`; doc-level `fetchRules.blocklist`; new `nasa_institutional` niche (`dvids, nasa, nara, archive_org, commons`); CLAIMS `## FOOTAGE` table fetched by exact title before fuzzy search. SOURCES-GUIDE.md updated in the same commit.

### 3.3 Visual system (DocWide)

**Current state.** DocWide.tsx (1000 lines): `VideoScene` 597-634 uses `objectFit: contain` on flat #05070C (pillarboxed 4:3 archival) while `IllusScene` 517-526 blur-fills; three different hand-typed grades (526, 613, 709); every scene fades 12 f in / 10 f out to black (~150 dips per episode); `StatChip` + `CaptionBar` + `Brand` copy-pasted into Illus/Diagram/Video (532-547, 573-588, 616-629) with a constant bottom 44% gradient; `ChapterCard` 452-486 has no tease/progress and `TextSceneBg` 413-450 loads `Img` only; `RadioScene` 349-406 is flat black with a sine-wave fake waveform; `DossierScene` uses Courier New (Sketch.tsx:597, 611, 627) and six sites bypass `dsp()` (DocWide 363, 379, 658, 796, 817, 832). Scene mixes: columbia 152 = 57 video/55 exhibit/26 photo; swissair111 179 = 140 photo/10 radio. `docs/guides/BLACKBOX-PIPELINE-SPEC.md` still prescribes `doc_tension.mp3` (L73), ffmpeg outro concat (L82), 15 hashtags (L87).

| Gap | Impact | Effort | Files |
|---|---|---|---|
| Archival video pillarboxed; no shared plate/grade/era treatment | high | M | DocWide.tsx, build_doc_vo.py, preflight_doc.py |
| No on-screen source/date chrome for footage; columbia fakes a slate in `stat` | high | M | DocWide.tsx, build_doc_vo.py, preflight_doc.py |
| Identical lower-third on every scene; constant gradient | high | M | DocWide.tsx, preflight_doc.py, BLACKBOX-PIPELINE-SPEC.md |
| Chapter cards static, no tease, no video plate | high | M | DocWide.tsx, preflight_doc.py |
| One motion: dip-to-black every cut, Ken Burns by index parity | high | L | DocWide.tsx, lib/doctiming.py, gen_doc_srt.py, render_and_master.py |
| Exhibit has one choreography (55× on columbia) | medium | M | DocWide.tsx, preflight_doc.py |
| RadioScene black + fake waveform | medium | M | DocWide.tsx, build_doc_vo.py, radio_recreate.py, lib/mouthtrack.py |
| Type inconsistencies (Courier New, raw `th.display`) | medium | S | Sketch.tsx, DocWide.tsx, preflight_doc.py |
| Generic brand chrome, no case-file identity | medium | S | DocWide.tsx |
| BLACKBOX-PIPELINE-SPEC stale vs CLAUDE.md | low | S | docs/guides/BLACKBOX-PIPELINE-SPEC.md |

**Design decisions.**
- **`ArchivalPlate`** shared by VideoScene/IllusScene/TextSceneBg: `{src, kind, frame: fill|blurfill|pillar, era?: film|tape|digital}`; default for 4:3 video = blur-fill; `grade` becomes a `Theme` token applied once. **Branches on `graphic`/`hf`: no grade, no grain, no weave** (resolves audit 1 gap 2 vs audit 3 gap 1).
- **`SceneChrome` layouts** chosen by content: `lower-third` | `slate` | `quote` | `stat-bleed` | `none`; gradients conditional on where text sits; preflight WARN when >60% of visual scenes share a layout. New scene fields: `slate?: {date, place, clock}` (clock advances in real time from a verbatim CLAIMS time — never counts to a figure), `quoteBy`, `layout`. Preflight lint: `stat` matching a date regex → suggest `slate`.
- **`SourceLine`** bottom-right (mono 17px) on Illus/Video from `manifest.assets[file]`; off on hf scenes; `doc.hideCredits` may hide PD-only lines.
- **ChapterCard** gains `tease`, `kicker`, word-by-word reveal, progress ticks; `TextSceneBg` accepts `video` (muted, dimmed) and the chapter+video preflight BLOCK relaxes to WARN only once the comp supports it. `chapter_boom` stays.
- **Transitions land LAST in Phase 2**, after SRT-derived chapters (§3.4) and HF duration padding exist, because overlap shifts every scene start: `transition?: cut|dissolve|dip|wipe` with pairing defaults (video→video and radio→* = cut; photo→photo = 8 f dissolve; into/out of ChapterCard = dip). Implemented in `makeDocComp` with overlapping Sequences; `doctiming.py`, `gen_doc_srt.py`, music windows and the chunked-render frame ranges change in the same commit. Phase 0 ships only the no-timing-change subset (skip fades between consecutive video scenes).
- **RadioScene**: real `m.level[sceneId]` RMS track drives bars; `TextSceneBg` plate behind; running CVR strip (timestamp real-time, typed text); labels unchanged in wording and colour, moved top-left.
- **Exhibit modes** `push|detail|redline|stack|stamp` + `paperTone`; `detail` auto-selected for the second consecutive scene on the same page+highlight.
- **Brand**: blackbox lockup (recorder glyph + Plex Mono "BLACK BOX" + optional `doc.caseId`), hidden during the first 30 s hook, blackbox StingScene variant. Type fixes are a Phase 0 quick win plus a lint (`'Courier New'`, `fontFamily: th.display` outside `dsp()`).

### 3.4 Packaging + launch

**Current state.** `ship_doc.py` ends at step 8/8 (SRT); zero packaging checks anywhere. Thumbnails are 20+ copy-pasted `gen_<slug>_thumb.py` scripts writing to `out/thumbs/` (bulk-cleared) — swissair111/twa800/costaconcordia/challengerdisaster/threemileisland have 0 PNGs on disk. Shorts are hand-registered in `src/Root.tsx` (e.g. 1967-1990); `cut_shorts.py:42` reads viral plans only; 9 of 14 recent Black Box slugs lack `SHORTS-SCHEDULE-*.md`. `sept11timeline` has no METADATA file (package lives in root `PUBLISHABLE.md`, violating the layout rule). Chapters drifted 19 s from the master. Diagnosis loop BLOCKED-ON-DATA 13 times since Aug. No YouTube API usage; `src/blackbox/BlackBoxShort.tsx:5-6` bakes `public/outro/subscribe_blackbox_short.mp4`, which does not exist.

| Gap | Impact | Effort | Files |
|---|---|---|---|
| No publish-kit validator | high | M | scripts/publish_kit.py (new), ship_doc.py, lib/doctiming.py, skills |
| Thumbnails = one-off scripts in a wiped dir; no House Style 2.0 checks | high | M | scripts/gen_thumbs.py + lib/thumbs.py (new), assets/thumbs/, THUMBNAILS.md |
| Shorts not cuttable from a doc JSON | high | L | scripts/cut_doc_shorts.py (new), BlackBoxShort.tsx, Root.tsx |
| 48 h diagnosis loop has no data path | high | L | scripts/yt_studio_pull.py, scripts/launch_diagnose.py (new), LAUNCH-LESSONS.md |
| No upload path | medium | L | scripts/yt_upload.py, lib/youtube_auth.py (new) |
| Title scoring subjective, unrecorded | medium | S | scripts/score_titles.py (new), docs/planning/packaging/<slug>.json |
| Chapter timestamps drift from manifest estimate | medium | S | gen_doc_srt.py, whisper_srt.py, publish_kit.py |
| Episode status scattered (PUBLISHABLE.md, HANDOFFs, memory) | medium | M | docs/planning/episodes.json, scripts/render_status.py |
| Thumb-fingerprint / title-opener repetition never checked | low | S | publish_kit.py, lib/thumbs.py |

**Design decisions.**
- **`assets/thumbs/<slug>_{A,B,C}.png` + one script `scripts/gen_thumbs.py`** (audit 4 wins over benchmark's `out/thumbs` + `gen_doc_thumb.py`). ctr-engine / publish-video / doc-episode paths updated in the same commit.
- **Chapter counting**: publish_kit asserts the METADATA CHAPTERS block is a superset of `chapter` scenes (every chapter scene present, first at 0:00, ≥10 s gaps); extra question-phrased sub-chapters (15-25 on 20+ min docs, emitted from kinetic/exhibit turning points) are allowed and encouraged. Preflight WARN when chapters/min < 0.6 on a 20+ min doc.
- **AI disclosure** is a per-episode `AI use: YES/NO + rationale` line in METADATA, written from facts preflight prints (dossier/generated scene count, outro type, library narrator). `yt_upload.py` reads that line; it never hard-codes `containsSyntheticMedia`.
- **Outro**: no engineering task touches `subscribe_blackbox_long.mp4` until Q1 is answered. The vertical outro is built before any Shorts tooling, baked inside `BlackBoxShort` (never ffmpeg-appended); evidence cuts (90-150 s) go through `cut_doc_shorts.py`, not the viral path.
- **Diagnosis**: `yt_public_pull.py` (yt-dlp) ships first; Analytics/Upload OAuth is Phase 3 and depends on Q3. Test & Compare verdicts remain a manual paste.
- **`docs/planning/episodes.json`** is the single status record, written by ship_doc (rendered), publish_kit (packaged), `--mark-published` (published + diagnosis_due), launch_diagnose (diagnosed); PUBLISHABLE.md and the LAUNCH-LESSONS publish table are generated from it.

## 4. Also — areas the critique found uncovered

- **4.1 Narration-level CLAIMS tracing.** Preflight tracer over `text`/`cap`/`stat`/`chapter`: times, numbers ≥3 digits (comma-stripped, spoken respellings reversed via `scripts/lib/pronounce.py`), 4-digit years, capitalised bigrams → WARN when absent from `claims_norm`, BLOCK for `stat` and `exhibit` text. `## ANCHORS` convention in CLAIMS (`- [c12] 09:12:38 EEST cabin altitude horn — AAIASB 11/2006 p.42`, labelled CONFIRMED/DISPUTED/ALLEGED), scene `claims?: ["c12"]`, HF data `claims: [...]` replacing `_facts`; `scripts/claims_lint.py <slug>`. Calibrate on columbia/swissair111/twa800 before BLOCKs.
- **4.2 VO back-check.** `scripts/verify_vo.py <slug> [--only ids]`: faster-whisper per clip, WER vs the respelled script, `manifest.vo_check[id]`; preflight WARN >0.08, BLOCK >0.15 or any missing number/name token; SRT asserted free of respellings (`seven three seven`). ship_doc step 3c, idempotent by texthash.
- **4.3 Episode archive.** `scripts/archive_episode.py <slug>` after a successful master: tar `public/shorts/<slug>/{audio,images,video,ATTRIBUTION*,PROVENANCE.jsonl}` + manifest + doc JSON + `hyperframes/data/<slug>` + `out/qa/<slug>_*` → `archive/episodes/<slug>-<sha>.tar.zst` + offsite copy with the 4K master; URI recorded in episodes.json; `--restore`. Location is Q5.
- **4.4 Sensitivity gate.** Doc-level `sensitivity: {victimsNamed, graphic, memorialBeat, bannedTerms}`; preflight BLOCK on victim names in cap/stat/chapter without `victimsNamed: true` + rationale, BLOCK per-person identifiers in seat-map/debris-map data, WARN no memorial beat in the last 10% of a fatal-accident doc, BLOCK channel banned-vocabulary (United 93 / 9/11 rules); METADATA `sensitivity` section checked by publish_kit; `docs/guides/SENSITIVITY-GATE.md` codifies publish-video §6.
- **4.5 Audio QA.** `scripts/audio_qa.py <master>`: ebur128 integrated/LRA/true-peak (BLOCK > −1 dBTP), VO-vs-bed delta inside music windows (WARN < 12 dB under); `bed` recorded in episodes.json, BLOCK same bed as the previous upload on the channel; VO-only stem exported by `render_and_master.py`. Generated beds stay parked.
- **4.6 Spend/time ledger.** `scripts/lib/ledger.py log(slug, kind, qty, unit, usd_est)` called from build_doc_vo (chars), footage verify (Gemini calls), build_hf_scenes (wall s), render_gce.sh (machine-min), render_and_master (wall s) → `docs/planning/ledger/<slug>.jsonl`; `report` prints $/episode. Prerequisite for best-of-N by default.
- **4.7 Black Box vertical outro** — see §3.4; `assets/subscribe-outro/subscribe_blackbox_short.mp4` (1080x1920, 240 f), copied to `public/outro/`, CLAUDE.md table row, preflight/publish_kit assert existence for any BlackBoxShort render.

## 5. Phased plan

Order follows the critique's top12 and its dependency graph (1 → 2 → 8; 3 → 4, 5; 7 → 10, 11, 12). Each item: deliverable → done-when.

### Phase 0 — this week (quick wins, no schema or timing changes)
1. Merge `scene-kit-hyperframes` → `main` (fast-forward; working tree clean). Done when: `git log main..scene-kit-hyperframes` empty.
2. HF hygiene bundle (top12 #1): `build.mjs` reads `channel` from `src/mindwired-doc/docs/<episode>.json` (CLI overrides), clears `scenes/` + `compositions/` (except `components/`), emits `.hyperframes/built-<episode>.json`; `render-all.sh` iterates that list; gsap@3.14.2 vendored to `hyperframes/assets/vendor/`, build fails on any `http(s)://` in emitted HTML. Done when: a helios522 build with doc channel blackbox greps `--accent: #FF9500` in every `scenes/*.html` and renders with Wi-Fi off.
3. DocWide visual quick wins (top12 #6): blur-fill behind VideoScene (copy IllusScene 517-526), bottom gradient only when `cap` present (530, 571, 615), skip fade-in/out between consecutive `video` scenes (pass prev/next from makeDocComp 876-879), Courier New → `th.mono` (Sketch.tsx 597/611/627), `dsp()` at DocWide 363/379/658/796/817/832, plus the lint. Done when: a 4-still render of columbia shows no pillarbox bars and the lint passes on `src/mindwired-doc`.
4. `publish_kit.py` v0 as ship_doc step 9/9 (top12 #7): existence/parse checks for root `<Title>.mp4`+`.srt`, `METADATA-<slug>.md` (title 30-50 chars + 2 alts, CHAPTERS, MORE FROM with no `[paste URL]`, 3-5 hashtags, pinned, `AI use:` line), 3 PNGs in `assets/thumbs/`, `SHORTS-SCHEDULE-<slug>.md`, HANDOFF. `git mv PUBLISHABLE.md docs/planning/`; create `docs/metadata/METADATA-sept11timeline.md`; create `assets/thumbs/` and `git mv` the four surviving sets; re-run the five lost `gen_*_thumb.py` with OUT pointed there; update the three skills' paths. Done when: `publish_kit.py columbia` exits 0 and `publish_kit.py sept11timeline` exits non-zero only on items genuinely missing.
5. Footage quick wins: `contact_sheet()` 3-frame strips; per-prefix `max_seconds` from scene durations; `find_clip_start` called after transcode with `suggested videoFrom=` printed; per-scene `niche`/`sources` honoured in the plan loop (fetch_doc_footage.py L119-132); `log_attribution()` also appends to `PROVENANCE.jsonl` with `verify.status`. Done when: a `--dry-run` prints the effective ranking per prefix and a real fetch writes one jsonl row per saved file.
6. Doc hygiene: strip BLACKBOX-PIPELINE-SPEC lines 3-4, 73, 82, 87; add the HF section (beat→template table, three authoring rules); add the doc-episode SKILL step; one paragraph in CLAUDE.md under "The three video systems"; fill the Black Box publish slot row (Q2). Done when: grep for `doc_tension` and `concat` in the spec returns nothing.

### Phase 1 — HyperFrames into the doc engine + honesty gates (proof on helios522)
1. `hf?: string` on `DocScene`; router resolves to `hf_<name>.mp4`; VideoScene `hf` branch (no drift/filter/gradient/Brand/StatChip/CaptionBar). `scripts/build_hf_scenes.py <slug> [--only ids]` per §3.1 (durations from doctiming + 0.5 s pad, channel from doc, parallel render, `out/qa/<slug>_hf_render.log`, ATTRIBUTION + PROVENANCE rows, `manifest.hf` hashes). ship_doc step 3b after build_doc_vo. Done when: `helios522.json` declares the 7 existing data files as `hf` scenes and `ship_doc.py helios522 <Comp> --yes` builds them without hand steps.
2. Preflight hf gates: `hf` in VISUAL_FIELDS; first-25s treats hf as still (BLOCK); `stat`/`cap`/`chapter` on hf BLOCK; missing `manifest.hf`, hash drift, duration < scene, wrong resolution/fps, accent mismatch vs `THEMES[doc.channel]` all BLOCK; `audit_scene_relevance.py` skips relevance/UNSOURCED for `hf_`. Done when: editing `chart-altitude.json` without rebuilding makes preflight BLOCK with the rerun command, and moving an hf scene to position 1 BLOCKs on the hook rule.
3. HF data-JSON claims gate + narration tracer + `## ANCHORS` + `claims_lint.py` (top12 #8, §4.1). Done when: a typo'd `v` in `chart-altitude.json` BLOCKs preflight, and the tracer runs WARN-only on columbia/swissair111/twa800 with a logged false-positive rate before any BLOCK is enabled for `stat`/`exhibit`.
4. `verify_vo.py` as ship_doc step 3c (top12 #9). Done when: a clip with one dropped sentence BLOCKs; the SRT assertion catches `seven three seven`.
5. Sensitivity gate v1 (top12 #12, §4.4) + `docs/guides/SENSITIVITY-GATE.md`. Done when: a victim surname in a `cap` BLOCKs without `victimsNamed: true`.
6. Ledger hooks in build_doc_vo, footage verify, build_hf_scenes, render_and_master (§4.6). Done when: `ledger.py report helios522` prints Cartesia chars, Gemini calls, HF wall seconds and render wall seconds.

### Phase 2 — visual system + footage pipeline fixes
1. Structured provenance end-to-end (top12 #3): `manifest.assets`/`manifest.videos` in build_doc_vo; gates read manifest first; `provenance_backfill.py` over existing slugs; UNSOURCED → BLOCK in hook window and exhibits; verify `status` surfaced (WARN / hook BLOCK). Done when: `preflight_doc.py columbia` reports the four anachronistic files as `legacy-unverified`.
2. Slice-aware fetch + videoFrom + clip-length gates (top12 #4) and era + multi-frame verify with the aftermath exemption (top12 #5); `fetchRules.blocklist`, `nasa_institutional` niche, CLAIMS `## FOOTAGE` table; SOURCES-GUIDE mirror. Done when: a refetch of columbia's `launch_*` prefix yields a slice containing launch frames at 0/8/15 s, and a 2024 Starlink clip is rejected as ANACHRONISTIC while a 2003 NASA briefing passes under `era: "aftermath"`.
3. License gate (`lib/licenses.py`) calibrated on the catalog, then BLOCKs on. Done when: a TSB Crown-Copyright page in an exhibit BLOCKs with its URL and a CC-BY credit missing from METADATA fails publish_kit.
4. SRT-derived chapters (top12 #10): `gen_doc_srt.py --from-srt`, per-chapter drift print, publish_kit FAIL > 5 s, drift-accumulation log. Done when: the next master's CHAPTERS block agrees with whisper cues within 5 s per chapter.
5. Visual system: `ArchivalPlate` + `Theme.grade`, `SceneChrome` layouts + `slate`/`quoteBy`, `SourceLine`, ChapterCard `tease`/`kicker`/progress + `TextSceneBg` video, RadioScene level track + plate + CVR strip, exhibit modes + `paperTone`, blackbox lockup/`caseId`/sting variant. Done when: 4 stills per new scene type are approved and preflight's layout-concentration WARN fires on a doc that sets one layout everywhere.
6. Transitions with overlap, last: DocWide + doctiming + gen_doc_srt + music windows + chunked-render ranges in ONE commit; HF pad verified against the new scene_frames. Done when: `doctiming.body_seconds` equals the rendered body ±1 frame on a test doc with every transition type, and the SRT-chapter check from step 4 still passes.
7. New HF templates with CLAIMS fixtures: `transcript` (stamp `TRANSCRIPT · <doc>`, verbatim gate), chart `series:[...]` + secondary axis, `clock` (real-time only), `instrument` + `system` (report-figure-driven, `RECONSTRUCTION FROM FDR DATA` stamp), `debris-map`; `seat-map` only in aggregate mode under the sensitivity gate. Done when: each has a sample under `hyperframes/data/<slug>/` that passes the data claims gate and renders through build_hf_scenes.
8. Best-of-N behind `--candidates`, `audio_qa.py` + bed rotation BLOCK + VO stem, `archive_episode.py` (location per Q5). Done when: the ledger shows the Gemini-call cost of one best-of-3 fetch and `archive_episode.py --restore` rehydrates a slug into a passing preflight.

### Phase 3 — packaging / launch automation
1. Vertical Black Box outro (§4.7), baked into `BlackBoxShort`. Done when: a BlackBoxShort render ends on Reid at 1080x1920 and preflight asserts the file.
2. `gen_thumbs.py` + `lib/thumbs.py` (top12 #11): `thumbs` block in the doc JSON or auto-proposal from the real image pool; House Style 2.0 hard checks (1920x1080, ≤1 word ≤10 chars not in the title, source ≥1280 px, luminance band); 170/320/1280 px squint sheet; phash + title-opener lineage WARNs against the last 4-5 uploads. Done when: the 20+ `gen_*_thumb.py` are deleted and `publish_kit` accepts only builder output.
3. `cut_doc_shorts.py`: `shorts` array in the doc JSON (validated as cut_shorts.py:29-35 does; proposes cuts when absent, excludes chapters and `sensitive` scenes), generated comp registry (no hand edits to Root.tsx), renders via render_and_master to `out/shorts_final/` + copy to `assets/shorts/<slug>/`, writes `SHORTS-SCHEDULE-<slug>.md` with absolute dates from the publish slot; 90-150 s evidence-cut type. Done when: publish_kit check (5) passes from generated files only.
4. `episodes.json` + `render_status.py`; `score_titles.py` with `docs/planning/packaging/<slug>.json` (locked/shipped/tc_winner); publish-video runs paired title+thumbnail Test & Compare and logs the watch-time-share verdict; "do not edit title during test" guard; chapter-density rule (15-25 question chapters); auto-dubbing ON + SRT upload + dub spot-check item. Done when: icahn-validate Step 0 and publish-video §7 read/write episodes.json and no hand-maintained publish table remains.
5. `yt_public_pull.py` (yt-dlp) first; then, if Q3 = yes, `lib/youtube_auth.py`, `yt_studio_pull.py` (retention curve, traffic sources, comparable in one call), `launch_diagnose.py` applying launch-diagnosis's decision tree and appending to LAUNCH-LESSONS, `yt_upload.py` (videos.insert, thumbnails.set, captions.insert, playlistItems.insert; prints the "finish in Studio" list; reads `AI use:` from METADATA; `--privacy private` default). Done when: the 48 h loop closes without a pasted screenshot on the next upload.

## 6. First episode on the new pipeline — selection criteria

The proof episode must exercise every Phase 0-1 capability plus the Phase 2 footage fixes, so pick a topic with ALL of:
- A real route or holding pattern (route-map), ≥8 report-timestamped events (timeline), one FDR series pair such as altitude + cabin altitude or altitude + airspeed (multi-series chart), one causal mechanism from the final report's own figure (diagram / instrument).
- Real docket audio or an official transcript so RadioScene + the quoted-transcript gate and the `transcript` template all run with honest labels.
- ≥3 PD report pages for ExhibitScene and the license gate (US NTSB preferred over TSB/BEA Crown-copyright pages).
- Real PD motion video of the actual aircraft/ship for the first 30 s, plus a post-event official briefing (exercises `era: "aftermath"`), and an `era` span that makes the anachronism gate bite (pre-2010 event).
- A fatal accident (sensitivity block, memorial beat, aggregate-only seat data) and a 20+ min script (chapter density, windowed music, VO back-check at scale).
- A written CLAIMS file with `## ANCHORS` and a `## FOOTAGE` table before any fetch.

Recommended: **Helios 522** — the 7 HF data files, CLAIMS file and a 55-scene blackbox doc already exist, so Phase 1 is proven on it with no new research; if it has already shipped or Akshay prefers a fresh Icahn-validated title, **US1549** (validated, real docket audio fetched) is the fallback. Either way the episode is not "done" until it has ≥6 `hf` scenes, zero hand-copied clips, a passing preflight with every new gate enabled, and a publish_kit exit code of 0.

## 7. Open questions for Akshay — DECIDED 2026-10-23

1. **Outro:** re-layout the existing Reid clip in Remotion (same VO, no new Veo generation) → no forced AI label. Phase 3.1 covers both the long re-layout and the vertical variant.
2. **Publish slot:** Saturday 10:00 IST. All Shorts drip dates and bed-rotation checks key off it.
3. **YouTube OAuth:** yes — Akshay will create the Google Cloud OAuth client; `client_secret.json` stays outside git. Phase 3.5 full path is on.
4. **Proof episode:** Helios 522 already published (Jul 31, 0tT8C6v1Sj0) — the spec's recommendation is superseded. Proof episode = **US1549** (Icahn-validated, real NTSB docket audio fetched). Must still be run through doc-episode Step 0 (locked package / LAUNCH-LESSONS loop) before scripting.
5. **Archive:** default to external drive via `.env ARCHIVE_ROOT`; GCS only if Akshay asks.

Original questions kept below for the record.

1. **Veo outro vs permanent AI label.** Keeping `subscribe_blackbox_long.mp4` means every episode carries a player-level "AI" label that cannot be removed. Accept it, or authorise a Remotion-only re-layout of the existing Reid clip (same VO, no new generation)? This decides the METADATA default and whether the outro table changes.
2. **Black Box publish slot** (day + time, LAUNCH-LESSONS.md:15 is TBD). Every Shorts schedule date, the bed-rotation check and the future `--at` default key off it.
3. **YouTube OAuth.** Will you create a Google Cloud OAuth client (Analytics read + upload) and keep `client_secret.json` outside git? If no, Phase 3.5 stays yt-dlp public counts + manual Studio and the 48 h loop remains partly manual.
4. **Proof episode.** Helios 522 (fastest, data exists) or a fresh validated title (US1549)?
5. **Archive location** for per-episode tars + 4K masters: GCS bucket (ongoing cost, same gcloud auth as render_gce.sh) or an external drive path via `.env ARCHIVE_ROOT`?
