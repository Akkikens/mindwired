/** kickoffdaily90 — "63" (16:9, 1920×1080, ~2:20). A Nolan-style anime short about
 *  Bellingham & Haaland: 63 games together at Dortmund, the 2021 cup, the split, and the
 *  night one ended the other's World Cup. Nonlinear: opens at the rainy embrace, runs time
 *  backwards. 14 Gemini stills (slow Ken Burns) + 3 Veo hero clips w/ native ambience.
 *  Letterboxed 2.39:1, heavy vignette, sparse Cartesia narration. */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";

type Shot = { img?: string; vid?: string; vol?: number; pan?: 1 | -1 };
type Beat = { id: string; aud: number; extra?: number; shots: Shot[]; cap?: string };

const BEATS: Beat[] = [
  { id: "v_open",   aud: 4.624, extra: 1.0, shots: [{ vid: "embrace_rain", vol: 0.7 }] },
  { id: "v_rewind", aud: 1.228, extra: 2.5, shots: [{ vid: "clock_stadium", vol: 0.7 }] },
  { id: "v_snow",   aud: 5.564, shots: [{ img: "snow_arrival", pan: 1 }], cap: "JANUARY 2020" },
  { id: "v_summer", aud: 6.687, shots: [{ img: "summer_arrival", pan: -1 }], cap: "JULY 2020" },
  { id: "v_63",     aud: 6.844, shots: [{ img: "training_dawn", pan: 1 }, { img: "tunnel_laugh", pan: -1 }] },
  { id: "v_cup",    aud: 8.620, extra: 0.5, shots: [{ img: "cup_lift", pan: 1 }], cap: "MAY 2021" },
  { id: "v_split",  aud: 4.049, shots: [{ img: "corridors_split", pan: -1 }] },
  { id: "v_clocks", aud: 6.531, shots: [{ img: "two_clocks", pan: 1 }], cap: "2022 · 2023" },
  { id: "v_fate",   aud: 9.352, shots: [{ img: "bracket_fate", pan: -1 }] },
  { id: "v_duel",   aud: 5.564, extra: 0.5, shots: [{ img: "duel_miami", pan: 1 }], cap: "MIAMI · JULY 11 2026" },
  { id: "v_result", aud: 8.725, shots: [{ img: "bell_watch", pan: -1 }, { vid: "haaland_dark", vol: 0.7 }] },
  { id: "v_end",    aud: 8.202, extra: 2.5, shots: [{ vid: "embrace_rain", vol: 0.5 }, { img: "title_63", pan: 1 }] },
];

const LEAD = 8, HOLD = 12;
const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const sixty3Frames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const imgSrc = (n: string) => staticFile(`bvb63/keyart/${n}.png`);
const vidSrc = (n: string) => staticFile(`bvb63/clips/${n}.mp4`);
const audSrc = (id: string) => staticFile(`bvb63/audio/${id}.mp3`);
const VEO_FR = 240; // 8s clips

const ShotView: React.FC<{ s: Shot; len: number }> = ({ s, len }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  if (s.vid) {
    const rate = Math.max(0.5, Math.min(1.2, VEO_FR / len));
    return (
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <OffthreadVideo src={vidSrc(s.vid)} playbackRate={rate} muted={!s.vol} volume={s.vol ?? 0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  const scale = interpolate(frame, [0, len], [1.06, 1.16]);
  const drift = interpolate(frame, [0, len], [0, (s.pan ?? 1) * 30]);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Img src={imgSrc(s.img!)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translateX(${drift}px)` }} />
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ b: Beat }> = ({ b }) => {
  const frame = useCurrentFrame();
  const dur = beatFrames(b);
  const n = b.shots.length;
  const slots = b.shots.map((_, i) => ({
    from: Math.round((dur * i) / n),
    len: Math.round((dur * (i + 1)) / n) - Math.round((dur * i) / n),
  }));
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.shots[i].img ?? b.shots[i].vid}>
          <ShotView s={b.shots[i]} len={s.len} />
        </Sequence>
      ))}

      {/* heavy cinematic vignette */}
      <AbsoluteFill style={{ pointerEvents: "none", background:
        "radial-gradient(ellipse at 50% 45%, transparent 46%, rgba(0,0,0,0.62) 100%)" }} />

      {/* era caption — small, tracked-out, bottom-left above the letterbox */}
      {b.cap ? (
        <div style={{
          position: "absolute", bottom: 168, left: 110,
          opacity: capIn * 0.9, transform: `translateY(${interpolate(capIn, [0, 1], [12, 0])}px)`,
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 10,
          color: "rgba(234,242,255,0.85)",
        }}>{b.cap}</div>
      ) : null}

      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const Sixty3: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {BEATS.map((b) => {
        const from = cursor; const dur = beatFrames(b); cursor += dur;
        return (
          <Sequence key={b.id} from={from} durationInFrames={dur} name={b.id}>
            <BeatView b={b} />
          </Sequence>
        );
      })}
      {/* 2.39:1 letterbox — constant, above everything */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 138, background: "#000", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 138, background: "#000", zIndex: 10 }} />
    </AbsoluteFill>
  );
};
