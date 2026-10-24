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
import { type ArchivalGrade, BLACKBOX_GRADE, LEGACY_GRADE } from "../lib/theme";
import { DIAGRAMS } from "./Diagrams";
import { DossierScene, MascotReact, MascotZoom, SketchScene } from "./Sketch";
import { CaseTimeline, GenealogyTree, RouteMap } from "../criminalrecord/RecordScenes";

const FPS = 30;
const BASE = "#05070C";

type Theme = { display: string; body: string; serif: string; mono: string;
  accent: string; brand: string;
  /** CSS font-stretch applied to display-register type (Archivo variable
   *  wdth axis — the expanded cut is the broadcast-documentary look). */
  stretch: string;
  /** brightness multiplier for the dimmed image behind chapter/kinetic text.
   *  Tuned for photos by default; document-first channels need it far lower or
   *  a white page drowns the type. */
  textBg?: { fg: number; bg: number; blur: number };
  /** archival plate treatment (src/lib/theme.ts) — LEGACY_GRADE reproduces
   *  the pre-2027 filters exactly; blackbox defaults to BLACKBOX_GRADE. */
  grade: ArchivalGrade;
  /** channel wordmark lockup used by Brand/StingScene when the doc opts in
   *  (doc.visual "2027" or doc.caseId) */
  lockup?: "blackbox" };
