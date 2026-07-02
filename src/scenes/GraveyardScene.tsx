import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { OrbitSystem3D, RadarSweep3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C } from "../lib/theme";

const SUN: [number, number, number] = [6, 3, 4];
const cam: CamPath = (t) => {
  const e = easeInOut(t);
  const ang = interpolate(e, [0, 1], [-0.4, 0.5]);
  const dist = interpolate(e, [0, 1], [12, 9.5]);
  return { pos: [Math.sin(ang) * dist, interpolate(e, [0, 1], [3.5, 1.2]), Math.cos(ang) * dist], target: [0, 0, 0], fov: 40 };
};

export const GraveyardScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const scanAt = narrationStart + Math.round(wordStart("s4_graveyard", "watching", 39) * fps);
  const ringsOp = interpolate(frame, [scanAt - 10, scanAt + 50], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanOp = interpolate(frame, [scanAt - 20, scanAt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN} bloom={{ intensity: 1.15, threshold: 0.4 }}>
        <Earth3D position={[0, 0, 0]} radius={2.0} sunDir={SUN} spin={0.0014} />
        <group visible={ringsOp > 0.05}><OrbitSystem3D graveyardIndex={2} /></group>
        {scanOp > 0.02 && <RadarSweep3D radius={5.6} />}
      </Stage3D>

      <ChapterTitle chapter="04 · The Graveyard Geometry" title={"THE GRAVEYARD\nGEOMETRY"} />
      <StatCallout value="GRAVEYARD ORBIT" label="Aloft for centuries" x={960} y={250} color={C.amber}
        appearAt={narrationStart + Math.round((wordStart("s4_graveyard", "graveyard", 30.8) - 0.5) * fps)} hold={5} />
      <StatCallout value="40,000+ TRACKED" label="Space Fence · some as small as a marble" x={960} y={250} color={C.cyan}
        appearAt={narrationStart + Math.round((wordStart("s4_graveyard", "cataloguing", 45.4) - 0.5) * fps)} hold={7} />
      <Captions clipId="s4_graveyard" startFrame={narrationStart} select="key" />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
