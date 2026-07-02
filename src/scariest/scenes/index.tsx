import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KenBurns } from "../../attractor/scenes/ImageScene";
import { Captions } from "../../components/Captions";
import { Vignette, Grain } from "../../components/FilmLook";
import { ScariestImageScene, StatPunch, ConsumeToBlack } from "./common";
import { wordStart, captionLines } from "../lib/manifest";
import { C, DISPLAY, SANS } from "../../lib/theme";

type SceneProps = { narrationStart: number; durationInFrames: number };
const FPS = 30;
const at = (clip: string, word: string, fb: number, start: number) =>
  start + Math.round(wordStart(clip, word, fb) * FPS);
const IMG = (n: string) => `attractor/img/${n}.jpg`;   // reused telescope imagery
const SIMG = (n: string) => `scariest/img/${n}.jpg`;   // episode-specific imagery

// ── Cold open ────────────────────────────────────────────────────────────────
export const HookScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const markOp = interpolate(frame, [0, 14, narrationStart - 14, narrationStart], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <KenBurns images={[IMG("galaxy_hero"), IMG("deepfield")]} durationInFrames={durationInFrames}
        grade="contrast(1.1) saturate(1.05) brightness(0.86)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: markOp }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, letterSpacing: 14, color: C.danger, textShadow: `0 0 22px ${C.danger}`, fontWeight: 700 }}>M I N D W I R E D</div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontSize: 22, letterSpacing: 5, color: C.dim, textTransform: "uppercase" }}>a warning from deep space</div>
      </AbsoluteFill>
      <StatPunch to={8} suffix=" PLACES" label="ranked: unsettling → nightmarish"
        color={C.danger} x={960} y={620} appearAt={at("hook", "ranked", 36, narrationStart)} hold={4} size={120} />
      <Captions clipId="hook" startFrame={narrationStart} lines={captionLines("hook")} select="key" />
      <Vignette strength={0.98} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

// ── No. 8 · Rogue planets (icy sunless world, cold-graded) ──────────────────────
export const RogueScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="rogue" images={[SIMG("dark_planet")]}
    chapter="No. 8 · Rogue Planets" title={"THE WANDERING\nWORLDS"}
    grade="contrast(1.2) saturate(0.45) brightness(0.42) hue-rotate(195deg)"
    stats={[{ to: 270, suffix: "°C BELOW", label: "a world with no sun", color: C.ice, appearAt: at("rogue", "degrees", 30, p.narrationStart), hold: 5 }]} />
);

// ── No. 7 · The Magnetar ────────────────────────────────────────────────────────
export const MagnetarScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="magnetar" images={[SIMG("magnetar")]}
    chapter="No. 7 · The Magnetar" title={"THE\nMAGNETAR"}
    grade="contrast(1.12) saturate(1.15) brightness(0.92)"
    stats={[
      { value: "ATOMS TORN APART", label: "the strongest magnet known", color: C.cyan, y: 250, appearAt: at("magnetar", "dissolve", 34, p.narrationStart), hold: 4.5 },
      { to: 50000, suffix: " LY", label: "and it still hit our atmosphere", color: C.amber, y: 820, appearAt: at("magnetar", "thousand", 56, p.narrationStart), hold: 5 },
    ]} />
);

// ── No. 6 · Sagittarius A* (the one you liked — unchanged) ────────────────────────
export const SagAScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="sag_a" images={[IMG("galactic_core")]}
    chapter="No. 6 · Sagittarius A*" title={"THE MONSTER\nNEXT DOOR"}
    grade="contrast(1.1) saturate(1.18) brightness(0.92)"
    stats={[
      { to: 4000000, suffix: "× SUN", label: "the black hole at our galaxy's heart", color: C.amber, appearAt: at("sag_a", "million", 30, p.narrationStart), hold: 5 },
      { value: "26,000 LIGHT-YEARS", label: "and we orbit it right now", color: C.cyan, y: 820, appearAt: at("sag_a", "thousand", 44, p.narrationStart), hold: 5 },
    ]} />
);

// ── No. 5 · Quasars (galactic core + relativistic jet) ────────────────────────────
export const QuasarScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="quasar" images={[SIMG("blackhole_jet")]}
    chapter="No. 5 · Quasars" title={"THE\nQUASARS"}
    grade="contrast(1.12) saturate(1.1) brightness(0.95)"
    stats={[{ value: "BRIGHTER THAN A GALAXY", label: "powered by a feeding black hole", color: C.gold, y: 250, appearAt: at("quasar", "trillion", 34, p.narrationStart), hold: 5 }]} />
);

