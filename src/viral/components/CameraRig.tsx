import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ToneStyle } from "../lib/tone";
import { beatPulse, cameraPush, punchZoom, shake, whipIn, whipOut } from "../lib/anim";
import { TransitionKind } from "../lib/types";

/** Fake camera for a scene's world layer: entrance punch + slow push +
 *  tone-driven shake + whip transition in/out. HUD lives outside this. */
export const CameraRig: React.FC<{
  tone: ToneStyle;
  durationInFrames: number;
  transitionIn?: TransitionKind;
  transitionOut?: TransitionKind;
  /** music bpm → subtle beat-synced zoom pulse */
  bpm?: number;
  children: React.ReactNode;
}> = ({ tone, durationInFrames, transitionIn = "none", transitionOut = "none", bpm, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = bpm ? beatPulse(frame, fps, { bpm, strength: 0.016 }) : 1;
  const push = cameraPush(frame, durationInFrames, 1.02, tone.cameraPushTo);
  const punch = punchZoom(frame, 0, 12, tone.punch);
  // shake = brief entrance impact that settles, never a scene-long tremor
  const sh = tone.shakeIntensity > 0 ? shake(frame, 2, 14, tone.shakeIntensity * 0.6) : { x: 0, y: 0, rot: 0 };

  const wIn = transitionIn === "whip" ? whipIn(frame, 7, -1) : { x: 0, blur: 0, opacity: 1 };
  const wOut = transitionOut === "whip" ? whipOut(frame, durationInFrames, 7, -1) : { x: 0, blur: 0, opacity: 1 };
  const zoomOut = transitionOut === "zoomblast"
    ? 1 + Math.max(0, (frame - (durationInFrames - 8)) / 8) * 0.6
    : 1;

  return (
    <AbsoluteFill style={{
      transform: `translate(${sh.x + wIn.x + wOut.x}px, ${sh.y}px) rotate(${sh.rot}deg) scale(${push * punch * zoomOut * beat})`,
      filter: (wIn.blur + wOut.blur) > 0.5 ? `blur(${wIn.blur + wOut.blur}px)` : undefined,
      opacity: Math.min(wIn.opacity, wOut.opacity),
      transformOrigin: "center 46%",
    }}>
      {children}
    </AbsoluteFill>
  );
};

/** White flash frame for "flash" transitions — drop at scene start. */
export const FlashIn: React.FC = () => {
  const frame = useCurrentFrame();
  const op = frame <= 6 ? (1 - frame / 6) * 0.85 : 0;
  return op > 0.01 ? <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: op, pointerEvents: "none" }} /> : null;
};
