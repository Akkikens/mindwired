/** kickoffdaily90 — "World Cup 2026 FINAL: Every Stat, Every Moment" (16:9, ~11 min).
 *  Lean $0 build: Jamie host-STILL cards + animated stat segments + stadium/anime b-roll
 *  + Cartesia narration, kickoffdaily90 subscribe outro baked on the end.
 *  Full-time facts verified 2026-07-19: Spain 1-0 Argentina (AET). Ferran Torres 106'.
 *  Enzo Fernandez red 90'+3. Spain 65% poss, 20 shots (12 OT), xG 1.94; Argentina 2 shots,
 *  0 on target, xG 0.2, first shot 117'. E. Martinez 11 saves. Golden Ball Rodri, Boot Mbappe.
 *  Spain 2nd WC, 1 goal conceded all tournament. */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import durs from "../../public/finalreview/durations.json";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const GOLD = "#FFD86B";
const ESP = "#E0342B";
const ARG = "#63B3ED";
const D: Record<string, number> = durs as Record<string, number>;

type Clip = { src: string; vol?: number };
type Score = { home: string; hs: number; away: string; as: number; tag?: string };
type StatRow = { label: string; h: number; a: number; fmt?: "pct" | "dec" | "int"; c?: string };
type Beat =
  | { kind: "host"; id: string; sub: string }
  | { kind: "seg"; id: string; clips: Clip[]; names?: string[]; score?: Score; cap?: string }
  | { kind: "stats"; id: string; score?: Score; title?: string; hc: string; ac: string;
      rows: StatRow[]; headline: string; bg: string; race?: boolean };

const LIBS: Record<string, { path: string; dur: number }> = {
  gen:   { path: "wc-generic/clips",     dur: 8.0 },
  guard: { path: "guard/clips",          dur: 5.04 },
  mvs:   { path: "messi-vs-salah/clips", dur: 5.04 },
  arg:   { path: "argentina-wc/clips",   dur: 5.04 },
};

const SCORE: Score = { home: "ESP", hs: 1, away: "ARG", as: 0, tag: "AET" };

