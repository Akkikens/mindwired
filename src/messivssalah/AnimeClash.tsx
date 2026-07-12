/** kickoffdaily90 — "Messi vs Mo Salah: World Cup ANIME Edition" (16:9, 1920×1080).
 *  13 Higgsfield anime clips (public/messi-vs-salah/clips/*.mp4), each animated from
 *  a consistent Gemini key-frame, cut fast within 8 narration beats (cloned channel
 *  narrator, public/messi-vs-salah/audio/*.mp3). A live scoreboard bug tracks the real
 *  3-2 comeback vs Egypt (R16, 2026 WC); anime impact captions + white flash-cuts +
 *  shake give it the AMV feel. All text/motion is Remotion. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, random,
} from "remotion";
import "../lib/fonts";

export const FPS = 30;
export const DISPLAY = "'Space Grotesk', sans-serif";
export const BODY = "'Inter', sans-serif";
export const CLIP_FR = 151; // 5.04s @ 30fps — every Higgsfield clip is this long

export const ARG = "#63B3ED"; // Argentina sky-blue
export const EGY = "#FF4D4D"; // Egypt red
export const GOLD = "#FFD86B";

export type Beat = {
  id: string; aud: number; extra?: number; clips: string[];
  arg?: number; egy?: number; tag?: string; noScore?: boolean;
  cap: string; sub: string; shake?: boolean; win?: boolean;
};

export const BEATS: Beat[] = [
  { id: "walkout",   aud: 6.844, clips: ["walkout"],                 noScore: true,                         cap: "MESSI  vs  SALAH",              sub: "World Cup · Round of 16" },
  { id: "egypt",     aud: 3.709, clips: ["salah_score", "1_egypt"],  arg: 0, egy: 2, tag: "67'",             cap: "EGYPT WERE 2–0 UP",             sub: "8 minutes to go" },
  { id: "pen",       aud: 4.911, clips: ["pen_miss", "2_despair"],   arg: 0, egy: 2, tag: "PEN MISS",        cap: "MESSI MISSED A PENALTY",        sub: "It looked over" },
  { id: "powerup",   aud: 2.952, clips: ["messi_eyes", "3_powerup"], arg: 0, egy: 2,                         cap: "THEN THE G.O.A.T. WOKE UP",     sub: "",                        shake: true },
  { id: "equalizer", aud: 4.754, clips: ["4_strike", "net_bulge"],   arg: 2, egy: 2, tag: "84'",             cap: "2–2. MESSI.",                   sub: "Back from the dead",      shake: true },
  { id: "winner",    aud: 6.687, clips: ["winner", "5_victory"],     arg: 3, egy: 2, tag: "90+2",            cap: "ENZO WINS IT — 3–2",            sub: "Greatest comeback of the World Cup", shake: true, win: true },
  { id: "salah_out", aud: 1.071, extra: 1.7, clips: ["salah_dejected"], arg: 3, egy: 2, tag: "FULL TIME",    cap: "SALAH GOES HOME",               sub: "" },
  { id: "clash",     aud: 6.113, clips: ["6_clash"],                 arg: 3, egy: 2, tag: "FULL TIME",       cap: "8 GOALS · PAST MBAPPÉ & HAALAND", sub: "",                       win: true },
];

export const LEAD = 8, HOLD = 14;
export const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const animeClashFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

export const clipSrc = (id: string) => staticFile(`messi-vs-salah/clips/${id}.mp4`);
export const audSrc = (id: string) => staticFile(`messi-vs-salah/audio/${id}.mp3`);

/** one anime clip filling its slice of a beat, with a white flash on the cut-in */
const ClipSlot: React.FC<{ id: string; len: number; shake: boolean; beatId: string }> = ({ id, len, shake, beatId }) => {
  const frame = useCurrentFrame();
  const rate = Math.max(0.5, Math.min(1.7, CLIP_FR / len));
  const scale = interpolate(frame, [0, len], [1.02, 1.1]);
  const flash = interpolate(frame, [0, 6], [0.8, 0], { extrapolateRight: "clamp" });
  const sAmp = shake ? interpolate(frame, [0, 20], [9, 0], { extrapolateRight: "clamp" }) : 0;
  const shx = sAmp * (random(`x${beatId}${id}${Math.floor(frame / 2)}`) - 0.5);
  const shy = sAmp * (random(`y${beatId}${id}${Math.floor(frame / 2)}`) - 0.5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${shx}px, ${shy}px)` }}>
        <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Scoreboard: React.FC<{ b: Beat; frame: number }> = ({ b, frame }) => {
  const drop = spring({ frame: frame - 2, fps: FPS, config: { damping: 14, stiffness: 130 } });
  return (
    <div style={{
      position: "absolute", top: 46, left: "50%",
      transform: `translateX(-50%) translateY(${interpolate(drop, [0, 1], [-70, 0])}px)`,
      display: "flex", alignItems: "center", gap: 18,
      padding: "12px 26px", borderRadius: 14,
      background: "rgba(6,10,22,0.82)", border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: ARG, letterSpacing: 1 }}>ARG</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: "#fff", minWidth: 96, textAlign: "center" }}>
        {b.arg} – {b.egy}
      </span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: EGY, letterSpacing: 1 }}>EGY</span>
      {b.tag ? (
        <span style={{ marginLeft: 6, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: GOLD,
          padding: "4px 10px", borderRadius: 8, background: "rgba(255,216,107,0.14)" }}>{b.tag}</span>
      ) : null}
    </div>
  );
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);

  // split the beat evenly across its clips (fast AMV cuts on multi-clip beats)
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

      {/* readability scrims */}
      <AbsoluteFill style={{ pointerEvents: "none", background:
        "linear-gradient(180deg, rgba(5,7,14,0.6) 0%, transparent 20%, transparent 54%, rgba(5,7,14,0.92) 100%)" }} />
      {b.win ? (
        <AbsoluteFill style={{ pointerEvents: "none", background:
          "radial-gradient(circle at 50% 42%, rgba(255,216,107,0.22), transparent 55%)" }} />
      ) : null}

      {!b.noScore ? <Scoreboard b={b} frame={frame} /> : null}

      <div style={{ position: "absolute", bottom: 120, left: 80, right: 80, textAlign: "center" }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, lineHeight: 1.02,
          color: b.win ? GOLD : "#fff", letterSpacing: 1,
          transform: `scale(${interpolate(capSp, [0, 1], [0.78, 1])}) rotate(${interpolate(capSp, [0, 1], [-2, 0])}deg)`,
          opacity: interpolate(frame - (LEAD + 3), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: "0 6px 30px rgba(0,0,0,0.6)", ...stroke,
        }}>{b.cap}</div>
        {b.sub ? (
          <div style={{
            marginTop: 18, fontFamily: BODY, fontWeight: 600, fontSize: 40, color: "#EAF6FF",
            opacity: subIn, transform: `translateY(${interpolate(subIn, [0, 1], [16, 0])}px)`,
            textShadow: "0 2px 16px rgba(0,0,0,0.8)",
          }}>{b.sub}</div>
        ) : null}
      </div>

      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const AnimeClash: React.FC = () => {
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