// 2026-08-22 craft overhaul (docs/planning/CRAFT-AUDIT.md): four-voice type
// system replaces the flat Space-Grotesk-for-everything register — Archivo
// (expanded) for display, Spectral for editorial/quotes, IBM Plex Mono for
// evidence chrome, Inter unchanged for captions/body. Space Grotesk stays
// as fallback so older manifests re-render without layout collapse.
const DOC_DISPLAY = "'Archivo', 'Space Grotesk', sans-serif";
const DOC_SERIF = "'Spectral', Georgia, serif";
const DOC_MONO = "'IBM Plex Mono', 'SF Mono', Menlo, monospace";
const THEMES: Record<string, Theme> = {
  mindwired: {
    display: DOC_DISPLAY, body: "'Inter', sans-serif",
    serif: DOC_SERIF, mono: DOC_MONO, stretch: "118%",
    accent: "#4DD8FF", brand: "mindwired", grade: LEGACY_GRADE,
  },
  dimaagbatti: {
    display: "'Noto Sans Devanagari', 'Archivo', 'Space Grotesk', sans-serif",
    body: "'Noto Sans Devanagari', 'Inter', sans-serif",
    serif: "'Noto Sans Devanagari', 'Spectral', serif", mono: DOC_MONO,
    stretch: "100%", // Devanagari has no wdth axis — keep normal width
    accent: "#FFC53D", brand: "दिमाग़बत्ती", grade: LEGACY_GRADE,
  },
  blackbox: {
    display: DOC_DISPLAY, body: "'Inter', sans-serif",
    serif: DOC_SERIF, mono: DOC_MONO, stretch: "118%",
    accent: "#FF9500", brand: "Black Box",
    // the one default-on piece of the 2027 visual system (revamp §3.3):
    // every blackbox plate gets the archival grade, old docs included
    grade: BLACKBOX_GRADE, lockup: "blackbox",
  },
  // Criminal Record (@WatchCriminalRecord) — cold blue-white so it reads as
  // Black Box's sibling, not a clone. See docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md
  criminalrecord: {
    display: DOC_DISPLAY, body: "'Inter', sans-serif",
    serif: DOC_SERIF, mono: DOC_MONO, stretch: "112%",
    accent: "#7FB4FF", brand: "Criminal Record", grade: LEGACY_GRADE,
    // court filings are black-on-WHITE; at photo dimming the page text fights
    // the title and the accent eyebrow becomes unreadable.
    textBg: { fg: 0.20, bg: 0.16, blur: 16 },
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
  /** HyperFrames data scene (map/timeline/chart/diagram from hyperframes/data/<slug>/<hf>.json,
   *  rendered by scripts/build_hf_scenes.py to video/hf_<hf>.mp4). NOT real footage: the clip
   *  owns the whole frame — no drift/grade/scrim/blur-fill, no Brand/StatChip/CaptionBar
   *  (preflight BLOCKS stat/cap/chapter/img/video alongside it). */
  hf?: string;
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
  /** Opaque redaction bars drawn over the exhibit page, [[x,y,w,h],…] in the same
   *  0-1 page fractions as `highlight`. For real filings that carry passages this
   *  channel does not put on screen (injury detail, identifying data) sitting too
   *  close to the cited line to exclude by framing. Visibly a redaction — the
   *  standard document-journalism move — never a silent crop. */
  redact?: number[][];
  /** DOSSIER beat (docs/guides/DOSSIER-SCENES.md): the illustrated sibling of
   *  `exhibit` for beats with ZERO real photo/footage coverage (an unfilmable
   *  moment, an abstraction) — hand-cut paper-collage "case file" look, always
   *  tagged RECONSTRUCTION. `img` is the Gemini-generated cutout prefix
   *  (scripts/gen_doc_dossier.py); `label` is a short 1-4 word date/name
   *  stamp. Never use for a real person/event that has archival coverage. */
  dossier?: boolean;
  label?: string;
  /** KINETIC typography beat (the "second narrator"): a figure revealed at its
   *  real value (NO roll-up counter — see memory `no-count-up-number-animation`;
   *  optional strike to a second number), and/or words
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
  /* ---------- Criminal Record evidence-animation layer (2026-08-03) ----------
   *  Code-generated motion for a channel with no footage pool. These visualise
   *  EVIDENCE AND CHRONOLOGY only — never a reconstruction of a crime. See
   *  docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md and src/criminalrecord/RecordScenes.tsx. */
  /** Documented chronology: marks stamped along a filling band. Times are
   *  strings copied from the record, never computed. */
  timeline?: { title?: string; marks: { at: string; label: string; emphasis?: boolean }[] };
  /** Schematic route (NOT a photoreal map) between labelled points; x/y are
   *  0-1 frame fractions authored in the spec. */
  route?: { title?: string; points: { x: number; y: number; label: string; at?: string }[] };
  /** Investigative-genealogy tree, one string[] per generation row. */
  tree?: { title?: string; rows: string[][] };
  /** Variable time-density: Ken Burns intensity on photo scenes.
   *  "fast" = a bigger, quicker move (montage); "slow" = near-static (pivots). */
  motion?: "fast" | "slow";
  /** Extra hold frames appended to the scene — a controllable beat of dead air
   *  (e.g. before a reveal). Mirrored in scripts/lib/doctiming.py. */
  extraHold?: number;
  tone?: string;            // Cartesia emotion (VO-only; ignored by the renderer)
  speed?: number;           // per-scene VO speed (VO-only; ignored by the renderer)
  /* ---------- 2027 visual system (BLACKBOX-2027-REVAMP §3.3 / Phase 2 #5) ----------
   *  Every field below is OPT-IN: a doc that sets none of them (and no doc-level
   *  `visual`/`caseId`/`sourceLine`) renders exactly as before, except the
   *  blackbox archival grade, which is the channel default. */
  /** SceneChrome layout on photo/footage/diagram scenes. Default: `slate` when
   *  `slate` is set, `quote` when `quoteBy` is set, else `caption` (the classic
   *  lower-third). `lower-third`/`quoteBy` are accepted aliases. Mirrored by
   *  preflight_doc.py chrome_layout() for the layout-concentration WARN. */
  // plain string, not a literal union: JSON imports widen literals and the
  // union would fail every doc that sets it (the `motion` errors in Root.tsx)
  layout?: string; // "caption" | "lower-third" | "slate" | "quote" | "quoteBy" | "none"
  /** big dated place/time plate (Fern cold open: date, place, one action).
   *  `clock` advances in REAL TIME from a verbatim CLAIMS time — never counts
   *  toward a figure (memory no-count-up-number-animation). */
  slate?: { date: string; place?: string; clock?: string };
  /** attribution line under a `quote` layout (cap = the verbatim quote) or
   *  under a radio transcript ("Rodney Rocha · unsent email, CAIB p.157") */
  quoteBy?: string;
  /** small mono citation line, bottom-left. true = from `source`, else the
   *  shown file's provenance record (manifest.assets/videos); a string = that
   *  text; false = hide. Defaults to doc.sourceLine (or on under visual "2027"). */
  sourceLine?: boolean | string;
  /** ArchivalPlate framing: blurfill (default) | fill (cover crop) | pillar */
  plate?: string; // "blurfill" | "fill" | "pillar"
  /** generated graphic shown through the photo path (report figure render,
   *  chart PNG): bypasses the archival grade/grain/stamp like hf does */
  graphic?: boolean;
  /** date-stamp chrome on the plate ("JAN 28 1986") — channels whose grade
   *  allows it (blackbox). Must be the real date of the footage/photo. */
  stamp?: string;
  /** ChapterCard tease-first: `kicker` = short mono label, `tease` = the
   *  curiosity line that lands BEFORE the title. */
  kicker?: string; tease?: string;
  /** exhibit page tint: warm (aged paper) | cool (photocopy) | neutral (mono) */
  paperTone?: string; // "warm" | "cool" | "neutral"
  /** exhibit choreography: push (default — page floats, push to highlight) |
   *  document (page COVERS the frame with a slow drift down to the highlight;
   *  the criminalrecord TextSceneBg paper move, generalised) */
  exhibitMode?: string; // "push" | "document"
};
export type DocSpec = { slug: string; title: string; channel?: string; scenes: DocScene[];
  /** "2027" switches the doc onto the full 2027 visual system: blackbox lockup
   *  (hidden in the first-30s hook), SourceLine on, ChapterCard progress ticks +
   *  next-scene video plate, RadioScene level track + plate + CVR strip. */
  visual?: string;
  /** case number in the blackbox lockup + sting ("NTSB DCA02MA001") */
  caseId?: string;
  /** doc-wide SourceLine default (scene `sourceLine` overrides) */
  sourceLine?: boolean };
/** provenance record subset (scripts/lib/provenance.py) used by SourceLine */
type AssetRecord = { source?: string | null; title?: string | null; author?: string | null;
  license?: string | null };
export type DocManifest = {
  durations: Record<string, number>;
  images: Record<string, string[]>;
  /** per-scene mouth-flap tracks ("0"-"3" per frame) for speak:true scenes */
  mouth?: Record<string, string>;
  /** per-scene VO level track, one digit per frame (RadioScene level bars;
   *  falls back to `mouth`, then to a flat idle line — never a fake wave) */
  level?: Record<string, string>;
  /** provenance snapshots keyed by file name (build_doc_vo.py) */
  assets?: Record<string, AssetRecord>;
  videos?: Record<string, AssetRecord>;
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
        <div style={{ fontFamily: th.mono, fontWeight: 700, fontSize: 20,
          letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>DEPTH</div>
        <div style={{ ...dsp(th, 750), fontSize: 52, fontVariantNumeric: "tabular-nums",
          color: "#fff", textShadow: `0 0 18px ${th.accent}66` }}>
          {d.toLocaleString("en-US")}<span style={{ fontSize: 30, color: th.accent }}> m</span>
        </div>
      </div>
    </div>
  );
};

const GrainVignette: React.FC<{ skip?: [number, number][] }> = ({ skip = [] }) => {
  const frame = useCurrentFrame();
  // hf scenes own their whole frame (revamp §3.1) — no grain/vignette over the kit
  if (skip.some(([a, b]) => frame >= a && frame < b)) return null;
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

/** Display-register style: the statically-instanced Archivo Expanded cuts
 *  (800 hero / 600 secondary — anything ≥700 maps to the 800 cut). Static
 *  instances sidestep browser variable-axis clamping entirely. Devanagari
 *  channels (stretch "100%") keep their own display stack unexpanded. */
const dsp = (th: Theme, wght: number): React.CSSProperties =>
  th.stretch === "100%"
    ? { fontFamily: th.display, fontWeight: wght >= 700 ? 800 : 600 }
    : { fontFamily: `'Archivo Expanded', ${th.display}`, fontWeight: wght >= 700 ? 800 : 600 };

/* ── 2027 visual system context (BLACKBOX-2027-REVAMP §3.3). makeDocComp
      provides one per scene so chrome deep in a scene component knows the
      doc-level opt-ins without threading props through every scene type. ── */
type ChromeCtxT = {
  /** doc.visual === "2027" */
  v2: boolean;
  /** draw the channel lockup instead of the legacy dot+wordmark chip */
  lockup: boolean;
  caseId?: string;
  /** scene starts inside the first-30s hook */
  hook: boolean;
  /** 1-based chapter number of this scene (0 = not a chapter) / total */
  chapterNo: number; chapterTotal: number;
  /** doc-wide SourceLine default */
  sourceLine: boolean;
};
const ChromeCtx = React.createContext<ChromeCtxT>({
  v2: false, lockup: false, hook: false, chapterNo: 0, chapterTotal: 0, sourceLine: false,
});
const HOOK_FRAMES = 30 * FPS;

/** Flight-recorder glyph: the international-orange box with its two
 *  reflective bands — Black Box's mark in the lockup and the sting. */
const RecorderGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <div style={{ position: "relative", width: size, height: size * 0.74, flex: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: color, borderRadius: size * 0.12,
      boxShadow: `0 0 ${size * 0.5}px ${color}66` }} />
    {[0.3, 0.58].map((y) => (
      <div key={y} style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`,
        height: size * 0.09, background: "rgba(255,255,255,0.88)" }} />
    ))}
    <div style={{ position: "absolute", right: -size * 0.12, top: "34%", width: size * 0.12,
      height: "32%", background: color, borderRadius: `0 ${size * 0.04}px ${size * 0.04}px 0`, opacity: 0.85 }} />
  </div>
);

const BlackBoxLockup: React.FC<{ th: Theme; caseId?: string }> = ({ th, caseId }) => (
  <div style={{ position: "absolute", top: 40, right: 54, display: "flex", alignItems: "center", gap: 14,
    background: "rgba(4,6,10,0.55)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
    padding: "9px 18px 9px 14px", opacity: 0.88 }}>
    <RecorderGlyph size={30} color={th.accent} />
    <span style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 23, letterSpacing: 6, color: "#fff" }}>
      BLACK BOX
    </span>
    {caseId && (
      <>
        <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.28)" }} />
        <span style={{ fontFamily: th.mono, fontWeight: 500, fontSize: 18, letterSpacing: 2, color: th.accent }}>
          {caseId}
        </span>
      </>
    )}
  </div>
);

const Brand: React.FC<{ th: Theme }> = ({ th }) => {
  const cx = React.useContext(ChromeCtx);
  // 2027 docs keep the first-30s hook brand-free (revamp §3.3 "hidden during the hook")
  if (cx.v2 && cx.hook) return null;
  if (cx.lockup && th.lockup === "blackbox") return <BlackBoxLockup th={th} caseId={cx.caseId} />;
  return (
    <div style={{ position: "absolute", top: 42, right: 54, display: "flex", alignItems: "center", gap: 10, opacity: 0.78 }}>
      <div style={{ width: 13, height: 13, borderRadius: "50%", background: th.accent, boxShadow: `0 0 14px ${th.accent}` }} />
      <span style={{ ...dsp(th, 700), fontSize: 26, color: "#fff", letterSpacing: 2 }}>{th.brand}</span>
    </div>
  );
};

/* ── ArchivalPlate: the ONE renderer for real photos/footage. Applies the
      channel grade token once (Theme.grade), the blur-fill/fill/pillar
      framing, the LUT-ish split tone, plate grain and the optional date
      stamp. hf scenes never reach it; `graphic` scenes get the framing with
      no grade/tone/grain/stamp. With `dim` it is the chapter/kinetic text
      backdrop (TextSceneBg). ── */
type PlateFrame = "blurfill" | "fill" | "pillar";
const ArchivalPlate: React.FC<{
  src: string; kind: "image" | "video"; th: Theme;
  /** PlateFrame; any other string (or unset) = blurfill */
  frame?: string; scale?: number; x?: number; startFrom?: number;
  dim?: { fg: number; bg: number; blur: number };
  graphic?: boolean; stamp?: string; stampBottom?: number;
}> = ({ src, kind, th, frame: frRaw, scale = 1, x = 0, startFrom = 0, dim, graphic, stamp, stampBottom = 64 }) => {
  const f = useCurrentFrame();
  const fr: PlateFrame = frRaw === "fill" || frRaw === "pillar" ? frRaw : "blurfill";
  const g = th.grade;
  const gText = graphic ? "" : ` ${g.text}`;
  const fg = dim ? `brightness(${dim.fg})${gText}` : graphic ? "none" : kind === "video" ? g.video : g.photo;
  const bg = dim ? `brightness(${dim.bg})${gText} blur(${dim.blur}px)`
    : `${graphic ? "" : `${g.back} `}blur(14px) brightness(0.55)`;
  const media = (style: React.CSSProperties) => kind === "video"
    ? <OffthreadVideo src={src} muted startFrom={startFrom} style={style} />
    : <Img src={src} style={style} />;
  const tx = x ? ` translateX(${x}px)` : "";
  const cover = media({ width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${fr === "fill" ? scale : scale * 1.15})${tx}`, filter: fr === "fill" ? fg : bg });
  const contain = kind === "video"
    ? media({ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${scale})${tx}`, filter: fg })
    : media({ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain",
        transform: `scale(${scale})${tx}`, filter: fg });
  const tone = !graphic && g.tone;
  const jx = (f * 53) % 512, jy = (f * 89) % 512;
  return (
    <AbsoluteFill>
      {fr !== "pillar" && <AbsoluteFill>{cover}</AbsoluteFill>}
      {fr !== "fill" && <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{contain}</AbsoluteFill>}
      {tone && (
        <>
          <AbsoluteFill style={{ background: tone.lift, mixBlendMode: "lighten", pointerEvents: "none" }} />
          <AbsoluteFill style={{ background: tone.warm, mixBlendMode: "soft-light", opacity: tone.warmOpacity,
            pointerEvents: "none" }} />
        </>
      )}
      {!graphic && g.grain > 0 && (
        <AbsoluteFill style={{ backgroundImage: NOISE_URI, backgroundRepeat: "repeat",
          backgroundPosition: `${jx}px ${jy}px`, opacity: g.grain, mixBlendMode: "overlay", pointerEvents: "none" }} />
      )}
      {!graphic && g.stamp && stamp && (
        <div style={{ position: "absolute", right: 64, bottom: stampBottom, fontFamily: th.mono, fontWeight: 600,
          fontSize: 30, letterSpacing: 3, color: "#FFB347", opacity: 0.86,
          textShadow: "0 0 8px rgba(255,140,40,0.75), 0 0 2px rgba(255,120,30,0.9)" }}>{stamp}</div>
      )}
    </AbsoluteFill>
  );
};

/* ── SceneChrome: the lower-third / slate / quote / stat / source system for
      photo, footage and diagram scenes. Layout is chosen per scene (see
      chromeLayout); gradients only darken where text actually sits. The
      `caption` layout is byte-for-byte the pre-2027 chrome. ── */
type ChromeLayout = "caption" | "slate" | "quote" | "none";
const LAYOUTS: Record<string, ChromeLayout> = {
  caption: "caption", "lower-third": "caption", slate: "slate", quote: "quote", quoteBy: "quote", none: "none",
};
export const chromeLayout = (s: DocScene): ChromeLayout => {
  const l = s.layout ? LAYOUTS[s.layout] : undefined; // unknown value -> auto
  if (l) return l;
  if (s.slate) return "slate";
  if (s.quoteBy) return "quote";
  return "caption";
};

/** Real-time clock from a verbatim start time ("08:59:32 EST", "9:14 PM").
 *  Only a time WITH seconds advances (a minutes-only time stays put); the
 *  suffix (zone / AM-PM) is preserved. Never counts toward a figure. */
const advanceClock = (t: string, frames: number): string => {
  const m = t.match(/^(\s*)(\d{1,2}):(\d{2}):(\d{2})(.*)$/);
  if (!m || frames <= 0) return t;
  let sec = (+m[2]) * 3600 + (+m[3]) * 60 + (+m[4]) + Math.floor(frames / FPS);
  const h = Math.floor(sec / 3600) % 24; sec %= 3600;
  const hh = m[2].length === 2 ? String(h).padStart(2, "0") : String(h);
  return `${m[1]}${hh}:${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}${m[5]}`;
};

/** Citation text for the SourceLine, or null when the scene shows none. */
const sourceText = (s: DocScene, m: DocManifest, cx: ChromeCtxT, file: string | null, kind: "image" | "video" | "diagram"): string | null => {
  const on = s.sourceLine ?? (cx.sourceLine || cx.v2);
  if (on === false || s.hf) return null;
  if (typeof on === "string") return on;
  if (s.source) return s.source;
  if (!file || kind === "diagram") return null;
  const r = (kind === "video" ? m.videos : m.assets)?.[file];
  if (!r) return null;
  const real = (v?: string | null) => (v && !/^(unknown|n\/?a|none)$/i.test(v.trim()) ? v.trim() : "");
  const who = real(r.author) || real(r.source);
  const lic = (r.license || "").trim();
  return [who, lic].filter(Boolean).join(" · ") || null;
};

/** Small mono citation, bottom-left, under any lower-third. */
const SourceLine: React.FC<{ th: Theme; text: string }> = ({ th, text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [LEAD, LEAD + 10], [0, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 96, bottom: 34, maxWidth: 1300, opacity: o,
      fontFamily: th.mono, fontWeight: 500, fontSize: 18, letterSpacing: 1.5, color: "#fff",
      textShadow: "0 2px 10px rgba(0,0,0,0.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      <span style={{ color: th.accent, marginRight: 12 }}>SOURCE</span>{text}
    </div>
  );
};

const Slate: React.FC<{ th: Theme; slate: NonNullable<DocScene["slate"]>; cap?: string }> = ({ th, slate, cap }) => {
  const f = useCurrentFrame();
  const placeIn = spring({ frame: f - 2, fps: FPS, config: { damping: 18 } });
  const dateIn = spring({ frame: f - LEAD, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const clockIn = interpolate(f, [LEAD + 10, LEAD + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const capIn = spring({ frame: f - LEAD - 16, fps: FPS, config: { damping: 18 } });
  return (
    <div style={{ position: "absolute", left: 96, bottom: 88, maxWidth: 1400 }}>
      {slate.place && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: placeIn,
          transform: `translateX(${interpolate(placeIn, [0, 1], [-24, 0])}px)` }}>
          <div style={{ width: 46, height: 2, background: th.accent }} />
          <span style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 26, letterSpacing: 7,
            color: th.accent, textTransform: "uppercase" }}>{slate.place}</span>
        </div>
      )}
      <div style={{ ...dsp(th, 800), fontSize: 104, lineHeight: 1.02, color: "#fff", marginTop: 14,
        letterSpacing: 0.5, textShadow: "0 6px 34px rgba(0,0,0,0.8)", opacity: dateIn,
        transform: `translateY(${interpolate(dateIn, [0, 1], [26, 0])}px)` }}>{slate.date}</div>
      {slate.clock && (
        <div style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 44, letterSpacing: 3, marginTop: 10,
          fontVariantNumeric: "tabular-nums", color: "rgba(255,255,255,0.82)", opacity: clockIn }}>
          {advanceClock(slate.clock, f - LEAD - 10)}
        </div>
      )}
      {cap && (
        <div style={{ marginTop: 26, opacity: capIn, transform: `translateY(${interpolate(capIn, [0, 1], [18, 0])}px)` }}>
          <CaptionBar th={th} text={cap} />
        </div>
      )}
    </div>
  );
};

const QuoteBlock: React.FC<{ th: Theme; quote: string; by?: string }> = ({ th, quote, by }) => {
  const f = useCurrentFrame();
  const qIn = spring({ frame: f - LEAD, fps: FPS, config: { damping: 18 } });
  const byIn = interpolate(f, [LEAD + 14, LEAD + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q = quote.trim().replace(/^["“‘']+|["”’']+$/g, "");
  return (
    <div style={{ position: "absolute", left: 120, top: "50%", maxWidth: 1180,
      borderLeft: `6px solid ${th.accent}`, paddingLeft: 44,
      transform: `translateY(-50%) translateY(${interpolate(qIn, [0, 1], [24, 0])}px)`, opacity: qIn }}>
      <div style={{ fontFamily: th.serif, fontWeight: 500, fontStyle: "italic", fontSize: 64, lineHeight: 1.26,
        color: "#fff", textShadow: "0 4px 26px rgba(0,0,0,0.9)" }}>{q}</div>
      {by && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30, opacity: byIn }}>
          <div style={{ width: 56, height: 2, background: th.accent }} />
          <span style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 25, letterSpacing: 3,
            color: "rgba(255,255,255,0.8)" }}>{by}</span>
        </div>
      )}
    </div>
  );
};

/** One chrome stack for Illus/Diagram/Video. `scrimArgs` are the scene type's
 *  legacy scrim(...) numbers so the caption layout stays pixel-identical. */
const SceneChrome: React.FC<{
  s: DocScene; m: DocManifest; th: Theme; file: string | null; kind: "image" | "video" | "diagram";
  scrimArgs: [number, number, number, number];
}> = ({ s, m, th, file, kind, scrimArgs: [topA, topStop, botStop, botA] }) => {
  const frame = useCurrentFrame();
  const cx = React.useContext(ChromeCtx);
  const layout = chromeLayout(s);
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const src = sourceText(s, m, cx, file, kind);
  const bg = layout === "caption" ? scrim(!!s.cap, topA, topStop, botStop, botA)
    : layout === "slate"
    ? `linear-gradient(180deg, rgba(5,7,12,${topA}) 0%, transparent ${topStop}%, transparent 40%, rgba(5,7,12,0.9) 100%), linear-gradient(90deg, rgba(5,7,12,0.55) 0%, transparent 60%)`
    : layout === "quote"
    ? `linear-gradient(180deg, rgba(5,7,12,${topA}) 0%, transparent ${topStop}%), linear-gradient(90deg, rgba(5,7,12,0.86) 0%, rgba(5,7,12,0.6) 46%, transparent 82%)`
    : scrim(false, topA, topStop, botStop, botA);
  return (
    <>
      <AbsoluteFill style={{ background: bg, pointerEvents: "none" }} />
      {/* SourceLine sits at the very bottom — give it its own faint floor
          when the layout left the lower frame clean */}
      {src && layout !== "caption" && layout !== "slate" && (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 84%, rgba(5,7,12,0.6) 100%)", pointerEvents: "none" }} />
      )}
      {src && layout === "caption" && !s.cap && (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 84%, rgba(5,7,12,0.6) 100%)", pointerEvents: "none" }} />
      )}

      {s.stat && layout !== "none" && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <StatChip th={th} text={s.stat} color={s.statColor} />
        </div>
      )}

      <Brand th={th} />

      {layout === "caption" && s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <CaptionBar th={th} text={s.cap} />
        </div>
      )}
      {layout === "slate" && s.slate && <Slate th={th} slate={s.slate} cap={s.cap} />}
      {layout === "slate" && !s.slate && s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96, opacity: capIn }}>
          <CaptionBar th={th} text={s.cap} />
        </div>
      )}
      {layout === "quote" && (s.cap ?? "").trim() && <QuoteBlock th={th} quote={s.cap ?? ""} by={s.quoteBy} />}
      {src && <SourceLine th={th} text={src} />}
    </>
  );
};

/** where a plate's date stamp sits so it clears this scene's lower chrome */
const stampBottomFor = (s: DocScene) => {
  const l = chromeLayout(s);
  return l === "caption" && s.cap ? 236 : 72; // slate/quote sit left; the stamp sits right
};

/* ── Shared overlay chrome (2026-08-22 craft overhaul) — one implementation
      for the stat chip and caption bar that used to be copy-pasted across
      Illus/Diagram/Video/Exhibit with template-grade styling. ── */

/** Edge scrim for photo/diagram/video scenes. The top band always renders
 *  (Brand + stat chip sit there); the bottom darkening renders only when a
 *  caption sits on it — a cap-less scene keeps its lower frame clean
 *  (BLACKBOX-2027-REVAMP §3.3, conditional chrome). */
const scrim = (cap: boolean, topA: number, topStop: number, botStop: number, botA: number) =>
  cap
    ? `linear-gradient(180deg, rgba(5,7,12,${topA}) 0%, transparent ${topStop}%, transparent ${botStop}%, rgba(5,7,12,${botA}) 100%)`
    : `linear-gradient(180deg, rgba(5,7,12,${topA}) 0%, transparent ${topStop}%)`;

/** Stat chip: expanded-Archivo tabular figures on a sharp editorial plate.
 *  Mounted inside the caller's animated wrapper (entry transform stays there). */
const StatChip: React.FC<{ th: Theme; text: string; color?: string }> = ({ th, text, color }) => (
  <span style={{ ...dsp(th, 780), fontSize: 50, letterSpacing: 0.5,
    fontVariantNumeric: "tabular-nums lining-nums",
    color: color ?? "#fff", background: "rgba(4,6,10,0.78)", padding: "14px 30px 15px",
    borderRadius: 6, borderLeft: `4px solid ${th.accent}`,
    boxShadow: "0 10px 34px rgba(0,0,0,0.6)" }}>{text}</span>
);

/** Caption bar: quotes automatically get the editorial-serif voice (Spectral
 *  italic) — the register contrast that separates spoken evidence from the
 *  narrator's factual captions. Non-quotes stay Inter with a hairline rule. */
const CaptionBar: React.FC<{ th: Theme; text: string }> = ({ th, text }) => {
  const isQuote = /^["“‘']/.test(text.trim());
  return isQuote ? (
    <div style={{ fontFamily: th.serif, fontWeight: 500, fontStyle: "italic", fontSize: 50,
      color: "#fff", lineHeight: 1.32, textShadow: "0 3px 22px rgba(0,0,0,0.92)" }}>
      <span style={{ color: th.accent, marginRight: 14, fontStyle: "normal" }}>—</span>{text}
    </div>
  ) : (
    <div style={{ fontFamily: th.body, fontWeight: 550, fontSize: 44,
      color: "#fff", lineHeight: 1.34, textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
      <span style={{ borderBottom: `2px solid ${th.accent}AA`, paddingBottom: 7 }}>{text}</span>
    </div>
  );
};

/* Evidence-engine radio beat: dark screen, animated waveform, speaker tag,
   transcript line, honesty label (ACTUAL ATC RECORDING vs CVR RECREATION). */
const RadioScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme; idx: number }> = (p) => {
  const cx = React.useContext(ChromeCtx);
  return cx.v2 ? <RadioSceneV2 {...p} /> : <RadioSceneLegacy {...p} />;
};

/** Normalised 0-1 VO level at audio frame `af` from the manifest track
 *  (`level`, else the mouth-flap track); null when the scene has no track. */
const levelTrack = (m: DocManifest, id: string): ((af: number) => number) | null => {
  const t = m.level?.[id] ?? m.mouth?.[id];
  if (!t) return null;
  let max = 1;
  for (let i = 0; i < t.length; i++) max = Math.max(max, t.charCodeAt(i) - 48);
  return (af) => (af < 0 || af >= t.length ? 0 : Math.max(0, Math.min(9, t.charCodeAt(af) - 48)) / max);
};

/* 2027 radio beat (revamp §3.3): the scene's real plate (video or img, heavy
   dim) behind the transcript, a level track from the REAL VO envelope (no
   synthetic waveform — a scene without a track shows a flat idle line), and a
   CVR/ATC strip whose first and largest element is the honesty label. Label
   wording and colours are unchanged: green = ACTUAL docket audio. */
const RadioSceneV2: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme; idx: number }> = ({ s, slug, m, th, idx }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const hasAudio = m.durations[s.id] !== undefined;
  const aud = sceneAud(s, m) * FPS;
  const label = s.radioLabel ?? "CVR RECREATION";
  const actual = label.includes("ACTUAL");
  const lc = actual ? "#7CFC9B" : th.accent;
  const files = (s.img && m.images[s.img]) || [];
  const img = files.length ? files[idx % files.length] : null;
  const vid = s.video && !s.hf ? s.video : null;
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, dur], [1.04, 1.1]);
  const lvl = levelTrack(m, s.id);
  const N = 84;
  const bars = Array.from({ length: N }, (_, i) => {
    const v = lvl ? lvl(frame - LEAD - (N - 1 - i) * 2) : 0;
    return 4 + v * 58;
  });
  const words = (s.cap ?? s.text).split(/\s+/).filter(Boolean);
  const per = words.length ? (aud * 0.85) / words.length : 0;
  const tagIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 18 } });
  const stripIn = spring({ frame, fps: FPS, config: { damping: 20 } });
  const channelTag = actual ? "ATC" : /CVR/.test(label) ? "CVR" : "RADIO";
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
      {(vid || img) && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <ArchivalPlate th={th} kind={vid ? "video" : "image"} scale={drift}
            src={staticFile(vid ? `shorts/${slug}/video/${vid}` : `shorts/${slug}/images/${img}`)}
            startFrom={Math.round((s.videoFrom ?? 0) * FPS)}
            dim={{ fg: 0.34, bg: 0.24, blur: 12 }} graphic={s.graphic} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 44%, rgba(4,6,10,0.35) 0%, rgba(4,6,10,0.82) 100%)" }} />
      {/* speaker + transcript (verbatim — the quoted-transcript gate owns the words) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 150 }}>
        <div style={{ opacity: tagIn, transform: `translateY(${interpolate(tagIn, [0, 1], [14, 0])}px)` }}>
          <span style={{ ...dsp(th, 700), fontSize: 38, color: "#0A0C10",
            background: th.accent, padding: "6px 22px", borderRadius: 6 }}>{s.speaker}</span>
        </div>
        <div style={{ marginTop: 34, maxWidth: 1460, textAlign: "center", padding: "0 60px" }}>
          {words.map((w, i) => {
            const wIn = interpolate(frame, [LEAD + i * per, LEAD + i * per + 6], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span key={i} style={{ fontFamily: th.serif, fontWeight: 500, fontStyle: "italic", fontSize: 58,
                lineHeight: 1.36, color: "#fff", opacity: 0.12 + 0.88 * wIn,
                textShadow: "0 3px 22px rgba(0,0,0,0.9)" }}>
                {i === 0 ? "“" : ""}{w}{i === words.length - 1 ? "”" : ""}{" "}
              </span>
            );
          })}
        </div>
        {s.quoteBy && (
          <div style={{ marginTop: 26, fontFamily: th.mono, fontWeight: 600, fontSize: 24, letterSpacing: 3,
            color: "rgba(255,255,255,0.72)" }}>— {s.quoteBy}</div>
        )}
      </AbsoluteFill>
      {/* CVR / ATC strip */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150,
        background: "rgba(4,6,10,0.88)", borderTop: `1px solid ${lc}55`,
        display: "flex", alignItems: "center", padding: "0 54px", gap: 40,
        transform: `translateY(${interpolate(stripIn, [0, 1], [40, 0])}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flex: "none" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", flex: "none",
            background: actual ? lc : "transparent", border: `3px solid ${lc}`,
            boxShadow: actual ? `0 0 14px ${lc}` : "none" }} />
          <span style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 40, letterSpacing: 5, color: lc }}>{label}</span>
        </div>
        <div style={{ flex: 1, height: 70, display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, minWidth: 3, height: h, borderRadius: 2,
              background: i >= N - 3 ? lc : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
        <div style={{ textAlign: "right", flex: "none", maxWidth: 520 }}>
          <div style={{ fontFamily: th.mono, fontWeight: 500, fontSize: 18, letterSpacing: 4,
            color: "rgba(255,255,255,0.55)" }}>{channelTag}</div>
          {s.timestamp && (
            <div style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 44, letterSpacing: 2,
              fontVariantNumeric: "tabular-nums", color: "#fff" }}>{advanceClock(s.timestamp, frame - LEAD)}</div>
          )}
          {s.source && (
            <div style={{ fontFamily: th.mono, fontWeight: 500, fontSize: 17, letterSpacing: 1, marginTop: 2,
              color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.source}</div>
          )}
        </div>
      </div>
      <Brand th={th} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, [
        { name: "radio_key_up", volume: 0.16 },
        { name: "radio_key_down", at: "out", volume: 0.12 },
      ])} />
    </AbsoluteFill>
  );
};

