import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, SANS } from "../lib/theme";

/** Shared "motion-energy" primitives (Infographics-Show punch, Mindwired palette):
 *  numbers that count up and snap, overshoot pop-ins, building bars. Used by the
 *  motion demo and by the real episodes' data beats. */

const easeOutCubic = Easing.out(Easing.cubic);
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** A number that races up to its target with deceleration, while the glyphs pop. */
export const CountUp: React.FC<{
  to: number; dur?: number; suffix?: string; size?: number; color?: string;
  /** max on-screen width for the number+suffix (keeps big values like
   *  "10,000,000,000 SUNS" inside the 1080px frame instead of overflowing). */
  maxWidth?: number;
}> = ({ to, dur = 32, suffix = "", size = 160, color = C.white, maxWidth = 940 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  const pop = spring({ frame: f, fps, config: { damping: 11, stiffness: 95, mass: 0.7 } });
  const scale = interpolate(pop, [0, 1], [0.55, 1]);
  // auto-shrink so the widest state (the final value + suffix) fits maxWidth.
  // ~0.6·fontSize per display-bold glyph; suffix rendered at 0.46·size counts ~half.
  const estChars = fmt(to).length + suffix.length * 0.55;
  const fitSize = Math.min(size, Math.floor(maxWidth / Math.max(1, estChars * 0.6)));
  return (
    <span style={{
      fontFamily: DISPLAY, fontWeight: 700, fontSize: fitSize, lineHeight: 0.9,
      color, letterSpacing: 1, display: "inline-block", transform: `scale(${scale})`, whiteSpace: "nowrap",
      textShadow: `0 0 ${interpolate(pop, [0, 1], [60, 26])}px ${color}66, 0 6px 24px rgba(0,0,0,0.6)`,
    }}>
      {fmt(to * p)}<span style={{ fontSize: fitSize * 0.46, marginLeft: 10 }}>{suffix}</span>
    </span>
  );
};

/** Overshoot entrance with a directional slide + stagger delay. */
export const PopIn: React.FC<{
  delay?: number; from?: "up" | "down" | "left" | "right" | "none";
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({ delay = 0, from = "up", children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 120, mass: 0.6 } });
  const op = interpolate(f - delay, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = 46;
  const dx = from === "left" ? d : from === "right" ? -d : 0;
  const dy = from === "up" ? d : from === "down" ? -d : 0;
  return (
    <div style={{
      opacity: op,
      transform: `translate(${interpolate(s, [0, 1], [dx, 0])}px, ${interpolate(s, [0, 1], [dy, 0])}px) scale(${interpolate(s, [0, 1], [0.88, 1])})`,
      ...style,
    }}>
      {children}
    </div>
  );
};

/** A bar that builds from the left with deceleration, value counting up at its tip. */
export const Bar: React.FC<{
  label: string; value: number; suffix?: string; maxW: number; color: string; delay: number;
}> = ({ label, value, suffix = "", maxW, color, delay }) => {
  const f = useCurrentFrame();
  const grow = interpolate(f - delay, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  const op = interpolate(f - delay, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, marginBottom: 26 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: C.dim, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{
          height: 30, width: maxW * grow, borderRadius: 6,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 28px ${color}66`,
        }} />
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: C.white }}>
          {fmt(value * grow)}<span style={{ fontSize: 26, color, marginLeft: 6 }}>{suffix}</span>
        </span>
      </div>
    </div>
  );
};
