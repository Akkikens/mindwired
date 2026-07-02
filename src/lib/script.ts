/**
 * Timeline for "What Happens To Lost Astronaut Equipment Floating Forever In
 * Earth's High Orbit". One scene per narration clip, paced by the audio manifest.
 */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export const LEAD_IN = 2.0;   // cold-open visual + title before hook narration
export const TAIL = 1.6;      // hold after final narration word
const GAP = 0.45;             // breath between scenes

export type SceneId =
  | "hook" | "s1_launch" | "s2_shredder" | "s3_ballistic"
  | "s4_graveyard" | "s5_legacy" | "outro";

export interface SceneDef {
  id: SceneId;
  narration: string;     // manifest clip id (same as id here)
  chapter: string;       // on-screen section label
  title: string;         // big title reveal
}

export const SCENES: SceneDef[] = [
  { id: "hook",        narration: "hook",        chapter: "",                   title: "" },
  { id: "s1_launch",   narration: "s1_launch",   chapter: "01 · The Accidental Launch", title: "THE ACCIDENTAL LAUNCH" },
  { id: "s2_shredder", narration: "s2_shredder", chapter: "02 · The Invisible Shredder", title: "THE INVISIBLE SHREDDER" },
  { id: "s3_ballistic",narration: "s3_ballistic",chapter: "03 · Ballistic Evolution",   title: "BALLISTIC EVOLUTION" },
  { id: "s4_graveyard",narration: "s4_graveyard",chapter: "04 · The Graveyard Geometry", title: "THE GRAVEYARD GEOMETRY" },
  { id: "s5_legacy",   narration: "s5_legacy",   chapter: "05 · The Lasting Legacy",    title: "THE LASTING LEGACY" },
  { id: "outro",       narration: "outro",       chapter: "",                   title: "" },
];

export interface ScenePlacement extends SceneDef {
  from: number;             // start frame
  durationInFrames: number; // includes the lead-in for the hook
  narrationStart: number;   // frame (relative to scene) where narration audio begins
}

export function buildTimeline(): ScenePlacement[] {
  const out: ScenePlacement[] = [];
  let cursor = 0;
  SCENES.forEach((sc, i) => {
    const isHook = i === 0;
    const lead = isHook ? LEAD_IN : 0;
    const tail = i === SCENES.length - 1 ? TAIL : GAP;
    const dur = F(lead) + F(clipDur(sc.narration)) + F(tail);
    out.push({
      ...sc,
      from: cursor,
      durationInFrames: dur,
      narrationStart: F(lead),
    });
    cursor += dur;
  });
  return out;
}

export function totalFrames(): number {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
}

/** Music beds (absolute timeline), chosen by mood, gently cross-faded in Video.tsx. */
export interface MusicCue { clip: string; sceneFrom: SceneId; volume: number; }
export const MUSIC: MusicCue[] = [
  { clip: "music_open",    sceneFrom: "hook",        volume: 0.5 },
  { clip: "music_tension", sceneFrom: "s2_shredder", volume: 0.46 },
  { clip: "music_awe",     sceneFrom: "s4_graveyard",volume: 0.5 },
  { clip: "music_outro",   sceneFrom: "outro",       volume: 0.5 },
];
