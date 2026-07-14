/** Animated engineering diagrams for the mindwired-doc engine.
 *
 *  Blueprint-style, deterministic (driven purely by useCurrentFrame), $0.
 *  A doc scene sets `diagram: "<name>"` (+ optional `arg`) instead of `img`,
 *  and DocWide renders one of these full-bleed behind the caption/stat/brand
 *  overlays. Existing photo docs never set `diagram`, so they are unaffected.
 *
 *  Vocabulary: engines · sensor · authority · trimfight · porpoise · counter · quote
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";

const FPS = 30;
const BASE = "#05070C";
const INK = "#9FB4C7";
const RED = "#FF4D4D";

export type DiagProps = { dur: number; arg?: string; accent: string };

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/* faint blueprint grid + vignette, shared by every diagram */
const Grid: React.FC<{ accent: string }> = ({ accent }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: BASE }} />
    <AbsoluteFill style={{ opacity: 0.14 }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke={accent} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#g)" />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 40%, rgba(5,7,12,0.85) 100%)" }} />
  </>
);

const label = (accent: string, size = 30): React.CSSProperties => ({
  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fill: accent,
  fontSize: size, letterSpacing: 2,
});

/* ---- 1. engines: NG vs MAX engine placement → nose-up tendency ---- */
const Engines: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const t = f / dur;
  const morph = interpolate(f, [20, 70], [0, 1], clamp); // NG → MAX
  const ex = interpolate(morph, [0, 1], [560, 470]);       // engine forward
  const ey = interpolate(morph, [0, 1], [560, 512]);       // engine up
  const er = interpolate(morph, [0, 1], [46, 74]);         // engine bigger
  const arrow = interpolate(f, [80, 120], [0, 1], clamp);  // pitch-up arrow
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* fuselage side silhouette */}
        <g stroke={INK} strokeWidth="3" fill="none" opacity={0.9}>
          <path d="M300 520 Q 340 470 460 470 L 1360 470 Q 1500 470 1560 512 Q 1500 540 1360 552 L 460 552 Q 360 552 300 520 Z" />
          {/* tail fin */}
          <path d="M1360 470 L 1450 372 L 1500 470" />
          {/* horizontal stabilizer */}
          <path d="M1470 500 L 1580 486 M1470 520 L 1580 526" />
          {/* wing */}
          <path d="M780 545 L 900 620 L 640 620 Z" opacity={0.8} />
        </g>
        {/* ground line */}
        <line x1="120" y1="700" x2="1800" y2="700" stroke={accent} strokeWidth="2" strokeDasharray="10 12" opacity={0.5} />
        {/* engine nacelle (grows + moves forward/up) */}
        <g>
          <ellipse cx={ex} cy={ey} rx={er} ry={er * 0.82} fill="rgba(77,216,255,0.10)" stroke={accent} strokeWidth="4" />
          <line x1={ex} y1={ey + er * 0.82} x2={ex} y2={700} stroke={accent} strokeWidth="2" strokeDasharray="6 8" opacity={0.55} />
        </g>
        {/* label switch */}
        <text x={ex} y={ey - er - 24} textAnchor="middle" style={label(morph < 0.5 ? INK : accent)}>
          {morph < 0.5 ? "737 NG ENGINE" : "737 MAX ENGINE"}
        </text>
        {/* pitch-up arrow at nose */}
        <g opacity={arrow} transform="translate(330,470)">
          <path d="M0 0 Q -70 -70 -30 -150" fill="none" stroke={RED} strokeWidth="6" />
          <path d="M-30 -150 l -22 26 l 34 6 z" fill={RED} />
          <text x="-150" y="-120" style={label(RED, 34)}>NOSE PITCHES UP</text>
        </g>
      </svg>
      {/* subtle drift for life */}
      <AbsoluteFill style={{ transform: `translateX(${interpolate(t, [0, 1], [0, -14])}px)` }} />
    </AbsoluteFill>
  );
};

