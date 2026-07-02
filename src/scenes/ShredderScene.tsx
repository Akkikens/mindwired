import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { Glove3D } from "../three/Glove3D";
import { AtomicStream3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C } from "../lib/theme";

const SUN: [number, number, number] = [-6, 1, 3];

const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return {
    pos: [interpolate(e, [0, 1], [-0.6, 2.0]), interpolate(e, [0, 1], [1.0, -0.5]), interpolate(e, [0, 1], [8.2, 6.4])],
    target: [0, 0, 0],
    fov: 40,
  };
};

export const ShredderScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const bleach = interpolate(frame, [0, durationInFrames * 0.85], [0.1, 1], { extrapolateRight: "clamp" });
  const heat = 0.5 + 0.5 * Math.sin(frame * 0.05);
  const sunColor = heat > 0.5 ? "#ffd9a0" : "#bcd8ff";
  const tint = heat > 0.5 ? C.amber : C.cyan;
  const tintOp = 0.08 + Math.abs(heat - 0.5) * 0.16;

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN}
        sunColor={sunColor} sunIntensity={2.6} bloom={{ intensity: 1.2, threshold: 0.5 }}>
        <Earth3D position={[4.5, -3, -6]} radius={3} sunDir={SUN} spin={0.0016} />
        <Glove3D position={[0, 0, 0]} scale={1.15} spin={0.01} bleach={bleach} />
        <AtomicStream3D target={[0, 0, 0]} from={-8} color={C.teal} />
      </Stage3D>

      {/* thermal cycle tint */}
      <AbsoluteFill style={{
        background: `radial-gradient(70% 70% at 45% 45%, ${tint}, transparent 70%)`,
        opacity: tintOp, mixBlendMode: "soft-light", pointerEvents: "none",
      }} />

      <ChapterTitle chapter="02 · The Invisible Shredder" title={"THE INVISIBLE\nSHREDDER"} />
      <StatCallout value={heat > 0.5 ? "+250°F" : "−250°F"}
        label={heat > 0.5 ? "In direct sunlight" : "In Earth's shadow"}
        x={1480} y={780} color={heat > 0.5 ? C.amber : C.cyan}
        appearAt={narrationStart + Math.round((wordStart("s2_shredder", "degrees", 57) - 1.5) * 30)} />
      <StatCallout value="EVERY 90 MIN" label="One full temperature swing"
        x={1480} y={300} color={C.ice}
        appearAt={narrationStart + Math.round(wordStart("s2_shredder", "ninety", 50) * 30)} hold={6} />
      <Captions clipId="s2_shredder" startFrame={narrationStart} select="key" />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
