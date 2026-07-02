import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, DISPLAY, SANS } from "../lib/theme";

/** 1280×720 thumbnail — real Vice-City sunset skyline turned stormy + bold text. */
export const GTAVIThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#05030f" }}>
    <Img src={staticFile("gtavi/img/ref_vicecity.jpg")} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
      filter: "contrast(1.1) saturate(1.05) brightness(0.92)",
    }} />
    {/* storm darkening so it reads as "extreme weather" */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,12,30,0.72) 0%, rgba(10,14,32,0.22) 42%, rgba(4,6,16,0.78) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(110% 70% at 50% 8%, rgba(50,60,110,0.45), transparent 55%)", mixBlendMode: "screen" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 64, textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 800, letterSpacing: 8, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 18px ${C.cyan}` }}>
        A simulated hurricane
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center" }}>
      <div style={{
        fontFamily: DISPLAY, fontSize: 130, fontWeight: 800, lineHeight: 0.88,
        color: C.white, textTransform: "uppercase",
        textShadow: "0 6px 34px rgba(0,0,0,0.95)", WebkitTextStroke: "2px rgba(0,0,0,0.55)",
      }}>
        GTA 6'S<br /><span style={{ color: C.amber }}>INSANE WEATHER</span>
      </div>
    </div>
    <div style={{ position: "absolute", right: 40, top: 28, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.white, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      MINDWIRED
    </div>
  </AbsoluteFill>
);
