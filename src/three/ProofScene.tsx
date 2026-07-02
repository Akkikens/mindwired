import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette as PostVignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Earth3D } from "./Earth3D";
import { Stars3D } from "./Stars3D";
import { Glove3D } from "./Glove3D";
import { Grain } from "../components/FilmLook";

const SUN: [number, number, number] = [6, 2.5, 4];

/** Drives the camera along a slow cinematic dolly + slight orbit. */
const CameraRig: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const cam = useThree((s) => s.camera);
  const t = frame / durationInFrames;

  // slow push-in + arc around the Earth
  const ang = interpolate(t, [0, 1], [-0.5, 0.35]);
  const dist = interpolate(t, [0, 1], [9.5, 6.8]);
  const height = interpolate(t, [0, 1], [1.8, -0.6]);
  cam.position.set(Math.sin(ang) * dist, height, Math.cos(ang) * dist);
  cam.lookAt(0, 0.1, 0);
  cam.updateProjectionMatrix();
  return null;
};

const Scene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  return (
    <>
      <CameraRig durationInFrames={durationInFrames} />
      <ambientLight intensity={0.12} />
      <directionalLight position={SUN} intensity={2.4} color="#fff6e8" />
      {/* cold rim fill */}
      <directionalLight position={[-6, -1, -3]} intensity={0.25} color="#3a6bd0" />

      <Stars3D count={2800} radius={70} />
      <Earth3D position={[0, 0, 0]} radius={2.2} sunDir={SUN} spin={0.0014} />
      <Glove3D position={[3.0, 1.2, 2.6]} scale={0.5} spin={0.014} bleach={0.6} />

      <EffectComposer>
        <Bloom intensity={1.15} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006]} />
        <PostVignette eskil={false} offset={0.28} darkness={0.85} />
      </EffectComposer>
    </>
  );
};

export const ProofScene: React.FC = () => {
  const { width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#02040a" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 38, position: [0, 1.8, 9.5], near: 0.1, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ opacity: fadeIn }}
      >
        <Scene durationInFrames={durationInFrames} />
      </ThreeCanvas>
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
