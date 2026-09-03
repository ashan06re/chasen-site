/**
 * 環境マップ（IBL）
 *
 * 単純なライトだけで組むと、金属も陶器も「プラスチックの塊」に見える。
 * 暗い茶室に暖色の窓が1つある小さなシーンを作り、PMREM で環境マップに焼いて
 * すべてのマテリアルの映り込みに使う。画像素材（HDRI）は読み込まない。
 */
import * as THREE from "three";

function panel(
  scene: THREE.Scene,
  color: [number, number, number],
  size: [number, number],
  pos: [number, number, number],
  rot: [number, number, number],
) {
  const mat = new THREE.MeshBasicMaterial();
  mat.color.setRGB(color[0], color[1], color[2]);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.rotation.set(rot[0], rot[1], rot[2]);
  scene.add(mesh);
}

export function buildEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const scene = new THREE.Scene();

  // 部屋の内側（ほぼ黒。わずかに緑がかった墨色）
  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(10, 6, 10),
    new THREE.MeshBasicMaterial({ side: THREE.BackSide }),
  );
  (shell.material as THREE.MeshBasicMaterial).color.setRGB(0.017, 0.019, 0.017);
  scene.add(shell);

  // 障子越しの窓（主光源）。左前方やや上
  panel(scene, [3.4, 2.1, 1.05], [3.2, 3.6], [-3.6, 1.1, 1.4], [0, Math.PI / 2, 0]);
  // 窓のにじみ
  panel(scene, [1.0, 0.62, 0.30], [6.0, 5.2], [-3.4, 0.9, 1.2], [0, Math.PI / 2, 0]);

  // 奥の暖簾の明かり（弱い）
  panel(scene, [0.75, 0.44, 0.18], [2.0, 2.6], [0, 0.4, -4.6], [0, 0, 0]);

  // 天井のわずかな返り。真上が完全な黒だと陶器の口縁が死ぬ
  panel(scene, [0.10, 0.105, 0.10], [9, 9], [0, 2.9, 0], [Math.PI / 2, 0, 0]);

  // 冷たい側（右後方）。縁を分離させるための弱い青
  panel(scene, [0.10, 0.15, 0.20], [4.0, 3.0], [3.8, 0.9, -1.2], [0, -Math.PI / 2, 0]);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromScene(scene, 0.035);

  shell.geometry.dispose();
  scene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();

  return target.texture;
}
