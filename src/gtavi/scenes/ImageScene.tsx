import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { StatCallout } from "../../components/StatCallout";
import { Vignette } from "../../components/FilmLook";
import { captionLines } from "../lib/manifest";

export interface StatSpec {
  value: string; label?: string; x?: number; y?: number; color?: string;
  appearAt: number; hold?: number; align?: "left" | "center" | "right";
}

const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 13.3) * 47123.17; return x - Math.floor(x); };

/** 2D weather over a still: storm darkening, rain, lightning, flood sheen. */
export const WeatherOverlay: React.FC<{ storm?: number; rain?: boolean; lightning?: boolean; flood?: number }> = ({
  storm = 0, rain = false, lightning = false, flood = 0,
}) => {
  const frame = useCurrentFrame();
  // lightning: brief bright flashes
  const lf = lightning
    ? (rnd(Math.floor(frame / 11)) > 0.86 && frame % 11 < 2 ? 0.55 : 0)
    : 0;
  return (
    <>
      {/* storm darkening + cool shift */}
      {storm > 0.01 && (
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, rgba(8,12,28,${0.7 * storm}) 0%, rgba(10,14,30,${0.35 * storm}) 45%, rgba(4,6,16,${0.5 * storm}) 100%)`,
          mixBlendMode: "multiply", pointerEvents: "none",
        }} />
      )}
      {storm > 0.3 && (
        <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 0%, rgba(40,50,90,${0.4 * storm}), transparent 60%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      )}
      {/* rain */}
      {rain && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 160 }).map((_, i) => {
            const speed = 26 + rnd(i) * 22;
            const x0 = rnd(i + 1) * 2100 - 100;
            const y = ((frame * speed + rnd(i + 2) * 1080) % 1180) - 100;
            const len = 22 + rnd(i + 3) * 26;
            const drift = 7; // diagonal
            return <line key={i} x1={x0} y1={y} x2={x0 - drift} y2={y - len}
              stroke="#bcd8ff" strokeWidth={1.4} opacity={0.35 + rnd(i) * 0.3} />;
          })}
        </svg>
      )}
      {/* flood sheen rising from bottom */}
      {flood > 0.01 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: `${18 + flood * 26}%`,
          background: `linear-gradient(180deg, transparent, rgba(20,40,80,${0.3 + flood * 0.4}) 40%, rgba(10,20,45,${0.5 + flood * 0.35}))`,
          backdropFilter: "blur(1px)", pointerEvents: "none",
        }} />
      )}
      {/* lightning flash */}
      {lf > 0 && <AbsoluteFill style={{ background: "#cfe0ff", opacity: lf, mixBlendMode: "screen", pointerEvents: "none" }} />}
    </>
  );
};

/** Ken Burns over one or more stills + weather + the standard overlays. */
interface Props {
  clipId: string; narrationStart: number; durationInFrames: number;
  images: string[];
  weather?: { storm?: number; rain?: boolean; lightning?: boolean; flood?: number };
  chapter?: string; title?: string; stats?: StatSpec[];
  children?: React.ReactNode;
}
export const ImageScene: React.FC<Props> = ({
  clipId, narrationStart, durationInFrames, images, weather, chapter, title, stats = [], children,
}) => {
  const frame = useCurrentFrame();
  const seg = durationInFrames / images.length;
  return (
    <AbsoluteFill style={{ background: "#05030f", overflow: "hidden" }}>
      {images.map((src, i) => {
        const localStart = i * seg;
        const lp = (frame - localStart) / seg;
        const dir = i % 2 === 0 ? 1 : -1;
        const scale = interpolate(lp, [0, 1.2], [1.05, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const tx = interpolate(lp, [0, 1.2], [0, 2.2 * dir], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = i === 0 ? 1 : interpolate(frame, [localStart - 16, localStart + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <AbsoluteFill key={i} style={{ opacity: op }}>
            <Img src={staticFile(src)} style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${scale}) translate(${tx}%, -1%)`, filter: "contrast(1.05) saturate(1.08)",
            }} />
          </AbsoluteFill>
        );
      })}
      <WeatherOverlay {...weather} />
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 45%, transparent 45%, rgba(2,4,12,0.45) 100%)", pointerEvents: "none" }} />
      {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
      {stats.map((s, i) => (
        <StatCallout key={i} value={s.value} label={s.label} x={s.x ?? 960} y={s.y ?? 250}
          color={s.color} appearAt={s.appearAt} hold={s.hold} align={s.align} />
      ))}
      {children}
      <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
      <Vignette strength={0.92} />
    </AbsoluteFill>
  );
};
