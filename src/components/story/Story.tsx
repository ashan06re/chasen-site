"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLang } from "@/lib/langContext";
import { onScrollFrame } from "@/lib/motion";
import { CUTS, STORY_SCROLL_SVH, clamp01, cutState, textOpacity, window01, type CutState } from "@/lib/storyScript";

// three.js は初期バンドルから外す。読めるまでは下の <img> が見えている
const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

/**
 * 物語「一杯が、点てられるまで」
 *
 * 高さ STORY_SCROLL_SVH の枠を sticky にし、スクロール量を進行度 0→1 に変えて
 * 10コマの写真へ割り振る。写真は WebGL（StoryCanvas）で寄り・視差・溶けを付けて描き、
 * WebGL が無い時は同じコマを <img> の不透明度で切り替える。
 * 文字は動かさない。出入りの不透明度だけ変え、DOM に直接書く（React の再描画を挟まない）。
 */
export default function Story() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const [reduce, setReduce] = useState(false); // SSR は sticky 版。reduced-motion は判定後に切り替える
  const [webgl, setWebgl] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setWebgl(false), []);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(q.matches);
    apply();
    q.addEventListener("change", apply);
    return () => q.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    const st: CutState = { a: 0, b: 0, mix: 0, ta: 0, tb: 0 };

    return onScrollFrame(() => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;
      progress.current = p;
      cutState(p, st);

      // 文字: 今のコマの文字だけ出す
      textRefs.current.forEach((t, i) => {
        if (!t) return;
        let o = 0;
        // 最初のコマの一行は開いた瞬間から見せる。他は少し進んでから
        if (i === st.a) o = i === 0 ? window01(st.ta, -1, -0.9, 0.62, 0.8) : textOpacity(st.ta);
        else if (i === st.b && st.mix > 0) o = textOpacity(st.tb);
        t.style.opacity = String(o);
      });
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / 0.05));

      // CSS フォールバック（WebGL が来るまで・来ない時）: <img> を重ねて溶かす
      if (ready && webgl) {
        imgRefs.current.forEach((im) => { if (im) im.style.opacity = "0"; });
      } else {
        imgRefs.current.forEach((im, i) => {
          if (!im) return;
          const o = i === st.a ? 1 : i === st.b ? st.mix : 0;
          im.style.opacity = String(o);
          im.style.transform = `scale(${1 + 0.06 * (i === st.a ? st.ta : st.tb)})`;
        });
      }
    });
  }, [reduce, ready, webgl]);

  // reduced-motion: 普通に縦に並べる（動かない）
  if (reduce) {
    return (
      <section className="bg-[#050605]" aria-label={lang === "en" ? "Story" : "物語"}>
        {CUTS.map((c) => (
          <figure key={c.id} className="relative">
            <img src={`/story/${c.id}.webp`} alt="" className="w-full h-auto block" loading={c.id === "01" ? "eager" : "lazy"} />
            <figcaption className="px-6 py-6 font-[var(--font-noto-serif-jp)] font-light text-[#D8D5CC] text-sm tracking-[0.25em]">
              {lang === "en" ? c.en : c.ja}
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050605]"
      style={{ height: `${STORY_SCROLL_SVH}svh` }}
      aria-label={lang === "en" ? "Story" : "物語"}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* 写真（フォールバック兼 最初の1枚 = LCP） */}
        {CUTS.map((c, i) => (
          <img
            key={c.id}
            ref={(n) => { imgRefs.current[i] = n; }}
            src={`/story/${c.id}.webp`}
            srcSet={`/story/${c.id}-m.webp 960w, /story/${c.id}.webp 1600w`}
            sizes="100vw"
            alt=""
            // 3枚目以降は必要になるまで読まない
            loading={i < 2 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="absolute inset-0 h-full w-full object-cover" 
            style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity, transform" }}
          />
        ))}

        {webgl && <StoryCanvas progress={progress} onReady={onReady} onFail={onFail} />}

        {/* 文字。動かさない */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {CUTS.map((c, i) => (
            <div key={c.id} ref={(n) => { textRefs.current[i] = n; }} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
              {c.chapter && (
                <div className="absolute left-6 top-24 md:left-10 md:top-28 flex items-center gap-4">
                  <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/80 text-xs tracking-[0.5em]">{c.chapter}</span>
                  <span className="block h-px w-12 bg-[#B8A882]/60" />
                </div>
              )}
              {i === 0 ? (
                <div
                  className="absolute right-6 top-1/2 -translate-y-1/2 md:right-14 flex items-start gap-5 md:gap-7"
                  style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
                >
                  <h1 className="font-[var(--font-noto-serif-jp)] font-light text-[#F7F5F0] text-[1.85rem] md:text-[2.4rem] tracking-[0.35em] leading-none drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
                    茶筅
                    <span className="sr-only">（Chasen）— 日本茶スタンド</span>
                  </h1>
                  <p
                    className="font-[var(--font-noto-serif-jp)] font-light text-[#E8E5DC] text-[0.9rem] md:text-[1.05rem] tracking-[0.3em] leading-none drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]"
                    style={lang === "en" ? { writingMode: "horizontal-tb" } : undefined}
                  >
                    {lang === "en" ? c.en : c.ja}
                  </p>
                </div>
              ) : (
                <p className="absolute left-6 bottom-16 md:left-10 md:bottom-20 font-[var(--font-noto-serif-jp)] font-light text-[#F1EEE6] text-[1.05rem] md:text-[1.35rem] tracking-[0.3em] leading-none drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
                  {lang === "en" ? c.en : c.ja}
                </p>
              )}
            </div>
          ))}

          <div className="absolute left-6 bottom-8 md:left-10 md:bottom-10">
            <span className="font-[var(--font-cormorant)] text-[#C9C6BC] text-[0.7rem] tracking-[0.45em] uppercase">Chasen</span>
          </div>

          <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="font-[var(--font-cormorant)] text-[#C9C6BC] text-[0.65rem] tracking-[0.45em] uppercase">Scroll</span>
            <span className="block w-px h-12 bg-gradient-to-b from-[#F7F5F0]/45 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
