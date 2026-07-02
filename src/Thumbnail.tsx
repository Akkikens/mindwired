import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage3D, CamPath } from "./three/Stage3D";
import { Earth3D } from "./three/Earth3D";
import { Glove3D } from "./three/Glove3D";
import { DebrisField3D } from "./three/objects3d";
import { Grain } from "./components/FilmLook";
import { C, DISPLAY, SANS } from "./lib/theme";

const SUN: [number, number, number] = [5, 2.5, 4];
const cam: CamPath = () => ({ pos: [0, 0.2, 6.8], target: [1.4, -0.2, 0], fov: 44 });

/** 1280×720 thumbnail — 3D hero (matches the video) + bold curiosity text. */
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <Stage3D durationInFrames={1} camera={cam} sun={SUN} stars={1400}
        bloom={{ intensity: 1.35, threshold: 0.42, radius: 0.8 }}>
        <Earth3D position={[2.0, -2.6, -2.5]} radius={3.7} sunDir={SUN} spin={0} />
        <group rotation={[0.25, -0.5, 0.18]}>
          <Glove3D position={[2.3, 1.15, 1.2]} scale={0.85} spin={0} bleach={0.65} />
        </group>
        <DebrisField3D count={14} spread={14} speed={0} />
      </Stage3D>

      {/* headline (left) */}
      <div style={{ position: "absolute", left: 64, top: 64, maxWidth: 660 }}>
        <div style={{
          fontFamily: SANS, fontSize: 30, fontWeight: 800, letterSpacing: 6,
          color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}`, marginBottom: 12,
        }}>
          Abandoned in space
        </div>
        <div style={{
          fontFamily: DISPLAY, fontSize: 150, fontWeight: 800, lineHeight: 0.9,
          color: C.white, textTransform: "uppercase",
          textShadow: "0 6px 34px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.8)",
          WebkitTextStroke: "2px rgba(0,0,0,0.55)",
        }}>
          STILL IN<br />ORBIT
        </div>
        <div style={{
          marginTop: 22, fontFamily: SANS, fontSize: 30, fontWeight: 600,
          color: C.gold, textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}>
          A lost glove · faster than a bullet
        </div>
      </div>

      {/* velocity chip near the glove */}
      <div style={{
        position: "absolute", right: 70, top: 300,
        background: C.amber, color: "#1a1206", padding: "10px 22px", borderRadius: 30,
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, letterSpacing: 1,
        boxShadow: `0 0 34px ${C.amber}`,
      }}>
        17,500 MPH
      </div>

      <div style={{
        position: "absolute", right: 40, bottom: 30,
        fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.dim,
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
      }}>
        MINDWIRED
      </div>

      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};
