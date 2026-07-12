/** DimaagBatti — WW2 EPIC thumbnail (1280×720). Reuses the paid Gemini soldier
 *  scene (shorts/ww2/thumb/scene.png) with epic-specific Remotion text. */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../lib/fonts";

const HI = "'Noto Sans Devanagari', sans-serif";
const EN = "'Space Grotesk', sans-serif";
const YELLOW = "#FFC53D";
const EMBER = "#FF6A2B";

type Props = { lang: "hi" | "en" };
const COPY = {
  hi: { l1: "WW2", l2: "पूरी कहानी", tag: "1939–1945 · हर मोड़", font: HI },
  en: { l1: "WW2", l2: "THE FULL STORY", tag: "1939–1945 · EVERY TURN", font: EN },
};

export const WW2EpicThumb: React.FC<Props> = ({ lang }) => {
  const c = COPY[lang];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E1116" }}>
      <Img src={staticFile("shorts/ww2/thumb/scene.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 42%, rgba(10,12,18,0.5) 60%, rgba(10,12,18,0.88) 100%)" }} />
      <div style={{ position: "absolute", right: 60, top: 0, bottom: 0, width: 600,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 4 }}>
        <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 170, lineHeight: 0.9, color: EMBER,
          letterSpacing: 2, textShadow: "0 6px 34px rgba(0,0,0,0.85)" }}>{c.l1}</div>
        <div style={{ fontFamily: c.font, fontWeight: 800, fontSize: lang === "hi" ? 96 : 92, lineHeight: 1.0,
          color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{c.l2}</div>
        <div style={{ width: 220, height: 10, background: YELLOW, borderRadius: 6, margin: "16px 0 18px" }} />
        <div style={{ fontFamily: c.font, fontWeight: 700, fontSize: 36, color: "#0E1116",
          background: YELLOW, padding: "8px 22px", borderRadius: 12 }}>{c.tag}</div>
      </div>
      <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 34 }}>💡</span>
        <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 30, color: "#fff" }}>DimaagBatti</span>
      </div>
    </AbsoluteFill>
  );
};
