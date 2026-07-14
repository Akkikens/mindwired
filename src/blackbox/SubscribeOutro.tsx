/** Black Box Breakdown — subscribe outro (16:9, 1920×1080, ~16s).
 *
 *  Two Veo talking-head clips of the host (Reid) delivering a sincere subscribe
 *  ask, back to back, with persistent BLACK BOX branding + a subscribe pill and
 *  the @Watch-BlackBox handle. Rendered once → assets/subscribe-outro/.
 */
import React from "react";
import {
  AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const CLIP = 240; // 8s each
export const subscribeBlackBoxFrames = CLIP * 2;
const ACCENT = "#FF9500";
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";

const HostClip: React.FC<{ file: string }> = ({ file }) => (
  <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
    <OffthreadVideo
      src={staticFile(`outro/${file}`)}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }}
    />
  </AbsoluteFill>
);

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 44, right: 56, display: "flex", alignItems: "center", gap: 12, opacity: 0.92 }}>
    <div style={{ width: 15, height: 15, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 16px ${ACCENT}` }} />
    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: 1 }}>Black Box</span>
  </div>
);

export const SubscribeBlackBoxLong: React.FC = () => {
  const frame = useCurrentFrame();
  const kicker = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillIn = spring({ frame: frame - 54, fps: FPS, config: { damping: 15 } });
  const pulse = 1 + 0.035 * Math.sin(frame / 7);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
      <Sequence from={0} durationInFrames={CLIP}><HostClip file="reid_outro_1.mp4" /></Sequence>
      <Sequence from={CLIP} durationInFrames={CLIP}><HostClip file="reid_outro_2.mp4" /></Sequence>

      {/* cinematic scrims */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.55) 0%, transparent 20%, transparent 52%, rgba(5,7,12,0.92) 100%)", pointerEvents: "none" }} />

      <Brand />

      {/* kicker top-left */}
      <div style={{ position: "absolute", top: 116, left: 96, opacity: kicker,
        transform: `translateY(${interpolate(kicker, [0, 1], [16, 0])}px)` }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: ACCENT }}>BEFORE YOU GO</span>
      </div>

      {/* subscribe pill + handle bottom-left */}
      <div style={{ position: "absolute", bottom: 92, left: 96, display: "flex", alignItems: "center", gap: 28,
        opacity: pillIn, transform: `translateY(${interpolate(pillIn, [0, 1], [40, 0])}px)` }}>
        <div style={{ transform: `scale(${pulse})`, transformOrigin: "left center",
          background: ACCENT, color: "#0A0A0A", fontFamily: DISPLAY, fontWeight: 700, fontSize: 58,
          letterSpacing: 2, padding: "18px 46px", borderRadius: 16,
          boxShadow: `0 10px 40px ${ACCENT}66`, display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 52 }}>▶</span> SUBSCRIBE
        </div>
        <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: "#fff", textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
          @Watch-BlackBox
        </span>
      </div>
    </AbsoluteFill>
  );
};