const BEATS: Beat[] = [
  { kind: "host", id: "i_intro", sub: "WORLD CUP FINAL · FULL REVIEW" },
  { kind: "seg", id: "open", clips: [{ src: "gen/stadium_night_full" }, { src: "gen/tunnel_silhouettes" }],
    score: SCORE, cap: "SPAIN 1–0 ARGENTINA" },
  { kind: "seg", id: "stakes", clips: [{ src: "guard/messi_last" }], cap: "MESSI'S LAST DANCE" },
  { kind: "seg", id: "road_esp", clips: [{ src: "guard/lamine_yamal" }, { src: "guard/pedri_solo" }],
    cap: "SPAIN'S ROAD" },
  { kind: "seg", id: "road_arg", clips: [{ src: "guard/messi_last" }, { src: "mvs/messi_eyes" }],
    cap: "ARGENTINA'S ROAD" },
  { kind: "seg", id: "teams", clips: [{ src: "gen/tunnel_silhouettes" }], cap: "THE LINE-UPS" },
  { kind: "seg", id: "ko", clips: [{ src: "gen/stadium_night_full" }], cap: "KICK-OFF" },
  { kind: "stats", id: "dom", score: SCORE, hc: ESP, ac: ARG, bg: "gen/stadium_night_full",
    rows: [{ label: "POSSESSION", h: 65, a: 35, fmt: "pct" }], headline: "SPAIN OWNED THE BALL" },
  { kind: "stats", id: "shots", score: SCORE, hc: ESP, ac: ARG, bg: "gen/boot_ball_rain",
    rows: [{ label: "SHOTS", h: 20, a: 2, fmt: "int" }, { label: "ON TARGET", h: 12, a: 0, fmt: "int" }],
    headline: "ARGENTINA: 0 SHOTS ON TARGET" },
  { kind: "seg", id: "yamal", clips: [{ src: "guard/lamine_yamal" }], names: ["LAMINE YAMAL"] },
  { kind: "seg", id: "mart", clips: [{ src: "gen/penalty_silhouette" }], cap: "EMILIANO MARTÍNEZ" },
  { kind: "stats", id: "mart_stat", title: "THE GOALKEEPER", race: true, hc: ARG, ac: ARG, bg: "gen/stadium_night_full",
    rows: [{ label: "E. MARTÍNEZ · SAVES", h: 11, a: 0, fmt: "int", c: ARG }],
    headline: "MOST IN A WORLD CUP FINAL IN 60+ YEARS 🧤" },
  { kind: "seg", id: "messi1", clips: [{ src: "mvs/messi_eyes" }], names: ["MESSI · SWARMED"] },
  { kind: "seg", id: "ht", clips: [{ src: "gen/stadium_night_full" }], cap: "HALF TIME · 0–0" },
  { kind: "stats", id: "dom_xg", score: SCORE, hc: ESP, ac: ARG, bg: "gen/stadium_dawn",
    rows: [{ label: "EXPECTED GOALS", h: 1.94, a: 0.2, fmt: "dec" }], headline: "xG 1.94 – 0.20 · NOT EVEN CLOSE" },
  { kind: "seg", id: "subs", clips: [{ src: "gen/tunnel_silhouettes" }], cap: "THE BENCHES" },
  { kind: "host", id: "hinge", sub: "THE TURNING POINT" },
  { kind: "seg", id: "red", clips: [{ src: "gen/penalty_silhouette" }], names: ["ENZO FERNÁNDEZ · RED 90'+3"] },
  { kind: "seg", id: "et", clips: [{ src: "gen/stadium_night_full" }], cap: "EXTRA TIME · 10 MEN" },
  { kind: "seg", id: "goal", clips: [{ src: "gen/boot_ball_rain" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["FERRAN TORRES · 106'", ""], score: SCORE },
  { kind: "seg", id: "goal_ctx", clips: [{ src: "gen/stadium_night_full" }], cap: "ARG · FIRST SHOT: 117'" },
  { kind: "seg", id: "whistle", clips: [{ src: "mvs/2_despair" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["FULL TIME", ""] },
  { kind: "seg", id: "ratings_esp", clips: [{ src: "guard/lamine_yamal" }], cap: "SPAIN · PLAYER RATINGS" },
  { kind: "seg", id: "ratings_arg", clips: [{ src: "mvs/messi_eyes" }], cap: "ARGENTINA · PLAYER RATINGS" },
  { kind: "seg", id: "awards", clips: [{ src: "gen/trophy_macro" }],
    cap: "GOLDEN BALL: RODRI · BOOT: MBAPPÉ" },
  { kind: "seg", id: "messi2", clips: [{ src: "mvs/2_despair" }], names: ["MESSI · THE GOODBYE"] },
  { kind: "seg", id: "messi_legacy", clips: [{ src: "guard/messi_last" }] },
  { kind: "seg", id: "spain", clips: [{ src: "gen/trophy_reach" }, { src: "gen/confetti_storm" }],
    names: ["CHAMPIONS", ""], cap: "SPAIN · WORLD CHAMPIONS" },
  { kind: "stats", id: "tourn", title: "THE RUN", race: true, hc: ESP, ac: ESP, bg: "gen/trophy_macro",
    rows: [{ label: "GOALS CONCEDED · 7 GAMES", h: 1, a: 0, fmt: "int", c: ESP }],
    headline: "ONE GOAL. ALL TOURNAMENT." },
  { kind: "seg", id: "whatnext", clips: [{ src: "guard/lamine_yamal" }], cap: "WHAT'S NEXT" },
  { kind: "host", id: "verdict", sub: "THE VERDICT" },
  { kind: "seg", id: "cta", clips: [{ src: "gen/trophy_macro" }] },
];

const LEAD = 6, HOLD = 10, EXTRA = 0.5;
const OUTRO_F = 527; // subscribe_kickoffdaily90_long.mp4 @30fps
const aud = (id: string) => D[id] ?? 6;
const beatFrames = (b: Beat) =>
  b.kind === "host" ? LEAD + Math.round(aud(b.id) * FPS) + HOLD
  : LEAD + Math.round(aud(b.id) * FPS) + HOLD + Math.round(EXTRA * FPS);
export const finalReviewFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0) + OUTRO_F;

const clipMeta = (src: string) => {
  const [dir, name] = src.split("/");
  const lib = LIBS[dir];
  return { url: staticFile(`${lib.path}/${name}.mp4`), frames: Math.round(lib.dur * FPS) };
};
const audSrc = (id: string) => staticFile(`finalreview/audio/${id}.mp3`);
const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

const Scoreboard: React.FC<{ s: Score; frame: number }> = ({ s, frame }) => {
  const drop = spring({ frame: frame - 2, fps: FPS, config: { damping: 14, stiffness: 130 } });
  return (
    <div style={{ position: "absolute", top: 46, left: "50%",
      transform: `translateX(-50%) translateY(${interpolate(drop, [0, 1], [-70, 0])}px)`,
      display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 14,
      background: "rgba(6,10,22,0.84)", border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: ESP, letterSpacing: 1 }}>{s.home}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: "#fff", minWidth: 96, textAlign: "center" }}>{s.hs} – {s.as}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: ARG, letterSpacing: 1 }}>{s.away}</span>
      {s.tag ? <span style={{ marginLeft: 6, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: GOLD,
        padding: "4px 10px", borderRadius: 8, background: "rgba(255,216,107,0.14)" }}>{s.tag}</span> : null}
    </div>
  );
};

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
        <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center",
          opacity: nameOut, transform: `translateY(${interpolate(nameSp, [0, 1], [40, 0])}px)` }}>
          <div style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 76,
            color: "#fff", letterSpacing: 1, lineHeight: 1, borderBottom: `8px solid ${GOLD}`, paddingBottom: 8,
            textShadow: "0 6px 30px rgba(0,0,0,0.7)", ...stroke }}>{name}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const fmtVal = (v: number, fmt?: string) =>
  fmt === "pct" ? `${Math.round(v)}%` : fmt === "dec" ? v.toFixed(2) : `${Math.round(v)}`;

