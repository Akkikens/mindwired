/** Timeline for "How GTA 6's Weather Tech Got This Insane" — synthwave scenes
 *  paced by the audio manifest, with a title-beat before each section. */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type SceneId =
  | "hook" | "leonida" | "from_static" | "the_storm" | "the_flood"
  | "the_hurricane" | "living_world" | "the_cost" | "outro";

export interface SceneDef { id: SceneId; chapter: string; title: string; beat: number; tail: number; }

export const SCENES: SceneDef[] = [
  { id: "hook",          chapter: "",                               title: "",                      beat: 3,  tail: 2.5 },
  { id: "leonida",       chapter: "01 · Leonida",                   title: "HURRICANE\nCOUNTRY",    beat: 6,  tail: 2.5 },
  { id: "from_static",   chapter: "02 · A Living Atmosphere",       title: "A LIVING\nATMOSPHERE",  beat: 6,  tail: 2.5 },
  { id: "the_storm",     chapter: "03 · When The Storm Hits",       title: "WHEN THE\nSTORM HITS",  beat: 6,  tail: 2.5 },
  { id: "the_flood",     chapter: "04 · The Streets Flood",         title: "THE STREETS\nFLOOD",    beat: 6,  tail: 2.5 },
  { id: "the_hurricane", chapter: "05 · The Hurricane",             title: "THE\nHURRICANE",        beat: 6,  tail: 2.5 },
  { id: "living_world",  chapter: "06 · A Living World",            title: "A LIVING\nWORLD",       beat: 6,  tail: 2.5 },
  { id: "the_cost",      chapter: "07 · The Brutal Cost",           title: "THE BRUTAL\nCOST",      beat: 6,  tail: 2.5 },
  { id: "outro",         chapter: "",                               title: "",                      beat: 3,  tail: 5 },
];

export interface ScenePlacement extends SceneDef { from: number; durationInFrames: number; narrationStart: number; }

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

export function gtaviTotalFrames(): number {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
}

export interface MusicCue { clip: string; sceneFrom: SceneId; volume: number; }
// Bed kept well under the narration (Brian VO plays at 1.0).
export const MUSIC: MusicCue[] = [
  { clip: "music_open",  sceneFrom: "hook",          volume: 0.16 },
  { clip: "music_build", sceneFrom: "from_static",   volume: 0.15 },
  { clip: "music_storm", sceneFrom: "the_storm",     volume: 0.18 },
  { clip: "music_awe",   sceneFrom: "living_world",  volume: 0.16 },
  { clip: "music_outro", sceneFrom: "outro",         volume: 0.16 },
];
