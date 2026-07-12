/** Shot-recipe presets — Higgsfield's "themed pack" idea in code. One `recipe`
 *  id on a scene bundles a complete cinematic identity: a camera move (stack),
 *  a suggested emotional tone (→ palette + grade + pacing), and a suggested
 *  out-transition. Explicit per-scene fields always win over the recipe.
 *
 *  The same recipe id also yields a text-to-video prompt clause (recipePrompt),
 *  so when you generate external footage (Veo/Kling/Higgsfield) for that scene
 *  you ask for the SAME move the code applies — one vocabulary end to end.
 *
 *  This is the fix for CLAUDE.md's "never cycle the same 3 generic scenes":
 *  reach for a named recipe per beat instead of hand-tuning camera + tone. */
import { CameraMove, EmotionalTone, PlanScene, TransitionKind } from "./types";
import { movePrompt } from "./camera";

export interface ShotRecipe {
  camera: CameraMove | CameraMove[];
  /** suggested tone — fills the scene's tone only if it hasn't set one */
  tone?: EmotionalTone;
  /** suggested out-transition */
  transitionOut?: TransitionKind;
  /** extra prompt flavor appended to the camera clause for external T2V */
  lens?: string;
  note: string;
}

export const RECIPES: Record<string, ShotRecipe> = {
  // deep-space reveals — the mindwired signature
  "cosmic-reveal": {
    camera: ["dolly-in"], tone: "awe", transitionOut: "dissolve",
    lens: "anamorphic 40mm, deep-space volumetric light, IMAX",
    note: "slow drive into a deep-space vista; awe builds",
  },
  "orbital-awe": {
    camera: ["orbit"], tone: "awe", transitionOut: "dissolve",
    lens: "long lens, slow orbital arc, planetary scale",
    note: "orbit a massive object; overwhelming scale",
  },
  "pull-back-lonely": {
    camera: ["pull"], tone: "fear", transitionOut: "dissolve",
    lens: "wide, receding into black, single warm point of light",
    note: "pull back until the subject is a lonely speck",
  },
  // shock / reveals
  "shock-slam": {
    camera: "crash-zoom", tone: "shock", transitionOut: "flash",
    lens: "fast crash zoom, high contrast, hard key light",
    note: "snap onto the shocking subject; flash out",
  },
  "reveal-crash": {
    camera: ["crash-zoom", "handheld"], tone: "shock", transitionOut: "whip",
    lens: "handheld crash zoom, documentary grain",
    note: "urgent handheld snap-in on a reveal",
  },
  // tension / unease
  "handheld-tension": {
    camera: ["handheld"], tone: "fear", transitionOut: "cut",
    lens: "handheld, shallow focus, cold rim light",
    note: "organic sway, dread between beats",
  },
  "dutch-unease": {
    camera: ["dutch"], tone: "fear", transitionOut: "dissolve",
    lens: "canted dutch angle, slow roll, unsettling",
    note: "tilted frame that slowly rights itself",
  },
  // clean informational beats
  "clean-quote": {
    camera: "static", tone: "confidence", transitionOut: "dissolve",
    lens: "locked-off, clean, negative space",
    note: "still frame for an attributed line",
  },
  "data-drive": {
    camera: ["push"], tone: "curiosity", transitionOut: "whip",
    lens: "steady push, crisp studio light",
    note: "push into a stat/comparison; whip to the next",
  },
};

export const RECIPE_IDS = Object.keys(RECIPES);

/** Fill a scene's optional cinematic fields from its recipe (explicit wins). */
export function applyRecipe(s: PlanScene): PlanScene {
  if (!s.recipe) return s;
  const r = RECIPES[s.recipe];
  if (!r) return s; // unknown id → leave scene untouched (author sees no camera move)
  return {
    ...s,
    camera: s.camera ?? r.camera,
    // emotionalTone/transitionOut are required on PlanScene, so authors always
    // set them; the recipe's tone/transitionOut act as documentation + the
    // basis for recipePrompt. We only fill camera, the genuinely-optional field.
  };
}

/** Full text-to-video prompt clause for a recipe: camera move phrase + lens
 *  flavor. Feed this into a Veo/Kling/Higgsfield prompt so generated footage
 *  moves the way the code will. */
export function recipePrompt(recipeId: string): string {
  const r = RECIPES[recipeId];
  if (!r) return "";
  const move = movePrompt(r.camera, "push");
  return r.lens ? `${move}, ${r.lens}` : move;
}
