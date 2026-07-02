import React from "react";
import { ClipScene } from "../components/ClipScene";
import { ChapterTitle } from "../components/ChapterTitle";
import { StatCallout } from "../components/StatCallout";
import { C } from "../lib/theme";

export const CLIP_DEMO_FRAMES = 240; // 8s

/** Proof that an AI-generated clip plays as a full Mindwired scene: the clip runs
 *  under the chapter title + a count-up stat callout, graded + vignetted to match
 *  the channel. Swap public/scariest/clips/demo.mp4 for any Veo/Runway/Kling output. */
export const ClipSceneDemo: React.FC = () => (
  <ClipScene src="scariest/clips/demo.mp4" durationInFrames={CLIP_DEMO_FRAMES}>
    <ChapterTitle chapter="AI CLIP · Veo / Runway / Kling" title={"GENERATED\nFOOTAGE"} hold={4} />
    <StatCallout value="66,000,000,000× SUN" label="dropped straight into the timeline"
      color={C.danger} x={960} y={840} appearAt={40} hold={5} />
  </ClipScene>
);
