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

export type TransitionKind = "whip" | "flash" | "zoomblast" | "cut" | "none";

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
  /** prompt for the b-roll image generator (KIE/Kagecia); slot is optional */
  backgroundPrompt?: string;
  /** set true by scripts/gen_broll.py once public/shorts/<slug>/broll/<id>.jpg exists */
  brollExists?: boolean;
  emotionalTone: EmotionalTone;
  transitionOut: TransitionKind;
  /** DataScene: value to count to + suffix ("100,000,000" → to=100000000).
   *  bars: animated comparison chart instead of (or under) the count-up */
  stat?: { to: number; suffix?: string; label?: string; bars?: Array<{ label: string; value: number }> };
  /** ComparisonScene: the two sides */
  compare?: { left: string; right: string };
}

export interface VisualPlan {
  slug: string;
  title: string;
  /** optional looping music bed: drop the file in public/ and reference it here.
   *  bpm drives beat-synced camera pulse; volume defaults to 0.14 under the voice */
  music?: { src: string; bpm?: number; volume?: number };
  scenes: PlanScene[];
}

export interface TimedWord { word: string; start: number; end: number }
export interface ManifestClip { dur: number; text?: string; words?: TimedWord[]; estimated?: boolean }
export interface ShortManifest { clips: Record<string, ManifestClip> }

/** A scene resolved against real audio: absolute frame timeline. */
export interface TimedScene extends PlanScene {
  from: number;             // absolute start frame
  durationInFrames: number; // lead-in + voice + hold padding
  words: TimedWord[];       // real or estimated, shifted by the lead-in
  audioDelay: number;       // frames of visual lead-in before the voice starts
  audioSrc?: string;        // staticFile path, undefined when clip is silent/estimated
}
