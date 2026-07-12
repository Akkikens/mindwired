import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY, SANS } from "../../lib/theme";
import { KineticText, Kicker } from "../components/KineticText";
import { ToneStyle } from "../lib/tone";
import { TimedScene } from "../lib/types";
import { fadeIn, popIn, revealProgress } from "../lib/anim";
import { Bar, CountUp } from "../../components/kinetic";

/** A talking clip or still portrait to render inside a scene's circular void
 *  frame — passed down so the wide long-form's host is never just an empty
 *  black hole with a separate face bubble floating nearby (Akshay feedback
 *  2026-07-05: "shouldn't we supposed to have our host in it"). `audioDelay`
 *  must match the scene's lead-in (frames before the audio Sequence starts)
 *  so the video doesn't start "talking" before any sound plays — the disc
 *  renders from the scene's local frame 0, but the audio is offset by
 *  audioDelay, so without this the lips visibly lead the voice by that same
 *  lead-in (found 2026-07-05: "lips arent sync correctly" on every
 *  "problem"-kind talking scene). */
export type HostMedia = { src: string; kind: "video" | "image"; audioDelay?: number };

/** Every scene = midground visual metaphor + kinetic text.
 *  (Backdrop/camera/HUD are applied by the engine around these.) */

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 44 }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>
    {children}
  </AbsoluteFill>
);

/** true when this scene sits over footage (motion b-roll or an AI still) —
 *  captions then get a backing plate so they stay legible over the image. */
const overFootage = (s: TimedScene) => Boolean(s.brollVideo || s.brollExists);

/* ── visual metaphors (midground) ─────────────────────────────────────────── */

/** An animated "energy core" for the void disc when no host media exists —
 *  expanding ping rings + an orbiting particle, so the disc always has
 *  something alive happening in it instead of reading as an empty/dead
 *  black hole (Akshay feedback 2026-07-05: no text-inside-a-blank-circle). */
const EnergyCore: React.FC<{ tone: ToneStyle }> = ({ tone }) => {
  const frame = useCurrentFrame();
  const rings = [0, 40, 80];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {rings.map((offset, i) => {
        const t = ((frame + offset) % 120) / 120;
        return (
          <div key={i} style={{
            position: "absolute", width: `${t * 100}%`, height: `${t * 100}%`, borderRadius: "50%",
            border: `2px solid ${tone.accent}`, opacity: 1 - t,
          }} />
        );
      })}
      <div style={{
        width: "18%", height: "18%", borderRadius: "50%", background: tone.accent,
        boxShadow: `0 0 40px 10px ${tone.accent}AA`,
        transform: `scale(${1 + 0.1 * Math.sin(frame * 0.15)})`,
      }} />
      {[0, 1, 2].map((i) => {
        const angle = (frame * 0.04 + (i * Math.PI * 2) / 3) % (Math.PI * 2);
        const r = 34; // % of disc radius
        return (
          <div key={i} style={{
            position: "absolute", width: 10, height: 10, borderRadius: "50%", background: tone.accent2,
            boxShadow: `0 0 12px ${tone.accent2}`,
            transform: `translate(${Math.cos(angle) * r}%, ${Math.sin(angle) * r}%)`,
          }} />
        );
      })}
    </div>
  );
};

/** A void disc with a glowing rim — the channel's black-hole motif. When
 *  hostMedia is given, the host's talking clip fills the disc so the void
 *  reads as a "portal" the host is speaking from; otherwise an animated
 *  energy core keeps the disc alive instead of a dead black fill. */
