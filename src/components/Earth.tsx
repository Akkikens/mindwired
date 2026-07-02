import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

interface Props {
  cx: number; cy: number; radius: number;
  /** continent drift speed (fake rotation) */
  spin?: number;
  /** sunlight direction angle in degrees (0 = from right) */
  sunAngle?: number;
  showCities?: boolean;
  glow?: string;
}

const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 13.3) * 2371.17;
  return x - Math.floor(x);
};

/**
 * Cinematic Earth: shaded sphere, soft atmospheric rim, drifting continents,
 * day/night terminator, and city lights on the dark side. Pure SVG/gradient.
 */
export const Earth: React.FC<Props> = ({
  cx, cy, radius, spin = 1, sunAngle = -35, showCities = true, glow = C.earthGlow,
}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.12 * spin) % (radius * 2);
  const id = Math.round(cx + cy + radius);

  // sunlight unit vector
  const a = (sunAngle * Math.PI) / 180;
  const lx = Math.cos(a), ly = Math.sin(a);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <defs>
        <radialGradient id={`atmo${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="74%" stopColor={glow} stopOpacity="0" />
          <stop offset="90%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.atmo} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`globe${id}`}
          cx={`${50 + lx * 26}%`} cy={`${50 + ly * 26}%`} r="68%">
          <stop offset="0%" stopColor="#3E7FC9" />
          <stop offset="42%" stopColor={C.earthCore} />
          <stop offset="78%" stopColor="#0A1E40" />
          <stop offset="100%" stopColor="#060F22" />
        </radialGradient>
        <clipPath id={`clip${id}`}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
        <radialGradient id={`term${id}`}
          cx={`${50 - lx * 30}%`} cy={`${50 - ly * 30}%`} r="80%">
          <stop offset="40%" stopColor="#000" stopOpacity="0" />
          <stop offset="78%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* atmospheric halo */}
      <circle cx={cx} cy={cy} r={radius * 1.16} fill={`url(#atmo${id})`} />
      {/* bright rim arc on the sunlit limb */}
      <circle cx={cx} cy={cy} r={radius} fill="none"
        stroke={C.atmo} strokeWidth={3} opacity={0.5}
        style={{ filter: `drop-shadow(0 0 16px ${glow})` }} />

      {/* sphere */}
      <circle cx={cx} cy={cy} r={radius} fill={`url(#globe${id})`} />

      <g clipPath={`url(#clip${id})`}>
        {/* drifting continents (two passes for seamless wrap) */}
        {[0, 1].map((pass) =>
          Array.from({ length: 7 }).map((_, i) => {
            const baseX = cx - radius + ((rnd(i) * radius * 2 + drift + pass * radius * 2) % (radius * 2));
            const baseY = cy - radius * 0.7 + rnd(i + 9) * radius * 1.4;
            const w = radius * (0.32 + rnd(i + 3) * 0.4);
            const h = radius * (0.18 + rnd(i + 7) * 0.26);
            return (
              <ellipse key={`${pass}-${i}`} cx={baseX} cy={baseY} rx={w} ry={h}
                fill={C.earthLand} opacity={0.62}
                transform={`rotate(${rnd(i) * 60 - 30} ${baseX} ${baseY})`} />
            );
          })
        )}
        {/* cloud streaks */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = cx - radius + ((rnd(i + 20) * radius * 2 + drift * 1.4) % (radius * 2));
          const y = cy - radius * 0.6 + rnd(i + 25) * radius * 1.2;
          return (
            <ellipse key={`c${i}`} cx={x} cy={y} rx={radius * 0.4} ry={radius * 0.07}
              fill="#DCEBFF" opacity={0.16} />
          );
        })}
        {/* night-side city lights */}
        {showCities && Array.from({ length: 40 }).map((_, i) => {
          const ang = rnd(i) * Math.PI * 2;
          const rr = Math.sqrt(rnd(i + 1)) * radius * 0.92;
          const px = cx + Math.cos(ang) * rr;
          const py = cy + Math.sin(ang) * rr;
          // only on the dark hemisphere (opposite the sun)
          const dot = ((px - cx) * lx + (py - cy) * ly) / radius;
          if (dot > -0.15) return null;
          const tw = 0.4 + 0.6 * Math.sin(frame * 0.1 + i);
          return <circle key={`l${i}`} cx={px} cy={py} r={1.3} fill={C.gold} opacity={0.8 * tw} />;
        })}
        {/* day/night terminator shading */}
        <circle cx={cx} cy={cy} r={radius} fill={`url(#term${id})`} />
      </g>
    </svg>
  );
};
