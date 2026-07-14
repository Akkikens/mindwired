/** Black Box Breakdown — vertical Short (1080×1920) cut from the boeing737max doc.
 *
 *  Reuses the long-form's own narration audio + archival images for a chosen
 *  scene-id range, reframed vertical with big kinetic captions, a 2.5s hook card,
 *  and a closing CTA card. Funnels Shorts traffic → the full doc.
 *
 *  One comp per Short via defaultProps {startId, endId, hook, cta}. Register in
 *  Root as a 1080×1920 Composition; duration = sum of clip audio + hook + cta.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import doc from "../mindwired-doc/docs/boeing737max.json";
import manifest from "../mindwired-doc/docs/boeing737max.manifest.json";

const FPS = 30;
const ACCENT = "#FF9500"; // Black Box orange
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const HOOK_S = 2.5, CTA_S = 3.0, PAD = 0.15;

type Scene = { id: string; text?: string; img?: string; cap?: string; stat?: string };
const DUR: Record<string, number> = (manifest as any).durations;
const IMG: Record<string, string[]> = (manifest as any).images;

type Props = { startId: string; endId: string; hook: string; cta?: string };

const range = (startId: string, endId: string): Scene[] => {
  const ids = (doc.scenes as Scene[]).map(s => s.id);
  const a = ids.indexOf(startId), b = ids.indexOf(endId);
  return (doc.scenes as Scene[]).slice(a, b + 1);
};
const clipF = (s: Scene) => Math.round(((DUR[s.id] ?? 3) + PAD) * FPS);

export const blackBoxShortFrames = ({ startId, endId }: Props) =>
  Math.round(HOOK_S * FPS) + range(startId, endId).reduce((a, s) => a + clipF(s), 0) + Math.round(CTA_S * FPS);

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: "#fff" }}>
      BLACK BOX <span style={{ color: ACCENT }}>▪</span> BREAKDOWN
    </span>
  </div>
);

const HookCard: React.FC<{ hook: string }> = ({ hook }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10", justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div style={{ opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`, textAlign: "center" }}>
        <div style={{ width: 90, height: 8, background: ACCENT, margin: "0 auto 40px", borderRadius: 4 }} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1.1, color: "#fff", whiteSpace: "pre-line" }}>{hook}</div>
      </div>
    </AbsoluteFill>
  );
};

const ClipScene: React.FC<{ s: Scene; idx: number; dur: number }> = ({ s, idx, dur }) => {
  const f = useCurrentFrame();
  const files = (s.img && IMG[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
  const t = f / dur;
  const scale = interpolate(t, [0, 1], [1.12, 1.24]);
  const dx = interpolate(t, [0, 1], [0, (idx % 2 ? -1 : 1) * 24]);
  const capIn = spring({ frame: f - 2, fps: FPS, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {file && (
        <Img src={staticFile(`shorts/boeing737max/images/${file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translateX(${dx}px)`, filter: "saturate(0.9) contrast(1.08)" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,12,16,0.85) 0%, transparent 22%, transparent 46%, rgba(10,12,16,0.92) 78%)" }} />
      <Brand />
      <div style={{ position: "absolute", bottom: 300, left: 60, right: 60,
        transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
        <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 62, lineHeight: 1.28, color: "#fff",
          textShadow: "0 3px 22px rgba(0,0,0,0.95)" }}>
          {s.cap || s.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const CtaCard: React.FC<{ cta: string }> = ({ cta }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f, fps: FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10", justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div style={{ opacity: sp, textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 78, color: "#fff", lineHeight: 1.15, whiteSpace: "pre-line" }}>{cta}</div>
        <div style={{ marginTop: 50, fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: 2,
          color: "#0A0C10", background: ACCENT, padding: "20px 46px", borderRadius: 16, display: "inline-block" }}>
          ▶ FULL BREAKDOWN
        </div>
        <div style={{ marginTop: 40, fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: "#fff" }}>
          BLACK BOX <span style={{ color: ACCENT }}>▪</span> BREAKDOWN
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BlackBoxShort: React.FC<Props> = ({ startId, endId, hook, cta = "The full story of how\nBoeing killed 346 people" }) => {
  const scenes = range(startId, endId);
  let cursor = Math.round(HOOK_S * FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={Math.round(HOOK_S * FPS)} name="hook"><HookCard hook={hook} /></Sequence>
      {scenes.map((s, i) => {
        const from = cursor; const dur = clipF(s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <ClipScene s={s} idx={i} dur={dur} />
            <Audio src={staticFile(`shorts/boeing737max/audio/${s.id}.mp3`)} />
          </Sequence>
        );
      })}
      <Sequence from={cursor} durationInFrames={Math.round(CTA_S * FPS)} name="cta">
        <CtaCard cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