const VoidDisc: React.FC<{ tone: ToneStyle; size?: number; hostMedia?: HostMedia }> = ({ tone, size = 560, hostMedia }) => {
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
        position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        background: "#050810",
        boxShadow: `0 0 0 5px ${tone.accent}EE, 0 0 90px 12px ${tone.accent}66, inset 0 0 80px rgba(0,0,0,1)`,
      }}>
        {hostMedia ? (
          <Sequence from={hostMedia.audioDelay ?? 0}>
            <OffthreadVideo muted src={staticFile(hostMedia.src)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
          </Sequence>
        ) : (
          <EnergyCore tone={tone} />
        )}
      </div>
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

/** Pattern-interrupt: text sits high (upper-third) rather than dead center, a
 *  top-anchored kicker sits over an animated accent rule that wipes in from the
 *  left, and a thin scanline sweeps under the line — deliberately NOT the
 *  centered-text-over-Stage look the other kinds use. */
const Hook: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const rule = revealProgress(frame, 2, 12);          // top accent rule wipe
  const scan = revealProgress(frame, 12, 16);         // underline sweep under the line
  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      justifyContent: "flex-start", padding: "26% 9% 0", gap: 30,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: fadeIn(frame, 0, 8) }}>
        <div style={{
          height: 8, width: `${rule * 190}px`, background: tone.accent, borderRadius: 4,
          boxShadow: `0 0 22px ${tone.accent}`,
        }} />
        {s.kicker && <Kicker text={s.kicker} tone={tone} maxWidth={1000} />}
      </div>
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 18 }}>
        <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis}
          fontSize={106} align="left" maxWidth={980} plate={overFootage(s)} />
        <div style={{
          height: 4, width: `${scan * 100}%`, alignSelf: "stretch",
          background: `linear-gradient(90deg, ${tone.accent} 0%, ${tone.accent2} 70%, transparent 100%)`,
          boxShadow: `0 0 16px ${tone.accent}`, borderRadius: 2,
        }} />
      </div>
    </AbsoluteFill>
  );
};

/** The black VoidDisc is a cosmic-void visual — right for mindwired's space
 *  aesthetic, wrong for every other channel (on football it reads as a broken
 *  black ball — user feedback 2026-07-05). Non-mindwired channels get a soft
 *  accent glow behind the text instead. */
const Problem: React.FC<{ s: TimedScene; tone: ToneStyle; hostMedia?: HostMedia }> = ({ s, tone, hostMedia }) => {
  const space = !s.channel || s.channel === "mindwired";
  return (
    <Stage>
      {space ? (
        <VoidDisc tone={tone} size={430} hostMedia={hostMedia} />
      ) : (
        <div style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%",
          background: `radial-gradient(circle, ${tone.accent}30 0%, ${tone.accent}10 40%, transparent 70%)`,
          filter: "blur(30px)",
        }} />
      )}
      {!space && s.kicker && <Kicker text={s.kicker} tone={tone} />}
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={88} plate={overFootage(s)} />
    </Stage>
  );
};

/** Impact-forward: an off-center heavy accent slab slams in behind the line
 *  (asymmetric, anchored left-of-center) so the emphasis reads like a headline
 *  stat rather than a centered caption. The reveal rule is kept but restyled as
 *  a thick left-anchored bar that grows from its left edge. */
const ShockFact: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const slab = revealProgress(frame, 2, 10);          // heavy bar slams in from the left
  const rule = revealProgress(frame, 10, 12);
  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      justifyContent: "center", padding: "0 8%", gap: 34,
    }}>
      {s.kicker && <Kicker text={s.kicker} tone={tone} maxWidth={1000} />}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        {/* offset heavy slab behind/beside the line — asymmetric anchor */}
        <div style={{
          position: "absolute", left: -34, top: "50%",
          width: `${slab * (width * 0.5)}px`, height: 148, transform: "translateY(-50%) skewX(-9deg)",
          background: `${tone.accent}22`, borderLeft: `12px solid ${tone.accent}`,
          boxShadow: `0 0 60px ${tone.accent}44`, borderRadius: 4,
        }} />
        <div style={{ position: "relative" }}>
          <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis}
            fontSize={122} align="left" maxWidth={1180} plate={overFootage(s)} />
        </div>
      </div>
      <div style={{
        width: 300, height: 10, background: tone.accent, borderRadius: 3, transformOrigin: "left",
        transform: `scaleX(${rule})`, boxShadow: `0 0 18px ${tone.accent}`,
      }} />
    </AbsoluteFill>
  );
};

