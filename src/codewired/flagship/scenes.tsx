/** codewired #4 FLAGSHIP scenes — the assembly hangar. A skeleton agent on a
 *  workbench gets its parts installed episode by episode: heartbeat (loop),
 *  hands (tools), gate (permissions), memory (context), then the SDK crate,
 *  our real ~50-line agent "wired", the REAL demo-run transcript, the series
 *  upgrades, and the reveal. Uses the shared fx kit; every scene owns a
 *  distinct color world; no center hotspots. */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CW } from "../Brand";
import { DISPLAY, SANS } from "../../lib/theme";
import { Stage, Cap, Node, MONO, W, H, CX, CY, clamp, rng, svgFill } from "../lib/fx";
export { ChapterCard } from "../lib/fx";

type SceneProps = { narrationStart: number; durationInFrames: number };
const STEEL = "#8AB8D8", WORK = "#FFB84D", GOLD = "#FFC649", HEART = "#FF6B8A",
  GREEN = "#5CD68A", VIOLET = "#9D8CFF", MAG = "#FF5CD0", TEAL = "#4AD8C8";

/* ── hangar furniture ─────────────────────────────────────────────── */

/** The workbench + skeleton core. stage 0=wireframe, adds: 1 heart, 2 tools,
 *  3 gate, 4 memory ring, 5 sdk polish, 6 upgrades (minis+port+book). */
const Skeleton: React.FC<{ x?: number; y?: number; s?: number; stage: number; frame: number }> =
  ({ x = CX, y = CY + 90, s = 1, stage, frame }) => {
    const pulse = stage >= 1 ? 1 + 0.06 * Math.sin(frame / 7) : 1;
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* bench */}
        <rect x={-330} y={150} width={660} height={20} rx={8} fill="#2A2118" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7))" }} />
        <rect x={-290} y={170} width={26} height={90} fill="#1E1810" />
        <rect x={264} y={170} width={26} height={90} fill="#1E1810" />
        {/* memory ring */}
        {stage >= 4 && (
          <circle cx={0} cy={0} r={132} fill="none" stroke={TEAL} strokeWidth={7}
            strokeDasharray={`${2 * Math.PI * 132 * 0.35} ${2 * Math.PI * 132}`}
            transform={`rotate(${-90 + frame * 0.4})`} style={{ filter: `drop-shadow(0 0 12px ${TEAL})` }} />
        )}
        {/* core */}
        <circle cx={0} cy={0} r={64 * pulse} fill={stage >= 5 ? "#F2EFFF" : "none"}
          stroke={stage >= 5 ? "none" : STEEL} strokeWidth={2.5}
          strokeDasharray={stage >= 1 ? "none" : "8 8"}
          opacity={stage >= 5 ? 0.95 : 0.9}
          style={stage >= 1 ? { filter: `drop-shadow(0 0 ${stage >= 5 ? 40 : 18}px ${stage >= 5 ? VIOLET : HEART})` } : undefined} />
        {stage >= 1 && stage < 5 && (
          <circle cx={0} cy={0} r={30 * pulse} fill={HEART} opacity={0.9} style={{ filter: `drop-shadow(0 0 20px ${HEART})` }} />
        )}
        {/* tool glyphs */}
        {stage >= 2 && ["READ", "EDIT", "BASH", "GLOB"].map((t, i) => {
          const a = (i / 4) * Math.PI * 2 + frame * 0.008;
          const tx = Math.cos(a) * 205, ty = Math.sin(a) * 118;
          return (
            <g key={t}>
              <line x1={0} y1={0} x2={tx} y2={ty} stroke={GOLD} strokeWidth={1.4} opacity={0.35} />
              <circle cx={tx} cy={ty} r={30} fill="#141008" stroke={GOLD} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${GOLD}88)` }} />
              <text x={tx} y={ty + 7} textAnchor="middle" fill={GOLD} style={{ font: `700 15px ${MONO}` }}>{t}</text>
            </g>
          );
        })}
        {/* gate shield */}
        {stage >= 3 && (
          <g transform="translate(0 -196)">
            <path d="M0 -34 L30 -20 V10 Q30 34 0 44 Q-30 34 -30 10 V-20 Z" fill="rgba(92,214,138,0.12)"
              stroke={GREEN} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 12px ${GREEN})` }} />
            <text x={0} y={12} textAnchor="middle" fill={GREEN} style={{ font: `700 17px ${MONO}` }}>✓</text>
          </g>
        )}
        {/* upgrades */}
        {stage >= 6 && (
          <g>
            {[0, 1].map(i => (
              <circle key={i} cx={Math.cos(frame * 0.01 + i * Math.PI) * 290} cy={Math.sin(frame * 0.01 + i * Math.PI) * 150 - 30}
                r={16} fill="#36D4FF" opacity={0.9} style={{ filter: "drop-shadow(0 0 12px #36D4FF)" }} />
            ))}
            <rect x={250} y={-30} width={16} height={60} rx={7} fill={GOLD} style={{ filter: `drop-shadow(0 0 14px ${GOLD})` }} />
            <rect x={-300} y={-58} width={54} height={92} rx={6} fill="rgba(92,214,138,0.2)" stroke={GREEN} strokeWidth={2} />
          </g>
        )}
      </g>
    );
  };

