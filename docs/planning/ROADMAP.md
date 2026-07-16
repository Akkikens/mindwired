# ROADMAP — video-quality engine upgrades (2026-07-07)

Concrete upgrades to the mindwired production engines, from an audit of the code
+ a study of what makes Higgsfield output read as cinematic. Ordered by ROI.
Everything below the "Shipped" line is done and typecheck-clean; the render was
verified on `ShortRogueBH`.

## The meta-lesson (why the one-off cinematic cut looked cheap)

The `mindwired_brokentime_cinematic` cut was hand-assembled in ffmpeg and threw
away the channel's whole design system — because **this box's ffmpeg has no
libfreetype/libass** (no `drawtext`/`subtitles`), text fell back to Arial with a
black stroke. The channel's real identity (Space Grotesk display + Inter,
cyan/amber palette in `src/lib/theme.ts`, the voice-anchored kinetic captions in
`src/viral/components/KineticText.tsx`) never got applied.

**Rule going forward:** composite cinematic footage (Veo/Kling/Higgsfield)
*through Remotion* as a `brollVideo` backdrop, so it inherits the engine's
captions, palette, grade and grain. Do NOT hand-edit footage + text in ffmpeg.

---

## Shipped

### Tier 1 — audio + sync (biggest audible/visible wins)

1. **Audio mastering pipeline** — `scripts/lib/master.py` + `scripts/master_video.py`.
   Two-pass `loudnorm` to −14 LUFS / −1.5 dBTP, plus `mix_music_ducked()` which
   sidechain-ducks a music bed under the voice. There was *no* loudness
   normalization anywhere before; the brokentime cinematic cut measured −22 LUFS
   (≈8 LU too quiet). **Make this the last step of every render**, including the
   subscribe-outro splice:
   `python3 scripts/master_video.py out/<video>.mp4 [--music public/beds/<bed>.mp3]`

2. **Real word timings on the Hume path** — `scripts/build_short.py` now force-
   aligns Hume/Cartesia audio via ElevenLabs `/forced-alignment` (the code
   existed in `eleven.py`, was never wired in). Captions on the *primary* voice
   engine used to run on a syllable estimator and drift. On by default; off for
   `--voice hume-cartesia`, override with `--align` / `--no-align`.

3. **Motion b-roll through Remotion + shared grade** — `Backdrop` now takes a
   `brollVideo` (OffthreadVideo) and applies a tone-driven cinematic grade
   (`FootageGrade`: shadow-multiply + highlight-screen) so mixed-source footage
   shares one look. This is the supported way to use cinematic clips (see
   meta-lesson). Plan field: `"brollVideo": "shorts/<slug>/clips/<id>.mp4"`.

### Tier 2 — Higgsfield-inspired structure

4. **Named camera-move grammar** — `src/viral/lib/camera.ts`. Moves: `push`,
   `pull`, `crash-zoom`, `dolly-in`, `orbit`, `dutch`, `handheld`, `static`.
   Layerable per scene (`"camera": ["dolly-in","handheld"]`), composed in
   `CameraRig`. `MOVE_PROMPT`/`movePrompt()` emit the same move as a text-to-
   video prompt clause so generated footage moves the way the code moves.
   Scenes with no `camera` inherit their tone's default move.

5. **Shot-recipe presets** — `src/viral/lib/recipes.ts`. One `"recipe"` id
   (`cosmic-reveal`, `orbital-awe`, `shock-slam`, `handheld-tension`, …) bundles
   a camera move + suggested tone/transition + a lens phrase. `recipePrompt(id)`
   gives the matching T2V prompt. Fixes "never cycle the same 3 generic scenes."

6. **Hook generate→score→pick loop** — `scripts/hook_lab.py` + `HOOK-LAB.md` +
   a `hookVariants` plan field. Generates VO for each hook angle with real
   timings; the agent scores each with the Higgsfield virality predictor (Hook
   Score + Hold Rate) via MCP and promotes the winner.

### Tier 3 — polish

7. **Caption legibility plates** — `KineticText` `plate` prop: a fade-in
   semi-opaque rounded backing behind captions, auto-enabled by scenes over
   footage (`brollVideo`/`brollExists`) and always on in host mode.

8. **Tone-derived pacing** — `lead`/`hold` moved into `ToneStyle`; `buildTimeline`
   reads them per scene. Shock cuts fast (hold 8f), awe lingers (hold 20f).
   Was a single global `HOLD=14` for every tone.

9. **Cross-dissolve default + full transition-in** — new `dissolve` transition;
   plain cuts now get a soft-cut entrance instead of a hard slam. `transitionIn`
   honors whip/flash/zoomblast/dissolve (was whip-only). Scene 1 still opens
   hard (channel rule).

10. **Grain fix** — `Backdrop` grain tile enlarged 240→512px, 3 octaves,
    stitched, prime-stepped per-frame offset, so it stops visibly repeating on
    1080/1920 frames.

---

## Next (not yet done)

- **Distinct scene compositions** — Hook/ShockFact/Quote/CTA are still mostly
  centered kinetic text over the same stage. Give 2-3 of them genuinely
  different layouts (asymmetric, full-bleed footage, lower-third).
- **Bake the master step into the render scripts** so no upload can skip it.
- **Real RMS-driven VoicePulse** (HUD bars are faked from word density).
- **Per-tone ElevenLabs delivery** (`TTS_SETTINGS` is global; Hume path already
  varies by tone via `TONE_DIRECTION`).
- **A `HookProbe` composition** to fully automate rendering each hook variant
  (currently the render step in HOOK-LAB.md is manual).

## Files touched
`scripts/lib/master.py` (new), `scripts/master_video.py` (new),
`scripts/hook_lab.py` (new), `scripts/build_short.py`,
`src/viral/lib/{types,tone,plan,camera(new),recipes(new)}.ts`,
`src/viral/components/{CameraRig,Backdrop,KineticText}.tsx`,
`src/viral/ShortEngine.tsx`, `src/viral/scenes/index.tsx`,
`HOOK-LAB.md` (new), `ROADMAP.md` (new).
