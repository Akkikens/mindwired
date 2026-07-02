import React, { useRef } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

interface Props {
  position?: [number, number, number];
  scale?: number;
  spin?: number;
  bleach?: number;  // 0 fresh grey → 1 bleached white
}

/** A stylized EVA glove built from primitives. Charming-but-simple 3D (no .glb). */
export const Glove3D: React.FC<Props> = ({ position = [0, 0, 0], scale = 1, spin = 0.01, bleach = 0 }) => {
  const frame = useCurrentFrame();
  const g = useRef<THREE.Group>(null);

  const shell = new THREE.Color().lerpColors(
    new THREE.Color("#c2ccd8"), new THREE.Color("#eef2f6"), bleach);
  const mat = {
    color: shell, roughness: 0.62 + bleach * 0.2, metalness: 0.12,
    emissive: new THREE.Color("#0a1422"), emissiveIntensity: 0.25,
  };

  const rx = frame * spin * 0.7;
  const ry = frame * spin;
  const rz = frame * spin * 0.4;
  const fingers: [number, number, number][] = [
    [-0.42, 1.15, 0], [-0.14, 1.32, 0], [0.16, 1.26, 0], [0.44, 1.05, 0],
  ];

  return (
    <group position={position} scale={scale} rotation={[rx, ry, rz]} ref={g}>
      {/* palm */}
      <mesh>
        <boxGeometry args={[1.05, 1.3, 0.5]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* palm rounding */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* fingers */}
      {fingers.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], 0]} rotation={[0, 0, (p[0]) * 0.18]}>
          <capsuleGeometry args={[0.13, 0.62 + (i === 1 || i === 2 ? 0.18 : 0), 6, 12]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      {/* thumb */}
      <mesh position={[-0.62, 0.1, 0.05]} rotation={[0, 0, 1.0]}>
        <capsuleGeometry args={[0.15, 0.5, 6, 12]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* cuff */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.62, 0.66, 0.5, 28]} />
        <meshStandardMaterial {...mat} roughness={0.5} />
      </mesh>
      {/* connector ring */}
      <mesh position={[0, -1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.1, 16, 32]} />
        <meshStandardMaterial color="#39465a" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
};
