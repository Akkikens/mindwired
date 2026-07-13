/** kickoffdaily90 — "Messi vs Bellingham" SHORT (1080×1920, ~75s).
 *  Jamie hook → hook2 → Bellingham/Pelé fact → duel card → ZERO payoff → Jamie call.
 *  Host clips cover-cropped biased LEFT (Jamie sits ~40% x in Veo frames). */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const GOLD = "#FFD86B";
const ENG = "#FF4D4D";
const HOST_X = "35%";

type Clip = { src: string; vol?: number };
type Beat =
  | { kind: "host"; id: string; dur: number }
  | { kind: "seg"; id: string; aud: number; extra?: number; clips: Clip[]; names?: string[] }
  | { kind: "duel"; id: string; aud: number; extra?: number }
  | { kind: "zero"; id: string; aud: number; extra?: number };

const LIBS: Record<string, { path: string; dur: number }> = {
  arg:  { path: "argentina-wc/clips", dur: 5.04 },
  gen:  { path: "wc-generic/clips",   dur: 8.0 },
  guard:{ path: "guard/clips",        dur: 5.04 },
};

const BEATS: Beat[] = [
  { kind: "host", id: "jamie_hook", dur: 8.0 },
  { kind: "seg", id: "n_hook2", aud: 11.807, clips: [{ src: "guard/bellingham" }, { src: "guard/messi_last" }],
    names: ["BELLINGHAM", "MESSI"] },
  { kind: "seg", id: "n_jude1", aud: 12.225, clips: [{ src: "guard/bellingham" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["ONLY PELÉ WAS YOUNGER", ""] },
  { kind: "duel", id: "s_jude", aud: 11.024, extra: 0.5 },
  { kind: "zero", id: "n_number", aud: 13.479, extra: 0.5 },
  { kind: "host", id: "jamie_call", dur: 8.0 },
];

const LEAD = 6, HOLD = 8;
const beatFrames = (b: Beat) =>
  b.kind === "host" ? Math.round(b.dur * FPS)
  : LEAD + Math.round(b.aud * FPS) + HOLD + Math.round(((b as any).extra ?? 0) * FPS);
export const mvbShortFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`mvb/audio/${id}.mp3`);
const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

const HostView: React.FC<{ id: string; dur: number }> = ({ id, dur }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [dur * FPS - 6, dur * FPS], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      <OffthreadVideo src={staticFile(`mvb/host/${id}.mp4`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${HOST_X} 50%` }} />
      <div style={{
        position: "absolute", top: 170, left: 0, right: 0, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 4,
        color: "rgba(234,242,255,0.9)", textTransform: "uppercase",
      }}>MESSI v BELLINGHAM · THE SEMIFINAL</div>
    </AbsoluteFill>
  );
};

const VertClip: React.FC<{ url: string; frames: number; len: number; vol?: number; name: string }> =
  ({ url, frames, len, vol, name }) => {
  const frame = useCurrentFrame();
  const rate = Math.max(0.5, Math.min(1.7, frames / len));
  const scale = interpolate(frame, [0, len], [1.02, 1.1]);
  const flash = interpolate(frame, [0, 6], [0.7, 0], { extrapolateRight: "clamp" });
  const nameSp = spring({ frame: frame - 4, fps: FPS, config: { damping: 13, stiffness: 150 } });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={url} playbackRate={rate} muted={!vol} volume={vol ?? 0}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {name ? (
        <div style={{
          position: "absolute", bottom: 430, left: 20, right: 20, textAlign: "center",
          transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)`,
          opacity: interpolate(nameSp, [0, 0.4], [0, 1]),
        }}>
          <span style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 64,
            color: "#fff", borderBottom: `7px solid ${GOLD}`, paddingBottom: 6, ...stroke,
          }}>{name}</span>
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
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => {
        const c = b.clips[i];
        const { url, frames } = clipMeta(c.src);
        return (
          <Sequence key={i} from={s.from} durationInFrames={s.len} name={c.src}>
            <VertClip url={url} frames={frames} len={s.len} vol={c.vol} name={b.names?.[i] ?? ""} />
          </Sequence>
        );
      })}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

