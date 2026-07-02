import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Stage3D, CamPath } from "../../three/Stage3D";
import { SynthwaveCity } from "../three/synthwave";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { StatCallout } from "../../components/StatCallout";
import { Vignette } from "../../components/FilmLook";
import { captionLines } from "../lib/manifest";
import { C } from "../../lib/theme";

export interface StatSpec {
  value: string; label?: string; x?: number; y?: number; color?: string;
  appearAt: number; hold?: number; align?: "left" | "center" | "right";
}

/** Small framed "referenced commentary" card for official GTA art (logo cropped). */
export const ReferenceCard: React.FC<{ src: string; appearAt: number; hold: number; side?: "right" | "left" }> = ({
  src, appearAt, hold, side = "right",
}) => {
  const frame = useCurrentFrame();
  const f = frame - appearAt;
  if (f < 0 || f > hold) return null;
  const inOp = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(f, [hold - 14, hold], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);
  const slide = interpolate(inOp, [0, 1], [40, 0]);
  const xStyle = side === "right" ? { right: 70 } : { left: 70 };
  return (
    <div style={{
      position: "absolute", top: 250, ...xStyle, width: 560, opacity: op,
      transform: `translateX(${side === "right" ? slide : -slide}px)`,
      borderRadius: 14, overflow: "hidden",
      border: `2px solid ${C.cyan}`, boxShadow: `0 12px 50px rgba(0,0,0,0.6), 0 0 30px ${C.cyan}44`,
    }}>
      <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(3,8,18,0.82)", padding: "8px 14px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 18, fontWeight: 700,
        letterSpacing: 2, color: C.ice, textTransform: "uppercase",
      }}>
        Reference · GTA VI © Rockstar Games
      </div>
    </div>
  );
};

interface Props {
  clipId: string;
  narrationStart: number;
  durationInFrames: number;
  camera: CamPath;
  synth: { storm?: number; flood?: number; rain?: boolean; lightning?: boolean };
  chapter?: string;
  title?: string;
  stats?: StatSpec[];
  reference?: { src: string; appearAt: number; hold: number; side?: "right" | "left" };
  bloom?: { intensity?: number; threshold?: number; radius?: number };
}

/** One GTA 6 synthwave scene: neon-city 3D stage + overlays + optional ref card. */
export const SynthScene: React.FC<Props> = ({
  clipId, narrationStart, durationInFrames, camera, synth, chapter, title, stats = [], reference, bloom,
}) => (
  <AbsoluteFill style={{ background: "#05030f" }}>
    <Stage3D durationInFrames={durationInFrames} camera={camera} stars={0}
      ambient={0.4} sunIntensity={0.4} bloom={bloom ?? { intensity: 1.25, threshold: 0.5, radius: 0.7 }}>
      <SynthwaveCity {...synth} />
    </Stage3D>
    {reference && <ReferenceCard {...reference} />}
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {stats.map((s, i) => (
      <StatCallout key={i} value={s.value} label={s.label} x={s.x ?? 960} y={s.y ?? 250}
        color={s.color} appearAt={s.appearAt} hold={s.hold} align={s.align} />
    ))}
    <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
    <Vignette strength={0.9} />
  </AbsoluteFill>
);
