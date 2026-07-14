/** mindwired — TIMELAPSE OF THE END OF THE UNIVERSE (1920×1080, DOM comp, no WebGL).
 *
 *  Visual stack (Akshay 2026-07-13: no home-built 3D):
 *   - real JWST/Hubble/Cassini imagery with slow push-in + drift (Ken Burns)
 *   - 9 Veo hero clips (public/shorts/endoftime/broll-video) at the money moments
 *   - the doubling year-counter interstitials ("timescale" scenes) + persistent epoch chip
 *   - typography cards ("word" scenes) in thin spaced caps
 *   - ONE unifying finish over everything: 2.39:1 letterbox, film grain, vignette,
 *     desaturated grade — this is what makes mixed sources read as one film.
 *
 *  Data: endoftime.json (topic lines) + endoftime.manifest.json (durations)
 *        + endoftime.shotlist.json (per-line visual assignment, audited).
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import doc from "../mindwired-doc/docs/endoftime.json";
import manifest from "../mindwired-doc/docs/endoftime.manifest.json";
import shotlist from "../mindwired-doc/docs/endoftime.shotlist.json";

const FPS = 30;
const LEAD = 8, HOLD = 20;
const DISPLAY = "'Space Grotesk', sans-serif";
const ACCENT = "#FFB65C"; // single warm accent (craft brief)
const CYAN = "#4DD8FF";

type Line = { id: string; text: string; scene: string; arg?: string };
type Shot = { id: string; scene: string; type: string; file?: string; label?: string };
const SHOTS: Record<string, Shot> = Object.fromEntries((shotlist as Shot[]).map(s => [s.id, s]));
const DUR: Record<string, number> = (manifest as any).durations;

const lineAud = (l: Line) => DUR[l.id] ?? l.text.split(/\s+/).length / 2.1;
const lineFrames = (l: Line) => LEAD + Math.round(lineAud(l) * FPS) + HOLD;
export const endOfTimeTotalFrames = () =>
  (doc.lines as Line[]).reduce((a, l) => a + lineFrames(l), 0);

/* epoch labels live on year-pattern word cards ("10,000 YEARS", "10^40"...) */
const isYear = (a?: string) => !!a && /YEARS|10\^|GOOGOL|TRILLION|BILLION|MILLION/i.test(a);
const EPOCH: Record<string, string> = (() => {
  let cur = "NOW · 2026";
  const m: Record<string, string> = {};
  for (const l of doc.lines as Line[]) {
    if (l.scene === "word" && isYear(l.arg)) cur = l.arg!;
    m[l.id] = cur;
  }
  return m;
})();
/* counter scenes race toward the NEXT epoch card's label */
const COUNTER_TARGET: Record<string, string> = (() => {
  const lines = doc.lines as Line[];
  const m: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].scene !== "timescale") continue;
    let label = "10^100";
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].scene === "word" && isYear(lines[j].arg)) { label = lines[j].arg!; break; }
    }
    m[lines[i].id] = label;
  }
  return m;
})();