/** Terminal replay panel fed with timed lines (the REAL wired transcript). */
const Terminal: React.FC<{
  lines: { t: string; kind: "cmd" | "tool" | "out" | "ok" | "err"; at: number }[];
  frame: number; title: string; top?: number; height?: number;
}> = ({ lines, frame, title, top = CY - 330, height = 660 }) => {
  const colors = { cmd: "#F4F7FF", tool: GOLD, out: "rgba(220,230,250,0.75)", ok: "#7CFFB2", err: "#FF6B6B" } as const;
  return (
    <div style={{
      position: "absolute", left: CX - 700, top, width: 1400, height,
      background: "rgba(3,8,6,0.95)", border: "2px solid rgba(124,255,178,0.35)", borderRadius: 18,
      padding: "26px 42px", boxShadow: "0 0 70px rgba(124,255,178,0.12)", overflow: "hidden",
    }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
        <span style={{ fontFamily: MONO, fontSize: 20, color: "rgba(200,255,220,0.5)", marginLeft: 12 }}>{title}</span>
      </div>
      {lines.map((ln, i) => {
        const o = interpolate(frame, [ln.at, ln.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ fontFamily: MONO, fontSize: 27, lineHeight: 1.75, opacity: o, color: colors[ln.kind], whiteSpace: "pre-wrap" }}>{ln.t}</div>
        );
      })}
    </div>
  );
};

/* ── scenes ────────────────────────────────────────────────────────── */

export const HookScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const zoom = interpolate(frame, [0, durationInFrames], [1.18, 1.0]);
  const count = Math.round(interpolate(frame, [narrationStart, narrationStart + span * 0.16], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Stage bg={["#05080E", "#101C2A"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 500, y: 250, r: 420 }, { c: "#4A2E08", x: 1500, y: 850, r: 420 }]}>
      <div style={{ ...svgFill, transform: `scale(${zoom})` }}>
        <svg width={W} height={H} style={svgFill}>
          {/* work light cone from above */}
          <path d={`M${CX - 40} 0 L${CX - 320} ${CY + 240} L${CX + 320} ${CY + 240} L${CX + 40} 0 Z`} fill={WORK} opacity={0.07} />
          <Skeleton stage={0} frame={frame} />
          <text x={CX} y={220} textAnchor="middle" fill={WORK}
            style={{ font: `700 84px ${MONO}`, filter: `drop-shadow(0 0 26px ${WORK})` }}>
            ≈ {count} LINES
          </text>
        </svg>
      </div>
      <Cap text="the machine, not the model — *one hundred lines*" from={narrationStart + 60} frame={frame} accent={WORK} />
    </Stage>
  );
};

export const IntroScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const cursor = Math.floor(frame / 14) % 2 === 0;
  return (
    <Stage bg={["#050A14", "#0A1830"]} frame={frame}
      blobs={[{ c: "#0B3A5C", x: 700, y: 400, r: 460 }, { c: "#123", x: 1400, y: 700, r: 380 }]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: o, position: "relative", zIndex: 2, display: "flex", alignItems: "baseline", letterSpacing: "-0.03em" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, color: CW.white }}>code</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, color: CW.cyan, textShadow: `0 0 70px ${CW.cyanDim}` }}>wired</span>
          <span style={{ width: 74, height: 15, background: CW.cyan, marginLeft: 20, alignSelf: "flex-end", marginBottom: 15, boxShadow: `0 0 22px ${CW.cyan}`, opacity: cursor ? 1 : 0.15 }} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

export const TitleScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Stage bg={["#06090F", "#141E2C"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 600, y: 700, r: 440 }, { c: "#4A2E08", x: 1450, y: 300, r: 400 }]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: o, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: WORK, letterSpacing: "0.4em", marginBottom: 24 }}>THE FLAGSHIP BUILD</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 138, color: "#F4F7FF", letterSpacing: "-0.02em", lineHeight: 1.04 }}>
            BUILD YOUR OWN<br /><span style={{ color: WORK, textShadow: `0 0 80px ${WORK}66` }}>CLAUDE CODE</span>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

