/** Flat 2D icon-grid diagram for the "Every Type of Black Hole, Explained" doc.
 *
 *  Deliberately NOT the blueprint/engineering-diagram look used by Diagrams.tsx's
 *  aviation set, and NOT the WebGL cosmic engine — a flat, solid-color icon per
 *  black hole type (disk + accretion ring + type-specific glyphs), config-driven
 *  off one BLACKHOLE_TYPES table so 13 types share one component.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";

const FPS = 30;
const BG = "#0B0A14";

export type BHDiagProps = { dur: number; arg?: string; accent: string };

type BHType = {
  label: string;
  radius: number;
  ringColor: string;
  jets?: boolean;
  twin?: "star" | "bh";
  dashedHorizon?: boolean;
  pulse?: boolean;
  compare?: string; // small comparison caption under the icon
};

const BLACKHOLE_TYPES: Record<string, BHType> = {
  planck: { label: "PLANCK BLACK HOLE", radius: 10, ringColor: "#7CE3FF", pulse: true, compare: "smaller than a proton" },
  primordial: { label: "PRIMORDIAL BLACK HOLE", radius: 46, ringColor: "#B98CFF", compare: "born before the first star" },
  micro: { label: "MICRO BLACK HOLE", radius: 22, ringColor: "#7CE3FF", pulse: true, compare: "lighter than a mountain" },
  stellar: { label: "STELLAR MASS BLACK HOLE", radius: 90, ringColor: "#4DD8FF", compare: "5-100x the mass of our sun" },
  xraybinary: { label: "X-RAY BINARY BLACK HOLE", radius: 80, ringColor: "#FF9A4D", twin: "star", compare: "feeding off a living star" },
  rogue: { label: "ROGUE BLACK HOLE", radius: 90, ringColor: "#6E7A8C", compare: "ejected from its home galaxy" },
  binary: { label: "BINARY BLACK HOLE", radius: 78, ringColor: "#FF6B6B", twin: "bh", compare: "two, locked in a death spiral" },
  intermediate: { label: "INTERMEDIATE-MASS BLACK HOLE", radius: 130, ringColor: "#4DD8FF", compare: "the missing-link black hole" },
  supermassive: { label: "SUPERMASSIVE BLACK HOLE", radius: 210, ringColor: "#FFC53D", compare: "anchors an entire galaxy" },
  quasar: { label: "QUASAR", radius: 190, ringColor: "#FFD84D", jets: true, compare: "a black hole, caught feeding" },
  blazar: { label: "BLAZAR", radius: 190, ringColor: "#FF4D6B", jets: true, compare: "its jet, aimed at Earth" },
  ultramassive: { label: "ULTRAMASSIVE BLACK HOLE", radius: 320, ringColor: "#FF9A4D", compare: "bigger than our solar system" },
  nakedsingularity: { label: "NAKED SINGULARITY", radius: 60, ringColor: "#FF4D4D", dashedHorizon: true, compare: "a singularity with no horizon" },
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const BlackHoleIcon: React.FC<BHDiagProps> = ({ arg, accent }) => {
  const f = useCurrentFrame();
  const t = BLACKHOLE_TYPES[arg ?? "stellar"] ?? BLACKHOLE_TYPES.stellar;
  const pop = spring({ frame: f, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const spin = f * 0.9;
  const pulseR = t.pulse ? 1 + 0.08 * Math.sin(f * 0.35) : 1;
  const R = t.radius * scale * pulseR;
  const cx = 960, cy = 480;

  // accretion disk: a flat ellipse ring rotating around the disk
  const diskRy = R * 0.32 + 14;
  const diskRx = R * 1.9 + 60;

  // jets (quasar / blazar): two flat elongated triangles, animated stretch
  const jetLen = t.jets ? interpolate(f, [10, 60], [R * 1.4, R * 5.2], clamp) : 0;

  // companion (x-ray binary / binary black hole): orbits the main disk
  const orbitAngle = f * 0.03;
  const orbitR = R * 2.6 + 90;
  const compX = cx + Math.cos(orbitAngle) * orbitR;
  const compY = cy + Math.sin(orbitAngle) * orbitR * 0.4;

  const labelIn = spring({ frame: f - 8, fps: FPS, config: { damping: 16 } });
  const compareIn = spring({ frame: f - 22, fps: FPS, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, ${t.ringColor}14 0%, transparent 60%)` }} />
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* jets, drawn behind the disk */}
        {t.jets && (
          <g opacity={interpolate(f, [0, 20], [0, 0.85], clamp)}>
            <polygon points={`${cx - R * 0.3},${cy} ${cx + R * 0.3},${cy} ${cx},${cy - jetLen}`} fill={t.ringColor} opacity={0.55} />
            <polygon points={`${cx - R * 0.3},${cy} ${cx + R * 0.3},${cy} ${cx},${cy + jetLen}`} fill={t.ringColor} opacity={0.55} />
          </g>
        )}

        {/* accretion disk ring — split into a back half (clipped behind the
            hole) and a front half (drawn on top), so the ring reads as
            wrapping AROUND the sphere instead of a flat halo pasted over it */}
        <defs>
          <clipPath id="bhTopHalf"><rect x="0" y="0" width="1920" height={cy} /></clipPath>
          <clipPath id="bhBottomHalf"><rect x="0" y={cy} width="1920" height={1080 - cy} /></clipPath>
        </defs>
        <g clipPath="url(#bhTopHalf)">
          <ellipse cx={cx} cy={cy} rx={diskRx} ry={diskRy} fill="none" stroke={t.ringColor}
            strokeWidth={Math.max(14, R * 0.16)} opacity={0.22}
            transform={`rotate(${spin % 360} ${cx} ${cy})`} />
          <ellipse cx={cx} cy={cy} rx={diskRx} ry={diskRy} fill="none" stroke={t.ringColor}
            strokeWidth={Math.max(4, R * 0.055)} opacity={0.9}
            transform={`rotate(${spin % 360} ${cx} ${cy})`} />
        </g>

        {/* the black hole disk itself */}
        <circle cx={cx} cy={cy} r={R} fill="#000"
          stroke={t.dashedHorizon ? t.ringColor : "#000"}
          strokeWidth={t.dashedHorizon ? 4 : 0}
          strokeDasharray={t.dashedHorizon ? "10 10" : undefined} />

        <g clipPath="url(#bhBottomHalf)">
          <ellipse cx={cx} cy={cy} rx={diskRx} ry={diskRy} fill="none" stroke={t.ringColor}
            strokeWidth={Math.max(14, R * 0.16)} opacity={0.22}
            transform={`rotate(${spin % 360} ${cx} ${cy})`} />
          <ellipse cx={cx} cy={cy} rx={diskRx} ry={diskRy} fill="none" stroke={t.ringColor}
            strokeWidth={Math.max(4, R * 0.055)} opacity={0.9}
            transform={`rotate(${spin % 360} ${cx} ${cy})`} />
        </g>

        {/* companion star / black hole (x-ray binary, binary bh) */}
        {t.twin && (
          <>
            <line x1={cx} y1={cy} x2={compX} y2={compY} stroke={t.ringColor} strokeWidth="2" strokeDasharray="6 10" opacity={0.4} />
            {t.twin === "star" ? (
              <circle cx={compX} cy={compY} r={26} fill="#FFE9B0" opacity={0.95} />
            ) : (
              <circle cx={compX} cy={compY} r={R * 0.55} fill="#000" stroke={t.ringColor} strokeWidth="4" />
            )}
          </>
        )}
      </svg>

      {/* label — parked below the DocWide stat chrome (top:118, ~80px tall) so long stat text never overlaps it */}
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center",
        transform: `translateY(${interpolate(labelIn, [0, 1], [16, 0])}px)`, opacity: labelIn }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 44,
          letterSpacing: 3, color: "#fff" }}>{t.label}</span>
      </div>

      {/* comparison caption under the icon */}
      {t.compare && (
        <div style={{ position: "absolute", bottom: 210, left: 0, right: 0, textAlign: "center",
          transform: `translateY(${interpolate(compareIn, [0, 1], [14, 0])}px)`, opacity: compareIn * 0.9 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 30,
            color: t.ringColor, letterSpacing: 1 }}>{t.compare}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
