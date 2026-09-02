/**
 * 文字色のコントラスト補正。
 * Notion で自由に設定されるアクセントカラーが、背景に対して WCAG AA の
 * 基準（通常文字 4.5:1 / 大きい文字 3:1）を下回る場合に、色相を保ったまま
 * 明度だけを背景から遠ざける。
 */

function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let c = m[1];
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
}

function toHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const a = parseHex(fg);
  const b = parseHex(bg);
  if (!a || !b) return 21;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * `fg` を `bg` の上で最低 `min` のコントラスト比になるまで暗く（または明るく）した色を返す。
 * 既に基準を満たしていればそのまま返す。hex 以外（rgba 等）はそのまま返す。
 */
export function readableOn(fg: string, bg: string, min = 4.5): string {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!f || !b) return fg;
  if (contrastRatio(fg, bg) >= min) return fg;

  const darkenTowards = luminance(b) > 0.5; // 明るい背景なら暗く、暗い背景なら明るく
  const target: [number, number, number] = darkenTowards ? [0, 0, 0] : [255, 255, 255];
  let cur: [number, number, number] = f;
  for (let step = 0; step < 40; step++) {
    cur = [0, 1, 2].map((i) => cur[i] + (target[i] - cur[i]) * 0.08) as [number, number, number];
    const hex = toHex(cur);
    if (contrastRatio(hex, bg) >= min) return hex;
  }
  return toHex(target);
}

/** `fg` を `alpha` の不透明度で `bg` に重ねたときの見た目の色（バッジの下地などの計算用） */
export function mix(fg: string, bg: string, alpha: number): string {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!f || !b) return bg;
  return toHex([0, 1, 2].map((i) => f[i] * alpha + b[i] * (1 - alpha)) as [number, number, number]);
}
