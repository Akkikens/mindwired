/** mindwired archival-documentary template (16:9, 1920×1080).
 *
 *  The $0 long-form system: real PD/CC archival photos (scripts/fetch_media.py)
 *  with Ken-Burns motion, English caption/stat overlays, chapter title cards,
 *  and cloned-channel-voice narration (scripts/build_doc_vo.py).
 *
 *  Fully data-driven: a doc spec JSON (src/mindwired-doc/docs/<slug>.json) plus
 *  its generated manifest (<slug>.manifest.json — real clip durations + a scan
 *  of public/shorts/<slug>/images grouped by filename prefix). A scene's `img`
 *  is a prefix; the template cycles through that prefix's files so repeated
 *  subjects still get visual variety. Missing image prefix → dark base; missing
 *  audio → estimated duration (video renders, rerun the VO builder later).
 *
 *  New doc = new JSON + fetch queries + one makeDocComp() registration in Root.
 */
import React from "react";
import { DEVANAGARI_FONT_CSS } from "./devanagariFont";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import { DIAGRAMS } from "./Diagrams";
import { DossierScene, MascotReact, MascotZoom, SketchScene } from "./Sketch";

const FPS = 30;
const BASE = "#05070C";

type Theme = { display: string; body: string; accent: string; brand: string };
const THEMES: Record<string, Theme> = {
  mindwired: {
    display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
    accent: "#4DD8FF", brand: "mindwired",
  },
  dimaagbatti: {
    display: "'Noto Sans Devanagari', 'Space Grotesk', sans-serif",
    body: "'Noto Sans Devanagari', 'Inter', sans-serif",
    accent: "#FFC53D", brand: "दिमाग़बत्ती",
  },
  blackbox: {
    display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
    accent: "#FF9500", brand: "Black Box",
  },
  // Criminal Record (@WatchCriminalRecord) — cold blue-white so it reads as
  // Black Box's sibling, not a clone. See docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md
  criminalrecord: {
    display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
    accent: "#7FB4FF", brand: "Criminal Record",
  },
};

/** One SFX cue: name = file stem in public/sfx/ (see scripts/gen_sfx_kit.py).
 *  at: frame offset, or "in" (scene start) / "out" (scene end minus the clip).
 *  loop: repeat until the scene ends (ambience/static beds). */
// `at` accepts plain string because JSON imports widen "in"/"out" literals;
// unknown strings behave like "in" (scene start).
export type SfxCue = { name: string; at?: number | string; volume?: number; loop?: boolean };

