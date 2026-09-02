"use client";
import Image from "next/image";
import Link from "next/link";
import AnimateIn from "./AnimateIn";
import TiltCard from "./TiltCard";
import type { StoreContent, MenuCard } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

interface Props {
  store: StoreContent;
  menuCardsEn?: MenuCard[];
  dark?: boolean;
}

const t = {
  ja: { taxNote: "税抜", viewStore: "店舗詳細を見る" },
  en: { taxNote: "excl. tax", viewStore: "View Store Details" },
};

export default function StoreSection({ store, menuCardsEn, dark = false }: Props) {
  const { lang } = useLang();
  const tx = t[lang];
  const { info } = store;
  const menuCards = lang === "en" && menuCardsEn && menuCardsEn.length > 0
    ? menuCardsEn
    : store.menuCards;
  const bgColor   = dark ? "#1A1A18" : "#F7F5F0";
  const textColor = dark ? "#F7F5F0" : "#1A1A18";
  const storePath = `/stores/${info.slug}`;

  const bgText = info.slug === "kyoto" ? "京都" : info.slug === "kumamoto" ? "熊本" : null;
  const bgTextColor = dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)";

  return (
    <section
      id={info.slug === "kyoto" ? "stores" : undefined}
      className="py-24 md:py-36 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {bgText && (
        <div
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 font-[var(--font-noto-serif-jp)] pointer-events-none select-none flex flex-col items-center"
          style={{ fontSize: "clamp(12rem, 22vw, 20rem)", lineHeight: 1, color: bgTextColor }}
          aria-hidden
        >
          {bgText.split("").map((char, i) => (
            <span key={i} style={{ display: "block" }}>{char}</span>
          ))}
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="px-6 md:px-12 mb-12">
          <AnimateIn>
            <p className="font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-4">
              {info.area}
            </p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Link href={storePath} className="group">
                <h2
                  className="font-[var(--font-cormorant)] text-4xl md:text-5xl font-light tracking-wider group-hover:opacity-70 transition-opacity"
                  style={{ color: textColor }}
                >
                  {lang === "en" ? (info.nameEn ?? info.name) : info.name}
                </h2>
              </Link>
              <p className="font-[var(--font-cormorant)] text-sm tracking-[0.2em] text-[#6B6B5E]">
                {info.hours}
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="mt-4 font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base leading-[2] tracking-wide font-light max-w-xl">
              {lang === "en" && info.descriptionEn ? info.descriptionEn : info.description}
            </p>
          </AnimateIn>
        </div>

        {/* カードスクロール */}
        <AnimateIn delay={300}>
          <div
            className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-6"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#B8A882 transparent" }}
          >
            {menuCards.map((card, i) => {
              const cardTitle    = lang === "en" ? (card.titleEn       ?? card.title)       : card.title;
              const cardCategory = lang === "en" ? (card.categoryEn    ?? card.category)    : card.category;
              const cardDesc     = lang === "en" ? (card.descriptionEn ?? card.description) : card.description;
              return (
              <TiltCard
                key={i}
                className="flex-shrink-0"
                maxTilt={4.5}
                style={{
                  width: "calc(min(100vw - 6rem, 80rem - 6rem) / 3.6)",
                  minWidth: "180px",
                }}
              >
              <article
                className="flex h-full flex-col border rounded-sm overflow-hidden"
                style={{
                  backgroundColor: card.bg,
                  borderColor: `${card.accent}20`,
                }}
              >
                {/* 写真エリア */}
                <div
                  className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: `${card.accent}12`,
                    borderBottom: `1px solid ${card.accent}20`,
                  }}
                >
                  {card.photoUrl ? (
                    <Image
                      src={card.photoUrl}
                      alt={cardTitle}
                      fill
                      sizes="(max-width: 768px) 60vw, 280px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span
                      className="font-[var(--font-cormorant)] text-xs tracking-[0.4em] uppercase"
                      style={{ color: `${card.accent}60` }}
                    >
                      Photo
                    </span>
                  )}
                </div>

                {/* テキスト情報 */}
                <div className="flex flex-col flex-1 p-4">
                  <span
                    className="font-[var(--font-cormorant)] text-xs tracking-[0.3em] uppercase mb-1"
                    style={{ color: card.accent, minHeight: "1em" }}
                  >
                    {cardCategory}
                  </span>

                  <h3
                    className="font-[var(--font-noto-serif-jp)] text-sm tracking-wider mb-2 leading-snug"
                    style={{ color: "#1A1A18" }}
                  >
                    {cardTitle}
                  </h3>

                  <p
                    className="font-[var(--font-noto-serif-jp)] text-xs leading-[1.9] tracking-wide font-light flex-1"
                    style={{ color: "#6B6B5E" }}
                  >
                    {cardDesc}
                  </p>

                  {card.price && (
                    <div className="mt-3 flex items-baseline gap-1">
                      <span
                        className="font-[var(--font-cormorant)] text-xl tracking-wider"
                        style={{ color: card.accent }}
                      >
                        {card.price}
                      </span>
                      <span className="font-[var(--font-noto-serif-jp)] text-[10px] tracking-wider text-[#B8A882]">
                        {tx.taxNote}
                      </span>
                    </div>
                  )}

                  <div
                    className="mt-3 h-px"
                    style={{ backgroundColor: `${card.accent}20` }}
                  />
                </div>
              </article>
              </TiltCard>
              );
            })}
          </div>
        </AnimateIn>

        {/* 詳しく見るリンク */}
        <AnimateIn delay={400}>
          <div className="px-6 md:px-12 mt-8">
            <Link
              href={storePath}
              className="inline-flex items-center gap-3 font-[var(--font-cormorant)] text-sm tracking-[0.3em] uppercase text-[#B8A882] hover:opacity-60 transition-opacity"
            >
              <span>{tx.viewStore}</span>
              <span className="w-8 h-px inline-block bg-[#B8A882]" />
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
