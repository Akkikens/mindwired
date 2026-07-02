import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { ReentryStreak3D, DebrisField3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C } from "../lib/theme";

const SUN: [number, number, number] = [-6, 2, 4];
const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return { pos: [interpolate(e, [0, 1], [1.2, -0.6]), interpolate(e, [0, 1], [0.6, 1.2]), interpolate(e, [0, 1], [7.5, 6]), ], target: [0, 0.2, 0], fov: 42 };
};

export const LegacyScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const fps = 30;
  const starAt = narrationStart + Math.round(wordStart("s5_legacy", "streak", 48) * fps);

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN} bloom={{ intensity: 1.2, threshold: 0.5 }}>
        <Earth3D position={[0.5, -3.4, -3]} radius={4.0} sunDir={SUN} spin={0.0009} />
        <DebrisField3D count={14} spread={18} speed={0.02} />
        <ReentryStreak3D startAt={starAt} from={[3, 3, 1]} to={[-1.5, -2.4, 0]} dur={50} />
      </Stage3D>

      <ChapterTitle chapter="05 · The Lasting Legacy" title={"THE LASTING\nLEGACY"} />
      <StatCallout value="A TIME CAPSULE" label="21st-century engineering, frozen" x={960} y={250} color={C.ice}
        appearAt={narrationStart + Math.round((wordStart("s5_legacy", "capsule", 5.4) - 0.5) * fps)} hold={5} />
      <Captions clipId="s5_legacy" startFrame={narrationStart} select="key" />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
