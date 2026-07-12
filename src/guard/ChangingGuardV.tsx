/** kickoffdaily90 — "Changing of the Guard" VERTICAL cut (1080×1920, Shorts/Reels).
 *  Same beats/clips/VO as ChangingGuard, re-laid-out for 9:16: the 16:9 clip sits
 *  full-width and centered over a blurred fill of itself, name tags + chapter labels
 *  moved into the vertical safe area. Shared data imported from ./ChangingGuard. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import {
  BEATS, Beat, Era, FPS, DISPLAY, CLIP_FR, LEAD, ACCENT, GRADE,
  beatFrames, clipSrc, audSrc,
} from "./ChangingGuard";

export const changingGuardVFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const ClipSlot: React.FC<{ id: string; len: number; name: string; era: Era }> = ({ id, len, name, era }) => {
  const frame = useCurrentFrame();
  const rate = Math.max(0.5, Math.min(1.7, CLIP_FR / len));
  const scale = interpolate(frame, [0, len], [1.04, 1.12]);
  const flash = interpolate(frame, [0, 6], [0.72, 0], { extrapolateRight: "clamp" });
  const sat = era === "fade" ? 0.72 : 1.08;
  const nameSp = spring({ frame: frame - 3, fps: FPS, config: { damping: 13, stiffness: 150 } });
  const nameOut = interpolate(frame, [len - 8, len], [1, 0], { extrapolateLeft: "clamp" });
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
  return (
    <AbsoluteFill>
      {/* blurred ambient fill */}
      <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: "scale(1.25)", filter: `blur(34px) brightness(0.4) saturate(${sat})` }} />
      {/* full 16:9 clip, width-fit, centered */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
          style={{ width: "100%", height: "auto", transform: `scale(${scale})`,
            filter: `saturate(${sat})`, boxShadow: "0 0 80px rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: GRADE[era], pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />

      {name ? (
        <div style={{
          position: "absolute", bottom: 470, left: 0, right: 0, textAlign: "center",
          opacity: nameOut, transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)`,
        }}>
          <div style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 96,
            color: "#fff", letterSpacing: 1, lineHeight: 1,
            borderBottom: `8px solid ${ACCENT[era]}`, paddingBottom: 8,
            textShadow: "0 6px 30px rgba(0,0,0,0.7)", ...stroke,
          }}>{name}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const n = b.clips.length;
  const slots = b.clips.map((_, i) => {
    const from = Math.round((dur * i) / n);
    const to = Math.round((dur * (i + 1)) / n);
    return { from, len: to - from };
  });
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - 2, fps: FPS, config: { damping: 16 } });
  const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i]}>
          <ClipSlot id={b.clips[i]} len={s.len} name={b.names[i] ?? ""} era={b.era} />
        </Sequence>
      ))}
      {b.cap ? (
        <div style={{
          position: "absolute", top: 300, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px)`,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: 3,
            color: ACCENT[b.era], textTransform: "uppercase",
            padding: "12px 28px", borderRadius: 10, background: "rgba(6,10,22,0.62)", ...stroke,
          }}>{b.cap}</span>
        </div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const ChangingGuardV: React.FC = () => {
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
