import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Stars3D } from "./Stars3D";

export type Vec3 = [number, number, number];
export interface CamState { pos: Vec3; target: Vec3; fov?: number; }
export type CamPath = (t: number) => CamState;

/** Smooth ease for camera moves. */
export const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));

const CameraRig: React.FC<{ path: CamPath; durationInFrames: number }> = ({ path, durationInFrames }) => {
  const frame = useCurrentFrame();
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const t = durationInFrames > 0 ? frame / durationInFrames : 0;
  const { pos, target, fov } = path(t);
  cam.position.set(pos[0], pos[1], pos[2]);
  cam.lookAt(target[0], target[1], target[2]);
  if (fov && cam.isPerspectiveCamera) cam.fov = fov;
  cam.updateProjectionMatrix();
  return null;
};

interface Props {
  durationInFrames: number;
  camera: CamPath;
  sun?: Vec3;
  sunColor?: string;
  sunIntensity?: number;
  ambient?: number;
  bloom?: { intensity?: number; threshold?: number; radius?: number };
  stars?: number;
  background?: string;
  children?: React.ReactNode;
}

/** Reusable cinematic WebGL stage: animated camera, key+rim lights, starfield,
 *  and a film-grade post stack (bloom + chromatic aberration + vignette). */
export const Stage3D: React.FC<Props> = ({
  durationInFrames, camera, sun = [6, 2.5, 4], sunColor = "#fff6e8", sunIntensity = 2.4,
  ambient = 0.12, bloom = {}, stars = 2800, background = "#02040a", children,
}) => {
  const { width, height } = useVideoConfig();
  const init = camera(0);
  const { intensity = 1.1, threshold = 0.5, radius = 0.72 } = bloom;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: init.fov ?? 38, position: init.pos, near: 0.1, far: 400 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background }}
    >
      <CameraRig path={camera} durationInFrames={durationInFrames} />
      <ambientLight intensity={ambient} />
      <directionalLight position={sun} intensity={sunIntensity} color={sunColor} />
      <directionalLight position={[-sun[0], -1, -sun[2]]} intensity={0.22} color="#3a6bd0" />
      {stars > 0 && <Stars3D count={stars} radius={80} />}
      {children}
      <EffectComposer>
        <Bloom intensity={intensity} luminanceThreshold={threshold} luminanceSmoothing={0.3} mipmapBlur radius={radius} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0002, 0.0002]} />
        <Vignette eskil={false} offset={0.26} darkness={0.86} />
      </EffectComposer>
    </ThreeCanvas>
  );
};
