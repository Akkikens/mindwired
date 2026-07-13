/** kickoffdaily90 — "Messi vs Bellingham" semifinal preview (1920×1080, ~3.6 min).
 *  Jamie Veo bookends + doc narration; ARG sky-blue vs ENG red duel palette.
 *  Loop: "one number tells you who wins" (n_hook2) → giant ZERO card (n_number). */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const GOLD = "#FFD86B";
const ARG = "#63B3ED";
const ENG = "#FF4D4D";

type Clip = { src: string; vol?: number };
type Row = { label: string; v: number; fmt?: string };
type Beat =
  | { kind: "host"; id: string; dur: number }
  | { kind: "seg"; id: string; aud: number; extra?: number; clips: Clip[];
      names?: string[]; cap?: string }
  | { kind: "card"; id: string; aud: number; extra?: number; title: string; c: string;
      rows: Row[]; headline: string; bg: string }
  | { kind: "zero"; id: string; aud: number; extra?: number };

const LIBS: Record<string, { path: string; dur: number }> = {
  arg:  { path: "argentina-wc/clips", dur: 5.04 },
  gen:  { path: "wc-generic/clips",   dur: 8.0 },
  mvs:  { path: "messi-vs-salah/clips", dur: 5.04 },
  guard:{ path: "guard/clips",        dur: 5.04 },
};

