import React from "react";
import {
  AbsoluteFill, Easing, Sequence, interpolate, spring,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { C, DISPLAY, SANS } from "../lib/theme";
import { Vignette, Grain } from "../components/FilmLook";
import { CountUp, PopIn, Bar } from "../components/kinetic";

/**
 * THROWAWAY DEMO — "borrowed motion energy" (à la The Infographics Show), rendered
 * in Mindwired's own cinematic palette + fonts. Not wired into any episode.
 * Showcases the techniques that read as "punchy" vs. our slow doc fades:
 *   • count-up numbers that snap into place      • overshoot pop-ins (anticipate + settle)
 *   • staggered reveals (not everything at once)  • bars that build
 *   • emphasis punches landed on a beat
 */

const easeOutCubic = Easing.out(Easing.cubic);

// ── backdrop ────────────────────────────────────────────────────────────────

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.15) % 60;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 30%, ${C.deepBlue} 0%, ${C.void} 70%)` }}>
      {/* faint infographic grid */}
      <AbsoluteFill style={{
        opacity: 0.14,
        backgroundImage: `linear-gradient(${C.panelEdge} 1px, transparent 1px), linear-gradient(90deg, ${C.panelEdge} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        backgroundPosition: `${drift}px ${drift}px`,
        maskImage: "radial-gradient(80% 80% at 50% 45%, #000 30%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(80% 80% at 50% 45%, #000 30%, transparent 90%)",
      }} />
    </AbsoluteFill>
  );
};

/** A kicker label whose underline rule wipes in. */
const Kicker: React.FC<{ text: string; color?: string; delay?: number }> = ({ text, color = C.cyan, delay = 0 }) => {
  const f = useCurrentFrame();
  const w = interpolate(f - delay, [4, 26], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  return (
    <PopIn delay={delay} from="left">
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 8, color, textTransform: "uppercase", textShadow: `0 0 16px ${color}66` }}>{text}</div>
      <div style={{ height: 3, width: w, marginTop: 12, background: `linear-gradient(90deg, ${color}, transparent)`, boxShadow: `0 0 12px ${color}` }} />
    </PopIn>
  );
};

// ── beats ───────────────────────────────────────────────────────────────────

/** Beat 1 — count-up hero. */
const Beat1: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}><Kicker text="Our Galaxy's Speed" /></div>
      <CountUp to={2000000} suffix="KM/H" size={180} color={C.cyan} />
      <PopIn delay={26} from="up" style={{ marginTop: 26 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, letterSpacing: 2, color: C.dim }}>
          and you can&apos;t feel a thing
        </div>
      </PopIn>
    </div>
  </AbsoluteFill>
);

/** Beat 2 — staggered stat chips. */
const chips = [
  { v: 100000, s: "", l: "Galaxies in Laniakea", c: C.teal },
  { v: 250, s: "M LY", l: "Across", c: C.cyan },
  { v: 20, s: "%", l: "of the Sky Hidden", c: C.amber },
];
const Beat2: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ display: "flex", gap: 40 }}>
      {chips.map((ch, i) => (
        <PopIn key={i} delay={i * 8} from="up">
          <div style={{
            width: 380, padding: "44px 30px", borderRadius: 18, textAlign: "center",
            background: `linear-gradient(180deg, ${C.panel}, ${C.deepBlue})`,
            border: `1px solid ${C.panelEdge}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: ch.c, margin: "0 auto 22px", boxShadow: `0 0 20px ${ch.c}` }} />
            <Sequence from={i * 8} layout="none"><CountUp to={ch.v} suffix={ch.s} size={96} color={C.white} /></Sequence>
            <div style={{ marginTop: 16, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: ch.c, textTransform: "uppercase" }}>{ch.l}</div>
          </div>
        </PopIn>
      ))}
    </div>
  </AbsoluteFill>
);

/** Beat 3 — bar build + emphasis multiplier punch. */
const Beat3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = spring({ frame: f - 44, fps, config: { damping: 9, stiffness: 130, mass: 0.6 } });
  const punchScale = f >= 44 ? interpolate(punch, [0, 1], [0.3, 1]) : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 220, paddingRight: 220 }}>
      <div style={{ marginBottom: 50 }}><Kicker text="Mass, Compared" color={C.amber} /></div>
      <Bar label="Milky Way" value={1} suffix="×" maxW={120} color={C.ice} delay={6} />
      <Bar label="The Great Attractor" value={10000} suffix="× MILKY WAYS" maxW={1180} color={C.amber} delay={20} />
      <div style={{ position: "absolute", right: 220, top: 150, transform: `scale(${punchScale})`, opacity: punchScale > 0 ? 1 : 0 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 200, color: C.amber, textShadow: `0 0 50px ${C.amber}` }}>×10K</span>
      </div>
    </AbsoluteFill>
  );
};

// ── composition ───────────────────────────────────────────────────────────────

export const MOTION_DEMO_FRAMES = 360;

export const MotionEnergyDemo: React.FC = () => (
  <AbsoluteFill style={{ background: C.void }}>
    <Backdrop />
    <Sequence from={0} durationInFrames={120}><Beat1 /></Sequence>
    <Sequence from={120} durationInFrames={120}><Beat2 /></Sequence>
    <Sequence from={240} durationInFrames={120}><Beat3 /></Sequence>
    <Vignette strength={0.9} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
