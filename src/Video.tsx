import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, totalFrames, MUSIC, SCENES, SceneId } from "./lib/script";
import { HookScene } from "./scenes/HookScene";
import { LaunchScene } from "./scenes/LaunchScene";
import { ShredderScene } from "./scenes/ShredderScene";
import { BallisticScene } from "./scenes/BallisticScene";
import { GraveyardScene } from "./scenes/GraveyardScene";
import { LegacyScene } from "./scenes/LegacyScene";
import { OutroScene } from "./scenes/OutroScene";
import { C } from "./lib/theme";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene,
  s1_launch: LaunchScene,
  s2_shredder: ShredderScene,
  s3_ballistic: BallisticScene,
  s4_graveyard: GraveyardScene,
  s5_legacy: LegacyScene,
  outro: OutroScene,
};

export const LostInOrbit: React.FC = () => {
  const timeline = buildTimeline();
  const total = totalFrames();
  const sceneFrom = (id: SceneId) => timeline.find(t => t.id === id)!.from;

  return (
    <AbsoluteFill style={{ background: C.void }}>
      {/* ── Music beds (each region looped + bounded to the next cue) ── */}
      {MUSIC.map((cue, i) => {
        const start = sceneFrom(cue.sceneFrom);
        const next = MUSIC[i + 1] ? sceneFrom(MUSIC[i + 1].sceneFrom) : total;
        return (
          <Sequence key={cue.clip} from={start} durationInFrames={next - start}>
            <Audio src={staticFile(`orbit/audio/${cue.clip}.mp3`)} loop volume={cue.volume} />
          </Sequence>
        );
      })}

      {/* ── Scenes + narration ── */}
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
            <Sequence from={sc.narrationStart}>
              <Audio src={staticFile(`orbit/audio/${sc.narration}.mp3`)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export { totalFrames, SCENES };
