/** The 14 scenes of "A Rogue Planet Enters Our Solar System." All visuals are
 *  procedural (code-drawn) so the episode renders end-to-end with no external
 *  footage. Where AI b-roll would elevate a beat, a [CLIP SLOT] comment names the
 *  exact Veo/Higgsfield shot and the one-line swap (see src/rogueplanet/CLIPS.md).
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../../components/Captions";
import { Vignette, Grain } from "../../components/FilmLook";
import { C, DISPLAY, SANS } from "../../lib/theme";
import { captionLines, wordStart } from "../lib/manifest";
import { RogueGraphicScene, at } from "./common";
import {
  Starfield, DustField, RoguePlanet, Microlensing, SolarSystemMap, EventTimeline,
  CometStorm, OrbitEllipse, EjectionPath, FrozenEarth, GlowLabel, LowerThird, TextHit,
} from "./graphics";

type SceneProps = { narrationStart: number; durationInFrames: number };
const FPS = 30;

// heartbeat-synced camera push for the cold open (subtle scale pulse) ────────────
const usePulse = (until: number, bpm = 54) => {
  const frame = useCurrentFrame();
  if (frame > until) return 1;
  const beat = (frame / FPS) * (bpm / 60);
  const thump = Math.pow(Math.max(0, Math.sin(beat * Math.PI)), 8);
  return 1 + thump * 0.012;
};

// ── 0. HOOK — the first 30 seconds ──────────────────────────────────────────────
// Two implementations, switched by USE_VEO_HOOK:
//  • HookSceneCine — 6 AI plates as hard cuts (a pattern interrupt every ~5s),
//    alternating Higgsfield human-emotion shots (Kling 3.0 Turbo) with Veo cosmic
//    shots, text stabs + captions on top:
//      hf_astro (terrified astronomer) → hook_rogue (icy rogue world) →
//      hf_family (dark ring over rooftops) → hook_lens (star lensing ring) →
//      hf_warning (bending-orbits viz) → hook_scale (lone world in a nebula).
//    Clips in public/rogueplanet/clips/. Regenerate: Higgsfield via the
//    higgsfield-broll-pipeline skill; Veo via scripts/rogueplanet/gen_veo_hook.py.
//  • HookSceneProcedural — pure code-drawn fallback (no footage needed).
// Flip to false if a clip is missing so the render never breaks on a bad file.
const USE_VEO_HOOK = true;
// per-cut lengths (frames) sum to the hook duration (~912f @ 30fps); Higgsfield
// clips are ~151f, Veo ~240f, so every window fits inside its source.
const HOOK_SHOTS: { src: string; len: number }[] = [
  { src: "hf_astro",   len: 150 },
  { src: "hook_rogue", len: 168 },
  { src: "hf_family",  len: 150 },
  { src: "hook_lens",  len: 150 },
  { src: "hf_warning", len: 128 },
  { src: "hook_scale", len: 166 },
];
const HOOK_GRADE = "contrast(1.08) saturate(1.05) brightness(0.92)";

/** one plate, cropped full-frame with a slow push and crossfade edges. */
const HookClip: React.FC<{ src: string; from: number; dur: number }> = ({ src, from, dur }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const op = Math.min(
    interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [dur - 14, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const scale = interpolate(local, [0, dur], [1.05, 1.13]);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo src={staticFile(`rogueplanet/clips/${src}.mp4`)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, filter: HOOK_GRADE }} />
    </AbsoluteFill>
  );
};