/** Bellingham stat card (vertical). */
const DuelView: React.FC<{ b: Extract<Beat, { kind: "duel" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const rows = [
    { label: "KNOCKOUT GOALS", v: 4, max: 4, c: ENG },
    { label: "KM PER GAME", v: 14, max: 14, c: ENG },
    { label: "YEARS OLD", v: 23, max: 39, c: ENG },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={staticFile("guard/clips/bellingham.mp4")} playbackRate={0.7} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(10px) brightness(0.35)", transform: "scale(1.12)" }} />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 62, color: ENG, letterSpacing: 3, ...stroke }}>
        BELLINGHAM · 2026
      </div>
      <div style={{
        position: "absolute", top: 520, left: 70, right: 70,
        display: "flex", flexDirection: "column", gap: 40,
        padding: "50px 50px", borderRadius: 24,
        background: "rgba(6,10,22,0.72)", border: "1px solid rgba(255,255,255,0.14)",
      }}>
        {rows.map((r, i) => {
          const sp = spring({ frame: frame - (LEAD + 4 + i * 10), fps: FPS, config: { damping: 14, stiffness: 110 } });
          return (
            <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: "#fff", ...stroke }}>{r.label}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: GOLD, ...stroke }}>{Math.round(r.v * Math.min(1, sp * 1.15))}</span>
              </div>
              <div style={{ height: 20, borderRadius: 10, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                <div style={{ width: `${(r.v / r.max) * sp * 100}%`, height: "100%", background: r.c, boxShadow: `0 0 20px ${r.c}` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 400, left: 40, right: 40, textAlign: "center" }}>
        <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 46,
          color: GOLD, padding: "14px 28px", borderRadius: 14, background: "rgba(6,10,22,0.85)",
          border: `2px solid ${GOLD}`, ...stroke }}>HE DOESN'T TAKE OVER GAMES. HE SWALLOWS THEM.</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

/** Giant ZERO payoff (vertical). */
const ZeroView: React.FC<{ b: Extract<Beat, { kind: "zero" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const slamAt = LEAD + Math.round(3.2 * FPS);
  const slam = spring({ frame: frame - slamAt, fps: FPS, config: { damping: 12, stiffness: 90 } });
  const subIn = spring({ frame: frame - (slamAt + 24), fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={staticFile("wc-generic/clips/stadium_dawn.mp4")} playbackRate={0.6} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(6px) brightness(0.3)", transform: "scale(1.1)" }} />
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: 6,
        color: "rgba(234,242,255,0.85)", textTransform: "uppercase", ...stroke }}>
        THE NUMBER
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 560, lineHeight: 1, color: GOLD,
          opacity: interpolate(slam, [0, 0.2], [0, 1]),
          transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])})`,
          textShadow: "0 0 120px rgba(255,216,107,0.45)",
          WebkitTextStroke: "8px #05070E", paintOrder: "stroke fill",
        }}>0</span>
      </AbsoluteFill>
      <div style={{
        position: "absolute", bottom: 420, left: 50, right: 50, textAlign: "center",
        opacity: interpolate(subIn, [0, 0.4], [0, 1]),
        transform: `translateY(${interpolate(subIn, [0, 1], [30, 0])}px)`,
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 900, fontSize: 42, color: "#fff", lineHeight: 1.3,
          padding: "14px 30px", borderRadius: 14, background: "rgba(6,10,22,0.8)",
          border: `2px solid ${GOLD}`, display: "inline-block", ...stroke,
        }}>TEAMS TO KNOCK OUT MESSI'S ARGENTINA SINCE 2019</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const MvBShort: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            {b.kind === "host" ? <HostView id={b.id} dur={b.dur} />
              : b.kind === "duel" ? <DuelView b={b} />
              : b.kind === "zero" ? <ZeroView b={b} />
              : <SegView b={b} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
