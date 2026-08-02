import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain, Vignette } from "../components/FilmLook";
import { C, DISPLAY, SANS } from "../lib/theme";

/** 1280×720 thumbnail — real declassified US Navy GIMBAL sensor frame
 *  (the actual DoD-released UAP video) with Fravor's real on-record quote. */
export const NasaUfoFilesThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#000000" }}>
    <Img
      src={staticFile("shorts/nasaufofiles/images/thumb_gimbal_frame.png")}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: "scale(1.06)", filter: "contrast(1.15) brightness(1.05)",
      }}
    />

    {/* legibility gradient on the left for the headline, over the black HUD padding */}
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.35) 52%, transparent 68%)" }} />

    <div style={{ position: "absolute", left: 56, top: 96, maxWidth: 660 }}>
      <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 800, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 16px ${C.cyan}`, marginBottom: 16 }}>
        Real Declassified Navy Video
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 106, fontWeight: 800, lineHeight: 0.92, color: C.white, textTransform: "uppercase", textShadow: "0 6px 34px rgba(0,0,0,0.95)", WebkitTextStroke: "2px rgba(0,0,0,0.55)" }}>
        "NOT<br />FROM<br /><span style={{ color: C.amber }}>THIS WORLD</span>"
      </div>
    </div>

    {/* chip */}
    <div style={{ position: "absolute", right: 54, top: 56, background: C.danger, color: "#1a0606", padding: "10px 22px", borderRadius: 30, fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, letterSpacing: 1, boxShadow: `0 0 34px ${C.danger}` }}>
      NASA'S REAL FILES
    </div>
    <div style={{ position: "absolute", right: 40, bottom: 26, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.white, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      MINDWIRED
    </div>
    <Vignette strength={0.8} />
    <Grain opacity={0.03} />
  </AbsoluteFill>
);
