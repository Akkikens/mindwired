import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ImageScene } from "./ImageScene";
import { wordStart } from "../lib/manifest";
import { C, DISPLAY, SANS } from "../../lib/theme";

type SceneProps = { narrationStart: number; durationInFrames: number };
const FPS = 30;
const at = (clip: string, word: string, fb: number, start: number) => start + Math.round(wordStart(clip, word, fb) * FPS);
const IMG = (n: string) => `gtavi/img/${n}`;

// ── 00 · Hook (key art + cold-open wordmark) ──────────────────────────────────
export const HookScene: React.FC<SceneProps> = (p) => {
  const frame = useCurrentFrame();
  const markOp = interpolate(frame, [0, 14, p.narrationStart - 14, p.narrationStart], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <ImageScene {...p} clipId="hook" images={[IMG("grand-theft-auto-six-4k-qd-1366x768.jpg"), IMG("ref_vicecity.jpg")]}
      weather={{ storm: 0.25, lightning: true }}
      stats={[{ value: "A STORM THAT BUILDS ITSELF", label: "not an effect — a simulation", color: C.cyan, appearAt: at("hook", "simulation", 26, p.narrationStart), hold: 4 }]}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: markOp }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, letterSpacing: 14, color: C.cyan, textShadow: `0 0 20px ${C.cyan}`, fontWeight: 700 }}>M I N D W I R E D</div>
        <div style={{ marginTop: 18, fontFamily: DISPLAY, fontSize: 22, letterSpacing: 5, color: C.dim, textTransform: "uppercase" }}>inside the simulation</div>
      </AbsoluteFill>
    </ImageScene>
  );
};

// ── 01 · Leonida ──────────────────────────────────────────────────────────────
export const LeonidaScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="leonida" images={[IMG("iPi3bFFgSfLnoNe8NS764n.jpg")]}
    weather={{ storm: 0.12 }} chapter="01 · Leonida" title={"HURRICANE\nCOUNTRY"}
    stats={[{ value: "LEONIDA = MODERN FLORIDA", label: "the stormiest sky in America", color: C.amber, appearAt: at("leonida", "Florida", 10, p.narrationStart), hold: 5 }]} />
);

// ── 02 · A Living Atmosphere ──────────────────────────────────────────────────
export const FromStaticScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="from_static" images={[IMG("ref_vicecity.jpg")]}
    weather={{ storm: 0.12 }} chapter="02 · A Living Atmosphere" title={"A LIVING\nATMOSPHERE"}
    stats={[{ value: "STATIC  →  SIMULATED", label: "weather that actually unfolds", color: C.cyan, appearAt: at("from_static", "volumetric", 40, p.narrationStart), hold: 5 }]} />
);

// ── 03 · When The Storm Hits ──────────────────────────────────────────────────
export const StormScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="the_storm" images={[IMG("ref_vicecity.jpg")]}
    weather={{ storm: 0.7, rain: true, lightning: true }} chapter="03 · When The Storm Hits" title={"WHEN THE\nSTORM HITS"}
    stats={[{ value: "RAIN THAT LANDS", label: "wet, reflective, alive", color: C.ice, appearAt: at("the_storm", "lightning", 40, p.narrationStart), hold: 5 }]} />
);

// ── 04 · The Streets Flood ────────────────────────────────────────────────────
export const FloodScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="the_flood" images={[IMG("ref_vicecity.jpg")]}
    weather={{ storm: 0.82, rain: true, flood: 0.6 }} chapter="04 · The Streets Flood" title={"THE STREETS\nFLOOD"}
    stats={[{ value: "REAL-TIME WATER SIM", label: "it knows where water gathers", color: C.cyan, appearAt: at("the_flood", "flood", 24, p.narrationStart), hold: 5 }]} />
);

// ── 05 · The Hurricane ────────────────────────────────────────────────────────
export const HurricaneScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="the_hurricane" images={[IMG("ref_vicecity.jpg")]}
    weather={{ storm: 1.0, rain: true, lightning: true, flood: 0.4 }} chapter="05 · The Hurricane" title={"THE\nHURRICANE"}
    stats={[{ value: "A SYSTEMIC DISASTER", label: "not a cutscene — an event you survive", color: C.ember, appearAt: at("the_hurricane", "hurricane", 14, p.narrationStart), hold: 5 }]} />
);

// ── 06 · A Living World ───────────────────────────────────────────────────────
export const LivingWorldScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="living_world" images={[IMG("22319.jpg"), IMG("iPi3bFFgSfLnoNe8NS764n.jpg")]}
    weather={{ storm: 0.4, rain: true }} chapter="06 · A Living World" title={"A LIVING\nWORLD"}
    stats={[{ value: "WEATHER × EVERY SYSTEM", label: "the whole city reacts", color: C.cyan, appearAt: at("living_world", "react", 26, p.narrationStart), hold: 5 }]} />
);

// ── 07 · The Brutal Cost ──────────────────────────────────────────────────────
export const CostScene: React.FC<SceneProps> = (p) => (
  <ImageScene {...p} clipId="the_cost" images={[IMG("ref_empire.jpg"), IMG("ref_jason.jpg")]}
    weather={{ storm: 0.3 }} chapter="07 · The Brutal Cost" title={"THE BRUTAL\nCOST"}
    stats={[{ value: "CURRENT-GEN ONLY", label: "a decade and a fortune to build", color: C.amber, appearAt: at("the_cost", "decade", 36, p.narrationStart), hold: 5 }]} />
);

// ── 08 · Outro (calm sunset + wordmark + subscribe) ───────────────────────────
export const OutroScene: React.FC<SceneProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame: frame - p.narrationStart, fps, config: { damping: 200 } });
  const subAppear = p.narrationStart + Math.round((wordStart("outro", "subscribe", 22) - 0.8) * fps);
  const subS = spring({ frame: frame - subAppear, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [subAppear, subAppear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [p.durationInFrames - 26, p.durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: endFade }}>
      <ImageScene {...p} clipId="outro" images={[IMG("ref_vicecity.jpg")]} weather={{ storm: 0.12 }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -150 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 16, color: C.white, textShadow: `0 0 40px ${C.cyan}`, opacity: markS, transform: `translateY(${interpolate(markS, [0, 1], [30, 0])}px)` }}>MINDWIRED</div>
          <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: C.dim, textTransform: "uppercase", opacity: markS }}>the strange machinery of our universe</div>
          <div style={{ marginTop: 54, opacity: subOp, transform: `scale(${interpolate(subS, [0, 1], [0.8, 1])})`, display: "flex", alignItems: "center", gap: 18, background: C.danger, padding: "20px 46px", borderRadius: 60, boxShadow: `0 0 40px ${C.danger}66` }}>
            <div style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: `26px solid ${C.white}`, marginLeft: 6 }} />
            <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: C.white }}>SUBSCRIBE</span>
          </div>
        </AbsoluteFill>
      </ImageScene>
    </AbsoluteFill>
  );
};
