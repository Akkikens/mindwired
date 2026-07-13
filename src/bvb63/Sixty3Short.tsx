/** kickoffdaily90 — "63" SHORTS cut (1080×1920, ~60s). Condensed Nolan short:
 *  embrace → rewind → 63 games → the cup → the split → Miami → goodbye → title.
 *  Full-bleed cover crop (subjects are centred in these frames), vignette, era captions. */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";

type Shot = { img?: string; vid?: string; vol?: number };
type Beat = { id: string; aud: number; extra?: number; shots: Shot[]; cap?: string };

const BEATS: Beat[] = [
  { id: "v_open",   aud: 4.624, extra: 0.5, shots: [{ vid: "embrace_rain", vol: 0.7 }] },
  { id: "v_rewind", aud: 1.228, extra: 2.0, shots: [{ vid: "clock_stadium", vol: 0.7 }] },
  { id: "v_63",     aud: 6.844, shots: [{ img: "training_dawn" }, { img: "tunnel_laugh" }], cap: "DORTMUND · 2020" },
  { id: "v_cup",    aud: 8.620, shots: [{ img: "cup_lift" }], cap: "MAY 2021" },
  { id: "v_split",  aud: 4.049, shots: [{ img: "corridors_split" }] },
  { id: "v_duel",   aud: 5.564, shots: [{ img: "duel_miami" }], cap: "MIAMI · JULY 2026" },
  { id: "v_result", aud: 8.725, shots: [{ img: "bell_watch" }, { vid: "haaland_dark", vol: 0.7 }] },
  { id: "v_end",    aud: 8.202, extra: 2.0, shots: [{ vid: "embrace_rain", vol: 0.5 }, { img: "title_63" }] },
];

const LEAD = 8, HOLD = 10;
const beatFrames = (b: Beat) => LEAD + Math.round(b.aud * FPS) + HOLD + Math.round((b.extra ?? 0) * FPS);
export const sixty3ShortFrames = () => BEATS.reduce((a, b) => a + beatFrames(b), 0);

const imgSrc = (n: string) => staticFile(`bvb63/keyart/${n}.png`);
const vidSrc = (n: string) => staticFile(`bvb63/clips/${n}.mp4`);
const audSrc = (id: string) => staticFile(`bvb63/audio/${id}.mp3`);
const VEO_FR = 240;

const ShotView: React.FC<{ s: Shot; len: number }> = ({ s, len }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  if (s.vid) {
    const rate = Math.max(0.5, Math.min(1.2, VEO_FR / len));
    return (
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <OffthreadVideo src={vidSrc(s.vid)} playbackRate={rate} muted={!s.vol} volume={s.vol ?? 0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  const scale = interpolate(frame, [0, len], [1.05, 1.15]);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Img src={imgSrc(s.img!)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
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
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 20 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      {slots.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len} name={b.shots[i].img ?? b.shots[i].vid}>
          <ShotView s={b.shots[i]} len={s.len} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ pointerEvents: "none", background:
        "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(0,0,0,0.66) 100%)" }} />
      {b.cap ? (
        <div style={{
          position: "absolute", top: 200, left: 0, right: 0, textAlign: "center",
          opacity: capIn * 0.9, transform: `translateY(${interpolate(capIn, [0, 1], [-10, 0])}px)`,
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 10,
          color: "rgba(234,242,255,0.9)",
        }}>{b.cap}</div>
      ) : null}
      <Sequence from={LEAD}><Audio src={audSrc(b.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const Sixty3Short: React.FC = () => {
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
    </AbsoluteFill>
  );
};
