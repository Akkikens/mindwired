import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ── a lost bolt (ballistic projectile) ───────────────────────────────────────
export const Bolt3D: React.FC<{ position?: [number, number, number]; scale?: number; spin?: number }> = ({
  position = [0, 0, 0], scale = 1, spin = 0.05,
}) => {
  const frame = useCurrentFrame();
  const metal = { color: "#c2cad6", roughness: 0.32, metalness: 0.88, emissive: "#0a1422", emissiveIntensity: 0.25 };
  return (
    <group position={position} scale={scale} rotation={[frame * spin * 0.8, frame * spin, frame * spin * 0.5]}>
      {/* hex head */}
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.5, 0.5, 0.42, 6]} /><meshStandardMaterial {...metal} /></mesh>
      {/* shaft */}
      <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.26, 0.26, 1.2, 20]} /><meshStandardMaterial {...metal} /></mesh>
      {/* threads */}
      {[-0.6, -0.4, -0.2, 0.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.045, 8, 20]} /><meshStandardMaterial {...metal} />
        </mesh>
      ))}
    </group>
  );
};

// ── ISS-style station ───────────────────────────────────────────────────────
export const Station3D: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0], scale = 1,
}) => {
  const frame = useCurrentFrame();
  const metal = { color: "#9aa6b6", roughness: 0.45, metalness: 0.7, emissive: "#0a1422", emissiveIntensity: 0.2 };
  const panel = { color: "#0e2a4a", roughness: 0.3, metalness: 0.4, emissive: "#10325a", emissiveIntensity: 0.5 };
  return (
    <group position={position} scale={scale} rotation={[0.2, frame * 0.0016, 0.1]}>
      {/* main truss */}
      <mesh><boxGeometry args={[6, 0.18, 0.18]} /><meshStandardMaterial {...metal} /></mesh>
      {/* core modules */}
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.34, 0.34, 1.4, 16]} /><meshStandardMaterial {...metal} /></mesh>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.26, 0.26, 1.0, 14]} /><meshStandardMaterial {...metal} /></mesh>
      {/* solar arrays */}
      {[-2.4, 2.4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {[-0.95, 0.95].map((z, k) => (
            <mesh key={k} position={[0, 0, z]}>
              <boxGeometry args={[1.7, 0.03, 0.8]} /><meshStandardMaterial {...panel} />
            </mesh>
          ))}
        </group>
      ))}
      {/* radiators */}
      <mesh position={[0, 0.6, 0]}><boxGeometry args={[1.4, 0.02, 0.5]} /><meshStandardMaterial {...metal} /></mesh>
    </group>
  );
};

// ── tumbling debris cloud ─────────────────────────────────────────────────────
export const DebrisField3D: React.FC<{ count?: number; spread?: number; speed?: number }> = ({
  count = 40, spread = 22, speed = 0.03,
}) => {
  const frame = useCurrentFrame();
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const x = (rnd(i) - 0.5) * spread * 2;
        const y = (rnd(i + 1) - 0.5) * spread;
        const z = ((rnd(i + 2) * spread * 2 + frame * speed * (0.6 + rnd(i + 9))) % (spread * 2)) - spread;
        const rot = frame * (0.01 + rnd(i + 4) * 0.04);
        const s = 0.05 + rnd(i + 5) * 0.2;
        const kind = Math.floor(rnd(i + 6) * 3);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[rot, rot * 1.3, rot * 0.7]}>
            {kind === 0 && <boxGeometry args={[s, s * 0.6, s * 1.2]} />}
            {kind === 1 && <tetrahedronGeometry args={[s]} />}
            {kind === 2 && <cylinderGeometry args={[s * 0.4, s * 0.4, s * 1.4, 6]} />}
            <meshStandardMaterial color={rnd(i + 7) > 0.7 ? "#aebccf" : "#7c8aa0"}
              roughness={0.55} metalness={0.4} emissive="#0a1422" emissiveIntensity={0.25} />
          </mesh>
        );
      })}
    </group>
  );
};

