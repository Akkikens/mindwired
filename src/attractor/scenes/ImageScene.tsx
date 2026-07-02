import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { StatCallout } from "../../components/StatCallout";
import { Vignette, Grain } from "../../components/FilmLook";
import { captionLines } from "../lib/manifest";
import { StatSpec } from "./CosmicScene";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Smooth accel/decel — the difference between "moving" and "cheap-smooth". */
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Slow Ken Burns over one or more real telescope stills. Each still eases (not
 *  linear), alternates push-in / pull-out, and carries a slow organic "breathing"
 *  drift so even a held frame is alive. Cuts are momentum cross-dissolves. */
export const KenBurns: React.FC<{ images: string[]; durationInFrames: number; grade?: string }> = ({
  images, durationInFrames, grade = "contrast(1.07) saturate(1.13) brightness(0.95)",
}) => {
  const frame = useCurrentFrame();
  const seg = durationInFrames / images.length;
  const XFADE = 24; // half-width of the cross-dissolve, in frames
  return (
    <AbsoluteFill style={{ background: "#02040a", overflow: "hidden" }}>
      {images.map((src, i) => {
        const localStart = i * seg;
        const e = easeInOutCubic((frame - localStart) / seg);   // eased 0..1 across this still
        const dir = i % 2 === 0 ? 1 : -1;
        // alternate the zoom direction so consecutive stills don't all push in
        const zoomIn = i % 2 === 0;
        const scale = (zoomIn ? 1.08 : 1.24) + (zoomIn ? 0.16 : -0.16) * e;
        // slow sine/cosine float — keeps the image breathing independent of the pan
        const floatX = Math.sin((frame + i * 50) * 0.012) * 0.5;
        const floatY = Math.cos((frame + i * 80) * 0.010) * 0.4;
        const tx = e * 2.6 * dir + floatX;
        const ty = e * -1.7 + floatY;
        // eased dissolve; incoming still gets a hair of extra scale that resolves (momentum)
        const reveal = i === 0 ? 1 : easeInOutCubic((frame - (localStart - XFADE)) / (XFADE * 2));
        const momentum = i === 0 ? 0 : (1 - reveal) * 0.045;
        return (
          <AbsoluteFill key={i} style={{ opacity: reveal }}>
            <Img src={staticFile(src)} style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${scale + momentum}) translate(${tx}%, ${ty}%)`,
              filter: grade,
            }} />
          </AbsoluteFill>
        );
      })}
      {/* cinematic grade wash + edge darkening */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 42%, rgba(10,30,60,0) 40%, rgba(2,6,16,0.5) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

interface Props {
  clipId: string;
  narrationStart: number;
  durationInFrames: number;
  images: string[];
  chapter?: string;
  title?: string;
  stats?: StatSpec[];
}

/** A photoreal scene: Ken Burns telescope imagery + the standard overlays. */
export const ImageScene: React.FC<Props> = ({
  clipId, narrationStart, durationInFrames, images, chapter, title, stats = [],
}) => (
  <AbsoluteFill style={{ background: "#02040a" }}>
    <KenBurns images={images} durationInFrames={durationInFrames} />
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {stats.map((s, i) => (
      <StatCallout key={i} value={s.value} label={s.label}
        x={s.x ?? 960} y={s.y ?? 250} color={s.color}
        appearAt={s.appearAt} hold={s.hold} align={s.align} />
    ))}
    <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
    <Vignette strength={0.95} />
    <Grain opacity={0.045} />
  </AbsoluteFill>
);
