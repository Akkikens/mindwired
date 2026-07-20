import React from "react";
import { AbsoluteFill } from "remotion";
import { DISPLAY, SANS } from "../lib/theme";

/** codewired brand palette — darker than mindwired, electric cyan accent. */
export const CW = {
  bg: "#050A14",
  bg2: "#081226",
  cyan: "#00E5FF",
  cyanDim: "rgba(0,229,255,0.35)",
  white: "#EAF6FF",
  dim: "rgba(200,230,255,0.55)",
};

/** Circuit-trace backdrop: horizontal "wires" with nodes, one lit in cyan. */
const Wires: React.FC<{ w: number; h: number; n?: number; litIndex?: number }> = ({ w, h, n = 9, litIndex }) => (
  <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const y = (h / (n + 1)) * (i + 1);
      const lit = i === (litIndex ?? Math.floor(n / 2));
      const col = lit ? CW.cyan : "rgba(120,170,220,0.10)";
      const kink = w * (0.18 + 0.6 * ((i * 37) % 10) / 10);
      const dy = (i % 2 === 0 ? 1 : -1) * h * 0.035;
      return (
        <g key={i}>
          <path
            d={`M0 ${y} H${kink} l${h * 0.04} ${dy} H${w}`}
            stroke={col}
            strokeWidth={lit ? 3 : 2}
            fill="none"
            style={lit ? { filter: `drop-shadow(0 0 12px ${CW.cyan})` } : undefined}
          />
          <circle cx={kink} cy={y} r={lit ? 7 : 4} fill={col}
            style={lit ? { filter: `drop-shadow(0 0 14px ${CW.cyan})` } : undefined} />
        </g>
      );
    })}
  </svg>
);

const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: "-0.03em", display: "flex", alignItems: "baseline" }}>
    <span style={{ color: CW.white }}>code</span>
    <span style={{ color: CW.cyan, textShadow: `0 0 ${size * 0.45}px ${CW.cyanDim}` }}>wired</span>
    <span
      style={{
        display: "inline-block", width: size * 0.5, height: size * 0.09,
        background: CW.cyan, marginLeft: size * 0.12, alignSelf: "flex-end",
        marginBottom: size * 0.09, boxShadow: `0 0 18px ${CW.cyan}`,
      }}
    />
  </div>
);

/** 800×800 channel avatar: cw monogram wired together. */
export const CodewiredAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${CW.bg2} 0%, ${CW.bg} 70%)`, alignItems: "center", justifyContent: "center" }}>
    <Wires w={800} h={800} n={7} litIndex={5} />
    <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 700, fontSize: 340, letterSpacing: "-0.06em", display: "flex", alignItems: "baseline" }}>
      <span style={{ color: CW.white }}>c</span>
      <span style={{ color: CW.cyan, textShadow: `0 0 90px ${CW.cyanDim}` }}>w</span>
      <span style={{ display: "inline-block", width: 96, height: 26, background: CW.cyan, marginLeft: 26, alignSelf: "flex-end", marginBottom: 30, boxShadow: `0 0 30px ${CW.cyan}` }} />
    </div>
  </AbsoluteFill>
);

/** 2048×1152 banner. All text inside the 1235×338 all-device safe area (centered). */
export const CodewiredBanner: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${CW.bg2} 0%, ${CW.bg} 75%)`, alignItems: "center", justifyContent: "center" }}>
    <Wires w={2048} h={1152} n={13} />
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 1180 }}>
      <Wordmark size={150} />
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: CW.dim, letterSpacing: "0.01em", textAlign: "center" }}>
        how AI agents actually work — animated
      </div>
    </div>
  </AbsoluteFill>
);
