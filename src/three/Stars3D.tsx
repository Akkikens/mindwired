import React, { useMemo } from "react";
import * as THREE from "three";
import { dotTexture } from "./cosmic";

interface Props { count?: number; radius?: number; }

/** A spherical shell of stars (additive points) surrounding the camera. */
export const Stars3D: React.FC<Props> = ({ count = 2600, radius = 60 }) => {
  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const cWarm = new THREE.Color("#fff2d6");
    const cCool = new THREE.Color("#cfe2ff");
    const cWhite = new THREE.Color("#ffffff");
    for (let i = 0; i < count; i++) {
      // even-ish distribution on a sphere
      const u = Math.sin(i * 12.9898) * 43758.5453;
      const v = Math.sin(i * 78.233) * 12543.123;
      const t1 = u - Math.floor(u);
      const t2 = v - Math.floor(v);
      const theta = t1 * Math.PI * 2;
      const phi = Math.acos(2 * t2 - 1);
      const r = radius * (0.7 + (Math.sin(i * 3.17) * 0.5 + 0.5) * 0.3);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const pick = t1 * 3;
      const c = pick < 1 ? cWarm : pick < 2 ? cCool : cWhite;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      sizes[i] = 0.05 + t2 * 0.22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return { geometry: g };
  }, [count, radius]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.32}
        sizeAttenuation
        transparent
        map={dotTexture()}
        alphaTest={0.01}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
