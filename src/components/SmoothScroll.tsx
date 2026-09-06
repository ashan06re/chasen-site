"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * なめらかスクロール
 *
 * 序幕はスクロール量をそのまま時間として使うので、ホイールの段差がそのまま
 * カメラの段差になる。Lenis で1フレームぶんならす。タッチは既定で素通し。
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    let stop = () => {};
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, anchors: true });
      // 検証スクリプト（ヘッドレスの連続スクショ）から任意の位置へ飛ばすための取っ手
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      stop = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, [reduce]);

  return null;
}
