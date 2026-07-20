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

## The talking host (2026-07-20 — "make it feel like the mascot speaks")

Cartoon mouth-flaps, NOT AI face lip-sync (which is the #1 slop tell): 4 drawn
mouth states swapped per frame from the narration's real loudness envelope —
the exact grammar animated-storytime channels use.

- Rig: `gen_mascot.py --only host` generates host_m0..m3 (closed/small/open/
  wide), identity-locked same-image edits, then `normalize_rig()` aligns every
  frame by ink bounding-box so flaps don't jump. Copies live in public/mascot/.
- Track: `scripts/lib/mouthtrack.py` — per-frame RMS -> "0"-"3" string,
  quantized on twos, mouth closed at scene end. build_doc_vo writes it into
  the manifest (`mouth`) for scenes with `"speak": true`.
- Comp: MascotReact swaps host_m<state> per frame, adds an emphasis pulse on
  loud syllables, and BOILS the drawing (feTurbulence on threes) so it never
  freezes. `speak` and `react` are both scene fields; speak wins.

## Scene direction toolkit (same sprint)

- Pencil cursor rides the draw-on reveal (now ~1.5s — anticipation holds).
- Slow push-in per scene (smooth camera vs 10fps boil = mixed cadence).
- `"circle": [cx, cy, r]` — wobbly ink circle draws on at ~55% of the scene to
  direct the eye (coords in the 1180x760 illustration space).
- Auto SFX: scribble under reveal, pop on mascot land, page_turn between
  consecutive sketch scenes, stat_hit on stats.
- Preflight now BLOCKS on: unknown `react` pose, `speak` without the host rig,
  `speak` without a mouth track in the manifest.

## Thumbnails (the CTR lever)

`scripts/gen_sketch_thumb.py --slug x --illustration <png> --mascot shocked
--text "THE LOUDEST|SOUND EVER" [--accent-line 1] [--paper light]` — 1280x720,
handwritten title + ink illustration + mascot, dark-paper default. Generate
2-3 variants per video and A/B. House rules from docs/guides/THUMBNAILS.md
still apply (3-5 words).

## Render checklist (tomorrow)

1. `python3 scripts/preflight_doc.py sketchdemo` (must be 0 blocking)
2. `.venv-lipsync/bin/python scripts/render_and_master.py SketchDemo
   out/sketchdemo_4k.mp4 --scale 2 --music public/beds/doc_awe.mp3`
3. Listen for: mascot speaking d1/d3/d5, page turns between scenes, scribble
   under reveals; watch for mouth-flap jumpiness (if jumpy: regenerate rig
   with gen_mascot.py --only host --force, normalize_rig runs automatically).

## Still to build (next sessions)

- Word-level pose swaps + draw-on synced to the naming word (needs word
  timings; Cartesia bytes endpoint doesn't return them).
- Blink states + brow layers for held poses; "placard" gag pattern.
- A quirky sketch-brand music bed (doc_awe is cosmic — wrong flavor here).
- Multi-take VO with a Gemini-audio judge picking the most human read.
- WHICH CHANNEL gets this identity + final mascot design — Akshay's call
  (the astro character is a feasibility POC, not a locked brand decision;
  also still owed: the reference channel name to match its style exactly).