const BEATS: Beat[] = [
  { kind: "host", id: "jamie_hook", dur: 8.0 },
  { kind: "seg", id: "n_hook2", aud: 11.807, clips: [{ src: "guard/bellingham" }, { src: "guard/messi_last" }],
    names: ["BELLINGHAM", "MESSI"], cap: "SEMIFINAL · ARGENTINA v ENGLAND" },
  { kind: "host", id: "jamie_setup", dur: 8.0 },
  // CH 1 — THE LAST DANCE
  { kind: "seg", id: "n_messi1", aud: 13.087, clips: [{ src: "arg/messi_lift_orbit" }, { src: "arg/maradona_tribute" }],
    names: ["MESSI · 8 GOALS", ""], cap: "THE LAST DANCE" },
  { kind: "seg", id: "n_messi2", aud: 13.584, clips: [{ src: "guard/messi_last" }, { src: "arg/locker_torch_pass" }] },
  { kind: "card", id: "s_messi", aud: 14.707, extra: 0.8, title: "MESSI · 2026", c: ARG,
    bg: "arg/messi_lift_orbit", headline: "400 MINUTES LEFT. MAXIMUM.",
    rows: [{ label: "GOALS THIS WORLD CUP", v: 8 }, { label: "ASSISTS", v: 3 },
           { label: "MAJOR TROPHIES", v: 26 }, { label: "YEARS OLD", v: 39 }] },
  // CH 2 — THE HEIR
  { kind: "host", id: "jamie_jude", dur: 8.0 },
  { kind: "seg", id: "n_jude1", aud: 12.225, clips: [{ src: "guard/bellingham" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["BELLINGHAM ×2", ""], cap: "THE HEIR" },
  { kind: "seg", id: "n_jude2", aud: 12.121, clips: [{ src: "gen/tunnel_silhouettes" }, { src: "gen/boot_ball_rain" }] },
  { kind: "card", id: "s_jude", aud: 11.024, extra: 0.8, title: "BELLINGHAM · 2026", c: ENG,
    bg: "guard/bellingham", headline: "ONLY PELÉ WAS YOUNGER",
    rows: [{ label: "KNOCKOUT GOALS", v: 4 }, { label: "KM PER GAME", v: 14 },
           { label: "YEARS OLD", v: 23 }] },
  // CH 3 — THE COLLISION
  { kind: "seg", id: "n_clash1", aud: 13.427, clips: [{ src: "gen/stadium_night_full" }, { src: "gen/penalty_silhouette" }],
    cap: "THE COLLISION" },
  { kind: "host", id: "jamie_verdict", dur: 8.0 },
  { kind: "zero", id: "n_number", aud: 13.479, extra: 0.6 },
  { kind: "host", id: "jamie_call", dur: 8.0 },
  { kind: "seg", id: "n_cta", aud: 9.247, extra: 0.5, clips: [{ src: "gen/trophy_reach", vol: 0.5 }],
    cap: "SEMIFINAL · IN 4 DAYS" },
];

const LEAD = 6, HOLD = 10;
const beatFrames = (b: Beat) =>
  b.kind === "host" ? Math.round(b.dur * FPS)
  : LEAD + Math.round(b.aud * FPS) + HOLD + Math.round(((b as any).extra ?? 0) * FPS);
export const mvbFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`mvb/audio/${id}.mp3`);
const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

const ClipSlot: React.FC<{ clip: Clip; len: number; name: string }> = ({ clip, len, name }) => {
  const frame = useCurrentFrame();
  const { url, frames } = clipMeta(clip.src);
  const rate = Math.max(0.5, Math.min(1.7, frames / len));
  const scale = interpolate(frame, [0, len], [1.03, 1.11]);
  const flash = interpolate(frame, [0, 6], [0.7, 0], { extrapolateRight: "clamp" });
  const nameSp = spring({ frame: frame - 4, fps: FPS, config: { damping: 13, stiffness: 150 } });
  const nameOut = interpolate(frame, [len - 8, len], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={url} playbackRate={rate} muted={!clip.vol} volume={clip.vol ?? 0}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <AbsoluteFill style={{ pointerEvents: "none", background:
        "linear-gradient(180deg, rgba(5,7,14,0.5) 0%, transparent 22%, transparent 58%, rgba(5,7,14,0.85) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {name ? (
        <div style={{
          position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center",
          opacity: nameOut, transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)`,
        }}>
          <div style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 84,
            color: "#fff", letterSpacing: 1, lineHeight: 1,
            borderBottom: `8px solid ${GOLD}`, paddingBottom: 8,
            textShadow: "0 6px 30px rgba(0,0,0,0.7)",
            WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill",
          }}>{name}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const SegView: React.FC<{ b: Extract<Beat, { kind: "seg" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const n = b.clips.length;
  const slots = b.clips.map((_, i) => ({
    from: Math.round((dur * i) / n),
    len: Math.round((dur * (i + 1)) / n) - Math.round((dur * i) / n),
  }));
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - 2, fps: FPS, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i].src}>
          <ClipSlot clip={b.clips[i]} len={s.len} name={b.names?.[i] ?? ""} />
        </Sequence>
      ))}
      {b.cap ? (
        <div style={{
          position: "absolute", top: 70, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px)`,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 4,
            color: GOLD, textTransform: "uppercase",
            padding: "8px 22px", borderRadius: 10, background: "rgba(6,10,22,0.62)", ...stroke,
          }}>{b.cap}</span>
        </div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

/** Single-player duel card: title, animated count-up rows, headline stinger. */
const CardView: React.FC<{ b: Extract<Beat, { kind: "card" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const { url } = clipMeta(b.bg);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const panelIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const headSp = spring({ frame: frame - (LEAD + b.rows.length * 10 + 16), fps: FPS, config: { damping: 11, stiffness: 160 } });
  const maxV = Math.max(...b.rows.map((r) => r.v), 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={url} playbackRate={0.7} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(10px) brightness(0.35) saturate(1.1)", transform: "scale(1.12)" }} />
      <div style={{
        position: "absolute", top: 74, left: 0, right: 0, textAlign: "center",
        opacity: panelIn, transform: `translateY(${interpolate(panelIn, [0, 1], [-40, 0])}px)`,
      }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 68, color: b.c, letterSpacing: 4, ...stroke }}>
          {b.title}
        </span>
      </div>
      <div style={{
        position: "absolute", top: 196, left: 300, right: 300, opacity: panelIn,
        display: "flex", flexDirection: "column", gap: 30,
        padding: "42px 60px", borderRadius: 24,
        background: "rgba(6,10,22,0.72)", border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
      }}>
        {b.rows.map((r, i) => {
          const sp = spring({ frame: frame - (LEAD + 4 + i * 10), fps: FPS, config: { damping: 14, stiffness: 110 } });
          const v = r.v * Math.min(1, sp * 1.15);
          return (
            <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 27, letterSpacing: 4,
                  color: "rgba(234,242,255,0.75)", textTransform: "uppercase" }}>{r.label}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 54, color: GOLD, ...stroke }}>{Math.round(v)}</span>
              </div>
              <div style={{ height: 18, borderRadius: 9, overflow: "hidden", background: "rgba(255,255,255,0.10)" }}>
                <div style={{ width: `${(r.v / maxV) * sp * 100}%`, height: "100%", background: b.c, boxShadow: `0 0 20px ${b.c}` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", bottom: 110, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(headSp, [0, 0.3], [0, 1]),
        transform: `scale(${interpolate(headSp, [0, 1], [0.8, 1])}) rotate(${interpolate(headSp, [0, 1], [-1.5, 0])}deg)`,
      }}>
        <span style={{
          display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 54,
          color: GOLD, letterSpacing: 1, padding: "16px 36px", borderRadius: 16,
          background: "rgba(6,10,22,0.85)", border: `2px solid ${GOLD}`,
          boxShadow: "0 0 40px rgba(255,216,107,0.35)", maxWidth: 1500, ...stroke,
        }}>{b.headline}</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

/** The loop-close payoff: a giant ZERO slams in over a dark stadium. */
const ZeroView: React.FC<{ b: Extract<Beat, { kind: "zero" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  // "Zero." lands ~3.2s into the narration — slam the digit on that word
  const slamAt = LEAD + Math.round(3.2 * FPS);
  const slam = spring({ frame: frame - slamAt, fps: FPS, config: { damping: 12, stiffness: 90 } });
  const subIn = spring({ frame: frame - (slamAt + 24), fps: FPS, config: { damping: 15 } });
  const preIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={staticFile("wc-generic/clips/stadium_dawn.mp4")} playbackRate={0.6} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(6px) brightness(0.3)", transform: "scale(1.1)" }} />
      <div style={{
        position: "absolute", top: 110, left: 0, right: 0, textAlign: "center",
        opacity: preIn, transform: `translateY(${interpolate(preIn, [0, 1], [-24, 0])}px)`,
      }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 6,
          color: "rgba(234,242,255,0.85)", textTransform: "uppercase", ...stroke }}>
          THE NUMBER
        </span>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 620, lineHeight: 1, color: GOLD,
          opacity: interpolate(slam, [0, 0.2], [0, 1]),
          transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])})`,
          textShadow: "0 0 120px rgba(255,216,107,0.45)",
          WebkitTextStroke: "6px #05070E", paintOrder: "stroke fill",
        }}>0</span>
      </AbsoluteFill>
      <div style={{
        position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(subIn, [0, 0.4], [0, 1]),
        transform: `translateY(${interpolate(subIn, [0, 1], [30, 0])}px)`,
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 1,
          padding: "14px 32px", borderRadius: 14, background: "rgba(6,10,22,0.8)",
          border: `2px solid ${GOLD}`, ...stroke,
        }}>TEAMS TO KNOCK OUT MESSI'S ARGENTINA SINCE 2019 · 23 TRIED</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

const HostView: React.FC<{ id: string; dur: number }> = ({ id, dur }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur * FPS - 6, dur * FPS], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: Math.min(fadeIn, fadeOut) }}>
      <OffthreadVideo src={staticFile(`mvb/host/${id}.mp4`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", bottom: 60, left: 70, fontFamily: DISPLAY, fontWeight: 800,
        fontSize: 30, letterSpacing: 3, color: "rgba(234,242,255,0.85)", textTransform: "uppercase",
      }}>KICKOFFDAILY90 · SEMIFINAL PREVIEW</div>
    </AbsoluteFill>
  );
};

export const MvB: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            {b.kind === "host" ? <HostView id={b.id} dur={b.dur} />
              : b.kind === "card" ? <CardView b={b} />
              : b.kind === "zero" ? <ZeroView b={b} />
              : <SegView b={b} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
