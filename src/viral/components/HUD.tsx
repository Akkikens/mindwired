import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "../../lib/theme";
import { ToneStyle } from "../lib/tone";
import { TimedWord } from "../lib/types";

/** Top progress bar — subtle retention cue. */
export const ProgressBar: React.FC<{ totalFrames: number; accent: string }> = ({ totalFrames, accent }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / totalFrames);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.08)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: accent, boxShadow: `0 0 14px ${accent}` }} />
    </div>
  );
};

/** Fake waveform pulse: bars driven by whether a word is being spoken now —
 *  intensity rises with word density (the voice "getting intense"). */
export const VoicePulse: React.FC<{ words: TimedWord[]; sceneFrame: number; tone: ToneStyle; bottom: number }> =
  ({ words, sceneFrame, tone, bottom }) => {
    const { fps } = useVideoConfig();
    const t = sceneFrame / fps;
    // 0.15s grace over inter-word gaps — real TTS timings have silences that
    // would strobe the bars at 30fps with a hard interval test
    const active = words.some((w) => t >= w.start - 0.15 && t <= w.end + 0.15);
    const density = words.filter((w) => Math.abs((w.start + w.end) / 2 - t) < 0.6).length;
    const energy = active ? Math.min(1, 0.35 + density * 0.22) : 0.12;
    const N = 5;
    return (
      <div style={{
        position: "absolute", bottom, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 7, alignItems: "flex-end", height: 34, opacity: 0.85,
      }}>
        {Array.from({ length: N }).map((_, i) => {
          const h = 8 + energy * 26 * Math.abs(Math.sin(sceneFrame * 0.32 + i * 1.4));
          return <div key={i} style={{ width: 7, height: h, borderRadius: 4, background: tone.accent, boxShadow: `0 0 10px ${tone.accent}88` }} />;
        })}
      </div>
    );
  };

/** Mobile-safe stage: keeps content inside Shorts UI margins. */
export const SafeArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return (
    <AbsoluteFill style={{
      padding: portrait ? "170px 84px 300px" : "90px 140px 120px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </AbsoluteFill>
  );
};

/** Corner brand chip — small, never an intro. Defaults to mindwired; pass
 *  `name` for videos published under a different channel (see plan.channel). */
export const Brand: React.FC<{ name?: string }> = ({ name = "mindwired" }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return (
    <div style={{
      position: "absolute", top: portrait ? 84 : 36, right: portrait ? 40 : 48,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2,
      color: "rgba(234,242,255,0.55)",
    }}>{name}</div>
  );
};
