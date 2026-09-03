/**
 * 序幕「点てる」の台本
 *
 * スクロール量を 0→1 の進行度に変換し、4つのコマ（Cut01〜04）へ割り振る。
 * three.js に依存させないこと。ここを import する Opening.tsx は初期バンドルに乗るので、
 * 3D 側の重い import が混ざると LCP が落ちる。
 */

/** 序幕セクションの高さ（画面高の何倍スクロールで序幕が終わるか） */
export const OPENING_SCROLL_SVH = 420;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smoothstep = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 区間 [start,end] の中での進行度を 0〜1 で返す */
export const beatProgress = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

/** ある区間だけ 1 になり、前後でなめらかに 0 へ落ちる窓（テキストの出入りなどに使う） */
export function window01(p: number, inA: number, inB: number, outA: number, outB: number) {
  return smoothstep(beatProgress(p, inA, inB)) * (1 - smoothstep(beatProgress(p, outA, outB)));
}

export interface Beat {
  id: string;
  /** 絵コンテのコマ番号 */
  cut: string;
  start: number;
  end: number;
  /** 開発時の目印。画面には出さない */
  note: string;
}

export const BEATS: Beat[] = [
  { id: "enter",  cut: "01", start: 0.00, end: 0.26, note: "入口。暗がりの奥に暖色の明かり" },
  { id: "counter",cut: "02", start: 0.26, end: 0.52, note: "カウンターに寄る。湯気が流れる" },
  { id: "pour",   cut: "03", start: 0.52, end: 0.74, note: "湯を落とす。水面に輪が広がる" },
  { id: "whisk",  cut: "04", start: 0.74, end: 1.00, note: "点てる。泡が立つ（序の山場）" },
];

/**
 * カメラの通り道。p の昇順。単位はメートル。
 * 床 y=-0.95 / カウンター天板 y=0 / 茶碗の口 y=0.075
 */
export interface CameraKey {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

export const CAMERA_KEYS: CameraKey[] = [
  { p: 0.00, pos: [ 0.16,  0.58,  2.60], look: [0.00,  0.30, -0.60], fov: 40 },
  { p: 0.26, pos: [ 0.10,  0.42,  1.30], look: [0.00,  0.14, -0.20], fov: 38 },
  { p: 0.52, pos: [-0.04,  0.28,  0.62], look: [0.00,  0.07,  0.00], fov: 35 },
  { p: 0.74, pos: [-0.05,  0.215, 0.400], look: [0.00, 0.052, 0.00], fov: 34 },
  { p: 1.00, pos: [ 0.03,  0.176, 0.300], look: [0.00, 0.044, 0.00], fov: 34 },
];

/**
 * 毎フレーム書き換えられる進行度。React の再描画を挟まずに 3D 側へ渡すための可変オブジェクト。
 * スクロールのたびに setState すると 60fps で再描画が走るので、参照だけを共有する。
 */
export interface OpeningState {
  /** 序幕全体の進行度 0〜1 */
  p: number;
  /** 湯気の濃さ 0〜1 */
  steam: number;
  /** 茶筅が降りてくる 0〜1 */
  enter: number;
  /** 湯を落とす 0〜1 */
  pour: number;
  /** 点てる 0〜1 */
  whisk: number;
  /** 点て終わって茶筅が抜ける 0〜1。ここで泡だけが残る */
  lift: number;
}

export const createOpeningState = (): OpeningState => ({
  p: 0, steam: 0, enter: 0, pour: 0, whisk: 0, lift: 0,
});

/** 進行度 p から各演出の値を割り出して state を書き換える */
export function updateOpeningState(s: OpeningState, p: number): OpeningState {
  s.p = p;
  // 湯気は「カウンターに寄った時」と「点て上がった一杯」の2回だけ、薄く
  s.steam = window01(p, 0.24, 0.36, 0.46, 0.56) * 0.55 + window01(p, 0.93, 0.99, 1.05, 1.06) * 0.45;
  s.pour = smoothstep(beatProgress(p, 0.52, 0.70));
  s.enter = smoothstep(beatProgress(p, 0.62, 0.73)) * (1 - smoothstep(beatProgress(p, 0.945, 1.0)));
  s.whisk = beatProgress(p, 0.72, 0.94);
  s.lift = smoothstep(beatProgress(p, 0.945, 1.0));
  return s;
}
