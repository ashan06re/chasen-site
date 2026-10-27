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
      const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, anchors: true });
      // Cancel an in-flight anchor animation before Next replaces the page.
      const onNavigate = (event: MouseEvent) => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest("a") : null;
        if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && url.pathname !== location.pathname) lenis.stop();
      };
      document.addEventListener("click", onNavigate, true);
      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      stop = () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("click", onNavigate, true);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, [reduce]);

  return null;
}