/* ── the single unifying finish ── */
const Finish: React.FC = () => (
  <>
    {/* film grain: two offset turbulence layers animated by frame parity */}
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.055, mixBlendMode: "overlay" }}>
      <GrainSVG />
    </AbsoluteFill>
    {/* vignette */}
    <AbsoluteFill style={{ pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.55) 100%)" }} />
    {/* 2.39:1 letterbox */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 138, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 138, background: "#000" }} />
  </>
);
const GrainSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = 1 + (frame % 7);
  return (
    <svg width="1920" height="1080">
      <filter id={`gr${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
      </filter>
      <rect width="1920" height="1080" filter={`url(#gr${seed})`} />
    </svg>
  );
};

/* persistent epoch chip + brand */
const Overlay: React.FC<{ epoch: string }> = ({ epoch }) => (
  <>
    <div style={{ position: "absolute", top: 152, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, letterSpacing: 8,
        color: "rgba(255,255,255,0.72)" }}>{epoch}</span>
    </div>
    <div style={{ position: "absolute", top: 152, right: 60, display: "flex", alignItems: "center", gap: 8, opacity: 0.6 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: "#fff" }}>mindwired</span>
    </div>
  </>
);

/* caption */
const Cap: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const sp = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 20 } });
  return (
    <div style={{ position: "absolute", bottom: 172, left: 200, right: 200, textAlign: "center",
      transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`, opacity: sp }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 34,
        color: "rgba(255,255,255,0.92)", lineHeight: 1.4, textShadow: "0 2px 18px rgba(0,0,0,0.95)" }}>
        {text}
      </span>
    </div>
  );
};

/* real image with slow push-in + drift */
const ImgScene: React.FC<{ file: string; idx: number; dur: number }> = ({ file, idx, dur }) => {
  const frame = useCurrentFrame();
  const t = frame / dur;
  const zoomIn = idx % 3 !== 2; // mostly push-in, occasionally pull-out
  const scale = zoomIn ? interpolate(t, [0, 1], [1.04, 1.18]) : interpolate(t, [0, 1], [1.18, 1.05]);
  const driftX = interpolate(t, [0, 1], [0, (idx % 2 === 0 ? 1 : -1) * 30]);
  const driftY = interpolate(t, [0, 1], [0, (idx % 4 < 2 ? 1 : -1) * 14]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img src={staticFile(`shorts/endoftime/images/${file}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translate(${driftX}px, ${driftY}px)`,
          filter: "saturate(0.82) contrast(1.09) brightness(0.96)" }} />
    </AbsoluteFill>
  );
};

/* Video scene shared by veo + free clips.
   - CONSECUTIVE run of the same file (a climax sequence, runLen>1): the run plays
     as ONE continuous shot — each beat continues where the previous ended, so a
     10-beat evaporation reads as one unbroken clip, not 10 restarts.
   - SCATTERED reuse (runLen==1, seed differs): each use seeds a distinct start
     offset into the clip, so the same source never shows the same segment.  */
const VideoScene: React.FC<{
  dir: string; file: string; dur: number; clipSec: number;
  runIdx: number; runLen: number; seed: number; rate: number;
}> = ({ dir, file, dur, clipSec, runIdx, runLen, seed, rate }) => {
  let startSec: number;
  if (runLen > 1) {
    // spread the clip across the whole run (played slow); this beat starts at
    // its slice, continuing the motion rather than restarting.
    startSec = (clipSec / runLen) * runIdx;
  } else {
    startSec = (seed % Math.max(1, Math.floor(clipSec / 3))) * 3;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(`shorts/endoftime/${dir}/${file}`)}
        muted playbackRate={rate} startFrom={Math.round(startSec * FPS)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "saturate(0.88) contrast(1.06)" }} />
    </AbsoluteFill>
  );
};
const CLIP_SEC: Record<string, number> = {
  // veo all 8s; NASA clips vary — used to slice runs correctly
  "galaxysim_clean.mp4": 67, "sunlive_clean.mp4": 54, "nurseryfly_pillars3d_svs14616.mp4": 148,
  "earthiss_night_svs30180.mp4": 54, "earthiss_aurora_svs30179.mp4": 45,
  "earlyuni_reionization_svs13511.mp4": 35, "supernovasim_svs20413.mp4": 40,
  "merger_close_svs13197.mp4": 33, "merger_flyin_svs13197.mp4": 33,
  "galaxysim_roman_zoom_svs14301.mp4": 22, "blackhole_approach_svs14619.mp4": 15,
  "earlyuni_structure_svs14297.mp4": 15, "sunlive_tcrb_nova_svs20393.mp4": 15,
  "blackhole_lensed_disk_svs13326.mp4": 5.5,
};

/* typography card */
const WordCard: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const sp = spring({ frame, fps: FPS, config: { damping: 18 } });
  const big = (line.arg ?? line.text).toUpperCase();
  const isTitle = line.scene === "title" || line.scene === "intro";
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: sp, transform: `scale(${interpolate(sp, [0, 1], [0.97, 1])})` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: isTitle ? 700 : 300,
          fontSize: isTitle ? 92 : 64, letterSpacing: isTitle ? 4 : 14,
          color: "#fff", maxWidth: 1500, lineHeight: 1.25 }}>{big}</div>
        {isTitle && <div style={{ width: 140, height: 5, background: ACCENT, margin: "34px auto 0", borderRadius: 4 }} />}
      </div>
    </AbsoluteFill>
  );
};

/* the doubling counter interstitial */
const CounterScene: React.FC<{ label: string; dur: number }> = ({ label, dur }) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, frame / (dur * 0.7));
  // exponential race: accelerate through magnitudes then settle on label
  const eased = 1 - Math.pow(1 - t, 3);
  const exp = interpolate(eased, [0, 1], [0, 1]);
  const isPow = label.includes("^");
  const WORDMAG: Record<string, number> = { MILLION: 6, BILLION: 9, TRILLION: 12, GOOGOL: 100 };
  let mag = 4; // default 10^4
  if (isPow) mag = parseInt(label.split("^")[1] || "100", 10);
  else {
    for (const [w, m2] of Object.entries(WORDMAG)) if (label.toUpperCase().includes(w)) mag = m2 + (label.match(/^(\d+)00/) ? 2 : 0);
    const digits = label.replace(/[^0-9]/g, "");
    if (!Object.keys(WORDMAG).some(w => label.toUpperCase().includes(w)) && digits) mag = digits.length;
  }
  let display: string;
  if (t >= 0.98) display = label;
  else if (mag > 15) display = `10^${Math.max(1, Math.floor(exp * mag))}`;
  else {
    const v = Math.floor(Math.pow(Math.pow(10, mag), exp));
    display = v.toLocaleString("en-US");
  }
  const shake = t < 0.95 ? Math.sin(frame * 2.2) * 1.5 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      {/* rushing tick field */}
      {Array.from({ length: 26 }, (_, i) => {
        const p = ((frame * (6 + i % 5) + i * 173) % 1100) / 1100;
        return <div key={i} style={{ position: "absolute", left: 1920 * ((i * 79) % 100) / 100,
          top: 1080 * p, width: 2, height: 26 + (i % 3) * 18, background: "rgba(255,255,255,0.16)" }} />;
      })}
      <div style={{ textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 30, letterSpacing: 12,
          color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>YEARS FROM NOW</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, letterSpacing: 2,
          color: "#fff", fontVariantNumeric: "tabular-nums" }}>{display}</div>
        <div style={{ width: 120, height: 4, background: ACCENT, margin: "30px auto 0", borderRadius: 3,
          opacity: t >= 0.98 ? 1 : 0.25 }} />
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ line: Line; idx: number }> = ({ line, idx }) => {
  const shot = SHOTS[line.id];
  const dur = lineFrames(line);
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" });
  const hasAudio = DUR[line.id] !== undefined;
  const isCard = shot?.type === "card" || shot?.type === "counter";
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      {shot?.type === "img" && shot.file && <ImgScene file={shot.file} idx={idx} dur={dur} />}
      {shot?.type === "veo" && shot.file && (
        <VideoScene dir="broll-video" file={shot.file} dur={dur} clipSec={8}
          runIdx={(shot as any).runIdx ?? 0} runLen={(shot as any).runLen ?? 1}
          seed={idx} rate={(shot as any).runLen > 1 ? 0.5 : Math.max(0.4, Math.min(1, (8 * FPS) / dur))} />
      )}
      {shot?.type === "free" && shot.file && (
        <VideoScene dir={(shot as any).dir ?? "freeclips"} file={shot.file} dur={dur} clipSec={CLIP_SEC[shot.file] ?? 30}
          runIdx={(shot as any).runIdx ?? 0} runLen={(shot as any).runLen ?? 1}
          seed={idx} rate={0.65} />
      )}
      {shot?.type === "counter" && <CounterScene label={COUNTER_TARGET[line.id] ?? "10^100"} dur={dur} />}
      {shot?.type === "card" && <WordCard line={line} />}
      {!isCard && (
        <AbsoluteFill style={{ pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 26%, transparent 62%, rgba(0,0,0,0.72) 100%)" }} />
      )}
      {!isCard && <Overlay epoch={EPOCH[line.id]} />}
      {!isCard && line.scene !== "outro" && <Cap text={line.text} />}
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/endoftime/audio/${line.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const EndOfTimeEpic: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {(doc.lines as Line[]).map((l, i) => {
        const from = cursor; const dur = lineFrames(l); cursor += dur;
        return (
          <Sequence key={l.id} from={from} durationInFrames={dur} name={`${l.id}·${l.scene}`}>
            <Scene line={l} idx={i} />
          </Sequence>
        );
      })}
      <Finish />
    </AbsoluteFill>
  );
};
