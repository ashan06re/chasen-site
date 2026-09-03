"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { woodMaps } from "./textures";

/**
 * 奥の障子。
 * 「板が1枚浮いている」ように見えないよう、光の滲みと桟を1枚のテクスチャに焼く。
 * カウンターの奥が黒い空洞になるのを、この面が受け止める。
 */
function shojiTexture(): THREE.Texture {
  const w = 512, h = 384;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;

  // 紙越しの光。中心が明るく、縁は闇に溶ける
  const grad = g.createRadialGradient(w / 2, h * 0.46, 0, w / 2, h * 0.46, w * 0.66);
  grad.addColorStop(0, "rgba(255,216,156,1)");
  grad.addColorStop(0.26, "rgba(226,170,100,0.60)");
  grad.addColorStop(0.52, "rgba(150,104,52,0.16)");
  grad.addColorStop(0.78, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  // 桟
  g.globalCompositeOperation = "destination-out";
  g.fillStyle = "rgba(0,0,0,0.82)";
  for (let i = 1; i < 8; i++) g.fillRect(Math.round((w / 8) * i) - 2, 0, 4, h);
  for (let j = 1; j < 6; j++) g.fillRect(0, Math.round((h / 6) * j) - 2, w, 4);
  g.fillRect(w / 2 - 5, 0, 10, h);
  g.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 店の中。カウンター・床・格子・奥の明かり。
 * 3Dにするのは物語に出てくる物だけ、というルールに従って要素はこれで打ち止め。
 * 寄りのコマではほぼ画面から消えるので、密度は手前（天板）に寄せてある。
 */
export default function Room() {
  const wood = useMemo(woodMaps, []);

  const shoji = useMemo(shojiTexture, []);

  // 縦桟と横桟。縦棒だけだと「棒が刺さっている」ように見える
  const lattice = useMemo(() => {
    const m = new THREE.Object3D();
    const list: THREE.Matrix4[] = [];
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 15; i++) {
        m.scale.set(1, 1, 1);
        m.rotation.set(0, 0, 0);
        m.position.set(side * 1.02, 0.25, 2.7 - i * 0.20);
        m.updateMatrix();
        list.push(m.matrix.clone());
      }
      for (let r = 0; r < 4; r++) {
        m.rotation.set(Math.PI / 2, 0, 0);
        m.scale.set(1, 1.35, 1);
        m.position.set(side * 1.02, -0.62 + r * 0.62, 1.35);
        m.updateMatrix();
        list.push(m.matrix.clone());
      }
    }
    return list;
  }, []);

  return (
    <group>
      {/* 床 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0.6]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#0A0A09" roughness={0.92} metalness={0} />
      </mesh>

      {/* カウンター（天板 y=0）。寄りで見えるのはここだけなので木目・法線・粗さを入れる */}
      <mesh position={[0, -0.475, -0.7]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 0.95, 3.4]} />
        <meshStandardMaterial
          map={wood.map}
          normalMap={wood.normalMap}
          normalScale={new THREE.Vector2(0.22, 0.22)}
          roughnessMap={wood.roughnessMap}
          roughness={1}
          metalness={0.02}
          color="#7A6349"
        />
      </mesh>

      {/* 奥の壁 */}
      <mesh position={[0, 0.35, -2.45]}>
        <planeGeometry args={[7, 4.2]} />
        <meshStandardMaterial color="#090A09" roughness={1} />
      </mesh>

      {/* 奥の障子。カウンターの向こうが黒い空洞にならないよう、ここで受ける */}
      <mesh position={[0, 0.34, -2.42]}>
        <planeGeometry args={[4.2, 2.8]} />
        <meshBasicMaterial map={shoji} transparent depthWrite={false} opacity={0.48} toneMapped={false} />
      </mesh>

      {/* 格子 */}
      <instancedMesh
        args={[undefined, undefined, lattice.length]}
        castShadow
        ref={(inst) => {
          if (!inst) return;
          lattice.forEach((mat, i) => inst.setMatrixAt(i, mat));
          inst.instanceMatrix.needsUpdate = true;
        }}
      >
        <boxGeometry args={[0.032, 2.4, 0.032]} />
        <meshStandardMaterial color="#141009" roughness={0.85} metalness={0} envMapIntensity={0.4} />
      </instancedMesh>
    </group>
  );
}
