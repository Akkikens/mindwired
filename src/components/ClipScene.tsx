import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Vignette, Grain } from "./FilmLook";

/**
 * A scene backed by an AI-generated (or any) video clip — Veo / Runway / Kling /
 * Pika output dropped into public/<slug>/clips/. The clip plays full-frame under
 * the standard Mindwired overlay stack (pass captions / stat callouts / chapter
 * title as children), so generated footage matches the channel's cinematic grade.
 *
 * AI clips are silent-by-default here (muted) so they never fight the VO track.
 * A gentle Ken-Burns push + edge fades hide the seams between a short clip and a
 * longer scene, and let a 10s generation cover a 15s beat by freezing on its
 * last frame rather than cutting to black.
 */
export const ClipScene: React.FC<{
  src: string;                 // e.g. "scariest/clips/rogue.mp4"
  durationInFrames: number;
  grade?: string;
  kenBurns?: boolean;          // subtle push so a static-ish clip still breathes
  muted?: boolean;
  children?: React.ReactNode;  // overlays: <ChapterTitle/>, <Captions/>, stat callouts
}> = ({
  src, durationInFrames, grade = "contrast(1.07) saturate(1.12) brightness(0.95)",
  kenBurns = true, muted = true, children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(fadeIn, fadeOut);
  const scale = kenBurns ? interpolate(frame, [0, durationInFrames], [1.04, 1.12]) : 1;
  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <AbsoluteFill style={{ opacity: op }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted={muted}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, filter: grade }}
        />
      </AbsoluteFill>
      {/* edge-darkening wash so overlays read over bright generated footage */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 50% 42%, rgba(10,30,60,0) 42%, rgba(2,6,16,0.5) 100%)", pointerEvents: "none" }} />
      {children}
      <Vignette strength={0.92} />
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};
