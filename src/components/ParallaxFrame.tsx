"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { onScrollFrame, prefersReducedMotion, viewportProgress } from "@/lib/motion";

/**
 * 枠の中で写真だけをゆっくり動かす、スクロール視差の枠。
 *
 * 写真は枠より縦に大きく描画しておき、スクロール量に応じて上下にずらす。
 * 枠（＝ページ）と写真の速度差が奥行きに見える。
 * prefers-reduced-motion では動かさない。
 */

interface Props {
  children: ReactNode;
  className?: string;
  /** ずらす量（枠の高さに対する割合）。0.08 で枠の8%ぶん動く */
  amount?: number;
}

export default function ParallaxFrame({ children, className = "", amount = 0.08 }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;
    if (prefersReducedMotion()) return;

    // 上下にずらしても隙間が出ないよう、写真を枠より少し大きくしておく
    const overscan = 1 + amount * 2;
    inner.style.height = `${overscan * 100}%`;
    inner.style.top = `${-((overscan - 1) / 2) * 100}%`;

    let onScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "10% 0px" }
    );
    observer.observe(frame);

    const unsubscribe = onScrollFrame(() => {
      if (!onScreen) return;
      const p = viewportProgress(frame); // -1〜1
      inner.style.transform = `translate3d(0, ${p * amount * 100}%, 0)`;
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [amount]);

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-x-0 top-0 h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
