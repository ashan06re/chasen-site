/**
 * 手続き生成のテクスチャ
 *
 * 3Dが安っぽく見える原因の多くは「単色のマテリアル」と「完璧すぎる形」。
 * 画像素材を増やさずに、法線と粗さのムラをコードで作って質感を散らす。
 */
import * as THREE from "three";

/** 決定論的な擬似乱数（毎回同じ模様になるように） */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 値ノイズのフラクタル和。0〜1 の高さ場を返す */
export function fbmField(size: number, scale: number, octaves: number, seed: number): Float32Array {
  const rand = rng(seed);
  const grid = 128;
  const base = new Float32Array(grid * grid);
  for (let i = 0; i < base.length; i++) base[i] = rand();

  // 周期を整数にして freq で折り返す。こうしないと画像の端で模様が繋がらず、
  // 回転体（茶碗）に貼ったときに縦の継ぎ目として出てしまう
  const sample = (x: number, y: number, period: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const at = (a: number, b: number) => {
      const aa = ((a % period) + period) % period;
      const bb = ((b % period) + period) % period;
      return base[(bb % grid) * grid + (aa % grid)];
    };
    return (
      at(xi, yi) * (1 - u) * (1 - v) +
      at(xi + 1, yi) * u * (1 - v) +
      at(xi, yi + 1) * (1 - u) * v +
      at(xi + 1, yi + 1) * u * v
    );
  };

  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0, amp = 0.5, freq = Math.max(1, Math.round(scale)), norm = 0;
      for (let o = 0; o < octaves; o++) {
        v += amp * sample((x / size) * freq, (y / size) * freq, freq);
        norm += amp;
        amp *= 0.5;
        freq = Math.max(1, Math.round(freq * 2));
      }
      out[y * size + x] = v / norm;
    }
  }
  return out;
}

/** 高さ場から法線マップを作る（Sobel） */
export function normalTexture(height: Float32Array, size: number, strength: number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const at = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const n = new THREE.Vector3(-dx, -dy, 1).normalize();
      const i = (y * size + x) * 4;
      data[i] = (n.x * 0.5 + 0.5) * 255;
      data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** 高さ場をそのままグレースケールのマップに（粗さ・AO用） */
export function grayTexture(
  height: Float32Array,
  size: number,
  low: number,
  high: number,
): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < height.length; i++) {
    const v = Math.round(THREE.MathUtils.lerp(low, high, height[i]) * 255);
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** 黒楽茶碗の釉薬。細かい貫入とムラ */
export function glazeMaps() {
  const size = 512;
  const fine = fbmField(size, 22, 5, 1201);
  const blotch = fbmField(size, 4, 3, 907);
  const mixed = new Float32Array(size * size);
  for (let i = 0; i < mixed.length; i++) mixed[i] = fine[i] * 0.55 + blotch[i] * 0.45;

  const normalMap = normalTexture(mixed, size, 2.6);
  const roughnessMap = grayTexture(blotch, size, 0.30, 0.62);
  normalMap.repeat.set(2, 1);
  roughnessMap.repeat.set(2, 1);
  return { normalMap, roughnessMap };
}

/** カウンターの木。色・法線・粗さの3枚 */
export function woodMaps() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = "#241C15";
  g.fillRect(0, 0, size, size);

  const rand = rng(4471);
  for (let i = 0; i < 260; i++) {
    const x = rand() * size;
    const a = 0.03 + rand() * 0.10;
    g.strokeStyle = rand() > 0.42 ? `rgba(126,98,66,${a})` : `rgba(8,6,4,${a * 1.5})`;
    g.lineWidth = 0.5 + rand() * 3.4;
    g.beginPath();
    g.moveTo(x, 0);
    for (let y = 0; y <= size; y += 24) g.lineTo(x + Math.sin(y / 90 + i) * 6, y);
    g.stroke();
  }

  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(4, 4);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const grain = fbmField(size, 40, 4, 3313);
  const stretched = new Float32Array(size * size);
  // 木目は縦に伸びているので、Y方向だけ大きく引き伸ばす
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      stretched[y * size + x] = grain[(Math.floor(y / 6) % size) * size + x];
    }
  }
  const normalMap = normalTexture(stretched, size, 1.6);
  const roughnessMap = grayTexture(stretched, size, 0.46, 0.80);
  normalMap.repeat.set(4, 4);
  roughnessMap.repeat.set(4, 4);
  // 細かい法線を高い解像度で貼ると、ちらついて面全体が白茶けて見える
  normalMap.anisotropy = 8;
  roughnessMap.anisotropy = 8;
  normalMap.generateMipmaps = true;
  roughnessMap.generateMipmaps = true;

  return { map, normalMap, roughnessMap };
}

/** 抹茶の水面。ごく浅い波 */
export function liquidNormal() {
  const size = 256;
  const f = fbmField(size, 9, 4, 6151);
  const tex = normalTexture(f, size, 0.85);
  tex.repeat.set(1.6, 1.6);
  return tex;
}

/**
 * 抹茶の泡（きめ細かい微泡）。
 * 球のインスタンスを並べるとどうしても「粒」に見えるので、
 * 泡そのものは1枚の面に法線マップとして焼く。
 */
export function foamMaps() {
  const size = 512;
  const h = new Float32Array(size * size);
  let seed = 82117;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // 大小の泡をドーム状に積む。端はタイルできるよう反対側にも描く
  const blobs = 2600;
  for (let i = 0; i < blobs; i++) {
    const k = i / blobs;
    const r = (2.0 + Math.pow(rand(), 2.4) * 13) * (1 - k * 0.35);
    const cx = rand() * size;
    const cy = rand() * size;
    const amp = 0.35 + rand() * 0.65;
    const r2 = r * r;
    for (let dy = -Math.ceil(r); dy <= r; dy++) {
      for (let dx = -Math.ceil(r); dx <= r; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 > r2) continue;
        const x = (((cx + dx) | 0) % size + size) % size;
        const y = (((cy + dy) | 0) % size + size) % size;
        const dome = Math.sqrt(1 - d2 / r2) * amp;
        const idx = y * size + x;
        if (dome > h[idx]) h[idx] = dome;
      }
    }
  }

  const normalMap = normalTexture(h, size, 5.0);
  const roughnessMap = grayTexture(h, size, 0.55, 0.28);
  normalMap.repeat.set(3, 3);
  roughnessMap.repeat.set(3, 3);
  return { normalMap, roughnessMap };
}
