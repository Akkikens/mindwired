/** mindwired — "How AI Video Generation Works" (16:9, 1920×1080).
 *  6 Gemini-generated isometric flat-vector stills (public/aivideo/images/b*.png),
 *  each with a slow Ken-Burns push + a kinetic keyword + a one-line caption, synced
 *  to per-block Cartesia narration (Orion clone, public/aivideo/audio/b*.mp3).
 *  All motion + text is Remotion (free); the AI only made the still art. */
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const TEAL = "#3DE0D0";
const NAVY = "#0B1830";

type Scene = { id: string; aud: number; key: string; cap: string; pan: 1 | -1 };
const SCENES: Scene[] = [
  { id: "b1", aud: 8.281, key: "TEXT → VIDEO",           cap: "It looks like magic — it's really a guessing game.",  pan: 1 },
  { id: "b2", aud: 8.516, key: "LATENT SPACE",           cap: "Video is squeezed into a small, dense code.",         pan: -1 },
  { id: "b3", aud: 8.046, key: "DENOISING",              cap: "From pure static, strip the noise away.",             pan: 1 },
  { id: "b4", aud: 7.967, key: "DIFFUSION TRANSFORMER",  cap: "Cut into cubes across space and time.",               pan: -1 },
  { id: "b5", aud: 8.046, key: "TEMPORAL CONSISTENCY",   cap: "Objects and light stay steady across frames.",        pan: 1 },
  { id: "b6", aud: 7.811, key: "THE CATCH",              cap: "Long clips are costly — so most stay short.",         pan: -1 },
];

const LEAD = 10, HOLD = 16;
const sceneFrames = (s: Scene) => LEAD + Math.round(s.aud * FPS) + HOLD;
export const aiVideoTotalFrames = () => SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const img = (id: string) => staticFile(`aivideo/images/${id}.png`);
const aud = (id: string) => staticFile(`aivideo/audio/${id}.mp3`);

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s);
  const t = frame / dur;

  // Ken Burns: slow push-in + gentle horizontal drift (alternating per scene).
  const scale = interpolate(t, [0, 1], [1.06, 1.14]);
  const driftX = interpolate(t, [0, 1], [0, s.pan * 26]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });

  // keyword pops shortly after the line starts
  const keyAt = LEAD + 6;
  const keySp = spring({ frame: frame - keyAt, fps: FPS, config: { damping: 13, stiffness: 140 } });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <Img src={img(s.id)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translateX(${driftX}px)` }} />
      </AbsoluteFill>
      {/* readability scrims */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,24,48,0.55) 0%, transparent 26%, transparent 62%, rgba(11,24,48,0.9) 100%)", pointerEvents: "none" }} />

      {/* kinetic keyword (top-left) */}
      <div style={{
        position: "absolute", top: 90, left: 96, transformOrigin: "left center",
        transform: `translateY(${interpolate(keySp, [0, 1], [26, 0])}px) scale(${interpolate(keySp, [0, 1], [0.9, 1])})`,
        opacity: interpolate(frame - keyAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ display: "inline-block", borderLeft: `6px solid ${TEAL}`, paddingLeft: 20 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 68, color: "#fff", letterSpacing: 0.5, lineHeight: 1.05, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{s.key}</div>
        </div>
      </div>

      {/* caption (bottom) */}
      <div style={{
        position: "absolute", bottom: 96, left: 96, right: 96,
        transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn,
      }}>
        <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 44, color: "#EAF6FF", lineHeight: 1.35, textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>{s.cap}</div>
      </div>

      <Sequence from={LEAD}><Audio src={aud(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const HowAIVideo: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {SCENES.map((s) => {
        const from = cursor; const dur = sceneFrames(s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneView s={s} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
