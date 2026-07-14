/** mindwired archival-documentary template (16:9, 1920×1080).
 *
 *  The $0 long-form system: real PD/CC archival photos (scripts/fetch_media.py)
 *  with Ken-Burns motion, English caption/stat overlays, chapter title cards,
 *  and cloned-channel-voice narration (scripts/build_doc_vo.py).
 *
 *  Fully data-driven: a doc spec JSON (src/mindwired-doc/docs/<slug>.json) plus
 *  its generated manifest (<slug>.manifest.json — real clip durations + a scan
 *  of public/shorts/<slug>/images grouped by filename prefix). A scene's `img`
 *  is a prefix; the template cycles through that prefix's files so repeated
 *  subjects still get visual variety. Missing image prefix → dark base; missing
 *  audio → estimated duration (video renders, rerun the VO builder later).
 *
 *  New doc = new JSON + fetch queries + one makeDocComp() registration in Root.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import { DIAGRAMS } from "./Diagrams";

const FPS = 30;
const BASE = "#05070C";

type Theme = { display: string; body: string; accent: string; brand: string };
const THEMES: Record<string, Theme> = {
  mindwired: {
    display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
    accent: "#4DD8FF", brand: "mindwired",
  },
  dimaagbatti: {
    display: "'Noto Sans Devanagari', 'Space Grotesk', sans-serif",
    body: "'Noto Sans Devanagari', 'Inter', sans-serif",
    accent: "#FFC53D", brand: "दिमाग़बत्ती",
  },
  blackbox: {
    display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
    accent: "#FF9500", brand: "Black Box",
  },
};

export type DocScene = {
  id: string; text: string; cap?: string;
  img?: string; stat?: string; statColor?: string;
  chapter?: string;
  diagram?: string; arg?: string;
};
export type DocSpec = { slug: string; title: string; channel?: string; scenes: DocScene[] };
export type DocManifest = {
  durations: Record<string, number>;
  images: Record<string, string[]>;
};

const LEAD = 10, HOLD = 24;

const sceneAud = (s: DocScene, m: DocManifest) =>
  m.durations[s.id] ?? s.text.split(/\s+/).length / 2.3; // estimate fallback
const sceneFrames = (s: DocScene, m: DocManifest) =>
  LEAD + Math.round(sceneAud(s, m) * FPS) + HOLD;
export const docTotalFrames = (doc: DocSpec, m: DocManifest) =>
  doc.scenes.reduce((a, s) => a + sceneFrames(s, m), 0);

const Brand: React.FC<{ th: Theme }> = ({ th }) => (
  <div style={{ position: "absolute", top: 42, right: 54, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
    <div style={{ width: 14, height: 14, borderRadius: "50%", background: th.accent, boxShadow: `0 0 14px ${th.accent}` }} />
    <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: 1 }}>{th.brand}</span>
  </div>
);

const ChapterCard: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const hasAudio = m.durations[s.id] !== undefined;
  const sp = spring({ frame, fps: FPS, config: { damping: 16 } });
  const lines = (s.chapter ?? "").split("\n");
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%",
        background: `radial-gradient(circle, ${th.accent}14 0%, transparent 62%)` }} />
      <div style={{ textAlign: "center", transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`, opacity: sp }}>
        <div style={{ fontFamily: th.display, fontWeight: 700, fontSize: 34, color: th.accent, letterSpacing: 6, marginBottom: 16 }}>
          {lines[0]}
        </div>
        <div style={{ fontFamily: th.display, fontWeight: 700, fontSize: 88, color: "#fff", lineHeight: 1.12, maxWidth: 1500 }}>
          {lines[1]}
        </div>
        <div style={{ width: 120, height: 7, background: th.accent, borderRadius: 5, margin: "30px auto 0" }} />
      </div>
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

const IllusScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number; th: Theme }> = ({ s, slug, m, idx, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const t = frame / dur;
  const pan = idx % 2 === 0 ? 1 : -1;
  const scale = interpolate(t, [0, 1], [1.06, 1.16]);
  const driftX = interpolate(t, [0, 1], [0, pan * 26]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null; // idx = per-prefix occurrence (even rotation)
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const hasAudio = m.durations[s.id] !== undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      {file && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <Img src={staticFile(`shorts/${slug}/images/${file}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${scale}) translateX(${driftX}px)`,
              filter: "saturate(0.88) contrast(1.05)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.62) 0%, transparent 24%, transparent 56%, rgba(5,7,12,0.94) 100%)", pointerEvents: "none" }} />

      {s.stat && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${th.accent}`,
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}

      <Brand th={th} />

      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${th.accent}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

const DiagramScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; th: Theme }> = ({ s, slug, m, th }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(sceneAud(s, m) * 0.35 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });
  const hasAudio = m.durations[s.id] !== undefined;
  const Diagram = (s.diagram && DIAGRAMS[s.diagram]) || null;

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {Diagram ? <Diagram dur={dur} arg={s.arg} accent={th.accent} /> : <AbsoluteFill style={{ backgroundColor: BASE }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.55) 0%, transparent 22%, transparent 60%, rgba(5,7,12,0.92) 100%)", pointerEvents: "none" }} />

      {s.stat && (
        <div style={{ position: "absolute", top: 118, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.92, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: th.display, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${th.accent}`,
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}

      <Brand th={th} />

      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: th.body, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${th.accent}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const makeDocComp = (doc: DocSpec, manifest: DocManifest): React.FC => {
  const th = THEMES[doc.channel ?? "mindwired"] ?? THEMES.mindwired;
  // Per-prefix rotation: the k-th scene using a prefix shows that prefix's k-th
  // file (mod pool size) — spreads small pools evenly instead of hashing on the
  // global scene index (which repeated files back-to-back).
  const rotation: Record<string, number> = {};
  const sceneFileIdx: Record<string, number> = {};
  for (const s of doc.scenes) {
    if (!s.img) continue;
    sceneFileIdx[s.id] = rotation[s.img] ?? 0;
    rotation[s.img] = (rotation[s.img] ?? 0) + 1;
  }
  const Comp: React.FC = () => {
    let cursor = 0;
    return (
      <AbsoluteFill style={{ backgroundColor: BASE }}>
        {doc.scenes.map((s, i) => {
          const from = cursor; const dur = sceneFrames(s, manifest); cursor += dur;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              {s.chapter
                ? <ChapterCard s={s} slug={doc.slug} m={manifest} th={th} />
                : s.diagram
                ? <DiagramScene s={s} slug={doc.slug} m={manifest} th={th} />
                : <IllusScene s={s} slug={doc.slug} m={manifest} idx={sceneFileIdx[s.id] ?? i} th={th} />}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  };
  return Comp;
};
