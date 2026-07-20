/** Word-timing manifest helpers for codewired/subagents (Cartesia VO). */
import manifestJson from "../../../public/codewired/subagents/audio/manifest.json";

export interface Word { word: string; start: number; end: number }
export interface Clip { kind: string; dur: number; words: Word[] }

const clips = (manifestJson as { clips: Record<string, Clip> }).clips;

export const clipDur = (id: string): number => clips[id]?.dur ?? 0;
export const clipWords = (id: string): Word[] => clips[id]?.words ?? [];
