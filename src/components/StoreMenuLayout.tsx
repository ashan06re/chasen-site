"use client";
import Image from "next/image";
import Header from "./Header";
import AnimateIn from "./AnimateIn";
import TiltCard from "./TiltCard";
import Link from "next/link";
import type { FullMenuSection, StoreInfo } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";
import { readableOn } from "@/lib/color";

interface Props {
  info: StoreInfo;
  fullMenu: FullMenuSection[];
  fullMenuEn?: FullMenuSection[];
}

const SECTION_BG_PALETTE = ["#F7F5F0", "#EFEBE4", "#F7F5F0", "#1A1A18"];

const t = {
  ja: { menuList: "メニュー一覧", reserve: "ご予約はこちら", taxNote: "税抜" },
  en: { menuList: "Menu",        reserve: "Make a Reservation", taxNote: "excl. tax" },
};

export default function StoreMenuLayout({ info, fullMenu, fullMenuEn }: Props) {
  const { lang, localize } = useLang();
  const tx = t[lang];
  const sections = lang === "en" && fullMenuEn && fullMenuEn.length > 0 ? fullMenuEn : fullMenu;

  return (
    <>
      <Header initialDark />

      <main>
        {/* Hero */}
        <section
          className="relative pt-40 pb-24 px-6"
          style={{ backgroundColor: info.accentColor }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="font-[var(--font-cormorant)] text-sm tracking-[0.5em] uppercase mb-4" style={{ color: readableOn("#B8A882", info.accentColor) }}>
              {info.area} — Menu
            </p>
            <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl font-light text-[#F7F5F0] tracking-wider leading-tight">
              {info.name}
            </h1>
            <p className="mt-3 font-[var(--font-noto-serif-jp)] text-[#F7F5F0]/60 text-lg tracking-wider font-light">
              {tx.menuList}
            </p>
            <div className="mt-8 w-12 h-px bg-[#B8A882]" />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{
              background: "linear-gradient(to bottom right, transparent 49%, #F7F5F0 50%)",
            }}
          />
        </section>

        {/* カテゴリ ナビゲーション */}
        <nav className="sticky top-0 z-30 bg-[#F7F5F0] border-b border-[#E8E0D0] shadow-sm">
          <div className="max-w-5xl mx-auto px-6 flex gap-8 overflow-x-auto py-1 no-scrollbar">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center justify-center min-w-11 py-3 font-[var(--font-cormorant)] text-sm tracking-[0.4em] uppercase text-chasen-muted hover:text-[#3D6B35] transition-colors whitespace-nowrap flex-shrink-0"
              >
                {section.labelEn}
              </a>
            ))}
          </div>
        </nav>

        {/* メニューセクション */}
        {sections.map((section, sIdx) => {
          const bg = SECTION_BG_PALETTE[sIdx % SECTION_BG_PALETTE.length];
          const isDark = bg === "#1A1A18";
          const labelColor = isDark ? "#B8A882" : "#75663F";
          const accent = readableOn(section.accent, bg);
          const accentLarge = readableOn(section.accent, bg, 3);

          return (
            <section
              id={section.id}
              key={section.id}
              className="py-20 px-6"
              style={{ backgroundColor: bg }}
            >
              <div className="max-w-5xl mx-auto">
                <AnimateIn>
                  <div className="flex items-center gap-6 mb-14">
                    <h2
                      className="font-[var(--font-cormorant)] text-5xl md:text-6xl font-light tracking-wide flex-shrink-0"
                      style={{ color: accentLarge }}
                    >
                      {section.labelEn}
                    </h2>
                    <div
                      className="flex-1 h-px"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(247,245,240,0.1)"
                          : "#E8E0D0",
                      }}
                    />
                    <p
                      className="font-[var(--font-noto-serif-jp)] text-sm tracking-[0.3em] flex-shrink-0"
                      style={{ color: labelColor }}
                    >
                      {section.label}
                    </p>
                  </div>
                </AnimateIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                  {section.items.map((item, i) => (
                    <AnimateIn key={i} delay={i * 80}>
                      <TiltCard maxTilt={4}>
                      <article className="group flex flex-col">
                        <div
                          className="relative aspect-[4/3] mb-5 overflow-hidden flex items-center justify-center"
                          style={{
                            backgroundColor: isDark
                              ? "rgba(247,245,240,0.05)"
                              : `${section.accent}12`,
                            border: isDark
                              ? "1px solid rgba(247,245,240,0.08)"
                              : `1px solid ${section.accent}20`,
                          }}
                        >
                          {item.photoUrl ? (
                            <Image
                              src={item.photoUrl}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <span
                              className="font-[var(--font-cormorant)] text-xs tracking-[0.4em] uppercase"
                              style={{ color: `${section.accent}60` }}
                            >
                              Photo
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col flex-1 px-1">
                          {item.note && (
                            <span
                              className="font-[var(--font-cormorant)] text-xs tracking-[0.3em] uppercase mb-2"
                              style={{ color: accent }}
                            >
                              {item.note}
                            </span>
                          )}

                          <h3
                            className="font-[var(--font-noto-serif-jp)] text-base tracking-wider mb-2 leading-snug"
                            style={{ color: isDark ? "#F7F5F0" : "#1A1A18" }}
                          >
                            {item.name}
                          </h3>

                          <p
                            className="font-[var(--font-noto-serif-jp)] text-xs leading-[1.9] tracking-wide font-light flex-1"
                            style={{ color: isDark ? "rgba(247,245,240,0.5)" : "#6B6B5E" }}
                          >
                            {item.description}
                          </p>

                          {/* 価格が未入力の品は価格行ごと出さない（「税抜」だけが残らないように） */}
                          {item.price && (
                          <div className="mt-4 flex items-baseline gap-2">
                            <span
                              className="font-[var(--font-cormorant)] text-2xl tracking-wider"
                              style={{ color: accent }}
                            >
                              {item.price}
                            </span>
                            <span
                              className="font-[var(--font-noto-serif-jp)] text-[10px] tracking-wider"
                              style={{
                                color: isDark
                                  ? "rgba(184,168,130,0.85)"
                                  : "#75663F",
                              }}
                            >
                              {tx.taxNote}
                            </span>
                          </div>
                          )}

                          <div
                            className="mt-4 h-px"
                            style={{
                              backgroundColor: isDark
                                ? "rgba(247,245,240,0.06)"
                                : "#E8E0D0",
                            }}
                          />
                        </div>
                      </article>
                      </TiltCard>
                    </AnimateIn>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* 戻るリンク */}
        <section className="bg-[#F7F5F0] py-16 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href={localize(`/stores/`)}
              className="inline-flex items-center gap-3 py-3 font-[var(--font-cormorant)] text-sm tracking-[0.3em] uppercase text-chasen-gold-deep hover:opacity-60 transition-opacity"
            >
              <span className="w-8 h-px bg-current inline-block" />
              <span>Back to {info.name}</span>
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#3D6B35] text-[#F7F5F0] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.2em] px-8 py-4 hover:bg-[#2A4D25] transition-colors"
            >
              {tx.reserve}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
