# Craft audit — what actually reads as "AI slop," ranked by viewer impact (2026-08-22)

Triggered by real viewer comments (MH370-Netflix episode): *"Using an AI
voice is not a great look. The unnatural pacing, intonation, and multiple
mispronunciations are awful and distracting"* and *"why can't they use a
plain ole American voice?"* — plus Akshay's own read that the fonts "look
very simple." This file is the audit + what round 1 changed. Before/after
evidence in `out/qa/type_before_*.png` / `out/qa/type_final_*.png` and
`out/qa/vo_audition/`.

## Finding 0 (CRITICAL, fixed): every render has been shipping in Helvetica

`package.json` declared `"sideEffects": ["*.css"]` — which told webpack that
`import "../lib/fonts"` (a bare side-effect import, used in 31 files) is
dead code. **Webpack tree-shook the font loader out of every bundle. Zero
fonts ever registered at render time** (verified: `document.fonts.size === 0`
in a rendered frame). Space Grotesk, Inter, Noto Devanagari, Caveat — none
of them ever rendered; every shipped episode used the fallback stacks
(Helvetica/Arial). This is a big part of why the typography read as generic.

Fix: `"./src/lib/fonts.ts"` added to the sideEffects allowlist. Verified
in-frame post-fix: 14 FontFaces registered. **Lesson: a silent
`.catch(() => undefined)` on font loads + no visual assertion meant nobody
could tell brand fonts from fallback for months. If it matters visually,
probe it in a rendered frame, not in code review.**

## Finding 1 (voice — the #1 viewer complaint): groundwork shipped, decision is Akshay's ear

What was diagnosable from the pipeline without ears:

- **Mispronunciation class gap**: `lint_tts_text.py` catches digit/code
  patterns but has no mechanism for proper nouns Cartesia mangles (names
  like Haise, Liebergot, Tham Luang). NEW: `scripts/lib/pronounce.py` — a
  synth-time-only respelling map (doc JSON / on-screen text / whisper SRT
  keep real spellings), wired into `build_doc_vo.py`. Grows one ear-check
  at a time; entries stay put once shipped.
- **No vocal chain**: raw TTS mp3s got zero processing — real broadcast VO
  always passes a highpass/de-ess/compression/loudnorm chain, and its
  absence is an audible AI tell (harsh sibilance, uneven syllable peaks).
  NEW: `scripts/lib/vopolish.py`, wired into `build_doc_vo.py` — sticky
  per-episode via the manifest (`polish` key) exactly like `speed`, so
  `--only` re-synths can never splice polished and raw clips. Existing
  episodes stay raw; new episodes default to polished.
- **The accent/voice-identity question** ("plain ole American voice") can
  only be settled by ear. NEW: `scripts/vo_audition.py` — the current
  clone + Clive + 4 real Cartesia library narrator candidates (Quentin/
  Theo/Ronald/Grant — Grant is explicitly "neutral American accent"),
  each synthesized on two real Apollo 13 passages at production settings
  → `out/qa/vo_audition/` + INDEX.md. **Akshay: listen, pick, then update
  DEFAULT_VOICE in scripts/lib/cartesia.py.** A polished-vs-raw sample of
  the current clone is also there (`current-clone__factual_POLISHED.mp3`).
- Not attempted (bigger change, propose separately): per-chapter synthesis
  with forced-alignment splitting, to kill the every-8-seconds prosody
  reset that per-scene requests cause. Real fix, real complexity — needs
  its own prototype pass.

## Finding 2 (typography, fixed): flat two-sans register → four-voice system

Before (see `out/qa/type_before_f*.png`): everything — chapter titles, stat
chips, captions, brand — sat in the same two mid-weight sans registers
(and per Finding 0, actually Helvetica). `Courier New` (a system default)
served as the "technical" face on EXHIBIT tags and the depth gauge.

Now (see `out/qa/type_final_*.png`), all four doc-engine channels:

| Voice | Face | Role |
|---|---|---|
| Display | **Archivo Expanded** (static 800/640 cuts instanced with fonttools) | hero titles, chapter cards, stat numerals — broadcast-documentary weight |
| Editorial | **Spectral** 500 (+italic, 700) | pull-quotes, reflective coda lines; quoted captions get it automatically |
| Technical | **IBM Plex Mono** 500/600 | EXHIBIT tags, chapter eyebrows, GET clocks, depth gauge — never Courier again |
| Body | **Inter** (unchanged) | captions, transcript lines |

All OFL, self-hosted in `public/fonts/`. Component changes in `DocWide.tsx`:
chapter cards rebuilt (mono eyebrow between hairlines, tight-leading
expanded title, hairline-diamond rule — replaces the chunky accent bar);
stat chip and caption bar extracted into shared `StatChip`/`CaptionBar`
(was 4× copy-paste); captions that open with a quote mark automatically
render in Spectral italic with an accent dash; radio-scene transcript lines
now serif (spoken evidence reads as testimony, not UI text). `theme.ts`
exports the new `SERIF`/`MONO`/`DISPLAY_STRETCH` tokens for non-doc comps.

Note for variable fonts at render: browser wdth-axis clamping made
`fontStretch`/`fontVariationSettings` unreliable — static instances via
`fonttools varLib.instancer` are the dependable path (that's why
ArchivoExpanded-*.ttf exist alongside the variable Archivo.ttf).

## Finding 3 (content QA gap, logged): emotional-register mismatches

`out/qa/type_before_f10200.png`: the "0 of 3 fuel cells left" disaster stat
sits on the post-splashdown *celebration* photo (cigars, applause). No gate
catches subject-matches-but-mood-doesn't. Candidate fix for a next round:
add a register/mood term to the vision-verify prompt in
`scripts/lib/footage.py` (it already judges subject match). Not done yet.

## Finding 4 (motion/other, queued for round 2)

Assessed, not yet changed: easing curves are competent (smoothstep +
springs — not the problem); the biggest motion win would be transition
GRAMMAR (photo→photo cuts all use the same fade+push) and exhibit-scene
compositing depth. SFX/music layers already follow a considered system.
Thumbnails already moved to House Style 2.0. These are polish, not
credibility risks — voice decision and re-render adoption come first.

## Adoption path (deliberate, per render-discipline rules)

Code changes affect FUTURE renders only — the 6 rendered-not-published
episodes are untouched and fine to ship as-is. First episode rendered after
this lands gets: real brand fonts (first time ever), new type system,
pronounce layer, polish chain, and whichever narrator Akshay picks from the
audition. No re-render of the backlog is warranted for typography alone.