export const MapScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  const parts: [string, string][] = [["LOOP", HEART], ["TOOLS", GOLD], ["GATE", GREEN], ["MEMORY", TEAL]];
  const crates: [string, string][] = [["SUBAGENTS", "#36D4FF"], ["MCP", GOLD], ["SKILLS", GREEN]];
  return (
    <Stage bg={["#05080E", "#101C2A"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 400, y: 300, r: 400 }, { c: "#4A2E08", x: 1550, y: 800, r: 400 }]}>
      <svg width={W} height={H} style={svgFill}>
        <Skeleton stage={0} frame={frame} s={0.86} y={CY + 170} />
      </svg>
      <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center", gap: 30 }}>
        {parts.map(([p, c], i) => {
          const at = narrationStart + 40 + i * 32;
          const o = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={p} style={{ opacity: o, width: 250, height: 130, border: `2.5px dashed ${c}88`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(4,8,14,0.6)" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: c, textShadow: `0 0 24px ${c}` }}>{p}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 270, width: "100%", display: "flex", justifyContent: "center", gap: 24 }}>
        {crates.map(([p, c], i) => {
          const at = narrationStart + 200 + i * 22;
          const o = interpolate(frame, [at, at + 12], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={p} style={{ opacity: o, padding: "10px 24px", border: `2px solid ${c}66`, borderRadius: 12, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: c, background: "rgba(4,8,14,0.6)" }}>
              ▣ {p}
            </div>
          );
        })}
      </div>
      <Cap text="install them *one by one* — then switch it on" from={narrationStart + 260} frame={frame} accent={WORK} />
    </Stage>
  );
};

export const Loop1Scene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const cycle = ((frame - narrationStart) % 90) / 90;
  const px = CX - 380 + 760 * (cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2);
  const outbound = cycle < 0.5;
  return (
    <Stage bg={["#0E060A", "#241018"]} frame={frame}
      blobs={[{ c: "#5C1E30", x: 1400, y: 350, r: 460 }, { c: "#2A0A14", x: 450, y: 800, r: 420 }]}>
      <svg width={W} height={H} style={svgFill}>
        <Node x={CX - 420} y={CY - 30} r={56} c={HEART} label="YOUR HARNESS" frame={frame} />
        <Node x={CX + 420} y={CY - 30} r={56} c="#F2EFFF" label="THE MODEL" frame={frame + 12} />
        <line x1={CX - 360} y1={CY - 30} x2={CX + 360} y2={CY - 30} stroke="rgba(255,107,138,0.3)" strokeWidth={3} />
        {frame > narrationStart && (
          <g>
            <circle cx={px} cy={CY - 62} r={13} fill={outbound ? HEART : GOLD} style={{ filter: `drop-shadow(0 0 18px ${outbound ? HEART : GOLD})` }} />
            <text x={px} y={CY - 96} textAnchor="middle" fill={outbound ? HEART : GOLD} style={{ font: `700 21px ${MONO}` }}>
              {outbound ? "prompt + tools" : "answer | tool request"}
            </text>
          </g>
        )}
        {/* heartbeat trace */}
        <path d={`M${CX - 500} ${CY + 250} h300 l24 -56 l30 112 l24 -56 h420 l24 -56 l30 112 l24 -56 h140`}
          fill="none" stroke={HEART} strokeWidth={3.5} opacity={0.7}
          strokeDasharray="1600" strokeDashoffset={1600 - ((frame - narrationStart) * 9) % 1600}
          style={{ filter: `drop-shadow(0 0 10px ${HEART})` }} />
      </svg>
      <Cap text="answer, or request — *again and again*" from={narrationStart + Math.round(span * 0.45)} frame={frame} accent={HEART} />
    </Stage>
  );
};

export const Loop2Scene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const code: [string, string][] = [
    ["while True:", "#F4F7FF"],
    ["    reply = client.messages.create(", "rgba(230,238,255,0.85)"],
    ["        model=MODEL, messages=history, tools=TOOLS)", "rgba(230,238,255,0.85)"],
    ["    if reply.stop_reason == \"tool_use\":", HEART],
    ["        result = run_tool(reply)          # your code acts", GOLD],
    ["        history.append(tool_result(result))", "rgba(230,238,255,0.85)"],
    ["    else:", HEART],
    ["        break                             # the agent is done", "rgba(230,238,255,0.85)"],
  ];
  const shown = Math.floor(clamp((frame - narrationStart - 10) / (durationInFrames - narrationStart - 80)) * code.length + 0.001);
  return (
    <Stage bg={["#0A060E", "#1A1024"]} frame={frame}
      blobs={[{ c: "#3A1E52", x: 1350, y: 400, r: 460 }, { c: "#2A0A24", x: 450, y: 800, r: 400 }]}>
      <div style={{ position: "absolute", left: CX - 660, top: CY - 280, width: 1320, background: "rgba(6,4,12,0.95)", border: `2px solid ${HEART}55`, borderRadius: 18, padding: "30px 46px", boxShadow: `0 0 60px ${HEART}22` }}>
        <div style={{ fontFamily: MONO, fontSize: 21, color: "rgba(255,180,200,0.55)", marginBottom: 20 }}>the entire heartbeat — real code</div>
        {code.slice(0, Math.max(shown, 1)).map(([t, c], i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.8, color: c, whiteSpace: "pre" }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 140, top: 140, padding: "12px 26px", border: `2px solid ${WORK}`, borderRadius: 14, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: WORK, boxShadow: `0 0 30px ${WORK}44`, transform: "rotate(4deg)" }}>
        ~80 lines, complete
      </div>
      <Cap text="one *while loop* — read it over coffee" from={narrationStart + 80} frame={frame} accent={HEART} />
    </Stage>
  );
};

export const ToolsScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const installAt = narrationStart + Math.round(span * 0.72);
  return (
    <Stage bg={["#0E0A02", "#241A06"]} frame={frame}
      blobs={[{ c: "#5C4208", x: 1350, y: 350, r: 460 }, { c: "#2A1A04", x: 450, y: 800, r: 420 }]}>
      <div style={{ position: "absolute", left: 170, top: CY - 260, width: 620, background: "rgba(14,10,2,0.95)", border: `2px solid ${GOLD}88`, borderRadius: 16, padding: "26px 36px", boxShadow: `0 0 50px ${GOLD}22` }}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: "rgba(255,220,150,0.55)", marginBottom: 16 }}>a tool is three pieces of text</div>
        <div style={{ fontFamily: MONO, fontSize: 28, lineHeight: 1.85, color: "#F4F7FF" }}>
          <span style={{ color: GOLD }}>name:</span> read_file<br />
          <span style={{ color: GOLD }}>description:</span> read a file's<br />  contents from disk<br />
          <span style={{ color: GOLD }}>input_schema:</span> {"{ path: string }"}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 22, color: "#FF9A9A", marginTop: 18 }}>the model never executes — it only ASKS</div>
      </div>
      <svg width={W} height={H} style={svgFill}>
        <Skeleton x={CX + 430} stage={frame > installAt ? 2 : 1} frame={frame} s={0.92} />
      </svg>
      <Cap text="you built its hands — *you decide what they hold*" from={narrationStart + Math.round(span * 0.5)} frame={frame} accent={GOLD} />
    </Stage>
  );
};