// ── orbital system: tilted rings of moving debris around Earth ────────────────
export const OrbitSystem3D: React.FC<{ graveyardIndex?: number }> = ({ graveyardIndex = 2 }) => {
  const frame = useCurrentFrame();
  const rings = [
    { r: 3.0, tilt: 0.35, n: 5, speed: 0.012, col: "#36D4FF" },
    { r: 3.7, tilt: -0.18, n: 8, speed: 0.009, col: "#9FD8FF" },
    { r: 4.5, tilt: 0.12, n: 22, speed: 0.006, col: "#FFB347" },
    { r: 5.4, tilt: -0.3, n: 6, speed: 0.004, col: "#9FD8FF" },
  ];
  return (
    <group>
      {rings.map((ring, ri) => {
        const grave = ri === graveyardIndex;
        const dots = grave ? ring.n * 3 : ring.n;
        const col = grave ? "#FFB347" : ring.col;
        return (
          <group key={ri} rotation={[Math.PI / 2 + ring.tilt, 0, ring.tilt * 0.5]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.r, grave ? 0.018 : 0.008, 8, 160]} />
              <meshBasicMaterial color={col} toneMapped={false} transparent opacity={grave ? 0.9 : 0.45} />
            </mesh>
            {Array.from({ length: dots }).map((_, i) => {
              const a = (i / dots) * Math.PI * 2 + frame * ring.speed;
              return (
                <mesh key={i} position={[Math.cos(a) * ring.r, 0, Math.sin(a) * ring.r]}>
                  <sphereGeometry args={[grave ? 0.055 : 0.045, 8, 8]} />
                  <meshBasicMaterial color={col} toneMapped={false} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

// ── atomic-oxygen stream (fast streaks slamming a target) ─────────────────────
export const AtomicStream3D: React.FC<{ target?: [number, number, number]; from?: number; color?: string }> = ({
  target = [0, 0, 0], from = -8, color = "#27E0C3",
}) => {
  const frame = useCurrentFrame();
  const N = 70;
  return (
    <group>
      {Array.from({ length: N }).map((_, i) => {
        const prog = ((frame * (0.04 + rnd(i) * 0.05) + rnd(i + 1)) % 1);
        const sx = from + rnd(i + 2) * 2;
        const sy = (rnd(i + 3) - 0.5) * 6;
        const sz = (rnd(i + 4) - 0.5) * 6;
        const x = THREE.MathUtils.lerp(sx, target[0] + (rnd(i) - 0.5) * 1.6, prog);
        const y = THREE.MathUtils.lerp(sy, target[1] + (rnd(i + 5) - 0.5) * 1.6, prog);
        const z = THREE.MathUtils.lerp(sz, target[2] + (rnd(i + 6) - 0.5) * 1.6, prog);
        const op = Math.sin(prog * Math.PI);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, 0.5]} scale={[0.5, 0.04, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={op} />
          </mesh>
        );
      })}
    </group>
  );
};

// ── Kessler cascade: staggered collision bursts ───────────────────────────────
export const KesslerCascade3D: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame() - startAt;
  if (frame < 0) return null;
  const nodes = Array.from({ length: 12 }).map((_, i) => ({
    p: [(rnd(i) - 0.5) * 12, (rnd(i + 1) - 0.5) * 7, (rnd(i + 2) - 0.5) * 6] as [number, number, number],
    t: rnd(i + 3) * 70,
  }));
  return (
    <group>
      {nodes.map((n, i) => {
        const age = frame - n.t;
        if (age < 0) return null;
        const flash = clamp01(1 - age / 16);
        return (
          <group key={i} position={n.p}>
            <mesh scale={0.1 + flash * 0.5}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial color="#FF6A3C" toneMapped={false} transparent opacity={flash} />
            </mesh>
            {Array.from({ length: 7 }).map((_, k) => {
              const a = (k / 7) * Math.PI * 2;
              const d = clamp01(age / 40) * 1.6;
              return (
                <mesh key={k} position={[Math.cos(a) * d, Math.sin(a) * d, (rnd(k) - 0.5) * d]}>
                  <boxGeometry args={[0.08, 0.08, 0.08]} />
                  <meshBasicMaterial color="#FF4D4D" toneMapped={false} transparent opacity={clamp01(1 - age / 50)} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

// ── reentry streak (glove burning up) ─────────────────────────────────────────
export const ReentryStreak3D: React.FC<{
  startAt: number; from: [number, number, number]; to: [number, number, number]; dur?: number;
}> = ({ startAt, from, to, dur = 46 }) => {
  const frame = useCurrentFrame() - startAt;
  if (frame < 0) return null;
  const p = clamp01(frame / dur);
  const head: [number, number, number] = [
    THREE.MathUtils.lerp(from[0], to[0], p),
    THREE.MathUtils.lerp(from[1], to[1], p),
    THREE.MathUtils.lerp(from[2], to[2], p),
  ];
  const op = p < 0.1 ? p / 0.1 : p > 0.85 ? clamp01((1 - p) / 0.15) : 1;
  const trail = 14;
  return (
    <group>
      {Array.from({ length: trail }).map((_, i) => {
        const tp = clamp01(p - i * 0.018);
        const x = THREE.MathUtils.lerp(from[0], to[0], tp);
        const y = THREE.MathUtils.lerp(from[1], to[1], tp);
        const z = THREE.MathUtils.lerp(from[2], to[2], tp);
        const s = (1 - i / trail) * 0.22;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[s, 8, 8]} />
            <meshBasicMaterial color={i < 3 ? "#FFFFFF" : "#FFB347"} toneMapped={false}
              transparent opacity={op * (1 - i / trail)} />
          </mesh>
        );
      })}
      <mesh position={head}>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} transparent opacity={op} />
      </mesh>
    </group>
  );
};

// ── radar sweep (Space Fence) ─────────────────────────────────────────────────
export const RadarSweep3D: React.FC<{ radius?: number }> = ({ radius = 5.5 }) => {
  const frame = useCurrentFrame();
  const sweep = frame * 0.03;
  const targets = Array.from({ length: 18 }).map((_, i) => ({
    p: [(rnd(i) - 0.5) * 11, (rnd(i + 1) - 0.5) * 7, (rnd(i + 2) - 0.5) * 5] as [number, number, number],
    a: rnd(i) * Math.PI * 2,
  }));
  return (
    <group>
      {/* concentric rings in the orbital plane */}
      {[2.5, 3.6, 4.7, 5.6].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.006, 6, 120]} />
          <meshBasicMaterial color="#36D4FF" toneMapped={false} transparent opacity={0.16} />
        </mesh>
      ))}
      {/* rotating beam */}
      <group rotation={[0, sweep, 0]}>
        <mesh position={[radius / 2, 0, 0]} scale={[radius, 0.02, 0.06]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#36D4FF" toneMapped={false} transparent opacity={0.5} />
        </mesh>
      </group>
      {/* tracked dots brighten as the beam passes */}
      {targets.map((t, i) => {
        const diff = Math.abs(((sweep % (Math.PI * 2)) - t.a + Math.PI * 3) % (Math.PI * 2) - Math.PI);
        const lit = diff > Math.PI - 0.5 ? 1 : 0.3;
        return (
          <mesh key={i} position={t.p}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#36D4FF" toneMapped={false} transparent opacity={lit} />
          </mesh>
        );
      })}
    </group>
  );
};
