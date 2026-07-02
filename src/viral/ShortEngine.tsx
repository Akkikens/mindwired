import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { CameraRig, FlashIn } from "./components/CameraRig";
import { Brand, ProgressBar, SafeArea, VoicePulse } from "./components/HUD";
import { SceneRouter } from "./scenes";
import { buildTimeline, timelineFrames } from "./lib/plan";
import { TONES } from "./lib/tone";
import { ShortManifest, TimedScene, VisualPlan } from "./lib/types";

/** One scene: backdrop → camera(world) → HUD pulse → audio. */
const SceneShell: React.FC<{ s: TimedScene; prevOut?: TimedScene["transitionOut"]; slug: string; bpm?: number }> =
  ({ s, prevOut, slug, bpm }) => {
    const frame = useCurrentFrame();
    const tone = TONES[s.emotionalTone];
    const broll = s.backgroundPrompt ? `shorts/${slug}/broll/${s.id}.jpg` : undefined;
    return (
      <AbsoluteFill>
        <CameraRig tone={tone} durationInFrames={s.durationInFrames} bpm={bpm}
          transitionIn={prevOut === "whip" ? "whip" : "none"} transitionOut={s.transitionOut}>
          <Backdrop tone={tone} seed={s.id.length * 997 + s.from} broll={s.brollExists ? broll : undefined} />
          <SafeArea><SceneRouter s={s} tone={tone} /></SafeArea>
        </CameraRig>
        {(prevOut === "flash" || prevOut === "zoomblast") && <FlashIn />}
        <VoicePulse words={s.words} sceneFrame={frame} tone={tone} bottom={190} />
        {s.audioSrc && (
          <Sequence from={s.audioDelay}>
            <Audio src={staticFile(s.audioSrc)} />
          </Sequence>
        )}
      </AbsoluteFill>
    );
  };

export const ViralShort: React.FC<{ plan: VisualPlan; manifest: ShortManifest | null }> = ({ plan, manifest }) => {
  const scenes = buildTimeline(plan, manifest);
  const total = timelineFrames(scenes);
  const accent = TONES[scenes[0]?.emotionalTone ?? "curiosity"].accent;
  return (
    <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
      {scenes.map((s, i) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={`${s.kind}:${s.id}`}>
          <SceneShell s={s} prevOut={i > 0 ? scenes[i - 1].transitionOut : undefined} slug={plan.slug}
            bpm={plan.music?.bpm} />
        </Sequence>
      ))}
      {plan.music?.src && (
        <Audio src={staticFile(plan.music.src)} volume={plan.music.volume ?? 0.14} loop />
      )}
      <ProgressBar totalFrames={total} accent={accent} />
      <Brand />
    </AbsoluteFill>
  );
};

export const viralShortFrames = (plan: VisualPlan, manifest: ShortManifest | null) =>
  timelineFrames(buildTimeline(plan, manifest));
