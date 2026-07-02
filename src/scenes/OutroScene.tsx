import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage3D, easeInOut, CamPath } from "../three/Stage3D";
import { Earth3D } from "../three/Earth3D";
import { DebrisField3D } from "../three/objects3d";
import { Captions } from "../components/Captions";
import { Grain } from "../components/FilmLook";
import { wordStart } from "../lib/manifest";
import { C, DISPLAY, SANS } from "../lib/theme";

const SUN: [number, number, number] = [5, 2, 5];
const cam: CamPath = (t) => {
  const e = easeInOut(t);
  return { pos: [0, interpolate(e, [0, 1], [0.6, 1.4]), interpolate(e, [0, 1], [9, 7.5])], target: [0, -0.4, 0], fov: 42 };
};

export const OutroScene: React.FC<{ narrationStart: number; durationInFrames: number }> = ({
  narrationStart, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markS = spring({ frame: frame - narrationStart, fps, config: { damping: 200 } });
  const subAppear = narrationStart + Math.round((wordStart("outro", "subscribe", 14.6) - 0.8) * fps);
  const subS = spring({ frame: frame - subAppear, fps, config: { damping: 12 } });
  const subOp = interpolate(frame, [subAppear, subAppear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endFade = interpolate(frame, [durationInFrames - 26, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#02040a", opacity: endFade }}>
      <Stage3D durationInFrames={durationInFrames} camera={cam} sun={SUN} bloom={{ intensity: 1.2, threshold: 0.5 }}>
        <Earth3D position={[0, -3.8, -3]} radius={4.2} sunDir={SUN} spin={0.0009} />
        <DebrisField3D count={16} spread={16} speed={0.03} />
      </Stage3D>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", marginTop: -140 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 16, color: C.white, textShadow: `0 0 40px ${C.cyan}`, opacity: markS, transform: `translateY(${interpolate(markS, [0, 1], [30, 0])}px)` }}>
          MINDWIRED
        </div>
        <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: C.dim, textTransform: "uppercase", opacity: markS }}>
          the strange machinery of our universe
        </div>
        <div style={{ marginTop: 54, opacity: subOp, transform: `scale(${interpolate(subS, [0, 1], [0.8, 1])})`, display: "flex", alignItems: "center", gap: 18, background: C.danger, padding: "20px 46px", borderRadius: 60, boxShadow: `0 0 40px ${C.danger}66` }}>
          <div style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: `26px solid ${C.white}`, marginLeft: 6 }} />
          <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: C.white }}>SUBSCRIBE</span>
        </div>
      </AbsoluteFill>

      <Captions clipId="outro" startFrame={narrationStart} select="key" />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
