import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, DISPLAY } from "../lib/theme";

const SKY = "#6CACE4"; // Argentina sky blue

/** 1280×720 thumbnail — real Messi+Lautaro embrace + comeback text. No AI. */
export const ArgEngThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#080a10" }}>
    <Img
      src={staticFile("shorts/arg-eng-final/broll/lautaro-winner.jpg")}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "72% 18%",
        filter: "contrast(1.12) saturate(1.1) brightness(0.92)",
      }}
    />
    {/* left-weighted darkening for the text zone */}
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(6,8,16,0.94) 0%, rgba(6,8,16,0.8) 36%, rgba(6,8,16,0.12) 64%, rgba(6,8,16,0.0) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,8,16,0.72) 0%, transparent 38%)" }} />

    {/* eyebrow */}
    <div style={{ position: "absolute", left: 56, top: 74, fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: SKY, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
      Argentina 2–1 England
    </div>

    {/* headline */}
    <div style={{ position: "absolute", left: 50, top: 146, fontFamily: DISPLAY, fontWeight: 800, lineHeight: 0.9, textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.95)", WebkitTextStroke: "3px rgba(0,0,0,0.6)" }}>
      <div style={{ fontSize: 148, color: C.white }}>MESSI</div>
      <div style={{ fontSize: 138, color: C.gold }}>DID IT<br />AGAIN</div>
    </div>

    {/* result chip */}
    <div style={{ position: "absolute", left: 56, bottom: 60, background: SKY, padding: "14px 26px", borderRadius: 12, transform: "rotate(-2deg)", boxShadow: "0 8px 26px rgba(0,0,0,0.6)" }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 800, color: "#0a1428", letterSpacing: 1, textTransform: "uppercase" }}>
        90+2' WINNER → FINAL
      </span>
    </div>

    {/* brand mark */}
    <div style={{ position: "absolute", right: 40, top: 30, fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.white, opacity: 0.9, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
      KICKOFFDAILY90
    </div>
  </AbsoluteFill>
);
