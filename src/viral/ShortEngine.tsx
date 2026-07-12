import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { CameraRig, FlashIn } from "./components/CameraRig";
import { Brand, ProgressBar, SafeArea, VoicePulse } from "./components/HUD";
import { KineticText, Kicker } from "./components/KineticText";
import { HostMedia, SceneRouter } from "./scenes";
import { buildTimeline, timelineFrames } from "./lib/plan";
import { resolveHostImage } from "./lib/hosts";
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

/** Circular corner facecam for wide long-forms — the 9:16 Sonic/Veo talking
 *  clip center-cropped on the face, streamer-style, when this beat was
 *  lip-synced; otherwise the host's still portrait, so the host is visibly
 *  present for every non-board scene instead of vanishing into a bare VoidDisc
 *  with nobody in frame (Akshay feedback 2026-07-05 — "black holes with no
 *  images inside, Kelly isn't speaking"). Pops in, fades out before the cut.
 *  Muted; the scene's mp3 stays the audio source. */
const FaceCam: React.FC<{ src: string; kind: "video" | "image"; durationInFrames: number; accent: string }> =
  ({ src, kind, durationInFrames, accent }) => {
    const frame = useCurrentFrame();
    const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const exit = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity = Math.min(enter, exit);
    const scale = 0.85 + 0.15 * enter;
    const SIZE = 320;
    return (
      <div style={{
        position: "absolute", left: 64, bottom: 96, width: SIZE, height: SIZE,
        borderRadius: "50%", overflow: "hidden", opacity,
        transform: `scale(${scale})`, transformOrigin: "bottom left",
        border: `5px solid ${accent}`,
        boxShadow: `0 18px 60px rgba(0,0,0,0.65), 0 0 40px ${accent}44`,
      }}>
        {/* 9:16 source in a square, cover-cropped. No extra zoom: the previous
            scale(1.25) + top anchor cropped the chin off inside the bubble
            (user feedback 2026-07-05). Anchor a quarter down so forehead-to-chin
            stays inside the circle across differently-framed clips. */}
        {kind === "video" ? (
          <OffthreadVideo muted src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
        ) : (
          <Img src={staticFile(src)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
        )}
      </div>
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
            fontSize={92} maxWidth={width - 140} plate />
        </div>
      </AbsoluteFill>
      <VoicePulse words={s.words} sceneFrame={frame} tone={tone} bottom={210} />
    </AbsoluteFill>
  );
};

/** Scene audio with a short fade in/out — back-to-back scenes are often two
 *  independently-generated voice takes (different Hume/Veo/ElevenLabs calls),
 *  so a hard cut between them can sound like the voice "breaking" at the
 *  splice (Akshay feedback 2026-07-05, subscribe-outro ask→cta transition).
 *  A ~0.2s fade smooths that without adding a perceptible gap. */
const SceneAudio: React.FC<{ src: string; audioDelay: number; totalFrames: number }> = ({ src, audioDelay, totalFrames }) => {
  const frame = useCurrentFrame();
  const localEnd = totalFrames - audioDelay;
  const FADE = 6;
  const volume = Math.min(
    interpolate(frame, [0, FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [localEnd - FADE, localEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={staticFile(src)} volume={volume} />;
};

/** One scene: backdrop → camera(world) → HUD pulse → audio. `hostMedia`
 *  (wide long-forms only) puts the host's face inside the scene's own void
 *  disc for "problem"-kind beats — see SceneRouter/Problem. */
const SceneShell: React.FC<{ s: TimedScene; prevOut?: TimedScene["transitionOut"]; slug: string; bpm?: number; hostMedia?: HostMedia }> =
  ({ s, prevOut, slug, bpm, hostMedia }) => {
    const frame = useCurrentFrame();
    const tone = TONES[s.emotionalTone];
    const broll = s.backgroundPrompt ? `shorts/${slug}/broll/${s.id}.jpg` : undefined;
    const brollVideo = s.brollVideo;
    // Entrance transition. First scene (no prevOut) opens hard with motion —
    // channel rule "no fade-in on scene 1". whip stays whip; flash/zoomblast are
    // drawn by the FlashIn overlay below (no camera fade, or it double-dips);
    // every plain cut now gets a soft dissolve so cuts stop hard-slamming.
    const transitionIn: TimedScene["transitionOut"] =
      prevOut === undefined ? "none"
        : prevOut === "whip" ? "whip"
        : prevOut === "flash" || prevOut === "zoomblast" ? "none"
        : "dissolve";
    return (
      <AbsoluteFill>
        <CameraRig tone={tone} durationInFrames={s.durationInFrames} bpm={bpm} camera={s.camera}
          transitionIn={transitionIn} transitionOut={s.transitionOut}>
          <Backdrop tone={tone} seed={s.id.length * 997 + s.from}
            broll={s.brollExists ? broll : undefined} brollVideo={brollVideo} />
          <SafeArea><SceneRouter s={s} tone={tone} hostMedia={hostMedia} /></SafeArea>
        </CameraRig>
        {(prevOut === "flash" || prevOut === "zoomblast") && <FlashIn />}
        <VoicePulse words={s.words} sceneFrame={frame} tone={tone} bottom={190} />
        {s.audioSrc && (
          <Sequence from={s.audioDelay}>
            <SceneAudio src={s.audioSrc} audioDelay={s.audioDelay} totalFrames={s.durationInFrames} />
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

  // WIDE host mode = facecam pattern. A full-screen host still with frozen
  // lips reads as fake, and full-frame wide lip-sync failed QA with both
  // engines (see HOSTS.md verdict) — so long-forms render every scene as a
  // full kinetic scene and overlay a small circular facecam of the SHARP 9:16
  // talking clip (center-cropped on the face) whenever one exists. Lips move,
  // no giant static face, and it reuses the Shorts' Sonic clips for free.
  if (plan.host && wide) {
    // "problem"-kind beats get the host's face INSIDE their own void disc
    // (see Problem/VoidDisc) instead of a separate corner bubble. Only
    // scenes with an actual lip-synced clip show the host at all — a still
    // photo standing in for "talking" read as frozen/broken once it became
    // the prominent visual (Akshay feedback 2026-07-05); no clip now means
    // no host, not a static stand-in.
    const hostMediaFor = (s: TimedScene): HostMedia | undefined =>
      s.board || !s.hostClipExists ? undefined : {
        src: `shorts/${plan.slug}/host/${s.id}.mp4`,
        kind: "video",
        audioDelay: s.audioDelay,
      };
    return (
      <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
        {scenes.map((s, i) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={`${s.kind}:${s.id}`}>
            <SceneShell s={s} prevOut={i > 0 ? scenes[i - 1].transitionOut : undefined} slug={plan.slug}
              bpm={plan.music?.bpm} hostMedia={s.kind === "problem" ? hostMediaFor(s) : undefined} />
          </Sequence>
        ))}
        {scenes.map((s) => {
          // board scenes are pure graphics by design (no host); "problem"
          // scenes now show the host inside their own disc above — every
          // other non-board scene gets the corner facecam bubble only when
          // it has a talking clip.
          if (s.board || s.kind === "problem") return null;
          const talkFrames = s.durationInFrames - s.audioDelay - s.holdFrames;
          if (talkFrames <= 0) return null;
          const media = hostMediaFor(s);
          if (!media) return null;
          return (
            <Sequence key={`cam-${s.id}`} from={s.from + s.audioDelay} durationInFrames={talkFrames} name={`facecam:${s.id}`}>
              <FaceCam
                src={media.src}
                kind={media.kind}
                durationInFrames={talkFrames}
                accent={TONES[s.emotionalTone].accent} />
            </Sequence>
          );
        })}
        {plan.music?.src && <Audio src={staticFile(plan.music.src)} volume={plan.music.volume ?? 0.14} loop />}
        <ProgressBar totalFrames={total} accent={accent} />
        <Brand name={plan.channel} />
      </AbsoluteFill>
    );
  }

  // VERTICAL host mode: one persistent face-fronted host + per-scene
  // captions/audio. Scenes with a lip-synced clip play the talking video
  // during the voiced span; the still covers lead-ins, HOLD beats and any
  // scene that was never lip-synced.
  if (plan.host) {
    const hostImage = resolveHostImage(plan.host);
    const pillarbox = false;
    const clipExists = (s: TimedScene) => s.hostClipExists;
    const clipDir = "host";
    const anyTalking = scenes.some(clipExists);
    return (
      <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
        <HostLayer src={hostImage} totalFrames={total} accent={accent} frozen={anyTalking} pillarbox={pillarbox} />
        {scenes.map((s) => {
          // full-length clips (Wan 720p) play through the HOLD beat too, so the
          // host never cuts to the frozen still after speaking; short clips stop
          // at the voiced span and let the still cover the HOLD.
          const talkFrames = s.durationInFrames - s.audioDelay - (plan.hostClipFull ? 0 : s.holdFrames);
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
                    <SceneAudio src={s.audioSrc} audioDelay={s.audioDelay} totalFrames={s.durationInFrames} />
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
