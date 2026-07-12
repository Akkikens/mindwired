/** Procedural cinematic graphics for the rogue-planet episode — all code-drawn
 *  (DOM/SVG), no --gl flag, no external footage. These are the "NASA-style" thin-
 *  line diagrams, glowing labels, animated timeline, solar-system map and orbit-
 *  distortion visuals the brief asks for. Everything is deterministic per frame
 *  (seeded rng) so renders are stable. */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, SANS } from "../../lib/theme";

// ── seeded rng (deterministic; never Math.random at render time) ────────────────
const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// ── deep parallax starfield with slow drift + faint twinkle ─────────────────────
export const Starfield: React.FC<{
  count?: number; seed?: number; drift?: number; hue?: string; twinkle?: boolean;
}> = ({ count = 220, seed = 7, drift = 6, hue = C.ice, twinkle = true }) => {
  const frame = useCurrentFrame();
  const rnd = mulberry32(seed);
  const stars = React.useMemo(() => Array.from({ length: count }, () => ({
    x: rnd() * 100, y: rnd() * 100, r: 0.4 + rnd() * 1.8, depth: 0.3 + rnd() * 1,
    ph: rnd() * Math.PI * 2, tw: 0.4 + rnd() * 0.6,
  })), [count, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {stars.map((s, i) => {
        const dx = Math.sin(frame / 240 + s.ph) * drift * s.depth;
        const dy = (frame / 60) * 0.06 * s.depth;
        const tw = twinkle ? 0.55 + 0.45 * Math.sin(frame / 18 * s.tw + s.ph) : 1;
        return (
          <div key={i} style={{
            position: "absolute", left: `${s.x}%`, top: `${(s.y + dy) % 100}%`,
            width: s.r * 2, height: s.r * 2, borderRadius: "50%",
            background: hue, opacity: 0.5 * s.depth * tw,
            transform: `translateX(${dx}px)`,
            boxShadow: s.r > 1.4 ? `0 0 ${s.r * 4}px ${hue}` : "none",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── slow-drifting cosmic dust (adds depth / motion to any scene) ─────────────────
export const DustField: React.FC<{ seed?: number; color?: string; count?: number }> = ({
  seed = 21, color = C.cyan, count = 42,
}) => {
  const frame = useCurrentFrame();
  const rnd = mulberry32(seed);
  const bits = React.useMemo(() => Array.from({ length: count }, () => ({
    x: rnd() * 100, y: rnd() * 100, r: 8 + rnd() * 26, sp: 0.2 + rnd() * 0.8, ph: rnd() * 6.28,
  })), [count, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {bits.map((b, i) => (
        <div key={i} style={{
          position: "absolute", left: `${b.x}%`,
          top: `${(b.y + (frame / 60) * b.sp) % 100}%`,
          width: b.r, height: b.r, borderRadius: "50%",
          background: `radial-gradient(circle, ${color}22, transparent 70%)`,
          opacity: 0.4 + 0.3 * Math.sin(frame / 40 + b.ph),
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ── the rogue planet: a dark sphere with faint blue rim light + ice haze ─────────
export const RoguePlanet: React.FC<{
  cx: number; cy: number; r: number; rim?: string; drift?: number; glow?: number;
}> = ({ cx, cy, r, rim = "#5FA8FF", drift = 0, glow = 1 }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 90) * drift;
  return (
    <div style={{ position: "absolute", left: cx + wob, top: cy, transform: "translate(-50%,-50%)" }}>
      {/* outer ice haze */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: r * 3.4, height: r * 3.4,
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(circle, ${rim}22 0%, ${rim}0d 40%, transparent 68%)`,
        opacity: glow,
      }} />
      {/* the body: mostly black, lit only at a crescent rim */}
      <div style={{
        position: "relative", width: r * 2, height: r * 2, borderRadius: "50%",
        background: `radial-gradient(circle at 63% 40%, #0b1220 0%, #050810 46%, #010208 100%)`,
        boxShadow: `inset ${-r * 0.55}px ${-r * 0.15}px ${r * 0.9}px #000,
                    inset ${r * 0.5}px ${r * 0.2}px ${r * 0.7}px ${rim}2e,
                    0 0 ${r * 0.7}px ${rim}${glow > 0.6 ? "55" : "22"}`,
      }}>
        {/* crescent rim light */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle at 88% 30%, ${rim}cc 0%, ${rim}44 6%, transparent 16%)`,
          mixBlendMode: "screen",
        }} />
      </div>
    </div>
  );
};

// ── gravitational microlensing: a star brightens into an Einstein ring as an
//    invisible mass drifts across it (progress 0→1) ─────────────────────────────
export const Microlensing: React.FC<{ cx: number; cy: number; progress: number }> = ({ cx, cy, progress }) => {
  const p = clamp01(progress);
  if (p <= 0.001) return null; // invisible until the mass begins its transit
  const bump = Math.sin(p * Math.PI); // brighten then fade
  const ringR = interpolate(bump, [0, 1], [8, 46]);
  const ringO = bump;
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)" }}>
      <div style={{
        width: 14 + bump * 10, height: 14 + bump * 10, borderRadius: "50%",
        background: "#fff", boxShadow: `0 0 ${18 + bump * 60}px #cfe6ff, 0 0 ${bump * 120}px #7fc0ff`,
        transform: "translate(-50%,-50%)", position: "absolute",
      }} />
      {/* Einstein ring */}
      <div style={{
        width: ringR * 2, height: ringR * 2, borderRadius: "50%", position: "absolute",
        transform: "translate(-50%,-50%)", border: `2px solid rgba(180,220,255,${ringO * 0.8})`,
        boxShadow: `0 0 ${18 * ringO}px rgba(120,190,255,${ringO})`,
        filter: `blur(${0.6}px)`,
      }} />
    </div>
  );
};

// ── glowing data label with an optional leader line (thin-line diagram style) ────
export const GlowLabel: React.FC<{
  x: number; y: number; title: string; value?: string; color?: string;
  appearAt: number; align?: "left" | "right"; leaderTo?: { x: number; y: number };
}> = ({ x, y, title, value, color = C.cyan, appearAt, align = "left", leaderTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 16, stiffness: 120 } });
  const op = interpolate(frame - appearAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <>
      {leaderTo && (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <line x1={leaderTo.x} y1={leaderTo.y} x2={x} y2={y}
            stroke={color} strokeWidth={1.5} strokeDasharray="3 4"
            opacity={op * 0.7} />
          <circle cx={leaderTo.x} cy={leaderTo.y} r={3.5} fill={color} opacity={op} />
        </svg>
      )}
      <div style={{
        position: "absolute", left: x, top: y, opacity: op,
        transform: `translate(${align === "right" ? "-100%" : "0"}, -50%) translateX(${interpolate(s, [0, 1], [align === "right" ? 16 : -16, 0])}px)`,
        textAlign: align, pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: SANS, fontSize: 19, fontWeight: 700, letterSpacing: 3,
          color, textTransform: "uppercase", textShadow: `0 0 12px ${color}88`,
        }}>{title}</div>
        {value && <div style={{
          fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1.05,
          textShadow: "0 2px 14px rgba(0,0,0,0.7)", marginTop: 2,
        }}>{value}</div>}
      </div>
    </>
  );
};

// ── cinematic lower-third data bar (clean, scientific — NOT a news chyron) ───────
export const LowerThird: React.FC<{
  kicker: string; line: string; color?: string; appearAt: number; hold?: number;
}> = ({ kicker, line, color = C.cyan, appearAt, hold = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: { damping: 18 } });
  const outAt = appearAt + hold * fps;
  const op = Math.min(
    interpolate(frame - appearAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [outAt, outAt + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: 120, bottom: 190, opacity: op,
      transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`, pointerEvents: "none",
    }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
        <div style={{ width: 4, background: color, borderRadius: 2, boxShadow: `0 0 14px ${color}` }} />
        <div>
          <div style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, letterSpacing: 4, color, textTransform: "uppercase", textShadow: `0 0 12px ${color}66` }}>{kicker}</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 600, color: C.white, marginTop: 4, textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>{line}</div>
        </div>
      </div>
    </div>
  );
};

// ── hard kinetic text stab — the recurring pattern-interrupt hits ───────────────
export const TextHit: React.FC<{
  text: string; appearAt: number; hold?: number; color?: string; size?: number;
  x?: number; y?: number; sub?: string;
}> = ({ text, appearAt, hold = 1.6, color = C.danger, size = 116, x = 960, y = 540, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - appearAt;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const outAt = hold * fps;
  const op = Math.min(
    interpolate(t, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(t, [outAt, outAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  if (op <= 0) return null;
  const shake = t < 6 ? (6 - t) * 1.4 * Math.sin(t * 3) : 0;
  return (
    <div style={{
      position: "absolute", left: x, top: y, opacity: op,
      transform: `translate(-50%,-50%) translateX(${shake}px) scale(${interpolate(s, [0, 1], [1.35, 1])})`,
      textAlign: "center", pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: 4, lineHeight: 0.95,
        color: C.white, WebkitTextStroke: `2px ${color}`,
        textShadow: `0 0 34px ${color}, 0 0 70px ${color}66, 0 6px 30px rgba(0,0,0,0.7)`,
      }}>{text}</div>
      {sub && <div style={{ marginTop: 12, fontFamily: SANS, fontSize: 24, letterSpacing: 6, color, textTransform: "uppercase", opacity: 0.9 }}>{sub}</div>}
    </div>
  );
};

// ── animated solar-system map: Sun + thin glowing orbit rings + planets, with a
//    rogue planet entering from beyond Neptune and (optionally) bending orbits ───
const PLANETS = [
  { r: 70,  col: "#b8b0a4", sp: 1.6, sz: 4 },   // Mercury
  { r: 100, col: "#d9b27a", sp: 1.15, sz: 6 },  // Venus
  { r: 138, col: C.earthGlow, sp: 1.0, sz: 6.5 }, // Earth
  { r: 176, col: "#d0715a", sp: 0.8, sz: 5.5 }, // Mars
  { r: 244, col: "#e0b070", sp: 0.5, sz: 12 },  // Jupiter
  { r: 306, col: "#e8d9a8", sp: 0.38, sz: 10 }, // Saturn
  { r: 360, col: "#8fd0e0", sp: 0.28, sz: 7 },  // Uranus
  { r: 410, col: "#5a78d0", sp: 0.22, sz: 7 },  // Neptune
];

export const SolarSystemMap: React.FC<{
  cx?: number; cy?: number; scale?: number;
  rogueProgress?: number;   // 0 = far beyond Neptune, 1 = deep inside
  distort?: number;         // 0..1 how much outer orbits warp toward the rogue
  highlightBelt?: boolean;  // Kuiper/Oort reservoir ring
  labelEarth?: boolean;
}> = ({ cx = 760, cy = 560, scale = 1, rogueProgress = 0, distort = 0, highlightBelt = false, labelEarth = false }) => {
  const frame = useCurrentFrame();
  const p = clamp01(rogueProgress);
  // rogue travels along a diagonal from top-right toward the inner system
  const rx = interpolate(p, [0, 1], [cx + 560 * scale, cx + 150 * scale]);
  const ry = interpolate(p, [0, 1], [cy - 430 * scale, cy - 40 * scale]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="45%" stopColor={C.amber} />
            <stop offset="100%" stopColor="#FF6A2C" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* orbit rings */}
        {PLANETS.map((pl, i) => {
          const rr = pl.r * scale;
          // outer orbits (Uranus/Neptune) warp toward the rogue as distort rises
          const isOuter = i >= 6;
          const warp = isOuter ? distort * 26 * (i - 5) : 0;
          const cxw = cx + (warp) * (rx > cx ? 1 : -1);
          const cyw = cy - (warp) * 0.4;
          return (
            <ellipse key={`o${i}`} cx={cxw} cy={cyw}
              rx={rr + warp * 0.6} ry={rr * 0.9 - warp * 0.3}
              fill="none" stroke={isOuter && distort > 0.05 ? C.danger : C.panelEdge}
              strokeWidth={isOuter && distort > 0.05 ? 1.6 : 1}
              opacity={0.35 + (isOuter ? distort * 0.4 : 0)} />
          );
        })}
        {/* Kuiper/Oort reservoir belt */}
        {highlightBelt && (
          <ellipse cx={cx} cy={cy} rx={455 * scale} ry={410 * scale}
            fill="none" stroke={C.ice} strokeWidth={2} strokeDasharray="2 6" opacity={0.5} />
        )}
      </svg>
      {/* Sun */}
      <div style={{
        position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)",
        width: 120 * scale, height: 120 * scale, borderRadius: "50%",
        background: "url(#sunGrad)",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle, #FFF4D6 0%, ${C.amber} 42%, rgba(255,106,44,0) 100%)`,
          boxShadow: `0 0 ${60 * scale}px ${C.amber}, 0 0 ${120 * scale}px ${C.ember}66`,
          transform: `scale(${1 + 0.03 * Math.sin(frame / 20)})`,
        }} />
      </div>
      {/* planets */}
      {PLANETS.map((pl, i) => {
        const rr = pl.r * scale;
        const ang = frame * 0.006 * pl.sp + i * 1.3;
        const px = cx + Math.cos(ang) * rr;
        const py = cy + Math.sin(ang) * rr * 0.9;
        return (
          <div key={`p${i}`} style={{
            position: "absolute", left: px, top: py, transform: "translate(-50%,-50%)",
            width: pl.sz * scale, height: pl.sz * scale, borderRadius: "50%",
            background: pl.col, boxShadow: `0 0 ${pl.sz * scale}px ${pl.col}`,
          }}>
            {labelEarth && i === 2 && (
              <div style={{
                position: "absolute", left: pl.sz * scale + 8, top: -8, whiteSpace: "nowrap",
                fontFamily: SANS, fontSize: 15, fontWeight: 700, letterSpacing: 2, color: C.earthGlow,
                textShadow: `0 0 10px ${C.earthGlow}`,
              }}>EARTH</div>
            )}
          </div>
        );
      })}
      {/* rogue planet + its incoming path */}
      {p > 0.001 && (
        <>
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line x1={cx + 560 * scale} y1={cy - 430 * scale} x2={rx} y2={ry}
              stroke={C.danger} strokeWidth={1.6} strokeDasharray="4 6" opacity={0.55} />
          </svg>
          <RoguePlanet cx={rx} cy={ry} r={20 * scale} rim="#6aa0ff" glow={0.9} />
          <GlowLabel x={rx + 30} y={ry - 20} title="Rogue planet" color={C.danger} appearAt={0} />
        </>
      )}
    </div>
  );
};

// ── animated event timeline: nodes light up in sequence (the cascade of signs) ──
export const EventTimeline: React.FC<{
  items: string[]; startAt: number; step?: number; x?: number; y?: number; w?: number; color?: string;
}> = ({ items, startAt, step = 22, x = 300, y = 900, w = 1320, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const seg = w / (items.length - 1);
  const progressed = clamp01((frame - startAt) / (step * items.length));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <line x1={x} y1={y} x2={x + w} y2={y} stroke={C.panelEdge} strokeWidth={2} />
        <line x1={x} y1={y} x2={x + w * progressed} y2={y} stroke={color} strokeWidth={2.5}
          opacity={0.9} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      {items.map((it, i) => {
        const nodeAt = startAt + i * step;
        const lit = frame >= nodeAt;
        const s = interpolate(frame - nodeAt, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: x + i * seg, top: y, transform: "translate(-50%,-50%)" }}>
            <div style={{
              width: lit ? 16 : 10, height: lit ? 16 : 10, borderRadius: "50%",
              background: lit ? color : C.panel, border: `2px solid ${lit ? color : C.panelEdge}`,
              boxShadow: lit ? `0 0 16px ${color}` : "none", transition: "none",
              transform: `scale(${0.6 + s * 0.4})`,
            }} />
            <div style={{
              position: "absolute", left: "50%", top: -14, transform: "translate(-50%,-100%)",
              whiteSpace: "nowrap", fontFamily: SANS, fontSize: 18, fontWeight: 700, letterSpacing: 2,
              color: lit ? C.white : C.faint, opacity: s, textTransform: "uppercase",
              textShadow: lit ? `0 0 10px ${color}66` : "none",
            }}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── comet storm: icy bodies flung inward from the outer belt on glowing arcs ─────
export const CometStorm: React.FC<{ cx?: number; cy?: number; count?: number; seed?: number; intensity?: number }> = ({
  cx = 960, cy = 540, count = 26, seed = 5, intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const rnd = mulberry32(seed);
  const comets = React.useMemo(() => Array.from({ length: count }, () => ({
    ang: rnd() * Math.PI * 2, r0: 520 + rnd() * 260, sp: 0.004 + rnd() * 0.006,
    ph: rnd() * 300, len: 60 + rnd() * 120, col: rnd() > 0.5 ? C.ice : C.cyan,
  })), [count, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {comets.map((c, i) => {
        const t = ((frame + c.ph) * c.sp) % 1;
        const r = interpolate(t, [0, 1], [c.r0, 40]);
        const px = cx + Math.cos(c.ang) * r;
        const py = cy + Math.sin(c.ang) * r * 0.92;
        const tailAng = (c.ang + Math.PI) * (180 / Math.PI);
        const op = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]) * intensity;
        return (
          <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) rotate(${tailAng}deg)`, opacity: op }}>
            <div style={{ width: c.len, height: 2.4, background: `linear-gradient(90deg, transparent, ${c.col})`, boxShadow: `0 0 8px ${c.col}` }} />
            <div style={{ position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: `0 0 12px ${c.col}` }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Earth's orbit stretching from a stable circle into a dangerous ellipse ──────
export const OrbitEllipse: React.FC<{ stretch: number; cx?: number; cy?: number; base?: number }> = ({
  stretch, cx = 960, cy = 560, base = 300,
}) => {
  const frame = useCurrentFrame();
  const s = clamp01(stretch);
  const rx = base * (1 + s * 0.55);
  const ry = base * (1 - s * 0.32);
  const focusShift = rx - base; // Sun sits at a focus as it stretches
  const sunX = cx - focusShift;
  const ang = frame * 0.012;
  // Earth moves faster near perihelion (right side, close to Sun)
  const ex = cx + Math.cos(ang) * rx;
  const ey = cy + Math.sin(ang) * ry;
  const dPeri = Math.hypot(ex - sunX, ey - cy);
  const near = dPeri < base * 0.9;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* safe reference circle (ghost) */}
        <ellipse cx={cx} cy={cy} rx={base} ry={base} fill="none" stroke={C.panelEdge} strokeWidth={1.4} strokeDasharray="3 6" opacity={0.5} />
        {/* the stretching orbit — red at the dangerous extremes */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
          stroke={s > 0.15 ? C.danger : C.cyan} strokeWidth={2.4}
          opacity={0.85} style={{ filter: `drop-shadow(0 0 8px ${s > 0.15 ? C.danger : C.cyan})` }} />
      </svg>
      {/* Sun at focus (shrinks slightly as orbit widens = colder aphelion) */}
      <div style={{
        position: "absolute", left: sunX, top: cy, transform: "translate(-50%,-50%)",
        width: 70, height: 70, borderRadius: "50%",
        background: `radial-gradient(circle, #FFF4D6, ${C.amber} 45%, transparent 75%)`,
        boxShadow: `0 0 50px ${C.amber}`,
      }} />
      {/* Earth */}
      <div style={{
        position: "absolute", left: ex, top: ey, transform: "translate(-50%,-50%)",
        width: 16, height: 16, borderRadius: "50%",
        background: near ? C.ember : C.earthGlow,
        boxShadow: `0 0 18px ${near ? C.ember : C.earthGlow}`,
      }} />
    </div>
  );
};

// ── worst case: Earth thrown off its circle onto an open, escaping path ──────────
export const EjectionPath: React.FC<{ progress: number; cx?: number; cy?: number }> = ({ progress, cx = 820, cy = 560 }) => {
  const frame = useCurrentFrame();
  const p = clamp01(progress);
  const base = 240;
  // Earth spirals outward once the encounter hits (p>0.4)
  const ang = frame * 0.02;
  const r = base + interpolate(p, [0.35, 1], [0, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ex = cx + Math.cos(ang) * r;
  const ey = cy + Math.sin(ang) * r * 0.7;
  const sunScale = interpolate(p, [0.35, 1], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <ellipse cx={cx} cy={cy} rx={base} ry={base * 0.7} fill="none" stroke={C.panelEdge} strokeWidth={1.3} strokeDasharray="3 6" opacity={0.4} />
        {/* escaping trail */}
        <path d={`M ${cx + base} ${cy} Q ${cx + r * 0.6} ${cy - r * 0.3} ${ex} ${ey}`}
          fill="none" stroke={C.danger} strokeWidth={2} strokeDasharray="4 5" opacity={0.6 * p} />
      </svg>
      <div style={{
        position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${sunScale})`,
        width: 90, height: 90, borderRadius: "50%",
        background: `radial-gradient(circle, #FFF4D6, ${C.amber} 45%, transparent 75%)`,
        boxShadow: `0 0 ${60 * sunScale}px ${C.amber}`,
      }} />
      <div style={{
        position: "absolute", left: ex, top: ey, transform: "translate(-50%,-50%)",
        width: 18, height: 18, borderRadius: "50%",
        background: interpolate(p, [0.4, 1], [1, 0]) > 0.5 ? C.earthGlow : "#2a4a80",
        boxShadow: `0 0 20px ${C.earthGlow}`,
      }} />
    </div>
  );
};

// ── frozen wandering Earth (procedural fallback / overlay): ice creeping over a
//    dimming globe with a shrinking distant sun ──────────────────────────────────
export const FrozenEarth: React.FC<{ freeze: number; cx?: number; cy?: number; r?: number }> = ({
  freeze, cx = 960, cy = 540, r = 190,
}) => {
  const f = clamp01(freeze);
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)" }}>
      {/* distant, shrinking sun */}
      <div style={{
        position: "absolute", left: -520, top: -320, width: interpolate(f, [0, 1], [90, 34]), height: interpolate(f, [0, 1], [90, 34]),
        borderRadius: "50%", background: `radial-gradient(circle, #FFF0CE, ${C.amber} 50%, transparent 78%)`,
        boxShadow: `0 0 ${interpolate(f, [0, 1], [60, 16])}px ${C.amber}`, opacity: interpolate(f, [0, 1], [1, 0.6]),
      }} />
      <div style={{
        width: r * 2, height: r * 2, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 34%, ${C.earthLand} 0%, ${C.earthCore} 46%, #0a1830 100%)`,
        boxShadow: `inset -${r * 0.4}px -${r * 0.2}px ${r * 0.8}px #000, 0 0 ${r * 0.5}px ${C.atmo}44`,
        position: "relative", overflow: "hidden",
      }}>
        {/* ice sheet spreading from poles */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle at 50% 8%, rgba(230,245,255,${0.9 * f}) 0%, transparent ${interpolate(f, [0, 1], [10, 46])}%),
                       radial-gradient(circle at 50% 92%, rgba(230,245,255,${0.9 * f}) 0%, transparent ${interpolate(f, [0, 1], [10, 46])}%)`,
          mixBlendMode: "screen",
        }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `rgba(120,160,220,${0.28 * f})` }} />
      </div>
    </div>
  );
};
