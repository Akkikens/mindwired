/** Criminal Record — standing subscribe outro (long 1920×1080 + short 1080×1920).
 *
 *  Deliberately typographic, NOT a talking head. This channel's credibility
 *  pitch is "we put the real filing on screen"; an AI-generated presenter would
 *  undercut that, and the channel brief bans synthetic depictions of people.
 *  So the outro is the brand's own visual language: a docket stack assembling,
 *  the wordmark, the ask, the handle. Renders in seconds, costs nothing, and
 *  can't age into uncanny.
 *
 *  Built once, reused on every episode — same standing-asset rule as the other
 *  channels' outros (CLAUDE.md: never regenerate these per video).
 */
import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import "../lib/fonts";

const ACCENT = "#7FB4FF";
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
export const CR_OUTRO_FRAMES = 420; // 14s @30

/** Filings sliding into a stack behind the type — the channel's motif. */
const DocketStack: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sheets = 7;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {Array.from({ length: sheets }, (_, i) => {
        const sp = spring({ frame: f - 8 - i * 5, fps, config: { damping: 20, mass: 0.8 } });
        const w = vertical ? width * 0.62 : width * 0.26;
        const h = w * 1.32;
        const drift = interpolate(f, [0, CR_OUTRO_FRAMES], [0, -18]);
        const rot = (i - sheets / 2) * 1.9;
        return (
          <div key={i} style={{
            position: "absolute",
            width: w, height: h,
            transform: `translateY(${interpolate(sp, [0, 1], [90, i * -9 + drift])}px) rotate(${rot}deg)`,
            opacity: sp * (0.12 + i * 0.035),
            background: "linear-gradient(180deg, #F4F7FF 0%, #C9D8F2 100%)",
            borderRadius: 4,
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          }}>
            {/* faint ruled lines so it reads as a filing, not a blank card */}
            {Array.from({ length: 14 }, (__, k) => (
              <div key={k} style={{
                position: "absolute", left: "10%", right: k % 4 === 3 ? "42%" : "12%",
                top: `${12 + k * 6}%`, height: Math.max(2, h * 0.006),
                background: "rgba(20,32,56,0.30)",
              }} />
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Content: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSp = spring({ frame: f - 26, fps, config: { damping: 18 } });
  const askSp = spring({ frame: f - 58, fps, config: { damping: 18 } });
  const handleSp = spring({ frame: f - 92, fps, config: { damping: 18 } });
  // one slow pulse on the ask, no flashing
  const pulse = 1 + 0.02 * Math.sin((f / fps) * 2.1);
  const S = vertical ? 1.32 : 1;
  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center",
      padding: vertical ? 70 : 110, textAlign: "center",
    }}>
      <div style={{ opacity: inSp, transform: `translateY(${interpolate(inSp, [0, 1], [26, 0])}px)` }}>
        <div style={{
          fontFamily: BODY, fontWeight: 700, fontSize: 26 * S, letterSpacing: 7,
          color: ACCENT, marginBottom: 22 * S,
        }}>
          EVERY CASE, FROM THE RECORD
        </div>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 96 * S, lineHeight: 1.02,
          color: "#fff", letterSpacing: -1, textShadow: "0 6px 40px rgba(0,0,0,0.85)",
        }}>
          CRIMINAL<br />RECORD
        </div>
        <div style={{
          width: 132 * S, height: 7, background: ACCENT, borderRadius: 4,
          margin: `${30 * S}px auto 0`,
        }} />
      </div>

      <div style={{
        marginTop: 54 * S, opacity: askSp,
        transform: `translateY(${interpolate(askSp, [0, 1], [22, 0])}px) scale(${pulse})`,
      }}>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 800, fontSize: 44 * S, color: "#0A0F1A",
          background: ACCENT, padding: `${16 * S}px ${44 * S}px`, borderRadius: 10,
          boxShadow: `0 0 46px rgba(127,180,255,0.45)`,
        }}>
          ▶ SUBSCRIBE
        </div>
      </div>

      <div style={{
        marginTop: 30 * S, opacity: handleSp,
        fontFamily: BODY, fontWeight: 700, fontSize: 32 * S, color: "#fff",
        letterSpacing: 1,
      }}>
        @WatchCriminalRecord
      </div>
      <div style={{
        marginTop: 12 * S, opacity: handleSp * 0.72,
        fontFamily: BODY, fontWeight: 500, fontSize: 22 * S, color: "#CFE0FF",
      }}>
        New case files — built on the primary record.
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const f = useCurrentFrame();
  // gentle fade at the tail so a hard cut to black never clips mid-word
  const out = interpolate(f, [CR_OUTRO_FRAMES - 22, CR_OUTRO_FRAMES], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F", opacity: out }}>
      <AbsoluteFill style={{
        background: "radial-gradient(120% 90% at 50% 30%, #10203C 0%, #05080F 70%)",
      }} />
      <DocketStack vertical={vertical} />
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, rgba(5,8,15,0.55) 0%, rgba(5,8,15,0.2) 40%, rgba(5,8,15,0.8) 100%)",
      }} />
      <Content vertical={vertical} />
    </AbsoluteFill>
  );
};

export const SubscribeCriminalRecordLong: React.FC = () => <Outro vertical={false} />;
export const SubscribeCriminalRecordShort: React.FC = () => <Outro vertical />;
