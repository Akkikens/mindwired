import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain } from "../components/FilmLook";
import { C, DISPLAY, SANS } from "../lib/theme";

/** 1280×720 thumbnail — cosmic hero art (matter spiralling into a bright core)
 *  with the curiosity-gap text overlaid. */
export const AttractorThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#05030f" }}>
    <Img src={staticFile("attractor/img/attractor_bg.jpg")} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
      filter: "contrast(1.08) saturate(1.12)",
    }} />

    {/* legibility gradient on the left for the headline */}
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,3,15,0.92) 24%, rgba(5,3,15,0.45) 46%, transparent 66%)" }} />

    <div style={{ position: "absolute", left: 60, top: 120, maxWidth: 600 }}>
      <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 800, letterSpacing: 6, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}`, marginBottom: 12 }}>
        An invisible giant
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 132, fontWeight: 800, lineHeight: 0.88, color: C.white, textTransform: "uppercase", textShadow: "0 6px 34px rgba(0,0,0,0.95)", WebkitTextStroke: "2px rgba(0,0,0,0.5)" }}>
        PULLING<br />OUR GALAXY
      </div>
      <div style={{ marginTop: 20, fontFamily: SANS, fontSize: 30, fontWeight: 600, color: C.gold, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
        Something we cannot even see
      </div>
    </div>

    {/* velocity chip (top-right, on darker sky) */}
    <div style={{ position: "absolute", right: 54, top: 60, background: C.amber, color: "#1a1206", padding: "10px 22px", borderRadius: 30, fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, letterSpacing: 1, boxShadow: `0 0 34px ${C.amber}` }}>
      2,000,000 KM/H
    </div>
    <div style={{ position: "absolute", right: 40, bottom: 28, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.white, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      MINDWIRED
    </div>
    <Grain opacity={0.03} />
  </AbsoluteFill>
);
