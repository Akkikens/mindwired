import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain, Vignette } from "../components/FilmLook";
import { C, DISPLAY, SANS } from "../lib/theme";

/** 1280×720 thumbnail — NASA's gravitational-lensing black-hole visualization
 *  (a real void warping a dense star field) with the curiosity-gap text. */
export const ScariestThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#02030a" }}>
    <Img src={staticFile("scariest/img/blackhole2.jpg")} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
      transform: "scale(1.15) translateX(14%)", filter: "contrast(1.1) saturate(1.05) brightness(0.95)",
    }} />

    {/* legibility gradient on the left for the headline */}
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(2,3,10,0.95) 24%, rgba(2,3,10,0.5) 46%, transparent 66%)" }} />

    <div style={{ position: "absolute", left: 60, top: 110, maxWidth: 640 }}>
      <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 800, letterSpacing: 6, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}`, marginBottom: 14 }}>
        Where light dies
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 140, fontWeight: 800, lineHeight: 0.86, color: C.white, textTransform: "uppercase", textShadow: "0 6px 34px rgba(0,0,0,0.95)", WebkitTextStroke: "2px rgba(0,0,0,0.55)" }}>
        SCARIEST<br />PLACE<br />IN SPACE
      </div>
    </div>

    {/* warning chip */}
    <div style={{ position: "absolute", right: 54, top: 56, background: C.danger, color: "#1a0606", padding: "10px 22px", borderRadius: 30, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, letterSpacing: 2, boxShadow: `0 0 34px ${C.danger}` }}>
      RANKED 8 → 1
    </div>
    <div style={{ position: "absolute", right: 40, bottom: 26, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.white, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      MINDWIRED
    </div>
    <Vignette strength={0.85} />
    <Grain opacity={0.03} />
  </AbsoluteFill>
);
