/** codewired #4 FLAGSHIP — "I Built My Own Claude Code From Scratch (It Made This Video)". */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, flagshipTotalFrames, SceneId, FPS } from "./script";
import {
  HookScene, IntroScene, TitleScene, MapScene, Loop1Scene, Loop2Scene,
  ToolsScene, PermissionsScene, ContextScene, CheckpointScene, SdkScene,
  BuildScene, Run1Scene, Run2Scene, UpgradesScene, RevealScene,
  OutroScene, SubscribeScene, ChapterCard,
} from "./scenes";

const ACCENTS: Partial<Record<SceneId, string>> = {
  map: "#FFB84D", loop1: "#FF6B8A", tools: "#FFC649", permissions: "#5CD68A",
  context: "#4AD8C8", sdk: "#9D8CFF", build: "#FF5CD0", upgrades: "#FFB84D",
};

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene, intro: IntroScene, title: TitleScene, map: MapScene,
  loop1: Loop1Scene, loop2: Loop2Scene, tools: ToolsScene,
  permissions: PermissionsScene, context: ContextScene, checkpoint: CheckpointScene,
  sdk: SdkScene, build: BuildScene, run1: Run1Scene, run2: Run2Scene,
  upgrades: UpgradesScene, reveal: RevealScene, outro: OutroScene, subscribe: SubscribeScene,
};

const audio = (name: string) => staticFile(`codewired/flagship/audio/${name}.mp3`);

export const CodewiredFlagshipVideo: React.FC = () => {
  const timeline = buildTimeline();
  return (
    <AbsoluteFill style={{ background: "#050A14" }}>
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            {sc.title && <ChapterCard chapter={sc.chapter} title={sc.title} beatFrames={Math.round(sc.beat * FPS)} accent={ACCENTS[sc.id] ?? "#FFB84D"} />}
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

export { flagshipTotalFrames };
