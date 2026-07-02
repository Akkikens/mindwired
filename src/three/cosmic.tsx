import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const gauss = (i: number) => (rnd(i) + rnd(i + 7.3) + rnd(i + 19.1) - 1.5) / 1.5; // ~[-1,1]

// Soft round sprite so Points render as glowing dots, not hard squares.
let _dot: THREE.Texture | null = null;
export function dotTexture(): THREE.Texture | undefined {
  if (typeof document === "undefined") return undefined;
  if (_dot) return _dot;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.85)");
  grd.addColorStop(0.7, "rgba(255,255,255,0.25)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  _dot = new THREE.CanvasTexture(c);
  return _dot;
}

// ── Spiral galaxy (the hero asset) ────────────────────────────────────────────
interface GalaxyProps {
  position?: [number, number, number];
  scale?: number;
  spin?: number;
  rotation?: [number, number, number];
  coreColor?: string;
  armColor?: string;
  count?: number;
  radius?: number;
}
export const Galaxy3D: React.FC<GalaxyProps> = ({
  position = [0, 0, 0], scale = 1, spin = 0.0016, rotation = [0.5, 0, 0.15],
  coreColor = "#FFE9B0", armColor = "#7FB6FF", count = 4200, radius = 4,
}) => {
  const frame = useCurrentFrame();
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const arms = 2, twist = 4.6;
    const cCore = new THREE.Color(coreColor);
    const cArm = new THREE.Color(armColor);
    for (let i = 0; i < count; i++) {
      const t = Math.pow(rnd(i), 0.55);
      const r = t * radius;
      const arm = i % arms;
      const base = arm * ((Math.PI * 2) / arms);
      const ang = base + r * twist + (rnd(i + 1) - 0.5) * (0.6 + 1.6 * (1 - t));
      const thick = gauss(i + 2) * 0.16 * radius * Math.exp(-r / (0.45 * radius));
      pos[i * 3] = Math.cos(ang) * r;
      pos[i * 3 + 1] = thick;
      pos[i * 3 + 2] = Math.sin(ang) * r;
      const c = cCore.clone().lerp(cArm, THREE.MathUtils.smoothstep(r, 0.05 * radius, 0.6 * radius));
      const bright = 1 + (1 - t) * 1.6;
      col[i * 3] = Math.min(1, c.r * bright);
      col[i * 3 + 1] = Math.min(1, c.g * bright);
      col[i * 3 + 2] = Math.min(1, c.b * bright);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, radius, coreColor, armColor]);

  return (
    <group position={position} scale={scale} rotation={[rotation[0], rotation[1] + frame * spin, rotation[2]]}>
      <points geometry={geo}>
        <pointsMaterial size={0.07 * radius} sizeAttenuation vertexColors transparent
          map={dotTexture()} alphaTest={0.01}
          opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {/* bright core */}
      <mesh>
        <sphereGeometry args={[0.16 * radius, 20, 20]} />
        <meshBasicMaterial color={coreColor} toneMapped={false} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// ── Field of distant galaxies (clusters / superclusters / filaments) ──────────
interface FieldProps {
  count?: number;
  clusters?: number;
  spread?: number;
  warm?: boolean;
  seed?: number;
}
export const GalaxyField3D: React.FC<FieldProps> = ({
  count = 1100, clusters = 14, spread = 36, warm = false, seed = 0,
}) => {
  const frame = useCurrentFrame();
  const geo = useMemo(() => {
    const centers = Array.from({ length: clusters }).map((_, c) => [
      gauss(seed + c * 3.1) * spread,
      gauss(seed + c * 3.1 + 1) * spread * 0.6,
      gauss(seed + c * 3.1 + 2) * spread,
    ]);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = new THREE.Color(warm ? "#FFD9A0" : "#BBD4FF");
    const cB = new THREE.Color(warm ? "#FF8C5A" : "#8FA8FF");
    for (let i = 0; i < count; i++) {
      const c = centers[i % clusters];
      const s = 2.5 + rnd(seed + i) * 5;
      pos[i * 3] = c[0] + gauss(seed + i * 5) * s;
      pos[i * 3 + 1] = c[1] + gauss(seed + i * 5 + 1) * s * 0.7;
      pos[i * 3 + 2] = c[2] + gauss(seed + i * 5 + 2) * s;
      const col3 = cA.clone().lerp(cB, rnd(seed + i + 2));
      col[i * 3] = col3.r; col[i * 3 + 1] = col3.g; col[i * 3 + 2] = col3.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, clusters, spread, warm, seed]);

  return (
    <points geometry={geo} rotation={[0, frame * 0.0003, 0]}>
      <pointsMaterial size={0.55} sizeAttenuation vertexColors transparent
        map={dotTexture()} alphaTest={0.01}
        opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// ── Gravity-well basin (warped spacetime grid) ────────────────────────────────
interface BasinProps {
  size?: number; segments?: number; depth?: number; sigma?: number; color?: string;
  position?: [number, number, number];
}
export const GravityBasin3D: React.FC<BasinProps> = ({
  size = 30, segments = 60, depth = 9, sigma = 5, color = "#4FB4FF", position = [0, 0, 0],
}) => {
  const frame = useCurrentFrame();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const r2 = x * x + z * z;
      const y = -depth * Math.exp(-r2 / (2 * sigma * sigma));
      p.setY(i, y);
    }
    g.computeVertexNormals();
    return new THREE.WireframeGeometry(g);
  }, [size, segments, depth, sigma]);

  // a few galaxies sliding down the well
  const balls = Array.from({ length: 7 });
  return (
    <group position={position}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color={color} toneMapped={false} transparent opacity={0.5} />
      </lineSegments>
      {/* glowing core at the bottom */}
      <mesh position={[0, -depth + 0.4, 0]}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color="#FFB860" toneMapped={false} />
      </mesh>
      {balls.map((_, i) => {
        const a = (i / balls.length) * Math.PI * 2 + frame * 0.004;
        const orbitR = (sigma * 1.7) * (1 - ((frame * 0.0009 + rnd(i)) % 1) * 0.55);
        const x = Math.cos(a) * orbitR, z = Math.sin(a) * orbitR;
        const y = -depth * Math.exp(-(x * x + z * z) / (2 * sigma * sigma)) + 0.25;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshBasicMaterial color={i % 2 ? "#BBD4FF" : "#FFE0A8"} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ── CMB dipole sky (warm side / cool side) ────────────────────────────────────
const cmbVert = /* glsl */ `
varying vec3 vDir;
void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const cmbFrag = /* glsl */ `
precision highp float;
uniform vec3 uAxis; uniform vec3 uWarm; uniform vec3 uCool;
varying vec3 vDir;
float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
void main(){
  float d = dot(normalize(vDir), normalize(uAxis)) * 0.5 + 0.5;
  vec3 c = mix(uCool, uWarm, d);
  float n = (h(floor(vDir * 160.0)) - 0.5) * 0.08;   // CMB-like graininess
  gl_FragColor = vec4(c + n, 1.0);
}`;
export const CMBSky3D: React.FC<{ axis?: [number, number, number]; radius?: number }> = ({
  axis = [1, 0.2, 0.4], radius = 60,
}) => {
  const uniforms = useMemo(() => ({
    uAxis: { value: new THREE.Vector3(...axis) },
    uWarm: { value: new THREE.Color("#3a2230") },
    uCool: { value: new THREE.Color("#13203a") },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial vertexShader={cmbVert} fragmentShader={cmbFrag} uniforms={uniforms}
        side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
};

// ── Glow orb (attractor pull / void marker) ───────────────────────────────────
export const GlowOrb3D: React.FC<{ position: [number, number, number]; radius?: number; color?: string; intensity?: number }> = ({
  position, radius = 1, color = "#FFB860", intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.06 * Math.sin(frame * 0.08);
  return (
    <group position={position} scale={pulse}>
      <mesh><sphereGeometry args={[radius, 24, 24]} /><meshBasicMaterial color={color} toneMapped={false} transparent opacity={intensity} /></mesh>
      <mesh><sphereGeometry args={[radius * 2.4, 24, 24]} /><meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.18 * intensity} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    </group>
  );
};

// ── Laniakea flow-lines (streamlines converging to the attractor) ─────────────
interface FlowProps { lines?: number; target?: [number, number, number]; spread?: number; color?: string; }
export const FlowLines3D: React.FC<FlowProps> = ({
  lines = 40, target = [0, 0, 0], spread = 22, color = "#5FE0D0",
}) => {
  const frame = useCurrentFrame();
  const curves = useMemo(() => {
    const out: { line: THREE.Line; pts: THREE.Vector3[] }[] = [];
    const tgt = new THREE.Vector3(...target);
    for (let i = 0; i < lines; i++) {
      const start = new THREE.Vector3(
        gauss(i * 4) * spread, gauss(i * 4 + 1) * spread * 0.55, gauss(i * 4 + 2) * spread);
      // a control point that bends the path toward the target's "basin"
      const mid = start.clone().lerp(tgt, 0.5).add(
        new THREE.Vector3(gauss(i + 3) * 4, gauss(i + 5) * 4, gauss(i + 9) * 4));
      const curve = new THREE.QuadraticBezierCurve3(start, mid, tgt.clone());
      const pts = curve.getPoints(40);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.22 });
      mat.toneMapped = false;
      out.push({ line: new THREE.Line(g, mat), pts });
    }
    return out;
  }, [lines, spread, target, color]);

  return (
    <group>
      {curves.map((c, i) => {
        // flowing dot position along the curve
        const t = ((frame * 0.006 + rnd(i)) % 1);
        const idx = Math.min(c.pts.length - 1, Math.floor(t * c.pts.length));
        const p = c.pts[idx];
        return (
          <group key={i}>
            <primitive object={c.line} />
            <mesh position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
