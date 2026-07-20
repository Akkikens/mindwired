# SKETCH-BRAND — the hand-drawn illustrated look with a reacting mascot

Built 2026-07-19 (the "make videos nobody calls AI slop" push). A full illustrated
brand system: a recurring hand-drawn mascot who reacts to the narration, ink
illustrations on textured paper with draw-on reveals, handwritten type, and
tactile sound design. Proof-of-concept: comp `SketchDemo` → `out/sketchdemo.mp4`.

## The pieces

| Piece | Where | What |
|---|---|---|
| Mascot generator | `scripts/gen_mascot.py` | hero identity anchor + 10 reaction poses (shocked/thinking/pointing/terrified/mindblown/facepalm/excited/sad/explaining/neutral), identity-locked via reference-image conditioning, white→alpha, contact sheet to out/qa |
| Standing assets | `assets/mascot/<name>/` (never bulk-cleared) + copies in `public/mascot/` for Remotion | generate ONCE per channel, reuse forever (same policy as subscribe outros) |
| Scene renderer | `src/mindwired-doc/Sketch.tsx` | paper texture + vignette, marker-mask draw-on reveal (~0.9s), line boil on threes (feTurbulence seed cycle ~10fps), Caveat/Patrick Hand handwritten type (embedded data-URI fonts — see gotcha), drawn underlines, margin notes |
| Doc-engine fields | `DocWide.tsx` DocScene | `sketch: true` (+ `img` prefix) renders SketchScene; `react: "<pose>"` pops the mascot into the corner of ANY scene type; `note: "…"` = handwritten margin annotation; `tone: "…"` = per-scene VO emotion |
| SFX kit | `scripts/fetch_sfx.py` → `public/sfx/` | CC0 via Freesound (key) / Openverse (keyless): sketch_scribble, page_turn, sketch_pop — auto-cued on sketch scenes (scribble under draw-on, pop on mascot landing) |
| Scene illustrations | Gemini via `lipsync/gemini_host.generate()` with `gen_mascot.STYLE` | ONE locked style prefix so every episode reads as one illustrator's hand |

## Per-episode workflow

1. Write the doc JSON with `sketch: true` scenes; give each scene a specific
   illustration idea and a mascot `react` pose that lands on the beat
   (shock → `shocked`, dark turn → `terrified`, big number → `mindblown`).
2. Generate illustrations in the locked style (STYLE prefix from gen_mascot.py),
   then `white_to_alpha()` them (ink on paper needs real transparency).
3. Normal pipeline from here: lint → build_doc_vo (per-scene `tone` drives
   Cartesia emotion) → audit → preflight → ship_doc. All existing gates apply.

## Style rules (from the 4-agent research sweep — the anti-slop checklist)

- **Writing density is the #1 anti-slop asset**: every scene line carries a
  specific named fact, number, or gag. "A script that never says anything
  specific" is the core slop tell — no filler lines, ever.
- **Animate on threes**: hand-drawn elements move/boil at ~10fps (quantize
  `Math.floor(frame/3)`), cameras stay smooth at 30 — the mixed cadence is the
  hand-animated look. A frozen drawing reads digital; everything boils subtly.
- **Draw-on reveals are a retention mechanic** (~15% knowledge-retention lift in
  studies): reveal diagrams progressively, never show finished art at scene start.
- **The mascot's restraint sells it**: pose swap on the punchline, then HOLD
  (deadpan ~1s). No lip-sync — that's the #1 AI tell; the character emotes,
  the narrator narrates.
- **Tactile audio**: scribble under every draw-on, pop on pose lands, page turn
  on scene changes, all under VO level.
- **Deadpan > fake enthusiasm** in VO: let the drawings carry the reaction;
  pushed TTS excitement is itself an AI-voice tell.

## Character-consistency recipe (current + upgrade path)

Current (POC, works): hero image → each pose generated with hero as reference
image + "EXACT SAME character" prompt + frozen STYLE prefix. Model:
`gemini-2.5-flash-image` (repo default).

Research-recommended upgrade when we lock the real brand face: generate ONE
master turnaround/model sheet (front, 3/4, side, back + labeled expression
heads) with `gemini-3-pro-image`, human-approve it, freeze it forever, then
attach that sheet as the reference for every production pose with
`gemini-3.1-flash-image`. Switch models via `GEMINI_IMAGE_MODEL` env var
(gemini_host.py reads it) — no code change.

## Gotchas

- **Fonts**: `@remotion/fonts` loadFont silently failed to apply Caveat/Patrick
  Hand at render (serif fallback; `document.fonts` stayed empty) while the same
  path works for Space Grotesk/Inter. Fix that WORKS: fonts embedded as base64
  data-URIs in `src/mindwired-doc/sketchFonts.ts`, injected via `<style>` in
  SketchScene. Also: Google css2 API serves per-script subsets — grab the
  `/* latin */` block, `head -1` gets cyrillic (no Latin glyphs).
- Illustrations & mascot PNGs must be white→alpha preprocessed
  (`gen_mascot.white_to_alpha`) — SVG mask isolates blend modes, so
  mix-blend-multiply does NOT work for sitting art on the paper.
- Mascot poses live in `public/mascot/` as REAL copies (Remotion doesn't bundle
  symlinks); masters in `assets/mascot/`.
- The relevance audit flags AI illustrations as UNSOURCED — correct and
  intended: they're self-evidently illustrations (never presented as real
  footage), the flag is just provenance bookkeeping.

## Still to build (next sessions)

- Pose swaps timed to word-level narration beats (needs per-scene word timings;
  currently one pose per scene).
- Draw-on synced to the exact word that names the diagram element.
- "Placard" gag pattern (character holds a hand-lettered sign — History Matters
  trick, replaces lip-sync entirely).
- Separate brow/eye layers for micro-expressions on held poses.
- Full illustrated episode end-to-end (this session shipped the 48s style demo).
- WHICH CHANNEL gets this identity + final mascot design — Akshay's call
  (the astro character is a feasibility POC, not a locked brand decision).
