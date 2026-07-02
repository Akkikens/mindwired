import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Vec3 } from "../../three/Stage3D";

/** 3D horrors for "The Scariest Places" — the un-photographable ones, rendered as
 *  procedural geometry (black holes, magnetars, rogue worlds, the vacuum bubble).
 *  All animation is deterministic off useCurrentFrame. Stage3D supplies bloom. */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ── Black hole: pure-black horizon + tilted glowing accretion disk + photon ring ─
export const BlackHole3D: React.FC<{
  position?: Vec3; radius?: number; diskColor?: string; tilt?: number;
}> = ({ position = [0, 0, 0], radius = 2, diskColor = "#FF9A4C", tilt = 1.25 }) => {
  const frame = useCurrentFrame();
  const spin = frame * 0.012;
  return (
    <group position={position} rotation={[tilt, 0, 0]}>
      {/* event horizon — occluding black */}
      <mesh rotation={[-tilt, 0, 0]}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>
      {/* bright photon ring hugging the horizon */}
      <mesh rotation={[0, 0, spin]}>
        <torusGeometry args={[radius * 1.18, radius * 0.045, 16, 140]} />
        <meshBasicMaterial color={diskColor} toneMapped={false} transparent opacity={0.95}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* accretion disk — flat hot annulus */}
      <mesh rotation={[0, 0, spin]}>
        <ringGeometry args={[radius * 1.3, radius * 3.0, 120]} />
        <meshBasicMaterial color={diskColor} toneMapped={false} transparent opacity={0.30}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* faint outer halo */}
      <mesh rotation={[0, 0, spin]}>
        <ringGeometry args={[radius * 3.0, radius * 4.6, 120]} />
        <meshBasicMaterial color={diskColor} toneMapped={false} transparent opacity={0.08}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ── Magnetar: tiny ferocious neutron star + pulsing magnetic field loops ─────────
export const Magnetar3D: React.FC<{
  position?: Vec3; radius?: number; color?: string;
}> = ({ position = [0, 0, 0], radius = 0.9, color = "#9FD8FF" }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.12 * Math.sin(frame * 0.22);
  const loops = [0, 1, 2, 3, 4, 5];
  return (
    <group position={position} rotation={[0, frame * 0.01, 0.5]}>
      {/* core */}
      <mesh scale={pulse}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </mesh>
      {/* glow shells */}
      <mesh scale={pulse}>
        <sphereGeometry args={[radius * 1.8, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.35}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={pulse}>
        <sphereGeometry args={[radius * 3.2, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.12}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* magnetic field loops */}
      {loops.map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / loops.length) * Math.PI]}>
          <torusGeometry args={[radius * (2.6 + i * 0.5), radius * 0.04, 12, 120]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent
            opacity={0.5 * (0.6 + 0.4 * Math.sin(frame * 0.18 + i))}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// ── Quasar: feeding black hole with relativistic jets along an axis ─────────────
export const Quasar3D: React.FC<{
  position?: Vec3; scale?: number; color?: string; jetColor?: string;
}> = ({ position = [0, 0, 0], scale = 1, color = "#FFE08A", jetColor = "#8FD0FF" }) => {
  const frame = useCurrentFrame();
  const flick = 0.9 + 0.1 * Math.sin(frame * 0.3);
  return (
    <group position={position} scale={scale} rotation={[0.5, 0, 0.2]}>
      {/* blazing core */}
      <mesh scale={flick}>
        <sphereGeometry args={[0.8, 28, 28]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </mesh>
      <mesh><sphereGeometry args={[1.7, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.4}
          blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {/* accretion ring */}
      <mesh rotation={[Math.PI / 2.2, 0, frame * 0.01]}>
        <ringGeometry args={[1.2, 3.2, 96]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.28}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* twin jets */}
      {[1, -1].map((d) => (
        <mesh key={d} position={[0, d * 7, 0]} rotation={[d === 1 ? 0 : Math.PI, 0, 0]}>
          <coneGeometry args={[1.3, 13, 32, 1, true]} />
          <meshBasicMaterial color={jetColor} toneMapped={false} transparent opacity={0.22}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// ── Rogue planet: dark, sunless world — lit only by a faint crescent rim ─────────
export const RoguePlanet3D: React.FC<{
  position?: Vec3; radius?: number;
}> = ({ position = [0, 0, 0], radius = 2.4 }) => {
  const frame = useCurrentFrame();
  return (
    <group position={position} rotation={[0.3, frame * 0.004, 0]}>
      {/* the world — reacts to the scene's dim sun for a lonely crescent */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#1a2236" roughness={1} metalness={0} />
      </mesh>
      {/* thin atmospheric rim */}
      <mesh>
        <sphereGeometry args={[radius * 1.04, 48, 48]} />
        <meshBasicMaterial color="#3a5a8a" toneMapped={false} transparent opacity={0.1}
          side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ── Vacuum-decay bubble: a wall of new physics expanding at light speed ──────────
export const VacuumBubble3D: React.FC<{
  position?: Vec3; startFrame?: number; growFrames?: number; maxRadius?: number; edgeColor?: string;
}> = ({ position = [0, 0, 0], startFrame = 0, growFrames = 150, maxRadius = 16, edgeColor = "#B070FF" }) => {
  const frame = useCurrentFrame();
  // ease-in growth so the wall accelerates as it eats the cosmos
  const lin = clamp01((frame - startFrame) / growFrames);
  const p = lin * lin;
  const r = 0.2 + p * maxRadius;
  return (
    <group position={position}>
      {/* the rewritten interior — featureless void */}
      <mesh>
        <sphereGeometry args={[r * 0.97, 48, 48]} />
        <meshBasicMaterial color="#04030a" toneMapped={false} />
      </mesh>
      {/* violent leading edge — the bubble wall */}
      <mesh>
        <sphereGeometry args={[r, 64, 64]} />
        <meshBasicMaterial color={edgeColor} toneMapped={false} transparent
          opacity={0.55} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 1.04, 48, 48]} />
        <meshBasicMaterial color={edgeColor} toneMapped={false} transparent
          opacity={0.18} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};
