# FERMI PARADOX — episode handoff (mindwired)

**STATUS (2026-08-20): RENDER-READY, awaiting Akshay's review + upload.**
Everything below is done: 4K master, SRT, 3 thumbnails, 4 funnel Shorts.

Icahn PASS (memory `icahn-fermiparadox`) — picked from a 14-agent NEO/LEMMiNO
catalog sweep (memory `icahn-neo-lemmino-sweep`); triple-corroborated fresh
small-channel outlier evidence. Akshay explicitly asked for "100% effort" on
this one — research ran as a 9-agent Workflow (7 research streams + 2
adversarial fact-check passes) instead of the normal single-pass research
step. All gates green: TTS lint clean · relevance audit 0 blocking (10
warnings, all individually verified false-positive or genuine-scarcity real-
asset reuse) · preflight 0 blocking · comp stills eyeballed throughout (cold
open, title card, Fermi blackboard, K2-18b spine, Arecibo collapse video,
chapter 8 card, mid-body, outro — all real footage rendering correctly,
outro splice clean).

**Render path:** GCE 32-core on-demand VM throughout (auth already valid,
no mid-render switch needed this time). Mastered to −14.1 LUFS, windowed
`bed_awe_eventhorizon.mp3` across 11 beats, VM auto-deleted on completion.

## Why this topic, why now

Akshay asked to study NEO and LEMMiNO (the same way YESTERDAY was studied
for Bermuda Triangle) and recommend mindwired's next video, explicitly
authorizing unlimited research time. The Fermi Paradox won a 14-agent sweep
on real triple-corroborated fresh outlier evidence (see
`icahn-neo-lemmino-sweep`), beating a strong Thai Cave Rescue runner-up.
Akshay then said "go ahead on fermi, 100% effort" — this ran as a 9-agent
research Workflow (origins/Great-Filter/dark-forest/stats/3I-ATLAS/footage/
competitive + 2 fact-checks) rather than the standard single-pass research
step, specifically to honor that instruction.

## The structural decision (the one real judgment call in this episode)

Two research streams initially pointed different directions: the topic-pick
memo said "must lead with the 3I/ATLAS wedge, not a generic Great-Filter/
Drake-Equation retread"; the competitive-differentiation research
independently found 3I/ATLAS is a **decaying** story (Loeb has already
partly walked back his own claim; NASA's Nov 19 2025 press conference
already closed the loudest phase) and recommended K2-18b's still-unresolved
2023-2026 biosignature dispute as the more durable spine. Resolved as: 3I/
ATLAS is the real-footage **cold open** (satisfies "lead with" literally),
K2-18b's live dispute carries the **sustained middle** of the episode as the
"how close did we actually get" case study, with Great Filter/Rare Earth/
Dark Forest/Zoo Hypothesis as the named-explainer spine in between. No
competitor channel has combined these two cases — confirmed via direct
search of Kurzgesagt/PBS Space Time/Cool Worlds/Isaac Arthur/Astrum's actual
catalogs.

## Files

| What | Where |
|---|---|
| Doc spec (77 scenes, ~19.5 min body) | `src/mindwired-doc/docs/fermiparadox.json` |
| Manifest | `src/mindwired-doc/docs/fermiparadox.manifest.json` |
| Fact base (17 sections, 6 data corrections) | `docs/planning/CLAIMS-fermiparadox.md` |
| Comp | `FermiParadoxDoc` in Root.tsx (MW_OUTRO baked) |
| **Master (DONE — 4K, −14.1 LUFS)** | `We Found Two Real Signals. Both Went Quiet..mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-fermiparadox.md` |
| Thumbnails (3 BUILT) | `out/thumbs/fermiparadox_A/B/C.png` |
| Funnel Shorts (4, rendered) | `FermiParadoxShort1-4` → `out/shorts_final/FermiParadoxShort<N>.mp4` |
| Shorts drip plan | `docs/publishing/SHORTS-SCHEDULE-fermiparadox.md` |
| Assets + licenses | `public/shorts/fermiparadox/` + `images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_awe_eventhorizon.mp3` (Bermuda Triangle used pulsar — no consecutive repeat) |

## Footage: a genuinely rough automated-fetch pass, fixed by hand

The automated fetcher (`fetch_doc_footage.py`) returned wrong-subject matches
far more often than usual on this episode, because several beats needed
*specific* narrow historical assets (a named person's own portrait, one
particular observatory building, one particular 2025 astronomical event)
that generic keyword search kept missing in favor of superficially-similar
NASA-library filler. All caught by eyeball and fixed via direct Wikimedia
Commons API pulls before render — nothing wrong shipped:

