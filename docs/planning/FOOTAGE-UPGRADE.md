# FOOTAGE-UPGRADE — the anti-"AI slop" overhaul (2026-07-19)

Triggered by real viewer comments ("Bloody AI slop!", "Poorly visuals", "Would be
a great channel if not an AI voice") plus the two-MH370-videos-same-takeoff-clip
incident. Three root causes, three fixes, all verified by running them.

## TL;DR — what changed

| Problem | Fix | Where |
|---|---|---|
| AI/stylized footage where viewers expect real | 12-source real-footage fetcher, ranked per niche | `scripts/fetch_footage.py` + `scripts/lib/footage.py` |
| Scene↔visual mismatch (Oakland takeoff under a KL narration; 1942 USMC promo as "ocean") | relevance audit: narration vs the asset's actual source title | `scripts/audit_scene_relevance.py`, wired into `preflight_doc.py` |
| Same clips recycled across videos (both MH370 docs shared 18 identical files) | cross-video byte-hash ledger; hook reuse = render-BLOCKING | same audit, `HOOK-REUSE` = exit 2 |
| Robotic VO | removed blanket `<break>` tags (Cartesia docs: they degrade naturalness), speed 0.92→0.97/1.0, pinned dated model snapshot, run-by-ear gate in ship_doc | `scripts/lib/cartesia.py`, `scripts/vo_ab_test.py`, `scripts/ship_doc.py` |
| TTS mangling codes | 10 new lint patterns (registrations, FL###, runways, frequencies, units, ALL-CAPS emphasis) | `scripts/lint_tts_text.py` |

## Pillar 1 — source research (9 parallel agents, every endpoint live-tested)

### INTEGRATED (all in `scripts/lib/footage.py`, orchestrated by `fetch_footage.py`)

| Source | API | Auth | License | Monetize-safe | Live-tested proof |
|---|---|---|---|---|---|
| Internet Archive | advancedsearch.php + /metadata/<id> + /download/ | none | per-item `licenseurl`; trusted PD collections: prelinger, universal_newsreels, usgovfilms (FedFlix), nasa | yes inside trusted collections; user uploads NOT trusted | Explorer VI newsreel mp4 downloaded end-to-end (6.7MB h.264, PD); 595/611 universal_newsreels carry PD licenseurl |
| Universal Newsreels | collection:universal_newsreels | none | PD (Universal gifted them to the American people, 1976, National Archives custody) | **yes — cleanest video-PD claim on the site**; also strongest Content ID dispute basis | 48 hits for "rocket" |
| NASA Image & Video Library | images-api.nasa.gov/search + /asset/<id> | none | PD (US gov). No logo-endorsement use | yes | "Ultimate Saturn V Launch" ~orig.mp4 fetched via pipeline |
| NASA SVS | svs.gsfc.nasa.gov/api/search/?search= | none | PD, credit "NASA SVS" | yes | 349 hits "space station"; black-hole UHD mp4s returned by our module |
| National Archives (NARA) | catalog.archives.gov/proxy/records/search (keyless) | none | `useRestriction: Unrestricted` = PD | yes (filter enforced in module) | 3,969 "apollo" moving-image hits; 434MB TOPOCOM mp4 HEAD 200 |
| Library of Congress | loc.gov/search/?fo=json&fa=online-format:video | none | keep only "no known restrictions"/PD rights | yes with rights filter | 1910 Roosevelt aviation film, direct tile.loc.gov mp4 (250s, 1440×1080). **20 req/min limit; 1-hour block past it** |
| ESO / ESA-Hubble / ESA-Webb | djangoplicity: /videos/archive/search/ + /videos/<id>/api/json/ | none | CC BY 4.0 (credit field verbatim) | yes with credit; music in some clips stripped by our `-an` transcode | eso2609b 1080p25 mp4 (20MB) HEAD 200; 4,386 ESO videos, 1,700 Hubble, 270 Webb |
| NOAA Ocean Exploration | oceanexplorer.noaa.gov/wp-json/wp/v2/media?search= | none | US-gov PD, courtesy credit | yes | shipwreck-expedition mp4s returned by our module |
| DVIDS | api.dvidshub.net/search + /asset | free key (`DVIDS_API_KEY`) | US-military PD; no DoD-endorsement implication | yes for documentary b-roll | endpoint live (401 without key, as documented) |
| Pexels | api.pexels.com/videos/search | free key (`PEXELS_API_KEY`, 200/hr, 20K/mo) | Pexels License (bespoke, NOT CC0) | yes for composited b-roll; no standalone redistribution | docs quoted; module degrades gracefully without key |
| Pixabay | pixabay.com/api/videos/ | free key (`PIXABAY_API_KEY`, 100/60s) | Pixabay Content License (bespoke, NOT CC0) | yes composited; skip branded/logo clips | docs quoted; module degrades gracefully |
| Wikimedia Commons (upgraded) | action API + CirrusSearch | none | per-item, PD/CC only kept | yes | duration field now read from imageinfo; junk-title results killed by query ranking |
| Openverse | api.openverse.org/v1/images/ | none (higher limits with key) | CC filterable | yes with filter | already in production (fetch_media.py) |

### SKIPPED after honest legal audit (do not integrate)

- **Videezy** — ToS/license conflicts for scripted commercial use.
- **Mazwai, Life of Vids** — dead sites; nothing to license.
- **Schmidt Ocean, MBARI, WHOI, EV Nautilus** — NC or permission-only. The ocean
  niche's free lane is NOAA + Commons; everything else needs written permission.
- **ISRO, JAXA** — no commercial grant (JAXA expressly prohibits).
- **British Pathé / AP / Reuters** — paid archives. Universal Newsreels is the free substitute.
- **Coverr** — API exists (key-gated) but the library now mixes in AI-generated
  clips — integrating it would smuggle AI footage back into the "real footage"
  pipeline. Manual cherry-pick only, if ever.

### MANUAL-ONLY (license fine, no clean scriptable path)

Mixkit (best license in its family, no API), FAA.gov media pages, Getty Open
Content, Smithsonian Open Access (CC0 images, api.data.gov key), Europeana
(`reusability=open`), NYPL Digital Collections, Flickr Commons incl. San Diego
Air & Space Museum archive.

## Pillar 1 — verification (real downloads)

Three test queries fetched end-to-end (search → license filter → download →
1080p H.264 transcode → ATTRIBUTION.md → contact sheet in `out/qa/`):

- `"boeing 777 landing"` (aviation) → real Asiana 214 footage + NTSB animation
  (PD/BY-SA). Also produced the poster-child failure: a "Wikipedia Edit 2014"
  sticky-note video ranked in — which drove the query-relevance ranker
  (`rank_by_query`: title-weighted keyword+bigram overlap, zero-scorers dropped).
- `"deep ocean submersible"` (ocean) → Ifremer corporate film (CC-BY) + OceanGate
  Cyclops development footage; near-duplicate titles drove the normalized-title dedup.
- `"Saturn V rocket launch"` (space) → "Ultimate Saturn V Launch w Enhanced Sound"
  + "Film to Tape — Apollo, Saturn V, Crawler, VAB, Pad 39A" (real Apollo-era PD).
  This query exposed 3 real bugs, all fixed: nasa_id URLs with spaces 404ing,
  AND-only API search starving recall (now progressively broadens, re-ranks
  against the full query), and description text drowning title matches (title
  now weighted 3×).

## Pillar 2 — relevance audit (run it: `python3 scripts/audit_scene_relevance.py <slug>`)

Resolves the EXACT file each scene shows (same per-prefix rotation as DocWide),
then compares narration against what the file actually is (source title parsed
from ATTRIBUTION.md). On mh370 it flagged, among 97 warnings + 3 blocks:

- `a13` — narration about the KL takeoff, clip is "Takeoff From Oakland
  International Airport (OAK)" → MISMATCH (the exact incident that triggered this project)
- `d1/d7/d9/d11` — "Oregon Coast Odyssey FPV Drone" standing in for the Indian Ocean
- `cockpitnight.mp4` on 14 scenes; `earthnight.mp4` on 11 (cap is ~3)
- `h1/h2/h4` — hook clips byte-identical to mh370theories' files → **HOOK-REUSE,
  render-blocking** (exit 2 → preflight BLOCK)

Signals: keyword overlap, "foreign entity" detection (proper nouns/years in the
asset title that appear nowhere in the doc — catches the 1942 USMC promo), 
UNSOURCED files (no ATTRIBUTION entry = likely AI-generated — must never depict
real events), per-file use counts, adjacent-scene repeats, and the cross-slug
byte-hash ledger. Wired into `preflight_doc.py`: hook-reuse blocks, the rest warns.

## Pillar 3 — VO (evidence in `out/qa/vo_ab/`)

Docs audit of docs.cartesia.ai (sonic-3/3.5) found the smoking gun: our
`with_pauses()` injected `<break>` after EVERY sentence — Cartesia explicitly
warns break tags "split the generation… speech can sound less natural" and
stacking them "can cause hallucinations". Measured: the old config was 20.2s vs
16.4s for the same paragraph = **~19% injected dead air**.

Changes (all in `scripts/lib/cartesia.py`):
1. Blanket breaks REMOVED — punctuation drives prosody; a deliberate `[pause]`
   marker in scene text becomes one 750ms dramatic break.
2. Default speed 0.92 → 1.0 (`build_doc_vo.py` default 0.97) — global slowdown
   is a documented robotic-cadence contributor; chapter cards keep their −0.02.
3. Model pinned to dated snapshot `sonic-3.5-2026-05-04` (verified live, HTTP
   200) so idempotent per-clip rebuilds weeks apart can't drift timbre;
   auto-falls back to `sonic-3.5` if the snapshot retires.
4. Emotion map fixed to documented enum: curiosity→`curious`, awe→`amazed`
   (both valid; suffixed values like "scared:high" are deprecated-invalid).
5. `volume` param exposed (0.5–2.0) for hushed dread beats.
6. Scene-level paragraph requests confirmed CORRECT per docs (per-sentence
   would create prosody seams) — kept.
7. `ship_doc.py` gained a run-by-ear gate: hook+middle+last VO clips spliced
   into `out/qa/<slug>_vo_sample.mp3` with a LISTEN checkpoint.
8. Lint upgrades: registrations (9M-MRO), N-numbers, FL350, runway designators,
   radio frequencies, abbreviated units, No./v2.0, and ALL-CAPS emphasis words
   in spoken text (TTS spells them letter-by-letter; caps belong on-screen).
   Zero new false positives on the shipped corpus; guard suppresses
   "air-to-air"/"O-ring" lookalikes.

**A/B files to listen to (pick the channel default by EAR):** `out/qa/vo_ab/`
— a_old_breaks_092 / b_nobreaks_092 / c_nobreaks_097 / d_nobreaks_100 /
e_calm_100 + README.md with settings/durations.

## New-episode default path (also in CLAUDE.md)

1. Write scenes → `fetch_footage.py "<specific query>" --niche <n>` per subject
   (SPECIFIC queries: the aircraft type, the ship name, the place — not "ocean").
2. Eyeball every contact sheet in `out/qa/`.
3. `audit_scene_relevance.py <slug>` until clean-ish; fix MISMATCH/WEAK by
   refetching, never by hoping.
4. `ship_doc.py` runs everything (lint → VO → ear-check → sheets → preflight →
   stills → ONE render → SRT); hook reuse across videos cannot reach a render.

## Adversarial review (before commit)

3 reviewer agents + per-finding refutation agents ran over everything above;
14 findings confirmed and ALL fixed + re-verified, the big ones being: an NC/ND
license leak (C-SPAN by-nc-sa items inside usgovfilms would have been logged
"Public domain" — trusted-collection PD now applies only when an item declares
NO license), download accounting that could silently fetch zero files,
odd-dimension sources failing every transcode (force_divisible_by=2), the
cross-slug ledger blocking legitimate Hindi-twin localizations
(spacedeaths-hi symlinks spacedeaths' images — now family-exempt), preflight
swallowing audit crashes, a silent Cartesia model-fallback that defeated the
snapshot pin, and the `[pause]` marker leaking into shipped SRTs.

## Open follow-ups

- Sign up for the free keys when wanted: Pexels, Pixabay, DVIDS (each unlocks a
  ranked source; pipeline works without them).
- WebSocket `context_id` continuations (prosody continuity across scene clips
  within a chapter) — bigger refactor of build_doc_vo, documented option.
- Europeana/Smithsonian modules if the history/museum lanes need stills at scale.
