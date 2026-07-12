/** kickoffdaily90 — "What If Argentina Wins the World Cup" (16:9, 1920×1080, ~8 min).
 *  6-part anime epic: the real story (R16 comeback, QF) flows into an explicitly
 *  speculative run to the title. 31 Cartesia narration beats over ~35 clips drawn from
 *  four libraries: argentina-wc (new Higgsfield likeness clips), wc-generic (Veo clips
 *  with native ambient audio), messi-vs-salah and guard (reused). Clips that carry real
 *  crowd audio play it under the VO (vol), the rest are muted; a crowd bed is ducked in
 *  at master time. Per-part colour grades + chapter cards. All text/motion is Remotion. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";

type Era = "nostalgia" | "real" | "spec" | "gold" | "";
type Clip = { src: string; vol?: number };   // src = "<dir>/<name>"; vol>0 → play its audio
type Beat = {
  id: string; aud: number; extra?: number; clips: Clip[];
  names?: string[]; cap?: string; era: Era;
};

// dir → { path prefix, native clip duration (s) }
const LIBS: Record<string, { path: string; dur: number }> = {
  arg:   { path: "argentina-wc/clips",   dur: 5.04 },
  gen:   { path: "wc-generic/clips",     dur: 8.0 },
  mvs:   { path: "messi-vs-salah/clips", dur: 5.04 },
  guard: { path: "guard/clips",          dur: 5.04 },
};

const BEATS: Beat[] = [
  // ── PART 1 — THE OLD GOD ──
  { id: "p1_cold", aud: 18.625, era: "nostalgia", cap: "THE LAST DANCE",
    clips: [{ src: "gen/stadium_dawn", vol: 0.6 }, { src: "guard/messi_last", vol: 0.5 }], names: ["", "MESSI · 39"] },
  { id: "p1_gods", aud: 14.994, era: "nostalgia",
    clips: [{ src: "guard/ronaldo_fade" }, { src: "guard/modric_fade" }, { src: "guard/neymar_fade" }, { src: "guard/salah_fade" }],
    names: ["RONALDO", "MODRIĆ", "NEYMAR", "SALAH"] },
  { id: "p1_comeback", aud: 21.969, era: "real", cap: "THE RESURRECTION · ARG 3–2 EGY",
    clips: [{ src: "mvs/1_egypt" }, { src: "mvs/pen_miss" }, { src: "mvs/4_strike" }, { src: "mvs/winner" }] },
  { id: "p1_resurrection", aud: 4.545, era: "real", clips: [{ src: "mvs/messi_eyes" }] },
  { id: "p1_title", aud: 2.116, extra: 2.2, era: "gold", cap: "WHAT IF ARGENTINA WINS THE WORLD CUP?",
    clips: [{ src: "gen/trophy_macro", vol: 0.6 }] },
  // ── PART 1B — THE WEIGHT OF HISTORY ──
  { id: "p1b_history", aud: 16.379, era: "nostalgia", cap: "★ ★ ★",
    clips: [{ src: "gen/arg_flag_wave", vol: 0.5 }, { src: "gen/arg_fans_sea", vol: 0.5 }] },
  { id: "p1b_fourth", aud: 12.695, era: "gold", cap: "THE FOURTH STAR",
    clips: [{ src: "gen/stadium_night_full", vol: 0.5 }] },
  // ── PART 2 — THE QUARTERFINAL (real fixture) ──
  { id: "p2_swiss", aud: 14.838, era: "real", cap: "QUARTERFINAL · SWITZERLAND",
    clips: [{ src: "gen/tunnel_silhouettes", vol: 0.6 }, { src: "gen/boot_ball_rain", vol: 0.6 }] },
  { id: "p2_pens", aud: 18.808, era: "spec", cap: "PENALTIES",
    clips: [{ src: "gen/penalty_silhouette", vol: 0.6 }, { src: "gen/penalty_silhouette", vol: 0.6 }] },
  { id: "p2_alvarez", aud: 13.087, era: "real", clips: [{ src: "arg/alvarez_goal" }], names: ["ÁLVAREZ"] },
  { id: "p2_torch", aud: 8.385, extra: 1.0, era: "nostalgia", clips: [{ src: "arg/locker_torch_pass" }] },
  // ── PART 2B — THE MACHINE ──
  { id: "p2b_squad", aud: 19.487, era: "real", cap: "NEVER JUST MESSI",
    clips: [{ src: "mvs/5_victory" }, { src: "mvs/net_bulge" }, { src: "mvs/3_powerup" }],
    names: ["", "", ""] },
  { id: "p2b_hunger", aud: 9.979, era: "gold", clips: [{ src: "gen/trophy_reach", vol: 0.6 }] },
  // ── PART 3 — THE SEMIFINAL (speculative) ──
  { id: "p3_imagine", aud: 10.789, era: "spec", cap: "NOW IMAGINE — THE SEMIFINAL",
    clips: [{ src: "gen/stadium_night_full", vol: 0.5 }] },
  { id: "p3_down", aud: 11.18, era: "spec", clips: [{ src: "gen/penalty_silhouette", vol: 0.6 }] },
  { id: "p3_level", aud: 9.038, era: "spec", clips: [{ src: "mvs/3_powerup" }, { src: "mvs/4_strike" }] },
  { id: "p3_extra", aud: 16.535, extra: 1.0, era: "spec", cap: "MINUTE 118",
    clips: [{ src: "arg/semifinal_winner" }] },
  // ── PART 3B — GOLDEN BOOT ──
  { id: "p3b_boot", aud: 15.334, era: "real", cap: "THE GOLDEN BOOT RACE",
    clips: [{ src: "guard/mbappe" }, { src: "guard/haaland" }, { src: "mvs/net_bulge" }],
    names: ["MBAPPÉ · 7", "HAALAND · 7", "MESSI · 8"] },
  // ── PART 4 — THE FINAL (speculative) ──
  { id: "p4_final", aud: 11.99, era: "spec", cap: "THE FINAL",
    clips: [{ src: "gen/tunnel_silhouettes", vol: 0.6 }] },
  { id: "p4_concede", aud: 10.397, era: "spec", clips: [{ src: "arg/opponent_generic_open" }] },
  { id: "p4_equal", aud: 9.404, era: "spec", clips: [{ src: "arg/argentina_equalizer_scrappy" }] },
  { id: "p4_winner", aud: 12.434, extra: 1.0, era: "gold", clips: [{ src: "arg/messi_final_winner", vol: 0.6 }], names: ["MESSI · 89'"] },
  { id: "p4_whistle", aud: 1.829, extra: 2.0, era: "gold", clips: [{ src: "arg/fulltime_chaos", vol: 0.7 }] },
  // ── PART 5 — THE LIFT ──
  { id: "p5_champions", aud: 3.866, extra: 1.5, era: "gold", cap: "CHAMPIONS OF THE WORLD",
    clips: [{ src: "arg/trophy_confetti", vol: 0.7 }] },
  { id: "p5_lift", aud: 10.371, extra: 3.0, era: "gold",
    clips: [{ src: "arg/trophy_hoist", vol: 0.7 }, { src: "arg/messi_lift_alone", vol: 0.7 }] },
  { id: "p5_maradona", aud: 3.344, extra: 2.0, era: "nostalgia", clips: [{ src: "arg/maradona_tribute" }] },
  { id: "p5_parade", aud: 7.811, extra: 1.0, era: "gold", clips: [{ src: "gen/arg_bus_parade", vol: 0.6 }] },
  { id: "p5_records", aud: 23.928, era: "gold", cap: "WHAT IT WOULD MEAN",
    clips: [{ src: "gen/confetti_storm", vol: 0.5 }, { src: "gen/trophy_macro", vol: 0.4 }, { src: "arg/messi_lift_orbit" }] },
  { id: "p5_shirt", aud: 9.639, extra: 1.5, era: "nostalgia", clips: [{ src: "gen/arg_shirt_locker", vol: 0.6 }] },
  // ── PART 6 — OUTRO ──
  { id: "p6_whatif", aud: 6.217, era: "", clips: [{ src: "gen/stadium_dawn", vol: 0.5 }] },
  { id: "p6_series", aud: 12.069, extra: 1.0, era: "spec", cap: "WHICH ENDING DO YOU WANT NEXT?",
    clips: [{ src: "arg/outro_five_flags" }] },
  { id: "p6_cta", aud: 3.892, era: "gold", clips: [{ src: "gen/trophy_reach", vol: 0.5 }] },
];

const LEAD = 6, HOLD = 10;
const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const whatIfArgentinaFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`argentina-wc/audio/${id}.mp3`);

const ACCENT: Record<Era, string> = {
  nostalgia: "#FFB347", real: "#63B3ED", spec: "#B48CFF", gold: "#FFD86B", "": "#EAF2FF",
};
const GRADE: Record<Era, string> = {
  nostalgia: "linear-gradient(180deg, rgba(60,30,0,0.30), rgba(20,10,0,0.45))",
  real: "linear-gradient(180deg, rgba(0,20,50,0.20), rgba(0,8,25,0.38))",
  spec: "linear-gradient(180deg, rgba(30,0,60,0.24), rgba(10,0,25,0.42))",
  gold: "radial-gradient(circle at 50% 42%, rgba(120,90,0,0.22), rgba(5,5,10,0.45))",
  "": "linear-gradient(180deg, rgba(5,7,14,0.28), rgba(5,7,14,0.45))",
};

const ClipSlot: React.FC<{ clip: Clip; len: number; name: string; era: Era }> = ({ clip, len, name, era }) => {
  const frame = useCurrentFrame();
  const { url, frames } = clipMeta(clip.src);
  const rate = Math.max(0.5, Math.min(1.6, frames / len));
  const scale = interpolate(frame, [0, len], [1.03, 1.11]);
  const flash = interpolate(frame, [0, 6], [0.7, 0], { extrapolateRight: "clamp" });
  const sat = era === "nostalgia" ? 0.78 : 1.06;
  const nameSp = spring({ frame: frame - 4, fps: FPS, config: { damping: 13, stiffness: 150 } });
  const nameOut = interpolate(frame, [len - 8, len], [1, 0], { extrapolateLeft: "clamp" });
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

  return (
    <AbsoluteFill>
      <OffthreadVideo src={url} playbackRate={rate} muted={!clip.vol} volume={clip.vol ?? 0}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale})`, filter: `saturate(${sat})` }} />
      <AbsoluteFill style={{ background: GRADE[era], pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {name ? (
        <div style={{
          position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
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
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i].src}>
          <ClipSlot clip={b.clips[i]} len={s.len} name={b.names?.[i] ?? ""} era={b.era} />
        </Sequence>
      ))}
      {b.cap ? (
        <div style={{
          position: "absolute", top: 70, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px)`,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 4,
            color: ACCENT[b.era], textTransform: "uppercase",
            padding: "10px 26px", borderRadius: 10, background: "rgba(6,10,22,0.62)", ...stroke,
          }}>{b.cap}</span>
        </div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const WhatIfArgentina: React.FC = () => {
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