// ── No. 4 · The Great Attractor (reused cluster imagery) ──────────────────────────
export const GreatAttractorScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="great_attractor" images={[IMG("cluster"), IMG("deepfield")]}
    chapter="No. 4 · The Great Attractor" title={"THE GREAT\nATTRACTOR"}
    stats={[
      { to: 2000000, suffix: " KM/H", label: "our galaxy, dragged toward it", color: C.amber, appearAt: at("great_attractor", "million", 30, p.narrationStart), hold: 5 },
      { value: "10,000× THE MILKY WAY", label: "a pull we cannot see or stop", color: C.cyan, y: 820, appearAt: at("great_attractor", "thousand", 50, p.narrationStart), hold: 5 },
    ]} />
);

// ── No. 3 · TON 618 (NASA black-hole lensing visualization) ───────────────────────
export const Ton618Scene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="ton618" images={[SIMG("blackhole2")]}
    chapter="No. 3 · TON 618" title={"TON 618"}
    grade="contrast(1.15) saturate(1.05) brightness(0.9)"
    stats={[
      { to: 66000000000, suffix: "× SUN", label: "one of the largest black holes known", color: C.danger, y: 235, appearAt: at("ton618", "billion", 28, p.narrationStart), hold: 5, size: 104 },
      { value: "LIGHT LEFT 10 BILLION YEARS AGO", label: "an ancient horror, still growing", color: C.ember, y: 830, appearAt: at("ton618", "billion", 70, p.narrationStart), hold: 5 },
    ]} />
);

// ── No. 2 · The Boötes Void (deep field, darkened to emptiness) ───────────────────
export const BootesScene: React.FC<SceneProps> = (p) => (
  <ScariestImageScene {...p} clipId="bootes" images={[SIMG("deep_void")]}
    chapter="No. 2 · The Boötes Void" title={"THE GREAT\nNOTHING"}
    grade="contrast(1.18) saturate(0.85) brightness(0.62)"
    stats={[
      { to: 330000000, suffix: " LY", label: "of almost perfect emptiness", color: C.ice, y: 250, appearAt: at("bootes", "million", 30, p.narrationStart), hold: 5, size: 104 },
      { value: "ALONE IN THE DARK", label: "you'd think you were the universe", color: C.faint, y: 830, appearAt: at("bootes", "alone", 64, p.narrationStart), hold: 5 },
    ]} />
);

// ── No. 1 · The False Vacuum (cosmic vista, consumed by darkness at the climax) ────
export const VacuumScene: React.FC<SceneProps> = (p) => {
  const consumeStart = at("vacuum", "expands", 66, p.narrationStart);
  const consumeFull = p.durationInFrames - 55;
  return (
    <ScariestImageScene {...p} clipId="vacuum" images={[SIMG("nebula_dark")]}
      chapter="No. 1 · The False Vacuum" title={"THE\nFALSE VACUUM"}
      grade="contrast(1.15) saturate(1.05) brightness(0.85)"
      overlay={<ConsumeToBlack startFrame={consumeStart} fullFrame={consumeFull} edge="#B070FF" />}
      stats={[
        { value: "EXPANDING AT LIGHT SPEED", label: "no warning. no escape.", color: C.danger, y: 235, appearAt: at("vacuum", "bubble", 52, p.narrationStart), hold: 6 },
        { to: 299792, suffix: " KM/S", label: "the speed of the end", color: C.ember, y: 835, appearAt: at("vacuum", "speed", 70, p.narrationStart), hold: 5 },
      ]} />
  );
};

// ── Outro ────────────────────────────────────────────────────────────────────────
export const OutroScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame: frame - narrationStart, fps, config: { damping: 200 } });
  const subAppear = narrationStart + Math.round((wordStart("outro", "subscribe", 30) - 0.8) * fps);
  const subS = spring({ frame: frame - subAppear, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [subAppear, subAppear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 26, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      <KenBurns images={[IMG("galaxy_hero")]} durationInFrames={durationInFrames}
        grade="contrast(1.08) saturate(1.05) brightness(0.85)" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -150 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 16, color: C.white, textShadow: `0 0 40px ${C.danger}`, opacity: markS, transform: `translateY(${interpolate(markS, [0, 1], [30, 0])}px)` }}>MINDWIRED</div>
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
