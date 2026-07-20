/** Timeline for codewired #2 — "MCP Explained". Same contract as ../lib/script.ts. */
import manifestJson from "../../../public/codewired/mcp/audio/manifest.json";

export const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

const clips = (manifestJson as { clips: Record<string, { dur: number }> }).clips;
export const clipDur = (id: string): number => clips[id]?.dur ?? 0;

export type SceneId =
  | "hook" | "intro" | "title"
  | "chaos" | "port" | "anatomy" | "menu" | "flow" | "ecosystem" | "danger"
  | "outro" | "subscribe";

export interface SceneDef {
  id: SceneId; chapter: string; title: string;
  beat: number; tail: number; silent?: boolean; fixed?: number;
}

export const SCENES: SceneDef[] = [
  { id: "hook",      chapter: "", title: "", beat: 1.2, tail: 0.8 },
  { id: "intro",     chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 2.6 },
  { id: "title",     chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 3.6 },
  { id: "chaos",     chapter: "PART 01", title: "THE MESS\nIT REPLACED",  beat: 3.2, tail: 1.2 },
  { id: "port",      chapter: "PART 02", title: "ONE\nPORT",             beat: 3.2, tail: 1.2 },
  { id: "anatomy",   chapter: "PART 03", title: "HOST · CLIENT\n· SERVER", beat: 3.2, tail: 1.2 },
  { id: "menu",      chapter: "", title: "", beat: 1.2, tail: 1.2 },
  { id: "flow",      chapter: "PART 04", title: "ONE CALL,\nEND TO END", beat: 3.2, tail: 1.2 },
  { id: "ecosystem", chapter: "", title: "", beat: 1.2, tail: 1.2 },
  { id: "danger",    chapter: "PART 05", title: "THE\nWARNING",          beat: 3.2, tail: 1.2 },
  { id: "outro",     chapter: "", title: "", beat: 1.0, tail: 1.0 },
  { id: "subscribe", chapter: "", title: "", beat: 0, tail: 0, silent: true, fixed: 7.0 },
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

export const mcpTotalFrames = (): number => {
  const t = buildTimeline();
  const last = t[t.length - 1];
  return last.from + last.durationInFrames;
};
