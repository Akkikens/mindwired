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

const FPS = 30;
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const ACCENT = "#4DD8FF"; // mindwired cyan
const BASE = "#05070C";

export type DocScene = {
  id: string; text: string; cap?: string;
  img?: string; stat?: string; statColor?: string;
  chapter?: string;
};
export type DocSpec = { slug: string; title: string; scenes: DocScene[] };
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

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 42, right: 54, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
    <div style={{ width: 14, height: 14, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }} />
    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: 1 }}>mindwired</span>
  </div>
);

const ChapterCard: React.FC<{ s: DocScene; slug: string; m: DocManifest }> = ({ s, slug, m }) => {
  const frame = useCurrentFrame();
  const hasAudio = m.durations[s.id] !== undefined;
  const sp = spring({ frame, fps: FPS, config: { damping: 16 } });
  const lines = (s.chapter ?? "").split("\n");
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%",
        background: `radial-gradient(circle, ${ACCENT}14 0%, transparent 62%)` }} />
      <div style={{ textAlign: "center", transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`, opacity: sp }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: ACCENT, letterSpacing: 6, marginBottom: 16 }}>
          {lines[0]}
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 88, color: "#fff", lineHeight: 1.12, maxWidth: 1500 }}>
          {lines[1]}
        </div>
        <div style={{ width: 120, height: 7, background: ACCENT, borderRadius: 5, margin: "30px auto 0" }} />
      </div>
      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

const IllusScene: React.FC<{ s: DocScene; slug: string; m: DocManifest; idx: number }> = ({ s, slug, m, idx }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s, m);
  const t = frame / dur;
  const pan = idx % 2 === 0 ? 1 : -1;
  const scale = interpolate(t, [0, 1], [1.06, 1.16]);
  const driftX = interpolate(t, [0, 1], [0, pan * 26]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const files = (s.img && m.images[s.img]) || [];
  const file = files.length ? files[idx % files.length] : null;
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
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 54, letterSpacing: 2,
            color: s.statColor ?? "#fff", background: "rgba(5,7,12,0.68)", padding: "12px 28px",
            borderRadius: 12, borderLeft: `6px solid ${ACCENT}`,
            boxShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>{s.stat}</span>
        </div>
      )}

      <Brand />

      {s.cap && (
        <div style={{ position: "absolute", bottom: 84, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 46, color: "#fff", lineHeight: 1.34,
            textShadow: "0 3px 20px rgba(0,0,0,0.9)" }}>
            <span style={{ borderBottom: `4px solid ${ACCENT}`, paddingBottom: 5 }}>{s.cap}</span>
          </div>
        </div>
      )}

      {hasAudio && <Sequence from={LEAD}><Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const makeDocComp = (doc: DocSpec, manifest: DocManifest): React.FC => {
  const Comp: React.FC = () => {
    let cursor = 0;
    return (
      <AbsoluteFill style={{ backgroundColor: BASE }}>
        {doc.scenes.map((s, i) => {
          const from = cursor; const dur = sceneFrames(s, manifest); cursor += dur;
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              {s.chapter
                ? <ChapterCard s={s} slug={doc.slug} m={manifest} />
                : <IllusScene s={s} slug={doc.slug} m={manifest} idx={i} />}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  };
  return Comp;
};
