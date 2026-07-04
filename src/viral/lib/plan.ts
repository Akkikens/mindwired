/** Resolve a VisualPlan + audio manifest into an absolute frame timeline.
 *  Audio-first: real clip duration wins; the plan's start/end are the fallback.
 *  Word timings: real (from TTS alignment) or estimated by syllable weight. */
import { PlanScene, ShortManifest, TimedScene, TimedWord, VisualPlan } from "./types";

export const FPS = 30;
/** breathing room after the voice stops, before the cut (frames) */
export const HOLD = 14;
/** visual lead-in before the voice starts: longer on scene 1 so the video
 *  opens with a beat of motion instead of a cold slam */
const LEAD_FIRST = 14;
const LEAD = 5;

const syllables = (w: string) =>
  Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) ?? []).length);

/** Deterministic estimated word timings across a known clip duration. */
export function estimateWords(text: string, dur: number): TimedWord[] {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => syllables(w) + (/[.!?,]$/.test(w) ? 1.1 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  const usable = Math.max(0.1, dur - 0.25); // small lead-in
  let t = 0.15;
  return words.map((w, i) => {
    const span = (weights[i] / total) * usable;
    const word: TimedWord = { word: w, start: t, end: t + span };
    t += span;
    return word;
  });
}

export function buildTimeline(plan: VisualPlan, manifest: ShortManifest | null): TimedScene[] {
  let from = 0;
  return plan.scenes.map((s: PlanScene, i: number) => {
    const clip = manifest?.clips?.[s.id];
    // floor applies to manifest clips too — a corrupt 0.2s clip must not produce a glitch-flash scene
    const dur = Math.max(1.2, clip?.dur ?? (s.end - s.start));
    const lead = i === 0 ? LEAD_FIRST : LEAD;
    const durationInFrames = lead + Math.round(dur * FPS) + HOLD;
    const raw = clip?.words?.length ? clip.words : estimateWords(s.voiceover, dur);
    // shift word times so text stays locked to the delayed audio
    const words = raw.map((w) => ({ ...w, start: w.start + lead / FPS, end: w.end + lead / FPS }));
    const timed: TimedScene = {
      ...s, from, durationInFrames, words, audioDelay: lead, channel: plan.channel,
      audioSrc: clip && !clip.estimated ? `shorts/${plan.slug}/audio/${s.id}.mp3` : undefined,
    };
    from += durationInFrames;
    return timed;
  });
}

export const timelineFrames = (scenes: TimedScene[]) =>
  scenes.reduce((a, s) => Math.max(a, s.from + s.durationInFrames), 0);

/** frames (relative to scene start) at which each mainText word appears:
 *  anchored to the voice — each on-screen word fires when the narration
 *  reaches the matching spoken word, else staggered evenly. */
export function textWordFrames(mainText: string, words: TimedWord[], stagger: number): number[] {
  const targets = mainText.split(/\s+/).filter(Boolean);
  const clean = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
  let cursor = 0;
  const audioStart = Math.round((words[0]?.start ?? 0) * FPS);
  let last = audioStart;
  return targets.map((t) => {
    // bounded lookahead: a word matching a much-later occurrence must not
    // fling the cursor forward and desync every subsequent word
    const hit = words.slice(cursor, cursor + 6).find((w) => clean(w.word) === clean(t) && clean(t).length > 2);
    if (hit) {
      cursor = words.indexOf(hit) + 1;
      last = Math.round(hit.start * FPS);
      return last;
    }
    // unmatched words follow the previous word after the stagger — never
    // before the (lead-shifted) audio begins
    last = last + stagger;
    return last;
  });
}
