"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OpeningState } from "@/lib/openingScript";
import { glazeMaps, liquidNormal } from "./textures";

const SEGMENTS = 160;

export const BOWL = {
  rimRadius: 0.0625,
  rimY: 0.075,
  innerRadius: 0.050,
  /** 湯が入る前 / 入った後の水面の高さ */
  liquidLow: 0.020,
  liquidHigh: 0.042,
};

/** 茶碗の内側の断面（高さ→半径）。水面と泡を器の壁にぴたりと合わせるために使う */
const INNER_PROFILE: [number, number][] = [
  [0.0075, 0.0000], [0.0085, 0.0200], [0.0165, 0.0340],
  [0.0335, 0.0460], [0.0520, 0.0550], [0.0700, 0.0585], [0.0750, 0.0605],
];

/** 高さ y における器の内径 */
export function innerRadiusAt(y: number): number {
  if (y <= INNER_PROFILE[0][0]) return INNER_PROFILE[0][1];
  for (let i = 1; i < INNER_PROFILE.length; i++) {
    const [y0, r0] = INNER_PROFILE[i - 1];
    const [y1, r1] = INNER_PROFILE[i];
    if (y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0);
  }
  return INNER_PROFILE[INNER_PROFILE.length - 1][1];
}

/** 黒楽の茶碗。断面を回転させて作る（外側→口→内側→底の順に一筆で閉じる） */
function bowlProfile(): THREE.Vector2[] {
  const p: [number, number][] = [
    [0.000, 0.000], [0.026, 0.000], [0.028, 0.006], [0.030, 0.011],
    [0.039, 0.020], [0.049, 0.034], [0.057, 0.051], [0.0620, 0.068],
    [0.0625, 0.0745], [0.0605, 0.0750],
    [0.0585, 0.0700], [0.0550, 0.0520], [0.0460, 0.0335],
    [0.0340, 0.0165], [0.0200, 0.0085], [0.0000, 0.0075],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

export default function TeaBowl({ s }: { s: OpeningState }) {
  const geo = useMemo(() => {
    const g = new THREE.LatheGeometry(bowlProfile(), SEGMENTS);
    // 手びねりのゆらぎ。完全な回転体のままだと工業製品に見える
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = Math.hypot(v.x, v.z);
      if (r < 1e-5) continue;
      const a = Math.atan2(v.z, v.x);
      const wobble =
        Math.sin(a * 3 + 0.7) * 0.00042 +
        Math.sin(a * 5 - 1.9) * 0.00026 +
        Math.sin(a * 8 + 2.4) * 0.00013;
      const scale = 1 + (wobble / r) * (0.35 + v.y * 9);
      pos.setXYZ(i, v.x * scale, v.y + wobble * 0.35, v.z * scale);
    }
    g.computeVertexNormals();

    // 回転体の最終列は先頭列と同じ位置だが、法線は別々に計算されて縦の継ぎ目になる。
    // 先頭列の法線で上書きして繋ぐ
    const nrm = g.attributes.normal as THREE.BufferAttribute;
    const rows = bowlProfile().length;
    const last = SEGMENTS * rows;
    for (let j = 0; j < rows; j++) {
      nrm.setXYZ(last + j, nrm.getX(j), nrm.getY(j), nrm.getZ(j));
    }
    nrm.needsUpdate = true;
    return g;
  }, []);

  const glaze = useMemo(glazeMaps, []);
  const ripple = useMemo(liquidNormal, []);
  const liquid = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { pour, whisk } = s;

    if (liquid.current) {
      const level = THREE.MathUtils.lerp(BOWL.liquidLow, BOWL.liquidHigh, pour);
      // 点て始めると水面がわずかに持ち上がる（泡の体積）
      liquid.current.position.y = level + whisk * 0.0035 + Math.sin(t * 1.6) * 0.00012;
      // 器の壁にぴたりと合わせる（隙間が空くと「浮いた円盤」に見える）
      const r = innerRadiusAt(liquid.current.position.y) - 0.0002;
      liquid.current.scale.setScalar(r / BOWL.innerRadius);
      liquid.current.visible = pour > 0.02;
      ripple.offset.set(Math.sin(t * 0.11) * 0.05, t * 0.012);
    }

    // 湯が落ちている間だけ、水面に輪が広がっては消える
    if (ring.current && ringMat.current) {
      const active = pour > 0.05 && pour < 0.98;
      ring.current.visible = active;
      if (active) {
        const phase = (t * 0.9) % 1;
        const s = 0.35 + phase * 1.5;
        ring.current.scale.setScalar(s);
        ring.current.position.y = liquid.current ? liquid.current.position.y + 0.0004 : BOWL.liquidHigh;
        ringMat.current.opacity = (1 - phase) * 0.32 * (1 - whisk);
      }
    }
  });

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0C0B0A"
          normalMap={glaze.normalMap}
          normalScale={new THREE.Vector2(0.30, 0.30)}
          roughnessMap={glaze.roughnessMap}
          roughness={1}
          metalness={0.0}
          clearcoat={0.55}
          clearcoatRoughness={0.30}
          envMapIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 抹茶の水面 */}
      <mesh ref={liquid} rotation={[-Math.PI / 2, 0, 0]} position={[0, BOWL.liquidLow, 0]}>
        <circleGeometry args={[BOWL.innerRadius, 96]} />
        <meshPhysicalMaterial
          color="#54862F"
          normalMap={ripple}
          normalScale={new THREE.Vector2(0.14, 0.14)}
          roughness={0.19}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.07}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* 湯が当たって広がる輪 */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, BOWL.liquidHigh, 0]} visible={false}>
        <ringGeometry args={[0.020, 0.0235, 72]} />
        <meshBasicMaterial ref={ringMat} color="#CFE0B4" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