export type DocScene = {
  id: string; text: string; cap?: string;
  img?: string; stat?: string; statColor?: string;
  chapter?: string;
  /** Explicit SFX cues; ADDED to the automatic ones (radio squelch/static,
   *  chapter boom, stat hit). noAutoSfx silences the automatic cues. */
  sfx?: SfxCue[]; noAutoSfx?: boolean;
  /** Camera move for photo scenes: push (default, alternates with pull), pull, drift. */
  camera?: "push" | "pull" | "drift";
  /** Depth-gauge device (descent-structured docs): meters below surface.
   *  Once any scene sets it, a persistent gauge overlays every following scene,
   *  animating down from the previous scene's depth. */
  depth?: number;
  diagram?: string; arg?: string;
  /** Evidence-engine radio beat: speaker tag renders the RadioScene
   *  (waveform + transcript). radioLabel MUST be honest:
   *  "ACTUAL ATC RECORDING" for real docket audio dropped into audio/<id>.mp3,
   *  "CVR RECREATION" for radio_recreate.py synthesis. */
  speaker?: string; radioLabel?: string; timestamp?: string;
  /** Real footage (e.g. NTSB animation): plays public/shorts/<slug>/video/<video>,
   *  muted, letterboxed, with narration audio over it. videoFrom = start seconds
   *  (window into a long clip so consecutive scenes progress through it). */
  video?: string; videoFrom?: number;
  /** Hand-drawn brand layer (Sketch.tsx): sketch:true renders the img prefix as
   *  an ink illustration on paper (draw-on reveal, line boil, Caveat captions);
   *  react:<pose> pops the mascot (public/mascot/<pose>.png, gen_mascot.py)
   *  into the corner of ANY scene type; note = handwritten margin annotation;
   *  speak:true = the mascot SPEAKS the narration (cartoon mouth-flaps from the
   *  manifest's per-frame loudness track — scripts/lib/mouthtrack.py);
   *  circle:[cx,cy,r] = ink-circle highlight drawn on the illustration. */
  sketch?: boolean; react?: string; note?: string; speak?: boolean;
  circle?: number[];  // [cx, cy, r] — plain array so JSON imports typecheck
  /** full-screen mascot cutaway: the character fills the frame at face scale
   *  and speaks the scene (requires speak:true for the mouth track) */
  mascotFull?: boolean;
  /** aside mode: the mascot stands at the left edge (half size) presenting the
   *  scene's `img` illustration (drawn on with the SketchScene engine, optional
   *  `circle` highlight) while speaking — built for the anatomy chapters
   *  ("this layer is the armor, this chip is me"). Implies speak. */
  mascotAside?: boolean;
  /** talking-rig prefix in public/mascot/ ("host" default = mindwired astro,
   *  "bb_host" = blackbox recorder robot) */
  rig?: string;
  /* ---------- documentary-pivot craft layer (2026-07-21) ---------- */
  /** EXHIBIT beat (the Jani "receipts on screen" move): renders the scene's
   *  `img` (a real document page — PDF page → PNG placed in images/) as an
   *  evidence exhibit — dark blurred surround, slow push, an accent highlight
   *  box, and a source lower-third from `source`. `highlight` = [x,y,w,h] in
   *  0–1 page fractions; the push zooms toward it (the damning line). */
  exhibit?: boolean;
  source?: string;          // exhibit citation lower-third ("MIT Study, 2014 · p.14")
  highlight?: number[];     // [x,y,w,h] fractional highlight/zoom target
  /** DOSSIER beat (docs/guides/DOSSIER-SCENES.md): the illustrated sibling of
   *  `exhibit` for beats with ZERO real photo/footage coverage (an unfilmable
   *  moment, an abstraction) — hand-cut paper-collage "case file" look, always
   *  tagged RECONSTRUCTION. `img` is the Gemini-generated cutout prefix
   *  (scripts/gen_doc_dossier.py); `label` is a short 1-4 word date/name
   *  stamp. Never use for a real person/event that has archival coverage. */
  dossier?: boolean;
  label?: string;
  /** KINETIC typography-on-black beat (the "second narrator"): a number
   *  counting up (count → optional strike to a second number), and/or words
   *  materializing one-by-one, silence-synced to the narration. */
  kinetic?: {
    count?: number; countLabel?: string; prefix?: string; suffix?: string;
    strike?: number; strikeLabel?: string;   // struck-through reveal (200,000 → 2,761)
    words?: string[];                         // materialize word-by-word
    sub?: string;                             // small subtitle under the figure
  };
  /** DELAYED BRAND STING: the audio-led mindwired ident that plays AFTER the
   *  cold open — wordmark bloom + a musical motif + the spoken line. One
   *  standing beat, identical every episode. Text = "You're watching mindwired." */
  sting?: boolean;
  /** Variable time-density: Ken Burns intensity on photo scenes.
   *  "fast" = a bigger, quicker move (montage); "slow" = near-static (pivots). */
  motion?: "fast" | "slow";
  /** Extra hold frames appended to the scene — a controllable beat of dead air
   *  (e.g. before a reveal). Mirrored in scripts/lib/doctiming.py. */
  extraHold?: number;
  tone?: string;            // Cartesia emotion (VO-only; ignored by the renderer)
  speed?: number;           // per-scene VO speed (VO-only; ignored by the renderer)
};
export type DocSpec = { slug: string; title: string; channel?: string; scenes: DocScene[] };
export type DocManifest = {
  durations: Record<string, number>;
  images: Record<string, string[]>;
  /** per-scene mouth-flap tracks ("0"-"3" per frame) for speak:true scenes */
  mouth?: Record<string, string>;
};
// Subscribe outro baked INTO the render (one render, no separate ffmpeg concat).
// file = REAL copy under public/ (NOT a symlink — Remotion doesn't bundle symlinks); frames @30fps.
export type OutroSpec = { file: string; frames: number };

const LEAD = 10, HOLD = 24;

/* ---------- SFX layer (files from scripts/gen_sfx_kit.py → public/sfx/) ----------
   Every clip is synthesized + owned. Default volumes sit WELL under the VO
   (which plays at 1.0); the post-render loudnorm only normalizes the total. */
const SFX: Record<string, { file: string; vol: number; frames: number }> = {
  radio_key_up:    { file: "sfx/radio_key_up.wav",    vol: 0.30, frames: 5 },
  radio_key_down:  { file: "sfx/radio_key_down.wav",  vol: 0.25, frames: 3 },
  radio_static_bed:{ file: "sfx/radio_static_bed.wav",vol: 0.07, frames: 360 },
  cockpit_hum:     { file: "sfx/cockpit_hum.wav",     vol: 0.10, frames: 360 },
  stat_hit:        { file: "sfx/stat_hit.wav",        vol: 0.32, frames: 24 },
  chapter_boom:    { file: "sfx/chapter_boom.wav",    vol: 0.35, frames: 54 },
  stamp_thud:      { file: "sfx/stamp_thud.wav",      vol: 0.32, frames: 9 },
  // sketch-brand kit (CC0 via scripts/fetch_sfx.py — public/sfx/LICENSES.md)
  sketch_scribble: { file: "sfx/sketch_scribble.wav", vol: 0.20, frames: 75 },
  page_turn:       { file: "sfx/page_turn.wav",       vol: 0.25, frames: 21 },
  sketch_pop:      { file: "sfx/sketch_pop.wav",      vol: 0.35, frames: 2 },
  whoosh:          { file: "sfx/whoosh.wav",          vol: 0.22, frames: 21 },
  riser:           { file: "sfx/riser.wav",           vol: 0.28, frames: 75 },
  heartbeat:       { file: "sfx/heartbeat.wav",       vol: 0.30, frames: 25 },
  alarm:           { file: "sfx/alarm.wav",           vol: 0.25, frames: 60 },
  ambience_wind:   { file: "sfx/ambience_wind.wav",   vol: 0.10, frames: 450 },
  ambience_ocean:  { file: "sfx/ambience_ocean.wav",  vol: 0.10, frames: 450 },
  // brand-sting ident motif (owned, ffmpeg-synth via gen_sfx_kit.py)
  sting_motif:     { file: "sfx/sting_motif.wav",     vol: 0.5,  frames: 138 },
};
export const SFX_NAMES = Object.keys(SFX);

