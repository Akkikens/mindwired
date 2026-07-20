import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, DISPLAY } from "../lib/theme";

const RED = "#E4322B";

/** 1280×720 thumbnail — real Mbappé photo (isolated) + bold shock-stat text.
 *  House style: one dramatic subject on the right, layered ALL-CAPS text left,
 *  color-coded emphasis (white → amber), red result chip, brand mark. No AI. */
export const FraSpaThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#080a10" }}>
    <Img
      src={staticFile("shorts/fra-spa-final/broll/fifteen-touches.jpg")}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "68% 20%",
        filter: "contrast(1.12) saturate(1.08) brightness(0.9)",
      }}
    />
    {/* left-weighted darkening so the text zone is clean */}
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(6,8,16,0.94) 0%, rgba(6,8,16,0.82) 38%, rgba(6,8,16,0.15) 66%, rgba(6,8,16,0.0) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,8,16,0.7) 0%, transparent 40%)" }} />

    {/* eyebrow */}
    <div style={{ position: "absolute", left: 56, top: 78, fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.amber, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
      Mbappé vs Spain
    </div>

    {/* headline */}
    <div style={{ position: "absolute", left: 50, top: 150, fontFamily: DISPLAY, fontWeight: 800, lineHeight: 0.9, textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.95)", WebkitTextStroke: "3px rgba(0,0,0,0.6)" }}>
      <div style={{ fontSize: 150, color: C.white }}>10 SHOTS</div>
      <div style={{ fontSize: 176, color: C.amber }}>0 ON<br />TARGET</div>
    </div>

    {/* result chip */}
    <div style={{ position: "absolute", left: 56, bottom: 62, background: RED, padding: "14px 26px", borderRadius: 12, transform: "rotate(-2deg)", boxShadow: "0 8px 26px rgba(0,0,0,0.6)" }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 46, fontWeight: 800, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
        Spain 2–0 → Final
      </span>
    </div>

    {/* brand mark */}
    <div style={{ position: "absolute", right: 40, top: 30, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.white, opacity: 0.9, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      KICKOFFDAILY90
    </div>
  </AbsoluteFill>
);
