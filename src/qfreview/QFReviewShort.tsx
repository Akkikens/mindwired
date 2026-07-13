/** kickoffdaily90 — QF Review SHORTS cut (1080×1920, ~85s).
 *  Condensed: Jamie hook → one beat per match (scoreboards) → Golden Boot race card →
 *  Jamie verdict. Host clips are cover-cropped with the window biased LEFT
 *  (objectPosition HOST_X) because Jamie sits left-of-centre in the Veo frames —
 *  keeps him centred in vertical. Anime clips centre-crop full-bleed. */
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
const HOST_X = "35%";   // Jamie sits at ~40% x in source; 35% window bias centres him in 9:16

type Clip = { src: string; vol?: number };
type Score = { home: string; hs: number; away: string; as: number; tag?: string };
type Beat =
  | { kind: "host"; id: string; dur: number }
  | { kind: "seg"; id: string; aud: number; extra?: number; clips: Clip[];
      names?: string[]; score?: Score }
  | { kind: "boot"; id: string; aud: number; extra?: number };

const LIBS: Record<string, { path: string; dur: number }> = {
  arg:   { path: "argentina-wc/clips",   dur: 5.04 },
  gen:   { path: "wc-generic/clips",     dur: 8.0 },
  mvs:   { path: "messi-vs-salah/clips", dur: 5.04 },
  guard: { path: "guard/clips",          dur: 5.04 },
  host:  { path: "qf-review/host",       dur: 8.0 },
};

const BEATS: Beat[] = [
  { kind: "host", id: "jamie_hook", dur: 8.0 },
  { kind: "seg", id: "n_arg1", aud: 11.18, clips: [{ src: "arg/semifinal_winner" }, { src: "arg/opponent_generic_open" }],
    names: ["MAC ALLISTER · 10'", "NDOYE · 67'"], score: { home: "ARG", hs: 3, away: "SUI", as: 1, tag: "AET" } },
  { kind: "seg", id: "n_fra1", aud: 8.934, clips: [{ src: "guard/mbappe" }],
    names: ["MBAPPÉ"], score: { home: "FRA", hs: 2, away: "MAR", as: 0 } },
  { kind: "seg", id: "n_esp2", aud: 9.979, clips: [{ src: "guard/lamine_yamal" }],
    names: ["MERINO WINS IT"], score: { home: "ESP", hs: 2, away: "BEL", as: 1, tag: "FT" } },
  { kind: "seg", id: "n_eng2", aud: 9.979, clips: [{ src: "guard/bellingham" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["BELLINGHAM ×2", ""], score: { home: "ENG", hs: 2, away: "NOR", as: 1, tag: "AET" } },
  { kind: "boot", id: "s_boot", aud: 9.979, extra: 0.5 },
  { kind: "host", id: "jamie_verdict", dur: 8.0 },
];

const LEAD = 6, HOLD = 8;
const beatFrames = (b: Beat) =>
  b.kind === "host" ? Math.round(b.dur * FPS)
  : LEAD + Math.round(b.aud * FPS) + HOLD + Math.round(((b as any).extra ?? 0) * FPS);
export const qfShortFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`qf-review/audio/${id}.mp3`);

const Scoreboard: React.FC<{ s: Score; frame: number }> = ({ s, frame }) => {
  const drop = spring({ frame: frame - 2, fps: FPS, config: { damping: 14, stiffness: 130 } });
  return (
    <div style={{
      position: "absolute", top: 260, left: "50%",
      transform: `translateX(-50%) translateY(${interpolate(drop, [0, 1], [-70, 0])}px)`,
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 24px", borderRadius: 14,
      background: "rgba(6,10,22,0.85)", border: "1px solid rgba(255,255,255,0.15)",
    }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, color: "#63B3ED" }}>{s.home}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: "#fff" }}>{s.hs} – {s.as}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, color: "#FF4D4D" }}>{s.away}</span>
      {s.tag ? <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 24, color: GOLD }}>{s.tag}</span> : null}
    </div>
  );
};

const HostView: React.FC<{ id: string; dur: number }> = ({ id, dur }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [dur * FPS - 6, dur * FPS], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      {/* cover-crop biased LEFT so Jamie (at ~40% x in source) is centred vertically */}
      <OffthreadVideo src={staticFile(`qf-review/host/${id}.mp4`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${HOST_X} 50%` }} />
      <div style={{
        position: "absolute", top: 170, left: 0, right: 0, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 4,
        color: "rgba(234,242,255,0.9)", textTransform: "uppercase",
      }}>QF REVIEW · IN 60 SECONDS</div>
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
      {b.score ? <Scoreboard s={b.score} frame={frame} /> : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
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
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={url} playbackRate={rate} muted={!vol} volume={vol ?? 0}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {name ? (
        <div style={{
          position: "absolute", bottom: 430, left: 0, right: 0, textAlign: "center",
          transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)`,
          opacity: interpolate(nameSp, [0, 0.4], [0, 1]),
        }}>
          <span style={{
            display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 72,
            color: "#fff", borderBottom: `7px solid ${GOLD}`, paddingBottom: 6, ...stroke,
          }}>{name}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const BootView: React.FC<{ b: Extract<Beat, { kind: "boot" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const rows = [
    { label: "MESSI · ARG", v: 8, c: "#63B3ED" },
    { label: "MBAPPÉ · FRA", v: 8, c: "#4169E1" },
    { label: "HAALAND · OUT", v: 7, c: "#BA0C2F" },
  ];
  const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={staticFile("wc-generic/clips/trophy_macro.mp4")} playbackRate={0.7} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(10px) brightness(0.35)", transform: "scale(1.12)" }} />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 62, color: GOLD, letterSpacing: 3, ...stroke }}>
        👟 GOLDEN BOOT RACE
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
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, color: "#fff", ...stroke }}>{r.label}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 68, color: GOLD, ...stroke }}>{Math.round(r.v * Math.min(1, sp * 1.15))}</span>
              </div>
              <div style={{ height: 20, borderRadius: 10, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                <div style={{ width: `${(r.v / 8) * sp * 100}%`, height: "100%", background: r.c, boxShadow: `0 0 20px ${r.c}` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 400, left: 40, right: 40, textAlign: "center" }}>
        <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 46,
          color: GOLD, padding: "14px 28px", borderRadius: 14, background: "rgba(6,10,22,0.85)",
          border: `2px solid ${GOLD}`, ...stroke }}>TWO GOATS. ONE BOOT. TWO GAMES LEFT.</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const QFReviewShort: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            {b.kind === "host" ? <HostView id={b.id} dur={b.dur} />
              : b.kind === "boot" ? <BootView b={b} />
              : <SegView b={b} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
