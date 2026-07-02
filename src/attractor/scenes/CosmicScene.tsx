import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage3D, CamPath, Vec3 } from "../../three/Stage3D";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { StatCallout } from "../../components/StatCallout";
import { captionLines } from "../lib/manifest";

export interface StatSpec {
  value: string; label?: string; x?: number; y?: number; color?: string;
  appearAt: number; hold?: number; align?: "left" | "center" | "right";
}

interface Props {
  clipId: string;
  narrationStart: number;
  durationInFrames: number;
  camera: CamPath;
  sun?: Vec3;
  sunColor?: string;
  sunIntensity?: number;
  ambient?: number;
  bloom?: { intensity?: number; threshold?: number; radius?: number };
  stars?: number;
  chapter?: string;
  title?: string;
  stats?: StatSpec[];
  children: React.ReactNode;
}

/** One Great-Attractor scene: a 3D stage + the standard HTML overlays
 *  (chapter title, stat callouts, word-synced captions, grain). */
export const CosmicScene: React.FC<Props> = ({
  clipId, narrationStart, durationInFrames, camera, sun, sunColor, sunIntensity,
  ambient, bloom, stars = 2600, chapter, title, stats = [], children,
}) => {
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={camera} sun={sun}
        sunColor={sunColor} sunIntensity={sunIntensity} ambient={ambient}
        bloom={bloom} stars={stars}>
        {children}
      </Stage3D>

      {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
      {stats.map((s, i) => (
        <StatCallout key={i} value={s.value} label={s.label}
          x={s.x ?? 960} y={s.y ?? 250} color={s.color}
          appearAt={s.appearAt} hold={s.hold} align={s.align} />
      ))}
      <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />
    </AbsoluteFill>
  );
};