/* ---- 2. sensor: two AoA vanes, MCAS listens to only one (the bad one) ---- */
const Sensor: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const blink = Math.sin(f / 4) > 0 ? 1 : 0.25;
  const feed = interpolate(f, [40, 80], [0, 1], clamp);
  const goodOn = interpolate(f, [10, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* nose cross-section */}
        <path d="M300 300 Q 300 540 300 780 Q 620 700 720 540 Q 620 380 300 300 Z"
          fill="rgba(159,180,199,0.05)" stroke={INK} strokeWidth="3" />
        {/* good sensor (top) */}
        <g opacity={goodOn}>
          <line x1="360" y1="380" x2="300" y2="330" stroke={accent} strokeWidth="8" strokeLinecap="round" />
          <circle cx="360" cy="380" r="12" fill={accent} />
          <text x="140" y="360" style={label(accent, 26)}>SENSOR 2 · OK</text>
        </g>
        {/* bad sensor (bottom) — blinking red */}
        <g opacity={blink}>
          <line x1="360" y1="700" x2="300" y2="640" stroke={RED} strokeWidth="8" strokeLinecap="round" />
          <circle cx="360" cy="700" r="12" fill={RED} />
          <text x="120" y="740" style={label(RED, 26)}>SENSOR 1 · FAULT</text>
        </g>
        {/* MCAS box */}
        <g>
          <rect x="1240" y="450" width="380" height="180" rx="16" fill="rgba(77,216,255,0.08)" stroke={accent} strokeWidth="4" />
          <text x="1430" y="530" textAnchor="middle" style={label(accent, 52)}>MCAS</text>
          <text x="1430" y="580" textAnchor="middle" style={label(INK, 24)}>NOSE-DOWN COMMAND</text>
        </g>
        {/* only the BAD feed is wired to MCAS */}
        <g opacity={feed}>
          <path d="M372 700 C 720 700, 900 560, 1240 545" fill="none" stroke={RED} strokeWidth="6" strokeDasharray="14 10" />
          <path d="M1240 545 l -30 -12 l 4 24 z" fill={RED} />
        </g>
        {/* the good sensor is NOT wired in — crossed out */}
        <g opacity={goodOn * 0.8}>
          <path d="M372 380 C 720 380, 900 480, 1120 500" fill="none" stroke={INK} strokeWidth="4" strokeDasharray="6 12" opacity={0.5} />
          <text x="820" y="360" style={label(INK, 24)}>IGNORED</text>
          <line x1="790" y1="430" x2="860" y2="470" stroke={RED} strokeWidth="5" />
          <line x1="860" y1="430" x2="790" y2="470" stroke={RED} strokeWidth="5" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- 3. authority: 0.6° reviewed vs 2.5° shipped (4x) ---- */
const Authority: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const h1 = interpolate(f, [10, 40], [0, 120], clamp);   // 0.6°
  const h2 = interpolate(f, [55, 110], [0, 500], clamp);  // 2.5° (grows big)
  const baseY = 780;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1="360" y1={baseY} x2="1560" y2={baseY} stroke={INK} strokeWidth="3" />
        {/* reviewed bar */}
        <rect x="620" y={baseY - h1} width="200" height={h1} fill="rgba(159,180,199,0.25)" stroke={INK} strokeWidth="3" />
        <text x="720" y={baseY + 50} textAnchor="middle" style={label(INK, 30)}>REVIEWED</text>
        <text x="720" y={baseY - h1 - 24} textAnchor="middle" style={label(INK, 44)}>0.6°</text>
        {/* shipped bar */}
        <rect x="1080" y={baseY - h2} width="200" height={h2} fill="rgba(255,77,77,0.18)" stroke={RED} strokeWidth="4" />
        <text x="1180" y={baseY + 50} textAnchor="middle" style={label(RED, 30)}>SHIPPED</text>
        <text x="1180" y={baseY - h2 - 24} textAnchor="middle" style={label(RED, 60)} opacity={interpolate(f, [90, 110], [0, 1], clamp)}>2.5°</text>
        {/* 4x callout */}
        <text x="960" y="150" textAnchor="middle" style={label(accent, 72)} opacity={interpolate(f, [110, 135], [0, 1], clamp)}>4× STRONGER</text>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- 4. trimfight: MCAS pushes nose down, pilot pulls up, MCAS wins ground ---- */
const TrimFight: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const osc = Math.sin(f / 9); // pilot tug
  const drift = interpolate(f, [0, dur], [0, 150], clamp); // MCAS wins over time
  const cy = 500 + drift + osc * -26;
  const fire = Math.sin(f / 9) < -0.6; // MCAS firing beat
  const rot = (osc * -6) + interpolate(f, [0, dur], [0, 16], clamp);
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* horizon reference */}
        <line x1="120" y1="500" x2="1800" y2="500" stroke={INK} strokeWidth="2" strokeDasharray="8 12" opacity={0.4} />
        <text x="140" y="480" style={label(INK, 24)}>HORIZON</text>
        {/* aircraft nose marker rotating/drifting down */}
        <g transform={`translate(960 ${cy}) rotate(${rot})`}>
          <path d="M-260 0 L 120 0 L 220 -34 L 240 0 L 220 34 L 120 0" fill="rgba(77,216,255,0.10)" stroke={accent} strokeWidth="4" />
          <circle cx="0" cy="0" r="8" fill={accent} />
        </g>
        {/* pilot pull-up arrow */}
        <g opacity={osc > 0 ? 1 : 0.3} transform={`translate(700 ${cy})`}>
          <path d="M0 60 L 0 -60" stroke={accent} strokeWidth="7" />
          <path d="M0 -60 l -18 24 l 36 0 z" fill={accent} />
          <text x="-210" y="0" style={label(accent, 30)}>PILOT PULLS</text>
        </g>
        {/* MCAS push-down arrow (fires in beats) */}
        <g opacity={fire ? 1 : 0.15} transform={`translate(1240 ${cy})`}>
          <path d="M0 -60 L 0 60" stroke={RED} strokeWidth="9" />
          <path d="M0 60 l -20 -26 l 40 0 z" fill={RED} />
          <text x="30" y="0" style={label(RED, 30)}>MCAS PUSHES</text>
        </g>
        {/* trim wheel + tail schematic bottom-left */}
        <g transform="translate(300 880)">
          <circle cx="0" cy="0" r="48" fill="none" stroke={INK} strokeWidth="4" />
          <g transform={`rotate(${f * (fire ? 9 : 3)})`}>
            <line x1="-48" y1="0" x2="48" y2="0" stroke={fire ? RED : INK} strokeWidth="4" />
            <line x1="0" y1="-48" x2="0" y2="48" stroke={fire ? RED : INK} strokeWidth="4" />
          </g>
          <text x="80" y="8" style={label(INK, 26)}>STAB TRIM</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- 5. porpoise: altitude-vs-time flight path, climb then fatal dive ---- */