const RadioSceneLegacy: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
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
        <span style={{ ...dsp(th, 700), fontSize: 26, letterSpacing: 6,
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
        <span style={{ ...dsp(th, 700), fontSize: 40, color: "#0A0C10",
          background: th.accent, padding: "6px 22px", borderRadius: 10 }}>{s.speaker}</span>
        {s.timestamp && (
          <span style={{ fontFamily: th.mono, fontWeight: 700, fontSize: 38,
            color: "rgba(255,255,255,0.6)" }}>{s.timestamp}</span>
        )}
      </div>
      {/* transcript line — spoken evidence carries the editorial serif voice */}
      <div style={{ marginTop: 34, maxWidth: 1420, textAlign: "center",
        transform: `translateY(${interpolate(capIn, [0, 1], [22, 0])}px)`, opacity: capIn }}>
        <span style={{ fontFamily: th.serif, fontWeight: 500, fontStyle: "italic", fontSize: 56,
          lineHeight: 1.38, color: "#fff" }}>
          “{s.cap ?? s.text}”
        </span>
      </div>
      <Brand th={th} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      {/* diegetic radio: quiet key-up/mic-cut only. The looping static bed is
          GONE (2026-08-22, Akshay: the doubled static + squelch was "so
          irritating") — radio_recreate.py already bakes a single faint noise
          floor into recreation clips, and real docket audio carries its own. */}
      <SceneSfx sceneDur={sceneFrames(s, m)} cues={sceneCues(s, [
        { name: "radio_key_up", volume: 0.16 },
        { name: "radio_key_down", at: "out", volume: 0.12 },
      ])} />
    </AbsoluteFill>
  );
};