/** Renders a scene's SFX cues (auto + explicit) as Audio Sequences. */
const SceneSfx: React.FC<{ cues: SfxCue[]; sceneDur: number }> = ({ cues, sceneDur }) => (
  <>
    {cues.map((c, i) => {
      const def = SFX[c.name];
      if (!def) return null;
      const from = c.at === "out" ? Math.max(0, sceneDur - def.frames - 6)
        : typeof c.at === "number" ? c.at : 0;  // "in"/undefined/unknown -> start
      const dur = c.loop ? Math.max(1, sceneDur - from) : Math.min(def.frames, sceneDur - from);
      if (dur <= 0) return null;
      return (
        <Sequence key={`${c.name}-${i}`} from={from} durationInFrames={dur} name={`sfx:${c.name}`}>
          <Audio src={staticFile(def.file)} volume={c.volume ?? def.vol} loop={c.loop} />
        </Sequence>
      );
    })}
  </>
);

const sceneCues = (s: DocScene, auto: SfxCue[]): SfxCue[] =>
  [...(s.noAutoSfx ? [] : auto), ...(s.sfx ?? [])];

/* Film grain + vignette grade over the whole body (not the outro).
   Static noise tile (SVG turbulence data-URI) jittered per frame. */
const NOISE_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='512' height='512' filter='url(%23n)'/></svg>`
)}")`;
/* Persistent descent device: animated meters counter + tick ruler, left edge.
   Counts down from the previous scene's depth over the scene's first second. */
const DepthGauge: React.FC<{ from: number; to: number; th: Theme }> = ({ from, to, th }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 36], [0, 1], { extrapolateRight: "clamp" });
  const d = Math.round(interpolate(t * t * (3 - 2 * t), [0, 1], [from, to]));
  const settle = spring({ frame: frame - 30, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", left: 54, top: "42%", display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ width: i === 3 ? 26 : 14, height: 3, borderRadius: 2,
            background: i === 3 ? th.accent : "rgba(255,255,255,0.45)" }} />
        ))}
      </div>
      <div style={{ background: "rgba(5,7,12,0.72)", border: `1px solid ${th.accent}55`,
        borderLeft: `5px solid ${th.accent}`, borderRadius: 12, padding: "12px 22px",
        transform: `scale(${1 + 0.06 * (1 - Math.min(1, Math.abs(1 - settle)))})` }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 20,
          letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>DEPTH</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 52,
          color: "#fff", textShadow: `0 0 18px ${th.accent}66` }}>
          {d.toLocaleString("en-US")}<span style={{ fontSize: 30, color: th.accent }}> m</span>
        </div>
      </div>
    </div>
  );
};

const GrainVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const jx = (frame * 97) % 512, jy = (frame * 61) % 512;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: NOISE_URI, backgroundRepeat: "repeat",
        backgroundPosition: `${jx}px ${jy}px`, opacity: 0.05, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.34) 100%)" }} />
    </AbsoluteFill>
  );
};

const sceneAud = (s: DocScene, m: DocManifest) =>
  m.durations[s.id] ?? s.text.split(/\s+/).length / 2.3; // estimate fallback
const sceneFrames = (s: DocScene, m: DocManifest) =>
  LEAD + Math.round(sceneAud(s, m) * FPS) + HOLD + (s.extraHold ?? 0);
export const docTotalFrames = (doc: DocSpec, m: DocManifest, outro?: OutroSpec) =>
  doc.scenes.reduce((a, s) => a + sceneFrames(s, m), 0) + (outro?.frames ?? 0);

const Brand: React.FC<{ th: Theme }> = ({ th }) => (
  <div style={{ position: "absolute", top: 42, right: 54, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
    <div style={{ width: 14, height: 14, borderRadius: "50%", background: th.accent, boxShadow: `0 0 14px ${th.accent}` }} />
    <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: 1 }}>{th.brand}</span>
  </div>
);

