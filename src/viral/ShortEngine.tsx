import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { CameraRig, FlashIn } from "./components/CameraRig";
import { Brand, ProgressBar, SafeArea, VoicePulse } from "./components/HUD";
import { KineticText, Kicker } from "./components/KineticText";
import { SceneRouter } from "./scenes";
import { buildTimeline, timelineFrames } from "./lib/plan";
import { TONES } from "./lib/tone";
import { ShortManifest, TimedScene, VisualPlan } from "./lib/types";

/** Persistent host image with a slow continuous Ken Burns zoom + bottom scrim.
 *  Spans the whole video so it never restarts between scene cuts. */
const HostLayer: React.FC<{ src: string; totalFrames: number; accent: string }> = ({ src, totalFrames, accent }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, totalFrames], [1.03, 1.13], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, totalFrames], [0, -3], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateY(${drift}%)`, transformOrigin: "center 22%" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%" }} />
      </AbsoluteFill>
      {/* bottom scrim so captions read over the image; subtle top vignette */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,10,0.35) 0%, transparent 22%, transparent 46%, rgba(3,4,10,0.72) 72%, rgba(3,4,10,0.95) 100%)" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 240px 40px ${accent}18` }} />
    </AbsoluteFill>
  );
};

/** Host mode: caption + kicker in the lower third + voice pulse, over the host layer. */
const HostCaption: React.FC<{ s: TimedScene }> = ({ s }) => {
  const tone = TONES[s.emotionalTone];
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 360 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "0 70px" }}>
          {s.kicker && <Kicker text={s.kicker} tone={tone} />}
          <KineticText text={s.mainText} words={s.words} tone={tone} emphasis={s.emphasis}
            fontSize={92} maxWidth={width - 140} />
        </div>
      </AbsoluteFill>
      <VoicePulse words={s.words} sceneFrame={frame} tone={tone} bottom={210} />
    </AbsoluteFill>
  );
};

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

  // Host mode: one persistent face-fronted image + per-scene captions/audio.
  if (plan.host) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
        <HostLayer src={plan.host} totalFrames={total} accent={accent} />
        {scenes.map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={`${s.kind}:${s.id}`}>
            <HostCaption s={s} />
            {s.audioSrc && (
              <Sequence from={s.audioDelay}>
                <Audio src={staticFile(s.audioSrc)} />
              </Sequence>
            )}
          </Sequence>
        ))}
        {plan.music?.src && <Audio src={staticFile(plan.music.src)} volume={plan.music.volume ?? 0.14} loop />}
        <ProgressBar totalFrames={total} accent={accent} />
        <Brand />
      </AbsoluteFill>
    );
  }

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