/* Dimmed/blurred real-photo backdrop for text-only beats (chapter cards,
   kinetic stat reveals) — NEVER leave these on flat black when a real photo
   exists for the scene; bare black-screen-and-text reads cheap and empty
   (Akshay, 2026-07-25 — "70-80% of the video is black screen"). Falls back to
   BASE (solid dark) only when the scene genuinely has no img prefix. */
const TextSceneBg: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th?: Theme;
  /** muted footage plate instead of the img (ChapterCard under visual "2027":
   *  the NEXT scene's clip, so the card teases the footage it cuts into) */
  video?: { file: string; startFrom: number } }> = ({ s, slug, m, idx, th, video }) => {
  const frame = useCurrentFrame();
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
  if (video && th) {
    const fadeInV = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
    const tbv = th.textBg ?? { fg: 0.62, bg: 0.5, blur: 10 };
    return (
      <AbsoluteFill style={{ opacity: fadeInV }}>
        <ArchivalPlate th={th} kind="video" src={staticFile(`shorts/${slug}/video/${video.file}`)}
          startFrom={video.startFrom} scale={interpolate(frame, [0, 1400], [1.04, 1.12], { extrapolateRight: "clamp" })}
          // footage moves, so it sits a step darker than a still behind the type
          dim={{ fg: tbv.fg * 0.78, bg: tbv.bg * 0.8, blur: tbv.blur }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(4,6,10,0.12) 0%, rgba(4,6,10,0.72) 82%)" }} />
      </AbsoluteFill>
    );
  }
  if (!file) return null;
  const fadeIn = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, 1400], [1.06, 1.18], { extrapolateRight: "clamp" });
  const tb = th?.textBg ?? { fg: 0.62, bg: 0.5, blur: 10 };
  // Document-first channels (tb from the theme): the page COVERS the frame with a
  // slow drift, so the type is large and the frame is full. The photo path's
  // blurred-backdrop-plus-contained-copy read as a shrunken page floating on a
  // gray smear once the source was a portrait court filing (Akshay, 2026-08-03:
  // "it looks so small n weird") — correct for a photo, wrong for paper.
  const paper = !!th?.textBg;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {paper ? (
        <Img src={staticFile(`shorts/${slug}/images/${file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "center 22%",
            transform: `scale(${drift})`,
            filter: `brightness(${tb.fg}) contrast(1.06) saturate(0.7) blur(${Math.max(4, tb.blur - 11)}px)` }} />
      ) : (
        // through the archival plate so the channel grade applies once
        // (LEGACY_GRADE.text = the old saturate(0.85) — identical for old channels)
        <ArchivalPlate th={th ?? THEMES.mindwired} kind="image" src={staticFile(`shorts/${slug}/images/${file}`)}
          scale={drift} dim={tb} graphic={s.graphic} />
      )}
      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(4,6,10,0.12) 0%, rgba(4,6,10,0.72) 82%)" }} />
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme; next?: DocScene }> = (p) => {
  const cx = React.useContext(ChromeCtx);
  return (cx.v2 || p.s.tease || p.s.kicker) ? <ChapterCardV2 {...p} /> : <ChapterCardLegacy {...p} />;
};

/* Tease-first chapter card (revamp §3.3, ports the HF title-card choreography):
   eyebrow → kicker → the tease line lands FIRST, then the title rises word by
   word (last word in accent), a diamond rule, and a thin chapter-progress
   track. Under visual "2027" the backdrop is the NEXT scene's footage (dimmed,
   cued to run INTO that scene's videoFrom when it can) — else the img. */
const ChapterCardV2: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme; next?: DocScene }> = ({ s, slug, m, idx, th, next }) => {
  const frame = useCurrentFrame();
  const cx = React.useContext(ChromeCtx);
  const dur = sceneFrames(s, m);
  const hasAudio = m.durations[s.id] !== undefined;
  const lines = (s.chapter ?? "").split("\n");
  const eyebrow = lines.length > 1 ? lines[0] : "";
  const title = lines.length > 1 ? lines.slice(1).join(" ") : lines[0];
  const words = title.split(/\s+/).filter(Boolean);
  const nv = cx.v2 && next?.video && !next.hf ? next : null;
  const nvFrom = nv ? Math.round((nv.videoFrom ?? 0) * FPS) : 0;
  const video = nv ? { file: nv.video as string, startFrom: nvFrom >= dur ? nvFrom - dur : nvFrom } : undefined;
  const ebIn = spring({ frame: frame - 2, fps: FPS, config: { damping: 18 } });
  const teaseAt = 4;
  const teaseIn = spring({ frame: frame - teaseAt, fps: FPS, config: { damping: 20 } });
  const titleAt = s.tease ? LEAD + 16 : 12;
  const stagger = Math.min(4, Math.round(18 / Math.max(1, words.length)));
  const ruleAt = titleAt + stagger * words.length + 6;
  const ruleIn = spring({ frame: frame - ruleAt, fps: FPS, config: { damping: 14 } });
  const progIn = interpolate(frame, [ruleAt, ruleAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = interpolate(frame, [ruleAt, dur], [1, 1.015], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = cx.chapterNo, total = cx.chapterTotal;
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <TextSceneBg s={s} slug={slug} m={m} idx={idx} th={th} video={video} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%",
        border: `1px solid ${th.accent}33`,
        transform: `scale(${interpolate(spring({ frame: frame - 3, fps: FPS, config: { damping: 30 } }), [0, 1], [0.6, 1])})`,
        background: `radial-gradient(circle, ${th.accent}14 0%, transparent 62%)` }} />
      {/* position:relative — a child whose only effect is opacity stops forming a
          stacking context once its spring settles at exactly 1, and would then
          paint UNDER the absolutely-positioned backdrop (kicker vanished on
          some frames). Positioned = always painted in DOM order, on top. */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 1600, padding: "0 120px" }}>
        {eyebrow && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, marginBottom: 22,
            opacity: ebIn, transform: `translateY(${interpolate(ebIn, [0, 1], [-12, 0])}px)` }}>
            <div style={{ width: 84, height: 1, background: `${th.accent}88` }} />
            <div style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 25, color: th.accent, letterSpacing: 9 }}>
              {eyebrow}
            </div>
            <div style={{ width: 84, height: 1, background: `${th.accent}88` }} />
          </div>
        )}
        {s.kicker && (
          <div style={{ marginBottom: 18, opacity: ebIn }}>
            <span style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 21, letterSpacing: 6, color: "#fff",
              border: "1px solid rgba(255,255,255,0.32)", padding: "6px 16px", textTransform: "uppercase" }}>{s.kicker}</span>
          </div>
        )}
        {s.tease && (
          <div style={{ fontFamily: th.serif, fontWeight: 500, fontStyle: "italic", fontSize: 46, lineHeight: 1.3,
            color: "rgba(255,255,255,0.88)", marginBottom: 30, textShadow: "0 3px 22px rgba(0,0,0,0.85)",
            opacity: teaseIn, transform: `translateY(${interpolate(teaseIn, [0, 1], [16, 0])}px)` }}>{s.tease}</div>
        )}
        <div style={{ ...dsp(th, 800), fontSize: 96, color: "#fff", lineHeight: 1.06,
          letterSpacing: 1, textShadow: "0 4px 34px rgba(0,0,0,0.75)", transform: `scale(${breathe})` }}>
          {words.map((w, i) => {
            const wIn = spring({ frame: frame - titleAt - i * stagger, fps: FPS, config: { damping: 14, stiffness: 140 } });
            return (
              <span key={i} style={{ display: "inline-block", margin: "0 0.14em",
                color: i === words.length - 1 && words.length > 1 ? th.accent : "#fff",
                opacity: interpolate(wIn, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(wIn, [0, 1], [46, 0])}px)` }}>{w}</span>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 38 }}>
          <div style={{ width: 150, height: 2, background: `linear-gradient(90deg, transparent, ${th.accent})`,
            transform: `scaleX(${ruleIn})`, transformOrigin: "right" }} />
          <div style={{ width: 9, height: 9, background: th.accent, transform: `rotate(45deg) scale(${ruleIn})` }} />
          <div style={{ width: 150, height: 2, background: `linear-gradient(270deg, transparent, ${th.accent})`,
            transform: `scaleX(${ruleIn})`, transformOrigin: "left" }} />
        </div>
      </div>
      {/* chapter progress: one tick per chapter card in the doc, filled up to this one */}
      {total > 1 && n > 0 && (
        <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, display: "flex",
          justifyContent: "center", alignItems: "center", gap: 22, opacity: progIn }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{ width: Math.max(14, Math.min(72, 760 / total)), height: i + 1 === n ? 4 : 2,
                background: i + 1 <= n ? th.accent : "rgba(255,255,255,0.24)",
                opacity: i + 1 < n ? 0.6 : 1 }} />
            ))}
          </div>
          <span style={{ fontFamily: th.mono, fontWeight: 500, fontSize: 19, letterSpacing: 3,
            color: "rgba(255,255,255,0.62)", fontVariantNumeric: "tabular-nums" }}>
            {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
      {cx.v2 && <Brand th={th} />}
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, [{ name: "chapter_boom" }])} />
    </AbsoluteFill>
  );
};

