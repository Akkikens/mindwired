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

/** Channel typography (self-hosted, registered in lib/fonts.ts):
 *  Space Grotesk for display/headlines/stats, Inter for captions/labels/body. */
export const DISPLAY = "'Space Grotesk', 'Helvetica Neue', sans-serif";
export const SANS = "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const VIDEO = { fps: 30, width: 1920, height: 1080 } as const;