export const PermissionsScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  const reqs: [string, "ok" | "ask" | "no", number][] = [
    ["Read src/app.ts", "ok", 30], ["Edit src/app.ts", "ok", 95],
    ["Bash npm install", "ask", 160], ["Bash rm -rf /", "no", 235],
  ];
  return (
    <Stage bg={["#04100A", "#0A2416"]} frame={frame}
      blobs={[{ c: "#0A4A28", x: 1400, y: 400, r: 460 }, { c: "#0A2A14", x: 400, y: 800, r: 400 }]}>
      <svg width={W} height={H} style={svgFill}>
        <path d={`M${CX} ${CY - 210} L${CX + 90} ${CY - 168} V${CY - 80} Q${CX + 90} ${CY - 10} ${CX} ${CY + 20} Q${CX - 90} ${CY - 10} ${CX - 90} ${CY - 80} V${CY - 168} Z`}
          fill="rgba(92,214,138,0.1)" stroke={GREEN} strokeWidth={3.5} style={{ filter: `drop-shadow(0 0 26px ${GREEN})` }} />
        <text x={CX} y={CY - 84} textAnchor="middle" fill={GREEN} style={{ font: `700 30px ${SANS}`, letterSpacing: "0.2em" }}>GATE</text>
      </svg>
      {reqs.map(([t, verdict, at0], i) => {
        const at = narrationStart + at0;
        const p = clamp((frame - at) / 46);
        if (p <= 0) return null;
        const x = 180 + p * (verdict === "no" ? 430 : 1100);
        const col = verdict === "ok" ? GREEN : verdict === "ask" ? WORK : "#FF4D4D";
        const badge = verdict === "ok" ? "✓ allowed" : verdict === "ask" ? "? ask the human" : "✕ blocked";
        return (
          <div key={i} style={{ position: "absolute", left: x, top: CY + 56 + i * 76 }}>
            <span style={{ fontFamily: MONO, fontSize: 26, color: "#F4F7FF", background: "rgba(4,12,8,0.92)", border: `2px solid ${col}`, borderRadius: 12, padding: "10px 22px", boxShadow: `0 0 20px ${col}33` }}>
              {t} <span style={{ color: col, fontWeight: 700 }}>{p > 0.6 ? ` ${badge}` : ""}</span>
            </span>
          </div>
        );
      })}
      <Cap text="the model *requests* — the harness *decides*" from={narrationStart + 300} frame={frame} accent={GREEN} />
    </Stage>
  );
};