const ChapterCardLegacy: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const hasAudio = m.durations[s.id] !== undefined;
  const sp = spring({ frame, fps: FPS, config: { damping: 16 } });
  const lines = (s.chapter ?? "").split("\n");
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <TextSceneBg s={s} slug={slug} m={m} idx={idx} th={th} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}14 0%, transparent 62%)` }} />
      <div style={{ textAlign: "center", transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`, opacity: sp }}>
        {/* eyebrow: technical mono between hairlines — evidence-file register */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, marginBottom: 30 }}>
          <div style={{ width: 84, height: 1, background: `${th.accent}88` }} />
          <div style={{ fontFamily: th.mono, fontWeight: 600, fontSize: 25, color: th.accent, letterSpacing: 9 }}>
            {lines[0]}
          </div>
          <div style={{ width: 84, height: 1, background: `${th.accent}88` }} />
        </div>
        {/* title: expanded Archivo, tight leading — broadcast-documentary weight */}
        <div style={{ ...dsp(th, 800), fontSize: 96, color: "#fff", lineHeight: 1.04, maxWidth: 1560,
          letterSpacing: 1, textShadow: "0 4px 34px rgba(0,0,0,0.75)" }}>
          {lines[1]}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 38 }}>
          <div style={{ width: 150, height: 2, background: `linear-gradient(90deg, transparent, ${th.accent})` }} />
          <div style={{ width: 9, height: 9, background: th.accent, transform: "rotate(45deg)" }} />
          <div style={{ width: 150, height: 2, background: `linear-gradient(270deg, transparent, ${th.accent})` }} />
        </div>
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
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const hasAudio = m.durations[s.id] !== undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      {file && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          {/* blur-fill: blurred cover backdrop fills the frame regardless of source
              aspect; the sharp foreground never crops (portrait sources stay whole) */}
          <ArchivalPlate th={th} kind="image" src={staticFile(`shorts/${slug}/images/${file}`)}
            frame={s.plate} scale={scale} x={driftX} graphic={s.graphic}
            stamp={s.stamp} stampBottom={stampBottomFor(s)} />
        </AbsoluteFill>
      )}
      <SceneChrome s={s} m={m} th={th} file={file} kind="image" scrimArgs={[0.62, 24, 56, 0.94]} />

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
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const hasAudio = m.durations[s.id] !== undefined;
  const Diagram = (s.diagram && DIAGRAMS[s.diagram]) || null;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {Diagram ? <Diagram dur={dur} arg={s.arg} accent={th.accent} /> : <AbsoluteFill style={{ backgroundColor: BASE }} />}
      </AbsoluteFill>
      <SceneChrome s={s} m={m} th={th} file={null} kind="diagram" scrimArgs={[0.55, 22, 60, 0.92]} />

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, s.stat ? [{ name: "stat_hit", at: statAt }] : [])} />
    </AbsoluteFill>
  );
};

