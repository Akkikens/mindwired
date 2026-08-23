# Prompt for Fable — make the mindwired video-generation stack world-class

Paste everything below the line into a Fable session (or I can launch it as a
Fable agent against this repo — say the word).

---

You are being brought in as a world-class creative/technical director for
**mindwired**, a code-generated documentary video factory (Remotion/React →
MP4, React Three Fiber for 3D, Cartesia TTS narration). The engineering
pipeline works — dozens of episodes have shipped. **The craft has not caught
up to the ambition.** Your job is to fix that, end to end: narration quality,
typography, motion design, color, camera work — everything a viewer
perceives — until it is genuinely the best-produced channel in this niche,
not just a functional one.

## Why this matters right now — real viewer evidence, not a hunch

These are real, verbatim YouTube comments on published episodes:

> "Using an AI voice is not a great look. The unnatural pacing, intonation,
> and multiple mispronunciations are awful and distracting." (2 likes)

> "If it is AI why can't they use a plain ole American voice? Ever notice
> news anchor people, they practically have no accent." (on the MH370 Netflix
> reaction video)

Viewers are correctly identifying that this sounds AI-generated, and it is
costing retention and credibility. Fix the actual causes, not the symptom —
don't just tell us to "add more breaks" or pick a different voice ID at
random. Diagnose, then fix.

## Scope — everything a viewer perceives

### 1. Narration quality (the most urgent, evidence-backed problem)
Current setup: Cartesia TTS, a cloned voice (`00d3c951-0474-4b48-814e-
ef815f533e63`), model pinned to `sonic-3.5-2026-05-04`, speed ~0.96-0.97, no
blanket `<break>` tags (a past overhaul found blanket breaks made things
*worse*, not better — ~19% injected dead air). Build script:
`scripts/build_doc_vo.py`. TTS pronunciation lint: `scripts/lint_tts_text.py`
(catches things like "737" reading as "seven hundred thirty-seven" — but per
the comments above, real mispronunciations are still slipping through it).

Do the actual diagnostic work:
- Pull 5-10 real published clips and listen critically. Where exactly does
  pacing/intonation read as robotic? Is it sentence-final pitch, mid-sentence
  emphasis, breath placement, something else?
- Audit `lint_tts_text.py`'s rule set against real mispronunciation reports —
  what classes of words/numbers/names is it missing?
- Evaluate whether the specific cloned voice itself is the problem (accent,
  cadence, source recording quality) vs. a text/prosody-authoring problem vs.
  a settings problem (speed, emotion controls if Cartesia exposes them). Test
  alternatives if warranted — including whether a different voice model or a
  different provider genuinely sounds more natural on THIS content, compared
  head-to-head, not assumed.
- Propose a concrete, testable fix — not "make it sound more human," an
  actual mechanism (script-authoring rules, voice/settings change, a new
  lint check, a human-in-the-loop QA gate) — and show before/after audio.

### 2. Typography — currently too simple, per Akshay's own read
Real current setup: `src/lib/theme.ts` defines `DISPLAY = 'Space Grotesk'`
(headlines/stats) and `SANS = 'Inter'` (captions/body), self-hosted via
`src/lib/fonts.ts` (also loads Noto Sans Devanagari for the Hindi channel and
Caveat for the sketch-brand illustrated look). This is a reasonable, safe
starter pairing — but it reads as generic geometric-sans-plus-humanist-sans,
which is exactly what half the explainer-channel market already uses.
Redesign the type system: a distinctive, premium display face (or a
custom/licensed pairing) with real hierarchy — hero titles, chapter cards,
stat callouts, captions, exhibit citations should each feel like a
deliberate typographic decision, not the same weight/size reflowed. Look at
what makes the channel's real competitors (Fern, LEMMiNO, Half as
Interesting) feel expensive — it's usually restraint + hierarchy + motion on
type, not more fonts.

### 3. Motion design & visual system
Relevant real components: `src/components/kinetic.tsx` (stat/word reveals),
`src/components/Captions.tsx`, `src/components/effects.tsx`, `src/components/
Camera.tsx`, `src/mindwired-doc/DocWide.tsx` (the doc-engine's chapter cards,
exhibit scenes, radio scenes), `src/mindwired-doc/MindwiredShort.tsx` (vertical
Shorts). Current palette is `src/lib/theme.ts`'s `C` object (deep-space
navy/cyan/amber). Assess and elevate: easing curves, camera drift/push-pull
timing, the film-grain+vignette layer, transition grammar between scene
types, how exhibit/document scenes are composited, how chapter cards read at
a glance. Real competitor benchmarks worth studying frame-by-frame: Fern,
LEMMiNO, Fascinating Horror, Mentour Pilot's evidence-graphics style.

### 4. Everything else that reads as "AI slop" if left unpolished
Thumbnail system (`docs/guides/THUMBNAILS.md`, House Style 2.0), the
subscribe outro, SFX layer (`public/sfx/`), music-bed sidechain-ducking —
sweep for anything that currently looks/sounds like a placeholder rather
than a deliberate choice.

## Hard constraints — do not violate these

- **Never use real broadcast news footage** (CNN/BBC/Fox/local news) —
  copyright/Content-ID risk to the whole channel, already decided, non-
  negotiable.
- **Real footage first, AI/generated visuals only for genuinely unfilmable
  moments** (`dossier: true` scenes) — this is the channel's core honesty
  differentiator, don't trade it away for polish.
- **First 30-60 seconds of every long-form is real motion footage, never
  stills** — a hard, evidence-backed retention rule.
- **No blanket `<break>` tags in TTS text** — already tested and rejected;
  any prosody fix must work through punctuation/phrasing or real settings,
  not brute-force pauses.
- Read `CLAUDE.md` in full before touching anything — it encodes a lot of
  hard-won, evidence-based rules (footage sourcing, sensitivity handling,
  the subscribe-outro system, render discipline). Don't relitigate settled
  decisions; build on top of them.

## What "done" looks like

1. A short written audit: what specifically reads as amateur/AI-generated
   right now, ranked by viewer-perceptible impact (voice first, given the
   evidence above).
2. A concrete plan per problem area, each with a before/after comparison
   (real audio clips, real rendered stills/frames) — not just a written
   description of taste.
3. Implementation of the approved direction, applied consistently across
   the doc-engine, the Shorts engine, and the existing per-channel themes
   (mindwired, Black Box Breakdown, Criminal Record, DimaagBatti) — a
   redesign that only touches one channel or one video isn't done.
4. Verification: render real stills/clips showing the new system in
   practice, not just updated component code nobody has looked at rendered.

Be honest if something can't be fixed cheaply (e.g., if the cloned voice
itself is the ceiling and a new voice clone is the real fix) — say so
plainly rather than papering over it with a smaller change that won't
actually move the needle on what viewers are complaining about.
