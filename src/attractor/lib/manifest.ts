/** Typed access to the Great Attractor audio manifest (Brian VO + score + word timings). */
import manifestJson from "../../../public/attractor/audio/manifest.json";

export interface TimedWord { word: string; start: number; end: number; }
interface Clip { kind: string; dur: number; words?: TimedWord[]; estimated?: boolean; }

const M = manifestJson as { clips: Record<string, Clip> };

export const clipDur = (id: string): number => M.clips[id]?.dur ?? 5;
export const clipWords = (id: string): TimedWord[] => M.clips[id]?.words ?? [];

export function wordStart(id: string, needle: string, fallbackSec: number): number {
  const n = needle.toLowerCase().replace(/[^a-z0-9]/g, "");
  const w = clipWords(id).find(x => x.word.toLowerCase().replace(/[^a-z0-9]/g, "").includes(n));
  return w ? w.start : fallbackSec;
}

export interface CaptionLine { words: TimedWord[]; start: number; end: number; text: string; }
export function captionLines(id: string, maxWords = 7): CaptionLine[] {
  const words = clipWords(id);
  const lines: CaptionLine[] = [];
  let cur: TimedWord[] = [];
  const flush = () => {
    if (!cur.length) return;
    lines.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end, text: cur.map(w => w.word).join(" ") });
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    const endsSentence = /[.!?]$/.test(w.word);
    if (cur.length >= maxWords || (endsSentence && cur.length >= 3)) flush();
  }
  flush();
  return lines;
}
