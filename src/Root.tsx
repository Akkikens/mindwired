import "./index.css";
import "./lib/fonts";
import React from "react";
import { Composition, Still } from "remotion";
import { LostInOrbit, totalFrames } from "./Video";
import { Thumbnail } from "./Thumbnail";
import { ProofScene } from "./three/ProofScene";
import { GreatAttractor, attractorTotalFrames } from "./attractor/Video";
import { AttractorThumbnail } from "./attractor/Thumbnail";
import { GTAVIWeather, gtaviTotalFrames } from "./gtavi/Video";
import { GTAVIThumbnail } from "./gtavi/Thumbnail";
import { MotionEnergyDemo, MOTION_DEMO_FRAMES } from "./demo/MotionEnergyDemo";
import { ClipSceneDemo, CLIP_DEMO_FRAMES } from "./demo/ClipSceneDemo";
import { ScariestPlaces, scariestTotalFrames } from "./scariest/Video";
import { ScariestThumbnail } from "./scariest/Thumbnail";
import { ViralShort, viralShortFrames } from "./viral/ShortEngine";
import { ShortManifest, VisualPlan } from "./viral/lib/types";
import roguebhPlanJson from "./viral/plans/roguebh.json";
import roguebhManifestJson from "../public/shorts/roguebh/audio/manifest.json";
import darkforestPlanJson from "./viral/plans/darkforest.json";
import darkforestManifestJson from "../public/shorts/darkforest/audio/manifest.json";
import bootesvoidPlanJson from "./viral/plans/bootesvoid.json";
import bootesvoidManifestJson from "../public/shorts/bootesvoid/audio/manifest.json";
import ton618PlanJson from "./viral/plans/ton618.json";
import ton618ManifestJson from "../public/shorts/ton618/audio/manifest.json";
import betelgeusePlanJson from "./viral/plans/betelgeuse.json";
import betelgeuseManifestJson from "../public/shorts/betelgeuse/audio/manifest.json";

const roguebhPlan = roguebhPlanJson as unknown as VisualPlan;
const roguebhManifest = roguebhManifestJson as unknown as ShortManifest;

const SHORTS: Array<{ id: string; plan: VisualPlan; manifest: ShortManifest }> = [
  { id: "ShortDarkForest", plan: darkforestPlanJson as unknown as VisualPlan, manifest: darkforestManifestJson as unknown as ShortManifest },
  { id: "ShortBootesVoid", plan: bootesvoidPlanJson as unknown as VisualPlan, manifest: bootesvoidManifestJson as unknown as ShortManifest },
  { id: "ShortTon618", plan: ton618PlanJson as unknown as VisualPlan, manifest: ton618ManifestJson as unknown as ShortManifest },
  { id: "ShortBetelgeuse", plan: betelgeusePlanJson as unknown as VisualPlan, manifest: betelgeuseManifestJson as unknown as ShortManifest },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Viral shorts engine (src/viral) — data-driven, plan JSON per video ── */}
      <Composition
        id="ShortRogueBH"
        component={ViralShort}
        defaultProps={{ plan: roguebhPlan, manifest: roguebhManifest }}
        durationInFrames={viralShortFrames(roguebhPlan, roguebhManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {SHORTS.map((s) => (
        <React.Fragment key={s.id}>
          <Composition
            id={s.id}
            component={ViralShort}
            defaultProps={{ plan: s.plan, manifest: s.manifest }}
            durationInFrames={viralShortFrames(s.plan, s.manifest)}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id={`${s.id}Wide`}
            component={ViralShort}
            defaultProps={{ plan: s.plan, manifest: s.manifest }}
            durationInFrames={viralShortFrames(s.plan, s.manifest)}
            fps={30}
            width={1920}
            height={1080}
          />
        </React.Fragment>
      ))}
      <Composition
        id="ShortRogueBHWide"
        component={ViralShort}
        defaultProps={{ plan: roguebhPlan, manifest: roguebhManifest }}
        durationInFrames={viralShortFrames(roguebhPlan, roguebhManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionEnergyDemo"
        component={MotionEnergyDemo}
        durationInFrames={MOTION_DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClipSceneDemo"
        component={ClipSceneDemo}
        durationInFrames={CLIP_DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Mindwired #4 — The Scariest Places In The Universe ── */}
      <Composition
        id="ScariestPlaces"
        component={ScariestPlaces}
        durationInFrames={scariestTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="ScariestThumbnail"
        component={ScariestThumbnail}
        width={1280}
        height={720}
      />

      <Composition
        id="Proof3D"
        component={ProofScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LostInOrbit"
        component={LostInOrbit}
        durationInFrames={totalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="Thumbnail"
        component={Thumbnail}
        width={1280}
        height={720}
      />

      {/* ── Mindwired #2 — The Great Attractor ── */}
      <Composition
        id="GreatAttractor"
        component={GreatAttractor}
        durationInFrames={attractorTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="AttractorThumbnail"
        component={AttractorThumbnail}
        width={1280}
        height={720}
      />

      {/* ── Mindwired (Digital Simulation) — GTA 6 Weather ── */}
      <Composition
        id="GTAVIWeather"
        component={GTAVIWeather}
        durationInFrames={gtaviTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="GTAVIThumbnail"
        component={GTAVIThumbnail}
        width={1280}
        height={720}
      />
    </>
  );
};
