/** codewired podcast engine — two-host dialogue timeline builder.
 *  A "turn" is one continuous line from one speaker. Timeline packs turns
 *  back-to-back (no artificial beat/tail gaps — podcast pacing is conversational,
 *  not documentary-cold-open pacing) using real per-clip durations from the
 *  VO manifest, same pattern as lib/manifest.ts. */
import podcastManifest from "../../../public/codewired/podcast/audio/manifest.json";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type Speaker = "A" | "B";

export interface Word { word: string; start: number; end: number }
export interface Clip { dur: number; words: Word[]; speaker: Speaker }

const clips = (podcastManifest as { clips: Record<string, Clip> }).clips;
export const clipDur = (id: string): number => clips[id]?.dur ?? 0;
export const clipWords = (id: string): Word[] => clips[id]?.words ?? [];
export const clipSpeaker = (id: string): Speaker => clips[id]?.speaker ?? "A";

export interface TurnDef {
  id: string;
  speaker: Speaker;
  text: string;
  /** chapter card shown just before this turn starts a new segment ("" = none) */
  chapter?: string;
  /** seconds of silent beat before this turn (segment breaks only; default 0) */
  gap?: number;
}

export interface TurnPlacement extends TurnDef {
  from: number;
  durationInFrames: number;
}

export function buildPodcastTimeline(turns: TurnDef[]): TurnPlacement[] {
  const out: TurnPlacement[] = [];
  let cursor = 0;
  for (const t of turns) {
    if (t.gap) cursor += F(t.gap);
    const dur = F(clipDur(t.id)) + F(0.35); // small conversational breath between turns
    out.push({ ...t, from: cursor, durationInFrames: dur });
    cursor += dur;
  }
  return out;
}

export function podcastTotalFrames(turns: TurnDef[], outroFrames = 0): number {
  const timeline = buildPodcastTimeline(turns);
  const last = timeline[timeline.length - 1];
  return (last ? last.from + last.durationInFrames : 0) + outroFrames;
}
