import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  children: React.ReactNode;
  fromScale?: number; toScale?: number;
  panX?: number; panY?: number;
  /** scene length in frames for the move to span */
  durationInFrames?: number;
}

/** Slow Ken Burns camera move applied to the world layer (not the HUD/captions). */
export const Camera: React.FC<Props> = ({
  children, fromScale = 1.04, toScale = 1.12, panX = 0, panY = 0, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: cfgDur } = useVideoConfig();
  const dur = durationInFrames ?? cfgDur;
  const scale = interpolate(frame, [0, dur], [fromScale, toScale], { extrapolateRight: "clamp" });
  const tx = interpolate(frame, [0, dur], [0, panX], { extrapolateRight: "clamp" });
  const ty = interpolate(frame, [0, dur], [0, panY], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale}) translate(${tx}px, ${ty}px)`, transformOrigin: "center" }}>
      {children}
    </AbsoluteFill>
  );
};