/** True when the router (makeDocComp) sends this scene to VideoScene —
 *  must mirror the branch order there (chapter/sting/speaker win over video). */
const isVideoScene = (s?: DocScene) => !!s && !s.chapter && !s.sting && !s.speaker && !!(s.hf || s.video);

/* Real footage scene (NTSB animation etc.): muted video, narration over it.
   cutIn/cutOut: the neighbouring scene is also footage, so the edge hard-cuts
   instead of dipping to black (scene timing is unchanged — only the opacity
   ramps are skipped). */
const VideoScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme; cutIn?: boolean; cutOut?: boolean }> = ({ s, slug, m, th, cutIn, cutOut }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const fadeIn = cutIn ? 1 : interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = cutOut ? 1 : interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const hasAudio = m.durations[s.id] !== undefined;
  const src = staticFile(`shorts/${slug}/video/${s.video}`);
  const startFrom = Math.round((s.videoFrom ?? 0) * FPS);
  const drift = interpolate(frame, [0, dur], [1.0, 1.05]);
  if (s.hf) {
    // HyperFrames owns the whole frame (BLACKBOX-2027-REVAMP §3.1): the kit draws its own
    // chrome/credit, so no drift, grade, scrim, blur-fill or DocWide overlays on top of it.
    return (
      <AbsoluteFill style={{ backgroundColor: "#05070C", opacity: fadeOut }}>
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <OffthreadVideo src={src} muted startFrom={startFrom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
        <SceneSfx sceneDur={dur} cues={sceneCues(s, [])} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C", opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* blur-fill (default): blurred cover copy fills the frame so 4:3 /
            portrait archival never shows black pillar/letterbox bars */}
        <ArchivalPlate th={th} kind="video" src={src} startFrom={startFrom} scale={drift}
          frame={s.plate} graphic={s.graphic} stamp={s.stamp} stampBottom={stampBottomFor(s)} />
      </AbsoluteFill>
      <SceneChrome s={s} m={m} th={th} file={s.video ?? null} kind="video" scrimArgs={[0.55, 22, 60, 0.92]} />
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, s.stat ? [{ name: "stat_hit", at: statAt }] : [])} />
    </AbsoluteFill>
  );
};

