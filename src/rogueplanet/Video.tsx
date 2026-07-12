/** "A Rogue Planet Enters Our Solar System… Then Earth Changes Forever."
 *  Assembles the 14 scenes on the timeline, layers the music beds, the narration
 *  per scene, and the one-shot sound-design hits (+ a cosmic-rumble bed and a
 *  cold-open heartbeat). Mirrors src/scariest/Video.tsx. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, rogueTotalFrames, MUSIC, SFX, SceneId } from "./lib/script";
import {
  HookScene, IntroScene, TitleScene, GravityScene, WhatIsScene, InvisibleScene,
  NeptuneScene, FreezerScene, CometScene, OrbitScene, WorstCaseScene, FrozenScene,
  EndingScene, OutroScene,
} from "./scenes";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ narrationStart: number; durationInFrames: number }>> = {
  hook: HookScene,
  intro: IntroScene,
  title: TitleScene,
  gravity: GravityScene,
  whatis: WhatIsScene,
  invisible: InvisibleScene,
  neptune: NeptuneScene,
  freezer: FreezerScene,
  comet: CometScene,
  orbit: OrbitScene,
  worstcase: WorstCaseScene,
  frozen: FrozenScene,
  ending: EndingScene,
  outro: OutroScene,
};

const audio = (name: string) => staticFile(`rogueplanet/audio/${name}.mp3`);
const sfx = (name: string) => staticFile(`rogueplanet/audio/sfx/${name}.mp3`);

export const RoguePlanetVideo: React.FC = () => {
  const timeline = buildTimeline();
  const total = rogueTotalFrames();
  const from = (id: SceneId) => timeline.find(t => t.id === id)!.from;

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      {/* low cosmic rumble under everything */}
      <Audio src={sfx("cosmic_rumble")} loop volume={0.22} />

      {/* heartbeat only in the first ~20 seconds (the cold open) */}
      <Sequence from={from("hook")} durationInFrames={20 * 30}>
        <Audio src={sfx("heartbeat")} loop volume={0.4} />
      </Sequence>

      {/* music beds (looped + bounded to the next cue) */}
      {MUSIC.map((cue, i) => {
        const start = from(cue.sceneFrom);
        const next = MUSIC[i + 1] ? from(MUSIC[i + 1].sceneFrom) : total;
        return (
          <Sequence key={cue.clip} from={start} durationInFrames={next - start}>
            <Audio src={audio(cue.clip)} loop volume={cue.volume} />
          </Sequence>
        );
      })}

      {/* one-shot sound-design hits */}
      {SFX.map((cue, i) => (
        <Sequence key={`sfx${i}`} from={from(cue.sceneFrom) + Math.round(cue.atSec * 30)}>
          <Audio src={sfx(cue.clip)} volume={cue.volume} />
        </Sequence>
      ))}

      {/* scenes + narration */}
      {timeline.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.durationInFrames}>
            <Comp narrationStart={sc.narrationStart} durationInFrames={sc.durationInFrames} />
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

export { rogueTotalFrames };
