/** HookProbe — render ONE hook variant as a standalone 1080x1920 clip for
 *  scoring. This is the render half of the HOOK-LAB loop (HOOK-LAB.md):
 *  `scripts/hook_lab.py <slug>` writes, per variant, the narration mp3 + real
 *  forced-aligned word timings (public/shorts/<slug>/hooklab/<id>.mp3 +
 *  <id>.words.json) and a hooks.json index. This comp plays exactly ONE of
 *  those hooks — same Backdrop + CameraRig + SafeArea + KineticText + VoicePulse
 *  a "hook"-kind scene gets in ShortEngine's SceneShell — so what you score is
 *  what ships. Then the Higgsfield virality predictor scores the rendered clip
 *  (Hook Score + Hold Rate) and the winner is promoted into the plan's first
 *  scene. Nothing here fires a paid call; it's a pure Remotion comp.
 *
 *  It renders from PROPS only (no static plan/manifest import), so a caller
 *  drives it entirely via `--props`, e.g.:
 *    npx remotion render HookProbe out/hook-<slug>-<id>.mp4 --props='{
 *      "slug":"brokentime","variantId":"aging","mainText":"YOUR HEAD IS OLDER",
 *      "emphasis":["OLDER"],"words":[{"word":"Your","start":0,"end":0.3}, ...],
 *      "durationInFrames":150,
 *      "audioSrc":"shorts/brokentime/hooklab/aging.mp3"}'
 *  (words + durationInFrames come straight from <id>.words.json + hooks.json.)
 *
 *  Registered as <Composition id="HookProbe"> in src/Root.tsx — its
 *  calculateMetadata reads durationInFrames from the passed props so the clip
 *  length matches the hook audio, defaulting to 150 (5s) when unspecified.
 */
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { CameraRig } from "./components/CameraRig";
import { SafeArea, VoicePulse } from "./components/HUD";
import { KineticText, Kicker } from "./components/KineticText";
import { TONES } from "./lib/tone";
import { EmotionalTone, TimedWord } from "./lib/types";

/** Props for a single hook clip. `words` are the raw forced-aligned timings
 *  from <id>.words.json (TimedWord[]); KineticText maps mainText's words onto
 *  them internally. `tone` defaults to "shock" — the beat a hook almost always
 *  is (hook_lab.py directs Hume with the shock tone), but a caller can override
 *  it to match the plan's real first-scene tone. `audioSrc` is optional so the
 *  comp still previews silently before hook_lab.py has produced the mp3. */
/** All fields optional (with in-component defaults) so the component type is
 *  assignable to Remotion's `Record<string, unknown>` Composition prop bound —
 *  a caller always drives the real values via --props / defaultProps. */
export interface HookProbeProps {
  slug?: string;
  variantId?: string;
  mainText?: string;
  emphasis?: string[];
  kicker?: string;
  tone?: EmotionalTone;
  words?: TimedWord[];
  durationInFrames?: number;
  audioSrc?: string;
}

export const HOOK_PROBE_DEFAULT_FRAMES = 150; // 5s @ 30fps — a sensible hook length

/** The hook layout, mirroring SceneShell's world layer for a "hook"-kind scene:
 *  Backdrop under the camera, a centered kicker + kinetic caption in the safe
 *  area, VoicePulse and audio on top. The first scene opens hard (no fade-in),
 *  so there is no entrance transition here. */
export const HookProbe: React.FC<HookProbeProps> = ({
  slug = "sample",
  variantId = "hook",
  mainText = "THE HOOK GOES HERE",
  emphasis = [],
  kicker,
  tone = "shock",
  words = [],
  durationInFrames = HOOK_PROBE_DEFAULT_FRAMES,
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const t = TONES[tone];
  // deterministic seed in the same spirit as SceneShell (id length + start)
  const seed = variantId.length * 997 + slug.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#03040A" }}>
      <CameraRig tone={t} durationInFrames={durationInFrames} camera={t.camera}>
        <Backdrop tone={t} seed={seed} />
        <SafeArea>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            {kicker && <Kicker text={kicker} tone={t} />}
            <KineticText text={mainText} words={words} tone={t} emphasis={emphasis} />
          </div>
        </SafeArea>
      </CameraRig>
      <VoicePulse words={words} sceneFrame={frame} tone={t} bottom={190} />
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
    </AbsoluteFill>
  );
};

/** Frame count for the HookProbe composition. Reads durationInFrames off the
 *  passed props (from hooks.json), rounding up so the tail of the audio is
 *  never clipped; falls back to the 5s default when absent. */
export const hookProbeFrames = (props: Partial<HookProbeProps>): number =>
  props.durationInFrames && props.durationInFrames > 0
    ? Math.ceil(props.durationInFrames)
    : HOOK_PROBE_DEFAULT_FRAMES;