const StatsView: React.FC<{ b: Extract<Beat, { kind: "stats" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const { url } = clipMeta(b.bg);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const panelIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const headSp = spring({ frame: frame - (LEAD + Math.round(b.rows.length * 10) + 20), fps: FPS, config: { damping: 11, stiffness: 160 } });
  const maxRace = Math.max(...b.rows.map((r) => r.h), 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={url} playbackRate={0.7} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(10px) brightness(0.35) saturate(1.1)", transform: "scale(1.12)" }} />
      <div style={{ position: "absolute", top: 84, left: 0, right: 0, textAlign: "center",
        opacity: panelIn, transform: `translateY(${interpolate(panelIn, [0, 1], [-40, 0])}px)` }}>
        {b.score ? (
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 72, color: "#fff", letterSpacing: 2, ...stroke }}>
            <span style={{ color: b.hc }}>{b.score.home}</span>{"  "}{b.score.hs} – {b.score.as}{"  "}
            <span style={{ color: b.ac }}>{b.score.away}</span>
            {b.score.tag ? <span style={{ marginLeft: 22, fontFamily: BODY, fontWeight: 700, fontSize: 32, color: GOLD }}>{b.score.tag}</span> : null}
          </span>
        ) : (
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: GOLD, letterSpacing: 4, ...stroke }}>{b.title}</span>
        )}
      </div>
      <div style={{ position: "absolute", top: 240, left: 260, right: 260, opacity: panelIn,
        display: "flex", flexDirection: "column", gap: 34, padding: "48px 64px", borderRadius: 24,
        background: "rgba(6,10,22,0.72)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 20px 80px rgba(0,0,0,0.55)" }}>
        {b.rows.map((r, i) => {
          const at = LEAD + 4 + i * 10;
          const sp = spring({ frame: frame - at, fps: FPS, config: { damping: 14, stiffness: 110 } });
          const hVal = r.h * Math.min(1, sp * 1.15);
          if (b.race) {
            const w = (r.h / maxRace) * sp;
            return (
              <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 1, ...stroke }}>{r.label}</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 72, color: GOLD, ...stroke }}>{fmtVal(hVal, r.fmt)}</span>
                </div>
                <div style={{ height: 26, borderRadius: 13, overflow: "hidden", background: "rgba(255,255,255,0.10)" }}>
                  <div style={{ width: `${w * 100}%`, height: "100%", background: r.c ?? b.hc, boxShadow: `0 0 20px ${r.c ?? b.hc}` }} />
                </div>
              </div>
            );
          }
          const total = r.h + r.a || 1;
          const hFrac = (r.h / total) * sp; const aFrac = (r.a / total) * sp;
          const aVal = r.a * Math.min(1, sp * 1.15);
          return (
            <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 50, color: "#fff", minWidth: 160, ...stroke }}>{fmtVal(hVal, r.fmt)}</span>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: "rgba(234,242,255,0.75)", textTransform: "uppercase" }}>{r.label}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 50, color: "#fff", minWidth: 160, textAlign: "right", ...stroke }}>{fmtVal(aVal, r.fmt)}</span>
              </div>
              <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.10)" }}>
                <div style={{ width: `${hFrac * 100}%`, background: b.hc, boxShadow: `0 0 18px ${b.hc}` }} />
                <div style={{ flex: 1 }} />
                <div style={{ width: `${aFrac * 100}%`, background: b.ac, boxShadow: `0 0 18px ${b.ac}` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 140, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(headSp, [0, 0.3], [0, 1]),
        transform: `scale(${interpolate(headSp, [0, 1], [0.8, 1])})` }}>
        <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, color: GOLD,
          letterSpacing: 1, padding: "16px 36px", borderRadius: 16, background: "rgba(6,10,22,0.85)",
          border: `2px solid ${GOLD}`, boxShadow: `0 0 40px rgba(255,216,107,0.35)`, maxWidth: 1500, ...stroke }}>{b.headline}</span>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

