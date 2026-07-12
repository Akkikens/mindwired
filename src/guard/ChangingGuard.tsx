/** kickoffdaily90 — "Changing of the Guard" (16:9, 1920×1080).
 *  The golden-era GOATs fade out (nostalgic amber), only Messi is left (gold spotlight),
 *  then the next generation rises (electric) and the question: who takes the crown?
 *  14 Higgsfield anime clips (public/guard/clips/*.mp4) animated from Gemini key-frames,
 *  Cartesia narration (public/guard/audio/*.mp3), per-player name tags, era colour grade.
 *  Crowd ambience bed is mixed at master time (--music). All text/motion is Remotion. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

export const FPS = 30;
export const DISPLAY = "'Space Grotesk', sans-serif";
export const BODY = "'Inter', sans-serif";
export const CLIP_FR = 151;

export type Era = "fade" | "messi" | "rise" | "crown" | "";
export type Beat = {
  id: string; aud: number; clips: string[]; names: string[];
  cap: string; era: Era; extra?: number;
};

export const BEATS: Beat[] = [
  { id: "opener",   aud: 4.519, clips: ["opener_stadium"], names: [""], cap: "", era: "" },
  { id: "fell1",    aud: 7.393, clips: ["modric_fade", "ronaldo_fade"],
    names: ["MODRIĆ", "RONALDO"], cap: "THE GODS ARE FALLING", era: "fade" },
  { id: "fell2",    aud: 8.046, clips: ["neymar_fade", "vini_fade", "salah_fade"],
    names: ["NEYMAR", "VINÍCIUS", "SALAH"], cap: "", era: "fade" },
  { id: "legends",  aud: 9.717, clips: ["kroos_fade", "benzema_fade", "lewandowski_fade", "suarez_fade", "debruyne_fade"],
    names: ["KROOS", "BENZEMA", "LEWANDOWSKI", "SUÁREZ", "DE BRUYNE"], cap: "A FADING ERA", era: "fade" },
  { id: "messi",    aud: 7.314, clips: ["messi_last"], names: ["MESSI"], cap: "THE LAST GOD STANDING", era: "messi", extra: 1.0 },
  { id: "hunters1", aud: 7.001, clips: ["mbappe", "haaland"],
    names: ["MBAPPÉ", "HAALAND"], cap: "THE CROWN IS UP FOR GRABS", era: "rise" },
  { id: "hunters2", aud: 5.486, clips: ["bellingham", "lamine_yamal"],
    names: ["BELLINGHAM", "LAMINE YAMAL"], cap: "", era: "rise" },
  { id: "hunters3", aud: 6.766, clips: ["kane_solo", "pedri_solo", "dembele_solo", "olise_solo"],
    names: ["KANE", "PEDRI", "DEMBÉLÉ", "OLISE"], cap: "", era: "rise" },
  { id: "verdict",  aud: 2.273, clips: ["finalists_three"], names: [""], cap: "WHO FIGHTS FOR THE THRONE?", era: "crown", extra: 2.5 },
  { id: "finale",   aud: 6.609, clips: ["finale_crown"], names: [""], cap: "WHO TAKES THE CROWN?", era: "crown", extra: 0.8 },
];

export const LEAD = 6, HOLD = 10;
export const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const changingGuardFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

export const clipSrc = (id: string) => staticFile(`guard/clips/${id}.mp4`);
export const audSrc = (id: string) => staticFile(`guard/audio/${id}.mp3`);

export const ACCENT: Record<Era, string> = {
  fade: "#FFB347", messi: "#FFD86B", rise: "#36D4FF", crown: "#FFD86B", "": "#EAF2FF",
};
// per-era colour grade over the footage
export const GRADE: Record<Era, string> = {
  fade: "linear-gradient(180deg, rgba(60,30,0,0.35), rgba(20,10,0,0.5))", // warm nostalgic
  messi: "radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,10,0.55) 100%)", // spotlight
  rise: "linear-gradient(180deg, rgba(0,30,60,0.28), rgba(0,10,30,0.42))", // cool electric
  crown: "radial-gradient(circle at 50% 42%, rgba(120,90,0,0.28), rgba(5,5,10,0.5))",
  "": "linear-gradient(180deg, rgba(5,7,14,0.3), rgba(5,7,14,0.5))",
};

const ClipSlot: React.FC<{ id: string; len: number; name: string; era: Era }> = ({ id, len, name, era }) => {
  const frame = useCurrentFrame();
  const rate = Math.max(0.5, Math.min(1.7, CLIP_FR / len));
  const scale = interpolate(frame, [0, len], [1.04, 1.13]);
  const flash = interpolate(frame, [0, 6], [0.75, 0], { extrapolateRight: "clamp" });
  const sat = era === "fade" ? 0.72 : 1.08; // legends slightly desaturated

  const nameSp = spring({ frame: frame - 3, fps: FPS, config: { damping: 13, stiffness: 150 } });
  const nameOut = interpolate(frame, [len - 8, len], [1, 0], { extrapolateLeft: "clamp" });
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

  return (
    <AbsoluteFill>
      <OffthreadVideo src={clipSrc(id)} playbackRate={rate} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale})`, filter: `saturate(${sat})` }} />
      <AbsoluteFill style={{ background: GRADE[era], pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />

      {name ? (
        <div style={{
          position: "absolute", bottom: 132, left: 0, right: 0, textAlign: "center",
          opacity: nameOut,
          transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)`,
        }}>
          <div style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 108,
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

      {/* chapter-label caption (top) */}
      {b.cap ? (
        <div style={{
          position: "absolute", top: 70, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px)`,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 4,
            color: ACCENT[b.era], textTransform: "uppercase",
            padding: "10px 26px", borderRadius: 10, background: "rgba(6,10,22,0.6)",
            ...stroke,
          }}>{b.cap}</span>
        </div>
      ) : null}

      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const ChangingGuard: React.FC = () => {
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
