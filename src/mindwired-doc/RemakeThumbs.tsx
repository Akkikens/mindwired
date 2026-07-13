/** Thumbnails for the cross-channel remakes (1280×720, Workflow B).
 *  WW2EpicEnThumb — mindwired-branded, reuses the paid Gemini soldier scene.
 *  SpaceDeathsHiThumb — DimaagBatti-branded, McCandless PD-NASA photo. */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../lib/fonts";

const EN = "'Space Grotesk', sans-serif";
const HI = "'Noto Sans Devanagari', sans-serif";
const CYAN = "#4DD8FF";
const YELLOW = "#FFC53D";
const RED = "#FF4D4D";

export const WW2EpicEnThumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
    <Img src={staticFile("shorts/ww2/thumb/scene.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 40%, rgba(5,7,12,0.55) 60%, rgba(5,7,12,0.92) 100%)" }} />
    <div style={{ position: "absolute", right: 56, top: 0, bottom: 0, width: 620,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 128, lineHeight: 0.95, color: RED,
        letterSpacing: 1, textShadow: "0 6px 34px rgba(0,0,0,0.9)" }}>80 MILLION</div>
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 128, lineHeight: 0.95, color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>DEAD</div>
      <div style={{ width: 220, height: 10, background: CYAN, borderRadius: 6, margin: "18px 0 20px" }} />
      <div style={{ fontFamily: EN, fontWeight: 700, fontSize: 38, color: "#05070C",
        background: YELLOW, padding: "8px 24px", borderRadius: 12 }}>THE WHOLE STORY</div>
    </div>
    <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: CYAN, boxShadow: `0 0 16px ${CYAN}` }} />
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 32, color: "#fff" }}>mindwired</span>
    </div>
  </AbsoluteFill>
);

export const EastIndiaThumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1116" }}>
    <Img src={staticFile("shorts/eastindia/images/plassey_4.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "38% 45%",
        transform: "scale(1.45)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 36%, rgba(14,17,22,0.62) 58%, rgba(14,17,22,0.95) 100%)" }} />
    <div style={{ position: "absolute", right: 56, top: 0, bottom: 0, width: 640,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
      <div style={{ fontFamily: HI, fontWeight: 800, fontSize: 100, lineHeight: 1.08, color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.95)" }}>एक कंपनी ने</div>
      <div style={{ fontFamily: HI, fontWeight: 800, fontSize: 106, lineHeight: 1.08, color: RED,
        textShadow: "0 6px 34px rgba(0,0,0,0.95)" }}>देश ग़ुलाम बनाया</div>
      <div style={{ width: 220, height: 10, background: YELLOW, borderRadius: 6, margin: "18px 0 20px" }} />
      <div style={{ fontFamily: HI, fontWeight: 700, fontSize: 40, color: "#0E1116",
        background: YELLOW, padding: "8px 24px", borderRadius: 12 }}>ईस्ट इंडिया कंपनी · पूरी कहानी</div>
    </div>
    <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 34 }}>💡</span>
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 30, color: "#fff" }}>DimaagBatti</span>
    </div>
  </AbsoluteFill>
);

export const AtomDeathsThumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Img src={staticFile("shorts/atomdeaths/images/trinity_1.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 34%, rgba(0,0,0,0.62) 58%, rgba(0,0,0,0.95) 100%)" }} />
    <div style={{ position: "absolute", right: 56, top: 0, bottom: 0, width: 640,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 108, lineHeight: 0.98, color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.95)" }}>THE ATOM</div>
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 108, lineHeight: 0.98, color: RED,
        textShadow: "0 6px 34px rgba(0,0,0,0.95)" }}>KILLED</div>
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 108, lineHeight: 0.98, color: RED,
        textShadow: "0 6px 34px rgba(0,0,0,0.95)" }}>THEM ALL</div>
      <div style={{ width: 220, height: 10, background: CYAN, borderRadius: 6, margin: "18px 0 20px" }} />
      <div style={{ fontFamily: EN, fontWeight: 700, fontSize: 36, color: "#000",
        background: YELLOW, padding: "8px 24px", borderRadius: 12 }}>THE REAL PHOTOS</div>
    </div>
    <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: CYAN, boxShadow: `0 0 16px ${CYAN}` }} />
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 32, color: "#fff" }}>mindwired</span>
    </div>
  </AbsoluteFill>
);

export const SpaceDeathsHiThumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Img src={staticFile("shorts/spacedeaths/images/mccandless_1.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 38%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.94) 100%)" }} />
    <div style={{ position: "absolute", right: 56, top: 0, bottom: 0, width: 640,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6 }}>
      <div style={{ fontFamily: HI, fontWeight: 800, fontSize: 104, lineHeight: 1.08, color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.95)" }}>इस वीडियो में</div>
      <div style={{ fontFamily: HI, fontWeight: 800, fontSize: 118, lineHeight: 1.08, color: RED,
        textShadow: "0 6px 34px rgba(0,0,0,0.95)" }}>सब मारे गए</div>
      <div style={{ width: 220, height: 10, background: YELLOW, borderRadius: 6, margin: "18px 0 20px" }} />
      <div style={{ fontFamily: HI, fontWeight: 700, fontSize: 40, color: "#0E1116",
        background: YELLOW, padding: "8px 24px", borderRadius: 12 }}>21 कभी नहीं लौटे</div>
    </div>
    <div style={{ position: "absolute", bottom: 26, right: 34, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 34 }}>💡</span>
      <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 30, color: "#fff" }}>DimaagBatti</span>
    </div>
  </AbsoluteFill>
);
