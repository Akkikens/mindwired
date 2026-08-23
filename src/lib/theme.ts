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