export const ContextScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const compactAt = narrationStart + Math.round(span * 0.62);
  const fill = interpolate(frame, [narrationStart, compactAt], [0.1, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const squeeze = clamp((frame - compactAt) / 30);
  const shownFill = squeeze > 0 ? 0.94 - squeeze * 0.66 : fill;
  const circ = 2 * Math.PI * 230;
  const ringCol = shownFill < 0.55 ? TEAL : shownFill < 0.85 ? WORK : "#FF4D4D";
  return (
    <Stage bg={["#03100E", "#0A2A26"]} frame={frame}
      blobs={[{ c: "#0A4A42", x: 1300, y: 400, r: 460 }, { c: "#083A4A", x: 450, y: 800, r: 400 }]}>
      <svg width={W} height={H} style={svgFill}>
        <circle cx={CX} cy={CY - 20} r={230} fill="none" stroke="rgba(140,200,220,0.15)" strokeWidth={11} />
        <circle cx={CX} cy={CY - 20} r={230} fill="none" stroke={ringCol} strokeWidth={11} strokeLinecap="round"
          strokeDasharray={`${circ * shownFill} ${circ}`} transform={`rotate(-90 ${CX} ${CY - 20})`}
          style={{ filter: `drop-shadow(0 0 16px ${ringCol})` }} />
        <Node x={CX} y={CY - 20} r={44} c="#F2EFFF" frame={frame} />
        {squeeze > 0 && (
          <g opacity={Math.min(1, squeeze * 2)}>
            <rect x={CX + 270} y={CY - 60} width={86} height={86} rx={14} fill="rgba(74,216,200,0.15)" stroke={TEAL} strokeWidth={2.5}
              style={{ filter: `drop-shadow(0 0 16px ${TEAL})` }} />
            <text x={CX + 313} y={CY - 24} textAnchor="middle" fill={TEAL} style={{ font: `700 17px ${MONO}` }}>summary</text>
            <text x={CX + 313} y={CY + 2} textAnchor="middle" fill={TEAL} style={{ font: `700 17px ${MONO}` }}>crystal</text>
          </g>
        )}
        <text x={CX} y={CY + 320} textAnchor="middle" fill={ringCol} style={{ font: `700 30px ${MONO}` }}>
          {squeeze > 0 ? "COMPACTED — keep working" : `CONTEXT ${Math.round(shownFill * 100)}%`}
        </text>
      </svg>
      <Cap text="watch the ring — *compact before it chokes*" from={compactAt} frame={frame} accent={TEAL} />
    </Stage>
  );
};

export const CheckpointScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  return (
    <Stage bg={["#05080E", "#101C2A"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 500, y: 300, r: 420 }, { c: "#4A2E08", x: 1450, y: 800, r: 420 }]}>
      <svg width={W} height={H} style={svgFill}>
        <path d={`M${CX - 40} 0 L${CX - 340} ${CY + 260} L${CX + 340} ${CY + 260} L${CX + 40} 0 Z`} fill={WORK} opacity={0.06} />
        <Skeleton stage={4} frame={frame} />
      </svg>
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: WORK, border: `2.5px solid ${WORK}`, borderRadius: 16, padding: "14px 38px", boxShadow: `0 0 40px ${WORK}44` }}>
          &lt; 200 LINES — A REAL AGENT
        </span>
      </div>
      <Cap text="this is where most tutorials end — *we keep going*" from={narrationStart + 80} frame={frame} accent={WORK} />
    </Stage>
  );
};

