import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, gtaviTotalFrames, MUSIC, SceneId } from "./lib/script";
import {
  HookScene, LeonidaScene, FromStaticScene, StormScene, FloodScene,
  HurricaneScene, LivingWorldScene, CostScene, OutroScene,
} from "./scenes";

const SCENE: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene,
  leonida: LeonidaScene,
  from_static: FromStaticScene,
  the_storm: StormScene,
  the_flood: FloodScene,
  the_hurricane: HurricaneScene,
  living_world: LivingWorldScene,
  the_cost: CostScene,
  outro: OutroScene,
};

export const GTAVIWeather: React.FC = () => {
  const timeline = buildTimeline();
  const total = gtaviTotalFrames();
  const sceneFrom = (id: SceneId) => timeline.find(t => t.id === id)!.from;
  return (
    <AbsoluteFill style={{ background: "#05030f" }}>
      {MUSIC.map((cue, i) => {
        const start = sceneFrom(cue.sceneFrom);
        const next = MUSIC[i + 1] ? sceneFrom(MUSIC[i + 1].sceneFrom) : total;
        return (
          <Sequence key={cue.clip} from={start} durationInFrames={next - start}>
            <Audio src={staticFile(`gtavi/audio/${cue.clip}.mp3`)} loop volume={cue.volume} />
          </Sequence>
        );
      })}
      {timeline.map((sc) => {
        const Comp = SCENE[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            <Sequence from={sc.narrationStart}>
              <Audio src={staticFile(`gtavi/audio/${sc.id}.mp3`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export { gtaviTotalFrames };
