/** codewired #2 — "MCP Explained: The Port That Plugs AI Into Everything". */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, mcpTotalFrames, SceneId, FPS } from "./script";
import {
  HookScene, IntroScene, TitleScene, ChaosScene, PortScene, AnatomyScene,
  MenuScene, FlowScene, EcosystemScene, DangerScene, OutroScene, SubscribeScene,
  ChapterCard,
} from "./scenes";

const ACCENTS: Partial<Record<SceneId, string>> = {
  chaos: "#FFA53C", port: "#7CFF9C", anatomy: "#FF5CD0", flow: "#7CFFB2", danger: "#FF3B3B",
};

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene, intro: IntroScene, title: TitleScene,
  chaos: ChaosScene, port: PortScene, anatomy: AnatomyScene, menu: MenuScene,
  flow: FlowScene, ecosystem: EcosystemScene, danger: DangerScene,
  outro: OutroScene, subscribe: SubscribeScene,
};

const audio = (name: string) => staticFile(`codewired/mcp/audio/${name}.mp3`);

export const CodewiredMcpVideo: React.FC = () => {
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

export { mcpTotalFrames };
