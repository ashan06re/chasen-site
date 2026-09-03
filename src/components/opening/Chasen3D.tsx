"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OpeningState } from "@/lib/openingScript";

/** 穂を1本ぶんのチューブとして作り、Y軸まわりに回して束ねる（GLBを読まずに茶筅を作る） */
function tineGeometry(points: [number, number][], radius: number) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
  );
  return new THREE.TubeGeometry(curve, 18, radius, 5, false);
}

const OUTER: [number, number][] = [
  [0.0085, 0.1140], [0.0200, 0.0985], [0.0300, 0.0785],
  [0.0336, 0.0600], [0.0327, 0.0498], [0.0292, 0.0448],
];
const INNER: [number, number][] = [
  [0.0060, 0.1140], [0.0135, 0.1010], [0.0188, 0.0860],
  [0.0202, 0.0730], [0.0172, 0.0648],
];

export default function Chasen3D({ s }: { s: OpeningState }) {
  const outerGeo = useMemo(() => tineGeometry(OUTER, 0.00072), []);
  const innerGeo = useMemo(() => tineGeometry(INNER, 0.00060), []);

  const outerCount = 72;
  const innerCount = 20;

  const setRing = (count: number, jitter: number) => (inst: THREE.InstancedMesh | null) => {
    if (!inst) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      o.position.set(0, 0, 0);
      o.rotation.set(0, (i / count) * Math.PI * 2, 0);
      // 穂ごとに長さと開き方をわずかにずらす。均一だとCGに見える
      const s = 1 + (Math.sin(i * 12.9898) * 0.5 + 0.5 - 0.5) * jitter;
      o.scale.set(s, 1 + (i % 3) * 0.004, s);
      o.updateMatrix();
      inst.setMatrixAt(i, o.matrix);
      // 竹の色を1本ずつ散らす。均一だと押し出し成形のブラシに見える
      const tone = 0.80 + ((Math.sin(i * 78.233) * 43758.5453) % 1) * 0.22;
      col.setRGB(0.46 * tone, 0.40 * tone, 0.28 * tone);
      inst.setColorAt(i, col);
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  };

  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { enter, whisk, lift } = s;

    // 降りてくる → 前後に振る（スクロール＝時間。止めれば茶筅も止まる）
    // 降りてきて、点て終わったら上へ抜ける（抜けた後に泡だけが残る）
    const drop = THREE.MathUtils.lerp(0.115, 0, enter) + lift * 0.30;
    const strokes = whisk * 15;
    const sway = Math.sin(strokes * Math.PI * 2);

    g.position.set(
      sway * 0.0128,
      drop + Math.abs(Math.cos(strokes * Math.PI * 2)) * whisk * 0.0016 + Math.sin(t * 2.1) * 0.00035,
      Math.sin(strokes * Math.PI * 2 + 0.6) * 0.0035,
    );
    g.rotation.set(
      Math.sin(strokes * Math.PI * 2 + 0.6) * 0.05,
      t * 0.05,
      -sway * 0.055 + 0.03,
    );
    g.visible = enter > 0.01 && lift < 0.995;
  });

  return (
    <group ref={group} visible={false}>
      {/* 柄 */}
      <mesh position={[0, 0.152, 0]} castShadow>
        <cylinderGeometry args={[0.0086, 0.0092, 0.076, 24]} />
        <meshStandardMaterial color="#9C8A63" roughness={0.68} metalness={0} envMapIntensity={0.5} />
      </mesh>
      {/* 糸で編んである部分 */}
      <mesh position={[0, 0.1155, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.0092, 0.0016, 8, 40]} />
        <meshStandardMaterial color="#4E4130" roughness={0.8} envMapIntensity={0.4} />
      </mesh>

      {/* 外穂 */}
      <instancedMesh args={[outerGeo, undefined, outerCount]} ref={setRing(outerCount, 0.06)} castShadow>
        <meshPhysicalMaterial roughness={0.58} metalness={0} clearcoat={0.12} clearcoatRoughness={0.7} envMapIntensity={0.45} />
      </instancedMesh>

      {/* 内穂 */}
      <instancedMesh args={[innerGeo, undefined, innerCount]} ref={setRing(innerCount, 0.04)}>
        <meshPhysicalMaterial roughness={0.62} metalness={0} clearcoat={0.1} clearcoatRoughness={0.75} envMapIntensity={0.35} />
      </instancedMesh>
    </group>
  );
}
