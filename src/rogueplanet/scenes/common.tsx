/** Scene wrappers for the rogue-planet episode: a procedural-diagram stage and a
 *  clip-backed stage, both under the standard Mindwired overlay stack (chapter
 *  card, key captions, vignette, grain). Mirrors src/scariest/scenes/common.tsx. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { ClipScene } from "../../components/ClipScene";
import { Captions } from "../../components/Captions";
import { ChapterTitle } from "../../components/ChapterTitle";
import { Vignette, Grain } from "../../components/FilmLook";
import { Starfield, DustField } from "./graphics";
import { captionLines, wordStart } from "../lib/manifest";

const FPS = 30;
/** frame at which a spoken word begins, in this scene's local frame space. */
export const at = (clip: string, word: string, fb: number, start: number) =>
  start + Math.round(wordStart(clip, word, fb) * FPS);

type Base = { narrationStart: number; durationInFrames: number };

/** A pure procedural diagram scene (solar-system map, orbit graphics, timeline…). */
export const RogueGraphicScene: React.FC<Base & {
  clipId: string; chapter?: string; title?: string;
  starSeed?: number; starHue?: string; dust?: boolean; dustColor?: string;
  children: React.ReactNode; captions?: boolean;
}> = ({
  narrationStart, clipId, chapter, title, starSeed = 7, starHue, dust = true,
  dustColor, children, captions = true,
}) => (
  <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 40%, #061024 0%, #02040a 70%)" }}>
    <Starfield seed={starSeed} hue={starHue} />
    {dust && <DustField color={dustColor} />}
    {children}
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {captions && <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />}
    <Vignette strength={0.95} />
    <Grain opacity={0.045} />
  </AbsoluteFill>
);

/** A clip-backed scene — AI footage (Veo / Higgsfield / Kling) dropped into
 *  public/rogueplanet/clips/. Overlays (chapter card, captions, extra graphics)
 *  pass as children. */
export const RogueClipScene: React.FC<Base & {
  clipId: string; src: string; grade?: string; chapter?: string; title?: string;
  children?: React.ReactNode; captions?: boolean;
}> = ({
  narrationStart, durationInFrames, clipId, src, grade, chapter, title,
  children, captions = true,
}) => (
  <ClipScene src={src} durationInFrames={durationInFrames} grade={grade}>
    {children}
    {chapter && title && <ChapterTitle chapter={chapter} title={title} />}
    {captions && <Captions clipId={clipId} startFrame={narrationStart} lines={captionLines(clipId)} select="key" />}
  </ClipScene>
);