- **Cold-open video** (3I/ATLAS): the fetcher returned a Landsat-9 rocket
  booster, the Helix Nebula, a Hubble servicing-mission clip, a Mars-wind
  news report, and a 2022 JWST first-images briefing — none of them 3I/ATLAS.
  Replaced with 3 real Catalina Sky Survey orbital-trajectory animations of
  the actual object (`atlasreal_1-3.mp4`, CC BY-SA 4.0) — real tracking data
  from one of the object's actual discovery/tracking surveys, honestly
  labeled (the on-screen "CATALINA SKY SURVEY" watermark is baked into the
  source footage itself).
- **Enrico Fermi**: first pass returned zero results for his own portrait
  and only one blackboard photo. Manually pulled 2 more portraits + 2 more
  blackboard/colloquium photos directly from Commons (NARA/DOE, PD).
- **Green Bank Observatory**: first pass returned unrelated galaxy/nebula
  images (wrong subject entirely — not even a telescope). Replaced with the
  real Howard E. Tatel telescope (the actual 1960 Project Ozma instrument),
  a photo of Frank Drake standing in front of it, a real Drake portrait, and
  — the best find — what appears to be the actual "Order of the Dolphin"
  Green Bank reunion photo.
- **Carl Sagan**: returned unrelated NASA archive-code filler. Replaced with
  a real 1987 Sagan photo (Cornell).
- **Nuclear power plant** (generic AI-risk filler): first pass returned
  Chernobyl disaster/Ukraine-war-fires imagery — wrong and a real sensitivity
  risk (associating an unrelated real disaster with a generic beat).
  Replaced with a generic, non-disaster nuclear cooling-towers photo.
- **Arecibo**: first pass returned Arecibo-produced *radar data* images of
  asteroids, not photos of the dish itself. Replaced with real exterior/
  aerial Arecibo photos, plus the actual 2020 collapse footage (PD, NSF
  release) for two beats that needed real motion.
- **K2-18b**: originally used generic "some exoplanet" filler reused 13
  times across the episode (a real repetition problem). Found and swapped
  in 4 real, planet-*specific* K2-18b illustrations (ESA/Hubble, NASA) plus
  a real K2-18-system animation — cut the generic-exoplanet pool's reuse
  count from 13 down to 4.
- **A self-authored bug caught and fixed**: 10 scenes across unrelated
  topics (Jupiter, an AI server room, a nuclear plant, Voyager's Golden
  Record, a 1970s journal page) had all been lazily assigned to one generic
  `navmap` image prefix — meaning most of them would have shown a visually
  wrong photo. Split into distinct, accurately-matched prefixes before any
  of it reached render.

Full attribution/license trail: `public/shorts/fermiparadox/images/
ATTRIBUTION.md` and `.../video/ATTRIBUTION.md` — both rewritten from scratch
after the manual-fix pass to reflect final, accurate content (not the raw
fetcher log).

## Honesty rules baked in (do not soften in packaging)

- **Avi Loeb's 3I/ATLAS "alien technology" hypothesis is never platformed
  alone** — every mention pairs his own hedge ("most likely a comet of
  natural origin," self-rated 4/10 on his own scale) with the named
  mainstream rebuttal (NASA's Kshatriya/Statler, Jason Wright, Brian Cox) in
  the same beat.
- **The Dark Forest Hypothesis is labeled fictional-origin (Liu Cixin's
  novel) before any scientist's engagement with it is shown.**
- **The Zoo Hypothesis is flagged on-screen as unfalsifiable** — a real
  weakness, not hidden.
- **Every Great-Filter/existential-risk figure is attributed to the person
  who estimated it** (Hanson's essay was never peer-reviewed; Bostrom,
  Sandberg, and Ord are three distinct sources, never conflated).
- **K2-18b's "strongest hints yet" claim is shown failing three independent
  re-analyses in the same arc** — never left one-sided.
- **Two data corrections a fact-check pass caught before scripting**: NASA's
  press conference was Nov 19 2025, not Nov 21; the Sagan quote used for the
  term-origin hook is matched to its correct 1963-vs-1973 source (see
  CLAIMS-fermiparadox.md's DATA CORRECTIONS block for the exact phrasing).

## What's left before publish

1. Paste the real Voyager 1 long-form URL into the METADATA description's
   MORE FROM block (episode shipped 2026-08-08 per memory `voyager1-episode`
   but its URL was never logged in `mindwired-published-urls` — pull it from
   Studio) and into the verbal-bridge scene's on-screen caption cross-check.
2. A real human ear-check of the VO (not yet done this session — build
   `out/qa/fermiparadox_vo_sample.mp3` or splice one manually and listen).
3. Spot-check the ATTRIBUTION.md files against a few random frames before
   publish, given how much manual footage-correction happened (see above) —
   the content is verified correct by this session, but a second pass of
   eyes is warranted given the volume of intervention.
