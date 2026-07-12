# Rogue Planet — AI b-roll swap guide

The episode renders **100% procedurally** today (no external footage needed). Every
visual is code-drawn SVG/DOM in `src/rogueplanet/scenes/`. This file is the turnkey
path to drop in Veo/VIO or Higgsfield clips where you want photoreal footage instead
of (or behind) the diagrams.

## How to swap a scene to an AI clip

1. Generate the clip (prompts below) and save it to
   `public/rogueplanet/clips/<name>.mp4`.
2. In `src/rogueplanet/scenes/index.tsx`, wrap that scene's body in `RogueClipScene`
   (already imported-ready from `./common`). Example — the comet scene:

   ```tsx
   // before (procedural):
   export const CometScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => (
     <RogueGraphicScene clipId="comet" ...> <CometStorm .../> ... </RogueGraphicScene>
   );

   // after (Veo footage, overlays kept):
   import { RogueClipScene } from "./common";
   export const CometScene: React.FC<SceneProps> = (p) => (
     <RogueClipScene {...p} clipId="comet" src="rogueplanet/clips/comet-storm.mp4"
       chapter="PHASE 05 · THE COMET STORM" title={"THE COMETS\nWAKE UP"}>
       {/* keep <CometStorm/> here as an overlay for extra density, or drop it */}
     </RogueClipScene>
   );
   ```

3. Re-render: `python3 scripts/render_and_master.py RoguePlanet out/rogueplanet.mp4`.

`RogueClipScene` already applies the cinematic grade, edge-darkening wash, Ken-Burns
push, vignette + grain, chapter card and key captions — so footage matches the
channel look. Clips are muted so they never fight the VO.

## Credit strategy (your 50-credit Higgsfield plan)

Per the brief + project memory: **spend Higgsfield only on emotional, human-scale
shots** (an astronomer's face, a family under the sky, a lone figure on a frozen
coast). Use **Veo/VIO for planets, maps, comets, cosmic scale** — cheaper per second
and better at space. The first 30 seconds (hook) is the highest-value spend: generate
2-3 hook variants and A/B them with the Higgsfield `virality_predictor` before
committing (see the `higgsfield-broll-pipeline` skill). The procedural hook already
in the render is the fallback if a generation underwhelms.

> ⚠ The Higgsfield MCP was **not connected** in the session that built this episode,
> so no credits were spent yet. Run the generation in an interactive session with the
> Higgsfield connector enabled, or via the `higgsfield-broll-pipeline` skill.

---

## Shot list — scene → clip → prompt

### HOOK (0-30s) — the retention-critical opener  ·  **SHIPPED: 4 Veo clips**
The hook now plays **4 real Veo 3.1 shots** as hard cuts (~7s each): `hook_astro`
(terrified astronomer, anomaly reflected in her glasses) → `hook_rogue` (icy rogue
world + debris) → `hook_lens` (a dark mass eclipsing a star into a lensing ring) →
`hook_scale` (a lone cratered world in a nebula), with NO WARNING / NO LIGHT / A ROGUE
PLANET stabs + captions on top. Regenerate: `.venv-lipsync/bin/python
scripts/rogueplanet/gen_veo_hook.py`. Toggle back to the procedural fallback via
`USE_VEO_HOOK = false` in `scenes/index.tsx`. To A/B a Higgsfield human variant of the
astronomer for even more punch, use the `higgsfield-broll-pipeline` skill (needs the
Higgsfield connector; wasn't available in the build session). Original prompt refs:
- **Higgsfield shot 1 (human):** 16:9 cinematic. A lone astronomer stands in a dark
  observatory at night, face lit by a cold blue monitor glow, looking terrified as a
  hidden object appears on a star map. Shallow DoF, dark moody lighting, subtle push-in,
  no logos, no text, no watermark.
- **Veo shot 1 (cosmic):** 16:9 deep-space shot of a massive rogue planet drifting
  through darkness without a star, almost invisible except for faint blue rim light and
  ice particles around it. Slow push-in, cosmic dust, terrifying scale, ultra realistic,
  no text, no logos.

### GRAVITY / WHAT IT IS — solar-system map  ·  `solar-system-map.mp4`
Procedural `SolarSystemMap` is strong here; a Veo map is optional.
- **Veo shot 3:** 16:9 animated solar system map. Sun at center, planets orbiting as
  thin glowing lines, then a dark rogue planet enters from outside Neptune's orbit.
  Orbits begin to bend. Clean scientific visualization, cyan and orange accents, no text.

### WHY WE'RE BLIND — microlensing  ·  `microlensing.mp4`
- **Veo shot 2:** 16:9 scientific cinematic viz of a dark invisible planet passing in
  front of distant stars, bending and magnifying the starlight into a subtle glowing
  ring. Clean but dramatic, black background, blue-white starfield, no labels, no text.

### THE FIRST SIGNS — Neptune wobble  ·  `neptune-orbit-wobble.mp4`
- **Veo shot 4:** 16:9 viz of Neptune's orbit disturbed by a passing rogue planet. Thin
  orbital lines warp, Neptune glows icy blue, the rogue planet a huge black sphere in the
  distance. Scientific, dramatic, no labels, no logos.

### THE COMET STORM  ·  `comet-storm.mp4`
- **Veo shot 5:** 16:9 shot of thousands of icy comets pulled from the outer solar
  system and sent inward toward the Sun. Glowing trails, deep space, chaotic but
  beautiful, high-detail, no text, no logos.

### EARTH'S ORBIT / WORST CASE — orbit shift  ·  `earth-orbit-shift.mp4`
- **Veo shot 6:** 16:9 viz of Earth's orbit slowly stretching from a stable circle into
  an unstable ellipse around the Sun. Earth glows blue, orbit line turns red at the
  dangerous sections, no labels, no logos.

### THE ENDING — frozen Earth  ·  `frozen-earth.mp4`
- **Veo shot 7:** 16:9 view of Earth from space slowly freezing as clouds swirl and ice
  expands across continents. The Sun appears smaller and dimmer in the distance.
  Realistic, haunting, no text, no logos.
- **Higgsfield shot 5 (human):** 16:9 emotional shot. A lone person in a winter coat on
  a frozen coastline under a darkened sky, watching a massive shadowy planet near the
  horizon. Cold blue atmosphere, slow wind, haunting beauty, realistic, no text, no logos.

### Extra human beats (drop in as pattern interrupts anywhere)
- **Higgsfield shot 2:** scientist turning from a telescope, stunned, red emergency light.
- **Higgsfield shot 3:** family outside at night looking up at an unnatural dark shape.
- **Higgsfield shot 4:** government science briefing room, distorted orbits on a projection.

### Veo shot 8 (optional) — Earth too close to the Sun
16:9 view of Earth moving dangerously closer to the Sun, atmosphere glowing orange,
oceans evaporating into white cloud bands, dramatic but realistic, no explosions, no text.