/* Evidence-engine radio beat: dark screen, animated waveform, speaker tag,
   transcript line, honesty label (ACTUAL ATC RECORDING vs CVR RECREATION). */
const RadioScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const hasAudio = m.durations[s.id] !== undefined;
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  // deterministic pseudo-waveform: 48 bars driven by frame + bar index
  const bars = Array.from({ length: 48 }, (_, i) => {
    const ph = frame * 0.31 + i * 1.7;
    const env = 0.35 + 0.65 * Math.abs(Math.sin(ph * 0.23) * Math.cos(ph * 0.11 + i));
    return 8 + env * 110;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090D", justifyContent: "center", alignItems: "center" }}>
      {/* honesty label */}
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 26, letterSpacing: 6,
          color: s.radioLabel?.includes("ACTUAL") ? "#7CFC9B" : th.accent,
          border: `2px solid ${s.radioLabel?.includes("ACTUAL") ? "#7CFC9B" : th.accent}`,
          padding: "10px 26px", borderRadius: 8, opacity: 0.92 }}>
          {s.radioLabel ?? "CVR RECREATION"}
        </span>
      </div>
      {/* waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, height: 140, marginTop: -40 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ width: 9, height: h, borderRadius: 4,
            background: i % 7 === 3 ? th.accent : "rgba(255,255,255,0.55)" }} />
        ))}
      </div>
      {/* speaker + timestamp */}
      <div style={{ marginTop: 54, display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 40, color: "#0A0C10",
          background: th.accent, padding: "6px 22px", borderRadius: 10 }}>{s.speaker}</span>
        {s.timestamp && (
          <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 38,
            color: "rgba(255,255,255,0.6)" }}>{s.timestamp}</span>
        )}
      </div>
      {/* transcript line */}
      <div style={{ marginTop: 34, maxWidth: 1420, textAlign: "center",
        transform: `translateY(${interpolate(capIn, [0, 1], [22, 0])}px)`, opacity: capIn }}>
        <span style={{ fontFamily: th.body, fontWeight: 600, fontSize: 52, lineHeight: 1.4, color: "#fff" }}>
          “{s.cap ?? s.text}”
        </span>
      </div>
      <Brand th={th} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      {/* diegetic radio: key-up squelch, static bed under the line, mic-cut at the end */}
      <SceneSfx sceneDur={sceneFrames(s, m)} cues={sceneCues(s, [
        { name: "radio_key_up" },
        { name: "radio_static_bed", loop: true },
        { name: "radio_key_down", at: "out" },
      ])} />
    </AbsoluteFill>
  );
};

/* Dimmed/blurred real-photo backdrop for text-only beats (chapter cards,
   kinetic stat reveals) — NEVER leave these on flat black when a real photo
   exists for the scene; bare black-screen-and-text reads cheap and empty
   (Akshay, 2026-07-25 — "70-80% of the video is black screen"). Falls back to
   BASE (solid dark) only when the scene genuinely has no img prefix. */
const TextSceneBg: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number }> = ({ s, slug, m, idx }) => {
  const frame = useCurrentFrame();
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
  if (!file) return null;
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, 1400], [1.06, 1.18], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* blurred cover backdrop fills the frame regardless of source aspect ratio */}
      <Img src={staticFile(`shorts/${slug}/images/${file}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${drift * 1.15})`,
          filter: "brightness(0.5) saturate(0.85) blur(10px)" }} />
      {/* sharp foreground never crops — portrait sources stay pillarboxed instead of losing content */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img src={staticFile(`shorts/${slug}/images/${file}`)}
          style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain",
            transform: `scale(${drift})`, filter: "brightness(0.62) saturate(0.85)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(4,6,10,0.12) 0%, rgba(4,6,10,0.72) 82%)" }} />
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const hasAudio = m.durations[s.id] !== undefined;
  const sp = spring({ frame, fps: FPS, config: { damping: 16 } });
  const lines = (s.chapter ?? "").split("\n");
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <TextSceneBg s={s} slug={slug} m={m} idx={idx} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}14 0%, transparent 62%)` }} />
      <div style={{ textAlign: "center", transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`, opacity: sp }}>
        <div style={{ fontFamily: th.display, fontWeight: 700, fontSize: 34, color: th.accent, letterSpacing: 6, marginBottom: 16 }}>
          {lines[0]}
        </div>
        <div style={{ fontFamily: th.display, fontWeight: 700, fontSize: 88, color: "#fff", lineHeight: 1.12, maxWidth: 1500,
          textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
          {lines[1]}
        </div>
        <div style={{ width: 120, height: 7, background: th.accent, borderRadius: 5, margin: "30px auto 0" }} />
      </div>
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={sceneFrames(s, m)} cues={sceneCues(s, [{ name: "chapter_boom" }])} />
    </AbsoluteFill>
  );
};

const IllusScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const t = frame / dur;
  const pan = idx % 2 === 0 ? 1 : -1;
  // camera move: explicit s.camera wins; otherwise alternate push/pull by idx
  const move = s.camera ?? (idx % 3 === 2 ? "pull" : "push");
  const ease = t * t * (3 - 2 * t); // smoothstep — decelerating, less linear-slideshow
  // variable time-density: motion "fast" enlarges the move (montage), "slow"
  // shrinks it to a near-static push (the pivotal beats)
  const amp = s.motion === "fast" ? 1.7 : s.motion === "slow" ? 0.4 : 1;
  const scale = move === "pull" ? interpolate(ease, [0, 1], [1.05 + 0.15 * amp, 1.05])
    : move === "drift" ? 1.05 + 0.05 * amp
    : interpolate(ease, [0, 1], [1.05, 1.05 + 0.15 * amp]);
  const driftX = interpolate(ease, [0, 1], [0, pan * (move === "drift" ? 44 : 26) * amp]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null; // idx = per-prefix occurrence (even rotation)
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const hasAudio = m.durations[s.id] !== undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      {file && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          {/* blurred cover backdrop fills the frame regardless of source aspect ratio */}
          <Img src={staticFile(`shorts/${slug}/images/${file}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${scale * 1.15}) translateX(${driftX}px)`,
              filter: "saturate(0.88) contrast(1.05) blur(14px) brightness(0.55)" }} />
          {/* sharp foreground never crops — portrait sources stay pillarboxed instead of losing content */}
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <Img src={staticFile(`shorts/${slug}/images/${file}`)}
              style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain",
                transform: `scale(${scale}) translateX(${driftX}px)`,
                filter: "saturate(0.88) contrast(1.05)" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.62) 0%, transparent 24%, transparent 56%, rgba(5,7,12,0.94) 100%)", pointerEvents: "none" }} />

      {s.stat && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${th.accent}`,
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}

      <Brand th={th} />

      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${th.accent}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, s.stat ? [{ name: "stat_hit", at: statAt }] : [])} />
    </AbsoluteFill>
  );
};

const DiagramScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const hasAudio = m.durations[s.id] !== undefined;
  const Diagram = (s.diagram && DIAGRAMS[s.diagram]) || null;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {Diagram ? <Diagram dur={dur} arg={s.arg} accent={th.accent} /> : <AbsoluteFill style={{ backgroundColor: BASE }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.55) 0%, transparent 22%, transparent 60%, rgba(5,7,12,0.92) 100%)", pointerEvents: "none" }} />

      {s.stat && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${th.accent}`,
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}

      <Brand th={th} />

      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${th.accent}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, s.stat ? [{ name: "stat_hit", at: statAt }] : [])} />
    </AbsoluteFill>
  );
};

/* Real footage scene (NTSB animation etc.): muted video, narration over it. */
const VideoScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const hasAudio = m.durations[s.id] !== undefined;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C", opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn, justifyContent: "center", alignItems: "center" }}>
        <OffthreadVideo src={staticFile(`shorts/${slug}/video/${s.video}`)} muted
          startFrom={Math.round((s.videoFrom ?? 0) * FPS)}
          style={{ width: "100%", height: "100%", objectFit: "contain",
            transform: `scale(${interpolate(frame, [0, dur], [1.0, 1.05])})`,
            filter: "saturate(0.92) contrast(1.06)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.55) 0%, transparent 22%, transparent 60%, rgba(5,7,12,0.92) 100%)", pointerEvents: "none" }} />
      {s.stat && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${th.accent}`, boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}
      <Brand th={th} />
      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34, textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${th.accent}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, s.stat ? [{ name: "stat_hit", at: statAt }] : [])} />
    </AbsoluteFill>
  );
};

/* DELAYED BRAND STING (documentary-pivot): audio-led mindwired ident that plays
   AFTER the cold open — wordmark bloom + expanding accent ring + a musical motif
   (sfx/sting_motif) under the spoken line. One standing beat, every episode. */
const StingScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const hasAudio = m.durations[s.id] !== undefined;
  const bloom = spring({ frame: frame - 6, fps: FPS, config: { damping: 14, stiffness: 90 } });
  const ringT = interpolate(frame, [6, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(frame, [6, 30, dur - 20, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const under = interpolate(frame, [22, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060A", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ position: "absolute", width: 40 + ringT * 940, height: 40 + ringT * 940, borderRadius: "50%",
        border: `2px solid ${th.accent}`, opacity: (1 - ringT) * 0.5 }} />
      <div style={{ position: "absolute", width: 640, height: 640, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}22 0%, transparent 62%)`, opacity: glow }} />
      <div style={{ textAlign: "center", transform: `scale(${interpolate(bloom, [0, 1], [0.86, 1])})`, opacity: bloom }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: th.accent,
            boxShadow: `0 0 ${18 + glow * 28}px ${th.accent}` }} />
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 132, color: "#fff", letterSpacing: 1,
            textShadow: `0 0 ${glow * 44}px ${th.accent}77` }}>{th.brand}</span>
        </div>
        <div style={{ height: 5, background: th.accent, borderRadius: 4, margin: "28px auto 0",
          width: under * 440, boxShadow: `0 0 16px ${th.accent}` }} />
      </div>
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, [{ name: "sting_motif", at: 0 }])} />
    </AbsoluteFill>
  );
};

