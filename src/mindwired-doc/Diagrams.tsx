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
const Counter: React.FC<DiagProps> = ({ dur, arg, accent }) => {
  const f = useCurrentFrame();
  // arg = "TOTAL|BREAKDOWN|LABEL" (e.g. "50|49 + 1|LIVES LOST"). Default = 737 MAX.
  const [totalStr, breakdown, label] = (arg ?? "346|189 + 157|LIVES LOST").split("|");
  const total = parseInt(totalStr, 10) || 346;
  const n = Math.round(interpolate(f, [15, 90], [0, total], clamp));
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
          {breakdown}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 30, color: INK, letterSpacing: 4, marginTop: 10, opacity: showSum }}>
          {label ?? "LIVES LOST"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- 7. quote: a damning line, revealed word by word ---- */
const Quote: React.FC<DiagProps> = ({ dur, arg, accent }) => {
  const f = useCurrentFrame();
  // arg = "quote text||ATTRIBUTION" (attribution optional; legacy default below)
  const [qText, qAttr] = (arg ?? "").split("||");
  const words = (qText ?? "").split(" ");
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
          — {qAttr || "BOEING INTERNAL MESSAGES"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- atcwaves: real-ATC audio waveform (for ACTUAL ATC RECORDING beats) ---- */
const AtcWaves: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const N = 68;
  const bars = Array.from({ length: N }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.7 + (seed - Math.floor(seed))));
    const env = 0.4 + 0.6 * Math.abs(Math.sin(f / 6 + i * 0.5)); // "talking" envelope
    return base * env;
  });
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1="160" y1="540" x2="1760" y2="540" stroke={INK} strokeWidth="2" opacity={0.3} />
        {bars.map((h, i) => {
          const x = 160 + (i + 0.5) * (1600 / N);
          const bh = h * 300;
          return <rect key={i} x={x - 8} y={540 - bh / 2} width="16" height={bh} rx="6" fill={accent} opacity={0.5 + 0.5 * h} />;
        })}
        <circle cx="960" cy="230" r="30" fill="none" stroke={accent} strokeWidth="4" />
        <path d="M948 230 a12 12 0 0 1 24 0" fill="none" stroke={accent} strokeWidth="4" />
        <line x1="960" y1="230" x2="960" y2="250" stroke={accent} strokeWidth="4" />
        <text x="960" y="320" textAnchor="middle" style={label(INK, 26)}>BUFFALO APPROACH · 118.4</text>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- lowspeed: airspeed tape, needle dropping, low-speed cue band rising ---- */
const LowSpeed: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const spd = interpolate(f, [0, dur], [180, 128], clamp);
  const cy = interpolate(spd, [100, 200], [900, 180], clamp); // needle y (fast=top)
  const cueTop = interpolate(f, [10, dur], [980, 640], clamp); // red band rises
  const danger = spd < 140;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* tape */}
        <rect x="760" y="140" width="220" height="800" rx="10" fill="rgba(159,180,199,0.06)" stroke={INK} strokeWidth="3" />
        {[200, 180, 160, 140, 120, 100].map((v, i) => (
          <g key={v}>
            <line x1="760" y1={180 + i * 144} x2="800" y2={180 + i * 144} stroke={INK} strokeWidth="2" />
            <text x="745" y={186 + i * 144} textAnchor="end" style={label(INK, 30)}>{v}</text>
          </g>
        ))}
        {/* low-speed cue band (red/black, rising) */}
        <rect x="760" y={cueTop} width="220" height={980 - cueTop} fill="rgba(255,77,77,0.28)" stroke={RED} strokeWidth="3" />
        <text x="870" y={cueTop - 14} textAnchor="middle" style={label(RED, 26)}>LOW-SPEED CUE</text>
        {/* needle */}
        <g>
          <polygon points={`980,${cy} 1030,${cy - 26} 1180,${cy - 26} 1180,${cy + 26} 1030,${cy + 26}`}
            fill={danger ? RED : accent} />
          <text x="1080" y={cy + 12} textAnchor="middle" style={{ ...label("#0A0A0A", 46) }}>{Math.round(spd)}</text>
        </g>
        <text x="870" y="110" textAnchor="middle" style={label(accent, 30)}>AIRSPEED · KNOTS</text>
        {danger && <text x="1300" y={cy + 12} style={label(RED, 40)} opacity={Math.sin(f / 4) > 0 ? 1 : 0.3}>◀ TOO SLOW</text>}
      </svg>
    </AbsoluteFill>
  );
};

