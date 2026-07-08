/** Timeline for "A Rogue Planet Enters Our Solar System… Then Earth Changes
 *  Forever." A cinematic escalation across 8 numbered phases (a countdown to
 *  catastrophe), one scene per narration clip, with a cinematic title-beat before
 *  each phase so the visuals breathe (~8 min). Mirrors src/scariest/lib/script.ts,
 *  with support for SILENT beats (the wordmark intro + title card) that carry a
 *  fixed duration and no narration audio. */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type SceneId =
  | "hook" | "intro" | "title" | "gravity" | "whatis" | "invisible" | "neptune"
  | "freezer" | "comet" | "orbit" | "worstcase" | "frozen" | "ending" | "outro";

export interface SceneDef {
  id: SceneId;
  chapter: string;
  title: string;
  beat: number;    // seconds of establishing visual + title before narration
  tail: number;    // seconds held after narration
  silent?: boolean; // no narration clip (wordmark intro / title card)
  fixed?: number;   // total seconds for a silent beat
}

export const SCENES: SceneDef[] = [
  // ── 0-10s teaser cold open → wordmark → title (channel long-form convention) ──
  { id: "hook",      chapter: "",                          title: "",                       beat: 2.5, tail: 2.0 },
  { id: "intro",     chapter: "",                          title: "",                       beat: 0,   tail: 0, silent: true, fixed: 3.0 },
  { id: "title",     chapter: "",                          title: "",                       beat: 0,   tail: 0, silent: true, fixed: 4.5 },
  // ── the thesis punch (no chapter card — a held breath) ──
  { id: "gravity",   chapter: "",                          title: "",                       beat: 2.0, tail: 2.5 },
  // ── 8 escalating phases ──
  { id: "whatis",    chapter: "PHASE 01 · WHAT IT IS",     title: "A FRAGILE\nBALANCE",     beat: 5.0, tail: 2.0 },
  { id: "invisible", chapter: "PHASE 02 · WHY WE'RE BLIND",title: "A STAR\nTHAT FLICKERS",  beat: 5.0, tail: 2.0 },
  { id: "neptune",   chapter: "PHASE 03 · THE FIRST SIGNS",title: "NEPTUNE\nMOVES FIRST",   beat: 5.0, tail: 2.0 },
  { id: "freezer",   chapter: "PHASE 04 · THE OUTER SYSTEM",title:"THE FROZEN\nRESERVOIR",  beat: 5.0, tail: 2.0 },
  { id: "comet",     chapter: "PHASE 05 · THE COMET STORM",title: "THE COMETS\nWAKE UP",    beat: 5.0, tail: 2.0 },
  { id: "orbit",     chapter: "PHASE 06 · EARTH'S ORBIT",  title: "EARTH'S ORBIT\nBREAKS",  beat: 5.0, tail: 2.0 },
  { id: "worstcase", chapter: "PHASE 07 · THE WORST CASE", title: "THROWN INTO\nTHE DARK",  beat: 5.0, tail: 2.0 },
  { id: "frozen",    chapter: "PHASE 08 · THE ENDING",     title: "A WANDERING\nWORLD",     beat: 5.0, tail: 2.0 },
  // ── haunting close + subscribe CTA ──
  { id: "ending",    chapter: "",                          title: "",                       beat: 2.5, tail: 3.0 },
  { id: "outro",     chapter: "",                          title: "",                       beat: 1.5, tail: 3.5 },
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
    const dur = sc.silent
      ? F(sc.fixed ?? 3)
      : F(sc.beat) + F(clipDur(sc.id)) + F(sc.tail);
    out.push({ ...sc, from: cursor, durationInFrames: dur, narrationStart: F(sc.beat) });
    cursor += dur;
  }
  return out;
}

export function rogueTotalFrames(): number {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
}

/** Music beds, cued to the start of a scene and bounded to the next cue. */
export interface MusicCue { clip: string; sceneFrom: SceneId; volume: number; }
export const MUSIC: MusicCue[] = [
  { clip: "music_open",  sceneFrom: "hook",      volume: 0.5 },
  { clip: "music_dread", sceneFrom: "whatis",    volume: 0.46 },
  { clip: "music_signs", sceneFrom: "neptune",   volume: 0.48 },
  { clip: "music_storm", sceneFrom: "comet",     volume: 0.5 },
  { clip: "music_end",   sceneFrom: "worstcase", volume: 0.52 },
];

/** One-shot sound-design hits, cued to a scene + an offset (seconds into the
 *  scene, i.e. relative to its `from`). See public/rogueplanet/audio/sfx/.
 *  Replace the synthesized placeholders with real SFX any time — the cues stay. */
export interface SfxCue { clip: string; sceneFrom: SceneId; atSec: number; volume: number; }
export const SFX: SfxCue[] = [
  // bass hit when the rogue planet crosses into the solar-system map
  { clip: "bass_hit",    sceneFrom: "gravity",   atSec: 2.2, volume: 0.9 },
  // glass crack as Earth's orbit line stretches
  { clip: "glass_crack", sceneFrom: "orbit",     atSec: 6.0, volume: 0.7 },
  // massive low boom at "Earth could be thrown away from the Sun entirely"
  { clip: "boom",        sceneFrom: "worstcase", atSec: 5.0, volume: 1.0 },
];
