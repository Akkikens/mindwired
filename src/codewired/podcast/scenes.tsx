/** codewired podcast — two-host visual: no photoreal avatars (the brand is
 *  abstract/kinetic, not talking-head), so each host is a glowing "core"
 *  identity (cyan = A, amber = B) that pulses + shows a live waveform when
 *  speaking, with a name tag and live word-by-word captions underneath.
 *  Matches the existing circuit-trace/agent-core visual language 1:1. */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CW } from "../Brand";
import { DISPLAY, SANS } from "../../lib/theme";
import { clipWords, clipSpeaker, Speaker, FPS } from "./script";

const W = 1920, H = 1080, CX = W / 2, CY = H / 2 - 40;
const AMBER = "#FFB020";
const AMBER_DIM = "rgba(255,176,32,0.35)";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, ${CW.bg2} 0%, ${CW.bg} 72%)` }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
      {Array.from({ length: 11 }, (_, i) => {
        const y = (H / 12) * (i + 1);
        const kink = W * (0.15 + 0.7 * rng(i * 7));
        const dy = (i % 2 === 0 ? 1 : -1) * 36;
        return (
          <g key={i}>
            <path d={`M0 ${y} H${kink} l40 ${dy} H${W}`} stroke="rgba(120,170,220,0.07)" strokeWidth={2} fill="none" />
            <circle cx={kink} cy={y} r={3.5} fill="rgba(120,170,220,0.10)" />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);

/** A host "core" — glowing nucleus, orbit shells, name tag. Pulses harder + a
 *  waveform blooms beneath it while `active` (this turn's speaker). */
const HostCore: React.FC<{ x: number; y: number; color: string; name: string; frame: number; active: boolean }> =
  ({ x, y, color, name, frame, active }) => {
    const pulse = active ? 1 + 0.09 * Math.sin(frame / 6) : 1 + 0.02 * Math.sin(frame / 14);
    const r = 76 * pulse;
    const op = active ? 1 : 0.4;
    return (
      <g opacity={op}>
        <circle cx={x} cy={y} r={r * 1.6} fill="none" stroke={color} strokeWidth={1.4} opacity={0.2} />
        <circle cx={x} cy={y} r={r * 1.3} fill="none" stroke={color} strokeWidth={1.4} opacity={0.3}
          strokeDasharray="6 10" transform={`rotate(${frame * (active ? 1.1 : 0.4)} ${x} ${y})`} />
        <circle cx={x} cy={y} r={r} fill={color} opacity={active ? 0.9 : 0.5}
          style={active ? { filter: `drop-shadow(0 0 ${28 * pulse}px ${color})` } : undefined} />
        <circle cx={x} cy={y} r={r * 0.55} fill={CW.bg} opacity={0.9} />
        {active && (
          <g>
            {Array.from({ length: 7 }, (_, i) => {
              const bx = x - 60 + i * 20;
              const h = 10 + 26 * Math.abs(Math.sin(frame / 5 + i * 1.3 + x));
              return <rect key={i} x={bx} y={y + r * 0.9 - h / 2} width={7} height={h} rx={3} fill={color} opacity={0.85} />;
            })}
          </g>
        )}
        <text x={x} y={y + r + 56} textAnchor="middle" fontFamily={DISPLAY} fontSize={30} fontWeight={800}
          letterSpacing={2} fill={active ? color : CW.dim}>{name}</text>
      </g>
    );
  };

/** Live word-by-word captions for the current turn, bottom-third. */
const LiveCaption: React.FC<{ words: { word: string; start: number; end: number }[]; frame: number; color: string }> =
  ({ words, frame, color }) => {
    const t = frame / FPS;
    if (!words.length) return null;
    // show a rolling window of ~10 words centered on the current one
    let idx = words.findIndex((w) => t < w.end);
    if (idx === -1) idx = words.length - 1;
    const start = Math.max(0, idx - 6);
    const visible = words.slice(start, idx + 4);
    return (
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 120, textAlign: "center" }}>
        <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 600, lineHeight: 1.3 }}>
          {visible.map((w, i) => {
            const spoken = t >= w.start;
            return (
              <span key={start + i} style={{ color: spoken ? "#fff" : "rgba(234,246,255,0.28)", marginRight: 12 }}>
                {w.word}
              </span>
            );
          })}
        </span>
      </div>
    );
  };

export const TwoHostScene: React.FC<{ clipId: string; speaker: Speaker }> = ({ clipId, speaker }) => {
  const frame = useCurrentFrame();
  const words = clipWords(clipId);
  const activeColor = speaker === "A" ? CW.cyan : AMBER;
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Backdrop />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <HostCore x={CX - 280} y={CY} color={CW.cyan} name="CIPHER" frame={frame} active={speaker === "A"} />
        <HostCore x={CX + 280} y={CY} color={AMBER} name="DRIFT" frame={frame} active={speaker === "B"} />
      </svg>
      <LiveCaption words={words} frame={frame} color={activeColor} />
    </AbsoluteFill>
  );
};

export const PodcastChapterCard: React.FC<{ chapter: string }> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10, 50, 60], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op, background: CW.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, color: CW.white, textAlign: "center", letterSpacing: 1 }}>
        {chapter}
      </div>
    </AbsoluteFill>
  );
};
