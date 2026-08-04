/** Criminal Record — code-generated evidence animation.
 *
 *  These exist because this channel has no footage pool: state criminal cases
 *  produce world-class documents and essentially no free film (see
 *  docs/guides/CRIMINALRECORD-CHANNEL-BRIEF.md). Rather than fill the gap with
 *  stock b-roll, motion comes from visualising the record itself.
 *
 *  THE LINE, and it is not negotiable: these visualise EVIDENCE AND CHRONOLOGY.
 *  They never reconstruct a crime. No figures, no rooms, no weapons, no
 *  dramatised attack. Everything here is deliberately schematic — a diagram
 *  reads as a diagram, while a photoreal recreation reads as a claim about what
 *  happened.
 *
 *    CaseTimeline   — a clock band that fills; marks stamped at documented times
 *    RouteMap       — a schematic path drawing itself between labelled points
 *    GenealogyTree  — nodes expanding from an unknown profile to a named match
 *
 *  All three take their data from the doc spec, so every frame traces to a line
 *  in the CLAIMS file.
 */
import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import "../lib/fonts";

const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";

/** Shared dark plate + faint grid, so all three read as one system. */
const Plate: React.FC<{ children: React.ReactNode; accent: string }> = ({ children, accent }) => (
  <AbsoluteFill style={{ backgroundColor: "#05080F" }}>
    <AbsoluteFill style={{
      background: "radial-gradient(115% 85% at 50% 25%, #0E1B33 0%, #05080F 72%)",
    }} />
    <AbsoluteFill style={{
      opacity: 0.10,
      backgroundImage:
        `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
      backgroundSize: "88px 88px",
    }} />
    {children}
  </AbsoluteFill>
);

const Cap: React.FC<{ text?: string; accent: string }> = ({ text, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - 4, fps, config: { damping: 18 } });
  if (!text) return null;
  return (
    <div style={{
      position: "absolute", bottom: 96, left: 120, right: 120, textAlign: "center",
      opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [22, 0])}px)`,
    }}>
      <span style={{
        fontFamily: BODY, fontWeight: 700, fontSize: 46, lineHeight: 1.3, color: "#fff",
        textShadow: "0 3px 24px rgba(0,0,0,0.9)",
      }}>{text}</span>
      <div style={{ width: 92, height: 5, background: accent, borderRadius: 3, margin: "26px auto 0" }} />
    </div>
  );
};

/* ------------------------------------------------------------------ timeline */

export type TimelineMark = { at: string; label: string; emphasis?: boolean };

/** A documented chronology. `marks` are stamped in order as the band fills.
 *  Times are strings straight from the record ("4:19 a.m.") — never computed,
 *  so nothing can drift away from what the filing actually says. */
export const CaseTimeline: React.FC<{
  marks: TimelineMark[]; title?: string; cap?: string; accent: string; sceneDur: number;
}> = ({ marks, title, cap, accent, sceneDur }) => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const settle = Math.round(sceneDur * 0.72);
  const fill = interpolate(f, [12, settle], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const x0 = width * 0.11, x1 = width * 0.89, y = 560;
  return (
    <Plate accent={accent}>
      {title && (
        <div style={{
          position: "absolute", top: 118, left: 0, right: 0, textAlign: "center",
          fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: accent,
        }}>{title.toUpperCase()}</div>
      )}
      {/* the band */}
      <div style={{ position: "absolute", left: x0, top: y, width: x1 - x0, height: 6,
        background: "rgba(207,224,255,0.16)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: x0, top: y, width: (x1 - x0) * fill, height: 6,
        background: accent, borderRadius: 3, boxShadow: `0 0 26px ${accent}` }} />
      {marks.map((m, i) => {
        // a single mark centres instead of collapsing onto the left edge, where
        // its label ran off frame and sat on top of the band (caught on a still)
        const t = marks.length > 1 ? i / (marks.length - 1) : 0.5;
        const mx = x0 + (x1 - x0) * t;
        // a lone mark lands immediately — it's usually the cold open, and waiting
        // for the band to fill left the first seconds of the video nearly empty
        const solo = marks.length === 1;
        const reached = solo || fill >= t - 0.001;
        const sp = spring({
          frame: solo ? f - 6 : f - 12 - Math.round((settle - 12) * t),
          fps, config: { damping: 16 },
        });
        const o = reached ? sp : 0;
        const up = i % 2 === 0;
        return (
          <div key={`${m.at}-${i}`}>
            <div style={{
              position: "absolute", left: mx - 9, top: y - 7,
              width: 20, height: 20, borderRadius: "50%",
              background: m.emphasis ? accent : "#0B1526",
              border: `4px solid ${accent}`, opacity: o,
              transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`,
              boxShadow: m.emphasis ? `0 0 30px ${accent}` : "none",
            }} />
            <div style={{
              // anchored so a two-line label grows AWAY from the band instead of
              // through it: above-marks bottom-align, below-marks top-align
              position: "absolute", left: mx - 165, width: 330, textAlign: "center",
              ...(up ? { bottom: undefined, top: y - 232, height: 200,
                         display: "flex", flexDirection: "column",
                         justifyContent: "flex-end" as const }
                     : { top: y + 52, height: 200 }),
              opacity: o,
              transform: `translateY(${interpolate(sp, [0, 1], [up ? 16 : -16, 0])}px)`,
            }}>
              <div style={{
                fontFamily: DISPLAY, fontWeight: 800,
                fontSize: m.emphasis ? 58 : 46,
                color: m.emphasis ? accent : "#fff",
              }}>{m.at}</div>
              <div style={{
                fontFamily: BODY, fontWeight: 500, fontSize: 25, lineHeight: 1.28,
                color: "rgba(226,238,255,0.80)", marginTop: 6,
              }}>{m.label}</div>
            </div>
          </div>
        );
      })}
      <Cap text={cap} accent={accent} />
    </Plate>
  );
};

/* --------------------------------------------------------------------- route */

export type RoutePoint = { x: number; y: number; label: string; at?: string };

/** A schematic route between labelled points — NOT a photoreal map. Coordinates
 *  are 0-1 fractions of the frame, authored in the doc spec. Used for movements
 *  that appear in a filing (e.g. a vehicle observed at two times). */
export const RouteMap: React.FC<{
  points: RoutePoint[]; title?: string; cap?: string; accent: string; sceneDur: number;
}> = ({ points, title, cap, accent, sceneDur }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const draw = interpolate(f, [4, Math.round(sceneDur * 0.62)], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const px = (p: RoutePoint) => ({ x: p.x * width, y: p.y * height });
  // polyline length-fraction rendering via stroke-dash
  const d = points.map((p, i) => `${i ? "L" : "M"}${px(p).x},${px(p).y}`).join(" ");
  return (
    <Plate accent={accent}>
      {title && (
        <div style={{
          position: "absolute", top: 112, left: 0, right: 0, textAlign: "center",
          fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: accent,
        }}>{title.toUpperCase()}</div>
      )}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(207,224,255,0.34)" strokeWidth={5}
          strokeDasharray="14 12" />
        <path d={d} fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 16px ${accent})` }} />
      </svg>
      {points.map((p, i) => {
        const t = points.length > 1 ? i / (points.length - 1) : 0;
        const sp = spring({ frame: f - 4 - Math.round(t * 34), fps, config: { damping: 16 } });
        // first point is present from the opening frames; later ones arrive as the
        // path reaches them (never an empty frame at scene start)
        const o = i === 0 || draw >= t - 0.02 ? sp : 0;
        const { x, y } = px(p);
        return (
          <div key={`${p.label}-${i}`} style={{ position: "absolute", left: x - 190, top: y - 96,
            width: 380, textAlign: "center", opacity: o }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: "#0B1526",
              border: `5px solid ${accent}`, margin: "0 auto", position: "relative", top: 84,
              boxShadow: `0 0 24px ${accent}`,
            }} />
            {p.at && (
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: accent }}>
                {p.at}
              </div>
            )}
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 28, color: "#fff", marginTop: 4 }}>
              {p.label}
            </div>
          </div>
        );
      })}
      <Cap text={cap} accent={accent} />
    </Plate>
  );
};

