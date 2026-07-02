import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "../../lib/theme";
import { ToneStyle } from "../lib/tone";
import { TimedWord } from "../lib/types";
import { revealProgress, shake } from "../lib/anim";
import { textWordFrames } from "../lib/plan";

/** Word-by-word kinetic typography, anchored to the narration.
 *  Variants: pop (overshoot), slam (drop+shake), blur (blur→sharp), wipe (mask).
 *  Emphasis words get the accent color, extra scale, and their own energy. */
export const KineticText: React.FC<{
  text: string;
  words: TimedWord[];
  tone: ToneStyle;
  emphasis?: string[];
  fontSize?: number;
  maxWidth?: number;
  align?: "center" | "left";
}> = ({ text, words, tone, emphasis = [], fontSize = 108, maxWidth = 800, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parts = text.split(/\s+/).filter(Boolean);
  const starts = textWordFrames(text, words, tone.wordStagger);
  const clean = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
  const emset = new Set(emphasis.map(clean));
  /** clamp very long words (e.g. "100,000,000") so they never leave the safe area */
  const sizeFor = (w: string, em: boolean) => {
    const base = em ? fontSize * 1.14 : fontSize;
    return Math.min(base, (maxWidth / Math.max(4, w.length)) / 0.6);
  };

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: `${Math.round(fontSize * 0.26)}px`,
      justifyContent: align === "center" ? "center" : "flex-start",
      maxWidth, textAlign: align, lineHeight: 1.06, fontSize,
    }}>
      {parts.map((w, i) => {
        const at = starts[i];
        const local = frame - at;
        const isEm = emset.has(clean(w));
        const v = tone.textVariant;

        const pop = spring({ frame: local, fps, config: { damping: v === "slam" ? 16 : 12, stiffness: v === "slam" ? 240 : 140, mass: 0.6 } });
        const visible = local >= 0;

        let transform = "";
        let filter = "";
        let opacity = visible ? 1 : 0;

        if (v === "pop") {
          transform = `scale(${interpolate(pop, [0, 1], [0.5, 1])}) translateY(${interpolate(pop, [0, 1], [26, 0])}px)`;
        } else if (v === "slam") {
          const sh = isEm ? shake(frame, at + 2, 10, 7) : { x: 0, y: 0, rot: 0 };
          transform = `scale(${interpolate(pop, [0, 1], [1.7, 1])}) translate(${sh.x}px, ${sh.y}px) rotate(${sh.rot}deg)`;
          opacity = visible ? interpolate(local, [0, 2], [0, 1], { extrapolateRight: "clamp" }) : 0;
        } else if (v === "blur") {
          const p = revealProgress(frame, at, 9);
          filter = `blur(${(1 - p) * 14}px)`;
          transform = `scale(${interpolate(p, [0, 1], [1.12, 1])})`;
          opacity = visible ? p : 0;
        } else {
          // wipe: clip-path mask sweep
          const p = revealProgress(frame, at, 8);
          transform = `translateY(${(1 - p) * 14}px)`;
          opacity = visible ? 1 : 0;
          return (
            <span key={i} style={{
              fontFamily: DISPLAY, fontWeight: 800, fontSize: sizeFor(w, isEm),
              color: isEm ? tone.accent : "#EAF2FF",
              clipPath: `inset(0 ${(1 - p) * 100}% -10% 0)`,
              transform, opacity, display: "inline-block",
              textShadow: `0 0 44px ${isEm ? tone.textGlow : "rgba(0,0,0,0.5)"}, 0 4px 22px rgba(0,0,0,0.7)`,
            }}>{w}</span>
          );
        }

        return (
          <span key={i} style={{
            fontFamily: DISPLAY, fontWeight: isEm ? 900 : 800,
            fontSize: sizeFor(w, isEm),
            color: isEm ? tone.accent : "#EAF2FF",
            transform, filter, opacity, display: "inline-block",
            textShadow: `0 0 44px ${isEm ? tone.textGlow : "rgba(0,0,0,0.5)"}, 0 4px 22px rgba(0,0,0,0.7)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/** Small kicker/label above the main line. */
export const Kicker: React.FC<{ text: string; tone: ToneStyle; delay?: number }> = ({ text, tone, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = revealProgress(frame, delay, 10);
  return (
    <div style={{
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 7,
      textTransform: "uppercase", color: tone.accent2, opacity: p,
      transform: `translateY(${(1 - p) * 16}px)`,
      textShadow: "0 2px 14px rgba(0,0,0,0.8)",
    }}>{text}</div>
  );
};
