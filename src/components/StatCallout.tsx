import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, SANS } from "../lib/theme";

const easeOutCubic = Easing.out(Easing.cubic);
/** If the value leads with a meaningful number ("17,500 MPH", "2,000,000 KM/H"),
 *  split it so the digits can count up; otherwise render the string as-is. */
const parseStat = (value: string): { num: number; suffix: string } | null => {
  const m = /^(\d[\d,]*)(.*)$/.exec(value.trim());
  if (!m) return null;
  const num = parseInt(m[1].replace(/,/g, ""), 10);
  if (!m[1].includes(",") && num < 100) return null; // "1/5 …" etc. — leave alone
  return { num, suffix: m[2] };
};

interface Props {
  value: string;      // e.g. "17,500 MPH"
  label?: string;     // e.g. "ORBITAL VELOCITY"
  x?: number; y?: number;
  color?: string;
  appearAt?: number;  // frame within scene
  hold?: number;      // seconds visible (default: stays)
  align?: "left" | "center" | "right";
}

/** Big dramatic data callout that springs + glows in. */
export const StatCallout: React.FC<Props> = ({
  value, label, x = 960, y = 540, color = C.cyan, appearAt = 0, hold, align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - appearAt;
  if (f < 0) return null;

  const s = spring({ frame: f, fps, config: { damping: 14, mass: 0.8, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.78, 1]);
  const slideY = interpolate(s, [0, 1], [16, 0]);
  // glow flares on entry then settles — no perpetual sine pulse (that reads "gamey")
  const glowPulse = 1 + 0.7 * Math.max(0, 1 - f / 18);

  let op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  if (hold) {
    const out = appearAt + hold * fps;
    op *= interpolate(frame, [out, out + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  if (op <= 0) return null;

  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";

  // kinetic count-up for numeric stats (else show the string verbatim)
  const stat = parseStat(value);
  const countP = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  const shown = stat ? `${Math.round(stat.num * countP).toLocaleString("en-US")}${stat.suffix}` : value;

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `translate(${tx}, calc(-50% + ${slideY}px)) scale(${scale})`,
      opacity: op, textAlign: align, pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: 120, lineHeight: 0.95,
        color: C.white, letterSpacing: 1,
        textShadow: `0 0 ${30 * glowPulse}px ${color}, 0 4px 20px rgba(0,0,0,0.6)`,
      }}>
        {shown}
      </div>
      {label && (
        <div style={{
          fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 8,
          color, textTransform: "uppercase", marginTop: 8,
          textShadow: `0 0 14px ${color}88`,
        }}>
          {label}
        </div>
      )}
    </div>
  );
};