const Porpoise: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  // sawtooth climb (MCAS pushes / pilot recovers) then loses ground and dives
  const pts: [number, number][] = [
    [360, 760], [520, 560], [620, 640], [760, 470], [860, 580],
    [1000, 430], [1100, 560], [1240, 470], [1340, 620], [1480, 500], [1560, 780],
  ];
  const draw = interpolate(f, [10, dur - 20], [0, pts.length - 1], clamp);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  const headIdx = Math.min(pts.length - 1, Math.floor(draw));
  const head = pts[headIdx];
  const crashed = draw > pts.length - 1.3;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* axes */}
        <line x1="360" y1="800" x2="1600" y2="800" stroke={INK} strokeWidth="3" />
        <line x1="360" y1="360" x2="360" y2="800" stroke={INK} strokeWidth="3" />
        <text x="360" y="330" textAnchor="middle" style={label(INK, 26)}>ALTITUDE</text>
        <text x="1560" y="850" textAnchor="middle" style={label(INK, 26)}>TIME</text>
        {/* full path faint */}
        <path d={path} fill="none" stroke={accent} strokeWidth="3" opacity={0.18} />
        {/* drawn portion */}
        <path d={path} fill="none" stroke={crashed ? RED : accent} strokeWidth="6"
          strokeDasharray="4000" strokeDashoffset={interpolate(draw, [0, pts.length - 1], [4000, 0], clamp)} />
        {/* head marker */}
        <circle cx={head[0]} cy={head[1]} r={crashed ? 16 : 11} fill={crashed ? RED : accent} />
        {crashed && <text x="1560" y="770" textAnchor="end" style={label(RED, 34)}>IMPACT</text>}
      </svg>
    </AbsoluteFill>
  );
};

/* ---- 6. counter: 189 + 157 = 346, counting up ---- */
const Counter: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [15, 90], [0, 346], clamp));
  const showSum = interpolate(f, [95, 120], [0, 1], clamp);
  const pop = spring({ frame: f - 15, fps: FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Grid accent={accent} />
      <div style={{ textAlign: "center", transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})` }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 320, color: RED, lineHeight: 1, textShadow: "0 0 60px rgba(255,77,77,0.35)" }}>
          {n}
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: 6, opacity: showSum }}>
          189 &nbsp;+&nbsp; 157
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 30, color: INK, letterSpacing: 4, marginTop: 10, opacity: showSum }}>
          LIVES LOST
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- 7. quote: a damning line, revealed word by word ---- */
const Quote: React.FC<DiagProps> = ({ dur, arg, accent }) => {
  const f = useCurrentFrame();
  const words = (arg ?? "").split(" ");
  const shown = interpolate(f, [12, Math.max(30, dur - 30)], [0, words.length], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 220px" }}>
      <Grid accent={accent} />
      <div style={{ position: "absolute", top: 180, left: 220, fontFamily: "Georgia, serif", fontSize: 260, color: accent, opacity: 0.22, lineHeight: 0.7 }}>“</div>
      <div style={{ textAlign: "center", maxWidth: 1300 }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 600, fontSize: 76, color: "#fff", lineHeight: 1.3, textShadow: "0 3px 24px rgba(0,0,0,0.8)" }}>
          {words.map((w, i) => (
            <span key={i} style={{ opacity: i < shown ? 1 : 0.12, transition: "opacity 0.2s" }}>{w} </span>
          ))}
        </div>
        <div style={{ width: 140, height: 6, background: accent, borderRadius: 4, margin: "44px auto 0", opacity: interpolate(f, [20, 44], [0, 1], clamp) }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 28, color: INK, letterSpacing: 3, marginTop: 22, opacity: interpolate(f, [30, 54], [0, 1], clamp) }}>
          — BOEING INTERNAL MESSAGES
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DIAGRAMS: Record<string, React.FC<DiagProps>> = {
  engines: Engines, sensor: Sensor, authority: Authority,
  trimfight: TrimFight, porpoise: Porpoise, counter: Counter, quote: Quote,
};