/* ------------------------------------------------------------------ genealogy */

/** Investigative genetic genealogy, as a tree opening outward from an unknown
 *  profile to a named match. Generations are authored in the doc spec; the
 *  final node is only ever labelled with what the record supports. */
export const GenealogyTree: React.FC<{
  rows: string[][]; title?: string; cap?: string; accent: string; sceneDur: number;
}> = ({ rows, title, cap, accent, sceneDur }) => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const per = Math.max(14, Math.round((sceneDur * 0.66) / Math.max(1, rows.length)));
  const topY = 250, rowH = 168;
  return (
    <Plate accent={accent}>
      {title && (
        <div style={{
          position: "absolute", top: 116, left: 0, right: 0, textAlign: "center",
          fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: accent,
        }}>{title.toUpperCase()}</div>
      )}
      <svg width={width} height={1080} style={{ position: "absolute", inset: 0 }}>
        {rows.slice(0, -1).map((row, r) => {
          const next = rows[r + 1];
          const sp = spring({ frame: f - 10 - (r + 1) * per, fps, config: { damping: 20 } });
          return next.map((_, j) => {
            // nearest parent by horizontal position — keeps the tree reading as
            // a deliberate diagram instead of a tangle of crossing lines
            const pi = next.length > 1
              ? Math.round((j * (row.length - 1)) / (next.length - 1))
              : Math.floor(row.length / 2);
            const x1 = width * ((pi + 1) / (row.length + 1));
            const x2 = width * ((j + 1) / (next.length + 1));
            const y1 = topY + r * rowH + 26, y2 = topY + (r + 1) * rowH - 26;
            return (
              <line key={`${r}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={accent} strokeWidth={3} opacity={sp * 0.5} />
            );
          });
        })}
      </svg>
      {rows.map((row, r) => {
        const sp = spring({ frame: f - 10 - r * per, fps, config: { damping: 18 } });
        const last = r === rows.length - 1;
        return row.map((nodeLabel, j) => {
          const x = width * ((j + 1) / (row.length + 1));
          return (
            <div key={`${r}-${j}-${nodeLabel}`} style={{
              position: "absolute", left: x - 170, top: topY + r * rowH - 30,
              width: 340, textAlign: "center", opacity: sp,
              transform: `translateY(${interpolate(sp, [0, 1], [18, 0])}px) scale(${interpolate(sp, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{
                display: "inline-block", padding: "12px 22px", borderRadius: 8,
                background: last ? accent : "rgba(14,27,51,0.92)",
                border: `2px solid ${last ? accent : "rgba(127,180,255,0.45)"}`,
                color: last ? "#08101F" : "#EAF2FF",
                fontFamily: last ? DISPLAY : BODY, fontWeight: last ? 800 : 600,
                fontSize: last ? 40 : 26,
                boxShadow: last ? `0 0 40px ${accent}` : "none",
              }}>{nodeLabel}</div>
            </div>
          );
        });
      })}
      <Cap text={cap} accent={accent} />
    </Plate>
  );
};
