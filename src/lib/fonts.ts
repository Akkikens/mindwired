/** Real, self-hosted typography, registered once at module-eval so every
 *  composition renders with the channel faces. */
import { staticFile } from "remotion";

type FontSpec = {
  family: string;
  url: string;
  weight?: string;
  style?: string;
  display?: FontDisplay;
};

/**
 * CSS-only font registration — deliberately NOT `loadFont` from
 * `@remotion/fonts` (2026-09-10).
 *
 * WHY: `loadFont` opens a `delayRender()` handle and clears it only when
 * `FontFace.load()` settles. In headless Chrome that promise intermittently
 * NEVER settles, so the handle is never cleared and the entire render dies with
 * "A delayRender() was called but not cleared after Nms" at a random frame.
 *
 * Measured, not guessed:
 *   - 6 consecutive local renders died this way (frames 287, 818, 895, 1633 …),
 *     at 4K and 1080p, at concurrency 1 and 3.
 *   - Raising --timeout does not help: the promise never settles at all.
 *   - A setTimeout fallback does NOT work — Remotion controls timers in the
 *     render environment, so the timer never fires. Do not reintroduce one.
 *   - Inlining the font as a base64 data URI does NOT help either: the hang is
 *     in the FontFace promise, not the network.
 *   - CHUNKED=1 (scripts/render_gce.sh) does NOT fix it. It makes it worse —
 *     every chunk spawns a fresh Chrome that re-runs this module, so a 121-chunk
 *     render gets 121 rolls of the dice. A GCE run died with three separate
 *     chunks each failing all 6 retries.
 *   - With this CSS path, a local 4K render passed frame 5000+ with zero font
 *     errors, having never previously survived past 1700.
 *
 * A plain `@font-face` rule needs no delayRender and no FontFace promise, so
 * there is nothing left to hang. `font-display: block` keeps the normal
 * block-period behaviour, so text still does not flash in a fallback face.
 */
const injectFontFace = ({ family, url, weight, style }: FontSpec) => {
  if (typeof document === "undefined") return;
  const format = url.includes("woff2") ? "woff2" : "truetype";
  const el = document.createElement("style");
  el.textContent = `@font-face{font-family:'${family}';src:url('${url}') format('${format}');font-weight:${weight ?? "400"};font-style:${style ?? "normal"};font-display:block;}`;
  document.head.appendChild(el);
};

// Space Grotesk — distinctive techy grotesque for display / headlines / stats.
injectFontFace({
  family: "Space Grotesk",
  url: staticFile("fonts/SpaceGrotesk.ttf"),
  weight: "300 700",
  display: "block",
});

// Inter — maximally legible humanist sans for captions / labels / body.
injectFontFace({
  family: "Inter",
  url: staticFile("fonts/Inter.ttf"),
  weight: "100 900",
  display: "block",
});

// Noto Sans Devanagari — crisp Hindi (Devanagari) text for the DimaagBatti channel.
injectFontFace({
  family: "Noto Sans Devanagari",
  url: staticFile("fonts/NotoSansDevanagari.ttf"),
  weight: "100 900",
  display: "block",
});

// Caveat — expressive handwritten script for the sketch/illustrated brand look
// (marker captions, annotations). OFL-licensed, self-hosted. Static woff2
// instances — the variable [wght] TTF failed to resolve at render (serif
// fallback in stills), the instantiated cuts load reliably.
injectFontFace({
  family: "Caveat",
  url: staticFile("fonts/Caveat400.woff2"),
  weight: "400",
  display: "block",
});
injectFontFace({
  family: "Caveat",
  url: staticFile("fonts/Caveat700.woff2"),
  weight: "700",
  display: "block",
});

// Patrick Hand — legible handwriting for longer sketch-scene labels. OFL.
// (latin-subset woff2 — see the Caveat note above)
injectFontFace({
  family: "Patrick Hand",
  url: staticFile("fonts/PatrickHand.woff2"),
  weight: "400",
  display: "block",
});

// ── Type-system upgrade (2026-08-22, craft overhaul) — see docs/planning/
// CRAFT-AUDIT.md. Three new faces, all OFL, all self-hosted: ──

// Archivo (variable, wdth 62-125 / wght 100-900) — assertive expanded grotesk
// for display: hero titles, chapter cards, stat numerals. Use with CSS
// fontStretch (e.g. "125%") to reach the Expanded cuts.
injectFontFace({
  family: "Archivo",
  url: staticFile("fonts/Archivo.ttf"),
  weight: "100 900",
  display: "block",
});
// Static Expanded cuts instanced with fonttools (wdth 125) and registered as
// their own family — browser variable-axis clamping made fontStretch/
// fontVariationSettings unreliable at render, a static instance never is.
injectFontFace({
  family: "Archivo Expanded",
  url: staticFile("fonts/ArchivoExpanded-ExtraBold.ttf"),
  weight: "800",
  display: "block",
});
injectFontFace({
  family: "Archivo Expanded",
  url: staticFile("fonts/ArchivoExpanded-SemiBold.ttf"),
  weight: "600",
  display: "block",
});

// Spectral — editorial serif for pull-quotes, coda/reflective lines, and
// exhibit citations. The serif-against-grotesk contrast is what reads
// "documentary", not "template".
injectFontFace({
  family: "Spectral",
  url: staticFile("fonts/Spectral-Medium.ttf"),
  weight: "500",
  display: "block",
});
injectFontFace({
  family: "Spectral",
  url: staticFile("fonts/Spectral-MediumItalic.ttf"),
  weight: "500",
  style: "italic",
  display: "block",
});
injectFontFace({
  family: "Spectral",
  url: staticFile("fonts/Spectral-Bold.ttf"),
  weight: "700",
  display: "block",
});

// IBM Plex Mono — archival-technical labels (EXHIBIT tags, GET clocks, depth
// gauges, source citations). Replaces the system 'Courier New' fallback that
// shipped in early doc-engine episodes.
injectFontFace({
  family: "IBM Plex Mono",
  url: staticFile("fonts/IBMPlexMono-Medium.ttf"),
  weight: "500",
  display: "block",
});
injectFontFace({
  family: "IBM Plex Mono",
  url: staticFile("fonts/IBMPlexMono-SemiBold.ttf"),
  weight: "600",
  display: "block",
});
