"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OpeningState } from "@/lib/openingScript";

/** 湯気。素材を用意せずシェーダで描く（エッセンス集の「シェーダで描ける物は素材を作らない」） */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSeed;
  uniform vec3  uColor;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // 上へ流れながら、上ほど横に広がって消える
    float rise = uTime * 0.085 + uSeed;
    vec2 p = vec2((uv.x - 0.5) * (1.0 + uv.y * 1.6) * 2.6, uv.y * 1.8 - rise);
    float n = fbm(p + fbm(p * 0.6 + rise * 0.3) * 0.8);
    n = n * 0.5 + 0.5;

    // 縁を落として板であることを隠す
    float edgeX = smoothstep(0.0, 0.42, uv.x) * smoothstep(1.0, 0.58, uv.x);
    float edgeY = smoothstep(0.0, 0.22, uv.y) * smoothstep(1.0, 0.55, uv.y);

    float a = smoothstep(0.60, 0.97, n) * edgeX * edgeY * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

const PLANES = [
  { pos: [-0.006, 0.112, 0.004] as const, size: [0.085, 0.11] as const, seed: 0.0 },
  { pos: [ 0.014, 0.128, -0.010] as const, size: [0.105, 0.14] as const, seed: 1.7 },
  { pos: [-0.018, 0.146, -0.018] as const, size: [0.125, 0.17] as const, seed: 3.1 },
];

export default function Steam({ s }: { s: OpeningState }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.ShaderMaterial[]>([]);

  const materials = useMemo(
    () =>
      PLANES.map(
        (p) =>
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: {
              uTime: { value: 0 },
              uOpacity: { value: 0 },
              uSeed: { value: p.seed },
              uColor: { value: new THREE.Color("#B9BEB4") },
            },
          }),
      ),
    [],
  );
  mats.current = materials;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const intensity = s.steam;
    for (const m of materials) {
      m.uniforms.uTime.value = t;
      m.uniforms.uOpacity.value = intensity * 0.16;
    }
    // 常にカメラを向かせる（板であることを見せない）
    if (group.current) {
      group.current.visible = intensity > 0.01;
      group.current.rotation.y = Math.atan2(
        state.camera.position.x - group.current.position.x,
        state.camera.position.z - group.current.position.z,
      );
    }
  });

  return (
    <group ref={group} visible={false}>
      {PLANES.map((p, i) => (
        <mesh key={i} position={[p.pos[0], p.pos[1], p.pos[2]]} material={materials[i]}>
          <planeGeometry args={[p.size[0], p.size[1]]} />
        </mesh>
      ))}
    </group>
  );
}
