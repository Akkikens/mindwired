# MINDWIRED → DOCUMENTARY CHANNEL — the pivot playbook (2026-07-21)

Source: two deep channel studies (ColdFusion + James Jani; Patrick Cc: +
Crayon Capital) — full findings in the session research; distilled here.
Akshay's call: transform mindwired into a ColdFusion-tier documentary channel.
Mascot cutaways ON HOLD for mindwired (kept on DimaagBatti + Black Box).

## Why those four win — the convergent laws

All four channels, different niches, same physics:
1. LEAN-BACK LENGTH IS THE BUSINESS. 20-50 min "watch while you eat" docs =
   unlimited mid-rolls + massive minutes-per-impression. Patrick Cc's banner
   literally says it. Jani averages 3M+ views on 2-4 uploads a YEAR.
2. EVERGREEN OR NOTHING. Every breakout is a story that will be searched in
   five years. Back catalog = annuity (a 4-year-old Bam Margera doc still
   pays). News-reaction content is their weakest performer across the board.
3. CHARACTER + ONE DECISION. Every hit has a protagonist and locates the
   turning point in one named person's one decision. Abstract topics without
   a face flop on all four channels (verified in their own catalogs).
4. RECEIPTS ON SCREEN. Real documents/clips/screenshots shown long enough to
   read, punched-in and highlighted. The trust moat IS the archival
   discipline. (We have the NTSB/NASA pipeline — we under-flaunt it.)
5. TITLE = THESIS, THUMBNAIL = THE OTHER HALF. Title and thumb carry two
   different halves of one curiosity gap; the video delivers exactly the
   promise (quality-CTR, never bait).
6. IDENTITY COMPOUNDS. One grade, one type system, one audio ident, one
   franchise title format, held for years. Recognizable at feed-glance.

## Craft rules to bake into the doc engine (implementation backlog)

