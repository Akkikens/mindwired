/**
 * RainStream — the 24/7 space sleep-stream visual.
 *
 * The rain lives in the AUDIO, not the picture. An earlier cut animated
 * droplets on the glass and Akshay's verdict was blunt and correct — at
 * sleep-stream scale they read as floating blobs, not water. So the visual
 * is now what actually worked: a slow drift through deep-space vistas seen
 * from a spacecraft window, and nothing else.
 *
 * SEAMLESS BY CONSTRUCTION. Every animated value is periodic over LOOP_SEC,
 * so frame(LOOP_SEC*FPS) === frame(0):
 *   - the plate cycle completes a whole rotation (last plate crossfades
 *     back into the first)
 *   - parallax drift and breathing zoom use full sine periods
 * That's why this is code, not a generated clip: a generated clip jumps at
 * the splice, which is unwatchable on a stream that runs for months.
 */
import React from "react";
import {
  AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

/** 5 plates × 36s on screen each. Long dwell = restful; short = agitating. */
export const LOOP_SEC = 180;
const ACCENT = "#4DD8FF";

export const PLATES = [
  "rain/plates/nebula.png",
  "rain/plates/earthlimb.png",
  "rain/plates/ringed_planet.png",
  "rain/plates/deepstars.png",
  "rain/plates/moonrise.png",
];

/** smoothstep — eases the crossfade so plates melt rather than dissolve linearly */
const smooth = (x: number) => x * x * (3 - 2 * x);

export const RainStream: React.FC<{ plates?: string[] }> = ({
  plates = PLATES,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const loopFrames = LOOP_SEC * fps;
  const t = (frame % loopFrames) / loopFrames;          // 0..1
  const N = plates.length;

  // which plate is on screen, and how far into its handover
  const s = t * N;
  const idx = Math.floor(s) % N;
  const frac = smooth(s - Math.floor(s));

  // gentle motion — full sine periods so it returns exactly to start
  const driftX = Math.sin(t * Math.PI * 2) * 22;
  const driftY = Math.cos(t * Math.PI * 2) * 12;
  const zoom = 1.07 + Math.sin(t * Math.PI * 2) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a" }}>
      {plates.map((src, i) => {
        // only the outgoing and incoming plates are visible at any moment
        const op = i === idx ? 1 - frac : i === (idx + 1) % N ? frac : 0;
        if (op <= 0.001) return null;
        const dir = i % 2 === 0 ? 1 : -1;   // alternate drift direction per plate
        return (
          <AbsoluteFill key={src} style={{ opacity: op }}>
            <Img
              src={staticFile(src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoom}) translate(${driftX * dir}px, ${driftY}px)`,
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* faint glass sheen across the pane — the only nod to the window being glazed */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(112deg, rgba(160,210,240,0.045) 0%, rgba(160,210,240,0) 40%, rgba(160,210,240,0) 62%, rgba(160,210,240,0.03) 100%)",
        }}
      />

      {/* ── spacecraft window bezel, drawn in code ────────────────────────
          One div whose enormous box-shadow floods everything outside its
          rounded rect with hull black. Identical on every plate, unlike a
          frame baked into a generated image. */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "80%",
            height: "70%",
            marginTop: "6%",
            borderRadius: Math.round(width * 0.055),
            boxShadow: [
              `0 0 0 ${Math.round(width * 0.02)}px #0a0d12`,
              `0 0 0 ${Math.round(width * 0.028)}px #12171f`,
              `0 0 0 9999px #05070a`,
              `inset 0 0 ${Math.round(width * 0.05)}px rgba(0,0,0,0.85)`,
              `inset 0 ${Math.round(height * 0.004)}px ${Math.round(width * 0.012)}px rgba(150,200,230,0.10)`,
            ].join(", "),
          }}
        />
      </AbsoluteFill>

      {/* lit metal edge so the bezel reads as hardware, not a vignette */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "80%",
            height: "70%",
            marginTop: "6%",
            borderRadius: Math.round(width * 0.055),
            border: "1px solid rgba(140,190,225,0.16)",
            boxShadow: `inset 0 0 ${Math.round(width * 0.03)}px rgba(90,150,190,0.06)`,
          }}
        />
      </AbsoluteFill>

      {/* warm interior lamp, low-left, on the hull outside the glass */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(38% 34% at 9% 92%, rgba(255,168,92,0.15) 0%, rgba(255,168,92,0) 100%)",
        }}
      />
      {/* vignette — keeps the eye off the edges for night viewing */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 88% at 50% 50%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.5) 86%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── mindwired wordmark, on the hull above the bezel ─────────────── */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: height * 0.045,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: width * 0.011 }}>
          <div
            style={{
              width: width * 0.0075,
              height: width * 0.0075,
              borderRadius: "50%",
              background: ACCENT,
              boxShadow: `0 0 ${width * 0.014}px ${ACCENT}`,
              opacity: 0.55 + 0.25 * Math.sin(t * Math.PI * 2),
            }}
          />
          <div
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: width * 0.0225,
              letterSpacing: width * 0.0052,
              color: "rgba(255,255,255,0.90)",
              textShadow: "0 2px 30px rgba(0,0,0,0.85)",
            }}
          >
            mindwired
          </div>
        </div>
        <div
          style={{
            marginTop: height * 0.016,
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: width * 0.0088,
            letterSpacing: width * 0.0042,
            color: "rgba(180,215,235,0.42)",
            textTransform: "uppercase",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          rain in deep space · sleep · study · relax
        </div>
      </AbsoluteFill>

      {/* film grain so the gradients don't band on YouTube's encoder */}
      <AbsoluteFill
        style={{
          opacity: 0.035,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>\")",
        }}
      />
    </AbsoluteFill>
  );
};
