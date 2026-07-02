import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, attractorTotalFrames, MUSIC, SceneId } from "./lib/script";
import {
  HookScene, FirstClueScene, TugOfWarScene, ZoneScene, ScaleScene,
  RepellerScene, LaniakeaScene, ShapleyScene, DestinationScene, OutroScene,
} from "./scenes";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene,
  first_clue: FirstClueScene,
  tug_of_war: TugOfWarScene,
  zone: ZoneScene,
  scale: ScaleScene,
  repeller: RepellerScene,
  laniakea: LaniakeaScene,
  shapley: ShapleyScene,
  destination: DestinationScene,
  outro: OutroScene,
};

export const GreatAttractor: React.FC = () => {
  const timeline = buildTimeline();
  const total = attractorTotalFrames();
  const sceneFrom = (id: SceneId) => timeline.find(t => t.id === id)!.from;

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      {/* music beds (looped + bounded to the next cue) */}
      {MUSIC.map((cue, i) => {
        const start = sceneFrom(cue.sceneFrom);
        const next = MUSIC[i + 1] ? sceneFrom(MUSIC[i + 1].sceneFrom) : total;
        return (
          <Sequence key={cue.clip} from={start} durationInFrames={next - start}>
            <Audio src={staticFile(`attractor/audio/${cue.clip}.mp3`)} loop volume={cue.volume} />
          </Sequence>
        );
      })}

      {/* scenes + narration */}
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            <Sequence from={sc.narrationStart}>
              <Audio src={staticFile(`attractor/audio/${sc.id}.mp3`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export { attractorTotalFrames };
