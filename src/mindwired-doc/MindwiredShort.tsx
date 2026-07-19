/** mindwired — vertical Short (1080×1920) cut from any mindwired DocWide doc.
 *
 *  Twin of blackbox/BlackBoxShort: reuses a doc's own real audio (narration +
 *  labeled evidence clips) + its images for a chosen contiguous scene-id range,
 *  reframed vertical with a 2.5s hook card and the vertical mindwired subscribe
 *  outro baked on the end (public/outro/subscribe_mindwired_short.mp4 — reused).
 *  One render per Short (outro baked in — no ffmpeg concat).
 *
 *  Pass {slug, doc, manifest, startId, endId, hook}. Evidence "listen" scenes
 *  (s.speaker) show the honest label + waveform over the real clip.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const ACCENT = "#4DD8FF";
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const HOOK_S = 2.5, PAD = 0.15;
const OUTRO_F = 268; // vertical mindwired outro (8.94s @30), baked on the end

type Scene = { id: string; text?: string; img?: string; cap?: string; stat?: string;
  speaker?: string; radioLabel?: string; depth?: number };
type Doc = { scenes: Scene[] };
type Manifest = { durations: Record<string, number>; images: Record<string, string[]> };
type Props = { startId: string; endId: string; hook: string;
  slug: string; doc: Doc; manifest: Manifest };

const range = (doc: Doc, startId: string, endId: string): Scene[] => {
  const ids = doc.scenes.map(s => s.id);
  return doc.scenes.slice(ids.indexOf(startId), ids.indexOf(endId) + 1);
};
// Evidence "listen" clips can run 70s+ in the long-form; cap them for a Short
// so it loops. Narration scenes are never capped (would cut a sentence).
const LISTEN_CAP_S = 20;
const clipSecs = (m: Manifest, s: Scene) => {
  const d = m.durations[s.id] ?? 3;
  return s.speaker ? Math.min(d, LISTEN_CAP_S) : d;
};
const clipF = (m: Manifest, s: Scene) => Math.round((clipSecs(m, s) + PAD) * FPS);

export const mindwiredShortFrames = ({ startId, endId, doc, manifest }:
  { startId: string; endId: string; doc: Doc; manifest: Manifest }) =>
  Math.round(HOOK_S * FPS) + range(doc, startId, endId).reduce((a, s) => a + clipF(manifest, s), 0) + OUTRO_F;

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 66, left: 0, right: 0, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
    <div style={{ width: 16, height: 16, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 16px ${ACCENT}` }} />
    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 1, color: "#fff" }}>mindwired</span>
  </div>
);

const HookCard: React.FC<{ hook: string }> = ({ hook }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C", justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div style={{ opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`, textAlign: "center" }}>
        <div style={{ width: 90, height: 8, background: ACCENT, margin: "0 auto 40px", borderRadius: 4 }} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 1.08, color: "#fff", whiteSpace: "pre-line" }}>{hook}</div>
      </div>
    </AbsoluteFill>
  );
};

const ClipScene: React.FC<{ s: Scene; idx: number; dur: number; slug: string; m: Manifest }> = ({ s, idx, dur, slug, m }) => {
  const f = useCurrentFrame();
  const t = f / dur;
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
  const scale = interpolate(t, [0, 1], [1.12, 1.24]);
  const dx = interpolate(t, [0, 1], [0, (idx % 2 ? -1 : 1) * 24]);
  const capIn = spring({ frame: f - 2, fps: FPS, config: { damping: 18 } });
  const isRadio = !!s.speaker;
  const actual = s.radioLabel?.includes("ACTUAL");
  // vertical waveform for evidence "listen" scenes (they have no image)
  const bars = Array.from({ length: 30 }, (_, i) => {
    const ph = f * 0.3 + i * 1.7;
    return 10 + (0.35 + 0.65 * Math.abs(Math.sin(ph * 0.23) * Math.cos(ph * 0.11 + i))) * 90;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
      {file ? (
        <Img src={staticFile(`shorts/${slug}/images/${file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translateX(${dx}px)`, filter: "saturate(0.9) contrast(1.08)" }} />
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.85) 0%, transparent 24%, transparent 44%, rgba(5,7,12,0.94) 76%)" }} />
      <Brand />
      {isRadio && (
        <>
          <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4,
              color: actual ? "#7CFC9B" : ACCENT,
              border: `2px solid ${actual ? "#7CFC9B" : ACCENT}`, padding: "8px 22px", borderRadius: 8 }}>
              {s.radioLabel ?? "RECREATION"} · {s.speaker}
            </span>
          </div>
          {!file && (
            <div style={{ position: "absolute", top: "42%", left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, height: 120 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ width: 8, height: h, borderRadius: 4,
                  background: i % 6 === 3 ? ACCENT : "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          )}
        </>
      )}
      <div style={{ position: "absolute", bottom: 320, left: 60, right: 60,
        transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
        <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 68, lineHeight: 1.26, color: "#fff",
          textShadow: "0 3px 22px rgba(0,0,0,0.95)" }}>
          {isRadio ? `“${s.cap || s.text}”` : (s.cap || s.text)}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const MindwiredShort: React.FC<Props> = ({ startId, endId, hook, slug, doc, manifest }) => {
  const scenes = range(doc, startId, endId);
  let cursor = Math.round(HOOK_S * FPS);
  const clipsEnd = cursor + scenes.reduce((a, s) => a + clipF(manifest, s), 0);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={Math.round(HOOK_S * FPS)} name="hook"><HookCard hook={hook} /></Sequence>
      {scenes.map((s, i) => {
        const from = cursor; const dur = clipF(manifest, s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <ClipScene s={s} idx={i} dur={dur} slug={slug} m={manifest} />
            <Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} />
          </Sequence>
        );
      })}
      <Sequence from={clipsEnd} durationInFrames={OUTRO_F} name="outro">
        <OffthreadVideo src={staticFile("outro/subscribe_mindwired_short.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </AbsoluteFill>
  );
};