/* EXHIBIT beat (the Jani "receipts" move): the scene's img is a real document
   page — dark blurred surround, slow push (toward the highlight = the damning
   line), an accent highlight box, and a source lower-third. */
const ExhibitScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const t = interpolate(frame, [0, dur], [0, 1]);
  const ease = t * t * (3 - 2 * t);
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  const hasAudio = m.durations[s.id] !== undefined;
  const hl = s.highlight && s.highlight.length === 4 ? s.highlight : null;
  const targetX = hl ? hl[0] + hl[2] / 2 : 0.5;
  const targetY = hl ? hl[1] + hl[3] / 2 : 0.5;
  const zoom = interpolate(ease, [0, 1], [1.0, hl ? 1.5 : 1.12]);
  const shiftX = interpolate(ease, [0, 1], [0, (0.5 - targetX) * 820]);
  const shiftY = interpolate(ease, [0, 1], [0, (0.5 - targetY) * 560]);
  const boxIn = spring({ frame: frame - LEAD - 6, fps: FPS, config: { damping: 16 } });
  const srcIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const capIn = spring({ frame: frame - LEAD - 12, fps: FPS, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#030407", opacity: fadeOut }}>
      {file && (
        <AbsoluteFill style={{ opacity: fadeIn * 0.5 }}>
          <Img src={staticFile(`shorts/${slug}/images/${file}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              filter: "blur(34px) brightness(0.35) saturate(0.7)", transform: "scale(1.25)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "rgba(3,4,7,0.55)" }} />
      {file && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIn }}>
          <div style={{ position: "relative", height: "78%",
            transform: `translate(${shiftX}px, ${shiftY}px) scale(${zoom})` }}>
            <Img src={staticFile(`shorts/${slug}/images/${file}`)}
              style={{ height: "100%", width: "auto", objectFit: "contain", display: "block",
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.12)",
                filter: "contrast(1.05) brightness(1.03)" }} />
            {hl && (
              <div style={{ position: "absolute", left: `${hl[0] * 100}%`, top: `${hl[1] * 100}%`,
                width: `${hl[2] * 100}%`, height: `${hl[3] * 100}%`,
                background: `${th.accent}22`, border: `3px solid ${th.accent}`,
                boxShadow: `0 0 24px ${th.accent}88`, borderRadius: 4,
                opacity: boxIn, transform: `scaleX(${boxIn})`, transformOrigin: "left" }} />
            )}
          </div>
        </AbsoluteFill>
      )}
      {s.source && (
        <div style={{ position: "absolute", bottom: 96, left: 96, maxWidth: 960, opacity: srcIn,
          transform: `translateY(${interpolate(srcIn, [0, 1], [18, 0])}px)` }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 22,
            letterSpacing: 4, color: th.accent, marginBottom: 6 }}>EXHIBIT</div>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 34, color: "#fff", lineHeight: 1.3,
            background: "rgba(3,4,7,0.8)", padding: "10px 22px", borderLeft: `5px solid ${th.accent}`,
            borderRadius: 8 }}>{s.source}</div>
        </div>
      )}
      {s.cap && (
        // stacked ABOVE the source lower-third (not beside it) — a long citation +
        // a long caption on the same baseline used to run into each other (both
        // were bottom-anchored within ~10px of each other, only separated by
        // maxWidth math that broke as soon as either string got long)
        <div style={{ position: "absolute", bottom: s.source ? 210 : 104, right: 96, maxWidth: 720,
          textAlign: "right", opacity: capIn,
          transform: `translateY(${interpolate(capIn, [0, 1], [20, 0])}px)` }}>
          <span style={{ fontFamily: th.body, fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1.3,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>{s.cap}</span>
        </div>
      )}
      <Brand th={th} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, [{ name: "page_turn", at: 0, volume: 0.2 }])} />
    </AbsoluteFill>
  );
};

/* KINETIC typography beat (the "second narrator"): a number counting
   up (optionally struck through to a second, real number) and/or words
   materializing one-by-one — silence-synced to the narration. Sits over a
   dimmed real photo when the scene has one (TextSceneBg); solid dark only
   as a genuine fallback. */
const KineticScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const aud = sceneAud(s, m) * FPS;
  const k = s.kinetic ?? {};
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  const hasAudio = m.durations[s.id] !== undefined;
  const countProg = interpolate(frame - LEAD, [0, aud * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = countProg * countProg * (3 - 2 * countProg);
  const shown = k.count !== undefined ? Math.round(eased * k.count) : null;
  const strikeAt = LEAD + aud * 0.68;
  const strikeT = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const revealSp = spring({ frame: frame - strikeAt - 6, fps: FPS, config: { damping: 13, stiffness: 120 } });
  const fmt = (n: number) => n.toLocaleString("en-US");
  const words = k.words ?? [];
  const perWord = words.length ? (aud * 0.78) / words.length : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060A", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <TextSceneBg s={s} slug={slug} m={m} idx={idx} />
      <div style={{ position: "absolute", width: 780, height: 780, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}0F 0%, transparent 60%)` }} />
      {shown !== null && (
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 200, color: "#fff", letterSpacing: 1,
              lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.75)",
              opacity: k.strike !== undefined ? interpolate(strikeT, [0, 1], [1, 0.45]) : 1 }}>
              {k.prefix ?? ""}{fmt(shown)}{k.suffix ?? ""}
            </span>
            {k.strike !== undefined && (
              <div style={{ position: "absolute", top: "52%", left: -12, right: -12, height: 10,
                background: "#FF4D4D", borderRadius: 6, transform: `scaleX(${strikeT})`, transformOrigin: "left",
                boxShadow: "0 0 18px #FF4D4Daa" }} />
            )}
          </div>
          {k.countLabel && (
            <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 52, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              {k.countLabel}
            </div>
          )}
          {k.strike !== undefined && (
            <div style={{ marginTop: 26, opacity: revealSp, transform: `scale(${interpolate(revealSp, [0, 1], [0.8, 1])})` }}>
              <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 150, color: th.accent,
                textShadow: `0 0 40px ${th.accent}66` }}>{k.prefix ?? ""}{fmt(k.strike)}{k.suffix ?? ""}</span>
              {k.strikeLabel && (
                <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", marginTop: 4 }}>{k.strikeLabel}</div>
              )}
            </div>
          )}
        </div>
      )}
      {words.length > 0 && (
        <div style={{ maxWidth: 1500, textAlign: "center", padding: "0 80px" }}>
          {words.map((w, i) => {
            const wIn = spring({ frame: frame - LEAD - i * perWord, fps: FPS, config: { damping: 16 } });
            return (
              <span key={i} style={{ display: "inline-block", margin: "0 14px",
                fontFamily: th.display, fontWeight: 700, fontSize: 92, lineHeight: 1.3,
                color: i === words.length - 1 ? th.accent : "#fff", textShadow: "0 3px 24px rgba(0,0,0,0.75)",
                opacity: wIn, transform: `translateY(${interpolate(wIn, [0, 1], [26, 0])}px)` }}>{w}</span>
            );
          })}
        </div>
      )}
      {k.sub && (
        <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ fontFamily: th.body, fontWeight: 500, fontSize: 40, color: "rgba(255,255,255,0.6)" }}>{k.sub}</span>
        </div>
      )}
      <Brand th={th} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, k.strike !== undefined ? [{ name: "stat_hit", at: Math.round(strikeAt) }] : [])} />
    </AbsoluteFill>
  );
};