const Comparison: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const split = revealProgress(frame, 4, 12);
  const sides = [
    { label: s.compare?.left ?? "A", img: s.compare?.leftImg },
    { label: s.compare?.right ?? "B", img: s.compare?.rightImg },
  ];
  return (
    <Stage gap={30}>
      <div style={{ display: "flex", width: width * 0.8, justifyContent: "center", gap: 24 }}>
        {sides.map((side, i) => (
          <div key={i} style={{
            flex: 1, padding: "36px 30px", borderRadius: 24, textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: "#EAF2FF",
            background: i === 0 ? "rgba(234,242,255,0.07)" : `${tone.accent}1A`,
            border: `2px solid ${i === 0 ? "rgba(234,242,255,0.2)" : tone.accent}`,
            transform: `translateX(${(i === 0 ? -1 : 1) * (1 - split) * 240}px)`, opacity: split,
            boxShadow: i === 1 ? `0 0 44px ${tone.accent}44` : undefined,
          }}>
            {side.img && (
              <img src={staticFile(side.img)} style={{
                width: 84, height: 84, objectFit: "contain",
                filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))",
              }} />
            )}
            {side.label}
          </div>
        ))}
      </div>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={78} plate={overFootage(s)} />
    </Stage>
  );
};

const Transformation: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => (
  <Stage>
    <BendingOrbits tone={tone} />
    <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={74} plate={overFootage(s)} />
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
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={76} plate={overFootage(s)} />
    </Stage>
  );
};

/** Editorial pull-quote: an oversized accent quotation mark anchored top-left,
 *  the line set left-aligned across the full safe width, and the attribution
 *  kicker dropped to the lower-right — a magazine layout, not a centered card. */
const Quote: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const markPop = popIn(frame, 0, 12);
  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column", alignItems: "stretch",
      justifyContent: "center", padding: "0 9%", gap: 20,
    }}>
      <div style={{
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 280, color: tone.accent,
        lineHeight: 0.5, alignSelf: "flex-start",
        opacity: fadeIn(frame, 0, 8), transform: `scale(${markPop})`, transformOrigin: "left top",
        textShadow: `0 0 60px ${tone.textGlow}`,
      }}>“</div>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis}
        fontSize={92} align="left" maxWidth={1240} plate={overFootage(s)} />
      {s.kicker && (
        <div style={{ alignSelf: "flex-end" }}>
          <Kicker text={s.kicker} tone={tone} delay={16} maxWidth={800} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const CTA: React.FC<{ s: TimedScene; tone: ToneStyle }> = ({ s, tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.045 * Math.sin(frame * 0.22);
  const pop = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  return (
    <Stage gap={40}>
      <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis} fontSize={96} plate={overFootage(s)} />
      <div style={{
        transform: `scale(${popIn(frame, 10, 12) * pulse})`, opacity: pop,
        padding: "26px 64px", borderRadius: 60, background: tone.accent, color: "#050810",
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, letterSpacing: 1,
        boxShadow: `0 0 54px ${tone.accent}88`,
      }}>FOLLOW @{(s.channel ?? "mindwired").toUpperCase()}</div>
    </Stage>
  );
};

export const SceneRouter: React.FC<{ s: TimedScene; tone: ToneStyle; hostMedia?: HostMedia }> = ({ s, tone, hostMedia }) => {
  switch (s.kind) {
    case "hook": return <Hook s={s} tone={tone} />;
    case "problem": return <Problem s={s} tone={tone} hostMedia={hostMedia} />;
    case "shockfact": return <ShockFact s={s} tone={tone} />;
    case "comparison": return <Comparison s={s} tone={tone} />;
    case "transformation": return <Transformation s={s} tone={tone} />;
    case "data": return <Data s={s} tone={tone} />;
    case "quote": return <Quote s={s} tone={tone} />;
    case "cta": return <CTA s={s} tone={tone} />;
  }
};
