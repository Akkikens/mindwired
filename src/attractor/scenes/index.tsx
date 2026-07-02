import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { easeInOut, CamPath } from "../../three/Stage3D";
import {
  Galaxy3D, GalaxyField3D, GravityBasin3D, FlowLines3D, GlowOrb3D,
} from "../../three/cosmic";
import { Captions } from "../../components/Captions";
import { StatCallout } from "../../components/StatCallout";
import { Vignette } from "../../components/FilmLook";
import { CosmicScene } from "./CosmicScene";
import { ImageScene, KenBurns } from "./ImageScene";
import { captionLines, wordStart } from "../lib/manifest";
import { C, DISPLAY, SANS } from "../../lib/theme";

type SceneProps = { narrationStart: number; durationInFrames: number };
const FPS = 30;
const at = (clip: string, word: string, fb: number, start: number) =>
  start + Math.round(wordStart(clip, word, fb) * FPS);
const IMG = (n: string) => `attractor/img/${n}.jpg`;

// ── 00 · Hook (real galaxy imagery + cold-open wordmark) ──────────────────────
export const HookScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const markOp = interpolate(frame, [0, 14, narrationStart - 14, narrationStart], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <KenBurns images={[IMG("galaxy_hero"), IMG("andromeda")]} durationInFrames={durationInFrames} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: markOp }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, letterSpacing: 14, color: C.cyan, textShadow: `0 0 20px ${C.cyan}`, fontWeight: 700 }}>M I N D W I R E D</div>
        <div style={{ marginTop: 18, fontFamily: DISPLAY, fontSize: 22, letterSpacing: 5, color: C.dim, textTransform: "uppercase" }}>a signal from deep space</div>
      </AbsoluteFill>
      <StatCallout value="2,000,000 KM/H" label="and you can't feel a thing"
        x={960} y={250} color={C.amber} appearAt={at("hook", "million", 8, narrationStart)} hold={4} />
      <Captions clipId="hook" startFrame={narrationStart} lines={captionLines("hook")} select="key" />
      <Vignette strength={0.95} />
    </AbsoluteFill>
  );
};

// ── 01 · The Cosmic Speedometer (real CMB map) ────────────────────────────────
export const FirstClueScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="first_clue" images={[IMG("cmb_planck")]}
    chapter="01 · The Cosmic Speedometer" title={"THE COSMIC\nSPEEDOMETER"}
    stats={[
      { value: "600 KM/S", label: "our speed vs. the Big Bang's afterglow", color: C.cyan, appearAt: at("first_clue", "hundred", 22, p.narrationStart), hold: 4.5 },
      { value: "THE GREAT ATTRACTOR", label: "named by Alan Dressler", color: C.amber, y: 820, appearAt: at("first_clue", "Dressler", 66, p.narrationStart), hold: 5 },
    ]} />
);

// ── 02 · The Universal Tug of War (deep field of galaxies) ────────────────────
export const TugOfWarScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="tug_of_war" images={[IMG("deepfield"), IMG("cluster")]}
    chapter="02 · The Universal Tug Of War" title={"THE UNIVERSAL\nTUG OF WAR"}
    stats={[{ value: "OVERPOWERING DARK ENERGY", label: "the expansion of the universe, defied", color: C.amber, appearAt: at("tug_of_war", "overpowering", 40, p.narrationStart), hold: 5 }]} />
);

// ── 03 · The Zone of Avoidance (looking into the galactic plane) ──────────────
export const ZoneScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="zone" images={[IMG("galactic_core")]}
    chapter="03 · Into The Zone Of Avoidance" title={"THE ZONE OF\nAVOIDANCE"}
    stats={[{ value: "1/5 OF THE SKY", label: "hidden behind our own galaxy", color: C.cyan, appearAt: at("zone", "fifth", 36, p.narrationStart), hold: 5 }]} />
);

// ── 04 · The Scale of the Monster (3D gravity basin — un-photographable) ──────
const scaleCam: CamPath = (t) => {
  const e = easeInOut(t);
  const ang = interpolate(e, [0, 1], [-0.6, 0.2]);
  return { pos: [Math.sin(ang) * 22, interpolate(e, [0, 1], [10, 4]), Math.cos(ang) * 22], target: [0, -3, 0], fov: 44 };
};
export const ScaleScene: React.FC<SceneProps> = (p) => (
  <CosmicScene {...p} clipId="scale" camera={scaleCam}
    chapter="04 · The Scale Of The Monster" title={"THE SCALE OF\nTHE MONSTER"}
    bloom={{ intensity: 1.2, threshold: 0.45 }}
    stats={[{ value: "10,000 MILKY WAYS", label: "one gravitational well", color: C.amber, appearAt: at("scale", "thousand", 40, p.narrationStart), hold: 5 }]}>
    <GravityBasin3D size={34} segments={64} depth={10} sigma={5.5} color="#4FB4FF" />
    <GalaxyField3D count={700} clusters={12} spread={40} seed={5} />
  </CosmicScene>
);

