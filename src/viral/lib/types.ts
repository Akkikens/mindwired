/** Viral short engine — data model.
 *  A video = a VisualPlan (array of PlanScene) + a generated audio manifest.
 *  Scene timing is audio-driven: each scene spans its voiceover clip's real
 *  duration; the plan's start/end are only the pre-audio design targets. */

export type SceneKind =
  | "hook"            // 0-3s pattern interrupt: bold claim, instant motion
  | "problem"         // set up the tension
  | "shockfact"       // one hard fact, slammed on screen
  | "comparison"      // A vs B split
  | "transformation"  // before → after morph
  | "data"            // count-ups, bars, stats
  | "quote"           // attributed line, clean typography
  | "cta";            // follow/subscribe payoff

export type EmotionalTone =
  | "shock" | "fear" | "curiosity" | "excitement" | "confidence" | "awe";

export type TransitionKind = "whip" | "flash" | "zoomblast" | "dissolve" | "cut" | "none";

/** Named cinematic camera moves (Higgsfield-style grammar). Each maps to a
 *  concrete keyframe curve in lib/camera.ts and can be layered (2-3 per scene)
 *  for compound motion — e.g. ["dolly-in","handheld"] = a driven push with
 *  organic sway. Also emitted verbatim into external T2V prompts (Veo/Kling) so
 *  generated footage matches the code move. */
export type CameraMove =
  | "push"        // slow cinematic dolly-in (the engine's original default)
  | "pull"        // slow pull-back — reveal / loneliness beats
  | "crash-zoom"  // fast punch-in that settles — shock / reveals
  | "dolly-in"    // steady, linear forward drive
  | "orbit"       // slow rotational arc + drift — awe / scale
  | "dutch"       // canted angle with a slow roll — unease
  | "handheld"    // organic low-amplitude sway — realism / tension
  | "static";     // locked off — quotes / clean data

export interface PlanScene {
  id: string;
  kind: SceneKind;
  /** design-target seconds (used only when no audio manifest exists) */
  start: number;
  end: number;
  voiceover: string;
  /** the big on-screen line (NOT a transcript — shorter, punchier) */
  mainText: string;
  /** words inside mainText that get the emphasis treatment */
  emphasis?: string[];
  /** secondary caption/kicker, small */
  kicker?: string;
  visualConcept: string;
  animationStyle?: string;
  /** named camera move(s) for this scene (Higgsfield-style grammar). A single
   *  move or a small stack that compose (multiply scale, sum translate/rot).
   *  Omit to inherit the scene tone's default move. */
  camera?: CameraMove | CameraMove[];
  /** a shot-recipe id from lib/recipes.ts — expands into camera + tone + grade
   *  + transition defaults so one field gives a scene a complete cinematic
   *  identity. Explicit per-scene fields still win over the recipe. */
  recipe?: string;
  /** prompt for the b-roll image generator (KIE/Kagecia); slot is optional */
  backgroundPrompt?: string;
  /** set true by scripts/gen_broll.py once public/shorts/<slug>/broll/<id>.jpg exists */
  brollExists?: boolean;
  /** motion b-roll: a short cinematic clip (Veo/Kling/Higgsfield) used as the
   *  scene backdrop instead of a still. Path relative to public/; the engine
   *  plays it via OffthreadVideo (muted, cover-fit) under the shared grade so
   *  real footage inherits the channel's captions, palette and grain instead
   *  of being hand-edited off-brand in ffmpeg. */
  brollVideo?: string;
  /** set true by lipsync/batch.py once public/shorts/<slug>/host/<id>.mp4 exists —
   *  the engine then plays the talking-head clip instead of the still (9:16 renders) */
  hostClipExists?: boolean;
  /** set true by lipsync/batch.py --wide once public/shorts/<slug>/host-wide/<id>.mp4
   *  exists — a separate clip lip-synced against the host's native 16:9 portrait,
   *  since a 9:16 talking clip's mouth movement doesn't fit a 16:9 image (16:9
   *  renders use this instead of hostClipExists) */
  hostClipExistsWide?: boolean;
  /** host mode only: render this scene as a full kinetic scene (data slams,
   *  comparisons, quotes — the "board") instead of captions over the host.
   *  Alternate host ↔ board scenes to keep long host videos visually alive. */
  board?: boolean;
  emotionalTone: EmotionalTone;
  transitionOut: TransitionKind;
  /** DataScene: value to count to + suffix ("100,000,000" → to=100000000).
   *  bars: animated comparison chart instead of (or under) the count-up */
  stat?: { to: number; suffix?: string; label?: string; bars?: Array<{ label: string; value: number }> };
  /** ComparisonScene: the two sides. leftImg/rightImg are optional crest/flag
   *  image paths (relative to public/) shown above each side's label. */
  compare?: { left: string; right: string; leftImg?: string; rightImg?: string };
}

/** An alternative opening hook to A/B before publishing. The hook decides
 *  whether the click stays; render each variant and score it (Hook Score +
 *  Hold Rate) via the virality predictor, then promote the winner into the
 *  plan's first scene. See scripts/hook_lab.py + HOOK-LAB.md. */
export interface HookVariant {
  id: string;
  voiceover: string;
  mainText: string;
  emphasis?: string[];
  kicker?: string;
  /** why this angle — kept for the scoring worksheet, not rendered */
  rationale?: string;
}

export interface VisualPlan {
  slug: string;
  title: string;
  /** optional hook A/B set — scored offline, not rendered in the main video */
  hookVariants?: HookVariant[];
  /** optional looping music bed: drop the file in public/ and reference it here.
   *  bpm drives beat-synced camera pulse; volume defaults to 0.14 under the voice */
  music?: { src: string; bpm?: number; volume?: number };
  /** optional host — a registry id from src/viral/hosts.json ("orion",
   *  "sterling", "rio", "vex") or a direct image path under public/. Renders a
   *  face-fronted Short (talking-head clips when lip-synced, still + Ken Burns
   *  otherwise) instead of the procedural backdrop */
  host?: string;
  /** corner watermark text; defaults to "mindwired". Set this when a plan is
   *  published under a different channel (e.g. kickoffdaily90 for football) */
  channel?: string;
  scenes: PlanScene[];
}

export interface TimedWord { word: string; start: number; end: number }
export interface ManifestClip { dur: number; text?: string; words?: TimedWord[]; estimated?: boolean; amp?: number[] }
export interface ShortManifest { clips: Record<string, ManifestClip> }

/** A scene resolved against real audio: absolute frame timeline. */
export interface TimedScene extends PlanScene {
  /** plan.channel copied onto every scene so scene components (e.g. the CTA
   *  follow pill) can brand per-channel without a prop-drilling chain */
  channel?: string;
  from: number;             // absolute start frame
  durationInFrames: number; // lead-in + voice + hold padding
  words: TimedWord[];       // real or estimated, shifted by the lead-in
  audioDelay: number;       // frames of visual lead-in before the voice starts
  holdFrames: number;       // tone-derived tail held after the voice stops
  audioSrc?: string;        // staticFile path, undefined when clip is silent/estimated
}
