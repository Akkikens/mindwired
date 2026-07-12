/** kickoffdaily90 — "What If Argentina Wins" SHORTS funnel cut (1080×1920, ~60s).
 *  Condensed vertical: fresh hook → Messi's 89' final winner → whistle → the lift →
 *  Maradona → "full ending on the channel" CTA. Reuses the epic's clips/audio; 16:9
 *  clips sit full-width over a blurred fill. Clip audio plays under the VO. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const GOLD = "#FFD86B";

type Clip = { src: string; vol?: number };
type Beat = { id: string; aud: number; extra?: number; clips: Clip[]; cap?: string };

const LIBS: Record<string, { path: string; dur: number }> = {
  arg:   { path: "argentina-wc/clips",   dur: 5.04 },
  gen:   { path: "wc-generic/clips",     dur: 8.0 },
  guard: { path: "guard/clips",          dur: 5.04 },
};

const BEATS: Beat[] = [
  { id: "s_hook", aud: 11.442, cap: "WHAT IF...?",
    clips: [{ src: "guard/ronaldo_fade" }, { src: "guard/salah_fade" }, { src: "guard/messi_last", vol: 0.5 }] },
  { id: "p4_winner", aud: 12.434, extra: 0.5, cap: "MINUTE 89 — THE FINAL",
    clips: [{ src: "arg/messi_final_winner", vol: 0.6 }] },
  { id: "p4_whistle", aud: 1.829, extra: 1.5, clips: [{ src: "arg/fulltime_chaos", vol: 0.7 }] },
  { id: "p5_lift", aud: 10.371, extra: 2.0, cap: "BACK TO BACK",
    clips: [{ src: "arg/trophy_hoist", vol: 0.7 }, { src: "arg/messi_lift_alone", vol: 0.7 }] },
  { id: "p5_maradona", aud: 3.344, extra: 1.5, clips: [{ src: "arg/maradona_tribute" }] },
  { id: "s_cta", aud: 5.59, extra: 0.5, cap: "FULL ENDING ON THE CHANNEL",
    clips: [{ src: "arg/outro_five_flags" }] },
];

const LEAD = 6, HOLD = 8;
const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const whatIfArgShortFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`argentina-wc/audio/${id}.mp3`);

const ClipSlot: React.FC<{ clip: Clip; len: number }> = ({ clip, len }) => {
  const frame = useCurrentFrame();
  const { url, frames } = clipMeta(clip.src);
  const rate = Math.max(0.5, Math.min(1.7, frames / len));
  const scale = interpolate(frame, [0, len], [1.03, 1.11]);
  const flash = interpolate(frame, [0, 6], [0.7, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={url} playbackRate={rate} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: "scale(1.25)", filter: "blur(34px) brightness(0.4)" }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <OffthreadVideo src={url} playbackRate={rate} muted={!clip.vol} volume={clip.vol ?? 0}
          style={{ width: "100%", height: "auto", transform: `scale(${scale})`,
            boxShadow: "0 0 80px rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const n = b.clips.length;
  const slots = b.clips.map((_, i) => ({
    from: Math.round((dur * i) / n),
    len: Math.round((dur * (i + 1)) / n) - Math.round((dur * i) / n),
  }));
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - 2, fps: FPS, config: { damping: 14, stiffness: 140 } });
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i].src}>
          <ClipSlot clip={b.clips[i]} len={s.len} />
        </Sequence>
      ))}
      {b.cap ? (
        <div style={{
          position: "absolute", top: 300, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px) scale(${interpolate(capIn, [0, 1], [0.85, 1])})`,
        }}>
          <span style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 72,
            letterSpacing: 1, color: GOLD, textTransform: "uppercase", lineHeight: 1.1,
            padding: "14px 30px", borderRadius: 14, background: "rgba(6,10,22,0.62)",
            maxWidth: 900, ...stroke,
          }}>{b.cap}</span>
        </div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const WhatIfArgentinaShort: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            <BeatView b={b} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