// ── 05 · The Dipole Repeller (3D push/pull diagram) ───────────────────────────
const repCam: CamPath = (t) => {
  const e = easeInOut(t);
  return { pos: [interpolate(e, [0, 1], [2, -2]), 1.5, interpolate(e, [0, 1], [15, 12])], target: [0, 0, 0], fov: 50 };
};
export const RepellerScene: React.FC<SceneProps> = (p) => (
  <CosmicScene {...p} clipId="repeller" camera={repCam}
    chapter="05 · The Dipole Repeller" title={"THE DIPOLE\nREPELLER"}
    bloom={{ intensity: 1.1, threshold: 0.5 }}
    stats={[{ value: "← PUSH    PULL →", label: "a cosmic tug of war", color: C.ice, appearAt: at("repeller", "tug", 60, p.narrationStart), hold: 5 }]}>
    <GlowOrb3D position={[11, 0, -2]} radius={1.6} color="#FFB860" intensity={0.8} />
    <mesh position={[-11, 0, -3]}><sphereGeometry args={[3.6, 32, 32]} /><meshBasicMaterial color="#04070e" toneMapped={false} /></mesh>
    <mesh position={[-11, 0, -3]}><sphereGeometry args={[3.9, 32, 32]} /><meshBasicMaterial color="#2a4a7a" toneMapped={false} transparent opacity={0.16} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} /></mesh>
    <GalaxyField3D count={800} clusters={14} spread={26} seed={9} />
    <Galaxy3D position={[0, 0, 1]} scale={0.4} radius={3} spin={0.002} />
  </CosmicScene>
);

// ── 06 · Laniakea (3D flow-lines — un-photographable) ─────────────────────────
const lanCam: CamPath = (t) => {
  const e = easeInOut(t);
  return { pos: [interpolate(e, [0, 1], [4, -3]), interpolate(e, [0, 1], [6, 12]), interpolate(e, [0, 1], [18, 20])], target: [0, 0, 0], fov: 46 };
};
export const LaniakeaScene: React.FC<SceneProps> = (p) => (
  <CosmicScene {...p} clipId="laniakea" camera={lanCam}
    chapter="06 · Laniakea" title={"LANIAKEA"}
    bloom={{ intensity: 1.2, threshold: 0.45 }}
    stats={[{ value: "100,000 GALAXIES", label: "our cosmic continent", color: C.teal, appearAt: at("laniakea", "thousand", 44, p.narrationStart), hold: 5 }]}>
    <FlowLines3D lines={48} target={[0, 0, 0]} spread={22} color="#5FE0D0" />
    <GalaxyField3D count={1300} clusters={20} spread={24} seed={13} />
    <GlowOrb3D position={[0, 0, 0]} radius={0.8} color="#FFD08A" intensity={0.9} />
  </CosmicScene>
);

// ── 07 · The Bigger Giant (real massive cluster) ──────────────────────────────
export const ShapleyScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="shapley" images={[IMG("cluster")]}
    chapter="07 · The Bigger Giant" title={"THE BIGGER\nGIANT"}
    stats={[{ value: "SHAPLEY CONCENTRATION", label: "the greatest mass in the nearby universe", color: C.amber, appearAt: at("shapley", "Shapley", 40, p.narrationStart), hold: 5 }]} />
);

// ── 08 · Will We Ever Arrive? (real deep field, drifting) ─────────────────────
export const DestinationScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="destination" images={[IMG("deepfield")]}
    chapter="08 · Will We Ever Arrive?" title={"WILL WE EVER\nARRIVE?"}
    stats={[{ value: "DARK ENERGY WINS", label: "the finish line is racing away", color: C.ice, appearAt: at("destination", "expansion", 30, p.narrationStart), hold: 6 }]} />
);

// ── 09 · Outro (real galaxy + wordmark + subscribe) ───────────────────────────
export const OutroScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame: frame - narrationStart, fps, config: { damping: 200 } });
  const subAppear = narrationStart + Math.round((wordStart("outro", "subscribe", 26) - 0.8) * fps);
  const subS = spring({ frame: frame - subAppear, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [subAppear, subAppear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 26, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      <KenBurns images={[IMG("galaxy_hero")]} durationInFrames={durationInFrames} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -150 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 16, color: C.white, textShadow: `0 0 40px ${C.cyan}`, opacity: markS, transform: `translateY(${interpolate(markS, [0, 1], [30, 0])}px)` }}>MINDWIRED</div>
        <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: C.dim, textTransform: "uppercase", opacity: markS }}>the strange machinery of our universe</div>
        <div style={{ marginTop: 54, opacity: subOp, transform: `scale(${interpolate(subS, [0, 1], [0.8, 1])})`, display: "flex", alignItems: "center", gap: 18, background: C.danger, padding: "20px 46px", borderRadius: 60, boxShadow: `0 0 40px ${C.danger}66` }}>
          <div style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: `26px solid ${C.white}`, marginLeft: 6 }} />
          <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: C.white }}>SUBSCRIBE</span>
        </div>
      </AbsoluteFill>
      <Captions clipId="outro" startFrame={narrationStart} lines={captionLines("outro")} select="key" />
      <Vignette strength={0.95} />
    </AbsoluteFill>
  );
};
