/** kickoffdaily90 — "Every Quarterfinal Reviewed" (16:9, 1920×1080, ~3 min).
 *  Hybrid host show: Jamie (Veo talking-head, real voice) hooks and hands off between
 *  four animated match segments (existing anime clips + live scoreboard bugs + Cartesia
 *  narration). Results fact-checked 2026-07-11: ARG 3-1 SUI aet · FRA 2-0 MAR ·
 *  ESP 2-1 BEL · ENG 2-1 NOR aet → semis ESP-FRA, ARG-ENG. */
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

type Clip = { src: string; vol?: number };
type Score = { home: string; hs: number; away: string; as: number; tag?: string };
type StatRow = { label: string; h: number; a: number; fmt?: "pct" | "dec" | "int"; c?: string };
type Beat =
  | { kind: "host"; id: string; dur: number }                                  // Jamie speaks (own audio)
  | { kind: "seg"; id: string; aud: number; extra?: number; clips: Clip[];
      names?: string[]; score?: Score; cap?: string }
  | { kind: "stats"; id: string; aud: number; extra?: number; score?: Score; title?: string;
      hc: string; ac: string; rows: StatRow[]; headline: string; bg: string; race?: boolean };

const LIBS: Record<string, { path: string; dur: number }> = {
  arg:   { path: "argentina-wc/clips",   dur: 5.04 },
  gen:   { path: "wc-generic/clips",     dur: 8.0 },
  mvs:   { path: "messi-vs-salah/clips", dur: 5.04 },
  guard: { path: "guard/clips",          dur: 5.04 },
  host:  { path: "qf-review/host",       dur: 8.0 },
};

