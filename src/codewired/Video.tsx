/** codewired #1 — "Claude Code Subagents, Finally Explained (animated)".
 *  Assembles 14 scenes + per-scene narration + chapter cards. Music bed is
 *  added at the master pass (--music public/beds/doc_open.mp3), not here.
 *  Final sequence = the code-rendered codewired subscribe outro ($0). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, codewiredTotalFrames, SceneId, FPS } from "./lib/script";
import {
  HookScene, IntroScene, TitleScene, ProblemScene, DelegateScene, WorkScene,
  MemoryScene, AnatomyScene, TeamScene, CostScene, MistakeScene, RuleScene,
  OutroScene, SubscribeScene, ChapterCard,
} from "./scenes";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene, intro: IntroScene, title: TitleScene,
  problem: ProblemScene, delegate: DelegateScene, work: WorkScene,
  memory: MemoryScene, anatomy: AnatomyScene, team: TeamScene,
  cost: CostScene, mistake: MistakeScene, rule: RuleScene,
  outro: OutroScene, subscribe: SubscribeScene,
};

const audio = (name: string) => staticFile(`codewired/subagents/audio/${name}.mp3`);

export const CodewiredSubagentsVideo: React.FC = () => {
  const timeline = buildTimeline();
  return (
    <AbsoluteFill style={{ background: "#050A14" }}>
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            {sc.title && <ChapterCard chapter={sc.chapter} title={sc.title} beatFrames={Math.round(sc.beat * FPS)} />}
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

export { codewiredTotalFrames };
