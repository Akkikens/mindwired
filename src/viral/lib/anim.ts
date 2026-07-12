/** Frame-based animation helpers. All pure: (frame, …) → value(s).
 *  Compose them into transform strings; nothing here touches React. */
import { Easing, interpolate } from "remotion";

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
export const easeExpo = Easing.out(Easing.exp);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const fadeIn = (frame: number, start: number, dur = 8) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });

export const fadeOut = (frame: number, start: number, dur = 8) =>
  interpolate(frame, [start, start + dur], [1, 0], { ...clamp, easing: easeOut });

export const slideIn = (
  frame: number, start: number, dur = 10,
  direction: "up" | "down" | "left" | "right" = "up", distance = 90,
) => {
  const p = interpolate(frame, [start, start + dur], [1, 0], { ...clamp, easing: easeExpo });
  const dx = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const dy = direction === "up" ? distance : direction === "down" ? -distance : 0;
  return { x: dx * p, y: dy * p, opacity: 1 - p };
};

/** overshoot entrance: 0.6 → 1.06 → 1 */
export const popIn = (frame: number, start: number, dur = 12) =>
  interpolate(frame, [start, start + dur * 0.7, start + dur], [0.6, 1.06, 1], { ...clamp, easing: easeOut });

/** hard camera punch-in that settles (scale multiplier) */
export const punchZoom = (frame: number, start: number, dur = 10, strength = 0.18) =>
  1 + strength * interpolate(frame, [start, start + 2, start + dur], [0, 1, 0.32], { ...clamp, easing: easeOut });

/** decaying jitter; deterministic (no Math.random) */
export const shake = (frame: number, start: number, dur = 14, intensity = 10) => {
  if (frame < start || frame > start + dur) return { x: 0, y: 0, rot: 0 };
  const t = frame - start;
  const decay = 1 - t / dur;
  return {
    x: Math.sin(t * 2.53) * intensity * decay,
    y: Math.cos(t * 3.11) * intensity * 0.7 * decay,
    rot: Math.sin(t * 1.7) * 0.6 * decay,
  };
};

/** slow constant drift for depth layers; depth 0 = locked, 1 = fastest */
export const parallax = (frame: number, depth: number, ampX = 30, ampY = 14) => ({
  x: Math.sin(frame * 0.008) * ampX * depth,
  y: Math.cos(frame * 0.006) * ampY * depth,
});

/** progress 0→1 for masked text wipes */
export const revealProgress = (frame: number, start: number, dur = 12) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeExpo });

/** pulse on a beat grid (bpm) or explicit beat times (seconds) */
export const beatPulse = (
  frame: number, fps: number, opts: { bpm?: number; beatTimes?: number[]; strength?: number },
) => {
  const strength = opts.strength ?? 0.06;
  const t = frame / fps;
  let since = Infinity;
  if (opts.beatTimes?.length) {
    for (const b of opts.beatTimes) if (t >= b) since = Math.min(since, t - b);
  } else {
    const beat = 60 / (opts.bpm ?? 120);
    since = t % beat;
  }
  return 1 + strength * Math.max(0, 1 - since * 9);
};

/** slow cinematic push (scale) across a scene */
export const cameraPush = (frame: number, dur: number, from = 1, to = 1.1) =>
  interpolate(frame, [0, dur], [from, to], { ...clamp, easing: easeInOut });

/** whip-pan transition: returns {x, blur, opacity} for outgoing content.
 *  Use during the last `dur` frames of a scene. */
export const whipOut = (frame: number, sceneDur: number, dur = 7, dir: 1 | -1 = -1) => {
  const start = sceneDur - dur;
  const p = interpolate(frame, [start, sceneDur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return { x: dir * p * 400, blur: p * 26, opacity: 1 - p * 0.4 };
};

/** whip-pan entrance during the first `dur` frames of a scene */
export const whipIn = (frame: number, dur = 7, dir: 1 | -1 = -1) => {
  const p = interpolate(frame, [0, dur], [1, 0], { ...clamp, easing: easeExpo });
  return { x: -dir * p * 400, blur: p * 26, opacity: 1 - p * 0.35 };
};

/** soft-cut entrance: a quick opacity + scale settle so a plain cut doesn't
 *  hard-slam. Materializes from 0.5 opacity (never full black, so adjacent
 *  non-overlapping scenes show no gap) over the first `dur` frames. */
export const dissolveIn = (frame: number, dur = 7) => {
  const p = interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: interpolate(p, [0, 1], [0.5, 1]), scale: interpolate(p, [0, 1], [1.035, 1]) };
};
