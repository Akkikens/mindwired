import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { Bolt3D, KesslerCascade3D, DebrisField3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C } from "../lib/theme";

const SUN: [number, number, number] = [6, 2, -4];
const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return { pos: [interpolate(e, [0, 1], [-0.5, 0.6]), 0.3, interpolate(e, [0, 1], [9, 6.6])], target: [0, 0, 0], fov: 46 };
};

export const BallisticScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const flyEnd = Math.round(13 * fps);
  const gx = interpolate(frame, [0, flyEnd], [-12, 12], { extrapolateRight: "clamp" });
  const flying = frame < flyEnd + 10;

  const cascadeAt = narrationStart + Math.round(wordStart("s3_ballistic", "Kessler", 38.8) * fps);
  const danger = interpolate(frame, [cascadeAt - 40, cascadeAt + 30], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dangerOp = interpolate(frame, [cascadeAt - 40, cascadeAt + 30], [0, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN} bloom={{ intensity: 1.3, threshold: 0.45 }}>
        <Earth3D position={[-4.5, -2.5, -6]} radius={3.2} sunDir={SUN} spin={0.0018} />
        <DebrisField3D count={30} spread={18} speed={0.06} />
        {flying && <Bolt3D position={[gx, 0.4, 1.5]} scale={0.7} spin={0.12} />}
        <pointLight position={[0, 0, 2]} color="#ff3a2a" intensity={danger} distance={26} />
        <KesslerCascade3D startAt={cascadeAt} />
      </Stage3D>

      <AbsoluteFill style={{ background: `radial-gradient(85% 85% at 50% 50%, ${C.danger}, transparent 65%)`, opacity: dangerOp, mixBlendMode: "screen", pointerEvents: "none" }} />

      <ChapterTitle chapter="03 · Ballistic Evolution" title={"BALLISTIC\nEVOLUTION"} />
      <StatCallout value="= A BULLET" label="A single fleck of paint" x={960} y={250} color={C.amber}
        appearAt={narrationStart + Math.round((wordStart("s3_ballistic", "bullet", 14.4) - 0.5) * fps)} hold={3} />
      <StatCallout value="= A GRENADE" label="One lost bolt, at orbital speed" x={960} y={250} color={C.ember}
        appearAt={narrationStart + Math.round((wordStart("s3_ballistic", "grenade", 17.7) - 0.5) * fps)} hold={3.4} />
      <StatCallout value="KESSLER SYNDROME" label="A runaway collision cascade" x={960} y={250} color={C.danger}
        appearAt={cascadeAt + Math.round(1.2 * fps)} hold={6} />
      <Captions clipId="s3_ballistic" startFrame={narrationStart} select="key" />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
