import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

interface Props {
  cx: number; cy: number;
  /** highlight one ring as the "graveyard" orbit */
  graveyardIndex?: number;
}

/** Earth-centered orbital ellipses with moving tracked objects; one ring can be
 *  highlighted as the crowded "graveyard" lane. */
export const OrbitRings: React.FC<Props> = ({ cx, cy, graveyardIndex = 2 }) => {
  const frame = useCurrentFrame();
  const rings = [
    { rx: 240, ry: 96,  tilt: -18, n: 4,  spd: 0.9,  col: C.cyan },
    { rx: 360, ry: 150, tilt: -14, n: 6,  spd: 0.6,  col: C.ice },
    { rx: 500, ry: 210, tilt: -12, n: 14, spd: 0.42, col: C.amber },
    { rx: 640, ry: 280, tilt: -10, n: 5,  spd: 0.3,  col: C.ice },
  ];
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {rings.map((r, ri) => {
        const isGrave = ri === graveyardIndex;
        const dots = isGrave ? r.n * 3 : r.n;
        return (
          <g key={ri} transform={`translate(${cx},${cy}) rotate(${r.tilt})`}>
            <ellipse rx={r.rx} ry={r.ry} fill="none"
              stroke={isGrave ? C.amber : r.col}
              strokeWidth={isGrave ? 2.4 : 1.2}
              opacity={isGrave ? 0.7 : 0.32}
              strokeDasharray={isGrave ? "none" : "2 7"}
              style={isGrave ? { filter: `drop-shadow(0 0 8px ${C.amber})` } : undefined} />
            {Array.from({ length: dots }).map((_, i) => {
              const a = (i / dots) * Math.PI * 2 + frame * 0.01 * r.spd;
              const px = Math.cos(a) * r.rx;
              const py = Math.sin(a) * r.ry;
              return <circle key={i} cx={px} cy={py} r={isGrave ? 3 : 2.4}
                fill={isGrave ? C.amber : r.col}
                opacity={0.9}
                style={{ filter: `drop-shadow(0 0 4px ${isGrave ? C.amber : r.col})` }} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};
