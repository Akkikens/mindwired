/** codewired #1 thumbnail — house style: 3-5 word ALL-CAPS, one dramatic scene,
 *  dark background. Spawn-burst visual + "YOUR AI CLONES ITSELF". */
import React from "react";
import { AbsoluteFill } from "remotion";
import { CW } from "./Brand";
import { DISPLAY } from "../lib/theme";

const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** codewired #4 FLAGSHIP thumbnail — half-built agent on the workbench. */
export const CodewiredFlagshipThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 140% 90% at 50% -20%, #16222E 0%, #05080E 62%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <path d="M880 0 L700 560 L1120 560 L960 0 Z" fill="#FFB84D" opacity={0.08} />
      <rect x={690} y={520} width={440} height={16} rx={7} fill="#2A2118" />
      <circle cx={910} cy={360} r={92} fill="none" stroke="#4AD8C8" strokeWidth={6} strokeDasharray="200 999" transform="rotate(-90 910 360)" style={{ filter: "drop-shadow(0 0 10px #4AD8C8)" }} />
      <circle cx={910} cy={360} r={46} fill="#FF6B8A" opacity={0.95} style={{ filter: "drop-shadow(0 0 26px #FF6B8A)" }} />
      {["R", "E", "B"].map((t, i) => {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const x = 910 + Math.cos(a) * 150, y = 360 + Math.sin(a) * 105;
        return (
          <g key={t}>
            <circle cx={x} cy={y} r={26} fill="#141008" stroke="#FFC649" strokeWidth={2.5} />
            <text x={x} y={y + 8} textAnchor="middle" fill="#FFC649" style={{ font: "700 22px 'SF Mono', Menlo, monospace" }}>{t}</text>
          </g>
        );
      })}
    </svg>
    <div style={{ position: "absolute", left: 56, top: 104, width: 640 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 96, lineHeight: 1.02, color: CW.white, letterSpacing: "-0.02em", textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>
        I BUILT MY OWN<br />
        <span style={{ color: "#FFB84D", textShadow: "0 0 50px rgba(255,184,77,0.5)" }}>CLAUDE CODE</span>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: "#FF6B8A", marginTop: 20 }}>IT MADE THIS VIDEO</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: CW.dim }}>
      code<span style={{ color: CW.cyan }}>wired</span><span style={{ display: "inline-block", width: 18, height: 5, background: CW.cyan, marginLeft: 6 }} />
    </div>
  </AbsoluteFill>
);

/** codewired #3 thumbnail — green library shelf + one glowing pulled book. */
export const CodewiredSkillsThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 68% 45%, #0D3018 0%, #04120A 75%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <rect x={680} y={470} width={540} height={14} rx={6} fill="#4A3418" />
      {["#C89A5C", "#8AB8D8", "#C87A9A", "#9AC85C", "#7AC8C8"].map((c, i) => (
        <rect key={i} x={700 + i * 88} y={330} width={66} height={140} rx={6} fill={`${c}55`} stroke={c} strokeWidth={2} />
      ))}
      <g transform="rotate(-10 780 200)">
        <rect x={730} y={130} width={100} height={170} rx={7} fill="#FFC649" style={{ filter: "drop-shadow(0 0 34px #FFC649)" }} />
        <text x={780} y={215} textAnchor="middle" fill="#1A1204" style={{ font: "700 20px 'SF Mono', Menlo, monospace" }} transform="rotate(-90 780 215)">skill.md</text>
      </g>
      <line x1={830} y1={230} x2={1080} y2={120} stroke="#5CD68A" strokeWidth={3} strokeDasharray="8 8" opacity={0.8} />
    </svg>
    <div style={{ position: "absolute", left: 56, top: 118, width: 620 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 100, lineHeight: 1.02, color: CW.white, letterSpacing: "-0.02em", textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>
        TEACH YOUR AI<br />
        <span style={{ color: "#FFC649", textShadow: "0 0 50px rgba(255,198,73,0.5)" }}>NEW SKILLS</span>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 42, color: "#5CD68A", marginTop: 18 }}>IT'S JUST A FOLDER</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: CW.dim }}>
      code<span style={{ color: CW.cyan }}>wired</span><span style={{ display: "inline-block", width: 18, height: 5, background: CW.cyan, marginLeft: 6 }} />
    </div>
  </AbsoluteFill>
);

