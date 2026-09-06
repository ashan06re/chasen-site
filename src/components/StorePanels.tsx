"use client";
import Link from "next/link";
import AnimateIn from "./AnimateIn";
import DepthPanel from "./DepthPanel";
import type { StoreInfo } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

/**
 * 急の幕「二つの店」
 *
 * 物語の終わりに、店舗サイトへ飛ぶ大きな写真パネルを2枚。
 * 初回の試作で唯一残った構成。ガラス板ではなく写真そのものが立体になる（DepthPanel）。
 */
interface Props {
  kyoto: StoreInfo;
  kumamoto: StoreInfo;
}

const t = {
  ja: { label: "二つの店", chapter: "09", enter: "店舗サイトへ" },
  en: { label: "Two Shops", chapter: "09", enter: "Visit" },
};

export default function StorePanels({ kyoto, kumamoto }: Props) {
  const { lang, localize } = useLang();
  const tx = t[lang];
  const panels = [
    { info: kyoto, href: "/stores/kyoto", img: "/story/panel-kyoto.webp", depth: "/story/panel-kyoto-depth.webp", tilt: "md:[transform:perspective(1600px)_rotateY(7deg)]" },
    { info: kumamoto, href: "/stores/kumamoto", img: "/story/panel-kumamoto.webp", depth: "/story/panel-kumamoto-depth.webp", tilt: "md:[transform:perspective(1600px)_rotateY(-7deg)]" },
  ];

  return (
    <section id="stores" className="bg-[#050605] py-24 md:py-36 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/80 text-xs tracking-[0.5em]">{tx.chapter}</span>
            <span className="block h-px w-12 bg-[#B8A882]/60" />
            <span className="font-[var(--font-noto-serif-jp)] font-light text-[#F1EEE6] text-sm tracking-[0.3em]">{tx.label}</span>
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 [perspective:1600px]">
          {panels.map((p, i) => {
            const name = lang === "en" ? (p.info.nameEn ?? p.info.name) : p.info.name;
            return (
              <AnimateIn key={p.href} delay={120 + i * 160}>
                <Link
                  href={localize(p.href)}
                  className={`group block relative aspect-[3/4] max-h-[78svh] w-full overflow-hidden transition-transform duration-700 ease-out ${p.tilt} md:hover:[transform:perspective(1600px)_rotateY(0deg)_translateZ(12px)]`}
                >
                  <DepthPanel src={p.img} depthSrc={p.depth} alt={name} className="absolute inset-0" />
                  {/* 下だけ暗く落として文字を置く */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050605]/85 via-[#050605]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-[var(--font-cormorant)] text-[#B8A882] text-[11px] tracking-[0.5em] uppercase mb-3">{p.info.area}</p>
                      <h2 className="font-[var(--font-noto-serif-jp)] font-light text-[#F7F5F0] text-2xl md:text-3xl tracking-[0.2em] leading-tight">{name}</h2>
                      <p className="mt-3 font-[var(--font-cormorant)] text-[#D8D5CC] text-sm tracking-[0.2em]">{p.info.hours}</p>
                    </div>
                    <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[#B8A882]/70 text-[#F7F5F0] group-hover:bg-[#F7F5F0] group-hover:text-[#1A1A18] transition-colors" aria-label={tx.enter}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" /></svg>
                    </span>
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
