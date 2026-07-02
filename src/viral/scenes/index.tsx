import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY, SANS } from "../../lib/theme";
import { KineticText, Kicker } from "../components/KineticText";
import { ToneStyle } from "../lib/tone";
import { TimedScene } from "../lib/types";
import { fadeIn, popIn, revealProgress } from "../lib/anim";
import { Bar, CountUp } from "../../components/kinetic";

/** Every scene = midground visual metaphor + kinetic text.
 *  (Backdrop/camera/HUD are applied by the engine around these.) */

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 44 }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>
    {children}
  </AbsoluteFill>
);

/* ── visual metaphors (midground) ─────────────────────────────────────────── */

/** A void disc with a glowing rim — the channel's black-hole motif. */
const VoidDisc: React.FC<{ tone: ToneStyle; size?: number }> = ({ tone, size = 560 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `scale(${interpolate(grow, [0, 1], [0.7, 1])})` }}>
      <div style={{
        position: "absolute", inset: -60, borderRadius: "50%",
        background: `radial-gradient(circle, ${tone.accent}26 30%, transparent 70%)`,
        filter: "blur(18px)", transform: `scale(${1 + Math.sin(frame * 0.05) * 0.03})`,
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: "#000",
        boxShadow: `0 0 0 5px ${tone.accent}EE, 0 0 90px 12px ${tone.accent}66, inset 0 0 80px rgba(0,0,0,1)`,
      }} />
    </div>
  );
};

/** Concentric orbit rings that bend — "orbits started to bend". */
const BendingOrbits: React.FC<{ tone: ToneStyle }> = ({ tone }) => {
  const frame = useCurrentFrame();
  const bend = interpolate(frame, [10, 50], [0, 34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={760} height={560} viewBox="0 0 760 560" style={{ opacity: fadeIn(frame, 0, 10) }}>
      {[90, 150, 210, 270].map((r, i) => (
        <ellipse key={i} cx={380} cy={280} rx={r + bend * (i * 0.35)} ry={r * 0.42}
          transform={`rotate(${-12 - bend * 0.35} 380 280)`}
          fill="none" stroke={i === 3 ? tone.accent : "rgba(234,242,255,0.4)"} strokeWidth={i === 3 ? 4 : 2}
          strokeDasharray={i === 3 ? "none" : "5 9"} />
      ))}
      <circle cx={380 + bend * 3.4} cy={280 - bend * 1.7} r={13} fill={tone.accent2}
        style={{ filter: `drop-shadow(0 0 14px ${tone.accent2})` }} />
    </svg>
  );
};

/* ── the 8 scene kinds ────────────────────────────────────────────────────── */

const Hook: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => (
  <Stage>
    {s.kicker && <Kicker text={s.kicker} tone={tone} />}
    <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={106} />
  </Stage>
);

const Problem: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => (
  <Stage>
    <VoidDisc tone={tone} size={430} />
    <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={88} />
  </Stage>
);

const ShockFact: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      {s.kicker && <Kicker text={s.kicker} tone={tone} />}
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={112} />
      <div style={{
        width: 220, height: 6, background: tone.accent, borderRadius: 3,
        transform: `scaleX(${revealProgress(frame, 8, 12)})`, boxShadow: `0 0 18px ${tone.accent}`,
      }} />
    </Stage>
  );
};

const Comparison: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const split = revealProgress(frame, 4, 12);
  return (
    <Stage gap={30}>
      <div style={{ display: "flex", width: width * 0.8, justifyContent: "center", gap: 24 }}>
        {[s.compare?.left ?? "A", s.compare?.right ?? "B"].map((side, i) => (
          <div key={i} style={{
            flex: 1, padding: "48px 30px", borderRadius: 24, textAlign: "center",
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, color: "#EAF2FF",
            background: i === 0 ? "rgba(234,242,255,0.07)" : `${tone.accent}1A`,
            border: `2px solid ${i === 0 ? "rgba(234,242,255,0.2)" : tone.accent}`,
            transform: `translateX(${(i === 0 ? -1 : 1) * (1 - split) * 240}px)`, opacity: split,
            boxShadow: i === 1 ? `0 0 44px ${tone.accent}44` : undefined,
          }}>{side}</div>
        ))}
      </div>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={78} />
    </Stage>
  );
};

const Transformation: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => (
  <Stage>
    <BendingOrbits tone={tone} />
    <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={74} />
  </Stage>
);

const Data: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const bars = s.stat?.bars?.length ? s.stat.bars : undefined;
  return (
    <Stage gap={26}>
      {bars ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 760 }}>
          {bars.map((b, i) => (
            <Bar key={b.label} label={b.label} value={b.value} maxW={700}
              color={i === bars.length - 1 ? tone.accent : "rgba(234,242,255,0.45)"} delay={6 + i * 12} />
          ))}
        </div>
      ) : (
        <CountUp to={s.stat?.to ?? 0} suffix={s.stat?.suffix ?? ""} size={124} color={tone.accent} dur={34} />
      )}
      {s.stat?.label && (
        <div style={{
          fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 3, textTransform: "uppercase",
          color: "rgba(234,242,255,0.75)", opacity: fadeIn(frame, 12, 10),
          maxWidth: 860, textAlign: "center",
        }}>{s.stat.label}</div>
      )}
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={76} />
    </Stage>
  );
};

const Quote: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <div style={{ fontFamily: DISPLAY, fontSize: 150, color: tone.accent, lineHeight: 0.6, opacity: fadeIn(frame, 0, 8) }}>"</div>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={92} />
      {s.kicker && <Kicker text={s.kicker} tone={tone} delay={16} />}
    </Stage>
  );
};

const CTA: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.045 * Math.sin(frame * 0.22);
  const pop = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  return (
    <Stage gap={40}>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={96} />
      <div style={{
        transform: `scale(${popIn(frame, 10, 12) * pulse})`, opacity: pop,
        padding: "26px 64px", borderRadius: 60, background: tone.accent, color: "#050810",
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, letterSpacing: 1,
        boxShadow: `0 0 54px ${tone.accent}88`,
      }}>FOLLOW @MINDWIRED</div>
    </Stage>
  );
};

export const SceneRouter: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  switch (s.kind) {
    case "hook": return <Hook s={s} tone={tone} />;
    case "problem": return <Problem s={s} tone={tone} />;
    case "shockfact": return <ShockFact s={s} tone={tone} />;
    case "comparison": return <Comparison s={s} tone={tone} />;
    case "transformation": return <Transformation s={s} tone={tone} />;
    case "data": return <Data s={s} tone={tone} />;
    case "quote": return <Quote s={s} tone={tone} />;
    case "cta": return <CTA s={s} tone={tone} />;
  }
};
