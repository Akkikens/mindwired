/** Named cinematic camera moves — a Higgsfield-style motion grammar.
 *  Each move is a pure (frame, dur) → CamState curve; a scene can layer a few
 *  (they compose: scales multiply, translate/rot sum) for compound motion.
 *  The SAME move names map to prompt phrases (movePrompt) so externally
 *  generated footage (Veo/Kling/Higgsfield) is asked for the same move the
 *  code applies — one vocabulary across the whole pipeline. */
import { Easing, interpolate } from "remotion";
import { CameraMove } from "./types";

export interface CamState { scale: number; x: number; y: number; rot: number }

const IDENT: CamState = { scale: 1, x: 0, y: 0, rot: 0 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeInOut = Easing.inOut(Easing.cubic);
const easeOut = Easing.out(Easing.cubic);

/** One move's transform at `frame` within a scene of `dur` frames. */
export function cameraMove(move: CameraMove, frame: number, dur: number): CamState {
  const p = dur > 0 ? frame / dur : 0; // 0..1 progress
  switch (move) {
    case "static":
      return IDENT;
    case "push":
      return { ...IDENT, scale: interpolate(frame, [0, dur], [1.03, 1.12], { ...clamp, easing: easeInOut }) };
    case "pull":
      return { ...IDENT, scale: interpolate(frame, [0, dur], [1.14, 1.0], { ...clamp, easing: easeInOut }) };
    case "dolly-in":
      return { ...IDENT, scale: interpolate(frame, [0, dur], [1.0, 1.11], { ...clamp, easing: Easing.linear }) };
    case "crash-zoom": {
      // fast punch in the first ~10 frames, settle back and keep a slow creep
      const scale = interpolate(frame, [0, 9, dur], [1.0, 1.2, 1.08], { ...clamp, easing: easeOut });
      return { ...IDENT, scale };
    }
    case "orbit": {
      // slow rotational arc + lateral drift + a touch of push — reads as an
      // orbital move without real 3D
      const a = p * Math.PI; // half a slow sweep across the scene
      return {
        scale: interpolate(frame, [0, dur], [1.06, 1.1], { ...clamp, easing: easeInOut }),
        x: Math.sin(a) * 26,
        y: Math.cos(a) * 10,
        rot: Math.sin(a) * 1.2,
      };
    }
    case "dutch": {
      // canted frame that slowly rolls level — unease that resolves
      const scale = interpolate(frame, [0, dur], [1.05, 1.1], { ...clamp, easing: easeInOut });
      const rot = interpolate(frame, [0, dur], [-4.5, -2.0], { ...clamp, easing: easeInOut });
      return { ...IDENT, scale, rot };
    }
    case "handheld": {
      // organic low-amplitude sway; deterministic (no Math.random)
      return {
        scale: interpolate(frame, [0, dur], [1.04, 1.09], { ...clamp, easing: easeInOut }),
        x: Math.sin(frame * 0.13) * 5 + Math.sin(frame * 0.061) * 3,
        y: Math.cos(frame * 0.11) * 4 + Math.cos(frame * 0.053) * 2,
        rot: Math.sin(frame * 0.07) * 0.5,
      };
    }
    default:
      return IDENT;
  }
}

/** Compose a stack of moves into one transform (scales multiply, rest sum). */
export function composeMoves(moves: CameraMove[], frame: number, dur: number): CamState {
  return moves.reduce<CamState>((acc, m) => {
    const s = cameraMove(m, frame, dur);
    return { scale: acc.scale * s.scale, x: acc.x + s.x, y: acc.y + s.y, rot: acc.rot + s.rot };
  }, { ...IDENT });
}

/** Normalize the plan's camera field (single | array | undefined) to a stack.
 *  `fallback` is the tone's default move. */
export function resolveMoves(camera: CameraMove | CameraMove[] | undefined, fallback: CameraMove): CameraMove[] {
  if (!camera) return [fallback];
  return Array.isArray(camera) ? (camera.length ? camera : [fallback]) : [camera];
}

/** Prompt phrase for an external text-to-video model — keeps generated footage
 *  moving the same way the code moves. Import this in a prompt builder so a
 *  scene's `camera` drives both the Remotion rig AND the Veo/Kling shot. */
export const MOVE_PROMPT: Record<CameraMove, string> = {
  push: "slow cinematic dolly push-in, steady",
  pull: "slow dolly pull-back reveal",
  "dolly-in": "smooth steady dolly-in, tracking forward",
  "crash-zoom": "fast crash zoom in, snap then settle",
  orbit: "slow 180-degree orbital arc around the subject",
  dutch: "canted dutch angle slowly rolling level",
  handheld: "subtle handheld sway, documentary realism",
  static: "locked-off static tripod shot",
};

/** Build the camera clause for a T2V prompt from a scene's camera field. */
export function movePrompt(camera: CameraMove | CameraMove[] | undefined, fallback: CameraMove): string {
  return resolveMoves(camera, fallback).map((m) => MOVE_PROMPT[m]).join(", ");
}
