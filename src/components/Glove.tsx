import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

interface Props {
  x: number; y: number; scale?: number;
  spin?: number;       // tumble speed
  phase?: number;      // rotation offset
  bleach?: number;     // 0 = fresh white-grey, 1 = bleached porous white
  tether?: boolean;
  glow?: string;
}

/** A stylized but recognizable EVA thermal glove, tumbling in vacuum. */
export const Glove: React.FC<Props> = ({
  x, y, scale = 1, spin = 0.6, phase = 0, bleach = 0, tether = false, glow,
}) => {
  const frame = useCurrentFrame();
  const rot = frame * spin + phase;
  const bob = Math.sin(frame * 0.04 + phase) * 6;

  // bleach: shift toward flat white + raise erosion speckle
  const shell = bleach > 0.5 ? "#E9EDF2" : "#C2CCD8";
  const shellDk = bleach > 0.5 ? "#C7CFD8" : "#8A97A8";
  const pad = bleach > 0.5 ? "#F2F5F8" : "#D6DEE8";

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <g transform={`translate(${x},${y + bob}) rotate(${rot}) scale(${scale})`}
        style={glow ? { filter: `drop-shadow(0 0 22px ${glow}66)` } : undefined}>

        {/* tether cord */}
        {tether && (
          <path d="M 0 70 C 40 140, -60 220, 30 320" fill="none"
            stroke={C.gold} strokeWidth={3} opacity={0.7} strokeLinecap="round" />
        )}

        {/* wrist connector ring */}
        <ellipse cx={0} cy={86} rx={42} ry={16} fill={shellDk} />
        <ellipse cx={0} cy={80} rx={42} ry={16} fill="#3A4658" />
        <ellipse cx={0} cy={80} rx={30} ry={10} fill="#111A28" />

        {/* cuff (ribbed) */}
        <rect x={-46} y={34} width={92} height={54} rx={14} fill={shell} />
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={-46} y={40 + i * 12} width={92} height={4} rx={2} fill={shellDk} opacity={0.7} />
        ))}

        {/* palm */}
        <path d="M -52 38 Q -58 -36 -34 -64 L 40 -64 Q 60 -40 56 30 Q 40 52 0 52 Q -36 52 -52 38 Z"
          fill={shell} stroke={shellDk} strokeWidth={2} />
        {/* palm padding highlight */}
        <path d="M -40 22 Q -44 -28 -24 -50 L 30 -50 Q 46 -30 42 18 Q 26 36 0 36 Q -26 36 -40 22 Z"
          fill={pad} opacity={0.55} />

        {/* four fingers */}
        {[
          { dx: -36, len: 96, w: 20, rot: -12 },
          { dx: -13, len: 116, w: 21, rot: -4 },
          { dx: 11,  len: 110, w: 21, rot: 4 },
          { dx: 34,  len: 88,  w: 19, rot: 12 },
        ].map((f, i) => (
          <g key={i} transform={`rotate(${f.rot} ${f.dx} -64)`}>
            <rect x={f.dx - f.w / 2} y={-64 - f.len} width={f.w} height={f.len + 30}
              rx={f.w / 2} fill={shell} stroke={shellDk} strokeWidth={1.5} />
            {/* knuckle segment lines */}
            <rect x={f.dx - f.w / 2} y={-64 - f.len * 0.5} width={f.w} height={3} fill={shellDk} opacity={0.6} />
            <rect x={f.dx - f.w / 2} y={-64 - f.len * 0.82} width={f.w} height={3} fill={shellDk} opacity={0.6} />
            <rect x={f.dx - f.w / 2 + 3} y={-64 - f.len + 4} width={f.w - 10} height={f.len * 0.4}
              rx={5} fill={pad} opacity={0.5} />
          </g>
        ))}

        {/* thumb */}
        <g transform="rotate(-46 -52 0)">
          <rect x={-66} y={-66} width={20} height={74} rx={10} fill={shell} stroke={shellDk} strokeWidth={1.5} />
          <rect x={-66} y={-40} width={20} height={3} fill={shellDk} opacity={0.6} />
        </g>

        {/* erosion speckle when bleached */}
        {bleach > 0.35 && Array.from({ length: Math.round(bleach * 26) }).map((_, i) => {
          const px = Math.sin(i * 12.9) * 50;
          const py = Math.cos(i * 7.7) * 70 - 20;
          return <circle key={i} cx={px} cy={py} r={1 + (i % 3) * 0.6}
            fill="#6E7A88" opacity={0.5 * bleach} />;
        })}
      </g>
    </svg>
  );
};