export const HookSceneCine: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  // scale the cut lengths to fit the actual hook duration exactly
  const total = HOOK_SHOTS.reduce((a, s) => a + s.len, 0);
  const k = durationInFrames / total;
  let cursor = 0;
  const windows = HOOK_SHOTS.map((s) => {
    const from = Math.round(cursor);
    cursor += s.len * k;
    return { src: s.src, from, dur: Math.round(s.len * k) + 12 };
  });
  const lensWin = windows[3]; // hook_lens — overlay a live microlensing flare
  const kickOp = interpolate(frame, [10, 24, narrationStart - 6, narrationStart + 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      {windows.map((w, i) => (
        <HookClip key={i} src={w.src} from={i ? w.from - 10 : w.from} dur={i ? w.dur + 10 : w.dur} />
      ))}
      {/* edge-darkening wash so overlays read over bright footage */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 42%, rgba(10,30,60,0) 40%, rgba(2,6,16,0.55) 100%)", pointerEvents: "none" }} />
      <Microlensing cx={1250} cy={330} progress={interpolate(frame, [lensWin.from + 18, lensWin.from + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 130, opacity: kickOp, pointerEvents: "none" }}>
        <div style={{ fontFamily: SANS, fontSize: 20, letterSpacing: 10, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}` }}>Mindwired · deep-field anomaly</div>
      </AbsoluteFill>

      <TextHit text="NO WARNING" sub="no one would see it coming" color={C.danger}
        appearAt={at("hook", "warning", 6.5, narrationStart)} hold={1.7} y={460} />
      <TextHit text="NO LIGHT" sub="a world with no sun" color={C.ice}
        appearAt={at("hook", "glowing", 9.5, narrationStart)} hold={1.7} y={460} />
      <TextHit text="A ROGUE PLANET" color={C.amber} size={132}
        appearAt={at("hook", "rogue", 22, narrationStart)} hold={2.6} y={510} />

      <Captions clipId="hook" startFrame={narrationStart} lines={captionLines("hook")} select="key" />
      <Vignette strength={1.0} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

// ── procedural fallback (no footage) ─────────────────────────────────────────────
const HookSceneProcedural: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const pulse = usePulse(narrationStart + 18 * FPS);
  // rogue planet drifts slowly from lower-left, growing, pushing toward camera
  const px = interpolate(frame, [0, durationInFrames], [520, 1180]);
  const py = interpolate(frame, [0, durationInFrames], [720, 470]);
  const pr = interpolate(frame, [0, durationInFrames], [90, 190]);
  // opening title-less kicker fades before narration
  const kickOp = interpolate(frame, [10, 24, narrationStart - 6, narrationStart + 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 62% 42%, #08132b 0%, #02040a 68%)", opacity: endFade }}>
      <AbsoluteFill style={{ transform: `scale(${pulse})` }}>
        <Starfield count={300} seed={11} drift={9} />
        <DustField color={C.cyan} count={54} />
        {/* three background stars that flicker via microlensing as the mass passes */}
        <Microlensing cx={640} cy={360} progress={interpolate(frame, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <Microlensing cx={1320} cy={300} progress={interpolate(frame, [markFlick(narrationStart, "distortion", 210), markFlick(narrationStart, "distortion", 210) + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <Microlensing cx={980} cy={640} progress={interpolate(frame, [durationInFrames - 130, durationInFrames - 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <RoguePlanet cx={px} cy={py} r={pr} rim="#6aa0ff" drift={10} glow={0.85} />
      </AbsoluteFill>

      {/* opening kicker (before narration) */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150, opacity: kickOp, pointerEvents: "none" }}>
        <div style={{ fontFamily: SANS, fontSize: 20, letterSpacing: 10, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}` }}>Mindwired · deep-field anomaly</div>
      </AbsoluteFill>

      {/* hard text stabs, synced to the narration */}
      <TextHit text="NO WARNING" sub="no one would see it coming" color={C.danger}
        appearAt={at("hook", "warning", 6.5, narrationStart)} hold={1.7} y={470} />
      <TextHit text="NO LIGHT" sub="a world with no sun" color={C.ice}
        appearAt={at("hook", "glowing", 9.5, narrationStart)} hold={1.7} y={470} />
      <TextHit text="A ROGUE PLANET" color={C.amber} size={132}
        appearAt={at("hook", "rogue", 22, narrationStart)} hold={2.6} y={520} />

      <Captions clipId="hook" startFrame={narrationStart} lines={captionLines("hook")} select="key" />
      <Vignette strength={1.0} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
// helper: frame of a word inside the hook clip (local scene space)
function markFlick(narrationStart: number, word: string, fb: number) {
  return narrationStart + Math.round(wordStart("hook", word, fb / FPS) * FPS);
}

// the hook the rest of the video imports — AI plates when available, else procedural
export const HookScene: React.FC<SceneProps> = USE_VEO_HOOK ? HookSceneCine : HookSceneProcedural;

// ── 1. INTRO — wordmark bloom (silent beat, ~3s) ────────────────────────────────
export const IntroScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloom = spring({ frame, fps, config: { damping: 200, mass: 0.9 } });
  const op = interpolate(frame, [0, 14, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", justifyContent: "center", alignItems: "center", opacity: op }}>
      <Starfield count={160} seed={3} />
      <div style={{
        fontFamily: DISPLAY, fontSize: 96, fontWeight: 800,
        letterSpacing: interpolate(bloom, [0, 1], [40, 18]), color: C.white,
        textShadow: `0 0 ${interpolate(bloom, [0, 1], [80, 34])}px ${C.cyan}, 0 0 90px ${C.cyan}55`,
        transform: `scale(${interpolate(bloom, [0, 1], [0.9, 1])})`,
      }}>MINDWIRED</div>
      <div style={{ marginTop: 18, fontFamily: SANS, fontSize: 24, letterSpacing: 7, color: C.dim, textTransform: "uppercase", opacity: interpolate(bloom, [0.3, 1], [0, 1]) }}>
        the strange machinery of our universe
      </div>
    </AbsoluteFill>
  );
};

// ── 2. TITLE — main title card (silent beat, ~4.5s) ─────────────────────────────
export const TitleScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const rule = interpolate(s, [0, 1], [0, 720]);
  const op = interpolate(frame, [0, 12, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 40%, #071026 0%, #02040a 70%)", opacity: op }}>
      <Starfield count={200} seed={9} />
      <DustField color={C.cyan} />
      {/* faint solar-system map behind the title */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <SolarSystemMap cx={960} cy={560} scale={0.9} rogueProgress={interpolate(frame, [0, durationInFrames], [0.05, 0.35])} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
        <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 8, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 14px ${C.cyan}`, opacity: interpolate(s, [0, 0.6], [0, 1]) }}>A cosmic what-if</div>
        <div style={{ height: 3, width: rule, marginTop: 22, marginBottom: 22, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, boxShadow: `0 0 12px ${C.cyan}` }} />
        <div style={{ fontFamily: DISPLAY, fontSize: 104, fontWeight: 800, letterSpacing: 3, color: C.white, textAlign: "center", lineHeight: 0.98, textShadow: `0 6px 34px rgba(0,0,0,0.8), 0 0 50px ${C.danger}44` }}>
          A ROGUE PLANET<br />ENTERS THE SOLAR SYSTEM
        </div>
      </AbsoluteFill>
      <Vignette strength={0.95} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

// ── 3. GRAVITY — the thesis punch. Rogue crosses into the map; no collision. ─────
export const GravityScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [0, durationInFrames], [0.2, 0.85]);
  return (
    <RogueGraphicScene clipId="gravity" narrationStart={narrationStart} durationInFrames={durationInFrames} starSeed={13}>
      <SolarSystemMap cx={860} cy={560} scale={1} rogueProgress={prog} distort={interpolate(frame, [0, durationInFrames], [0, 0.4])} labelEarth />
      <TextHit text="NO IMPACT NEEDED" color={C.danger} size={104}
        appearAt={at("gravity", "hit", 2.2, narrationStart)} hold={2.2} y={230} />
      <TextHit text="GRAVITY IS ENOUGH" color={C.amber} size={112}
        appearAt={at("gravity", "close", 5.5, narrationStart)} hold={2.6} y={230} />
    </RogueGraphicScene>
  );
};

// ── 4. WHAT IT IS — the solar system as a fragile balance ───────────────────────
export const WhatIsScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => (
  <RogueGraphicScene clipId="whatis" narrationStart={narrationStart} durationInFrames={durationInFrames}
    chapter="PHASE 01 · WHAT IT IS" title={"A FRAGILE\nBALANCE"} starSeed={5}>
    <SolarSystemMap cx={1120} cy={560} scale={0.95} rogueProgress={0} labelEarth />
    <LowerThird kicker="The solar system" line="a gravitational agreement, stable for billions of years"
      color={C.cyan} appearAt={at("whatis", "agreement", 8, narrationStart)} hold={5} />
    <LowerThird kicker="Introduce one new world" line="…and the entire system begins to negotiate again"
      color={C.amber} appearAt={at("whatis", "negotiate", 24, narrationStart)} hold={4} />
  </RogueGraphicScene>
);

// ── 5. WHY WE'RE BLIND — gravitational microlensing ─────────────────────────────
export const InvisibleScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const flick = at("invisible", "brighten", 30, narrationStart);
  return (
    <RogueGraphicScene clipId="invisible" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 02 · WHY WE'RE BLIND" title={"A STAR\nTHAT FLICKERS"} starSeed={17}>
      {/* a field of stars; the central one flares into an Einstein ring */}
      <Microlensing cx={960} cy={520} progress={interpolate(frame, [flick, flick + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Microlensing cx={620} cy={400} progress={interpolate(frame, [flick + 80, flick + 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <GlowLabel x={1010} y={520} title="Microlensing" value="light bent by unseen mass" color={C.ice}
        appearAt={flick} leaderTo={{ x: 960, y: 520 }} />
      <TextHit text="THE FIRST FINGERPRINT" color={C.cyan} size={80}
        appearAt={at("invisible", "flicker", 36, narrationStart)} hold={2.4} y={860} />
    </RogueGraphicScene>
  );
};

// ── 6. THE FIRST SIGNS — Neptune's orbit deviates; the cascade timeline ──────────
export const NeptuneScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const distort = interpolate(frame, [0, durationInFrames], [0.05, 0.9]);
  return (
    <RogueGraphicScene clipId="neptune" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 03 · THE FIRST SIGNS" title={"NEPTUNE\nMOVES FIRST"} starSeed={23}>
      <SolarSystemMap cx={860} cy={520} scale={0.92} rogueProgress={interpolate(frame, [0, durationInFrames], [0.15, 0.55])} distort={distort} />
      <EventTimeline items={["FLICKER", "NEPTUNE", "URANUS", "ICY BODIES"]}
        startAt={at("neptune", "Neptune", 6, narrationStart)} step={26} y={930} color={C.danger} />
      <TextHit text="NEPTUNE MOVES FIRST" color={C.danger} size={78}
        appearAt={at("neptune", "betray", 4, narrationStart)} hold={2.2} y={190} />
    </RogueGraphicScene>
  );
};

// ── 7. THE OUTER SYSTEM — the frozen reservoir is shaken loose ───────────────────
export const FreezerScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [durationInFrames * 0.4, durationInFrames], [0.1, 0.7], { extrapolateLeft: "clamp" });
  return (
    <RogueGraphicScene clipId="freezer" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 04 · THE OUTER SYSTEM" title={"THE FROZEN\nRESERVOIR"} starSeed={29} starHue={C.ice}>
      <SolarSystemMap cx={960} cy={560} scale={0.95} rogueProgress={0.55} distort={0.5} highlightBelt />
      <CometStorm cx={960} cy={560} intensity={intensity} count={18} seed={8} />
      <LowerThird kicker="Beyond Neptune" line="comets, frozen debris — flung inward, toward us"
        color={C.ice} appearAt={at("freezer", "reservoir", 30, narrationStart)} hold={5} />
    </RogueGraphicScene>
  );
};

// ── 8. THE COMET STORM — icy bodies rain toward the inner system ─────────────────
//    [CLIP SLOT] Veo shot 5 (comet storm): wrap in
//    <RogueClipScene src="rogueplanet/clips/comet-storm.mp4" …> and drop the
//    <CometStorm/> below (or keep it as an overlay for extra density).
export const CometScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => (
  <RogueGraphicScene clipId="comet" narrationStart={narrationStart} durationInFrames={durationInFrames}
    chapter="PHASE 05 · THE COMET STORM" title={"THE COMETS\nWAKE UP"} starSeed={31}>
    <CometStorm cx={960} cy={540} intensity={1} count={30} seed={4} />
    {/* the Sun / inner system they fall toward */}
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle, #FFF4D6, ${C.amber} 45%, transparent 75%)`, boxShadow: `0 0 60px ${C.amber}` }} />
    <TextHit text="EVERY ONE IS A ROLL OF THE DICE" color={C.gold} size={62}
      appearAt={at("comet", "dice", 20, narrationStart)} hold={2.6} y={200} />
  </RogueGraphicScene>
);

// ── 9. EARTH'S ORBIT — the circle stretches into a killing ellipse ──────────────
export const OrbitScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const stretch = interpolate(frame, [narrationStart, durationInFrames - 30], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <RogueGraphicScene clipId="orbit" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 06 · EARTH'S ORBIT" title={"EARTH'S ORBIT\nBREAKS"} starSeed={37}>
      <OrbitEllipse stretch={stretch} cx={960} cy={560} base={300} />
      <GlowLabel x={1330} y={560} title="Aphelion" value="oceans freeze" color={C.ice} appearAt={at("orbit", "farther", 22, narrationStart)} />
      <GlowLabel x={560} y={560} title="Perihelion" value="brutal heat" color={C.ember} align="right" appearAt={at("orbit", "closer", 16, narrationStart)} />
      <TextHit text="EARTH'S ORBIT BREAKS" color={C.danger} size={72}
        appearAt={at("orbit", "stretched", 26, narrationStart)} hold={2.2} y={180} />
    </RogueGraphicScene>
  );
};

// ── 10. THE WORST CASE — a close encounter throws Earth out of the system ────────
export const WorstCaseScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [narrationStart, durationInFrames - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <RogueGraphicScene clipId="worstcase" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 07 · THE WORST CASE" title={"THROWN INTO\nTHE DARK"} starSeed={41}>
      <EjectionPath progress={prog} cx={820} cy={560} />
      <TextHit text="THROWN INTO THE DARK" color={C.danger} size={78}
        appearAt={at("worstcase", "thrown", 28, narrationStart)} hold={2.8} y={200} />
    </RogueGraphicScene>
  );
};

