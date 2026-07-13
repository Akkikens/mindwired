/** Thumbnail: Gemini face-off keyart (public/mvb/thumb_faceoff.png) + house-style
 *  text in the dark bottom band. Render: npx remotion still MvBThumb thumb_mvb.png */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../lib/fonts";

const DISPLAY = "'Space Grotesk', sans-serif";
const GOLD = "#FFD86B";

export const MvBThumb: React.FC<{ art?: string }> = ({ art = "thumb_faceoff" }) => (
  <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
    <Img src={staticFile(`mvb/${art}.png`)}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
    <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 74, letterSpacing: 8,
        color: "#fff", WebkitTextStroke: "4px #05070E", paintOrder: "stroke fill" }}>
        MESSI <span style={{ color: GOLD }}>v</span> BELLINGHAM
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 128, lineHeight: 1,
        letterSpacing: 2, color: GOLD, marginTop: 2,
        WebkitTextStroke: "6px #05070E", paintOrder: "stroke fill",
        textShadow: "0 0 60px rgba(255,216,107,0.45)" }}>
        ONLY ONE GOES
      </div>
    </div>
  </AbsoluteFill>
);
