"use client";

/**
 * サイト共通のモーション基盤
 *
 * スクロール連動の演出はページ内に何十個も並ぶので、
 * 個々のコンポーネントがリスナーとrAFを持つと無駄が大きい。
 * ここで購読者を1つのループにまとめ、スクロール時だけ計算する。
 */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** マウスがある環境か（タッチ端末ではホバー演出を出さない） */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let frame = 0;

function flush() {
  frame = 0;
  for (const run of subscribers) run();
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

/**
 * スクロール・リサイズのたびに1度だけ呼ばれるコールバックを登録する。
 * 戻り値を呼ぶと解除。登録直後に一度実行して初期位置を合わせる。
 */
export function onScrollFrame(run: Subscriber): () => void {
  if (subscribers.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  subscribers.add(run);
  run();

  return () => {
    subscribers.delete(run);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
  };
}

/**
 * 要素が画面を通過する進行度を -1〜1 で返す。
 * -1 = 画面下端に現れた瞬間 / 0 = 画面中央 / 1 = 上端を抜ける瞬間
 */
export function viewportProgress(el: Element): number {
  const rect = el.getBoundingClientRect();
  const center = rect.top + rect.height / 2;
  const half = (window.innerHeight + rect.height) / 2;
  return Math.max(-1, Math.min(1, (window.innerHeight / 2 - center) / half));
}
