import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

/** Cinematic vignette — darkens edges for a filmic focus. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.9 }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(130% 100% at 50% 50%, transparent 46%, rgba(0,0,0,${0.55 * strength}) 100%)`,
    pointerEvents: "none",
  }} />
);

/** Subtle animated film grain via layered noise opacity. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  // shift a tiled radial-dot pattern each frame for moving grain
  const ox = (frame * 7) % 9;
  const oy = (frame * 13) % 11;
  return (
    <AbsoluteFill style={{
      pointerEvents: "none", opacity, mixBlendMode: "overlay",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.6px)",
      backgroundSize: "3px 3px",
      backgroundPosition: `${ox}px ${oy}px`,
    }} />
  );
};

/** Letterbox bars for the cinematic 2.39:1 feel (optional). */
export const Letterbox: React.FC<{ height?: number }> = ({ height = 70 }) => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height, background: "#000", zIndex: 50 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height, background: "#000", zIndex: 50 }} />
  </>
);

/** Slow diagonal light sweep (volumetric glow streak). */
export const LightSweep: React.FC<{ color?: string; speed?: number; opacity?: number }> = ({
  color = C.cyan, speed = 1, opacity = 0.14,
}) => {
  const frame = useCurrentFrame();
  const x = ((frame * speed) % 2600) - 600;
  return (
    <div style={{
      position: "absolute", top: -200, left: x, width: 380, height: 1500,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      filter: "blur(60px)", opacity, transform: "rotate(18deg)",
      pointerEvents: "none", mixBlendMode: "screen",
    }} />
  );
};
