/** Real, self-hosted typography. Loaded once at module-eval so every composition
 *  renders with the channel faces (no network at render time — TTFs ship in /public). */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Space Grotesk — distinctive techy grotesque for display / headlines / stats.
loadFont({
  family: "Space Grotesk",
  url: staticFile("fonts/SpaceGrotesk.ttf"),
  weight: "300 700",
  display: "block",
}).catch(() => undefined);

// Inter — maximally legible humanist sans for captions / labels / body.
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter.ttf"),
  weight: "100 900",
  display: "block",
}).catch(() => undefined);

// Noto Sans Devanagari — crisp Hindi (Devanagari) text for the DimaagBatti channel.
loadFont({
  family: "Noto Sans Devanagari",
  url: staticFile("fonts/NotoSansDevanagari.ttf"),
  weight: "100 900",
  display: "block",
}).catch(() => undefined);

// Caveat — expressive handwritten script for the sketch/illustrated brand look
// (marker captions, annotations). OFL-licensed, self-hosted. Static woff2
// instances — the variable [wght] TTF failed to resolve at render (serif
// fallback in stills), the instantiated cuts load reliably.
loadFont({
  family: "Caveat",
  url: staticFile("fonts/Caveat400.woff2"),
  weight: "400",
  display: "block",
}).catch(() => undefined);
loadFont({
  family: "Caveat",
  url: staticFile("fonts/Caveat700.woff2"),
  weight: "700",
  display: "block",
}).catch(() => undefined);

// Patrick Hand — legible handwriting for longer sketch-scene labels. OFL.
// (latin-subset woff2 — see the Caveat note above)
loadFont({
  family: "Patrick Hand",
  url: staticFile("fonts/PatrickHand.woff2"),
  weight: "400",
  display: "block",
}).catch(() => undefined);

// ── Type-system upgrade (2026-08-22, craft overhaul) — see docs/planning/
// CRAFT-AUDIT.md. Three new faces, all OFL, all self-hosted: ──

// Archivo (variable, wdth 62-125 / wght 100-900) — assertive expanded grotesk
// for display: hero titles, chapter cards, stat numerals. Use with CSS
// fontStretch (e.g. "125%") to reach the Expanded cuts.
loadFont({
  family: "Archivo",
  url: staticFile("fonts/Archivo.ttf"),
  weight: "100 900",
  display: "block",
}).catch((e) => console.error("FONTPROBE Archivo failed:", e));
// Static Expanded cuts instanced with fonttools (wdth 125) and registered as
// their own family — browser variable-axis clamping made fontStretch/
// fontVariationSettings unreliable at render, a static instance never is.
loadFont({
  family: "Archivo Expanded",
  url: staticFile("fonts/ArchivoExpanded-ExtraBold.ttf"),
  weight: "800",
  display: "block",
}).then(() => console.log("FONTPROBE Archivo Expanded OK"))
  .catch((e) => console.error("FONTPROBE Archivo Expanded failed:", e));
loadFont({
  family: "Archivo Expanded",
  url: staticFile("fonts/ArchivoExpanded-SemiBold.ttf"),
  weight: "600",
  display: "block",
}).catch(() => undefined);

// Spectral — editorial serif for pull-quotes, coda/reflective lines, and
// exhibit citations. The serif-against-grotesk contrast is what reads
// "documentary", not "template".
loadFont({
  family: "Spectral",
  url: staticFile("fonts/Spectral-Medium.ttf"),
  weight: "500",
  display: "block",
}).catch(() => undefined);
loadFont({
  family: "Spectral",
  url: staticFile("fonts/Spectral-MediumItalic.ttf"),
  weight: "500",
  style: "italic",
  display: "block",
}).catch(() => undefined);
loadFont({
  family: "Spectral",
  url: staticFile("fonts/Spectral-Bold.ttf"),
  weight: "700",
  display: "block",
}).catch(() => undefined);

// IBM Plex Mono — archival-technical labels (EXHIBIT tags, GET clocks, depth
// gauges, source citations). Replaces the system 'Courier New' fallback that
// shipped in early doc-engine episodes.
loadFont({
  family: "IBM Plex Mono",
  url: staticFile("fonts/IBMPlexMono-Medium.ttf"),
  weight: "500",
  display: "block",
}).catch(() => undefined);
loadFont({
  family: "IBM Plex Mono",
  url: staticFile("fonts/IBMPlexMono-SemiBold.ttf"),
  weight: "600",
  display: "block",
}).catch(() => undefined);