> **BUILT 2026-07-21 (Mars One pivot episode #1)** — the code capabilities below
> are now standing parts of the doc engine (`src/mindwired-doc/DocWide.tsx`,
> `scripts/lib/doctiming.py`, `scripts/gen_sfx_kit.py`). Verified via stills in
> `out/qa/craftdemo/`. The remaining unchecked items are *scripting techniques*
> applied per-episode, not code.

- [ ] COLD OPEN 2.0: a dated scene with a person in tension — never a stat.
      "It's 2:07 AM, March 8, 2014. A controller keys his mic for the sixth
      time…" 45-90s before any wordmark. (Upgrade HOOK-CHECKLIST.md.)
      *(scripting technique — applied in each episode's opening scenes.)*
- [x] **DELAYED BRAND STING** — `sting:true` DocWide scene: wordmark bloom +
      expanding accent ring + the owned `sfx/sting_motif.wav` musical motif under
      the spoken line ("You're watching mindwired."). One standing beat, every
      episode. Plays AFTER the cold open. *(DocWide `StingScene`; motif in
      `gen_sfx_kit.py`.)*
- [x] **VARIABLE TIME-DENSITY** — scene field `motion:"fast"|"slow"` scales the
      Ken Burns amplitude (fast = montage sweep, slow = near-static push for the
      pivots); scene field `extraHold` adds controllable dead-air frames (mirrored
      in doctiming.py). *(DocWide `IllusScene` + `sceneFrames`.)*
- [~] MUSIC LEADS BY ~10s + SILENCE BEFORE REVEALS: windowed-music system
      (`master.mix_music_windowed` + `doctiming.music_windows`) already scores to
      the cold open / chapter transitions / close, leaving dry narration between —
      that IS the "silence" between beats. A hard silence before a reveal =
      `extraHold` on the pre-reveal scene inside a music gap. Per-chapter distinct
      beds still optional (generate if ElevenLabs Music quota allows). *(existing
      system + extraHold; new beds conditional.)*
- [x] **EXHIBIT SCENE TYPE (the Jani move)** — `exhibit:true` DocWide scene renders
      the scene's `img` (a real document page → PNG) as evidence: dark blurred
      surround, slow push toward `highlight:[x,y,w,h]` (the damning line), an accent
      highlight box, and an "EXHIBIT · <source>" lower-third from `source`. One beat
      per 2-3 min. *(DocWide `ExhibitScene`.)*
- [x] **KINETIC TYPOGRAPHY AS SECOND NARRATOR** — `kinetic:{...}` DocWide scene:
      a number counting up (`count`), optionally struck through to a second real
      number (`strike`, e.g. 200,000 → 2,761), and/or words materializing
      one-by-one (`words`), silence-synced to the narration. *(DocWide
      `KineticScene`.)*
- [ ] FIRST-PERSON CODA: 30-45s authored reflection before the bridge ("what
      stays with me about this one…"). Converts compilation → film; builds
      narrator parasociality (a faceless channel's substitute for a face).
      *(scripting technique — the Act 3 coda.)*
- [ ] STEELMAN ACT ONE: make the doomed thing look invincible before it
      falls. The fall lands as hard as the rise you built. *(scripting — Act 1.)*
- [ ] OPEN LOOPS ACROSS CHAPTERS: plant chapter N+1 before resolving N.
      *(scripting — chapter-end teases.)*
- [ ] POSTER THUMBNAILS: one lit archival photo, near-black, 2-4 serif words
      that are NOT the title. Commit to the film-grain/vignette grade as
      permanent identity. *(thumbnail step; grain/vignette already baked in
      DocWide's `GrainVignette`.)*
- [x] **SOURCE LOWER-THIRDS** — delivered by the EXHIBIT scene's "EXHIBIT ·
      <source>" lower-third; the occasional on-screen "every document is from the
      record" line remains a scripting choice.

## Franchises (name the format in the title — Crayon Capital's #1 lesson)

- "Every X …" — ALREADY PROVEN (21 Astronauts 37.8K; Almost Died sequel).
  Keep shipping it.
- "…: Every Theory, Tested" — proven on Black Box (MH370 14K/48h). Works for
  mindwired mysteries too.
- NEW: "The Rise and Fall of ___" (ColdFusion's engine, evergreen forever).
- NEW: "The ___ NASA/They Don't Talk About" or "An Untold Story" (Jani).

## THE IDEA SLATE — ranked (format · why it wins · demand evidence)

TIER 1 — make these first:
1. "The Mars One Scam: How 200,000 People Signed Up to Die on Mars"
   (Jani exposé) — a real fake one-way Mars mission, took application fees +
   TV-rights dreams, collapsed in bankruptcy; victims, receipts, a charismatic
   founder. THE perfect Jani-style mindwired doc; evergreen searched.
2. "OceanGate: The Billionaire Sub That Ignored Every Warning"
   (Jani/ColdFusion hybrid) — massive evergreen search, whistleblower memo
   receipts (real court/USCG docs = exhibit scenes), one man's one decision,
   steelman act one (the innovation story). Adjacent to space lane via
   engineering-hubris brand.
3. "The Rise and Fall of Concorde" (pure ColdFusion) — beloved machine,
   golden age, ONE crash, the decision to ground it; gorgeous PD archival
   exists (BA/Air France era news film, museums). Evergreen aviation+science
   crossover with Black Box synergy.
4. "The Man Who Sold the Moon" (Dennis Hope lunar land scam) — exposé,
   comedic-dark, receipts (real "deeds"), interviews exist; nobody owns the
   definitive version. High twist-density.
TIER 2:
5. "The Rise and Fall of the Space Shuttle" — the program-as-protagonist arc;
   Challenger/Columbia as the two decisions; NASA PD archival is bottomless.
6. "Who Killed the Saturn V?" — contrarian mystery framing on a beloved
   machine; receipts from congressional records.
7. "Virgin Orbit: The $3.7 Billion Rocket Company That Lasted 6 Years"
   (rise-and-fall, recent, searched).
8. "The Astronaut Who Sued NASA" / wrongful-hero stories — character-first.
9. "Skylab Is Falling: The Summer the World Panicked" — retell-famous-story
   with style twist; 1979 media frenzy archival is PD-rich.
10. "The Body Farm in Space" — what NASA actually knows about death in orbit
    (extends the proven bodies/deaths audience).
TIER 3 (philosophy-essay lane test, from the IG outliers):
11. "The Overview Effect: What Seeing Earth From Space Does to a Brain" —
    Horses/Psyphoria-style essay doc; astronaut interview archival is PD.
12. "Voyager's Last Photo" (Pale Blue Dot as a 15-min meditation) — the
    Marcus-Aurelius-style contemplative doc; Sagan audio is licensable/PD-ish
    via NASA; test the lane cheaply.

Validation next step per idea: Icahn check (outlier search on the topic,
views:subs of existing versions) before greenlighting — top candidates
already show existing 1M+ versions by smaller channels (Mars One, OceanGate,
Concorde all have proven multi-million videos from sub-500K channels).

## Crayon Capital note (the illustrated lane)

Their motion level ≈ our rig already; the real gap is ART DIRECTION: 15-25
distinct drawn tableaux per video, caricatures of the real people
interacting, 5-8 expression poses per character, staging (spotlights, props),
micro-motion (confetti/particles/draw-ons). Closing it = a per-episode
storyboard-of-tableaux pipeline (~2-3x current art budget, NO frame-by-frame
animation needed). That's the roadmap for when the illustrated brand comes
off hold — potentially as its own channel later, not mindwired.
