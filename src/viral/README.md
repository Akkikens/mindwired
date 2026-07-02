# Viral Shorts Engine (`src/viral`)

Data-driven, high-retention Shorts/Reels generator. One JSON plan → expressive
narration → kinetic vertical video. No 3D dependency; renders fast.

## Make a new video

1. **Write the plan** — `src/viral/plans/<slug>.json` (schema: `lib/types.ts` → `VisualPlan`).
   Structure it for retention: `hook` (0–3s bold claim, motion in first 5 frames) →
   curiosity gap (`problem`) → story (`shockfact`/`comparison`/`data`) → twist
   (`transformation`/`quote`/`shockfact`) → `cta`. Keep scenes 2–5s.
   Per scene: `voiceover` (spoken), `mainText` (shorter, punchier — NOT a transcript),
   `emphasis` words, `emotionalTone` (shock|fear|curiosity|excitement|confidence|awe),
   `transitionOut` (whip|flash|zoomblast|cut|none).

2. **Voice** — `python3 scripts/build_short.py <slug>`
   Hume Octave first (tone-matched acting directions per scene), ElevenLabs
   `with-timestamps` fallback (real word timings), silent estimated clips as last
   resort (video still renders; rerun later — idempotent per clip).

3. **Optional AI b-roll** — `python3 scripts/gen_broll.py <slug>`
   Needs `KIE_API_KEY` (or `KAGECIA_API_KEY`) in `.env`. Generates 9:16 images per
   scene `backgroundPrompt` and flips `brollExists` in the plan. Without a key the
   layered procedural backdrop is used.

4. **Register** — in `src/Root.tsx`, copy the `ShortRogueBH` block: import the plan +
   `public/shorts/<slug>/audio/manifest.json`, add `<Composition>` (1080×1920) and
   optionally the `Wide` variant (1920×1080).

5. **Render** — `npx remotion render Short<Name> out/<name>.mp4`
   (no `--gl=angle` needed — this engine is DOM/SVG only).

## Architecture

- `lib/types.ts` — VisualPlan/PlanScene/TimedScene schema
- `lib/plan.ts` — audio-first timeline resolver + word-timing estimator
- `lib/tone.ts` — emotionalTone → motion grammar (palette, camera, text variant, stagger)
- `lib/anim.ts` — pure helpers: fadeIn/slideIn/popIn/punchZoom/shake/parallax/
  revealProgress/beatPulse/cameraPush/whipIn/whipOut
- `components/KineticText.tsx` — voice-anchored word-by-word center typography
  (pop/slam/blur/wipe), emphasis color/scale, per-word overflow clamp
- `components/Backdrop.tsx` — gradient + optional b-roll + floating glows +
  2 parallax particle layers + animated grain + vignette
- `components/CameraRig.tsx` — punch-in, slow push, tone shake, whip/zoomblast transitions
- `components/HUD.tsx` — progress bar, voice-pulse bars, SafeArea (Shorts UI margins), brand chip
- `scenes/index.tsx` — the 8 scene kinds (hook/problem/shockfact/comparison/
  transformation/data/quote/cta), each = visual metaphor + kinetic text
- `ShortEngine.tsx` — plan → `<Sequence>` timeline, per-scene audio, transitions

## Extras

- **Music bed**: add `"music": {"src": "shorts/<slug>/music.mp3", "bpm": 120, "volume": 0.14}`
  to the plan and drop the file in `public/`. The camera pulses subtly on the beat.
- **Charts**: give a `data` scene `stat.bars: [{label, value}, …]` for an animated
  bar comparison instead of a count-up (last bar gets the accent color).
- **Wide (16:9)**: every registered short automatically has a `<Id>Wide` composition.

## Rules that keep retention high

- Scene timing comes from the real voice clip (+8f hold), never hardcoded.
- mainText fires word-by-word when the narration says that word.
- Every scene needs a visual reason to exist (`visualConcept` is required thinking).
- First scene: no logo, no fade-in, motion immediately.
- Tones drive everything — don't hand-pick colors per scene.
