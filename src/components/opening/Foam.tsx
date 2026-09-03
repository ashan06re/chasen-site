"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOWL, innerRadiusAt } from "./TeaBowl";
import { foamMaps } from "./textures";
import type { OpeningState } from "@/lib/openingScript";

/**
 * 抹茶の泡
 *
 * 球を並べると必ず「粒」に見えるので、微泡は法線マップを貼った1枚のドーム面で作り、
 * 輪郭を崩すための粗い泡だけを少数のインスタンスで足す。
 */
const COARSE = 700;

interface Bubble {
  x: number;
  z: number;
  r: number;
  birth: number;
  phase: number;
}

function makeCoarse(): Bubble[] {
  let seed = 20260903;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const list: Bubble[] = [];
  for (let i = 0; i < COARSE; i++) {
    const k = i / COARSE;
    const a = rnd() * Math.PI * 2;
    // 外周ぎわに寄せる（真ん中は面のマップに任せる）
    const rad = 0.45 + Math.sqrt(rnd()) * 0.52; // 器の内径に対する割合。実寸は毎フレーム掛ける
    list.push({
      x: Math.cos(a) * rad,
      z: Math.sin(a) * rad,
      r: THREE.MathUtils.lerp(0.0013, 0.00045, k) * (0.75 + rnd() * 0.5),
      birth: 0.05 + k * 0.8 + rnd() * 0.08,
      phase: rnd() * Math.PI * 2,
    });
  }
  return list;
}

/**
 * ゆるいドーム（半径1・高さ0.075の球冠）。
 * CircleGeometry は中心と外周しか頂点が無いので、持ち上げると円錐になってしまう。
 */
function domeGeometry() {
  const h = 0.075;
  const R = (1 + h * h) / (2 * h);
  const theta = Math.asin(1 / R);
  const g = new THREE.SphereGeometry(R, 128, 28, 0, Math.PI * 2, 0, theta);
  g.translate(0, -(R - h), 0);

  // 球のUVは中心へ向かって伸びて泡が筋になる。真上から見た平面貼りに置き換える
  const pos = g.attributes.position as THREE.BufferAttribute;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) * 0.5 + 0.5, pos.getZ(i) * 0.5 + 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

export default function Foam({ s }: { s: OpeningState }) {
  const maps = useMemo(foamMaps, []);
  const dome = useMemo(domeGeometry, []);
  const bubbles = useMemo(makeCoarse, []);

  const surface = useRef<THREE.Mesh>(null);
  const coarse = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const paint = (inst: THREE.InstancedMesh | null) => {
    if (!inst) return;
    coarse.current = inst;
    const c = new THREE.Color();
    for (let i = 0; i < COARSE; i++) {
      const k = i / COARSE;
      c.setHSL(0.23, 0.16 - k * 0.08, THREE.MathUtils.lerp(0.66, 0.86, k));
      inst.setColorAt(i, c);
    }
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  };

  useFrame((state) => {
    const { whisk, pour } = s;
    const t = state.clock.elapsedTime;
    const level = THREE.MathUtils.lerp(BOWL.liquidLow, BOWL.liquidHigh, pour) + 0.0035 * whisk;

    if (surface.current) {
      surface.current.visible = whisk > 0.02;
      // 中心から外へ広がって水面を覆う
      const grow = THREE.MathUtils.smoothstep(whisk, 0.02, 0.82);
      const rim = innerRadiusAt(level) - 0.0004;
      const r = rim * (0.34 + grow * 0.66);
      surface.current.scale.set(r, r * THREE.MathUtils.lerp(0.45, 1, grow), r);
      surface.current.position.y = level + 0.0004;
      maps.normalMap.offset.set(Math.sin(t * 0.06) * 0.008, t * 0.003);
    }

    const inst = coarse.current;
    if (inst) {
      inst.visible = whisk > 0.04;
      if (inst.visible) {
        for (let i = 0; i < COARSE; i++) {
          const b = bubbles[i];
          const g = THREE.MathUtils.clamp((whisk - b.birth) / 0.12, 0, 1);
          const sc = g * g * (3 - 2 * g);
          const rim = innerRadiusAt(level) - 0.0006;
          dummy.position.set(
            b.x * rim + Math.sin(t * 0.8 + b.phase) * 0.0003,
            level + b.r * 0.35 + Math.sin(t * 1.3 + b.phase) * 0.0002,
            b.z * rim + Math.cos(t * 0.7 + b.phase) * 0.0003,
          );
          dummy.scale.set(b.r * sc, b.r * sc * 0.55, b.r * sc);
          dummy.updateMatrix();
          inst.setMatrixAt(i, dummy.matrix);
        }
        inst.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* 微泡の面 */}
      <mesh ref={surface} geometry={dome} visible={false}>
        <meshPhysicalMaterial
          color="#B9C89A"
          normalMap={maps.normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          roughnessMap={maps.roughnessMap}
          roughness={1}
          metalness={0}
          clearcoat={0.25}
          clearcoatRoughness={0.55}
          sheen={0.35}
          sheenColor="#E8EEDA"
          sheenRoughness={0.65}
          envMapIntensity={0.45}
        />
      </mesh>

      {/* 輪郭を崩す粗い泡 */}
      <instancedMesh ref={paint} args={[undefined, undefined, COARSE]} visible={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          roughness={0.4}
          metalness={0}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
          envMapIntensity={0.5}
        />
      </instancedMesh>
    </group>
  );
}
