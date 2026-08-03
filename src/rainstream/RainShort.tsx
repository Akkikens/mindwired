/**
 * RainShort — vertical (1080x1920) Shorts cut from the space-rain stream.
 *
 * Purpose: Shorts bypass channel authority (they're judged on their own
 * first 3 seconds), which makes them the one proven cold-start mechanism for
 * a small channel's live stream. Each Short is a slow drift over ONE space
 * plate with a hook line and a "watch live" CTA pointing at the 24/7 stream.
 *
 * Deliberately simple and quiet — a loud, cut-heavy Short would misrepresent
 * what the viewer gets when they click through to a sleep stream, and
 * mismatched expectations tank retention on the destination.
 */
import React from "react";
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate,
} from "remotion";

const ACCENT = "#4DD8FF";

export type RainShortProps = {
  plate: string;      // e.g. "rain/plates/nebula.png"
  hook: string;       // top line — the scroll-stopper
  sub?: string;       // small supporting line
};

export const RainShort: React.FC<RainShortProps> = ({
  plate = "rain/plates/nebula.png",
  hook = "rain, 250 miles above earth",
  sub = "24/7 · sleep · study",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  // slow continuous push — no cuts, matches the calm of the destination
  const zoom = 1.12 + t * 0.10;
  const driftY = interpolate(t, [0, 1], [-14, 14]);

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ctaIn = interpolate(frame, [fps * 2.2, fps * 3.0], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a" }}>
      <AbsoluteFill>
        <Img
          src={staticFile(plate)}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${zoom}) translateY(${driftY}px)`,
          }}
        />
      </AbsoluteFill>

      {/* top + bottom scrims so text always reads */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 26%, rgba(0,0,0,0.15) 66%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* hook */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: height * 0.11,
          paddingLeft: width * 0.08,
          paddingRight: width * 0.08,
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: width * 0.082,
            lineHeight: 1.14,
            letterSpacing: -width * 0.001,
            color: "#fff",
            textAlign: "center",
            textShadow: "0 4px 40px rgba(0,0,0,0.95)",
            textTransform: "lowercase",
          }}
        >
          {hook}
        </div>
        {sub && (
          <div
            style={{
              marginTop: height * 0.018,
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 500,
              fontSize: width * 0.030,
              letterSpacing: width * 0.006,
              color: "rgba(190,220,240,0.62)",
              textTransform: "uppercase",
              textShadow: "0 2px 24px rgba(0,0,0,0.9)",
            }}
          >
            {sub}
          </div>
        )}
      </AbsoluteFill>

      {/* CTA — arrives late so the visual lands first */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: height * 0.13,
          opacity: ctaIn,
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "center", gap: width * 0.022,
            padding: `${height * 0.014}px ${width * 0.055}px`,
            borderRadius: 999,
            background: "rgba(8,12,18,0.72)",
            border: `1px solid rgba(77,216,255,0.35)`,
            boxShadow: `0 0 ${width * 0.05}px rgba(77,216,255,0.16)`,
          }}
        >
          <div
            style={{
              width: width * 0.020, height: width * 0.020, borderRadius: "50%",
              background: "#ff3b30",
              boxShadow: "0 0 18px rgba(255,59,48,0.9)",
              opacity: 0.6 + 0.4 * Math.sin(frame / 5),
            }}
          />
          <div
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: width * 0.036,
              letterSpacing: width * 0.003,
              color: "#fff",
            }}
          >
            watching live now
          </div>
        </div>
        <div
          style={{
            marginTop: height * 0.014,
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: width * 0.026,
            letterSpacing: width * 0.004,
            color: ACCENT,
            opacity: 0.85,
          }}
        >
          @MINDWIREDD
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
