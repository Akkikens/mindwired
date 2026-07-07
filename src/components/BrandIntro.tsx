import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "../lib/theme";

// Standing 3s brand-bumper: plays after the hook (never in the first ~10s),
// once per video, on every channel. Background plates live in
// public/brand-intros/<brand>.mp4 (Higgsfield, text-free — AI video mangles
// wordmarks, so the real brand name is this DOM text layer on top, same
// "bloom" treatment as singaloo's cosmic-engine IntroCard).
export type Brand = "mindwired" | "kickoffdaily90" | "singaloo";

const BRAND_COPY: Record<Brand, { name: string; tagline: string; glow: string; accent: string }> = {
  mindwired: {
    name: "mindwired",
    tagline: "the strange machinery of our universe",
    glow: "#8A4BE0",
    accent: "#5AC8FF",
  },
  kickoffdaily90: {
    name: "kickoffdaily90",
    tagline: "every match. every shock.",
    glow: "#1FAA59",
    accent: "#EAF2FF",
  },
  singaloo: {
    name: "singaloo",
    tagline: "sing, learn, play",
    glow: "#FFB347",
    accent: "#FF7AC6",
  },
};

export const BRAND_INTRO_FRAMES = 90; // 3s @ 30fps

export const BrandIntro: React.FC<{ brand: Brand }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = BRAND_COPY[brand];

  const grow = spring({ frame, fps, config: { damping: 40, stiffness: 18, mass: 1.6 } });
  const glowAmt = interpolate(frame, [0, 40, 90], [0, 0.7, 1], { extrapolateRight: "clamp" });
  const tag = interpolate(frame, [34, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo muted src={staticFile(`brand-intros/${brand}.mp4`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.28)" }}>
        <div style={{ textAlign: "center", transform: `scale(${0.92 + grow * 0.08})` }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 150,
              fontWeight: 900,
              color: "#EAF2FF",
              letterSpacing: interpolate(grow, [0, 1], [26, 6]),
              textShadow: `0 0 ${40 + glowAmt * 70}px ${copy.glow}, 0 0 ${20 + glowAmt * 30}px ${copy.accent}66, 0 8px 40px rgba(0,0,0,0.9)`,
            }}
          >
            {copy.name}
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 32,
              fontWeight: 700,
              color: copy.accent,
              letterSpacing: 8,
              textTransform: "uppercase",
              marginTop: 24,
              opacity: tag,
              transform: `translateY(${(1 - tag) * 12}px)`,
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}
          >
            {copy.tagline}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