const HostCard: React.FC<{ id: string; sub: string }> = ({ id, sub }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames({ kind: "host", id, sub } as Beat);
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const kb = interpolate(frame, [0, dur], [1.04, 1.12]);
  const barIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <Img src={staticFile("host/jamie_wide.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,14,0.55) 0%, transparent 30%, transparent 55%, rgba(5,7,14,0.92) 100%)" }} />
      <div style={{ position: "absolute", bottom: 90, left: 80, opacity: barIn,
        transform: `translateX(${interpolate(barIn, [0, 1], [-40, 0])}px)` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: GOLD, letterSpacing: 2, ...stroke }}>JAMIE · KICKOFFDAILY90</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: "rgba(234,242,255,0.85)", textTransform: "uppercase", marginTop: 6 }}>{sub}</div>
      </div>
      <Sequence from={LEAD}><Audio src={audSrc(id)} /></Sequence>
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
      {b.score ? <Scoreboard s={b.score} frame={frame} /> : null}
      {b.cap ? (
        <div style={{ position: "absolute", top: b.score ? 130 : 74, left: 0, right: 0, textAlign: "center",
          opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [-24, 0])}px)` }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: GOLD,
            textTransform: "uppercase", padding: "10px 26px", borderRadius: 10, background: "rgba(6,10,22,0.62)", ...stroke }}>{b.cap}</span>
        </div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const FinalReview: React.FC = () => {
  let cursor = 0;
  const bodyEnd = BEATS.reduce((a, b) => a + beatFrames(b), 0);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            {b.kind === "host" ? <HostCard id={b.id} sub={b.sub} />
              : b.kind === "stats" ? <StatsView b={b} />
              : <SegView b={b} />}
          </Sequence>
        );
      })}
      <Sequence from={bodyEnd} durationInFrames={OUTRO_F} name="outro">
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <OffthreadVideo src={staticFile("outro/subscribe_kickoffdaily90_long.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
