/** Emotional tone → motion grammar. One lookup drives palette, camera,
 *  typography energy and cut speed so every scene "feels" its narration. */
import { EmotionalTone } from "./types";

export interface ToneStyle {
  bgA: string; bgB: string;          // gradient stops
  accent: string; accent2: string;   // emphasis / glow colors
  textGlow: string;
  cameraPushTo: number;              // end scale of the slow push
  punch: number;                     // punch-zoom strength on entrance
  shakeIntensity: number;            // 0 = stable
  wordStagger: number;               // frames between word reveals
  textVariant: "pop" | "slam" | "blur" | "wipe";
  grainOpacity: number;
}

export const TONES: Record<EmotionalTone, ToneStyle> = {
  shock: {
    bgA: "#12060F", bgB: "#03040A", accent: "#FF4D4D", accent2: "#FFD86B",
    textGlow: "rgba(255,77,77,0.55)", cameraPushTo: 1.16, punch: 0.24,
    shakeIntensity: 9, wordStagger: 3, textVariant: "slam", grainOpacity: 0.1,
  },
  fear: {
    bgA: "#070B18", bgB: "#020308", accent: "#8FB8FF", accent2: "#FF4D4D",
    textGlow: "rgba(80,120,255,0.4)", cameraPushTo: 1.2, punch: 0.1,
    shakeIntensity: 5, wordStagger: 4, textVariant: "blur", grainOpacity: 0.14,
  },
  curiosity: {
    bgA: "#0A1428", bgB: "#03060F", accent: "#36D4FF", accent2: "#27E0C3",
    textGlow: "rgba(54,212,255,0.45)", cameraPushTo: 1.12, punch: 0.08,
    shakeIntensity: 0, wordStagger: 4, textVariant: "wipe", grainOpacity: 0.08,
  },
  excitement: {
    bgA: "#161034", bgB: "#050612", accent: "#FFD86B", accent2: "#FF7A3C",
    textGlow: "rgba(255,216,107,0.5)", cameraPushTo: 1.14, punch: 0.2,
    shakeIntensity: 4, wordStagger: 2, textVariant: "pop", grainOpacity: 0.08,
  },
  confidence: {
    bgA: "#0A1428", bgB: "#050810", accent: "#EAF2FF", accent2: "#36D4FF",
    textGlow: "rgba(234,242,255,0.35)", cameraPushTo: 1.07, punch: 0.06,
    shakeIntensity: 0, wordStagger: 3, textVariant: "pop", grainOpacity: 0.06,
  },
  awe: {
    bgA: "#101038", bgB: "#03040E", accent: "#C09AFF", accent2: "#36D4FF",
    textGlow: "rgba(160,120,255,0.5)", cameraPushTo: 1.15, punch: 0.1,
    shakeIntensity: 0, wordStagger: 5, textVariant: "blur", grainOpacity: 0.1,
  },
};
