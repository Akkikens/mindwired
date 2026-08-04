/** Black Box Breakdown — vertical Short (1080×1920) cut from any Black Box doc.
 *
 *  Reuses a doc's own audio (narration / real ATC / CVR recreations) + its
 *  images/NTSB video for a chosen scene-id range, reframed vertical with big
 *  captions, a 2.5s hook card, and the vertical Reid subscribe outro baked on
 *  the end (public/outro/subscribe_blackbox_short.mp4 — reused, never regenerated).
 *
 *  Generic: pass {slug, doc, manifest, startId, endId, hook}. Defaults to the
 *  boeing737max doc for back-compat with the existing 737 MAX Shorts.
 *  One render per Short (outro baked in — no ffmpeg concat).
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";
import doc737 from "../mindwired-doc/docs/boeing737max.json";
import manifest737 from "../mindwired-doc/docs/boeing737max.manifest.json";

const FPS = 30;
const ACCENT = "#FF9500";
const DISPLAY = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";
const HOOK_S = 2.5, PAD = 0.15;
const OUTRO_F = 240; // vertical Reid outro (8s), baked on the end

type Scene = { id: string; text?: string; img?: string; cap?: string; stat?: string;
  video?: string; videoFrom?: number; speaker?: string; radioLabel?: string };
type Doc = { scenes: Scene[] };
type Manifest = { durations: Record<string, number>; images: Record<string, string[]> };
type Props = { startId: string; endId: string; hook: string;
  slug?: string; doc?: Doc; manifest?: Manifest; cta?: string;
  /** Real motion footage under the hook card. CLAUDE.md: the opening seconds
   *  are never a bare black text screen — in the Shorts feed those 2.5s ARE
   *  the verdict. Defaults to the first video inside the scene range; set
   *  explicitly when the range is photo-only. */
  hookVideo?: string; hookFrom?: number; hookImg?: string };

const range = (doc: Doc, startId: string, endId: string): Scene[] => {
  const ids = doc.scenes.map(s => s.id);
  return doc.scenes.slice(ids.indexOf(startId), ids.indexOf(endId) + 1);
};
const clipF = (m: Manifest, s: Scene) => Math.round(((m.durations[s.id] ?? 3) + PAD) * FPS);

export const blackBoxShortFrames = ({ startId, endId, doc = doc737 as Doc, manifest = manifest737 as Manifest }:
  { startId: string; endId: string; doc?: Doc; manifest?: Manifest }) =>
  Math.round(HOOK_S * FPS) + range(doc, startId, endId).reduce((a, s) => a + clipF(manifest, s), 0) + OUTRO_F;

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 66, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: "#fff" }}>
      BLACK BOX <span style={{ color: ACCENT }}>▪</span> BREAKDOWN
    </span>
  </div>
);

const HookCard: React.FC<{ hook: string; slug: string; video?: string; from?: number; img?: string }> =
({ hook, slug, video, from, img }) => {
  const f = useCurrentFrame();
  const sp = spring({ frame: f, fps: FPS, config: { damping: 15 } });
  const push = interpolate(f, [0, Math.round(HOOK_S * FPS)], [1.06, 1.16], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {video ? (
        <OffthreadVideo src={staticFile(`shorts/${slug}/video/${video}`)} muted
          startFrom={Math.round((from ?? 0) * FPS)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${push})`, filter: "saturate(0.95) contrast(1.14)" }} />
      ) : img ? (
        <Img src={staticFile(`shorts/${slug}/images/${img}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${push})`, filter: "saturate(0.95) contrast(1.14)" }} />
      ) : null}
      {/* scrim: keeps 104px display type legible over any plate */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.55) 0%, rgba(5,7,12,0.34) 30%, rgba(5,7,12,0.66) 66%, rgba(5,7,12,0.86) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <div style={{ opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px)`, textAlign: "center" }}>
          <div style={{ width: 90, height: 8, background: ACCENT, margin: "0 auto 40px", borderRadius: 4 }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 1.08, color: "#fff",
            whiteSpace: "pre-line", textShadow: "0 4px 28px rgba(0,0,0,0.9)" }}>{hook}</div>
        </div>
      </AbsoluteFill>
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
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
      {s.video ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <OffthreadVideo src={staticFile(`shorts/${slug}/video/${s.video}`)} muted
            startFrom={Math.round((s.videoFrom ?? 0) * FPS)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </AbsoluteFill>
      ) : file ? (
        <Img src={staticFile(`shorts/${slug}/images/${file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translateX(${dx}px)`, filter: "saturate(0.9) contrast(1.08)" }} />
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.85) 0%, transparent 24%, transparent 44%, rgba(5,7,12,0.94) 76%)" }} />
      <Brand />
      {isRadio && (
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 5,
            color: s.radioLabel?.includes("ACTUAL") ? "#7CFC9B" : ACCENT,
            border: `2px solid ${s.radioLabel?.includes("ACTUAL") ? "#7CFC9B" : ACCENT}`, padding: "8px 22px", borderRadius: 8 }}>
            {s.radioLabel ?? "CVR RECREATION"} · {s.speaker}
          </span>
        </div>
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

export const BlackBoxShort: React.FC<Props> = ({ startId, endId, hook, slug = "boeing737max", doc = doc737 as Doc, manifest = manifest737 as Manifest, hookVideo, hookFrom, hookImg }) => {
  const scenes = range(doc, startId, endId);
  let cursor = Math.round(HOOK_S * FPS);
  const clipsEnd = cursor + scenes.reduce((a, s) => a + clipF(manifest, s), 0);
  // real-motion plate under the hook: explicit prop wins, else the first video
  // in the range, else the range's first real photo — never a bare black card.
  const firstVid = scenes.find(s => s.video);
  const firstImg = scenes.map(s => (s.img && manifest.images[s.img]) || []).find(a => a.length)?.[0];
  // precedence: explicit hookVideo > explicit hookImg > range video > range photo
  const plateVideo = hookVideo ?? (hookImg ? undefined : firstVid?.video);
  const plateFrom = hookVideo ? hookFrom : firstVid?.videoFrom;
  const plateImg = plateVideo ? undefined : (hookImg ?? firstImg);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={Math.round(HOOK_S * FPS)} name="hook">
        <HookCard hook={hook} slug={slug} video={plateVideo} from={plateFrom} img={plateImg} />
      </Sequence>
      {scenes.map((s, i) => {
        const from = cursor; const dur = clipF(manifest, s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <ClipScene s={s} idx={i} dur={dur} slug={slug} m={manifest} />
            <Audio src={staticFile(`shorts/${slug}/audio/${s.id}.mp3`)} />
          </Sequence>
        );
      })}
      {/* vertical Reid subscribe outro baked on the end (reused asset) */}
      <Sequence from={clipsEnd} durationInFrames={OUTRO_F} name="outro">
        <OffthreadVideo src={staticFile("outro/subscribe_blackbox_short.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </AbsoluteFill>
  );
};
