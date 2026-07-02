import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

const rnd = (i: number) => {
  const x = Math.sin(i * 73.13 + 7.9) * 2917.41;
  return x - Math.floor(x);
};

/** Atomic-oxygen "sandstorm": fast diagonal streaks slamming a target point. */
export const AtomicOxygenStream: React.FC<{ tx: number; ty: number; color?: string }> = ({
  tx, ty, color = C.teal,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 60 }).map((_, i) => {
        const prog = ((frame * (3 + rnd(i) * 4) + rnd(i + 1) * 1000) % 1000) / 1000;
        const startX = -100 + rnd(i + 2) * 300;
        const startY = rnd(i + 3) * 1080;
        const x = interpolate(prog, [0, 1], [startX, tx + (rnd(i) - 0.5) * 120]);
        const y = interpolate(prog, [0, 1], [startY, ty + (rnd(i + 4) - 0.5) * 120]);
        const op = Math.sin(prog * Math.PI) * 0.8;
        return <line key={i} x1={x} y1={y} x2={x - 22} y2={y - 6}
          stroke={color} strokeWidth={1.6} opacity={op} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Kessler cascade: collision nodes that flash and spray fragment lines outward. */
export const KesslerCascade: React.FC<{ startAt?: number }> = ({ startAt = 0 }) => {
  const frame = useCurrentFrame() - startAt;
  if (frame < 0) return null;
  const nodes = Array.from({ length: 14 }).map((_, i) => ({
    x: 200 + rnd(i) * 1520,
    y: 140 + rnd(i + 1) * 800,
    t: rnd(i + 2) * 90,   // when this collision fires
  }));
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {nodes.map((n, i) => {
        const age = frame - n.t;
        if (age < 0) return null;
        const flash = interpolate(age, [0, 6, 24], [0, 1, 0], { extrapolateRight: "clamp" });
        const ring = interpolate(age, [0, 30], [0, 80], { extrapolateRight: "clamp" });
        const ringOp = interpolate(age, [0, 30], [0.8, 0], { extrapolateRight: "clamp" });
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={ring} fill="none" stroke={C.danger} strokeWidth={2} opacity={ringOp} />
            <circle cx={n.x} cy={n.y} r={4 + flash * 6} fill={C.danger}
              opacity={0.5 + flash * 0.5} style={{ filter: `drop-shadow(0 0 12px ${C.danger})` }} />
            {Array.from({ length: 8 }).map((_, k) => {
              const a = (k / 8) * Math.PI * 2;
              const len = interpolate(age, [0, 40], [0, 70], { extrapolateRight: "clamp" });
              return <line key={k} x1={n.x} y1={n.y}
                x2={n.x + Math.cos(a) * len} y2={n.y + Math.sin(a) * len}
                stroke={C.ember} strokeWidth={1.5} opacity={ringOp * 0.9} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

/** Space Fence radar sweep + locked tracking boxes on detected objects. */
export const RadarScan: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const sweep = (frame * 1.6) % 360;
  const targets = Array.from({ length: 16 }).map((_, i) => ({
    x: cx + (rnd(i) - 0.5) * 1500,
    y: cy + (rnd(i + 1) - 0.5) * 760,
    ang: rnd(i) * 360,
  }));
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {/* concentric rings */}
      {[180, 360, 540, 720].map((rr, i) => (
        <circle key={i} cx={cx} cy={cy} r={rr} fill="none" stroke={C.cyan} strokeWidth={1} opacity={0.12} />
      ))}
      {/* sweep beam */}
      <g transform={`translate(${cx},${cy}) rotate(${sweep})`}>
        <path d={`M 0 0 L 760 -60 A 760 760 0 0 1 760 60 Z`} fill={C.cyan} opacity={0.10} />
        <line x1={0} y1={0} x2={760} y2={0} stroke={C.cyan} strokeWidth={2} opacity={0.5} />
      </g>
      {/* tracked targets — light up as the beam passes */}
      {targets.map((t, i) => {
        const lit = Math.abs(((sweep - t.ang + 540) % 360) - 180) > 150;
        const pulse = lit ? 1 : 0.35;
        return (
          <g key={i} opacity={pulse}>
            <rect x={t.x - 12} y={t.y - 12} width={24} height={24} fill="none"
              stroke={C.cyan} strokeWidth={1.4} />
            <circle cx={t.x} cy={t.y} r={2.4} fill={C.cyan}
              style={{ filter: `drop-shadow(0 0 4px ${C.cyan})` }} />
          </g>
        );
      })}
    </svg>
  );
};

/** A single reentry shooting-star streak (finale). */
export const ShootingStar: React.FC<{ startAt: number; x0: number; y0: number; x1: number; y1: number }> = ({
  startAt, x0, y0, x1, y1,
}) => {
  const frame = useCurrentFrame() - startAt;
  if (frame < 0) return null;
  const p = interpolate(frame, [0, 46], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(p, [0, 1], [x0, x1]);
  const y = interpolate(p, [0, 1], [y0, y1]);
  const tailLen = interpolate(p, [0, 0.3, 1], [0, 220, 90]);
  const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const tx = x - Math.cos(ang) * tailLen;
  const ty = y - Math.sin(ang) * tailLen;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>
      <line x1={tx} y1={ty} x2={x} y2={y} stroke={C.amber} strokeWidth={4} opacity={op * 0.6}
        strokeLinecap="round" style={{ filter: `blur(3px)` }} />
      <line x1={tx} y1={ty} x2={x} y2={y} stroke="url(#trail)" strokeWidth={2.2} opacity={op} strokeLinecap="round" />
      <circle cx={x} cy={y} r={5} fill="#FFFFFF" opacity={op}
        style={{ filter: `drop-shadow(0 0 14px ${C.amber})` }} />
    </svg>
  );
};
