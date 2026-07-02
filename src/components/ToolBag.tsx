import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

interface Props { x: number; y: number; scale?: number; spin?: number; phase?: number; }

/** A white EVA crew tool bag, tumbling. */
export const ToolBag: React.FC<Props> = ({ x, y, scale = 1, spin = 0.4, phase = 0 }) => {
  const frame = useCurrentFrame();
  const rot = frame * spin + phase;
  const bob = Math.sin(frame * 0.05 + phase) * 5;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <g transform={`translate(${x},${y + bob}) rotate(${rot}) scale(${scale})`}>
        {/* body */}
        <rect x={-70} y={-54} width={140} height={120} rx={16} fill="#E4E9F0" stroke="#9AA6B6" strokeWidth={2} />
        <rect x={-70} y={-54} width={140} height={40} rx={16} fill="#D2DAE6" />
        {/* flap */}
        <rect x={-70} y={-58} width={140} height={26} rx={12} fill="#F1F4F8" stroke="#9AA6B6" strokeWidth={1.5} />
        {/* straps */}
        <rect x={-44} y={-54} width={12} height={120} fill="#B7C1D0" opacity={0.8} />
        <rect x={32} y={-54} width={12} height={120} fill="#B7C1D0" opacity={0.8} />
        {/* buckles */}
        <rect x={-46} y={-2} width={16} height={10} rx={2} fill="#5A6678" />
        <rect x={30} y={-2} width={16} height={10} rx={2} fill="#5A6678" />
        {/* NASA-ish accent tab */}
        <rect x={-22} y={28} width={44} height={20} rx={4} fill={C.cyan} opacity={0.5} />
        {/* tools poking out */}
        <g transform="rotate(-16 0 -58)">
          <rect x={-26} y={-104} width={9} height={56} rx={3} fill="#8A97A8" />
          <rect x={-30} y={-108} width={17} height={10} rx={2} fill="#B7C1D0" />
        </g>
        <g transform="rotate(10 0 -58)">
          <rect x={14} y={-100} width={8} height={50} rx={3} fill="#8A97A8" />
          <circle cx={18} cy={-104} r={8} fill="#B7C1D0" />
        </g>
        {/* tether */}
        <path d="M -70 20 C -150 60, -120 160, -190 210" fill="none" stroke={C.gold} strokeWidth={3}
          opacity={0.6} strokeLinecap="round" />
      </g>
    </svg>
  );
};
