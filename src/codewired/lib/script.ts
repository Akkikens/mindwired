/** Timeline for codewired #1 — "Claude Code Subagents, Finally Explained".
 *  Teaser cold open → wordmark → title → 10 concept scenes → code-rendered
 *  subscribe outro (the $0 codewired standing outro, baked into the comp).
 *  Mirrors src/rogueplanet/lib/script.ts. */
import { clipDur } from "./manifest";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export type SceneId =
  | "hook" | "intro" | "title"
  | "problem" | "delegate" | "work" | "memory" | "anatomy"
  | "team" | "cost" | "mistake" | "rule" | "outro" | "subscribe";

export interface SceneDef {
  id: SceneId;
  chapter: string;   // small kicker above the card title
  title: string;     // chapter card text ("" = no card)
  beat: number;      // seconds of establishing visual before narration
  tail: number;      // seconds held after narration
  silent?: boolean;
  fixed?: number;    // total seconds for a silent beat
}

export const SCENES: SceneDef[] = [
  { id: "hook",      chapter: "", title: "",                     beat: 1.2, tail: 0.8 },
  { id: "intro",     chapter: "", title: "",                     beat: 0, tail: 0, silent: true, fixed: 2.6 },
  { id: "title",     chapter: "", title: "",                     beat: 0, tail: 0, silent: true, fixed: 3.6 },
  { id: "problem",   chapter: "PART 01", title: "ONE BRAIN,\nONE MEMORY",   beat: 3.2, tail: 1.2 },
  { id: "delegate",  chapter: "PART 02", title: "THE CLONE\nTRICK",         beat: 3.2, tail: 1.0 },
  { id: "work",      chapter: "", title: "",                     beat: 1.0, tail: 1.0 },
  { id: "memory",    chapter: "", title: "",                     beat: 1.0, tail: 1.2 },
  { id: "anatomy",   chapter: "PART 03", title: "JUST A\nMARKDOWN FILE",    beat: 3.2, tail: 1.2 },
  { id: "team",      chapter: "PART 04", title: "THE AGENT\nTEAM",          beat: 3.2, tail: 1.0 },
  { id: "cost",      chapter: "", title: "",                     beat: 1.0, tail: 1.0 },
  { id: "mistake",   chapter: "PART 05", title: "THE\nMISTAKE",             beat: 3.2, tail: 1.2 },
  { id: "rule",      chapter: "", title: "",                     beat: 1.2, tail: 1.4 },
  { id: "outro",     chapter: "", title: "",                     beat: 1.0, tail: 1.0 },
  // codewired standing subscribe outro — code-rendered, $0, bakes in one pass
  { id: "subscribe", chapter: "", title: "",                     beat: 0, tail: 0, silent: true, fixed: 7.0 },
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

export const codewiredTotalFrames = (): number => {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
};
