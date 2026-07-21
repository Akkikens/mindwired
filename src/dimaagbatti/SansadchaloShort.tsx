/**
 *  SansadchaloShort — DimaagBatti vertical Short (1080x1920) for the July 20 2026
 *  Delhi protest explainer. Funnels to the long-form (SansadchaloDoc).
 *
 *  Somber, neutral, ATTRIBUTED (same guardrails as the long-form): the students'
 *  side leads (Wangchuk/protester allegation + the strong lathi-charge illustration),
 *  but the police account + "disputed" are on screen too. No press/social photos —
 *  owned somber illustrations on paper + one free-licensed Parliament photo.
 *
 *  Art sits on PAPER (the ink illustrations are white->alpha, made for a light bg).
 *  Rohan Hindi VO per scene; captions in Noto Sans Devanagari. No wordmark intro
 *  (Shorts skip it), no outro (DimaagBatti has none) — ends on the CTA line.
 */
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import "../lib/fonts"; // side-effect: loadFont Noto Sans Devanagari
import doc from "../mindwired-doc/docs/sansadchalo-short.json";
import manifest from "../mindwired-doc/docs/sansadchalo-short.manifest.json";

const FPS = 30;
const LEAD = 8, HOLD = 16; // frames
const HI = "'Noto Sans Devanagari', sans-serif";
const PAPER = "#f2ede3";
const INK = "#1c1a17";
const AMBER = "#FFC53D";

type Scene = { id: string; text: string; img: string; cap?: string; stat?: string };
const SCENES = (doc as { scenes: Scene[] }).scenes;
const DUR = (manifest as { durations: Record<string, number> }).durations;

const aud = (id: string) => DUR[id] ?? 3;
const sceneFrames = (s: Scene) => LEAD + Math.round(aud(s.id) * FPS) + HOLD;
export const sansadchaloShortTotalFrames = () =>
  SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const imgSrc = (img: string) => staticFile(`shorts/sansadchalo-short/images/${img}.png`);
const audSrc = (id: string) => staticFile(`shorts/sansadchalo-short/audio/${id}.mp3`);

const Brand: React.FC = () => (
  <div style={{
    position: "absolute", top: 54, left: 0, right: 0, textAlign: "center",
    fontFamily: HI, fontSize: 34, fontWeight: 700, color: INK, letterSpacing: 0.5,
    opacity: 0.82,
  }}>
    <span style={{ color: AMBER }}>💡</span> दिमाग़बत्ती
  </div>
);

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s);
  // slow Ken Burns push-in on the art
  const scale = interpolate(frame, [0, dur], [1.0, 1.06], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, dur], [-8, 8], { extrapolateRight: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 16 } });
  const statAppear = LEAD + Math.round(aud(s.id) * 0.4 * FPS);
  const statS = spring({ frame: frame - statAppear, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const fade = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const underline = interpolate(capIn, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(120% 90% at 50% 34%, #fbf7ef 0%, ${PAPER} 62%, #e6ded0 100%)`,
      opacity: fade,
    }}>
      <Brand />
      {/* illustration on paper, upper region, fully visible (contain) */}
      <div style={{
        position: "absolute", top: 150, left: 60, right: 60, height: 1120,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <Img src={imgSrc(s.img)} style={{
          maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
          transform: `scale(${scale}) translateY(${drift}px)`,
          filter: "drop-shadow(0px 10px 0px rgba(28,26,23,0.10))",
        }} />
      </div>

      {/* big stat (accurate, crisp — never AI-drawn) */}
      {s.stat && (
        <div style={{
          position: "absolute", top: 1150, left: 60, right: 60, textAlign: "center",
          fontFamily: HI, fontSize: 66, fontWeight: 800, color: INK, lineHeight: 1.1,
          transform: `scale(${0.9 + 0.1 * statS})`, opacity: statS,
        }}>
          {s.stat.split("·").map((part, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: AMBER }}> · </span>}
              {part.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Hindi caption plate (bottom) */}
      {s.cap && (
        <div style={{
          position: "absolute", bottom: 210, left: 70, right: 70, textAlign: "center",
          transform: `translateY(${(1 - capIn) * 28}px)`, opacity: capIn,
        }}>
          <div style={{
            fontFamily: HI, fontSize: 58, fontWeight: 800, color: INK, lineHeight: 1.22,
          }}>
            {s.cap}
          </div>
          <div style={{
            height: 8, background: AMBER, borderRadius: 4, marginTop: 18,
            width: `${underline * 62}%`, marginLeft: "auto", marginRight: "auto",
          }} />
        </div>
      )}

      <Sequence from={LEAD}><Audio src={audSrc(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const SansadchaloShort: React.FC = () => {
  const { fps } = useVideoConfig();
  let cursor = 0;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {SCENES.map((s) => {
        const from = cursor;
        const dur = sceneFrames(s);
        cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneView s={s} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
