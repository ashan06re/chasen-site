"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * カードにポインタ追従の奥行きを与える。
 *
 * カーソルの位置に応じてカードをわずかに傾け、同じ方向から光が当たったような
 * ハイライトを重ねる。傾きは最大でも数度に留め、写真が歪んで見えないようにする。
 * タッチ端末と prefers-reduced-motion では何もしない（通常のカードのまま）。
 */

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 傾きの強さ（度）。写真主体のカードは小さめが合う */
  maxTilt?: number;
}

export default function TiltCard({ children, className = "", style, maxTilt = 5 }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const sheen = sheenRef.current;
    if (!outer || !inner || !sheen) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let frame = 0;
    let target = { x: 0, y: 0, on: 0 };
    const current = { x: 0, y: 0, on: 0 };

    const render = () => {
      frame = 0;

      // 目標値へ緩やかに寄せる。離れたときも同じ経路で戻るので動きが滑らかになる
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      current.on += (target.on - current.on) * 0.12;

      const lift = current.on;
      inner.style.transform =
        `perspective(900px) rotateX(${-current.y * maxTilt}deg) rotateY(${current.x * maxTilt}deg) ` +
        `scale(${1 + lift * 0.02}) translateZ(0)`;
      inner.style.boxShadow = `0 ${12 * lift}px ${34 * lift}px rgba(26,26,24,${0.16 * lift})`;

      sheen.style.opacity = String(lift * 0.5);
      sheen.style.background =
        `radial-gradient(circle at ${50 + current.x * 42}% ${50 + current.y * 42}%, ` +
        `rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 62%)`;

      const settled =
        Math.abs(target.x - current.x) < 0.001 &&
        Math.abs(target.y - current.y) < 0.001 &&
        Math.abs(target.on - current.on) < 0.001;
      if (!settled) frame = requestAnimationFrame(render);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      target = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        on: 1,
      };
      kick();
    };

    const onLeave = () => {
      target = { x: 0, y: 0, on: 0 };
      kick();
    };

    outer.addEventListener("pointermove", onMove);
    outer.addEventListener("pointerleave", onLeave);

    return () => {
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxTilt]);

  return (
    <div ref={outerRef} className={className} style={{ ...style, perspective: "900px" }}>
      <div
        ref={innerRef}
        className="relative h-full w-full will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
        />
      </div>
    </div>
  );
}
