/** codewired #1 — scene components. The channel's visual language:
 *  agent cores, context rings (fillable memory), tool glyphs, file panels.
 *  All DOM/SVG (no WebGL), deterministic per frame. */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CW } from "../Brand";
import { DISPLAY, SANS } from "../../lib/theme";

const MONO = "'SF Mono', 'Menlo', 'Consolas', monospace";
const W = 1920, H = 1080, CX = W / 2, CY = H / 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

type SceneProps = { narrationStart: number; durationInFrames: number };

/* ── shared primitives ─────────────────────────────────────────────── */

/** Deterministic pseudo-random from an integer seed. */
const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Backdrop: React.FC<{ dim?: number }> = ({ dim = 1 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, ${CW.bg2} 0%, ${CW.bg} 72%)` }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.5 * dim }}>
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

/** An agent core: glowing nucleus + faint orbit shells. */
const Core: React.FC<{ x: number; y: number; r: number; color?: string; label?: string; frame: number; dimmed?: boolean }> =
  ({ x, y, r, color = CW.cyan, label, frame, dimmed }) => {
    const pulse = 1 + 0.05 * Math.sin(frame / 9 + x);
    const op = dimmed ? 0.35 : 1;
    return (
      <g opacity={op}>
        <circle cx={x} cy={y} r={r * 1.7} fill="none" stroke={color} strokeWidth={1.4} opacity={0.22} />
        <circle cx={x} cy={y} r={r * 1.35} fill="none" stroke={color} strokeWidth={1.4} opacity={0.3}
          strokeDasharray="6 10" transform={`rotate(${frame * 0.7} ${x} ${y})`} />
        <circle cx={x} cy={y} r={r * pulse} fill={color} opacity={0.16} />
        <circle cx={x} cy={y} r={r * 0.62 * pulse} fill={color} opacity={0.9}
          style={{ filter: `drop-shadow(0 0 ${r * 0.7}px ${color})` }} />
        {label && (
          <text x={x} y={y + r * 2.35} textAnchor="middle" fill={CW.dim}
            style={{ font: `600 26px ${SANS}`, letterSpacing: "0.12em" }}>{label}</text>
        )}
      </g>
    );
  };

/** Fillable context ring — the channel's signature metaphor. fill 0..1. */
const ContextRing: React.FC<{ x: number; y: number; R: number; fill: number; frame: number; label?: string }> =
  ({ x, y, R, fill, frame, label }) => {
    const circ = 2 * Math.PI * R;
    // cyan → amber → red as it fills
    const color = fill < 0.55 ? CW.cyan : fill < 0.85 ? "#FFB347" : "#FF4D4D";
    return (
      <g>
        <circle cx={x} cy={y} r={R} fill="none" stroke="rgba(140,180,220,0.14)" strokeWidth={10} />
        <circle cx={x} cy={y} r={R} fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round" strokeDasharray={`${circ * clamp(fill)} ${circ}`}
          transform={`rotate(-90 ${x} ${y})`}
          style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
        {/* crumble: fragments fall off the ring tail once nearly full */}
        {fill > 0.82 && Array.from({ length: 7 }, (_, i) => {
          const t = ((frame + i * 11) % 40) / 40;
          const a = -Math.PI / 2 + 2 * Math.PI * clamp(fill) + 0.15 * i;
          const fx = x + Math.cos(a) * R, fy = y + Math.sin(a) * R + t * 130;
          return <rect key={i} x={fx} y={fy} width={9} height={9} fill="#FF4D4D" opacity={(1 - t) * 0.8}
            transform={`rotate(${t * 160} ${fx} ${fy})`} />;
        })}
        {label && (
          <text x={x} y={y - R - 26} textAnchor="middle" fill={CW.dim}
            style={{ font: `600 24px ${SANS}`, letterSpacing: "0.14em" }}>{label}</text>
        )}
      </g>
    );
  };

/** Small file-fragment rect used for fly-ins. */
const flyIn = (frame: number, start: number, dur: number, fromX: number, fromY: number, toX: number, toY: number) => {
  const t = clamp((frame - start) / dur);
  const e = 1 - Math.pow(1 - t, 3);
  return { x: fromX + (toX - fromX) * e, y: fromY + (toY - fromY) * e, t };
};

const FilePanel: React.FC<{ x: number; y: number; w: number; h: number; lines?: number; frame: number; broken?: number; title?: string }> =
  ({ x, y, w, h, lines = 6, frame, broken = 0, title }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0A1626" stroke={broken > 0 ? "#FF4D4D" : CW.cyanDim}
        strokeWidth={2} style={broken > 0 ? { filter: "drop-shadow(0 0 16px rgba(255,77,77,0.6))" } : undefined} />
      {title && <text x={x + 18} y={y + 34} fill={CW.dim} style={{ font: `600 20px ${MONO}` }}>{title}</text>}
      {Array.from({ length: lines }, (_, i) => (
        <rect key={i} x={x + 18} y={y + (title ? 52 : 24) + i * 26} height={10} rx={5}
          width={(w - 60) * (0.35 + 0.6 * rng(i + x))}
          fill={i % 3 === 0 ? CW.cyanDim : "rgba(160,200,240,0.22)"} />
      ))}
      {broken > 0 && (
        <path d={`M${x + w * 0.5} ${y} l-26 ${h * 0.3} l38 ${h * 0.22} l-30 ${h * 0.48}`}
          stroke="#FF4D4D" strokeWidth={4 * broken} fill="none"
          style={{ filter: "drop-shadow(0 0 10px #FF4D4D)" }} />
      )}
    </g>
  );

/** Chapter card overlay (kicker + big title) shown during a scene's beat. */
export const ChapterCard: React.FC<{ chapter: string; title: string; beatFrames: number }> = ({ chapter, title, beatFrames }) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [beatFrames - 14, beatFrames - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [0, 14], [26, 0], { extrapolateRight: "clamp" });
  if (frame > beatFrames) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inO * out, background: "rgba(3,7,16,0.72)" }}>
      <div style={{ transform: `translateY(${rise}px)`, textAlign: "center" }}>
        <div style={{ font: `700 30px ${SANS}`, color: CW.cyan, letterSpacing: "0.42em", marginBottom: 26 }}>{chapter}</div>
        <div style={{ font: `700 118px ${DISPLAY}`, color: CW.white, letterSpacing: "-0.02em", lineHeight: 1.04, whiteSpace: "pre-line" }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Lower-third cap: one punchy phrase, appears with the narration. */
const Cap: React.FC<{ text: string; from: number; frame: number; accent?: string }> = ({ text, from, frame, accent = CW.cyan }) => {
  const o = interpolate(frame, [from, from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 84, width: "100%", textAlign: "center", opacity: o }}>
      <span style={{ font: `700 46px ${DISPLAY}`, color: CW.white, background: "rgba(5,10,20,0.82)", padding: "14px 34px", borderRadius: 14, border: `1px solid ${CW.cyanDim}` }}>
        {text.split("*").map((part, i) => i % 2 ? <span key={i} style={{ color: accent }}>{part}</span> : part)}
      </span>
    </div>
  );
};

const svgFill: React.CSSProperties = { position: "absolute", inset: 0 };

/* ── scenes ────────────────────────────────────────────────────────── */

export const HookScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const burst = narrationStart + 45; // "…clone itself"
  const zoom = interpolate(frame, [0, durationInFrames], [1.22, 1.0]);
  const redAt = narrationStart + Math.round(0.72 * (durationInFrames - narrationStart)); // "…one mistake"
  const red = interpolate(frame, [redAt, redAt + 8, redAt + 30], [0, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ ...svgFill, transform: `scale(${zoom})` }}>
        <svg width={W} height={H} style={svgFill}>
          <Core x={CX} y={CY} r={64} frame={frame} />
          {Array.from({ length: 10 }, (_, i) => {
            const t = clamp((frame - burst - i * 2) / 26);
            if (t <= 0) return null;
            const e = 1 - Math.pow(1 - t, 3);
            const a = (i / 10) * Math.PI * 2 + frame * 0.004;
            const dist = 150 + 260 * e + 40 * rng(i);
            const x = CX + Math.cos(a) * dist, y = CY + Math.sin(a) * dist * 0.62;
            return (
              <g key={i}>
                <line x1={CX} y1={CY} x2={x} y2={y} stroke={CW.cyan} strokeWidth={1.5} opacity={0.25 * e} />
                <Core x={x} y={y} r={26} frame={frame + i * 5} color={red > 0.1 && i % 3 === 0 ? "#FF4D4D" : CW.cyan} />
              </g>
            );
          })}
        </svg>
      </div>
      <AbsoluteFill style={{ background: "#FF2222", opacity: red * 0.18 }} />
      <Cap text="your AI can *clone itself*" from={burst} frame={frame} />
    </AbsoluteFill>
  );
};

export const IntroScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const s = interpolate(frame, [0, 60], [0.94, 1.0]);
  const cursor = Math.floor(frame / 14) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop dim={0.7} />
      <div style={{ opacity: o, transform: `scale(${s})`, display: "flex", alignItems: "baseline", letterSpacing: "-0.03em" }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, color: CW.white }}>code</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, color: CW.cyan, textShadow: `0 0 70px ${CW.cyanDim}` }}>wired</span>
        <span style={{ width: 74, height: 15, background: CW.cyan, marginLeft: 20, alignSelf: "flex-end", marginBottom: 15, boxShadow: `0 0 22px ${CW.cyan}`, opacity: cursor ? 1 : 0.15 }} />
      </div>
    </AbsoluteFill>
  );
};

export const TitleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop dim={0.7} />
      <div style={{ opacity: o, textAlign: "center" }}>
        <div style={{ font: `700 172px ${DISPLAY}`, color: CW.white, letterSpacing: "-0.02em" }}>
          SUB<span style={{ color: CW.cyan, textShadow: `0 0 80px ${CW.cyanDim}` }}>AGENTS</span>
        </div>
        <div style={{ font: `500 44px ${SANS}`, color: CW.dim, marginTop: 18, letterSpacing: "0.28em" }}>FINALLY EXPLAINED</div>
      </div>
    </AbsoluteFill>
  );
};

export const ProblemScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const nEnd = durationInFrames - 36;
  const fill = interpolate(frame, [narrationStart + 60, nEnd], [0.06, 0.97], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <ContextRing x={CX} y={CY} R={250} fill={fill} frame={frame} label="CONTEXT WINDOW" />
        <Core x={CX} y={CY} r={58} frame={frame} />
        {Array.from({ length: 14 }, (_, i) => {
          const start = narrationStart + 55 + i * 16;
          const a = rng(i * 3) * Math.PI * 2;
          const p = flyIn(frame, start, 30, CX + Math.cos(a) * 1100, CY + Math.sin(a) * 640, CX + Math.cos(a) * 250, CY + Math.sin(a) * 250);
          if (p.t <= 0 || p.t >= 1) return null;
          return <rect key={i} x={p.x} y={p.y} width={16} height={20} rx={3} fill={CW.cyan} opacity={0.8} />;
        })}
      </svg>
      <Cap text="every file it reads *fills the ring*" from={narrationStart + 90} frame={frame} />
    </AbsoluteFill>
  );
};

export const DelegateScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const spawnAt = narrationStart + Math.round((durationInFrames - narrationStart) * 0.45); // "…spawns a subagent"
  const t = clamp((frame - spawnAt) / 30);
  const e = 1 - Math.pow(1 - t, 3);
  const childX = CX + 430 * e;
  const mote = clamp((frame - spawnAt - 34) / 26);
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <ContextRing x={CX - 430} y={CY} R={190} fill={0.8} frame={frame} label="PARENT" />
        <Core x={CX - 430} y={CY} r={48} frame={frame} />
        {t > 0 && (
          <g opacity={e}>
            <line x1={CX - 430} y1={CY} x2={childX} y2={CY} stroke={CW.cyan} strokeWidth={2} opacity={0.4} strokeDasharray="8 8" />
            <ContextRing x={childX} y={CY} R={150} fill={0.03} frame={frame} label="SUBAGENT · FRESH" />
            <Core x={childX} y={CY} r={38} frame={frame} color={CW.teal ?? CW.cyan} />
          </g>
        )}
        {mote > 0 && mote < 1 && (
          <g>
            <circle cx={CX - 430 + (childX - (CX - 430)) * mote} cy={CY - 40} r={11} fill={CW.cyan}
              style={{ filter: `drop-shadow(0 0 16px ${CW.cyan})` }} />
            <text x={CX} y={CY - 76} textAnchor="middle" fill={CW.cyan} style={{ font: `700 24px ${MONO}` }}>ONE JOB</text>
          </g>
        )}
      </svg>
      <Cap text="a *fresh* copy, an *empty* memory" from={spawnAt + 20} frame={frame} />
    </AbsoluteFill>
  );
};

export const WorkScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const returnAt = narrationStart + Math.round((durationInFrames - narrationStart) * 0.62);
  const mote = clamp((frame - returnAt) / 40);
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <Core x={330} y={CY} r={34} frame={frame} label="PARENT" dimmed />
        <ContextRing x={CX + 220} y={CY} R={210} fill={interpolate(frame, [narrationStart, returnAt], [0.05, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} frame={frame} label="SUBAGENT" />
        <Core x={CX + 220} y={CY} r={50} frame={frame} />
        {Array.from({ length: 20 }, (_, i) => {
          const start = narrationStart + 8 + i * 5;
          const a = rng(i * 13) * Math.PI * 2;
          const p = flyIn(frame, start, 24, CX + 220 + Math.cos(a) * 1000, CY + Math.sin(a) * 620, CX + 220 + Math.cos(a) * 205, CY + Math.sin(a) * 205);
          if (p.t <= 0 || p.t >= 1) return null;
          return <rect key={i} x={p.x} y={p.y} width={15} height={19} rx={3} fill={CW.cyan} opacity={0.75} />;
        })}
        {mote > 0 && (
          <g>
            <circle cx={CX + 220 - (CX + 220 - 330) * Math.min(mote, 1)} cy={CY - 30} r={13} fill="#7CFFB2"
              style={{ filter: "drop-shadow(0 0 18px #7CFFB2)" }} />
            <text x={CX - 40} y={CY - 74} textAnchor="middle" fill="#7CFFB2" style={{ font: `700 26px ${MONO}` }}>1 CLEAN REPORT</text>
          </g>
        )}
      </svg>
      <Cap text="twenty files in — *one conclusion* out" from={returnAt} frame={frame} accent="#7CFFB2" />
    </AbsoluteFill>
  );
};

export const MemoryScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <ContextRing x={CX - 420} y={CY - 30} R={215} fill={0.14} frame={frame} label="WITH SUBAGENTS" />
        <Core x={CX - 420} y={CY - 30} r={50} frame={frame} />
        <g opacity={0.65}>
          <ContextRing x={CX + 420} y={CY - 30} R={215} fill={0.96} frame={frame} label="WITHOUT" />
          <Core x={CX + 420} y={CY - 30} r={50} frame={frame} color="#FFB347" />
        </g>
      </svg>
      <Cap text="not speed. *memory.*" from={narrationStart + 45} frame={frame} />
    </AbsoluteFill>
  );
};

export const AnatomyScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const lines = ["---", "name: reviewer", "description: reviews every", "  change before it ships", "tools: Read, Grep", "---"];
  const shown = Math.floor(clamp((frame - narrationStart - 20) / 90) * lines.length + 0.001);
  const lockAt = narrationStart + Math.round((durationInFrames - narrationStart) * 0.68); // "take the editing hand away"
  const glyphs = [
    { l: "READ", locked: false }, { l: "GREP", locked: false },
    { l: "EDIT", locked: true }, { l: "BASH", locked: true },
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <rect x={200} y={CY - 250} width={640} height={500} rx={16} fill="#0A1626" stroke={CW.cyanDim} strokeWidth={2} />
        <text x={232} y={CY - 200} fill={CW.dim} style={{ font: `600 26px ${MONO}` }}>.claude/agents/reviewer.md</text>
        {lines.slice(0, shown).map((ln, i) => (
          <text key={i} x={232} y={CY - 140 + i * 52} fill={i === 4 ? CW.cyan : CW.white} style={{ font: `500 32px ${MONO}` }}>{ln}</text>
        ))}
        <Core x={CX + 470} y={CY} r={54} frame={frame} label="REVIEWER" />
        {glyphs.map((g, i) => {
          const a = (i / glyphs.length) * Math.PI * 2 + frame * 0.012;
          const x = CX + 470 + Math.cos(a) * 220, y = CY + Math.sin(a) * 190;
          const locked = g.locked && frame > lockAt;
          const col = locked ? "rgba(150,160,180,0.5)" : CW.cyan;
          return (
            <g key={g.l}>
              <line x1={CX + 470} y1={CY} x2={x} y2={y} stroke={col} strokeWidth={1.5} opacity={0.35} />
              <circle cx={x} cy={y} r={44} fill="#0A1626" stroke={col} strokeWidth={2.5}
                style={locked ? undefined : { filter: `drop-shadow(0 0 10px ${CW.cyan})` }} />
              <text x={x} y={y + 8} textAnchor="middle" fill={col} style={{ font: `700 22px ${MONO}` }}>{locked ? "🔒" : g.l}</text>
              {locked && <text x={x} y={y + 66} textAnchor="middle" fill="rgba(150,160,180,0.6)" style={{ font: `600 18px ${MONO}` }}>{g.l}</text>}
            </g>
          );
        })}
      </svg>
      <Cap text="tools are the agent's *hands*" from={narrationStart + 150} frame={frame} />
    </AbsoluteFill>
  );
};

export const TeamScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const roles = ["RESEARCHER", "CODER", "REVIEWER", "TESTER"];
  const nEnd = durationInFrames - 30;
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <Core x={CX} y={CY} r={52} frame={frame} label="LEAD" />
        {roles.map((role, i) => {
          const appear = narrationStart + 12 + i * 22;
          const t = clamp((frame - appear) / 22);
          if (t <= 0) return null;
          const e = 1 - Math.pow(1 - t, 3);
          const a = (i / roles.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.0045;
          const x = CX + Math.cos(a) * 470 * e, y = CY + Math.sin(a) * 300 * e;
          const fill = interpolate(frame, [appear + 26, nEnd], [0.05, 0.4 + 0.4 * rng(i)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const motePhase = ((frame - appear) % 70) / 70;
          return (
            <g key={role} opacity={e}>
              <line x1={CX} y1={CY} x2={x} y2={y} stroke={CW.cyan} strokeWidth={1.5} opacity={0.28} />
              <ContextRing x={x} y={y} R={104} fill={fill} frame={frame} />
              <Core x={x} y={y} r={30} frame={frame + i * 9} label={role} />
              {frame > appear + 40 && motePhase < 1 && (
                <circle cx={x + (CX - x) * motePhase} cy={y + (CY - y) * motePhase} r={7} fill="#7CFFB2" opacity={0.9} />
              )}
            </g>
          );
        })}
      </svg>
      <Cap text="all of them run *at the same time*" from={narrationStart + 140} frame={frame} />
    </AbsoluteFill>
  );
};

export const CostScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = clamp((frame - narrationStart) / (durationInFrames - narrationStart - 20));
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        {Array.from({ length: 5 }, (_, i) => {
          const y = 300 + i * 120;
          const w = (420 + 480 * rng(i * 5)) * p;
          return (
            <g key={i}>
              <Core x={360} y={y} r={22} frame={frame + i * 7} />
              <rect x={430} y={y - 15} width={w} height={30} rx={15} fill={CW.cyan} opacity={0.3 + 0.1 * i} />
              <text x={445 + w} y={y + 9} fill={CW.dim} style={{ font: `700 26px ${MONO}` }}>
                {Math.round((14 + 20 * rng(i * 9)) * p)}k tokens
              </text>
            </g>
          );
        })}
      </svg>
      <Cap text="a swarm *isn't free*" from={narrationStart + 30} frame={frame} accent="#FFB347" />
    </AbsoluteFill>
  );
};

export const MistakeScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const hitAt = narrationStart + Math.round((durationInFrames - narrationStart) * 0.28); // "…same file"
  const broken = clamp((frame - hitAt) / 16);
  const flash = interpolate(frame, [hitAt, hitAt + 6, hitAt + 26], [0, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beam = (from: number) => clamp((frame - from) / 18);
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        <Core x={280} y={CY - 160} r={40} frame={frame} label="CLONE A" />
        <Core x={280} y={CY + 200} r={40} frame={frame + 30} label="CLONE B" />
        <FilePanel x={CX - 60} y={CY - 190} w={520} h={380} lines={9} frame={frame} broken={broken} title="src/auth.ts" />
        {beam(hitAt - 18) > 0 && <line x1={320} y1={CY - 160} x2={CX - 60 + 520 * 0.3} y2={CY - 60} stroke={CW.cyan} strokeWidth={5} opacity={0.8 * (1 - broken)} />}
        {beam(hitAt - 10) > 0 && <line x1={320} y1={CY + 200} x2={CX - 60 + 520 * 0.3} y2={CY + 60} stroke={CW.cyan} strokeWidth={5} opacity={0.8 * (1 - broken)} />}
        {broken > 0.6 && (
          <text x={CX + 200} y={CY + 260} textAnchor="middle" fill="#FF4D4D"
            style={{ font: `700 44px ${MONO}`, filter: "drop-shadow(0 0 14px #FF4D4D)" }}
            transform={`rotate(-6 ${CX + 200} ${CY + 260})`}>MERGE CONFLICT</text>
        )}
      </svg>
      <AbsoluteFill style={{ background: "#FF2222", opacity: flash * 0.2 }} />
      <Cap text="clones are *blind to each other*" from={hitAt + 30} frame={frame} accent="#FF4D4D" />
    </AbsoluteFill>
  );
};

export const RuleScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [narrationStart, narrationStart + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={svgFill}>
        {/* left: 3 clones → 3 files, green */}
        {Array.from({ length: 3 }, (_, i) => {
          const y = 330 + i * 190;
          return (
            <g key={i} opacity={o}>
              <Core x={330} y={y} r={26} frame={frame + i * 6} />
              <line x1={370} y1={y} x2={520} y2={y} stroke="#7CFFB2" strokeWidth={2.5} opacity={0.6} />
              <FilePanel x={520} y={y - 55} w={220} h={110} lines={3} frame={frame} />
              <text x={775} y={y + 10} fill="#7CFFB2" style={{ font: `700 34px ${MONO}` }}>✓</text>
            </g>
          );
        })}
        {/* right: 2 clones → 1 file, red */}
        <g opacity={o}>
          <Core x={1210} y={400} r={26} frame={frame} />
          <Core x={1210} y={700} r={26} frame={frame + 12} />
          <line x1={1250} y1={400} x2={1390} y2={520} stroke="#FF4D4D" strokeWidth={2.5} opacity={0.7} />
          <line x1={1250} y1={700} x2={1390} y2={580} stroke="#FF4D4D" strokeWidth={2.5} opacity={0.7} />
          <FilePanel x={1390} y={470} w={240} h={140} lines={3} frame={frame} broken={0.7} />
          <text x={1680} y={560} fill="#FF4D4D" style={{ font: `700 34px ${MONO}` }}>✕</text>
        </g>
      </svg>
      <Cap text="fan out on *isolated* work" from={narrationStart + 20} frame={frame} accent="#7CFFB2" />
    </AbsoluteFill>
  );
};

export const OutroScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const words = ["DELEGATION", "FRESH MEMORY", "TOOLS AS HANDS", "PERMISSIONS AS TRUST"];
  const span = durationInFrames - narrationStart;
  return (
    <AbsoluteFill>
      <Backdrop />
      <svg width={W} height={H} style={{ ...svgFill, opacity: 0.55 }}>
        <Core x={CX} y={CY + 60} r={44} frame={frame} />
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * Math.PI * 2 + frame * 0.004;
          return <Core key={i} x={CX + Math.cos(a) * 360} y={CY + 60 + Math.sin(a) * 220} r={20} frame={frame + i * 8} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 130, width: "100%", display: "flex", justifyContent: "center", gap: 34 }}>
        {words.map((w, i) => {
          const at = narrationStart + Math.round(span * 0.05) + i * 26;
          const ow = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={w} style={{ font: `700 30px ${DISPLAY}`, color: CW.cyan, border: `1.5px solid ${CW.cyanDim}`, borderRadius: 12, padding: "12px 22px", opacity: ow, background: "rgba(5,10,20,0.7)" }}>{w}</span>
          );
        })}
      </div>
      <Cap text="next: *MCP* — how agents reach the outside world" from={narrationStart + Math.round(span * 0.6)} frame={frame} />
    </AbsoluteFill>
  );
};

/** The codewired standing subscribe outro — code-rendered, $0, bakes in-pass. */
export const SubscribeScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const clickAt = Math.round(durationInFrames * 0.5);
  const pressed = frame > clickAt;
  const pop = interpolate(frame, [clickAt, clickAt + 5, clickAt + 12], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursor = Math.floor(frame / 14) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
      <Backdrop dim={0.7} />
      <div style={{ opacity: o, position: "relative", zIndex: 2, transform: "scale(1)", display: "flex", alignItems: "baseline", letterSpacing: "-0.03em" }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 110, color: CW.white }}>code</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 110, color: CW.cyan, textShadow: `0 0 60px ${CW.cyanDim}` }}>wired</span>
        <span style={{ width: 54, height: 11, background: CW.cyan, marginLeft: 16, alignSelf: "flex-end", marginBottom: 11, opacity: cursor ? 1 : 0.15 }} />
      </div>
      <div style={{ opacity: o, transform: `scale(${pop})`, font: `700 54px ${SANS}`, color: pressed ? CW.bg : CW.white, background: pressed ? CW.cyan : "rgba(0,229,255,0.12)", border: `3px solid ${CW.cyan}`, borderRadius: 20, padding: "22px 74px", boxShadow: pressed ? `0 0 60px ${CW.cyan}` : "none" }}>
        {pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
      </div>
      <div style={{ opacity: o * 0.85, font: `500 34px ${SANS}`, color: CW.dim, letterSpacing: "0.12em" }}>get wired in_</div>
    </AbsoluteFill>
  );
};