/** codewired #2 thumbnail — violet cage + gold MCP beam. */
export const CodewiredMcpThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 45%, #1B0F3E 0%, #07030F 75%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <rect x={700} y={160} width={380} height={380} rx={18} fill="rgba(124,108,255,0.06)" stroke="#7C6CFF" strokeWidth={3} style={{ filter: "drop-shadow(0 0 22px #7C6CFF)" }} />
      {Array.from({ length: 4 }, (_, i) => (
        <line key={i} x1={700 + (i + 1) * 76} y1={160} x2={700 + (i + 1) * 76} y2={540} stroke="#7C6CFF" strokeWidth={1.5} opacity={0.3} />
      ))}
      <circle cx={890} cy={350} r={70} fill="#7C6CFF" opacity={0.25} />
      <circle cx={890} cy={350} r={46} fill="#F2EFFF" style={{ filter: "drop-shadow(0 0 34px #7C6CFF)" }} />
      <rect x={1072} y={322} width={14} height={56} rx={6} fill="#FFC649" style={{ filter: "drop-shadow(0 0 24px #FFC649)" }} />
      <path d="M1086 326 L1250 240 L1250 460 L1086 374 Z" fill="#FFC649" opacity={0.18} />
    </svg>
    <div style={{ position: "absolute", left: 56, top: 118, width: 640 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 104, lineHeight: 1.02, color: CW.white, letterSpacing: "-0.02em", textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>
        YOUR AI IS<br />
        <span style={{ color: "#FFC649", textShadow: "0 0 50px rgba(255,198,73,0.5)" }}>TRAPPED</span>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, color: "#9D8CFF", marginTop: 18 }}>MCP SETS IT FREE</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: CW.dim }}>
      code<span style={{ color: CW.cyan }}>wired</span><span style={{ display: "inline-block", width: 18, height: 5, background: CW.cyan, marginLeft: 6 }} />
    </div>
  </AbsoluteFill>
);

export const CodewiredSubagentsThumb: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 68% 45%, ${CW.bg2} 0%, ${CW.bg} 75%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {/* spawn burst, right side */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const d = 150 + 90 * rng(i);
        const x = 900 + Math.cos(a) * d, y = 340 + Math.sin(a) * d * 0.72;
        return (
          <g key={i}>
            <line x1={900} y1={340} x2={x} y2={y} stroke={CW.cyan} strokeWidth={2.5} opacity={0.4} />
            <circle cx={x} cy={y} r={26} fill={CW.cyan} opacity={0.22} />
            <circle cx={x} cy={y} r={15} fill={CW.cyan} style={{ filter: `drop-shadow(0 0 14px ${CW.cyan})` }} />
          </g>
        );
      })}
      <circle cx={900} cy={340} r={92} fill={CW.cyan} opacity={0.15} />
      <circle cx={900} cy={340} r={54} fill={CW.cyan} style={{ filter: `drop-shadow(0 0 40px ${CW.cyan})` }} />
      <circle cx={900} cy={340} r={120} fill="none" stroke={CW.cyan} strokeWidth={3} strokeDasharray="10 14" opacity={0.5} />
    </svg>
    <div style={{ position: "absolute", left: 56, top: 120, width: 620 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 1.02, color: CW.white, letterSpacing: "-0.02em", textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>
        YOUR AI<br />
        <span style={{ color: CW.cyan, textShadow: `0 0 50px ${CW.cyanDim}` }}>CLONES</span><br />
        ITSELF
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: CW.dim }}>
      code<span style={{ color: CW.cyan }}>wired</span><span style={{ display: "inline-block", width: 18, height: 5, background: CW.cyan, marginLeft: 6 }} />
    </div>
  </AbsoluteFill>
);
