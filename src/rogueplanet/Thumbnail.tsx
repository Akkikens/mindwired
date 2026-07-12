/** Thumbnail still for the rogue-planet episode — "IT'S COMING" over a dark
 *  planet edging into the frame. House style: 3-5 word ALL-CAPS text, one dramatic
 *  scene, dark background (see THUMBNAILS.md). Render:
 *  npx remotion still RoguePlanetThumbnail out/rogueplanet_thumb.png */
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, DISPLAY, SANS } from "../lib/theme";
import { Starfield, RoguePlanet } from "./scenes/graphics";
import { Vignette } from "../components/FilmLook";

// Canvas is 1280×720 — coordinates below are in that space.
export const RoguePlanetThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 80% 45%, #0a1730 0%, #02040a 66%)" }}>
    <Starfield count={160} seed={11} twinkle={false} />
    {/* the rogue planet crowding in from the right */}
    <RoguePlanet cx={1090} cy={400} r={300} rim="#6aa0ff" glow={1} />
    {/* danger wash */}
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 80% at 84% 52%, ${C.danger}22, transparent 60%)` }} />
    <div style={{ position: "absolute", left: 62, top: 150 }}>
      <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.cyan, textTransform: "uppercase", textShadow: `0 0 18px ${C.cyan}` }}>A rogue planet is coming</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 168, fontWeight: 800, letterSpacing: 1, color: C.gold, lineHeight: 0.84, marginTop: 14, textShadow: `0 0 46px ${C.ember}, 0 8px 26px rgba(0,0,0,0.85)`, WebkitTextStroke: `3px #1a0f00` }}>IT'S<br />COMING</div>
    </div>
    <Vignette strength={1.0} />
  </AbsoluteFill>
);
