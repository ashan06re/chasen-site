/** Painted story. Keep this sequence aligned with tools/export_story_art.py. */
export const CUTS = [
  { id: "01", label: "ENTRANCE", ja: "一杯が、点てられるまで。", en: "The story of a bowl of matcha.", detail: "京都・高台寺。暖簾の向こうへ。", detailEn: "Through the curtain, into Chasen Kodaiji." },
  { id: "02", label: "WATER", ja: "湯を落とす。香りがひらく。", en: "Warm water. A rising fragrance.", detail: "静かな一杯の、はじまり。", detailEn: "A quiet ritual begins." },
  { id: "03", label: "LIGHT", ja: "窓辺に、ひと息。", en: "A pause by the window.", detail: "木の温もりと、やわらかな光。", detailEn: "Warm wood, gentle light." },
  { id: "04", label: "ORIGIN", ja: "香りをたどって、宇治へ。", en: "Follow the fragrance to Uji.", detail: "夕暮れの、覆下の茶園。", detailEn: "Evening falls over the shaded tea garden." },
  { id: "05", label: "A MOMENT", ja: "一服に、心ほどける。", en: "A moment to savour.", detail: "お茶と甘いもの。その先の、特別な時間。", detailEn: "Tea, sweets, and a moment just for you." },
] as const;

export const STORY_SCROLL_SVH = 590;
export const clamp01 = (v: number) => Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
export const smoothstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
export function cutState(progress: number, count: number = CUTS.length) {
  const x = clamp01(progress) * count;
  const a = Math.min(count - 1, Math.floor(x));
  const t = Math.min(1, x - a);
  const b = Math.min(count - 1, a + 1);
  return { a, b, t, mix: a === b ? 0 : smoothstep((t - .7) / .3) };
}

/** A single, event-driven clock shared by DOM copy, fallback and WebGL. */
export function createStorySignal() {
  let progress = 0;
  const listeners = new Set<() => void>();
  return {
    read: () => progress,
    set(value: number) { progress = clamp01(value); listeners.forEach(fn => fn()); },
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  };
}
export type StorySignal = ReturnType<typeof createStorySignal>;
export const artSrc = (id: string, mobile = false) => `/story-art/${id}${mobile ? "-mobile" : ""}.webp`;
