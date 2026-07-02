import React, { useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { SIMPLEX3D } from "./glsl";

const earthVert = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vViewDir;
varying vec3 vObj;
void main(){
  vObj = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const earthFrag = /* glsl */ `
precision highp float;
uniform vec3 uSunDir;
uniform float uTime;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vViewDir;
varying vec3 vObj;
${SIMPLEX3D}
void main(){
  vec3 n = normalize(vNormalW);
  vec3 sp = normalize(vObj);

  // continents
  float cont = fbm(sp * 1.9 + vec3(11.3, 4.1, 7.7));
  float coast = fbm(sp * 6.0);
  float land = cont + coast * 0.15;
  float landMask = smoothstep(0.10, 0.24, land);   // ~Earth-like ocean coverage

  vec3 ocean = mix(vec3(0.01,0.05,0.16), vec3(0.03,0.15,0.34), smoothstep(-0.4,0.15,cont));
  vec3 lowLand = vec3(0.11,0.20,0.09);              // muted forest
  vec3 midLand = vec3(0.30,0.26,0.14);              // savanna
  vec3 hiLand  = vec3(0.44,0.34,0.22);              // desert/mountain
  float arid = fbm(sp * 3.3 + 20.0);
  vec3 landC = mix(lowLand, midLand, smoothstep(0.1,0.5,land));
  landC = mix(landC, hiLand, smoothstep(0.2,0.7,arid));
  vec3 day = mix(ocean, landC, landMask);

  // polar ice
  float lat = abs(sp.y);
  day = mix(day, vec3(0.92,0.96,1.0), smoothstep(0.74,0.90,lat));

  // clouds
  float clouds = smoothstep(0.25, 0.6, fbm(sp*2.6 + vec3(uTime*0.02, 0.0, 0.0)));
  day = mix(day, vec3(0.95,0.97,1.0), clouds*0.45);

  // sun lighting
  float ndl = dot(n, normalize(uSunDir));
  float diff = clamp(ndl, 0.0, 1.0);
  float night = 1.0 - smoothstep(-0.12, 0.18, ndl);

  // city lights on night-side land
  float cityN = fbm(sp * 9.0 + 3.0);
  float city = smoothstep(0.52, 0.6, cityN) * landMask * night;
  vec3 lights = vec3(1.0,0.78,0.42) * city * 1.6;

  // atmospheric fresnel rim
  float fres = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 3.0);
  vec3 atmo = vec3(0.30,0.62,1.0) * fres * (0.35 + diff*0.8);

  // terminator warm scatter
  float term = smoothstep(0.0, 0.35, diff) * (1.0 - smoothstep(0.35, 0.7, diff));
  atmo += vec3(1.0,0.5,0.25) * term * fres * 0.6;

  vec3 col = day * (0.05 + diff*1.15) + lights + atmo;
  gl_FragColor = vec4(col, 1.0);
}`;

const atmoVert = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec4 wp = modelMatrix * vec4(position,1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const atmoFrag = /* glsl */ `
precision highp float;
uniform vec3 uSunDir;
uniform vec3 uColor;
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec3 n = normalize(vNormalW);
  float fres = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 3.2);
  float lit = clamp(dot(n, normalize(uSunDir)) + 0.30, 0.0, 1.0);
  float a = fres * lit;
  gl_FragColor = vec4(uColor * a * 1.3, a);
}`;

interface Props {
  position?: [number, number, number];
  radius?: number;
  sunDir?: [number, number, number];
  spin?: number;      // radians/frame
  glow?: string;
}

/** Genuine 3D Earth: procedural day/night surface, clouds, city lights + an
 *  additive atmospheric shell. No texture assets. */
export const Earth3D: React.FC<Props> = ({
  position = [0, 0, 0], radius = 2, sunDir = [5, 2, 3], spin = 0.0012, glow = "#5AA8FF",
}) => {
  const frame = useCurrentFrame();
  const globe = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.ShaderMaterial>(null);

  const earthUniforms = useMemo(() => ({
    uSunDir: { value: new THREE.Vector3(...sunDir) },
    uTime: { value: 0 },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const atmoUniforms = useMemo(() => ({
    uSunDir: { value: new THREE.Vector3(...sunDir) },
    uColor: { value: new THREE.Color(glow) },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  earthUniforms.uTime.value = frame;
  const rot = frame * spin;

  return (
    <group position={position}>
      <mesh ref={globe} rotation={[0, rot, 0.08]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          vertexShader={earthVert}
          fragmentShader={earthFrag}
          uniforms={earthUniforms}
        />
      </mesh>
      {/* atmosphere shell */}
      <mesh scale={1.025}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          ref={cloudsRef}
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={atmoUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* outer haze */}
      <mesh scale={1.06}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={atmoUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
