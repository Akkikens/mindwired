/** DimaagBatti — NEET explainer thumbnail (1280×720).
 *  Gemini-generated dramatic scene (public/shorts/neet16/thumb/scene.png) with
 *  crisp text overlaid in Remotion — the AI never draws the text (accuracy rule).
 *  Two language variants via the `lang` prop: "hi" (matches video) | "en" (reach). */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../lib/fonts";

const HI = "'Noto Sans Devanagari', sans-serif";
const EN = "'Space Grotesk', sans-serif";
const YELLOW = "#FFC53D";
const RED = "#FF3B30";

type Props = { lang: "hi" | "en" };

const COPY = {
  hi: { l1: "NEET लीक", l2: "→ बैन क्यों?", tag: "पूरी कहानी", font: HI },
  en: { l1: "NEET LEAK", l2: "→ BANNED?", tag: "THE FULL STORY", font: EN },
};

export const NeetThumb: React.FC<Props> = ({ lang }) => {
  const c = COPY[lang];
  return (
    <AbsoluteFill style={{ backgroundColor: "#141B2B" }}>
      <Img src={staticFile("shorts/neet16/thumb/scene2.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* darken the right half so text pops over any glow */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 40%, rgba(10,14,24,0.55) 62%, rgba(10,14,24,0.82) 100%)" }} />

      {/* text block, right half */}
      <div style={{ position: "absolute", right: 60, top: 0, bottom: 0, width: 620,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
        <div style={{ fontFamily: c.font, fontWeight: 800, fontSize: 130, lineHeight: 0.98, color: "#fff",
          letterSpacing: lang === "en" ? 1 : 0, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>{c.l1}</div>
        <div style={{ fontFamily: c.font, fontWeight: 800, fontSize: 130, lineHeight: 1.0, color: YELLOW,
          letterSpacing: lang === "en" ? 1 : 0, textShadow: "0 6px 30px rgba(0,0,0,0.85)" }}>{c.l2}</div>
        {/* yellow accent underline */}
        <div style={{ width: 200, height: 10, background: YELLOW, borderRadius: 6, margin: "14px 0 18px" }} />
        <div style={{ fontFamily: c.font, fontWeight: 700, fontSize: 40, color: "#fff",
          background: RED, padding: "8px 22px", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>{c.tag}</div>
      </div>

      {/* brand */}
      <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 34 }}>💡</span>
        <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: 0.5 }}>DimaagBatti</span>
      </div>
    </AbsoluteFill>
  );
};