const BEATS: Beat[] = [
  { kind: "host", id: "jamie_hook", dur: 8.0 },
  // ── ARG 3-1 SUI (aet) ──
  { kind: "host", id: "jamie_arg_sui", dur: 8.0 },
  { kind: "seg", id: "n_arg1", aud: 11.18, clips: [{ src: "arg/semifinal_winner" }, { src: "arg/opponent_generic_open" }],
    names: ["MAC ALLISTER · 10'", "NDOYE · 67'"], score: { home: "ARG", hs: 3, away: "SUI", as: 1, tag: "AET" }, cap: "QUARTERFINAL 1" },
  { kind: "seg", id: "n_arg2", aud: 9.404, clips: [{ src: "mvs/4_strike" }, { src: "arg/fulltime_chaos", vol: 0.6 }],
    score: { home: "ARG", hs: 3, away: "SUI", as: 1, tag: "FT" } },
  { kind: "stats", id: "s_arg", aud: 9.169, extra: 0.8, score: { home: "ARG", hs: 3, away: "SUI", as: 1, tag: "AET" },
    hc: "#63B3ED", ac: "#FF4D4D", bg: "gen/stadium_night_full",
    rows: [
      { label: "POSSESSION", h: 59, a: 41, fmt: "pct" },
      { label: "SHOTS", h: 22, a: 11, fmt: "int" },
      { label: "ON TARGET", h: 7, a: 5, fmt: "int" },
      { label: "CORNERS", h: 8, a: 2, fmt: "int" },
      { label: "EXPECTED GOALS", h: 2.0, a: 0.53, fmt: "dec" },
    ],
    headline: "3RD SEMIFINAL IN THEIR LAST 4 WORLD CUPS" },
  // ── FRA 2-0 MAR ──
  { kind: "host", id: "jamie_fra_mar", dur: 8.0 },
  { kind: "seg", id: "n_fra1", aud: 8.934, clips: [{ src: "guard/mbappe" }],
    names: ["MBAPPÉ"], score: { home: "FRA", hs: 2, away: "MAR", as: 0 }, cap: "QUARTERFINAL 2" },
  { kind: "seg", id: "n_fra2", aud: 7.889, clips: [{ src: "guard/dembele_solo" }],
    names: ["DEMBÉLÉ"], score: { home: "FRA", hs: 2, away: "MAR", as: 0, tag: "FT" } },
  { kind: "stats", id: "s_fra", aud: 10.371, extra: 0.8, score: { home: "FRA", hs: 2, away: "MAR", as: 0, tag: "FT" },
    hc: "#4169E1", ac: "#C1272D", bg: "gen/confetti_storm",
    rows: [
      { label: "SHOTS", h: 22, a: 5, fmt: "int" },
      { label: "ON TARGET", h: 8, a: 1, fmt: "int" },
      { label: "CORNERS", h: 3, a: 1, fmt: "int" },
      { label: "KEEPER SAVES", h: 0, a: 4, fmt: "int" },
      { label: "EXPECTED GOALS", h: 3.04, a: 0.14, fmt: "dec" },
    ],
    headline: "MBAPPÉ JOINS MESSI ON 8 GOALS 👟" },
  // ── ESP 2-1 BEL ──
  { kind: "host", id: "jamie_esp_bel", dur: 8.0 },
  { kind: "seg", id: "n_esp1", aud: 11.807, clips: [{ src: "guard/pedri_solo" }, { src: "gen/boot_ball_rain", vol: 0.6 }],
    names: ["RUIZ · DE KETELAERE", ""], score: { home: "ESP", hs: 2, away: "BEL", as: 1 }, cap: "QUARTERFINAL 3" },
  { kind: "seg", id: "n_esp2", aud: 9.979, clips: [{ src: "guard/lamine_yamal" }],
    names: ["MERINO WINS IT"], score: { home: "ESP", hs: 2, away: "BEL", as: 1, tag: "FT" } },
  { kind: "stats", id: "s_esp", aud: 10.449, extra: 0.5, score: { home: "ESP", hs: 2, away: "BEL", as: 1, tag: "FT" },
    hc: "#E0342B", ac: "#F5C400", bg: "gen/stadium_night_full",
    rows: [
      { label: "POSSESSION", h: 66, a: 34, fmt: "pct" },
      { label: "SHOTS", h: 10, a: 2, fmt: "int" },
      { label: "ON TARGET", h: 3, a: 1, fmt: "int" },
      { label: "PASS ACCURACY", h: 90, a: 83, fmt: "pct" },
      { label: "EXPECTED GOALS", h: 2.08, a: 0.38, fmt: "dec" },
    ],
    headline: "MERINO SCORED 1:57 AFTER COMING ON ⚡" },
  // ── ENG 2-1 NOR (aet) ──
  { kind: "host", id: "jamie_eng_nor", dur: 8.0 },
  { kind: "seg", id: "n_eng1", aud: 12.251, clips: [{ src: "guard/haaland" }, { src: "guard/bellingham" }],
    names: ["SCHJELDERUP · 36'", "BELLINGHAM · 45'"], score: { home: "ENG", hs: 2, away: "NOR", as: 1, tag: "AET" }, cap: "QUARTERFINAL 4" },
  { kind: "seg", id: "n_eng2", aud: 9.979, clips: [{ src: "guard/bellingham" }, { src: "gen/confetti_storm", vol: 0.5 }],
    names: ["BELLINGHAM AGAIN", ""], score: { home: "ENG", hs: 2, away: "NOR", as: 1, tag: "FT" } },
  { kind: "stats", id: "s_eng", aud: 14.707, extra: 0.8, score: { home: "ENG", hs: 2, away: "NOR", as: 1, tag: "AET" },
    hc: "#FFFFFF", ac: "#BA0C2F", bg: "gen/trophy_reach",
    rows: [
      { label: "POSSESSION", h: 52, a: 48, fmt: "pct" },
      { label: "SHOTS", h: 14, a: 13, fmt: "int" },
      { label: "ON TARGET", h: 8, a: 4, fmt: "int" },
      { label: "XG · 2ND HALF", h: 0.96, a: 0.77, fmt: "dec" },
    ],
    headline: "BELLINGHAM: 2ND YOUNGEST EVER — BEHIND ONLY PELÉ 🐐" },
  { kind: "stats", id: "s_boot", aud: 9.979, extra: 0.8, title: "GOLDEN BOOT RACE", race: true,
    hc: "#FFD86B", ac: "#FFD86B", bg: "gen/trophy_macro",
    rows: [
      { label: "MESSI · ARG", h: 8, a: 0, fmt: "int", c: "#63B3ED" },
      { label: "MBAPPÉ · FRA", h: 8, a: 0, fmt: "int", c: "#4169E1" },
      { label: "HAALAND · NOR (OUT)", h: 7, a: 0, fmt: "int", c: "#BA0C2F" },
    ],
    headline: "TWO GOATS. ONE BOOT. TWO GAMES LEFT." },
  // ── SEMIS ──
  { kind: "host", id: "jamie_verdict", dur: 8.0 },
  { kind: "seg", id: "n_semis", aud: 10.998, extra: 0.5, clips: [{ src: "gen/stadium_night_full", vol: 0.5 }, { src: "gen/trophy_macro", vol: 0.5 }],
    cap: "SEMIFINALS · ESP–FRA · ARG–ENG" },
  { kind: "seg", id: "n_cta", aud: 6.531, extra: 0.5, clips: [{ src: "gen/trophy_reach", vol: 0.5 }] },
];

