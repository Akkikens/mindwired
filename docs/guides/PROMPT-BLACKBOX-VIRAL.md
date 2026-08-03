# PROMPT — Black Box Breakdown, real-audio air crash episode built to beat MH370

Paste the block below into a fresh session. It encodes everything this
channel has learned the hard way; don't trim it down, the constraints are
what make the episode work.

**Before you paste it, read this once** — the single most important fact
about why MH370 outperformed:

> Studio data, 2026-07-26: MH370 got **399,500 impressions** (5.0% CTR,
> 37.3% AVD → 29K views). Tenerife got **20,100 impressions** (3.5% CTR,
> 35.9% AVD → 1.5K views). **Retention and CTR were nearly identical.** The
> 20× gap was the size of the impressions pool YouTube granted — and that is
> a *topic-demand* signal, not a craft signal.

So: **virality is decided at topic selection, before a single frame is
made.** A brilliantly-made video about a crash nobody has heard of will get
a 20K-impression test pool and die. Craft only optimises within the pool the
topic wins. The prompt enforces this by making validation gate #1.

---

## THE PROMPT

```
Build the next Black Box Breakdown episode — a real-audio air crash
investigation documentary for the mindwired repo. My MH370 video is the
channel best (399.5K impressions, 5% CTR, 37.3% AVD, 29K views) and I want
to beat it. Work through these gates IN ORDER and stop at any that fails.

GATE 1 — TOPIC (this decides virality, not the edit)
Run the icahn-validate skill. Requirements, all of them:
  - Raw Icahn PASS: a 100K+ view outlier on a sub-100K-sub channel at 5:1+,
    PLUS an independent 3:1+ corroborator with real absolute views, PLUS
    ceiling proof (1M+ views on the exact subject from a big channel).
  - Recognition 3/3 — a cold scroller must recognise the core noun with zero
    explanation. This is the MH370-vs-Tenerife lesson: 2/3 topics need a
    packaging bridge and STILL draw a fraction of the pool. Do not settle
    for 2/3 on this one; I want the big pool.
  - REAL AUDIO MUST EXIST. Prefer US accidents — NTSB dockets publish real
    ATC tapes and CVR transcripts as public domain, which is the whole point
    of this episode. Run scripts/fetch_ntsb_docket.py "<accident>" --types
    audio,pdf,image --faa-audio and confirm real audio actually lands before
    greenlighting. A topic with no releasable real audio fails this gate.
  - REAL VIDEO MUST EXIST for the first 30 seconds (see gate 4).
Tell me the verdict with the real ratios and URLs before proceeding.
Strong pre-vetted candidates: US Airways 1549 (evidence ALREADY FETCHED in
this repo per CLAUDE.md — real ATC audio, household recognition, Hanks
film), United 232 Sioux City, Alaska 261, Asiana 214. Re-validate live
anyway; ratios are point-in-time.

GATE 2 — FACT BASE
5-agent parallel research fan-out (origins/airline · the accident + the
OFFICIAL report PDF · aftermath & legal & living-person status · MANDATORY
archival-footage scout reporting real VIDEO not just photos · the human
thread for the cold open). Merge into docs/planning/CLAIMS-<slug>.md with a
"DATA CORRECTIONS (do NOT revert)" block first, every claim labelled
CONFIRMED/DISPUTED/ALLEGED/UNVERIFIED/EXCLUDE, living people flagged and
attributed-never-asserted. Every later script line must trace to this file.

GATE 3 — THE REAL AUDIO IS THE STAR
This is the channel's signature and my standing preference: feature real
ATC/CVR audio AT LENGTH, not as 1-second background texture. Build the
spine of the episode around it.
  - Real docket audio → RadioScene labelled "ACTUAL ATC RECORDING".
  - Cartesia recreations (scripts/radio_recreate.py) → labelled
    "CVR RECREATION". Gender-matched voices.
  - NEVER mislabel. Never use leaked CVR audio. The honesty labelling is
    non-negotiable and is also why viewers trust this channel.
  - No cheap procedural diagrams. Real footage, real report pages, real
    photos, or an honest DossierScene reconstruction — nothing else.

GATE 4 — FIRST 30 SECONDS = REAL VIDEO, AND THE BEST YOU HAVE
Hard rule (stills in the first 30s do not explode). Every cold-open scene
before ~30s carries a `video` field with real motion footage. Source the
hook footage FIRST, before anything else — if the best real video is weak,
reconsider the topic.
Cold open shape: a dated scene, a named place, one small concrete action, in
that order — "January 15, 2009. LaGuardia. A first officer runs the takeoff
checklist for the fourth time that day." No throat-clearing, no rhetorical
question, no "imagine". Then real ATC audio as early as you can honestly
place it — the real voice IS the hook.
Run the hook-doctor skill on the opening once written.

GATE 5 — SCRIPT
src/mindwired-doc/docs/<slug>.json, channel "blackbox", niche "aviation".
Cold open → sting → title card → 6-8 chapters → first-person coda →
cliffhanger final line (≤12 words, lands on a noun/name/date) → verbal
bridge naming a SPECIFIC next video → subscribe scene.
  - Causal connectives at every chapter turn (then, by morning, which meant,
    what nobody knew was) so beats feel caused, not merely sequenced.
  - TTS conventions: spoken text says "seven three seven", "Flight fifteen
    forty nine"; written forms stay in cap/stat. Never ALL-CAPS in spoken
    text. Run scripts/lint_tts_text.py — must exit 0.
  - EVERY scene needs its own img or video. A scene with neither renders
    flat black — verify with a code-level JSON scan, not by eyeballing
    stills.

GATE 6 — FOOTAGE
NEW VIDEO = NEW FOOTAGE. Never reuse another slug's files; hook reuse is a
render-blocking preflight failure. Generic keyword fetching WILL return
confidently-wrong clips (it has burned this channel repeatedly) — for each
specific incident, search the actual source by mission/flight/date and
VERIFY BY EXTRACTING FRAMES AND LOOKING, never by trusting a title.
Log everything in ATTRIBUTION.md with licence. Non-US-gov reports are NOT
automatically public domain — verify before showing report pages.

GATE 7 — GATES, RENDER, PACKAGE
  - audit_scene_relevance.py + preflight_doc.py → 0 blocking, warnings
    individually justified.
  - Register the comp in src/Root.tsx with BB_OUTRO (483 frames) baked in.
  - ONE render, on GCE, 4K: scripts/render_gce.sh <Comp> <slug>
  - Music: the bed_*.mp3 set only (doc_*.mp3 are banned), windowed via
    --windows so narration stays dry.
  - Verify: duration, 3840x2160, −14 LUFS, mid-frame, outro splice.
  - gen_doc_srt.py, then ctr-engine for title/thumbnail, then a full-SEO
    METADATA-<slug>.md, then shorts-funnel for 4 vertical Shorts.

WHAT "VIRAL" ACTUALLY REQUIRES HERE — hold me to these:
  1. Topic recognition 3/3. Non-negotiable. It is the impressions pool.
  2. Packaging must promise EXACTLY what the video delivers. High CTR with a
     bounce is scored as deceptive and kills reach. 5% CTR at 70% retention
     beats 12% CTR that craters.
  3. Real audio early and at length — it is the differentiator no
     AI-narrated competitor can fake.
  4. The first 30s decides everything downstream.
  5. Session watch-time: the description ends with the MORE FROM block using
     the real published URLs, and the final line verbally bridges to a
     specific next video.

Start with Gate 1 and report the validation verdict before doing anything
else.
```

---

## Why each constraint is in there

| Constraint | Learned from |
|---|---|
| Recognition 3/3, not 2/3 | Tenerife shipped with a perfect bridge and still drew 5% of MH370's pool |
| Real audio must exist *before* greenlight | Helios 522 had no releasable CVR audio; the episode had to work around it |
| Verify footage by extracting frames | Generic fetch returned Hubble clips for a Mir docking, JWST for a Gemini EVA |
| Code-level scan for missing visuals | 13 scenes rendered flat black on the astronauts episode and shipped to review |
| First 30s real video | Akshay, 2026-07-31: "stills for first 30 secs doesnt explode" |
| Honest labelling of recreations | The channel's credibility model; also keeps it defensible |
| bed_*.mp3 only | doc_* set drew repeated viewer complaints and is permanently banned |
