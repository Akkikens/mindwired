/** Timeline for codewired #3 — "Claude Skills, Finally Explained". */
import manifestJson from "../../../public/codewired/skills/audio/manifest.json";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

const clips = (manifestJson as { clips: Record<string, { dur: number }> }).clips;
export const clipDur = (id: string): number => clips[id]?.dur ?? 0;

export type SceneId =
  | "hook" | "intro" | "title"
  | "problem" | "whatis" | "trigger" | "anatomy" | "build" | "everywhere"
  | "bigpicture" | "danger" | "outro" | "subscribe";

export interface SceneDef {
  id: SceneId; chapter: string; title: string;
  beat: number; tail: number; silent?: boolean; fixed?: number;
}

export const SCENES: SceneDef[] = [
  { id: "hook",       chapter: "", title: "", beat: 1.2, tail: 0.8 },
  { id: "intro",      chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 2.6 },
  { id: "title",      chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 3.6 },
  { id: "problem",    chapter: "PART 01", title: "THE TIME\nLOOP",          beat: 3.2, tail: 1.2 },
  { id: "whatis",     chapter: "PART 02", title: "IT'S JUST\nA FOLDER",     beat: 3.2, tail: 1.2 },
  { id: "trigger",    chapter: "PART 03", title: "THE SHELF\nOF LABELS",    beat: 3.2, tail: 1.2 },
  { id: "anatomy",    chapter: "", title: "", beat: 1.2, tail: 1.2 },
  { id: "build",      chapter: "PART 04", title: "BUILD ONE\nLIVE",         beat: 3.2, tail: 1.2 },
  { id: "everywhere", chapter: "", title: "", beat: 1.2, tail: 1.2 },
  { id: "bigpicture", chapter: "PART 05", title: "THE MACHINE\nSO FAR",     beat: 3.2, tail: 1.2 },
  { id: "danger",     chapter: "PART 06", title: "READ BEFORE\nYOU INSTALL", beat: 3.2, tail: 1.2 },
  { id: "outro",      chapter: "", title: "", beat: 1.0, tail: 1.0 },
  { id: "subscribe",  chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 7.0 },
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

export const skillsTotalFrames = (): number => {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
};
