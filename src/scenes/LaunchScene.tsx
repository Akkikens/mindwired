import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { Station3D, DebrisField3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C } from "../lib/theme";

const SUN: [number, number, number] = [-5, 3, 5];

const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return {
    pos: [interpolate(e, [0, 1], [-2.2, 1.6]), interpolate(e, [0, 1], [1.2, 0.1]), interpolate(e, [0, 1], [9, 7])],
    target: [0.4, 0.0, 0.6],
    fov: 44,
  };
};

export const LaunchScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN}
        bloom={{ intensity: 1.05, threshold: 0.55 }}>
        <Earth3D position={[0, -3.6, -3]} radius={4.0} sunDir={SUN} spin={0.001} />
        <Station3D position={[0.3, 1.4, 0.5]} scale={0.62} />
        {/* tool bag — the $100k object the callout is about */}
        <group position={[1.9, 0.2, 2.4]} rotation={[0.3, 0.6, 0.2]} scale={1.5}>
          <mesh><boxGeometry args={[0.5, 0.42, 0.34]} /><meshStandardMaterial color="#e4e9f0" roughness={0.6} metalness={0.1} /></mesh>
          <mesh position={[0, 0.24, 0]}><boxGeometry args={[0.52, 0.08, 0.36]} /><meshStandardMaterial color="#cfd8e4" /></mesh>
          {/* strap + buckle */}
          <mesh position={[0, 0, 0.18]}><boxGeometry args={[0.14, 0.44, 0.02]} /><meshStandardMaterial color="#9aa6b6" /></mesh>
        </group>
        <DebrisField3D count={18} spread={14} speed={0.03} />
      </Stage3D>

      <ChapterTitle chapter="01 · The Accidental Launch" title={"THE ACCIDENTAL\nLAUNCH"} />
      <StatCallout value="$100,000" label="Lost tool bag · STS-126 · 2008"
        x={1480} y={300} color={C.amber}
        appearAt={narrationStart + Math.round((wordStart("s1_launch", "hundred", 28) - 0.6) * 30)} hold={4.5} />
      <Captions clipId="s1_launch" startFrame={narrationStart} select="key" />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
