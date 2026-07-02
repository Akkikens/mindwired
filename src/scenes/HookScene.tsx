import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { Glove3D } from "../three/Glove3D";
import { DebrisField3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { StatCallout } from "../components/StatCallout";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C, DISPLAY } from "../lib/theme";

const SUN: [number, number, number] = [7, 3, 5];

const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return {
    pos: [interpolate(e, [0, 1], [0.6, -1.0]), interpolate(e, [0, 1], [1.4, 0.4]), interpolate(e, [0, 1], [10, 6.4])],
    target: [-0.6, 0.4, 1.2],
    fov: 42,
  };
};

export const HookScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const markOp = interpolate(frame, [0, 12, narrationStart - 16, narrationStart], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN}
        bloom={{ intensity: 1.25, threshold: 0.45, radius: 0.75 }}>
        <Earth3D position={[3.0, -1.8, -2.5]} radius={3.4} sunDir={SUN} spin={0.0012} />
        <Glove3D position={[-1.1, 0.6, 1.4]} scale={0.62} spin={0.012} bleach={0.45} />
        <DebrisField3D count={26} spread={16} speed={0.04} />
      </Stage3D>

      {/* cold-open channel wordmark */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: markOp }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, letterSpacing: 14, color: C.cyan, textShadow: `0 0 20px ${C.cyan}`, fontWeight: 700 }}>
          M I N D W I R E D
        </div>
        <div style={{ marginTop: 18, fontFamily: DISPLAY, fontSize: 22, letterSpacing: 5, color: C.dim, textTransform: "uppercase" }}>
          a signal from orbit
        </div>
      </AbsoluteFill>

      <StatCallout value="17,500 MPH" label="Faster than a rifle bullet"
        x={960} y={250} color={C.amber}
        appearAt={narrationStart + Math.round(wordStart("hook", "Seventeen", 6.7) * 30)} hold={4} />

      <Captions clipId="hook" startFrame={narrationStart} select="key" />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