export const makeDocComp = (doc: DocSpec, manifest: DocManifest, outro?: OutroSpec): React.FC => {
  const th = THEMES[doc.channel ?? "mindwired"] ?? THEMES.mindwired;
  // Per-prefix rotation: the k-th scene using a prefix shows that prefix's k-th
  // file (mod pool size) — spreads small pools evenly instead of hashing on the
  // global scene index (which repeated files back-to-back).
  const rotation: Record<string, number> = {};
  const sceneFileIdx: Record<string, number> = {};
  for (const s of doc.scenes) {
    if (!s.img) continue;
    sceneFileIdx[s.id] = rotation[s.img] ?? 0;
    rotation[s.img] = (rotation[s.img] ?? 0) + 1;
  }
  // depth-gauge carry-forward: each scene knows the previous scene's depth
  const depthPrev: Record<string, number> = {};
  let lastDepth: number | undefined;
  for (const s of doc.scenes) {
    if (s.depth !== undefined) { depthPrev[s.id] = lastDepth ?? 0; lastDepth = s.depth; }
  }
  const Comp: React.FC = () => {
    let cursor = 0;
    return (
      <AbsoluteFill style={{ backgroundColor: BASE }}>
        {/* Embedded Devanagari @font-face — root-level so ALL scene types get it
            (loadFont tofu'd on the GCE headless render). See devanagariFont.ts. */}
        <style>{DEVANAGARI_FONT_CSS}</style>
        {doc.scenes.map((s, i) => {
          const from = cursor; const dur = sceneFrames(s, manifest); cursor += dur;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              {s.chapter
                ? <ChapterCard s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th} />
                : s.sting
                ? <StingScene s={s} slug={doc.slug} m={manifest} th={th} />
                : s.speaker
                ? <RadioScene s={s} slug={doc.slug} m={manifest} th={th} />
                : s.video
                ? <VideoScene s={s} slug={doc.slug} m={manifest} th={th} />
                : s.mascotFull
                ? <MascotZoom
                    sceneDur={dur} mouthOffset={LEAD} cap={s.cap} accent={th.accent}
                    rig={s.rig} mouth={s.speak ? manifest.mouth?.[s.id] : undefined} />
                : (s.sketch || s.mascotAside)
                ? <SketchScene
                    file={(() => {
                      const fs = (s.img && manifest.images[s.img]) || [];
                      return fs.length ? fs[(sceneFileIdx[s.id] ?? i) % fs.length] : null;
                    })()}
                    slug={doc.slug} cap={s.mascotAside ? undefined : s.cap} stat={s.stat} note={s.note}
                    accent={th.accent} sceneDur={dur} circle={s.circle} />
                : s.exhibit
                ? <ExhibitScene s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th} />
                : s.dossier
                ? <DossierScene
                    file={(() => {
                      const fs = (s.img && manifest.images[s.img]) || [];
                      return fs.length ? fs[(sceneFileIdx[s.id] ?? i) % fs.length] : null;
                    })()}
                    slug={doc.slug} cap={s.cap} label={s.label}
                    accent={th.accent} sceneDur={dur} camera={s.camera} />
                : s.kinetic
                ? <KineticScene s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th} />
                : s.diagram
                ? <DiagramScene s={s} slug={doc.slug} m={manifest} th={th} />
                : <IllusScene s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th} />}
              {(s.react || s.speak) && !s.mascotFull && !s.mascotAside && (
                <MascotReact
                  pose={s.react ?? `${s.rig ?? "host"}_m0`} sceneDur={dur} mouthOffset={LEAD}
                  rig={s.rig} mouth={s.speak ? manifest.mouth?.[s.id] : undefined} />
              )}
              {s.mascotAside && (
                <MascotReact aside
                  pose={s.react ?? `${s.rig ?? "host"}_m0`} sceneDur={dur} mouthOffset={LEAD}
                  rig={s.rig} mouth={s.speak ? manifest.mouth?.[s.id] : undefined} />
              )}
              {s.mascotFull && (
                <>
                  {manifest.durations[s.id] !== undefined && (
                    <Sequence from={LEAD}>
                      <Audio src={staticFile(`shorts/${doc.slug}/audio/${s.id}.mp3`)} />
                    </Sequence>
                  )}
                  <SceneSfx sceneDur={dur} cues={sceneCues(s, [
                    { name: "page_turn", at: 0, volume: 0.22 },
                    { name: "sketch_pop", at: 4 },
                  ])} />
                </>
              )}
              {(s.sketch || s.mascotAside) && (
                <>
                  {/* narration — scene components normally emit this; the
                      sketch branch bypasses them (shipped silent once, 2026-07-20) */}
                  {manifest.durations[s.id] !== undefined && (
                    <Sequence from={LEAD}>
                      <Audio src={staticFile(`shorts/${doc.slug}/audio/${s.id}.mp3`)} />
                    </Sequence>
                  )}
                  {/* sketch auto-cues: marker scribble under the draw-on, a pop
                      as the mascot lands, a page turn when the previous scene
                      was also a sketch, stat hit as usual (noAutoSfx silences) */}
                  <SceneSfx sceneDur={dur} cues={sceneCues(s, [
                    { name: "sketch_scribble", at: 2 },
                    ...(doc.scenes[i - 1]?.sketch
                      ? [{ name: "page_turn", at: 0, volume: 0.18 } as SfxCue] : []),
                    ...((s.react || s.speak) ? [{ name: "sketch_pop", at: 6 } as SfxCue] : []),
                    ...(s.stat ? [{ name: "stat_hit", at: 24 } as SfxCue] : []),
                  ])} />
                </>
              )}
              {s.dossier && (
                <>
                  <Brand th={th} />
                  {manifest.durations[s.id] !== undefined && (
                    <Sequence from={LEAD}>
                      <Audio src={staticFile(`shorts/${doc.slug}/audio/${s.id}.mp3`)} />
                    </Sequence>
                  )}
                  <SceneSfx sceneDur={dur} cues={sceneCues(s, [
                    { name: "page_turn", at: 0, volume: 0.2 },
                    ...(s.label ? [{ name: "stamp_thud", at: 26 } as SfxCue] : []),
                  ])} />
                </>
              )}
              {s.depth !== undefined && <DepthGauge from={depthPrev[s.id]} to={s.depth} th={th} />}
            </Sequence>
          );
        })}
        <Sequence from={0} durationInFrames={docTotalFrames(doc, manifest)} name="grain-grade">
          <GrainVignette />
        </Sequence>
        {outro && (
          <Sequence from={docTotalFrames(doc, manifest)} durationInFrames={outro.frames} name="subscribe-outro">
            <AbsoluteFill style={{ backgroundColor: "#000" }}>
              <OffthreadVideo src={staticFile(outro.file)} />
            </AbsoluteFill>
          </Sequence>
        )}
      </AbsoluteFill>
    );
  };
  return Comp;
};
