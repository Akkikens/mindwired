import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { CameraRig, FlashIn } from "./components/CameraRig";
import { Brand, ProgressBar, SafeArea, VoicePulse } from "./components/HUD";
import { KineticText, Kicker } from "./components/KineticText";
import { SceneRouter } from "./scenes";
import { buildTimeline, HOLD, timelineFrames } from "./lib/plan";
import { HOST_REGISTRY, resolveHostImage } from "./lib/hosts";
import { TONES } from "./lib/tone";
import { ShortManifest, TimedScene, VisualPlan } from "./lib/types";

/** Host source media: normally a plain cover-fill (a 9:16 short with a 9:16
 *  image, or a 16:9 long-form with a real 16:9 host shoot — see hosts.json
 *  imageWide). `pillarbox` is only for the fallback case, a host with no
 *  landscape shoot yet rendered wide: cover-cropping a portrait to fill a
 *  landscape box would cut the mouth off, so we show the full portrait
 *  (contain) over a blurred cover copy instead of cropping the face away. */
const HostMedia: React.FC<{
  pillarbox: boolean;
  render: (fit: React.CSSProperties) => React.ReactNode;
}> = ({ pillarbox, render }) => {
  const coverFit: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" };
  const containFit: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 0%" };
  if (!pillarbox) return <>{render(coverFit)}</>;
  return (
    <>
      <AbsoluteFill style={{ filter: "blur(60px) brightness(0.55)", transform: "scale(1.15)" }}>
        {render(coverFit)}
      </AbsoluteFill>
      <AbsoluteFill>{render(containFit)}</AbsoluteFill>
    </>
  );
};

/** Persistent host image with a slow continuous Ken Burns zoom + bottom scrim.
 *  Spans the whole video so it never restarts between scene cuts. When talking
 *  clips overlay it (`frozen`), the zoom is locked so still/video never drift. */
const HostLayer: React.FC<{ src: string; totalFrames: number; accent: string; frozen?: boolean; pillarbox: boolean }> =
  ({ src, totalFrames, accent, frozen, pillarbox }) => {
    const frame = useCurrentFrame();
    const zoom = frozen ? 1 : interpolate(frame, [0, totalFrames], [1.03, 1.13], { extrapolateRight: "clamp" });
    const drift = frozen ? 0 : interpolate(frame, [0, totalFrames], [0, -3], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${zoom}) translateY(${drift}%)`, transformOrigin: "center 22%" }}>
          <HostMedia pillarbox={pillarbox} render={(fit) => <Img src={staticFile(src)} style={fit} />} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };

/** One lip-synced talking clip, muted (the scene's mp3 stays the audio source so
 *  word-sync captions keep working). Fades out over its last frames so the hand-off
 *  back to the still during the HOLD beat doesn't pop. */
const HostTalkingClip: React.FC<{ src: string; durationInFrames: number; pillarbox: boolean }> =
  ({ src, durationInFrames, pillarbox }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <HostMedia pillarbox={pillarbox} render={(fit) => <OffthreadVideo muted src={staticFile(src)} style={fit} />} />
    </AbsoluteFill>
  );
};

/** Scrim + accent vignette above the host layers so captions stay readable. */
const HostScrim: React.FC<{ accent: string }> = ({ accent }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,10,0.35) 0%, transparent 22%, transparent 46%, rgba(3,4,10,0.72) 72%, rgba(3,4,10,0.95) 100%)" }} />
    <AbsoluteFill style={{ boxShadow: `inset 0 0 240px 40px ${accent}18` }} />
  </>
);

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
  const { width, height } = useVideoConfig();
  const wide = width > height;

  // Host mode: one persistent face-fronted host + per-scene captions/audio.
  // Scenes that have a lip-synced clip play the talking video during the
  // voiced span; the still covers lead-ins, HOLD beats and any scene that was
  // never lip-synced. Wide renders use a genuine 16:9 host shoot (hosts.json
  // imageWide) when one exists — a 9:16 talking clip's mouth timing doesn't
  // match a 16:9 image, so wide renders need their OWN lip-synced clips
  // (hostClipExistsWide, from `lipsync/batch.py --wide`), not the 9:16 ones.
  if (plan.host) {
    const hostImage = resolveHostImage(plan.host, wide);
    const hasNativeWide = wide && !plan.host.includes("/") && !!HOST_REGISTRY[plan.host]?.imageWide;
    const pillarbox = wide && !hasNativeWide;
    const clipExists = (s: TimedScene) => (wide ? s.hostClipExistsWide : s.hostClipExists);
    const clipDir = wide ? "host-wide" : "host";
    const anyTalking = scenes.some(clipExists);
    return (
      <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
        <HostLayer src={hostImage} totalFrames={total} accent={accent} frozen={anyTalking} pillarbox={pillarbox} />
        {scenes.map((s) => {
          const talkFrames = s.durationInFrames - s.audioDelay - HOLD;
          return clipExists(s) && talkFrames > 0 ? (
            <Sequence key={`talk-${s.id}`} from={s.from + s.audioDelay} durationInFrames={talkFrames} name={`host:${s.id}`}>
              <HostTalkingClip src={`shorts/${plan.slug}/${clipDir}/${s.id}.mp4`} durationInFrames={talkFrames} pillarbox={pillarbox} />
            </Sequence>
          ) : null;
        })}
        <HostScrim accent={accent} />
        {scenes.map((s, i) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={`${s.kind}:${s.id}`}>
            {s.board ? (
              // board scene: full kinetic scene (opaque backdrop covers the host)
              <SceneShell s={s} prevOut={i > 0 ? scenes[i - 1].transitionOut : undefined}
                slug={plan.slug} bpm={plan.music?.bpm} />
            ) : (
              <>
                <HostCaption s={s} />
                {s.audioSrc && (
                  <Sequence from={s.audioDelay}>
                    <Audio src={staticFile(s.audioSrc)} />
                  </Sequence>
                )}
              </>
            )}
          </Sequence>
        ))}
        {plan.music?.src && <Audio src={staticFile(plan.music.src)} volume={plan.music.volume ?? 0.14} loop />}
        <ProgressBar totalFrames={total} accent={accent} />
        <Brand name={plan.channel} />
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
      <Brand name={plan.channel} />
    </AbsoluteFill>
  );
};

export const viralShortFrames = (plan: VisualPlan, manifest: ShortManifest | null) =>
  timelineFrames(buildTimeline(plan, manifest));
