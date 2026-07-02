import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { captionLines as orbitCaptionLines } from "../lib/manifest";
import { C, SANS } from "../lib/theme";

interface CaptionLine { words: { word: string; start: number; end: number }[]; start: number; end: number; text: string; }

/** Which lines to burn in:
 *  "all"  – every line (default; legacy behaviour)
 *  "key"  – only punchy/important lines (stats, questions, short emphatic beats)
 *  number[] – explicit line indices                                              */
export type CaptionSelect = "all" | "key" | number[];

interface Props {
  clipId: string;
  /** frame within this Sequence at which the narration audio starts */
  startFrame: number;
  maxWords?: number;
  /** pre-computed caption lines (e.g. from another video's manifest). If omitted,
   *  falls back to the orbit manifest via clipId. */
  lines?: CaptionLine[];
  /** how many of the lines to actually show (default: all) */
  select?: CaptionSelect;
}

/** A line earns a burned-in caption when it carries weight on its own:
 *  it states a number, asks/exclaims something, or is a short punchy beat. */
const NUM_WORDS = /\b(hundred|thousand|million|billion|trillion|one|two|three|four|five|six|seven|eight|nine|ten|zero|percent|times)\b/i;
const isKeyLine = (l: CaptionLine): boolean => {
  const t = l.text.trim();
  if (/\d/.test(t)) return true;                 // any figure / stat
  if (NUM_WORDS.test(t)) return true;            // spelled-out figures ("two million")
  if (/[?!]/.test(t)) return true;               // a question or exclamation
  if (l.words.length <= 4 && t.length >= 6) return true; // tight, deliberate beat
  return false;
};

const pickLines = (lines: CaptionLine[], select: CaptionSelect): CaptionLine[] => {
  if (select === "all") return lines;
  if (Array.isArray(select)) return select.map(i => lines[i]).filter(Boolean);
  return lines.filter(isKeyLine);
};

/** Minimal cinematic subtitles: no box — a soft floor scrim for legibility, clean
 *  Inter type, and a quiet per-word lift on the word being spoken. */
export const Captions: React.FC<Props> = ({
  clipId, startFrame, maxWords = 7, lines: linesProp, select = "all",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = (frame - startFrame) / fps;
  const allLines = linesProp ?? orbitCaptionLines(clipId, maxWords);
  const lines = pickLines(allLines, select);

  const line = lines.find(l => now >= l.start - 0.15 && now <= l.end + 0.4);
  if (!line) return null;

  // gentle fade in/out at the line edges
  const fadeIn = Math.min(1, Math.max(0, (now - (line.start - 0.15)) / 0.28));
  const fadeOut = Math.min(1, Math.max(0, (line.end + 0.4 - now) / 0.32));
  const op = Math.min(fadeIn, fadeOut);

  return (
    <div style={{
      position: "absolute", bottom: 110, left: 0, right: 0,
      display: "flex", justifyContent: "center", pointerEvents: "none",
      opacity: op,
    }}>
      {/* soft floor scrim — keeps text legible over bright imagery without a box */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: -110, height: 320,
        background: "linear-gradient(to top, rgba(2,5,14,0.66) 0%, rgba(2,5,14,0.28) 45%, transparent 100%)",
      }} />
      <div style={{
        position: "relative", maxWidth: 1280, padding: "0 40px",
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 11px",
      }}>
        {line.words.map((w, i) => {
          const active = now >= w.start && now < w.end + 0.08;
          return (
            <span key={i} style={{
              fontFamily: SANS, fontSize: 37, fontWeight: active ? 600 : 500,
              letterSpacing: 0.2,
              color: active ? C.white : "rgba(234,242,255,0.82)",
              textShadow: active
                ? `0 0 16px ${C.cyan}55, 0 2px 10px rgba(0,0,0,0.7)`
                : "0 2px 10px rgba(0,0,0,0.75)",
              transition: "color 0.12s, font-weight 0.12s",
            }}>
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
