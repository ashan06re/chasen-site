"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLang } from "@/lib/langContext";
import { onScrollFrame } from "@/lib/motion";
import { OPENING_SCROLL_SVH, clamp01, window01 } from "@/lib/openingScript";

// three.js と後処理は初期バンドルから外す。読めるまでは下の静止画が見えている
const OpeningCanvas = dynamic(() => import("./OpeningCanvas"), { ssr: false });

// TODO: Notion「サイト設定」DBに「序幕の一行」プロパティを足して差し替える。
// 物語そのものの一行なので、暫定でコードに置いている。
const TAGLINE = {
  ja: "一杯が、点てられるまで。",
  en: "Until a bowl is whisked.",
};

export default function Opening() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  const chapterRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [reduce, setReduce] = useState(true); // 判定が済むまでは静止画のまま
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;

    // スクロール量 → 序幕の進行度。文字の出入りは DOM に直接書き、Reactの再描画は挟まない
    return onScrollFrame(() => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;
      progress.current = p;

      if (chapterRef.current) {
        chapterRef.current.style.opacity = String(window01(p, -1, -0.9, 0.17, 0.27));
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = String(window01(p, -1, -0.9, 0.16, 0.26));
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - clamp01(p / 0.06));
      }
    });
  }, [reduce]);

  const tagline = TAGLINE[lang];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050605]"
      style={{ height: reduce ? "100svh" : `${OPENING_SCROLL_SVH}svh` }}
      aria-label={lang === "en" ? "Opening" : "序幕"}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* WebGLが無い / reduced-motion のときはここで止まる */}
        <Image
          src="/opening/opening-still.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
        />
        <div
          className={`absolute inset-0 bg-[#050605]/12 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
        />

        {!reduce && <OpeningCanvas progress={progress} onReady={() => setReady(true)} />}

        {/* 文字は動かさない。出入りの不透明度だけ変える */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* 章番号 */}
          <div ref={chapterRef} className="absolute left-6 top-24 md:left-10 md:top-28 flex items-center gap-4">
            <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/80 text-xs tracking-[0.5em]">01</span>
            <span className="block h-px w-12 bg-[#B8A882]/60" />
          </div>

          {/* 縦組みの一行。ここがヒーローの見出し */}
          <div
            ref={titleRef}
            className="absolute right-6 top-1/2 -translate-y-1/2 md:right-14 flex items-start gap-5 md:gap-7"
            style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
          >
            <h1 className="font-[var(--font-noto-serif-jp)] font-light text-[#F7F5F0] text-[1.85rem] md:text-[2.4rem] tracking-[0.35em] leading-none">
              茶筅
              <span className="sr-only">（Chasen）— 日本茶スタンド</span>
            </h1>
            <p
              className="font-[var(--font-noto-serif-jp)] font-light text-[#D8D5CC] text-[0.9rem] md:text-[1.05rem] tracking-[0.3em] leading-none"
              style={lang === "en" ? { writingMode: "horizontal-tb" } : undefined}
            >
              {tagline}
            </p>
          </div>

          {/* 小さなブランド表記 */}
          <div className="absolute left-6 bottom-8 md:left-10 md:bottom-10">
            <span className="font-[var(--font-cormorant)] text-[#949486] text-[0.7rem] tracking-[0.45em] uppercase">
              Chasen
            </span>
          </div>

          {/* スクロールの合図 */}
          <div
            ref={hintRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="font-[var(--font-cormorant)] text-[#949486] text-[0.65rem] tracking-[0.45em] uppercase">
              Scroll
            </span>
            <span className="block w-px h-12 bg-gradient-to-b from-[#F7F5F0]/35 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
