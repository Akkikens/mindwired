/** kickoffdaily90 — "Messi vs Mo Salah: ANIME Edition" VERTICAL cut (1080×1920, IG Reels).
 *  Same beats/clips/VO as AnimeClash, re-laid-out for 9:16: the 16:9 anime clip sits full-width
 *  and centered over a blurred fill of itself, captions + scoreboard repositioned into the
 *  vertical safe area (clear of IG's bottom/right UI). Shared data imported from ./AnimeClash. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  useCurrentFrame, random,
} from "remotion";
import "../lib/fonts";
import {
  BEATS, Beat, FPS, DISPLAY, BODY, CLIP_FR, ARG, EGY, GOLD, LEAD,
  beatFrames, clipSrc, audSrc,
} from "./AnimeClash";

export const animeClashVFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const ClipSlot: React.FC<{ id: string; len: number; shake: boolean; beatId: string }> = ({ id, len, shake, beatId }) => {
  const frame = useCurrentFrame();
  const rate = Math.max(0.5, Math.min(1.7, CLIP_FR / len));
  const scale = interpolate(frame, [0, len], [1.02, 1.1]);
  const flash = interpolate(frame, [0, 6], [0.8, 0], { extrapolateRight: "clamp" });
  const sAmp = shake ? interpolate(frame, [0, 20], [8, 0], { extrapolateRight: "clamp" }) : 0;
  const shx = sAmp * (random(`x${beatId}${id}${Math.floor(frame / 2)}`) - 0.5);
  const shy = sAmp * (random(`y${beatId}${id}${Math.floor(frame / 2)}`) - 0.5);
  return (
    <AbsoluteFill>
      {/* blurred ambient fill */}
      <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: "scale(1.25)", filter: "blur(34px) brightness(0.42)" }} />
      {/* full 16:9 clip, width-fit, centered */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center",
        transform: `translate(${shx}px, ${shy}px)` }}>
        <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
          style={{ width: "100%", height: "auto", transform: `scale(${scale})`,
            boxShadow: "0 0 80px rgba(0,0,0,0.55)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Scoreboard: React.FC<{ b: Beat; frame: number }> = ({ b, frame }) => {
  const drop = spring({ frame: frame - 2, fps: FPS, config: { damping: 14, stiffness: 130 } });
  return (
    <div style={{
      position: "absolute", top: 230, left: "50%",
      transform: `translateX(-50%) translateY(${interpolate(drop, [0, 1], [-70, 0])}px)`,
      display: "flex", alignItems: "center", gap: 16,
      padding: "14px 28px", borderRadius: 16,
      background: "rgba(6,10,22,0.85)", border: "1px solid rgba(255,255,255,0.16)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: ARG, letterSpacing: 1 }}>ARG</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, color: "#fff", minWidth: 116, textAlign: "center" }}>
        {b.arg} – {b.egy}
      </span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: EGY, letterSpacing: 1 }}>EGY</span>
      {b.tag ? (
        <span style={{ marginLeft: 4, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: GOLD,
          padding: "5px 12px", borderRadius: 9, background: "rgba(255,216,107,0.14)" }}>{b.tag}</span>
      ) : null}
    </div>
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
  const capSp = spring({ frame: frame - (LEAD + 3), fps: FPS, config: { damping: 12, stiffness: 150 } });
  const subIn = interpolate(frame - (LEAD + 14), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i]}>
          <ClipSlot id={b.clips[i]} len={s.len} shake={!!b.shake} beatId={b.id} />
        </Sequence>
      ))}

      {b.win ? (
        <AbsoluteFill style={{ pointerEvents: "none", background:
          "radial-gradient(circle at 50% 46%, rgba(255,216,107,0.20), transparent 55%)" }} />
      ) : null}

      {!b.noScore ? <Scoreboard b={b} frame={frame} /> : null}

      {/* caption block — over the lower part of the centered clip, above IG UI */}
      <div style={{ position: "absolute", top: 1120, left: 60, right: 60, textAlign: "center" }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 80, lineHeight: 1.03,
          color: b.win ? GOLD : "#fff", letterSpacing: 0.5,
          transform: `scale(${interpolate(capSp, [0, 1], [0.78, 1])}) rotate(${interpolate(capSp, [0, 1], [-2, 0])}deg)`,
          opacity: interpolate(frame - (LEAD + 3), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: "0 6px 30px rgba(0,0,0,0.7)", ...stroke,
        }}>{b.cap}</div>
        {b.sub ? (
          <div style={{
            marginTop: 20, fontFamily: BODY, fontWeight: 600, fontSize: 38, color: "#EAF6FF",
            opacity: subIn, transform: `translateY(${interpolate(subIn, [0, 1], [16, 0])}px)`,
            textShadow: "0 2px 16px rgba(0,0,0,0.85)",
          }}>{b.sub}</div>
        ) : null}
      </div>

      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const AnimeClashV: React.FC = () => {
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