/* ---- stallseq: airfoil AoA rising past critical → airflow separates → STALL ---- */
const StallSeq: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const aoa = interpolate(f, [10, dur - 20], [4, 22], clamp); // degrees
  const stalled = aoa > 15;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(860 560) rotate(${-aoa})`}>
          {/* airfoil */}
          <path d="M-360 0 Q -120 -70 260 -14 Q 300 -6 300 0 Q 300 6 200 14 Q -120 40 -360 0 Z"
            fill="rgba(255,149,0,0.10)" stroke={accent} strokeWidth="4" />
          {/* airflow streamlines */}
          {[-70, -40, -10].map((off, i) => (
            <path key={i}
              d={stalled
                ? `M-520 ${off} Q -360 ${off} -200 ${off - 6} Q -80 ${off - 4} -20 ${off - 30 - i * 10} Q 40 ${off - 50} 120 ${off + (i % 2 ? 30 : -20)}`
                : `M-520 ${off} Q -200 ${off} 40 ${off - 8} Q 200 ${off - 6} 340 ${off}`}
              fill="none" stroke={stalled ? RED : "#7FE3FF"} strokeWidth="3" opacity={0.85}
              strokeDasharray={stalled ? "10 8" : "none"} />
          ))}
        </g>
        {/* AoA arc */}
        <line x1="500" y1="560" x2="900" y2="560" stroke={INK} strokeWidth="2" strokeDasharray="8 8" opacity={0.5} />
        <text x="520" y="620" style={label(stalled ? RED : accent, 40)}>AoA {Math.round(aoa)}°</text>
        <text x="520" y="180" style={label(INK, 28)}>CRITICAL ANGLE ≈ 15°</text>
        {stalled && <text x="960" y="240" textAnchor="middle" style={label(RED, 90)} opacity={Math.sin(f / 4) > -0.3 ? 1 : 0.4}>STALL</text>}
      </svg>
    </AbsoluteFill>
  );
};

/* ---- pusher: pilot pulls back (wrong) vs stick pusher pushing nose-down (right) ---- */
const Pusher: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const pull = interpolate(f, [20, 70], [0, 1], clamp); // column moves aft
  const colX = interpolate(pull, [0, 1], [960, 900]);
  const beat = Math.sin(f / 8) > 0;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* control column */}
        <g transform={`translate(${colX} 720) rotate(${pull * -14})`}>
          <rect x="-16" y="-260" width="32" height="260" rx="12" fill="rgba(159,180,199,0.15)" stroke={INK} strokeWidth="4" />
          <rect x="-70" y="-300" width="140" height="46" rx="18" fill="rgba(159,180,199,0.15)" stroke={INK} strokeWidth="4" />
        </g>
        {/* pilot pulls back (red, wrong) */}
        <g opacity={0.5 + 0.5 * pull}>
          <path d="M1120 520 q 120 40 120 200" fill="none" stroke={RED} strokeWidth="7" />
          <path d="M1240 720 l -26 -18 l 6 34 z" fill={RED} />
          <text x="1160" y="480" style={label(RED, 34)}>PILOT PULLS BACK</text>
          <text x="1160" y="520" style={label(RED, 26)}>(deepens the stall)</text>
        </g>
        {/* stick pusher: correct nose-down */}
        <g opacity={beat ? 1 : 0.25}>
          <path d="M700 460 L 700 640" stroke={accent} strokeWidth="9" />
          <path d="M700 640 l -22 -30 l 44 0 z" fill={accent} />
          <text x="430" y="440" style={label(accent, 34)}>STICK PUSHER</text>
          <text x="430" y="480" style={label(accent, 26)}>nose DOWN — the fix</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- approach: descent profile to runway, speed bleeding, config points ---- */
const Approach: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const prog = interpolate(f, [10, dur - 10], [0, 1], clamp);
  const px = interpolate(prog, [0, 1], [300, 1500]);
  const py = interpolate(prog, [0, 1], [320, 760]);
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* ground + runway */}
        <line x1="200" y1="820" x2="1720" y2="820" stroke={INK} strokeWidth="3" />
        <rect x="1500" y="812" width="220" height="16" fill={accent} opacity={0.7} />
        <text x="1610" y="870" textAnchor="middle" style={label(accent, 26)}>RWY 23 · BUFFALO</text>
        {/* glide path */}
        <path d="M300 320 L 1500 760" stroke={INK} strokeWidth="2" strokeDasharray="10 10" opacity={0.5} />
        {/* config callouts */}
        <text x="520" y="430" style={label(INK, 24)}>GEAR DOWN · 145 kt</text>
        <text x="820" y="560" style={label(INK, 24)}>FLAPS · slowing</text>
        <text x="1120" y="690" style={label(RED, 26)}>130 kt · TOO SLOW</text>
        {/* moving aircraft dot */}
        <g transform={`translate(${px} ${py})`}>
          <path d="M-26 0 L 16 0 L 30 -8 L 30 8 Z" fill={accent} />
          <circle cx="0" cy="0" r="7" fill="#fff" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- icing: ice on the leading edge, stamped NOT THE CAUSE ---- */
const Icing: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const ice = interpolate(f, [10, 60], [0, 1], clamp);
  const stamp = spring({ frame: f - 80, fps: FPS, config: { damping: 11, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* wing leading edge cross-section */}
        <path d="M420 560 Q 640 420 1400 500 Q 1480 508 1480 540 Q 1480 572 1360 588 Q 640 660 420 560 Z"
          fill="rgba(159,180,199,0.08)" stroke={INK} strokeWidth="4" />
        {/* ice accretion on the leading edge (left) */}
        <path d="M420 560 Q 470 500 560 484 Q 520 470 470 500 Q 430 470 460 452 Q 500 470 560 466"
          fill="rgba(127,227,255,0.5)" stroke="#BFEFFF" strokeWidth="3" opacity={ice} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${430 + i * 26} 560 l -8 -${18 + (i % 3) * 8}`} stroke="#BFEFFF" strokeWidth="4" opacity={ice} />
        ))}
        <text x="540" y="700" style={label("#BFEFFF", 30)}>ICE ON THE WING</text>
        {/* stamp */}
        <g transform={`translate(1120 360) rotate(-12) scale(${interpolate(stamp, [0, 1], [0.4, 1])})`} opacity={stamp}>
          <rect x="-260" y="-56" width="520" height="112" rx="12" fill="none" stroke={RED} strokeWidth="8" />
          <text x="0" y="20" textAnchor="middle" style={label(RED, 56)}>NOT THE CAUSE</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- fatigue: overnight commute legs + a tired clock ---- */
