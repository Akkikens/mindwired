import React, { useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ToneStyle } from "../lib/tone";
import { parallax } from "../lib/anim";

/* deterministic RNG so renders are stable */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Drifting dust/star particles on a parallax layer. */
const Particles: React.FC<{ seed: number; count: number; depth: number; color: string; size: number }> =
  ({ seed, count, depth, color, size }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const pts = useMemo(() => {
      const r = rng(seed);
      return Array.from({ length: count }, () => ({
        x: r() * 100, y: r() * 100, s: 0.5 + r() * size, tw: r() * 6.28, sp: 0.3 + r() * 0.7,
      }));
    }, [seed, count, size]);
    const p = parallax(frame, depth, width * 0.02, height * 0.012);
    return (
      <AbsoluteFill style={{ transform: `translate(${p.x}px, ${p.y}px) scale(1.06)` }}>
        {pts.map((pt, i) => (
          <div key={i} style={{
            position: "absolute", left: `${pt.x}%`, top: `${(pt.y + frame * 0.012 * pt.sp * depth) % 104 - 2}%`,
            width: pt.s * 4, height: pt.s * 4, borderRadius: "50%", backgroundColor: color,
            opacity: 0.25 + 0.3 * Math.abs(Math.sin(frame * 0.03 + pt.tw)),
            filter: `blur(${depth > 0.6 ? 0 : 1.4}px)`,
          }} />
        ))}
      </AbsoluteFill>
    );
  };

/** Big soft floating shapes for depth (blurred glows, not literal circles). */
const FloatingGlows: React.FC<{ tone: ToneStyle; seed: number }> = ({ tone, seed }) => {
  const frame = useCurrentFrame();
  const blobs = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 3 }, (_, i) => ({
      x: 15 + r() * 70, y: 10 + r() * 80, sz: 380 + r() * 420,
      c: i === 0 ? tone.accent : i === 1 ? tone.accent2 : tone.bgA, ph: r() * 6.28,
    }));
  }, [seed, tone]);
  return (
    <AbsoluteFill>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: b.sz, height: b.sz,
          transform: `translate(-50%,-50%) translate(${Math.sin(frame * 0.01 + b.ph) * 40}px, ${Math.cos(frame * 0.008 + b.ph) * 26}px)`,
          borderRadius: "50%", background: `radial-gradient(circle, ${b.c}30 0%, transparent 65%)`,
          filter: "blur(30px)",
        }} />
      ))}
    </AbsoluteFill>
  );
};

/** SVG noise grain overlay — kills the flat-gradient look. A larger 512px tile
 *  (was 240px, which visibly repeated across a 1080/1920 frame) plus a
 *  per-frame position jitter and a slow scale breath so the pattern never reads
 *  as a static tiled texture. */
const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  // large-tile, higher-octave fractal noise; step the offset by prime-ish
  // amounts so successive frames don't land on the same tiling phase
  const ox = (frame * 13) % 512;
  const oy = (frame * 17) % 512;
  return (
    <AbsoluteFill style={{
      opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
      backgroundSize: "512px 512px",
      backgroundPosition: `${ox}px ${oy}px`,
      mixBlendMode: "overlay",
    }} />
  );
};

/** Shared cinematic grade for footage (still or motion b-roll): a shadow-tint
 *  multiply + a warm/accent highlight screen so mixed-source clips (Veo, Kling,
 *  Higgsfield, AI stills) all share one look instead of clashing. Driven by
 *  tone.grade. Only rendered when footage is present — procedural backdrops are
 *  already governed by the tone palette. */
const FootageGrade: React.FC<{ grade: ToneStyle["grade"] }> = ({ grade }) => (
  <>
    <AbsoluteFill style={{ background: grade.shadow, mixBlendMode: "multiply", opacity: grade.strength * 0.6 }} />
    <AbsoluteFill style={{
      background: `radial-gradient(80% 65% at 50% 42%, ${grade.highlight} 0%, transparent 70%)`,
      mixBlendMode: "screen", opacity: grade.strength * 0.5,
    }} />
  </>
);

/** Full layered backdrop: gradient base → optional b-roll (motion clip or AI
 *  still) under a shared grade → floating glows → two parallax particle layers
 *  → grain → vignette. Motion b-roll (brollVideo) is the "cinematic footage"
 *  path — Veo/Kling/Higgsfield clips composited HERE inherit the channel's
 *  captions, palette, grade and grain, instead of being hand-edited off-brand
 *  in ffmpeg (which has no libass on this box anyway). */
export const Backdrop: React.FC<{ tone: ToneStyle; seed: number; broll?: string; brollVideo?: string }> =
  ({ tone, seed, broll, brollVideo }) => {
    const frame = useCurrentFrame();
    const hasFootage = Boolean(brollVideo || broll);
    return (
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 30%, ${tone.bgA} 0%, ${tone.bgB} 78%)` }}>
        {brollVideo ? (
          <AbsoluteFill style={{ transform: `scale(${1.08 + Math.sin(frame * 0.006) * 0.02})` }}>
            <OffthreadVideo src={staticFile(brollVideo)} muted
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72 }} />
            <FootageGrade grade={tone.grade} />
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tone.bgB}99 0%, transparent 38%, ${tone.bgB}E6 100%)` }} />
          </AbsoluteFill>
        ) : broll ? (
          <AbsoluteFill style={{ transform: `scale(${1.08 + Math.sin(frame * 0.006) * 0.02})` }}>
            <Img src={staticFile(broll)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
            <FootageGrade grade={tone.grade} />
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tone.bgB}AA 0%, transparent 40%, ${tone.bgB}DD 100%)` }} />
          </AbsoluteFill>
        ) : null}
        <FloatingGlows tone={tone} seed={seed} />
        <Particles seed={seed + 1} count={hasFootage ? 14 : 26} depth={0.35} color="#8FA8D8" size={1.4} />
        <Particles seed={seed + 2} count={hasFootage ? 8 : 16} depth={0.85} color="#EAF2FF" size={2.2} />
        <Grain opacity={tone.grainOpacity} />
        <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      </AbsoluteFill>
    );
  };
