import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

const rnd = (i: number) => {
  const x = Math.sin(i * 57.3 + 19.1) * 1337.77;
  return x - Math.floor(x);
};

interface Props {
  count?: number;
  speed?: number;
  color?: string;
  /** 0..1 — how much the pieces tumble/sparkle */
  energy?: number;
}

/** Parallax field of tumbling orbital debris: bolts, panels, flecks. */
export const DebrisField: React.FC<Props> = ({ count = 26, speed = 1, color = C.ice, energy = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: count }).map((_, i) => {
        const depth = 0.4 + rnd(i) * 1.2;               // parallax depth
        const y = rnd(i + 3) * 1080;
        const x = (rnd(i + 1) * 1920 + frame * speed * depth) % 2040 - 60;
        const rot = frame * (1 + rnd(i + 5) * 3) * energy + rnd(i) * 360;
        const sz = (3 + rnd(i + 7) * 10) * depth;
        const kind = Math.floor(rnd(i + 9) * 3);
        const op = 0.3 + depth * 0.4;
        const fill = rnd(i + 11) > 0.7 ? color : "#7C8AA0";
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot})`} opacity={op}>
            {kind === 0 && <rect x={-sz / 2} y={-sz / 2} width={sz} height={sz * 0.6} rx={1} fill={fill} />}
            {kind === 1 && <circle r={sz * 0.4} fill={fill} />}
            {kind === 2 && (
              <g fill={fill}>
                <rect x={-sz / 2} y={-1.5} width={sz} height={3} />
                <rect x={-1.5} y={-sz / 2} width={3} height={sz} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
