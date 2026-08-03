/** codewired podcast — two-host dialogue video. Assembles turns back-to-back,
 *  each with its own speaker's audio clip + live captions. Chapter cards fire
 *  on turns tagged with one. Subscribe outro reuses codewired's own standing
 *  code-rendered outro scene (bakes into the one render, no ffmpeg concat). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildPodcastTimeline, podcastTotalFrames, TurnDef, FPS } from "./script";
import { TwoHostScene, PodcastChapterCard } from "./scenes";
import { SubscribeScene } from "../scenes";
import turnsJson from "../../../public/codewired/podcast/turns.json";

const audio = (id: string) => staticFile(`codewired/podcast/audio/${id}.mp3`);
const turns = turnsJson as TurnDef[];

export const CodewiredPodcastVideo: React.FC = () => {
  const timeline = buildPodcastTimeline(turns);
  const outroFrames = Math.round(7.0 * FPS);
  return (
    <AbsoluteFill style={{ background: "#050A14" }}>
      {timeline.map((t) => (
        <Sequence key={t.id} from={t.from} durationInFrames={t.durationInFrames}>
          <TwoHostScene clipId={t.id} speaker={t.speaker} />
          {t.chapter && (
            <Sequence from={0} durationInFrames={60}>
              <PodcastChapterCard chapter={t.chapter} />
            </Sequence>
          )}
          <Audio src={audio(t.id)} volume={1} />
        </Sequence>
      ))}
      <Sequence from={podcastTotalFrames(turns)} durationInFrames={outroFrames}>
        <SubscribeScene narrationStart={0} durationInFrames={outroFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const codewiredPodcastTotalFrames = (turns: TurnDef[]) =>
  podcastTotalFrames(turns, Math.round(7.0 * FPS));
