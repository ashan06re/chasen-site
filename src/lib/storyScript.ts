/**
 * 物語「一杯が、点てられるまで」の台本
 *
 * スクロール量を 0→1 の進行度に変換し、承認済み8コマの写真へ割り振る。
 * three.js を import しないこと（Story.tsx は初期バンドルに乗る）。
 * 写真の書き出しは chasen_project/tools/export_web.py（コマの順番はそこと揃える）。
 */

export interface Cut {
  /** public/story/<id>.webp */
  id: string;
  /** 章番号を出すコマだけ */
  chapter?: "01" | "02" | "03";
  ja: string;
  en: string;
  /** 3:2 以外の写真は視差の余白が違うので比率を持たせる */
  aspect: number;
}

export const CUTS: Cut[] = [
  { id: "01", chapter: "01", ja: "一杯が、点てられるまで。", en: "The story of a bowl of matcha.", aspect: 1672 / 941 },
  { id: "02", ja: "湯を落とす。", en: "Hot water meets matcha.", aspect: 1672 / 941 },
  { id: "03", ja: "点てる。", en: "Whisked by hand.", aspect: 1672 / 941 },
  { id: "04", ja: "一杯から、茶葉のふるさとへ。", en: "Back to where the leaves grow.", aspect: 1672 / 941 },
  { id: "05", chapter: "02", ja: "宇治、覆下の茶園。", en: "Uji. Tea gardens beneath the shade.", aspect: 3840 / 2160 },
  { id: "06", ja: "葉から、粉へ。", en: "From leaf to powder.", aspect: 1672 / 941 },
  { id: "07", chapter: "03", ja: "そして、高台寺の店へ。", en: "And back to Kodaiji.", aspect: 1672 / 941 },
  { id: "08", ja: "一服に、心ほどける。", en: "A moment to savour.", aspect: 1672 / 941 },
];

/** 1コマあたりのスクロール量（画面高の倍数）。最後に少し余白 */
export const CUT_SVH = 110;
export const STORY_SCROLL_SVH = CUTS.length * CUT_SVH + 40;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smoothstep = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/** 区間の中だけ 1 になり、前後でなめらかに 0 へ落ちる窓 */
export function window01(u: number, inA: number, inB: number, outA: number, outB: number) {
  return smoothstep((u - inA) / (inB - inA)) * (1 - smoothstep((u - outA) / (outB - outA)));
}

/** コマの後半、次のコマへ溶ける区間の長さ（コマ内の進行度に対する割合） */
const FADE = 0.34;

export interface CutState {
  /** 今のコマ */
  a: number;
  /** 次のコマ（最後は a と同じ） */
  b: number;
  /** a→b の混ざり具合 0〜1 */
  mix: number;
  /** a の中での進行度 0〜1（寄りの量に使う） */
  ta: number;
  /** b の中での進行度（溶け始めた時点で 0） */
  tb: number;
}

/** 全体の進行度 p からコマの状態を出す */
export function cutState(p: number, out: CutState): CutState {
  const n = CUTS.length;
  const x = clamp01(p) * n;
  let a = Math.min(n - 1, Math.floor(x));
  const u = x - a;
  if (p >= 1) a = n - 1;
  const b = Math.min(n - 1, a + 1);
  const mix = a === b ? 0 : smoothstep((u - (1 - FADE)) / FADE);
  out.a = a;
  out.b = b;
  out.mix = mix;
  out.ta = u;
  out.tb = mix > 0 ? clamp01((u - (1 - FADE)) / FADE) * 0.35 : 0;
  return out;
}

/** コマ内の進行度 u に対する文字の不透明度 */
export const textOpacity = (u: number) => window01(u, 0.06, 0.2, 0.62, 0.8);
