"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOWL } from "./TeaBowl";
import type { OpeningState } from "@/lib/openingScript";

/** 落ちてくる湯。細い筒に縦へ流れるノイズを乗せて、水の筋に見せる */
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0;
    return mix(mix(hash(n), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
  }

  void main() {
    // 上から下へ速く流れる筋
    float flow = noise(vec2(vUv.x * 7.0, vUv.y * 5.0 - uTime * 5.2));
    float streak = 0.55 + flow * 0.75;
    // 中心が明るく、縁で消える円柱
    float edge = smoothstep(0.0, 0.30, vUv.x) * smoothstep(1.0, 0.70, vUv.x);
    // 上（注ぎ口側）は暗がりに消し、水面へ落ちるほど明るくする
    float fall = smoothstep(1.0, 0.42, vUv.y);
    float a = edge * fall * uOpacity * streak;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(0.86, 0.79, 0.64) * streak * (0.35 + fall * 0.75), a);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function Pour({ s }: { s: OpeningState }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      }),
    [],
  );
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    const pour = s.pour;
    // 落ち始めと落ち終わりだけ細く消える
    const a = Math.min(1, pour / 0.12) * (1 - Math.max(0, (pour - 0.82) / 0.18));
    mat.uniforms.uOpacity.value = a * 0.15;
    if (mesh.current) mesh.current.visible = a > 0.01;
  });

  const top = 0.185;
  const bottom = BOWL.liquidLow;
  const h = top - bottom;

  return (
    <mesh ref={mesh} position={[0, bottom + h / 2, 0]} material={mat} visible={false}>
      <cylinderGeometry args={[0.0009, 0.0015, h, 16, 1, true]} />
    </mesh>
  );
}
