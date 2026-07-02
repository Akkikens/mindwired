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
