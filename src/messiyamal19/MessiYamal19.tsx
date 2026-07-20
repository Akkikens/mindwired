/** kickoffdaily90 — "The Baby He Bathed" (Messi × Yamal, 19 years later). 1080×1920, ~47s.
 *  Structure: cold-open FINAL + handshake → water-dissolve flashback to the real 2007
 *  bath photo → the rise → return to the face-off → jersey-swap wish → tune-in + loop.
 *  Continuity stack: one music bed + Spanish VO spine, crossfaded beats, one grade
 *  (vignette+grain) over everything, warm(2007)↔cold(2026) tint, persistent watermark.
 *  All video is image-to-video off real photos / identity-locked keyframes (no drift). */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import "../lib/fonts";
import { Vignette, Grain } from "../components/FilmLook";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const GOLD = "#FFD86B";
const ARG = "#7CC6FF";   // Argentina light blue
const ESP = "#FF4D4D";   // Spain red
const OV = 14;           // crossfade overlap frames

const A = (p: string) => staticFile(`shorts/messiyamal19/${p}`);
const stroke = { WebkitTextStroke: "3px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;
const strokeThin = { WebkitTextStroke: "2px #05070E", paintOrder: "stroke fill" } as React.CSSProperties;

// era tags shown top-center on specific clip beats (the memory timeline)
const TOP_TAG: Record<string, string> = {
  bathalive: "BARCELONA · 2007",
  idol: "2015 · CHAMPIONS LEAGUE",
  walkout: "METLIFE · THE FINAL",
  tub: "NINETEEN YEARS LATER",
};

/* ----------------------------------------------------------------- beats */
type Sub = { en: string; from?: number };        // English subtitle (Spanish is spoken)
type Beat = {
  id: string;
  dur: number;                                    // frames (excl. crossfade linger)
  kind: "clip" | "photo" | "rise" | "card";
  src?: string;
  vo?: string;                                    // audio id in audio/<vo>.mp3
  voAt?: number;                                  // frame to start VO (default 8)
  sub?: Sub;                                      // burned English subtitle
  tint?: "warm" | "cold" | "none";
  rise?: string[];                                // rise: list of photo srcs
};

const S = (s: number) => Math.round(s * FPS);

const BEATS: Beat[] = [
  { id: "stadium", kind: "clip", src: "broll/stadium.mp4", dur: S(2.6), tint: "cold", sub: { en: "" } },
  { id: "handshake", kind: "clip", src: "clips/s2_handshake.mp4", dur: S(5.0), tint: "cold" },
  // CENTERPIECE — young 2007 Messi talking to baby Yamal, brought to life
  { id: "bathalive", kind: "clip", src: "broll/bathalive.mp4", dur: S(6.6), tint: "warm",
    vo: "vo1", sub: { en: "Nineteen years ago,\nI bathed you with my own hands." } },
  // 2015 — the kid who idolized Messi's Champions League (Ken Burns living photo)
  { id: "idol", kind: "photo", src: "keyframes/kf_idol.png", dur: S(5.0), tint: "warm",
    vo: "vo_idol", sub: { en: "You grew up watching me lift these trophies." } },
  { id: "rise", kind: "rise", rise: ["broll/bath.jpg", "broll/yamal_real.jpg"], dur: S(4.8), tint: "warm",
    vo: "vo2", sub: { en: "You didn't even know my name.\nNow the whole world knows yours." } },
  // THE FINAL IS HERE — epic spectacle burst (walkout → trophy → crowd)
  { id: "walkout", kind: "clip", src: "broll/walkout.mp4", dur: S(2.4), tint: "cold" },
  { id: "trophy", kind: "clip", src: "broll/trophy.mp4", dur: S(2.4), tint: "cold" },
  { id: "crowd", kind: "clip", src: "broll/crowd.mp4", dur: S(2.4), tint: "cold" },
  { id: "faceoff", kind: "clip", src: "clips/s7_faceoff.mp4", dur: S(6.6), tint: "cold",
    vo: "vo4", sub: { en: "They call this my last dance. I never said that.\nBut if it is… I'm glad it's you." } },
  // FULL CIRCLE — the two of them, grown, holding the same blue tub (Ken Burns living photo)
  { id: "tub", kind: "photo", src: "keyframes/kf_tub.png", dur: S(5.0), tint: "warm",
    vo: "vo_tub", sub: { en: "Nineteen years… and we're back to the beginning." } },
  { id: "swap", kind: "clip", src: "clips/s8_swap.mp4", dur: S(5.0), tint: "warm",
    vo: "vo5", sub: { en: "The same red. The same blue. One last time." } },
  { id: "tunein", kind: "card", src: "broll/bath.jpg", dur: S(7.0), tint: "warm" },
];

const starts: number[] = [];
BEATS.reduce((acc, b, i) => { starts[i] = acc; return acc + b.dur; }, 0);
const MAIN_FRAMES = BEATS.reduce((a, b) => a + b.dur, 0) + OV; // +OV linger on the final beat
const OUTRO_FRAMES = 268;                                      // kickoffdaily90 short outro (8.94s @30)
export const messiYamal19Frames = () => MAIN_FRAMES + OUTRO_FRAMES;

const startOf = (id: string) => { let a = 0; for (const b of BEATS) { if (b.id === id) return a; a += b.dur; } return a; };
// emotional music envelope: dip under the intimate confessions, swell on the
// idol/UCL beat + the spectacle burst + the full-circle tub + the final card.
const MUSIC_PTS: [number, number][] = [
  [0, 0.34],
  [startOf("bathalive") + 18, 0.24],
  [startOf("idol") + 14, 0.54],
  [startOf("rise") + 10, 0.42],
  [startOf("walkout") + 4, 0.62],
  [startOf("faceoff") + 24, 0.34],
  [startOf("faceoff") + 118, 0.20],   // near-silence for "I'm glad it's you"
  [startOf("faceoff") + 176, 0.32],
  [startOf("tub") + 10, 0.50],
  [startOf("swap") + 10, 0.52],
  [startOf("tunein") + 10, 0.62],
  [MAIN_FRAMES - 8, 0.50],
];
const musicVol = (f: number) =>
  interpolate(f, MUSIC_PTS.map((p) => p[0]), MUSIC_PTS.map((p) => p[1]),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ----------------------------------------------------------------- helpers */
const useFade = (len: number, headIn = OV, tailOut = OV) => {
  const f = useCurrentFrame();
  const head = interpolate(f, [0, Math.max(1, headIn)], [0, 1], { extrapolateRight: "clamp" });
  if (tailOut <= 0) return head;
  const tail = interpolate(f, [len - tailOut, len], [1, 0], { extrapolateLeft: "clamp" });
  return Math.min(head, tail);
};

const Tint: React.FC<{ tint?: Beat["tint"] }> = ({ tint }) => {
  if (!tint || tint === "none") return null;
  const bg = tint === "warm"
    ? "linear-gradient(180deg, rgba(90,40,10,0.28), rgba(120,55,15,0.18))"
    : "linear-gradient(180deg, rgba(8,26,52,0.30), rgba(4,12,28,0.22))";
  return <AbsoluteFill style={{ background: bg, mixBlendMode: "soft-light", pointerEvents: "none" }} />;
};

/** English subtitle band (Spanish is the spoken VO). */
const Subtitle: React.FC<{ text: string; appearAt?: number }> = ({ text, appearAt = 6 }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f - appearAt, fps: FPS, config: { damping: 18, stiffness: 120 } });
  if (!text) return null;
  return (
    <div style={{
      position: "absolute", bottom: 300, left: 60, right: 60, textAlign: "center",
      opacity: interpolate(sp, [0, 0.5], [0, 1]),
      transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`,
    }}>
      {text.split("\n").map((line, i) => (
        <div key={i} style={{
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 1.28,
          color: "#fff", ...strokeThin,
        }}>{line}</div>
      ))}
    </div>
  );
};

const Watermark: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 118, left: 0, right: 0, textAlign: "center",
    fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, letterSpacing: 6,
    color: "rgba(255,216,107,0.72)", textTransform: "uppercase", ...strokeThin,
    pointerEvents: "none",
  }}>@KICKOFFDAILY90</div>
);

/* Ken Burns still (real photo, cover-fit, slow push). */
const KenBurns: React.FC<{ src: string; len: number; from?: number; to?: number; shimmer?: boolean }> =
  ({ src, len, from = 1.04, to = 1.14, shimmer }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, len], [from, to]);
  return (
    <AbsoluteFill>
      <Img src={A(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      {shimmer ? (
        <AbsoluteFill style={{
          background: "radial-gradient(120% 60% at 50% 92%, rgba(120,180,255,0.18), transparent 60%)",
          mixBlendMode: "screen", opacity: 0.5 + 0.5 * Math.sin(f / 7), pointerEvents: "none",
        }} />
      ) : null}
    </AbsoluteFill>
  );
};

const ClipFill: React.FC<{ src: string; slow?: number; scaleFrom?: number }> =
  ({ src, slow = 1, scaleFrom = 1.02 }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 180], [scaleFrom, scaleFrom + 0.06]);
  return (
    <OffthreadVideo src={A(src)} muted playbackRate={slow}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
  );
};

/* ----------------------------------------------------------------- beat views */
const ClipBeat: React.FC<{ b: Beat; len: number }> = ({ b, len }) => {
  const fade = useFade(len);
  const f = useCurrentFrame();
  // the bath flashback dissolve: strong blur + flash on the FIRST beat after the tight handshake
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      <ClipFill src={b.src!} slow={b.id === "swap" ? 0.85 : b.id === "faceoff" ? 0.9 : (b.id === "bathalive" || b.id === "idol" || b.id === "tub") ? 0.85 : 1} />
      <Tint tint={b.tint} />
      {TOP_TAG[b.id] ? (
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center",
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: GOLD, ...strokeThin }}>
          {TOP_TAG[b.id]}
        </div>
      ) : null}
      {b.id === "handshake" ? <HandshakeCaptions /> : null}
      {b.sub?.en ? <Subtitle text={b.sub.en} appearAt={(b.voAt ?? 8)} /> : null}
    </AbsoluteFill>
  );
};

const PhotoBeat: React.FC<{ b: Beat; len: number }> = ({ b, len }) => {
  const fade = useFade(len);
  const f = useCurrentFrame();
  // magical arrival: slight blur that resolves (dissolve INTO the real photo)
  const blur = interpolate(f, [0, 18], [16, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
        <KenBurns src={b.src!} len={len} shimmer={false} />
      </AbsoluteFill>
      <Tint tint={b.tint} />
      {TOP_TAG[b.id] ? (
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center",
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: GOLD, ...strokeThin }}>
          {TOP_TAG[b.id]}
        </div>
      ) : null}
      {b.sub?.en ? <Subtitle text={b.sub.en} appearAt={(b.voAt ?? 8)} /> : null}
    </AbsoluteFill>
  );
};

const RiseBeat: React.FC<{ b: Beat; len: number }> = ({ b, len }) => {
  const fade = useFade(len);
  const imgs = b.rise!;
  const per = Math.floor(len / imgs.length);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      {imgs.map((src, i) => (
        <Sequence key={i} from={i * per} durationInFrames={per + OV} name={`rise-${i}`}>
          <RiseImg src={src} per={per} />
        </Sequence>
      ))}
      <Tint tint={b.tint} />
      <div style={{ position: "absolute", top: 150, left: 30, right: 30, textAlign: "center",
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: GOLD,
        textTransform: "uppercase", ...strokeThin }}>
        FC Barcelona made<br/>them both.
      </div>
      {b.sub?.en ? <Subtitle text={b.sub.en} appearAt={(b.voAt ?? 8)} /> : null}
    </AbsoluteFill>
  );
};
const RiseImg: React.FC<{ src: string; per: number }> = ({ src, per }) => {
  const fade = useFade(per + OV, 10, 10);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <KenBurns src={src} len={per + OV} from={1.06} to={1.16} />
    </AbsoluteFill>
  );
};

/** Cold-open captions layered on the handshake: label + the shock hook. */
const HandshakeCaptions: React.FC = () => {
  const f = useCurrentFrame();
  const label = spring({ frame: f - 4, fps: FPS, config: { damping: 18 } });
  const hook = spring({ frame: f - S(2.6), fps: FPS, config: { damping: 16, stiffness: 110 } });
  return (
    <>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(label, [0, 0.5], [0, 1]),
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: 5,
        color: "rgba(234,242,255,0.92)", textTransform: "uppercase", ...strokeThin }}>
        <span style={{ color: ARG }}>ARGENTINA</span> &nbsp;vs&nbsp; <span style={{ color: ESP }}>SPAIN</span><br/>
        <span style={{ fontSize: 22, letterSpacing: 4, opacity: 0.85 }}>THE WORLD CUP FINAL</span>
      </div>
      <div style={{ position: "absolute", bottom: 360, left: 40, right: 40, textAlign: "center",
        opacity: interpolate(hook, [0, 0.5], [0, 1]),
        transform: `scale(${interpolate(hook, [0, 1], [0.9, 1])})` }}>
        <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 900, fontSize: 58,
          color: "#fff", lineHeight: 1.15, ...stroke }}>
          19 years ago,<br/>he <span style={{ color: GOLD }}>bathed</span> him.
        </span>
      </div>
    </>
  );
};

/* Tune-in + loop-back card. */
const TuneInBeat: React.FC<{ b: Beat; len: number }> = ({ b, len }) => {
  const fade = useFade(len, OV, 0);
  const f = useCurrentFrame();
  const god = spring({ frame: f - 6, fps: FPS, config: { damping: 16, stiffness: 90 } });
  const vs = spring({ frame: f - S(2.2), fps: FPS, config: { damping: 16 } });
  const date = spring({ frame: f - S(3.2), fps: FPS, config: { damping: 16 } });
  const cta = spring({ frame: f - S(4.6), fps: FPS, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E", opacity: fade }}>
      <AbsoluteFill style={{ opacity: 0.42 }}>
        <KenBurns src={b.src!} len={len} from={1.1} to={1.2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,14,0.55), rgba(5,7,14,0.82))" }} />
      {/* GOD COULDN'T WRITE THIS */}
      <div style={{ position: "absolute", top: 360, left: 40, right: 40, textAlign: "center",
        opacity: interpolate(god, [0, 0.5], [0, 1]), transform: `translateY(${interpolate(god,[0,1],[26,0])}px)` }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 78, color: "#fff", lineHeight: 1.05, ...stroke }}>
          GOD COULDN'T<br/>WRITE THIS.
        </span>
      </div>
      {/* matchup */}
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(vs, [0, 0.5], [0, 1]),
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, ...stroke }}>
        <span style={{ color: ESP }}>SPAIN</span> <span style={{ color: "#fff", fontSize: 40 }}>vs</span> <span style={{ color: ARG }}>ARGENTINA</span>
      </div>
      <div style={{ position: "absolute", top: 830, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(date, [0, 0.5], [0, 1]),
        fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: GOLD, ...strokeThin }}>
        MetLife · SUNDAY, JULY 19
      </div>
      <div style={{ position: "absolute", top: 892, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(date, [0, 0.6], [0, 1]),
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 1,
        color: "rgba(234,242,255,0.9)", ...strokeThin }}>
        Six days after Yamal turned 19.
      </div>
      {/* father quote */}
      <div style={{ position: "absolute", top: 960, left: 70, right: 70, textAlign: "center",
        opacity: interpolate(date, [0, 0.6], [0, 1]),
        fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, fontStyle: "italic",
        color: "rgba(234,242,255,0.85)", ...strokeThin }}>
        "The beginning of two legends."<br/><span style={{ fontSize: 20, opacity: 0.7 }}>— Yamal's father, 2024</span>
      </div>
      {/* CTA */}
      <div style={{ position: "absolute", bottom: 220, left: 50, right: 50, textAlign: "center",
        opacity: interpolate(cta, [0, 0.5], [0, 1]) }}>
        <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 800, fontSize: 34,
          color: "#fff", lineHeight: 1.35, padding: "16px 26px", borderRadius: 16,
          background: "rgba(6,10,22,0.7)", border: `2px solid ${GOLD}`, ...strokeThin }}>
          Heart says <span style={{ color: ARG }}>MESSI</span> 🇦🇷<br/>
          Future says <span style={{ color: ESP }}>YAMAL</span> 🇪🇸<br/>Who lifts it? 👇
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- root */
export const MessiYamal19: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070E" }}>
      {/* ---- MAIN FILM (music + grade + watermark scoped here only) ---- */}
      <Sequence durationInFrames={MAIN_FRAMES} name="film">
        {/* continuous music bed = the spine, with an emotional volume envelope */}
        <Audio src={staticFile("beds/doc_awe.mp3")} volume={musicVol} />

        {BEATS.map((b, i) => {
          const from = starts[i];
          const len = b.dur + OV; // linger OV to overlap next / fade out at end
          return (
            <Sequence key={b.id} from={from} durationInFrames={len} name={b.id}>
              {b.kind === "clip" ? <ClipBeat b={b} len={len} />
                : b.kind === "photo" ? <PhotoBeat b={b} len={len} />
                : b.kind === "rise" ? <RiseBeat b={b} len={len} />
                : <TuneInBeat b={b} len={len} />}
              {/* per-beat VO, offset so it lands after the cut */}
              {b.vo ? <Sequence from={b.voAt ?? 8}><Audio src={A(`audio/${b.vo}.mp3`)} volume={1} /></Sequence> : null}
            </Sequence>
          );
        })}

        {/* the opening thesis over the stadium (before the hook lands) */}
        <Sequence from={0} durationInFrames={starts[1] + 8} name="thesis">
          <ThesisCaption />
        </Sequence>

        {/* global grade + watermark over the film only */}
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Vignette strength={1} />
          <Grain opacity={0.06} />
        </AbsoluteFill>
        <Watermark />
      </Sequence>

      {/* ---- KICKOFFDAILY90 SUBSCRIBE OUTRO (baked in, one render) ---- */}
      <Sequence from={MAIN_FRAMES} durationInFrames={OUTRO_FRAMES} name="outro">
        <OffthreadVideo src={staticFile("outro/subscribe_kickoffdaily90_short.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </AbsoluteFill>
  );
};

const ThesisCaption: React.FC = () => {
  const f = useCurrentFrame();
  const inSp = spring({ frame: f - 6, fps: FPS, config: { damping: 20 } });
  const out = interpolate(f, [S(2.4), S(3.0)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: Math.min(interpolate(inSp,[0,0.5],[0,1]), out) }}>
      <div style={{ textAlign: "center", padding: "0 60px" }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, color: "#fff", lineHeight: 1.15, ...stroke }}>
          Some stories<br/>are too perfect<br/>to be <span style={{ color: GOLD }}>written.</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