/* DELAYED BRAND STING (documentary-pivot): audio-led mindwired ident that plays
   AFTER the cold open — wordmark bloom + expanding accent ring + a musical motif
   (sfx/sting_motif) under the spoken line. One standing beat, every episode. */
const StingScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = (p) => {
  const cx = React.useContext(ChromeCtx);
  return cx.lockup && p.th.lockup === "blackbox" ? <StingBlackBox {...p} caseId={cx.caseId} /> : <StingLegacy {...p} />;
};

/* Black Box sting: the recorder glyph lands, the mono wordmark types on as a
   case-file header, an accent scan line sweeps, and the case number (when the
   doc has one) prints under it. Same motif audio + timing as the legacy sting. */
const StingBlackBox: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme; caseId?: string }> = ({ s, slug, m, th, caseId }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const hasAudio = m.durations[s.id] !== undefined;
  const glyphIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 13, stiffness: 110 } });
  const word = "BLACK BOX";
  const typed = Math.max(0, Math.min(word.length, Math.floor((frame - 14) / 2)));
  const scan = interpolate(frame, [12, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subIn = interpolate(frame, [36, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caseIn = interpolate(frame, [48, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(frame, [6, 30, dur - 20, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060A", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ position: "absolute", width: 820, height: 820, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}1C 0%, transparent 62%)`, opacity: glow }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: `${18 + scan * 64}%`, height: 2,
        background: `linear-gradient(90deg, transparent, ${th.accent}AA, transparent)`, opacity: (1 - scan) * 0.8 }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${interpolate(glyphIn, [0, 1], [0.6, 1])})`, opacity: glyphIn }}>
          <RecorderGlyph size={150} color={th.accent} />
        </div>
        <div style={{ marginTop: 54, fontFamily: th.mono, fontWeight: 600, fontSize: 118, letterSpacing: 22,
          color: "#fff", whiteSpace: "pre", textShadow: `0 0 ${glow * 36}px ${th.accent}55`, minHeight: 140 }}>
          {word.slice(0, typed)}<span style={{ opacity: typed < word.length || Math.floor(frame / 12) % 2 === 0 ? 1 : 0,
            color: th.accent }}>▌</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: th.mono, fontWeight: 500, fontSize: 32, letterSpacing: 26,
          color: th.accent, opacity: subIn, paddingLeft: 26 }}>BREAKDOWN</div>
        {caseId && (
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18, opacity: caseIn }}>
            <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.35)" }} />
            <span style={{ fontFamily: th.mono, fontWeight: 500, fontSize: 26, letterSpacing: 4,
              color: "rgba(255,255,255,0.7)" }}>CASE FILE · {caseId}</span>
            <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.35)" }} />
          </div>
        )}
      </div>
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
      <SceneSfx sceneDur={dur} cues={sceneCues(s, [{ name: "sting_motif", at: 0 }])} />
    </AbsoluteFill>
  );
};

const StingLegacy: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
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
          <span style={{ ...dsp(th, 700), fontSize: 132, color: "#fff", letterSpacing: 1,
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

/** Exhibit page tints (scene `paperTone`): a filter on the page + a multiply
 *  wash. Unset = the legacy contrast(1.05) brightness(1.03) page. */
const PAPER_TONES: Record<string, { filter: string; wash: string; washOpacity: number }> = {
  warm: { filter: "sepia(0.3) saturate(0.85) contrast(1.06) brightness(0.98)", wash: "#F1DFBE", washOpacity: 0.4 },
  cool: { filter: "grayscale(0.5) contrast(1.08) brightness(1.0)", wash: "#D3DFEC", washOpacity: 0.45 },
  neutral: { filter: "grayscale(1) contrast(1.1) brightness(1.02)", wash: "#ECECEA", washOpacity: 0.2 },
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
  const cx = React.useContext(ChromeCtx);
  const tone = (s.paperTone && PAPER_TONES[s.paperTone]) || null;
  const doc = s.exhibitMode === "document";
  // document-first: the page is frame-wide and COVERS the frame; the read
  // point drifts down the page toward the highlight (portrait pages — the
  // [0.24, 0.76] clamp keeps a letter-size page's edges off screen)
  const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const dTy = hl ? interpolate(ease, [0, 1], [cl(targetY - 0.08, 0.24, 0.76), cl(targetY, 0.24, 0.76)])
    : interpolate(ease, [0, 1], [0.28, 0.42]);
  const dTx = cl(targetX, 0.25, 0.75);
  const dZoom = interpolate(ease, [0, 1], [1.0, hl ? 1.22 : 1.08]);
  const dShiftX = (0.5 - dTx) * 1920 * (dZoom - 1) * 0.9;
  const autoSrc = !s.source ? sourceText(s, m, cx, file, "image") : null;
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
      {file && doc && (
        <AbsoluteFill style={{ opacity: fadeIn, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, width: "100%", top: "50%",
            transformOrigin: `${dTx * 100}% ${dTy * 100}%`,
            transform: `translate(${dShiftX}px, ${-dTy * 100}%) scale(${dZoom})` }}>
            <Img src={staticFile(`shorts/${slug}/images/${file}`)}
              style={{ width: "100%", height: "auto", display: "block",
                filter: tone ? tone.filter : "contrast(1.05) brightness(1.03)" }} />
            {tone && <div style={{ position: "absolute", inset: 0, background: tone.wash,
              mixBlendMode: "multiply", opacity: tone.washOpacity }} />}
            {(s.redact ?? []).map((r, i) => r.length === 4 && (
              <div key={`rd${i}`} style={{ position: "absolute",
                left: `${r[0] * 100}%`, top: `${r[1] * 100}%`,
                width: `${r[2] * 100}%`, height: `${r[3] * 100}%`,
                background: "#0A0C10", border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 2 }} />
            ))}
            {hl && (
              <div style={{ position: "absolute", left: `${hl[0] * 100}%`, top: `${hl[1] * 100}%`,
                width: `${hl[2] * 100}%`, height: `${hl[3] * 100}%`,
                background: `${th.accent}22`, border: `3px solid ${th.accent}`,
                boxShadow: `0 0 24px ${th.accent}88`, borderRadius: 4,
                opacity: boxIn, transform: `scaleX(${boxIn})`, transformOrigin: "left" }} />
            )}
          </div>
          {/* the page fills the frame, so the chrome needs its own floor + ceiling */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,7,0.55) 0%, transparent 18%, transparent 56%, rgba(3,4,7,0.92) 100%)" }} />
        </AbsoluteFill>
      )}
      {file && !doc && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeIn }}>
          <div style={{ position: "relative", height: "88%",
            transform: `translate(${shiftX}px, ${shiftY}px) scale(${zoom})` }}>
            <Img src={staticFile(`shorts/${slug}/images/${file}`)}
              style={{ height: "100%", width: "auto", objectFit: "contain", display: "block",
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.12)",
                filter: tone ? tone.filter : "contrast(1.05) brightness(1.03)" }} />
            {tone && <div style={{ position: "absolute", inset: 0, background: tone.wash,
              mixBlendMode: "multiply", opacity: tone.washOpacity }} />}
            {(s.redact ?? []).map((r, i) => r.length === 4 && (
              <div key={`rd${i}`} style={{ position: "absolute",
                left: `${r[0] * 100}%`, top: `${r[1] * 100}%`,
                width: `${r[2] * 100}%`, height: `${r[3] * 100}%`,
                background: "#0A0C10", border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 2 }} />
            ))}
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
          <div style={{ fontFamily: th.mono, fontWeight: 700, fontSize: 22,
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
          {/* the caption needs its own PLATE, not just a shadow (apollo1, 2026-09-13):
              a zoomed exhibit is usually a scanned page, i.e. near-white, and a
              white caption with only a text-shadow over it is unreadable. The
              source lower-third already solved this the same way. */}
          <span style={{ fontFamily: th.body, fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1.3,
            display: "inline-block", background: "rgba(3,4,7,0.82)", padding: "10px 22px",
            borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>{s.cap}</span>
        </div>
      )}
      {autoSrc && <SourceLine th={th} text={autoSrc} />}
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
  const fadeOut = interpolate(frame, [dur - 5, dur], [1, 0.5], { extrapolateLeft: "clamp" });
  const hasAudio = m.durations[s.id] !== undefined;
  // NO ROLL-UP COUNTERS (Akshay, 2026-08-04: "i never was a fan of animation how
  // u build up numbers … thats so bad"). A ticking counter spends a second or two
  // displaying figures that are all WRONG, can't be read while moving, and delays
  // the only frame that matters. The figure lands at its real value immediately
  // and settles — emphasis without the slot machine. See memory
  // `no-count-up-number-animation`.
  const landSp = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 15, stiffness: 140 } });
  const shown = k.count !== undefined ? k.count : null;
  const strikeAt = LEAD + aud * 0.68;
  const strikeT = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const revealSp = spring({ frame: frame - strikeAt - 6, fps: FPS, config: { damping: 13, stiffness: 120 } });
  const fmt = (n: number) => n.toLocaleString("en-US");
  const words = k.words ?? [];
  const perWord = words.length ? (aud * 0.78) / words.length : 0;
  // Auto-fit the figure: long prefix/suffix strings ("1,776 ft — One World
  // Trade Center's symbolic height") wrapped to four lines at 200px on the
  // expanded display cut and ran into the sub-caption. Same width estimate
  // as CountUp in src/components/kinetic.tsx (~0.62em per bold glyph),
  // clamped so short figures keep the full 200px.
  const figureText = `${k.prefix ?? ""}${shown !== null ? fmt(shown) : ""}${k.suffix ?? ""}`;
  const figureSize = Math.max(96, Math.min(200, Math.floor(1700 / Math.max(1, figureText.length * 0.62))));
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060A", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <TextSceneBg s={s} slug={slug} m={m} idx={idx} th={th} />
      <div style={{ position: "absolute", width: 780, height: 780, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}0F 0%, transparent 60%)` }} />
      {shown !== null && (
        <div style={{ textAlign: "center", maxWidth: 1700 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <span style={{ ...dsp(th, 700), fontSize: figureSize, color: "#fff", letterSpacing: 1,
              lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.75)",
              display: "inline-block",
              transform: `scale(${interpolate(landSp, [0, 1], [1.08, 1])})`,
              opacity: (k.strike !== undefined ? interpolate(strikeT, [0, 1], [1, 0.45]) : 1)
                       * interpolate(landSp, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }) }}>
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
              <span style={{ ...dsp(th, 700), fontSize: 150, color: th.accent,
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
            const wIn = spring({ frame: frame - 3 - i * perWord, fps: FPS, config: { damping: 16 } });
            return (
              <span key={i} style={{ display: "inline-block", margin: "0 14px",
                ...dsp(th, 700), fontSize: 92, lineHeight: 1.3,
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
  const hfSpans: [number, number][] = [];
  { let c = 0; for (const s of doc.scenes) { const d = sceneFrames(s, manifest); if (s.hf) hfSpans.push([c, c + d]); c += d; } }
  // 2027 visual-system opt-ins (doc-level) + chapter numbering for the progress ticks
  const v2 = doc.visual === "2027";
  const chapterNo: Record<string, number> = {};
  { let n = 0; for (const s of doc.scenes) if (s.chapter) chapterNo[s.id] = ++n; }
  const chapterTotal = Object.keys(chapterNo).length;
  const Comp: React.FC = () => {
    let cursor = 0;
    return (
      <AbsoluteFill style={{ backgroundColor: BASE }}>
        {/* Embedded Devanagari @font-face — root-level so ALL scene types get it
            (loadFont tofu'd on the GCE headless render). See devanagariFont.ts. */}
        <style>{DEVANAGARI_FONT_CSS}</style>
        {doc.scenes.map((s, i) => {
          const from = cursor; const dur = sceneFrames(s, manifest); cursor += dur;
          const cx: ChromeCtxT = { v2, lockup: v2 || !!doc.caseId, caseId: doc.caseId, hook: from < HOOK_FRAMES,
            chapterNo: chapterNo[s.id] ?? 0, chapterTotal, sourceLine: !!doc.sourceLine };
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              <ChromeCtx.Provider value={cx}>
              {s.chapter
                ? <ChapterCard s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th}
                    next={doc.scenes[i + 1]} />
                : s.sting
                ? <StingScene s={s} slug={doc.slug} m={manifest} th={th} />
                : s.speaker
                ? <RadioScene s={s} slug={doc.slug} m={manifest} th={th} idx={sceneFileIdx[s.id] ?? i} />
                : s.hf
                ? <VideoScene s={{ ...s, video: `hf_${s.hf}.mp4` }} slug={doc.slug} m={manifest} th={th}
                    cutIn={isVideoScene(doc.scenes[i - 1])} cutOut={isVideoScene(doc.scenes[i + 1])} />
                : s.video
                ? <VideoScene s={s} slug={doc.slug} m={manifest} th={th}
                    cutIn={isVideoScene(doc.scenes[i - 1])} cutOut={isVideoScene(doc.scenes[i + 1])} />
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
                : s.timeline
                ? <CaseTimeline marks={s.timeline.marks} title={s.timeline.title}
                    cap={s.cap ?? s.text} accent={th.accent} sceneDur={dur} />
                : s.route
                ? <RouteMap points={s.route.points} title={s.route.title}
                    cap={s.cap ?? s.text} accent={th.accent} sceneDur={dur} />
                : s.tree
                ? <GenealogyTree rows={s.tree.rows} title={s.tree.title}
                    cap={s.cap ?? s.text} accent={th.accent} sceneDur={dur} />
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
              </ChromeCtx.Provider>
            </Sequence>
          );
        })}
        <Sequence from={0} durationInFrames={docTotalFrames(doc, manifest)} name="grain-grade">
          <GrainVignette skip={hfSpans} />
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
