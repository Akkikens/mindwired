/** codewired shared visual kit (extracted from mcp/scenes.tsx): gradient Stage
 *  with drifting glow blobs + vignette + grain, accent-tinted ChapterCard,
 *  lower-third Cap, glowing Node. Every episode from #3 on imports these. */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS } from "../../lib/theme";

export const MONO = "'SF Mono', 'Menlo', 'Consolas', monospace";
export const W = 1920, H = 1080, CX = W / 2, CY = H / 2;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const svgFill: React.CSSProperties = { position: "absolute", inset: 0 };

export const Stage: React.FC<{
  bg: [string, string]; blobs: { c: string; x: number; y: number; r: number }[];
  frame: number; children?: React.ReactNode;
}> = ({ bg, blobs, frame, children }) => (
  /* light lives in the corner blobs, NOT a center hotspot (Akshay feedback
     2026-07-16: "why is there a light in between always") — gradient center is
     pushed high and kept subtle so mid-frame stays clean behind the subject */
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 140% 90% at 50% -20%, ${bg[1]} 0%, ${bg[0]} 62%)` }}>
    {blobs.map((b, i) => {
      const dx = Math.sin(frame / (90 + i * 30) + i * 2.1) * 60;
      const dy = Math.cos(frame / (110 + i * 25) + i * 1.3) * 40;
      return (
        <div key={i} style={{
          position: "absolute", left: b.x + dx - b.r, top: b.y + dy - b.r,
          width: b.r * 2, height: b.r * 2, borderRadius: "50%",
          background: `radial-gradient(circle, ${b.c} 0%, transparent 66%)`,
          opacity: 0.2, filter: "blur(2px)",
        }} />
      );
    })}
    {children}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
      <filter id={`gr${frame % 4}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={String(7 + (frame % 4))} /></filter>
      <rect width={W} height={H} filter={`url(#gr${frame % 4})`} />
    </svg>
  </AbsoluteFill>
);

export const ChapterCard: React.FC<{ chapter: string; title: string; beatFrames: number; accent: string }> =
  ({ chapter, title, beatFrames, accent }) => {
    const frame = useCurrentFrame();
    if (frame > beatFrames) return null;
    const inO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
    const out = interpolate(frame, [beatFrames - 14, beatFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const rise = interpolate(frame, [0, 14], [26, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inO * out, background: "rgba(2,4,10,0.74)" }}>
        <div style={{ transform: `translateY(${rise}px)`, textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: accent, letterSpacing: "0.42em", marginBottom: 26, textShadow: `0 0 30px ${accent}` }}>{chapter}</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 118, color: "#F4F7FF", letterSpacing: "-0.02em", lineHeight: 1.04, whiteSpace: "pre-line" }}>{title}</div>
          <div style={{ width: 120, height: 5, background: accent, margin: "34px auto 0", boxShadow: `0 0 24px ${accent}` }} />
        </div>
      </AbsoluteFill>
    );
  };

export const Cap: React.FC<{ text: string; from: number; frame: number; accent: string }> = ({ text, from, frame, accent }) => {
  const o = interpolate(frame, [from, from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 84, width: "100%", textAlign: "center", opacity: o }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: "#F4F7FF", background: "rgba(3,6,14,0.84)", padding: "14px 34px", borderRadius: 14, border: `1px solid ${accent}55` }}>
        {text.split("*").map((part, i) => i % 2 ? <span key={i} style={{ color: accent, textShadow: `0 0 26px ${accent}` }}>{part}</span> : part)}
      </span>
    </div>
  );
};

export const Node: React.FC<{ x: number; y: number; r: number; c: string; label?: string; frame: number }> =
  ({ x, y, r, c, label, frame }) => {
    const pulse = 1 + 0.05 * Math.sin(frame / 9 + x * 0.1);
    return (
      <g>
        <circle cx={x} cy={y} r={r * 1.55} fill={c} opacity={0.14} />
        <circle cx={x} cy={y} r={r * pulse} fill={c} opacity={0.92} style={{ filter: `drop-shadow(0 0 ${r}px ${c})` }} />
        {label && <text x={x} y={y + r * 2.2 + 16} textAnchor="middle" fill="rgba(235,240,255,0.75)" style={{ font: `600 24px ${SANS}`, letterSpacing: "0.1em" }}>{label}</text>}
      </g>
    );
  };