// ── 11. THE ENDING — a frozen wandering Earth; the Sun shrinks away ──────────────
//    [CLIP SLOT] Veo shot 7 (frozen Earth) / Higgsfield shot 5 (lone figure on a
//    frozen coast): wrap in <RogueClipScene src="rogueplanet/clips/frozen-earth.mp4" …>.
export const FrozenScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const freeze = interpolate(frame, [narrationStart, durationInFrames - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <RogueGraphicScene clipId="frozen" narrationStart={narrationStart} durationInFrames={durationInFrames}
      chapter="PHASE 08 · THE ENDING" title={"A WANDERING\nWORLD"} starSeed={43} starHue={C.ice} dust={false}>
      <FrozenEarth freeze={freeze} cx={1080} cy={540} r={200} />
      <TextHit text="THE SUN GETS SMALLER" color={C.ice} size={70}
        appearAt={at("frozen", "shrink", 2, narrationStart)} hold={2.4} y={190} />
    </RogueGraphicScene>
  );
};

// ── 12. HAUNTING CLOSE — a single distant star that flickers ─────────────────────
export const EndingScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const flick = at("ending", "flickers", 24, narrationStart);
  const endFade = interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      <Starfield count={260} seed={2} drift={4} />
      <DustField color={C.ice} count={30} />
      {/* a faraway rogue silhouette slipping away */}
      <RoguePlanet cx={interpolate(frame, [0, durationInFrames], [900, 700])} cy={560} r={54} rim="#4a7bd0" glow={0.4} />
      {/* open on the lone figure watching the world it lost (Higgsfield hf_coast),
          then dissolve to the deep-field close */}
      <HookClip src="hf_coast" from={0} dur={166} />
      {/* the final flicker */}
      <Microlensing cx={1300} cy={330} progress={interpolate(frame, [flick, flick + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Captions clipId="ending" startFrame={narrationStart} lines={captionLines("ending")} select="key" />
      <Vignette strength={1.0} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

// ── 13. OUTRO — subscribe CTA (the mandatory subscribe-outro mp4 is concatenated
//    onto the render AFTER this; this is the in-comp CTA beat). ──────────────────
export const OutroScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame: frame - narrationStart, fps, config: { damping: 200 } });
  const subAppear = narrationStart + Math.round((wordStart("outro", "subscribe", 4) - 0.6) * fps);
  const subS = spring({ frame: frame - subAppear, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [subAppear, subAppear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      <Starfield count={200} seed={6} />
      <DustField color={C.cyan} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -140, pointerEvents: "none" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 16, color: C.white, textShadow: `0 0 40px ${C.cyan}`, opacity: markS, transform: `translateY(${interpolate(markS, [0, 1], [30, 0])}px)` }}>MINDWIRED</div>
        <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: C.dim, textTransform: "uppercase", opacity: markS }}>the strange machinery of our universe</div>
        <div style={{ marginTop: 54, opacity: subOp, transform: `scale(${interpolate(subS, [0, 1], [0.8, 1])})`, display: "flex", alignItems: "center", gap: 18, background: C.danger, padding: "20px 46px", borderRadius: 60, boxShadow: `0 0 40px ${C.danger}66` }}>
          <div style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: `26px solid ${C.white}`, marginLeft: 6 }} />
          <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: C.white }}>SUBSCRIBE</span>
        </div>
      </AbsoluteFill>
      <Captions clipId="outro" startFrame={narrationStart} lines={captionLines("outro")} select="key" />
      <Vignette strength={0.95} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
