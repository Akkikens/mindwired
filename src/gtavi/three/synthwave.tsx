import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ── sunset / storm gradient sky ───────────────────────────────────────────────
const skyVert = `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `;
const skyFrag = `
precision highp float;
uniform float uStorm; uniform float uFlash;
varying vec3 vDir;
void main(){
  float h = clamp(vDir.y*0.5+0.5, 0.0, 1.0);
  vec3 horizon = mix(vec3(1.0,0.5,0.38), vec3(0.22,0.15,0.26), uStorm);
  vec3 mid     = mix(vec3(0.98,0.34,0.55), vec3(0.14,0.13,0.24), uStorm);
  vec3 top     = mix(vec3(0.34,0.16,0.5),  vec3(0.04,0.05,0.10), uStorm);
  vec3 c = h < 0.5 ? mix(horizon, mid, h*2.0) : mix(mid, top, (h-0.5)*2.0);
  c += uFlash * vec3(0.6,0.7,1.0);
  gl_FragColor = vec4(c, 1.0);
}`;

// ── neon grid floor ───────────────────────────────────────────────────────────
const gridVert = `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`;
const gridFrag = `
precision highp float;
uniform vec3 uA; uniform vec3 uB; uniform float uScroll;
varying vec3 vW;
void main(){
  vec2 c = vec2(vW.x, vW.z + uScroll) * 0.07;
  vec2 g = abs(fract(c) - 0.5);
  float d = min(g.x, g.y);
  float line = smoothstep(0.06, 0.0, d);
  float fade = 1.0 - clamp(length(vW.xz)/140.0, 0.0, 1.0);
  vec3 col = mix(uA, uB, clamp(-vW.z/120.0,0.0,1.0)) * line * fade * 1.6;
  gl_FragColor = vec4(col, line*fade);
}`;

interface Props {
  storm?: number;   // 0 calm sunset → 1 hurricane
  flood?: number;   // 0..1 water height
  rain?: boolean;
  lightning?: boolean;
}

export const SynthwaveCity: React.FC<Props> = ({ storm = 0, flood = 0, rain = false, lightning = false }) => {
  const frame = useCurrentFrame();

  // lightning flash: pseudo-random spikes when enabled
  const lf = lightning ? Math.max(0,
    Math.sin(frame * 0.6) > 0.985 ? 1 : 0,
    (rnd(Math.floor(frame / 20)) > 0.8 && frame % 20 < 3) ? 0.8 : 0) : 0;

  const skyUniforms = useMemo(() => ({ uStorm: { value: 0 }, uFlash: { value: 0 } }), []);
  skyUniforms.uStorm.value = storm;
  skyUniforms.uFlash.value = lf;

  const gridUniforms = useMemo(() => ({
    uA: { value: new THREE.Color("#ff3aa0") }, uB: { value: new THREE.Color("#27d3ff") }, uScroll: { value: 0 },
  }), []);
  gridUniforms.uScroll.value = frame * 0.25;

  // skyline silhouette boxes
  const buildings = useMemo(() => Array.from({ length: 46 }).map((_, i) => {
    const x = (i - 23) * 5.5 + (rnd(i) - 0.5) * 3;
    const h = 6 + rnd(i + 5) * 22;
    const w = 3 + rnd(i + 9) * 3;
    const z = -55 - rnd(i + 3) * 30;
    return { x, h, w, z, neon: rnd(i + 7) };
  }), []);

  const sunY = 6 - storm * 10;

  return (
    <group>
      {/* sky */}
      <mesh scale={300}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial vertexShader={skyVert} fragmentShader={skyFrag} uniforms={skyUniforms} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* synthwave sun (fades with storm) */}
      <group position={[0, sunY, -120]}>
        <mesh>
          <circleGeometry args={[26, 48]} />
          <meshBasicMaterial color={"#ffd36a"} toneMapped={false} transparent opacity={0.9 * (1 - storm)} />
        </mesh>
        {[-16, -9, -3].map((y, i) => (
          <mesh key={i} position={[0, y, 0.1]}>
            <planeGeometry args={[60, 2.6 + i * 1.2]} />
            <meshBasicMaterial color={"#0a0a14"} toneMapped={false} transparent opacity={0.9 * (1 - storm)} />
          </mesh>
        ))}
      </group>

      {/* neon grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[400, 400, 1, 1]} />
        <shaderMaterial vertexShader={gridVert} fragmentShader={gridFrag} uniforms={gridUniforms}
          transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* skyline silhouette with lit windows */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, -2 + b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.w]} />
            <meshStandardMaterial color="#070611" emissive={b.neon > 0.7 ? "#2a0f3a" : "#0a0a16"} emissiveIntensity={0.5} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* lit window rows on the camera-facing face */}
          {Array.from({ length: Math.max(2, Math.floor(b.h / 2.4)) }).map((_, k) => (
            <mesh key={k} position={[0, -b.h / 2 + 1.2 + k * 2.2, b.w / 2 + 0.03]}>
              <planeGeometry args={[b.w * 0.78, 0.34]} />
              <meshBasicMaterial color={b.neon > 0.6 ? "#ffd27a" : "#8fd4ff"} toneMapped={false}
                transparent opacity={0.25 + rnd(i * 9 + k) * 0.5} />
            </mesh>
          ))}
          {/* neon sign accent */}
          {b.neon > 0.5 && (
            <mesh position={[b.w / 2 + 0.05, b.h * 0.2 * (rnd(i) - 0.5), 0]}>
              <planeGeometry args={[0.5, b.h * 0.5]} />
              <meshBasicMaterial color={b.neon > 0.78 ? "#27d3ff" : "#ff3aa0"} toneMapped={false} transparent opacity={0.95} />
            </mesh>
          )}
        </group>
      ))}

      {/* drifting storm clouds (appear as the storm builds) */}
      {storm > 0.32 && Array.from({ length: 9 }).map((_, i) => {
        const dx = Math.sin(frame * 0.01 + i) * 6;
        return (
          <mesh key={i} position={[(i - 4) * 24 + (rnd(i) - 0.5) * 12 + dx, 26 + rnd(i + 2) * 9, -72 - rnd(i) * 22]}>
            <sphereGeometry args={[14 + rnd(i + 1) * 9, 18, 12]} />
            <meshStandardMaterial color="#0b0d1a" emissive="#1a1f36" emissiveIntensity={0.5 * storm} transparent opacity={0.6 + storm * 0.3} roughness={1} />
          </mesh>
        );
      })}

      {/* flood water plane */}
      {flood > 0.01 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2 + flood * 2.2, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="#0a1426" metalness={0.9} roughness={0.15} transparent opacity={0.7} />
        </mesh>
      )}

      {/* rain */}
      {rain && Array.from({ length: 360 }).map((_, i) => {
        const x = (rnd(i) - 0.5) * 130;
        const z = -8 - rnd(i + 1) * 95;
        const y = 42 - ((frame * (2.6 + rnd(i + 2) * 1.5) + rnd(i + 3) * 60) % 62);
        return (
          <mesh key={i} position={[x, y, z]} scale={[0.035, 2.4, 0.035]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#b8dcff" toneMapped={false} transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* fill light */}
      <ambientLight intensity={0.3 + (1 - storm) * 0.3} />
      <directionalLight position={[0, 8, -40]} intensity={1.2 * (1 - storm * 0.6)} color={storm > 0.5 ? "#6680c0" : "#ff8a6a"} />
    </group>
  );
};
