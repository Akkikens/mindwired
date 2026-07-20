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
