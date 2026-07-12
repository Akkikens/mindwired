/** DimaagBatti — "रुपया क्यों गिर रहा है" (why the rupee keeps falling).
 *  Whiteboard hand-drawing b-roll (Higgsfield) as the backdrop, with ALL facts
 *  overlaid crisply in Remotion — real ₹ symbols, real numbers, and Hindi
 *  captions in Noto Sans Devanagari (the AI never draws symbols/text, so nothing
 *  is garbled). Rohan Hindi narration per scene. 1080×1920.
 *
 *  Build the audio first (Rohan/hi) into public/shorts/rupya/audio/<id>.mp3 and
 *  the whiteboard clips into public/shorts/rupya/broll-video/<id>.mp4. */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";

const FPS = 30;
const HI = "'Noto Sans Devanagari', sans-serif";
const NUM = "'Space Grotesk', sans-serif";
const YELLOW = "#FFC53D";  // DimaagBatti bulb glow
const RED = "#FF4D4D";
const INK = "#141414";

// clip = whiteboard b-roll (5.04s each), aud = Rohan Hindi mp3 duration (s).
// cap = Hindi caption; stat = big accurate overlay (real ₹/numbers, never AI-drawn).
type Scene = { id: string; aud: number; cap: string; stat?: string; statColor?: string };
const SCENES: Scene[] = [
  { id: "hook",      aud: 4.127, cap: "रुपया लगातार क्यों गिर रहा है?", stat: "₹ ↓", statColor: RED },
  { id: "climb",     aud: 5.329, cap: "एक डॉलर की कीमत", stat: "₹4  →  ₹88+", statColor: RED },
  { id: "scale",     aud: 3.396, cap: "असली वजह: मांग और आपूर्ति", stat: "डॉलर की मांग ↑", statColor: INK },
  { id: "oil",       aud: 5.486, cap: "भारत ज़्यादातर तेल विदेश से खरीदता है", stat: "तेल = डॉलर में", statColor: INK },
  { id: "trade",     aud: 6.191, cap: "आयात, निर्यात से ज़्यादा", stat: "आयात > निर्यात", statColor: RED },
  { id: "inflation", aud: 6.844, cap: "महंगाई बढ़ी — रुपया और गिरा", stat: "महंगाई ↑   ₹ ↓", statColor: RED },
];
const LEAD = 6, HOLD = 18; // frames
const sceneFrames = (s: Scene) => LEAD + Math.round(s.aud * FPS) + HOLD;

export const rupeeTotalFrames = () => SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const clip = (id: string) => staticFile(`shorts/rupya/broll-video/${id}.mp4`);
const audio = (id: string) => staticFile(`shorts/rupya/audio/${id}.mp3`);

/** DimaagBatti bulb watermark (top-right). */
const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 46, right: 44, display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ fontSize: 30 }}>💡</span>
    <span style={{ fontFamily: NUM, fontWeight: 700, fontSize: 26, color: INK, letterSpacing: 0.5 }}>DimaagBatti</span>
  </div>
);

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s);
  const clipSpan = dur / FPS;
  const rate = Math.max(0.5, Math.min(1.6, 5.04 / clipSpan)); // fit 5s clip to scene
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 16 } });
  const statAppear = LEAD + Math.round(s.aud * 0.45 * FPS);
  const statS = spring({ frame: frame - statAppear, fps: FPS, config: { damping: 11, stiffness: 130 } });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4F1EA", opacity: fadeOut }}>
      <AbsoluteFill>
        <OffthreadVideo src={clip(s.id)} muted playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* warm bulb vignette (brand) */}
      <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 42%, ${YELLOW}22 0%, transparent 60%)`, mixBlendMode: "multiply", pointerEvents: "none" }} />
      <Brand />

      {/* big accurate stat overlay (real ₹/numbers — never AI-drawn) */}
      {s.stat && (
        <div style={{
          position: "absolute", top: 250, left: 0, right: 0, textAlign: "center",
          transform: `scale(${interpolate(statS, [0, 1], [0.7, 1])})`, opacity: interpolate(frame - statAppear, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <span style={{
            fontFamily: HI, fontWeight: 800, fontSize: 92, color: s.statColor ?? INK,
            background: "#FFFFFFdd", padding: "8px 26px", borderRadius: 18,
            boxShadow: "0 8px 30px rgba(0,0,0,0.18)", lineHeight: 1.25,
            WebkitTextStroke: s.statColor === RED ? "0" : "0",
          }}>{s.stat}</span>
        </div>
      )}

      {/* Hindi caption plate (bottom) */}
      <div style={{
        position: "absolute", bottom: 210, left: 60, right: 60,
        transform: `translateY(${interpolate(capIn, [0, 1], [40, 0])}px)`, opacity: capIn,
      }}>
        <div style={{
          background: INK, color: "#fff", fontFamily: HI, fontWeight: 700, fontSize: 52,
          lineHeight: 1.4, textAlign: "center", padding: "20px 30px", borderRadius: 22,
          boxShadow: "0 10px 34px rgba(0,0,0,0.28)", borderBottom: `6px solid ${YELLOW}`,
        }}>{s.cap}</div>
      </div>

      <Sequence from={LEAD}><Audio src={audio(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const RupeeShort: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4F1EA" }}>
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
