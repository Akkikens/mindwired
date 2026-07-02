/** Timeline for "The Great Attractor" — one scene per narration clip, with a
 *  cinematic title-beat before each section so the visuals breathe (~13 min). */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type SceneId =
  | "hook" | "first_clue" | "tug_of_war" | "zone" | "scale"
  | "repeller" | "laniakea" | "shapley" | "destination" | "outro";

export interface SceneDef {
  id: SceneId;
  chapter: string;
  title: string;
  beat: number;   // seconds of establishing visual + title before narration
  tail: number;   // seconds held after narration
}

export const SCENES: SceneDef[] = [
  { id: "hook",        chapter: "",                              title: "",                       beat: 3.5, tail: 3 },
  { id: "first_clue",  chapter: "01 · The Cosmic Speedometer",   title: "THE COSMIC\nSPEEDOMETER", beat: 7,   tail: 3 },
  { id: "tug_of_war",  chapter: "02 · The Universal Tug Of War", title: "THE UNIVERSAL\nTUG OF WAR", beat: 7, tail: 3 },
  { id: "zone",        chapter: "03 · Into The Zone Of Avoidance", title: "THE ZONE OF\nAVOIDANCE", beat: 7, tail: 3 },
  { id: "scale",       chapter: "04 · The Scale Of The Monster", title: "THE SCALE OF\nTHE MONSTER", beat: 8, tail: 3 },
  { id: "repeller",    chapter: "05 · The Dipole Repeller",      title: "THE DIPOLE\nREPELLER",   beat: 7,   tail: 3 },
  { id: "laniakea",    chapter: "06 · Laniakea",                 title: "LANIAKEA",               beat: 8,   tail: 3 },
  { id: "shapley",     chapter: "07 · The Bigger Giant",         title: "THE BIGGER\nGIANT",      beat: 7,   tail: 3 },
  { id: "destination", chapter: "08 · Will We Ever Arrive?",     title: "WILL WE EVER\nARRIVE?",  beat: 7,   tail: 3 },
  { id: "outro",       chapter: "",                              title: "",                       beat: 3,   tail: 5 },
];

export interface ScenePlacement extends SceneDef {
  from: number;
  durationInFrames: number;
  narrationStart: number;
}

export function buildTimeline(): ScenePlacement[] {
  const out: ScenePlacement[] = [];
  let cursor = 0;
  for (const sc of SCENES) {
    const dur = F(sc.beat) + F(clipDur(sc.id)) + F(sc.tail);
    out.push({ ...sc, from: cursor, durationInFrames: dur, narrationStart: F(sc.beat) });
    cursor += dur;
  }
  return out;
}

export function attractorTotalFrames(): number {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
}

export interface MusicCue { clip: string; sceneFrom: SceneId; volume: number; }
export const MUSIC: MusicCue[] = [
  { clip: "music_open",    sceneFrom: "hook",        volume: 0.5 },
  { clip: "music_build",   sceneFrom: "tug_of_war",  volume: 0.46 },
  { clip: "music_vast",    sceneFrom: "scale",       volume: 0.5 },
  { clip: "music_dread",   sceneFrom: "repeller",    volume: 0.48 },
  { clip: "music_resolve", sceneFrom: "destination", volume: 0.5 },
];