const LEAD = 6, HOLD = 8;
const beatFrames = (b: Beat) =>
  b.kind === "host" ? Math.round(b.dur * FPS)
  : LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const qfReviewFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

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
      position: "absolute", top: 46, left: "50%",
      transform: `translateX(-50%) translateY(${interpolate(drop, [0, 1], [-70, 0])}px)`,
      display: "flex", alignItems: "center", gap: 16,
      padding: "12px 26px", borderRadius: 14,
      background: "rgba(6,10,22,0.84)", border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: "#63B3ED", letterSpacing: 1 }}>{s.home}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: "#fff", minWidth: 96, textAlign: "center" }}>
        {s.hs} – {s.as}
      </span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: "#FF4D4D", letterSpacing: 1 }}>{s.away}</span>
      {s.tag ? (
        <span style={{ marginLeft: 6, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: GOLD,
          padding: "4px 10px", borderRadius: 8, background: "rgba(255,216,107,0.14)" }}>{s.tag}</span>
      ) : null}
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
  const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
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
            textShadow: "0 6px 30px rgba(0,0,0,0.7)", ...stroke,
          }}>{name}</div>
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
  const headSp = spring({ frame: frame - (LEAD + Math.round(b.rows.length * 9) + 14), fps: FPS, config: { damping: 11, stiffness: 160 } });
  const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
  // adaptive sizing so 5-row cards never collide with the headline
  const compact = b.rows.length >= 5;
  const rowGap = compact ? 20 : 32;
  const valFs = compact ? 38 : 46;
  const labFs = compact ? 24 : 28;
  const barH = compact ? 12 : 16;
  const maxRace = Math.max(...b.rows.map((r) => r.h), 1);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      <OffthreadVideo src={url} playbackRate={0.7} muted
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "blur(10px) brightness(0.35) saturate(1.1)", transform: "scale(1.12)" }} />

      {/* header: score or title */}
      <div style={{
        position: "absolute", top: 74, left: 0, right: 0, textAlign: "center",
        opacity: panelIn, transform: `translateY(${interpolate(panelIn, [0, 1], [-40, 0])}px)`,
      }}>
        {b.score ? (
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 72, color: "#fff", letterSpacing: 2, ...stroke }}>
            <span style={{ color: b.hc === "#FFFFFF" ? "#EAF2FF" : b.hc }}>{b.score.home}</span>
            {"  "}{b.score.hs} – {b.score.as}{"  "}
            <span style={{ color: b.ac }}>{b.score.away}</span>
            {b.score.tag ? (
              <span style={{ marginLeft: 22, fontFamily: BODY, fontWeight: 700, fontSize: 32, color: GOLD }}>{b.score.tag}</span>
            ) : null}
          </span>
        ) : (
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: GOLD, letterSpacing: 4, ...stroke }}>
            👟 {b.title}
          </span>
        )}
      </div>

      {/* stat rows */}
      <div style={{
        position: "absolute", top: 196, left: 240, right: 240,
        opacity: panelIn,
        display: "flex", flexDirection: "column", gap: rowGap,
        padding: `${compact ? 34 : 44}px 60px`, borderRadius: 24,
        background: "rgba(6,10,22,0.72)", border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
      }}>
        {b.rows.map((r, i) => {
          const at = LEAD + 4 + i * 9;
          const sp = spring({ frame: frame - at, fps: FPS, config: { damping: 14, stiffness: 110 } });
          const hVal = r.h * Math.min(1, sp * 1.15);
          if (b.race) {
            const w = (r.h / maxRace) * sp;
            return (
              <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 1, ...stroke }}>{r.label}</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, color: GOLD, ...stroke }}>{fmtVal(hVal, r.fmt)}</span>
                </div>
                <div style={{ height: 20, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.10)" }}>
                  <div style={{ width: `${w * 100}%`, height: "100%", background: r.c ?? b.hc, boxShadow: `0 0 20px ${r.c ?? b.hc}` }} />
                </div>
              </div>
            );
          }
          const total = r.h + r.a || 1;
          const hFrac = (r.h / total) * sp;
          const aFrac = (r.a / total) * sp;
          const aVal = r.a * Math.min(1, sp * 1.15);
          return (
            <div key={r.label} style={{ opacity: interpolate(sp, [0, 0.3], [0, 1]) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: compact ? 6 : 10 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: valFs, color: "#fff", minWidth: 150, ...stroke }}>{fmtVal(hVal, r.fmt)}</span>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: labFs, letterSpacing: 4, color: "rgba(234,242,255,0.75)", textTransform: "uppercase" }}>{r.label}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: valFs, color: "#fff", minWidth: 150, textAlign: "right", ...stroke }}>{fmtVal(aVal, r.fmt)}</span>
              </div>
              <div style={{ display: "flex", height: barH, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.10)" }}>
                <div style={{ width: `${hFrac * 100}%`, background: b.hc, boxShadow: `0 0 18px ${b.hc}` }} />
                <div style={{ flex: 1 }} />
                <div style={{ width: `${aFrac * 100}%`, background: b.ac, boxShadow: `0 0 18px ${b.ac}` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* headline stinger */}
      <div style={{
        position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(headSp, [0, 0.3], [0, 1]),
        transform: `scale(${interpolate(headSp, [0, 1], [0.8, 1])}) rotate(${interpolate(headSp, [0, 1], [-1.5, 0])}deg)`,
      }}>
        <span style={{
          display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 54,
          color: GOLD, letterSpacing: 1, padding: "16px 36px", borderRadius: 16,
          background: "rgba(6,10,22,0.85)", border: `2px solid ${GOLD}`,
          boxShadow: `0 0 40px rgba(255,216,107,0.35)`, maxWidth: 1500, ...stroke,
        }}>{b.headline}</span>
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
      <OffthreadVideo src={staticFile(`qf-review/host/${id}.mp4`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", bottom: 60, left: 70, fontFamily: DISPLAY, fontWeight: 800,
        fontSize: 30, letterSpacing: 3, color: "rgba(234,242,255,0.85)", textTransform: "uppercase",
      }}>KICKOFFDAILY90 · QF REVIEW</div>
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
  const stroke = { WebkitTextStroke: "2.5px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.clips[i].src}>
          <ClipSlot clip={b.clips[i]} len={s.len} name={b.names?.[i] ?? ""} />
        </Sequence>
      ))}
      {b.score ? <Scoreboard s={b.score} frame={frame} /> : null}
      {b.cap ? (
        <div style={{
          position: "absolute", top: b.score ? 130 : 70, left: 0, right: 0, textAlign: "center",
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

export const QFReview: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            {b.kind === "host" ? <HostView id={b.id} dur={b.dur} />
              : b.kind === "stats" ? <StatsView b={b} />
              : <SegView b={b} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
