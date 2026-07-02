import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

/** Deterministic pseudo-random in [0,1) from an integer seed. */
const r = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Props {
  /** parallax drift speed multiplier */
  drift?: number;
  /** nebula accent color */
  nebula?: string;
  /** overall brightness 0..1 */
  intensity?: number;
}

/**
 * Deep-space background: graded radial vignette gradient, three parallax star
 * layers (slow drift + twinkle), and soft drifting nebula clouds. Stable across
 * frames (seeded), so it never flickers.
 */
export const SpaceBackdrop: React.FC<Props> = ({ drift = 1, nebula = C.cyan, intensity = 1 }) => {
  const frame = useCurrentFrame();

  const layers = [
    { count: 90, size: 1.1, speed: 0.06, tw: 0.03, op: 0.5 },
    { count: 60, size: 1.8, speed: 0.11, tw: 0.05, op: 0.7 },
    { count: 26, size: 2.8, speed: 0.18, tw: 0.08, op: 0.95 },
  ];

  return (
    <AbsoluteFill style={{ background: C.void }}>
      {/* graded space gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(120% 90% at 50% 38%, ${C.deepBlue} 0%, ${C.void} 62%, #01030A 100%)`,
        opacity: intensity,
      }} />

      {/* drifting nebula clouds */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {[0, 1, 2].map((i) => {
          const x = 200 + r(i * 7 + 3) * 1500;
          const y = 120 + r(i * 11 + 5) * 700;
          const dx = Math.sin(frame * 0.004 * drift + i) * 60;
          const dy = Math.cos(frame * 0.003 * drift + i) * 36;
          const col = i === 1 ? C.ember : nebula;
          return (
            <div key={i} style={{
              position: "absolute", left: x + dx, top: y + dy,
              width: 900, height: 620, borderRadius: "50%",
              background: `radial-gradient(circle, ${col}26 0%, ${col}0D 38%, transparent 70%)`,
              filter: "blur(38px)", opacity: 0.5 * intensity,
              transform: "translate(-50%,-50%)",
            }} />
          );
        })}
      </AbsoluteFill>

      {/* parallax star layers */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {layers.map((L, li) => (
          <g key={li}>
            {Array.from({ length: L.count }).map((_, i) => {
              const seed = li * 1000 + i;
              const baseX = r(seed) * 1920;
              const baseY = r(seed + 0.5) * 1080;
              const x = (baseX + frame * L.speed * drift) % 1980 - 30;
              const tw = 0.6 + 0.4 * Math.sin(frame * L.tw + seed);
              const sz = L.size * (0.7 + r(seed + 0.3) * 0.8);
              return (
                <circle key={i} cx={x} cy={baseY} r={sz}
                  fill={r(seed + 0.7) > 0.85 ? C.ice : "#FFFFFF"}
                  opacity={L.op * tw * intensity} />
              );
            })}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
