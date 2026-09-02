"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { SiteSettings } from "@/data/storeContent";
import { defaultSiteSettingsEn } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

// three.js を初期バンドルから外す。読み込めるまでは下の <Image> がそのまま見えている
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

interface Props {
  settings: SiteSettings;
  settingsEn?: SiteSettings;
}

/** 20px幅の縮小画像。読み込み中もレイアウトが真っ黒にならないようにする */
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgACAAINAAD//gAQTGF2YzYyLjI4LjEwMQD/2wBDAAgQEBMQExYWFhYWFhoYGhsbGxoaGhobGxsdHR0iIiIdHR0bGx0dICAiIiUmJSMjIiMmJigoKDAwLi44ODpFRVP/xABpAAEBAQEAAAAAAAAAAAAAAAAEBQcDAQADAQAAAAAAAAAAAAAAAAAAAgMEEAACAQIDBwUBAAAAAAAAAAACAQMRABIEIVEFcRShUoFhMjEiE0ERAAMBAQEAAAAAAAAAAAAAAAARAjGhUf/AABEIAA0AFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ANZh3hk5BqOYBpfNXSnGtLLLvWCOQh9yGPGjTTEirTAntvDedlCOv0ab1WFa8dvm6EefkOIhwxiOF0SAdOllUnhAFvCcTzBkKRC9RxUql2uuzzcb9V2B0sB5g2/5fHmC9LyOvOiI/9k=";

export default function HeroSection({ settings, settingsEn }: Props) {
  const { lang } = useLang();
  const enSettings = settingsEn ?? defaultSiteSettingsEn;
  const catchphrase = lang === "en" ? enSettings.heroCatchphrase : settings.heroCatchphrase;

  const sectionRef = useRef<HTMLElement>(null);

  // マウス位置（-1〜1）とスクロール量。写真とテキストを別々の深さで動かして立体感を出す
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // WebGL版（2.5Dパララックス）が動き出したか。動き出したらCSS側の視差は止める
  const [canvasReady, setCanvasReady] = useState(false);
  const handleCanvasReady = useCallback(() => setCanvasReady(true), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion || canvasReady) return;

    let frame = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPointer({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion, canvasReady]);

  // スクロールで写真はゆっくり沈み、テキストは速く上へ抜ける（視差）
  const progress = reduceMotion ? 0 : Math.min(scrollY / 700, 1);

  const photoStyle = reduceMotion || canvasReady
    ? undefined
    : {
        transform: `translate3d(${pointer.x * -14}px, ${pointer.y * -10 + progress * 90}px, 0) scale(${1.12 + progress * 0.06}) rotateX(${pointer.y * 1.4}deg) rotateY(${pointer.x * -1.8}deg)`,
      };

  const contentStyle = reduceMotion
    ? undefined
    : {
        transform: `translate3d(${pointer.x * 10}px, ${pointer.y * 7 - progress * 70}px, 0)`,
        opacity: 1 - progress * 0.9,
      };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1A1A18]"
      style={{ perspective: "1200px" }}
    >
      {/* 背景写真（八坂の塔）— マウス・スクロールに追従してゆっくり動く */}
      <div
        className="absolute inset-[-6%] will-change-transform"
        style={{
          ...photoStyle,
          transformStyle: "preserve-3d",
          transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* 内側は常時ゆっくり流れるKen Burns（外側のマウス追従と干渉しないよう層を分ける）*/}
        <div
          className="hero-drift absolute inset-0 transition-opacity duration-1000"
          style={canvasReady ? { opacity: 0, animation: "none" } : undefined}
        >
          <Image
            src="/hero-kyoto.jpg"
            alt="高台寺・八坂の塔を望む京都の街並み"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </div>

      {/* 深度マップを使った2.5Dパララックス。WebGLが無ければ描かれず、上の写真が残る */}
      <HeroCanvas
        imageSrc="/hero-kyoto.jpg"
        depthSrc="/hero-kyoto-depth.jpg"
        onReady={handleCanvasReady}
      />

      {/* 陰影レイヤー: 文字の可読性を確保しつつ、奥行きを強調する */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A18]/45 via-[#1A1A18]/40 to-[#1A1A18]/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,26,24,0.30)_0%,rgba(26,26,24,0.10)_45%,rgba(26,26,24,0.55)_100%)]" />

      {/* Content */}
      <div
        className="relative z-10 text-center text-[#F7F5F0] px-6 will-change-transform"
        style={{ ...contentStyle, transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <p className="font-[var(--font-cormorant)] text-sm md:text-base tracking-[0.4em] text-[#DCCFA8] mb-6 uppercase drop-shadow-[0_2px_10px_rgba(26,26,24,0.95)]">
          {settings.heroEnglishLabel}
        </p>

        <h1 className="font-[var(--font-noto-serif-jp)] text-7xl md:text-9xl lg:text-[11rem] font-light tracking-[0.2em] leading-none mb-6 drop-shadow-[0_6px_30px_rgba(26,26,24,0.7)]">
          茶筅
        </h1>

        <p className="font-[var(--font-cormorant)] text-2xl md:text-3xl tracking-[0.2em] text-[#F7F5F0]/85 font-light mb-12 drop-shadow-[0_2px_16px_rgba(26,26,24,0.6)]">
          Chasen
        </p>

        <p className="font-[var(--font-noto-serif-jp)] text-sm md:text-base tracking-[0.15em] text-[#F7F5F0]/70 font-light drop-shadow-[0_2px_12px_rgba(26,26,24,0.6)]">
          {catchphrase}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/60 text-xs tracking-[0.4em] uppercase drop-shadow-[0_2px_10px_rgba(26,26,24,0.8)]">
          Scroll
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-[#F7F5F0]/40 to-transparent" />
      </div>
    </section>
  );
}
