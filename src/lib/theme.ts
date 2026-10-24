/** Mindwired cinematic palette — deep space, cold data-cyan, hot warning-amber. */
export const C = {
  void:      "#03060F",
  deepBlue:  "#0A1428",
  panel:     "#0E1B33",
  panelEdge: "#1C3354",

  cyan:      "#36D4FF",   // cold / data / tracking
  ice:       "#9FD8FF",
  teal:      "#27E0C3",
  amber:     "#FFB347",   // heat / sunlight / warning
  ember:     "#FF7A3C",
  danger:    "#FF4D4D",   // impact / Kessler
  gold:      "#FFD86B",

  white:     "#EAF2FF",
  dim:       "rgba(206,226,255,0.62)",
  faint:     "rgba(206,226,255,0.32)",

  earthCore: "#1B3A6B",
  earthLand: "#214E3C",
  earthGlow: "#4FA8FF",
  atmo:      "#7FC9FF",
};

/** Channel typography (self-hosted, registered in lib/fonts.ts).
 *
 *  2026-08-22 craft overhaul (docs/planning/CRAFT-AUDIT.md): the old
 *  two-sans system (Space Grotesk + Inter) read as template-grade — the
 *  same pairing half the explainer market uses, with no register contrast.
 *  The new system is a four-voice hierarchy:
 *
 *    DISPLAY — Archivo (variable). Hero titles / chapter cards / stat
 *              numerals. Pair with fontStretch "115%"-"125%" for the
 *              broadcast-documentary expanded cut; tabular-nums for stats.
 *    SERIF   — Spectral. Pull-quotes, reflective coda lines, citations.
 *              The serif-vs-grotesk contrast is the "expensive" signal.
 *    MONO    — IBM Plex Mono. Evidence chrome: EXHIBIT tags, GET clocks,
 *              timestamps, source lines. Never Courier New.
 *    SANS    — Inter. Captions and body. Unchanged: legibility is its job.
 *
 *  Space Grotesk stays loaded for back-compat with older comps. */
export const DISPLAY = "'Archivo', 'Space Grotesk', 'Helvetica Neue', sans-serif";
export const SERIF = "'Spectral', Georgia, 'Times New Roman', serif";
export const MONO = "'IBM Plex Mono', 'SF Mono', Menlo, monospace";
export const SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
/** Expanded display cut — apply as `fontStretch` alongside DISPLAY. */
export const DISPLAY_STRETCH = "118%";

export const VIDEO = { fps: 30, width: 1920, height: 1080 } as const;

/** Archival treatment for real footage/photo plates (DocWide `ArchivalPlate`,
 *  BLACKBOX-2027-REVAMP §3.3). One token per channel, applied once by the
 *  plate — replaces the hand-typed filters that VideoScene/IllusScene/
 *  TextSceneBg each carried. HyperFrames (`hf`) scenes and `graphic` scenes
 *  bypass it entirely (generated graphics are never "aged").
 *
 *  Filter strings are CSS `filter` function lists; the plate appends its own
 *  blur/brightness for the blur-fill backdrop and the dimmed text backdrop. */
export type ArchivalGrade = {
  /** sharp photo plate */
  photo: string;
  /** sharp footage plate */
  video: string;
  /** blur-fill backdrop (plate appends `blur(14px) brightness(0.55)`) */
  back: string;
  /** dimmed chapter/kinetic backdrop (plate wraps it in brightness()+blur()) */
  text: string;
  /** LUT-ish split tone: `lift` lightens anything darker than it (tinted,
   *  lifted film blacks); `warm` soft-lights the mids/highlights. */
  tone?: { lift: string; warm: string; warmOpacity: number };
  /** extra plate grain over the body-wide GrainVignette (0 = none) */
  grain: number;
  /** channel allows the date-stamp chrome (scene `stamp`) */
  stamp: boolean;
};

/** Exactly the pre-2027 filters — every non-blackbox channel keeps its look. */
export const LEGACY_GRADE: ArchivalGrade = {
  photo: "saturate(0.88) contrast(1.05)",
  video: "saturate(0.92) contrast(1.06)",
  back: "saturate(0.88) contrast(1.05)",
  text: "saturate(0.85)",
  grain: 0,
  stamp: false,
};

/** Black Box: forensic-archival — desaturated, a touch of sepia, lifted
 *  blue-black shadows, faint warm highlights, a little more grain. Reads as
 *  "evidence footage" without crushing detail out of 480p NASA/NTSB clips. */
export const BLACKBOX_GRADE: ArchivalGrade = {
  photo: "sepia(0.14) saturate(0.74) contrast(1.12) brightness(0.97)",
  video: "sepia(0.16) saturate(0.72) contrast(1.14) brightness(0.96)",
  back: "sepia(0.2) saturate(0.6) contrast(1.05)",
  text: "sepia(0.2) saturate(0.6)",
  tone: { lift: "#0D1820", warm: "#FFB066", warmOpacity: 0.1 },
  grain: 0.06,
  stamp: true,
};