export const SdkScene: React.FC<SceneProps> = ({ narrationStart }) => {
  const frame = useCurrentFrame();
  const open = clamp((frame - narrationStart - 15) / 26);
  const items = ["the loop", "core tools", "permission gate", "context mgmt", "subagents", "MCP support"];
  return (
    <Stage bg={["#0A0616", "#1C1038"]} frame={frame}
      blobs={[{ c: "#4A2AB8", x: 1350, y: 350, r: 460 }, { c: "#2A1A5C", x: 450, y: 800, r: 420 }]}>
      <svg width={W} height={H} style={svgFill}>
        {/* crate */}
        <g transform={`translate(${CX - 560} ${CY - 40})`}>
          <rect x={-160} y={-120 - open * 60} width={320} height={44} rx={8} fill="#2A2118" transform={`rotate(${-open * 24} -160 ${-98})`} />
          <rect x={-160} y={-90} width={320} height={230} rx={10} fill="#1E1810" stroke={VIOLET} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 20px ${VIOLET}66)` }} />
          <text x={0} y={40} textAnchor="middle" fill={VIOLET} style={{ font: `700 30px ${MONO}` }}>agent-sdk</text>
        </g>
      </svg>
      {items.map((t, i) => {
        const at = narrationStart + 40 + i * 26;
        const p = clamp((frame - at) / 24);
        if (p <= 0) return null;
        const e = 1 - Math.pow(1 - p, 3);
        return (
          <div key={t} style={{
            position: "absolute", left: CX - 380 + e * (500 + (i % 2) * 240), top: CY - 210 + Math.floor(i / 2) * 120,
            opacity: e, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: "#F4F7FF",
            background: "rgba(10,6,22,0.92)", border: `2px solid ${VIOLET}`, borderRadius: 12, padding: "12px 24px",
            boxShadow: `0 0 24px ${VIOLET}33`,
          }}>{t}</div>
        );
      })}
      <Cap text="everything we hand-built — *production grade, one import*" from={narrationStart + 200} frame={frame} accent={VIOLET} />
    </Stage>
  );
};

export const BuildScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const code: [string, string][] = [
    ["SYSTEM = \"\"\"You are wired, a small, careful coding agent.", "#F4F7FF"],
    ["Read before you edit. Verify after you change.\"\"\"", "#F4F7FF"],
    ["", ""],
    ["OPTIONS = ClaudeAgentOptions(", "rgba(230,238,255,0.85)"],
    ["    system_prompt=SYSTEM,", "rgba(230,238,255,0.85)"],
    ["    allowed_tools=[\"Read\", \"Edit\", \"Bash\", \"Glob\"],", GOLD],
    ["    permission_mode=\"acceptEdits\",", GREEN],
    ["    cwd=\"demo/\",   # its entire world", TEAL],
    ["    model=\"sonnet-5\",", MAG],
    [")", "rgba(230,238,255,0.85)"],
    ["", ""],
    ["async for msg in query(prompt=task, options=OPTIONS): …", HEART],
  ];
  const shown = Math.floor(clamp((frame - narrationStart - 10) / (durationInFrames - narrationStart - 100)) * code.length + 0.001);
  return (
    <Stage bg={["#0E0414", "#221030"]} frame={frame}
      blobs={[{ c: "#5C1E4A", x: 1350, y: 350, r: 460 }, { c: "#2A0A2A", x: 450, y: 800, r: 420 }]}>
      <div style={{ position: "absolute", left: CX - 690, top: CY - 330, width: 1380, background: "rgba(8,3,14,0.95)", border: `2px solid ${MAG}55`, borderRadius: 18, padding: "28px 46px", boxShadow: `0 0 60px ${MAG}22` }}>
        <div style={{ fontFamily: MONO, fontSize: 21, color: "rgba(255,170,225,0.55)", marginBottom: 18 }}>wired.py — every line we wrote (real file, in the repo)</div>
        {code.slice(0, Math.max(shown, 2)).map(([t, c], i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: 28, lineHeight: 1.72, color: c, whiteSpace: "pre" }}>{t || " "}</div>
        ))}
      </div>
      <Cap text="*fifty lines of ours* — on the machine you understand" from={narrationStart + Math.round((durationInFrames - narrationStart) * 0.75)} frame={frame} accent={MAG} />
    </Stage>
  );
};

/** The REAL transcript, part 1 — investigation. */
export const Run1Scene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const s = (f: number) => narrationStart + Math.round(span * f);
  const lines = [
    { t: "$ wired \"run temps.py, find the bug, fix it, verify\"", kind: "cmd" as const, at: s(0.02) },
    { t: "⚡ wired starting", kind: "out" as const, at: s(0.08) },
    { t: "  → Bash  find . -name temps.py", kind: "tool" as const, at: s(0.16) },
    { t: "  → Read  demo/temps.py", kind: "tool" as const, at: s(0.28) },
    { t: "Found it. Running first:", kind: "out" as const, at: s(0.38) },
    { t: "  → Bash  python3 temps.py", kind: "tool" as const, at: s(0.46) },
    { t: "  [32.0, 87.6, 52.6]   ← expected [32.0, 212.0, 98.6]", kind: "err" as const, at: s(0.56) },
    { t: "Wrong output. The bug is the conversion formula on line 6 —", kind: "out" as const, at: s(0.74) },
    { t: "it uses c * 5 / 9 instead of c * 9 / 5.", kind: "err" as const, at: s(0.82) },
  ];
  return (
    <Stage bg={["#020806", "#08160E"]} frame={frame}
      blobs={[{ c: "#0A3A20", x: 1400, y: 300, r: 440 }, { c: "#0A2A18", x: 400, y: 850, r: 400 }]}>
      <Terminal lines={lines} frame={frame} title="the actual run — nothing staged" />
      <Cap text="watch the loop *breathe*" from={s(0.2)} frame={frame} accent="#7CFFB2" />
    </Stage>
  );
};

/** The REAL transcript, part 2 — the fix. */
export const Run2Scene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const s = (f: number) => narrationStart + Math.round(span * f);
  const lines = [
    { t: "  → Edit  demo/temps.py", kind: "tool" as const, at: s(0.04) },
    { t: "      - f = c * 5 / 9 + 32", kind: "err" as const, at: s(0.12) },
    { t: "      + f = c * 9 / 5 + 32", kind: "ok" as const, at: s(0.18) },
    { t: "  → Bash  python3 temps.py", kind: "tool" as const, at: s(0.3) },
    { t: "  [32.0, 212.0, 98.6]  ✓", kind: "ok" as const, at: s(0.4) },
    { t: "Verified: output is now [32.0, 212.0, 98.6] as expected.", kind: "out" as const, at: s(0.52) },
    { t: "\"I fixed the Celsius-to-Fahrenheit conversion in temps.py by", kind: "out" as const, at: s(0.64) },
    { t: " changing the formula from c*5/9+32 to the correct c*9/5+32.\"", kind: "out" as const, at: s(0.7) },
  ];
  const stampAt = s(0.82);
  const stamp = clamp((frame - stampAt) / 12);
  return (
    <Stage bg={["#020806", "#08160E"]} frame={frame}
      blobs={[{ c: "#0A3A20", x: 1400, y: 300, r: 440 }, { c: "#0A2A18", x: 400, y: 850, r: 400 }]}>
      <Terminal lines={lines} frame={frame} title="the actual run — nothing staged" />
      {stamp > 0 && (
        <div style={{
          position: "absolute", right: 200, top: 190, opacity: stamp,
          transform: `rotate(-7deg) scale(${1.4 - stamp * 0.4})`,
          fontFamily: MONO, fontWeight: 700, fontSize: 40, color: "#7CFFB2",
          border: "3.5px solid #7CFFB2", borderRadius: 14, padding: "12px 28px",
          boxShadow: "0 0 40px rgba(124,255,178,0.4)",
        }}>REAL TRANSCRIPT ✓</div>
      )}
      <Cap text="*fifty lines* — doing real work" from={s(0.55)} frame={frame} accent="#7CFFB2" />
    </Stage>
  );
};

export const UpgradesScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const stage = frame > narrationStart + span * 0.55 ? 6 : 5;
  const labels: [string, string, number][] = [
    ["SUBAGENTS — more brains", "#36D4FF", 0.1], ["MCP — hands on the world", GOLD, 0.3], ["SKILLS — your crafts", GREEN, 0.5],
  ];
  const nameAt = narrationStart + Math.round(span * 0.78);
  const nameO = clamp((frame - nameAt) / 16);
  return (
    <Stage bg={["#05080E", "#101C2A"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 500, y: 300, r: 420 }, { c: "#4A2E08", x: 1450, y: 800, r: 420 }]}>
      <svg width={W} height={H} style={svgFill}>
        <path d={`M${CX - 40} 0 L${CX - 340} ${CY + 260} L${CX + 340} ${CY + 260} L${CX + 40} 0 Z`} fill={WORK} opacity={0.06} />
        <Skeleton stage={stage} frame={frame} />
      </svg>
      {labels.map(([t, c, f], i) => {
        const o = clamp((frame - (narrationStart + Math.round(span * f))) / 14);
        return (
          <div key={t} style={{ position: "absolute", left: i === 0 ? 150 : i === 1 ? 1370 : 150, top: i === 2 ? 700 : 250, opacity: o, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: c, background: "rgba(4,8,14,0.85)", border: `2px solid ${c}66`, borderRadius: 14, padding: "14px 26px", boxShadow: `0 0 30px ${c}22` }}>{t}</div>
        );
      })}
      <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center", opacity: nameO }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, color: "#F4F7FF", textShadow: "0 0 40px rgba(255,184,77,0.4)" }}>
          you're looking at <span style={{ color: WORK }}>Claude Code</span>
        </span>
      </div>
      <Cap text="and now you can see *every moving part*" from={nameAt + 30} frame={frame} accent={WORK} />
    </Stage>
  );
};

export const RevealScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const steps: [string, number][] = [
    ["RESEARCH", 0.16], ["SCRIPT", 0.24], ["ANIMATE", 0.32], ["VOICE", 0.4], ["RENDER", 0.48],
  ];
  const lineAt = narrationStart + Math.round(span * 0.62);
  const lineO = clamp((frame - lineAt) / 18);
  const pulse = 1 + 0.04 * Math.sin(frame / 8);
  return (
    <Stage bg={["#08040E", "#160A24"]} frame={frame}
      blobs={[{ c: "#3A1B78", x: 960, y: 700, r: 560 }, { c: "#0A2A4A", x: 300, y: 250, r: 380 }, { c: "#4A2E08", x: 1650, y: 300, r: 360 }]}>
      <svg width={W} height={H} style={svgFill}>
        <g transform={`translate(${CX} ${CY - 120}) scale(${0.62 * pulse})`}>
          <circle r={64} fill="#F2EFFF" style={{ filter: `drop-shadow(0 0 44px ${VIOLET})` }} />
          <circle r={132} fill="none" stroke={TEAL} strokeWidth={6} strokeDasharray={`${2 * Math.PI * 132 * 0.4} ${2 * Math.PI * 132}`} transform={`rotate(${frame * 0.5})`} />
          {["READ", "EDIT", "BASH", "GLOB"].map((t, i) => {
            const a = (i / 4) * Math.PI * 2 + frame * 0.01;
            return <circle key={t} cx={Math.cos(a) * 205} cy={Math.sin(a) * 118} r={26} fill="none" stroke={GOLD} strokeWidth={2.5} />;
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", top: CY + 60, width: "100%", display: "flex", justifyContent: "center", gap: 20 }}>
        {steps.map(([t, f], i) => {
          const o = clamp((frame - (narrationStart + Math.round(span * f))) / 12);
          return (
            <React.Fragment key={t}>
              <span style={{ opacity: o, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#F4F7FF", border: "2px solid rgba(200,190,255,0.4)", borderRadius: 12, padding: "10px 22px", background: "rgba(6,3,12,0.8)" }}>{t}</span>
              {i < steps.length - 1 && <span style={{ opacity: o, color: VIOLET, fontSize: 34, alignSelf: "center" }}>→</span>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: CY + 190, width: "100%", textAlign: "center", opacity: lineO, transform: `scale(${0.94 + lineO * 0.06})` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 74, color: "#F4F7FF", lineHeight: 1.15 }}>
          the machine <span style={{ color: VIOLET, textShadow: `0 0 50px ${VIOLET}` }}>made the video</span>,<br />about the machine.
        </div>
      </div>
      <Cap text="that's not a gimmick — *that's the proof*" from={lineAt + 60} frame={frame} accent={VIOLET} />
    </Stage>
  );
};

export const OutroScene: React.FC<SceneProps> = ({ narrationStart, durationInFrames }) => {
  const frame = useCurrentFrame();
  const span = durationInFrames - narrationStart;
  const chips: [string, string][] = [["A LOOP", HEART], ["HANDS", GOLD], ["A GATE", GREEN], ["A MEMORY", TEAL], ["50 LINES OF YOURS", MAG]];
  const teaseAt = narrationStart + Math.round(span * 0.55);
  const tease = clamp((frame - teaseAt) / 20);
  return (
    <Stage bg={["#06090F", "#141E2C"]} frame={frame}
      blobs={[{ c: "#1E3A52", x: 700, y: 600, r: 480 }, { c: "#4A2E08", x: 1500, y: 300, r: 420 }]}>
      <div style={{ position: "absolute", top: 140, width: "100%", display: "flex", justifyContent: "center", gap: 24 }}>
        {chips.map(([w, c], i) => {
          const at = narrationStart + 8 + i * 20;
          const o = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <span key={w} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, color: c, border: `1.5px solid ${c}66`, borderRadius: 12, padding: "12px 22px", opacity: o, background: "rgba(4,8,14,0.7)", boxShadow: `0 0 26px ${c}22` }}>{w}</span>;
        })}
      </div>
      <div style={{ position: "absolute", top: CY - 70, width: "100%", textAlign: "center", opacity: tease, transform: `scale(${0.92 + tease * 0.08})` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "rgba(220,232,250,0.6)", letterSpacing: "0.4em", marginBottom: 18 }}>NEXT EPISODE</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 96, color: "#F4F7FF", lineHeight: 1.05 }}>
          CONTEXT<br /><span style={{ color: TEAL, textShadow: `0 0 60px ${TEAL}66` }}>ENGINEERING</span>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, color: "rgba(220,232,250,0.6)", marginTop: 16 }}>why agents get dumber the longer they work</div>
      </div>
      <Cap text="you *crossed over* — from user to builder" from={narrationStart + 30} frame={frame} accent={WORK} />
    </Stage>
  );
};

export const SubscribeScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const clickAt = Math.round(durationInFrames * 0.5);
  const pressed = frame > clickAt;
  const pop = interpolate(frame, [clickAt, clickAt + 5, clickAt + 12], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursor = Math.floor(frame / 14) % 2 === 0;
  return (
    <Stage bg={["#050A14", "#0A1830"]} frame={frame}
      blobs={[{ c: "#0B3A5C", x: 700, y: 400, r: 460 }, { c: "#123", x: 1400, y: 700, r: 380 }]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
        <div style={{ opacity: o, position: "relative", zIndex: 2, display: "flex", alignItems: "baseline", letterSpacing: "-0.03em" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 110, color: CW.white }}>code</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 110, color: CW.cyan, textShadow: `0 0 60px ${CW.cyanDim}` }}>wired</span>
          <span style={{ width: 54, height: 11, background: CW.cyan, marginLeft: 16, alignSelf: "flex-end", marginBottom: 11, opacity: cursor ? 1 : 0.15 }} />
        </div>
        <div style={{ opacity: o, position: "relative", zIndex: 2, transform: `scale(${pop})`, fontFamily: SANS, fontWeight: 700, fontSize: 54, color: pressed ? CW.bg : CW.white, background: pressed ? CW.cyan : "rgba(0,229,255,0.12)", border: `3px solid ${CW.cyan}`, borderRadius: 20, padding: "22px 74px", boxShadow: pressed ? `0 0 60px ${CW.cyan}` : "none" }}>
          {pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
        </div>
        <div style={{ opacity: o * 0.85, position: "relative", zIndex: 2, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: CW.dim, letterSpacing: "0.12em" }}>get wired in_</div>
      </AbsoluteFill>
    </Stage>
  );
};
