/** Timeline for "The Scariest Places In The Universe" — a ranked countdown (8 → 1),
 *  one scene per narration clip, with a cinematic title-beat before each section so
 *  the visuals breathe (~11 min). */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type SceneId =
  | "hook" | "rogue" | "magnetar" | "sag_a" | "quasar"
  | "great_attractor" | "ton618" | "bootes" | "vacuum" | "outro";

export interface SceneDef {
  id: SceneId;
  chapter: string;
  title: string;
  beat: number;   // seconds of establishing visual + title before narration
  tail: number;   // seconds held after narration
}

export const SCENES: SceneDef[] = [
  { id: "hook",            chapter: "",                       title: "",                       beat: 3.5, tail: 2.5 },
  { id: "rogue",           chapter: "No. 8 · Rogue Planets",  title: "THE WANDERING\nWORLDS",   beat: 6.5, tail: 2.5 },
  { id: "magnetar",        chapter: "No. 7 · The Magnetar",   title: "THE\nMAGNETAR",           beat: 6.5, tail: 2.5 },
  { id: "sag_a",           chapter: "No. 6 · Sagittarius A*", title: "THE MONSTER\nNEXT DOOR",  beat: 7,   tail: 2.5 },
  { id: "quasar",          chapter: "No. 5 · Quasars",        title: "THE\nQUASARS",            beat: 6.5, tail: 2.5 },
  { id: "great_attractor", chapter: "No. 4 · The Great Attractor", title: "THE GREAT\nATTRACTOR", beat: 7, tail: 2.5 },
  { id: "ton618",          chapter: "No. 3 · TON 618",        title: "TON 618",                 beat: 7,   tail: 2.5 },
  { id: "bootes",          chapter: "No. 2 · The Boötes Void", title: "THE GREAT\nNOTHING",     beat: 7,   tail: 2.5 },
  { id: "vacuum",          chapter: "No. 1 · The False Vacuum", title: "THE\nFALSE VACUUM",     beat: 7,   tail: 3.5 },
  { id: "outro",           chapter: "",                       title: "",                       beat: 3,   tail: 4 },
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

export function scariestTotalFrames(): number {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
}

export interface MusicCue { clip: string; sceneFrom: SceneId; volume: number; }
export const MUSIC: MusicCue[] = [
  { clip: "music_open",    sceneFrom: "hook",            volume: 0.5 },
  { clip: "music_creep",   sceneFrom: "rogue",           volume: 0.46 },
  { clip: "music_monster", sceneFrom: "sag_a",           volume: 0.5 },
  { clip: "music_void",    sceneFrom: "bootes",          volume: 0.5 },
  { clip: "music_terror",  sceneFrom: "vacuum",          volume: 0.52 },
];
