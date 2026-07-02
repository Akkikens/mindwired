import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY } from "../lib/theme";

interface Props {
  chapter: string;
  title: string;
  /** seconds the title stays before fading */
  hold?: number;
}

/** Dramatic section title: chapter tag + big condensed uppercase headline that
 *  slides up behind an animated rule, then fades out. */
export const ChapterTitle: React.FC<Props> = ({ chapter, title, hold = 3.4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inS = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const ruleW = interpolate(inS, [0, 1], [0, 520]);
  const titleY = interpolate(inS, [0, 1], [40, 0]);
  const titleClip = interpolate(inS, [0.1, 1], [0, 100], { extrapolateRight: "clamp" });

  const fadeStart = hold * fps;
  const op = interpolate(frame, [fadeStart, fadeStart + 0.6 * fps], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  if (op <= 0) return null;

  return (
    <div style={{
      position: "absolute", left: 120, top: 150, opacity: op, pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: 6,
        color: C.cyan, textTransform: "uppercase", opacity: interpolate(inS, [0, 0.6], [0, 1]),
        textShadow: `0 0 16px ${C.cyan}66`, marginBottom: 14,
      }}>
        {chapter}
      </div>
      <div style={{
        height: 3, width: ruleW, background: `linear-gradient(90deg, ${C.cyan}, transparent)`,
        marginBottom: 18, boxShadow: `0 0 12px ${C.cyan}`,
      }} />
      <div style={{
        overflow: "hidden",
        clipPath: `inset(0 ${100 - titleClip}% 0 0)`,
      }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: 92, fontWeight: 800, letterSpacing: 2,
          color: C.white, textTransform: "uppercase", lineHeight: 1.0,
          whiteSpace: "pre-line",
          transform: `translateY(${titleY}px)`,
          textShadow: "0 6px 30px rgba(0,0,0,0.7)",
        }}>
          {title}
        </div>
      </div>
    </div>
  );
};
