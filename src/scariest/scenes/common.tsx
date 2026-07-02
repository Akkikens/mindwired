import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage3D, CamPath, Vec3 } from "../../three/Stage3D";
import { KenBurns } from "../../attractor/scenes/ImageScene";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { StatCallout } from "../../components/StatCallout";
import { Vignette, Grain } from "../../components/FilmLook";
import { CountUp, PopIn } from "../../components/kinetic";
import { C, SANS } from "../../lib/theme";
import { captionLines } from "../lib/manifest";

/** A numeric data punch — count-up value + staggered label, the "best video yet"
 *  data beat (kinetic-energy treatment applied to a real scene). */
export const StatPunch: React.FC<{
  to: number; suffix?: string; label: string;
  x?: number; y?: number; color?: string; appearAt: number; hold?: number;
  align?: "left" | "center" | "right"; size?: number;
}> = ({ to, suffix = "", label, x = 960, y = 250, color = C.amber, appearAt, hold, align = "center", size = 132 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearAt) return null;
  let op = 1;
  if (hold) {
    const out = appearAt + hold * fps;
    op = interpolate(frame, [out, out + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  if (op <= 0) return null;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%)`, opacity: op, textAlign: align, pointerEvents: "none" }}>
      <Sequence from={appearAt} layout="none">
        <div><CountUp to={to} suffix={suffix} size={size} color={color} /></div>
        <PopIn delay={9} from="up">
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, letterSpacing: 5, color, textTransform: "uppercase", marginTop: 12, textShadow: `0 0 14px ${color}88` }}>{label}</div>
        </PopIn>
      </Sequence>
    </div>
  );
};

export interface StatSpec {
  value?: string; to?: number; suffix?: string; label?: string;
  x?: number; y?: number; color?: string; appearAt: number; hold?: number;
  align?: "left" | "center" | "right"; size?: number;
}

const renderStat = (s: StatSpec, i: number) =>
  s.to !== undefined ? (
    <StatPunch key={i} to={s.to} suffix={s.suffix} label={s.label ?? ""}
      x={s.x} y={s.y} color={s.color} appearAt={s.appearAt} hold={s.hold} align={s.align} size={s.size} />
  ) : (
    <StatCallout key={i} value={s.value ?? ""} label={s.label}
      x={s.x ?? 960} y={s.y ?? 250} color={s.color} appearAt={s.appearAt} hold={s.hold} align={s.align} />
  );

/** A wall of darkness that grows from the center to swallow the frame — used for
 *  the false-vacuum climax (reality "rewritten out of existence"). */
export const ConsumeToBlack: React.FC<{ startFrame: number; fullFrame: number; edge?: string }> = ({ startFrame, fullFrame, edge = "#B070FF" }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, Math.max(0, (frame - startFrame) / Math.max(1, fullFrame - startFrame)));
  if (p <= 0) return null;
  const r = p * p * 150; // % of frame covered, accelerating
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, #000 ${r}%, ${edge}cc ${r + 2}%, transparent ${r + 9}%)`,
      pointerEvents: "none",
    }} />
  );
};

/** Photoreal scene: Ken Burns telescope imagery + overlays, key-only captions. */
export const ScariestImageScene: React.FC<{
  clipId: string; narrationStart: number; durationInFrames: number;
  images: string[]; chapter?: string; title?: string; stats?: StatSpec[]; grade?: string;
  overlay?: React.ReactNode;
}> = ({ clipId, narrationStart, durationInFrames, images, chapter, title, stats = [], grade, overlay }) => (
  <AbsoluteFill style={{ background: "#02040a" }}>
    <KenBurns images={images} durationInFrames={durationInFrames} grade={grade} />
    {overlay}
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {stats.map(renderStat)}
    <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
    <Vignette strength={0.95} />
    <Grain opacity={0.045} />
  </AbsoluteFill>
);

/** 3D scene: a procedural-horror stage + overlays, key-only captions. */
export const ScariestCosmicScene: React.FC<{
  clipId: string; narrationStart: number; durationInFrames: number;
  camera: CamPath; sun?: Vec3; sunColor?: string; sunIntensity?: number; ambient?: number;
  bloom?: { intensity?: number; threshold?: number; radius?: number }; stars?: number;
  chapter?: string; title?: string; stats?: StatSpec[]; children: React.ReactNode;
}> = ({ clipId, narrationStart, durationInFrames, camera, sun, sunColor, sunIntensity, ambient, bloom, stars = 2600, chapter, title, stats = [], children }) => (
  <AbsoluteFill style={{ background: "#02040a" }}>
    <Stage3D durationInFrames={durationInFrames} camera={camera} sun={sun}
      sunColor={sunColor} sunIntensity={sunIntensity} ambient={ambient} bloom={bloom} stars={stars}>
      {children}
    </Stage3D>
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {stats.map(renderStat)}
    <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
    <Vignette strength={0.9} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
