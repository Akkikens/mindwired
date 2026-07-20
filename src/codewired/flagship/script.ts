/** Timeline for codewired #4 FLAGSHIP — "I Built My Own Claude Code From Scratch". */
import manifestJson from "../../../public/codewired/flagship/audio/manifest.json";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

const clips = (manifestJson as { clips: Record<string, { dur: number }> }).clips;
export const clipDur = (id: string): number => clips[id]?.dur ?? 0;

export type SceneId =
  | "hook" | "intro" | "title"
  | "map" | "loop1" | "loop2" | "tools" | "permissions" | "context"
  | "checkpoint" | "sdk" | "build" | "run1" | "run2" | "upgrades"
  | "reveal" | "outro" | "subscribe";

export interface SceneDef {
  id: SceneId; chapter: string; title: string;
  beat: number; tail: number; silent?: boolean; fixed?: number;
}

export const SCENES: SceneDef[] = [
  { id: "hook",        chapter: "", title: "", beat: 1.2, tail: 0.8 },
  { id: "intro",       chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 2.6 },
  { id: "title",       chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 4.0 },
  { id: "map",         chapter: "THE BUILD PLAN", title: "ONE SKELETON.\nFOUR PARTS.",  beat: 3.2, tail: 1.2 },
  { id: "loop1",       chapter: "PART 01", title: "THE\nHEARTBEAT",       beat: 3.2, tail: 1.2 },
  { id: "loop2",       chapter: "", title: "", beat: 1.2, tail: 1.2 },
  { id: "tools",       chapter: "PART 02", title: "THE\nHANDS",           beat: 3.2, tail: 1.2 },
  { id: "permissions", chapter: "PART 03", title: "THE\nGATE",            beat: 3.2, tail: 1.2 },
  { id: "context",     chapter: "PART 04", title: "THE\nMEMORY",          beat: 3.2, tail: 1.2 },
  { id: "checkpoint",  chapter: "", title: "", beat: 1.2, tail: 1.4 },
  { id: "sdk",         chapter: "THE CHEAT CODE", title: "CLAUDE CODE,\nAS A LIBRARY", beat: 3.2, tail: 1.2 },
  { id: "build",       chapter: "THE BUILD", title: "MEET\nWIRED",        beat: 3.2, tail: 1.2 },
  { id: "run1",        chapter: "", title: "", beat: 1.2, tail: 1.0 },
  { id: "run2",        chapter: "", title: "", beat: 1.0, tail: 1.4 },
  { id: "upgrades",    chapter: "FINAL ASSEMBLY", title: "BRAINS. HANDS.\nCRAFTS.", beat: 3.2, tail: 1.2 },
  { id: "reveal",      chapter: "", title: "", beat: 1.6, tail: 1.6 },
  { id: "outro",       chapter: "", title: "", beat: 1.0, tail: 1.0 },
  { id: "subscribe",   chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 7.0 },
];

export interface ScenePlacement extends SceneDef {
  from: number; durationInFrames: number; narrationStart: number;
}

export function buildTimeline(): ScenePlacement[] {
  const out: ScenePlacement[] = [];
  let cursor = 0;
  for (const sc of SCENES) {
    const dur = sc.silent ? F(sc.fixed ?? 3) : F(sc.beat) + F(clipDur(sc.id)) + F(sc.tail);
    out.push({ ...sc, from: cursor, durationInFrames: dur, narrationStart: F(sc.beat) });
    cursor += dur;
  }
  return out;
}

export const flagshipTotalFrames = (): number => {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
};
