/** codewired #3 — "Claude Skills, Finally Explained". */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, skillsTotalFrames, SceneId, FPS } from "./script";
import {
  HookScene, IntroScene, TitleScene, ProblemScene, WhatIsScene, TriggerScene,
  AnatomyScene, BuildScene, EverywhereScene, BigPictureScene, DangerScene,
  OutroScene, SubscribeScene, ChapterCard,
} from "./scenes";

const ACCENTS: Partial<Record<SceneId, string>> = {
  problem: "#5CC8C8", whatis: "#FFC649", trigger: "#5CD68A",
  build: "#9D8CFF", bigpicture: "#FFC649", danger: "#FF3B3B",
};

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene, intro: IntroScene, title: TitleScene,
  problem: ProblemScene, whatis: WhatIsScene, trigger: TriggerScene,
  anatomy: AnatomyScene, build: BuildScene, everywhere: EverywhereScene,
  bigpicture: BigPictureScene, danger: DangerScene,
  outro: OutroScene, subscribe: SubscribeScene,
};

const audio = (name: string) => staticFile(`codewired/skills/audio/${name}.mp3`);

export const CodewiredSkillsVideo: React.FC = () => {
  const timeline = buildTimeline();
  return (
    <AbsoluteFill style={{ background: "#050A14" }}>
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            {sc.title && <ChapterCard chapter={sc.chapter} title={sc.title} beatFrames={Math.round(sc.beat * FPS)} accent={ACCENTS[sc.id] ?? "#FFC649"} />}
            {!sc.silent && (
              <Sequence from={sc.narrationStart}>
                <Audio src={audio(sc.id)} volume={1} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export { skillsTotalFrames };