const Fatigue: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [10, dur - 20], [0, 3], clamp);
  const legs = [
    { x: 360, label: "SEATTLE", t: "eve" },
    { x: 820, label: "MEMPHIS", t: "night" },
    { x: 1280, label: "NEWARK", t: "6:23 AM" },
  ];
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1="360" y1="480" x2="1280" y2="480" stroke={INK} strokeWidth="2" strokeDasharray="8 10" opacity={0.4} />
        {legs.map((l, i) => (
          <g key={i} opacity={draw > i ? 1 : 0.15}>
            <circle cx={l.x} cy="480" r="12" fill={i === 2 ? RED : accent} />
            <text x={l.x} y="440" textAnchor="middle" style={label(i === 2 ? RED : accent, 30)}>{l.label}</text>
            <text x={l.x} y="540" textAnchor="middle" style={label(INK, 24)}>{l.t}</text>
            {i < 2 && draw > i + 0.5 && (
              <path d={`M${l.x + 24} 480 L ${legs[i + 1].x - 24} 480`} stroke={accent} strokeWidth="4" markerEnd="" />
            )}
          </g>
        ))}
        <text x="820" y="300" textAnchor="middle" style={label(RED, 40)} opacity={interpolate(f, [70, 95], [0, 1], clamp)}>~90 MIN SLEEP · OVERNIGHT</text>
        <text x="820" y="720" textAnchor="middle" style={label(INK, 28)}>She flew all night — for free — to reach work.</text>
      </svg>
    </AbsoluteFill>
  );
};

/* ---- reform: 250 → 1,500 flight-hour minimum ---- */
const Reform: React.FC<DiagProps> = ({ dur, accent }) => {
  const f = useCurrentFrame();
  const h1 = interpolate(f, [10, 40], [0, 90], clamp);
  const h2 = interpolate(f, [55, 115], [0, 520], clamp);
  const baseY = 800;
  return (
    <AbsoluteFill>
      <Grid accent={accent} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1="360" y1={baseY} x2="1560" y2={baseY} stroke={INK} strokeWidth="3" />
        <rect x="600" y={baseY - h1} width="220" height={h1} fill="rgba(159,180,199,0.25)" stroke={INK} strokeWidth="3" />
        <text x="710" y={baseY + 50} textAnchor="middle" style={label(INK, 30)}>OLD MINIMUM</text>
        <text x="710" y={baseY - h1 - 22} textAnchor="middle" style={label(INK, 46)}>250 hrs</text>
        <rect x="1100" y={baseY - h2} width="220" height={h2} fill="rgba(255,149,0,0.18)" stroke={accent} strokeWidth="4" />
        <text x="1210" y={baseY + 50} textAnchor="middle" style={label(accent, 30)}>AFTER 3407</text>
        <text x="1210" y={baseY - h2 - 22} textAnchor="middle" style={label(accent, 64)} opacity={interpolate(f, [95, 115], [0, 1], clamp)}>1,500 hrs</text>
        <text x="960" y="180" textAnchor="middle" style={label(accent, 60)} opacity={interpolate(f, [115, 140], [0, 1], clamp)}>6× THE REQUIREMENT</text>
      </svg>
    </AbsoluteFill>
  );
};

export const DIAGRAMS: Record<string, React.FC<DiagProps>> = {
  engines: Engines, sensor: Sensor, authority: Authority,
  trimfight: TrimFight, porpoise: Porpoise, counter: Counter, quote: Quote,
  atcwaves: AtcWaves, lowspeed: LowSpeed, stallseq: StallSeq, pusher: Pusher,
  approach: Approach, icing: Icing, fatigue: Fatigue, reform: Reform,
};
