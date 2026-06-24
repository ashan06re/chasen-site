"use client";
import Header from "./Header";
import AnimateIn from "./AnimateIn";
import type { BrandNewsItem } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

const storeLabelMap: Record<string, { label: string; labelEn: string; color: string }> = {
  高台寺店: { label: "高台寺店", labelEn: "Kodaiji",  color: "#2A4D25" },
  熊本店:   { label: "熊本店",   labelEn: "Kumamoto", color: "#1A1A18" },
};

const t = {
  ja: {
    sectionLabel: "News & Information",
    heading: "お知らせ",
    subheading: "茶筅 Chasen からのご案内・イベント情報",
    empty: "現在お知らせはありません。",
  },
  en: {
    sectionLabel: "News & Information",
    heading: "News",
    subheading: "Announcements & events from Chasen",
    empty: "No announcements at this time.",
  },
};

interface Props {
  itemsJa: BrandNewsItem[];
  itemsEn: BrandNewsItem[];
}

export default function NewsPageContent({ itemsJa, itemsEn }: Props) {
  const { lang } = useLang();
  const tx = t[lang];
  const items = lang === "en" ? itemsEn : itemsJa;

  return (
    <>
      <Header initialDark />

      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-28 px-6 bg-[#1A1A18]">
          <div className="max-w-5xl mx-auto">
            <p className="font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-4">
              {tx.sectionLabel}
            </p>
            <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl font-light text-[#F7F5F0] tracking-wider leading-tight">
              {tx.heading}
            </h1>
            <p className="mt-3 font-[var(--font-noto-serif-jp)] text-[#F7F5F0]/50 text-base tracking-wider font-light">
              {tx.subheading}
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

        {/* News grid */}
        <section className="bg-[#F7F5F0] py-24 px-6">
          <div className="max-w-5xl mx-auto">
            {items.length === 0 ? (
              <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-center py-20 tracking-wider">
                {tx.empty}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((item, i) => {
                  const storeInfo = item.store ? storeLabelMap[item.store] : null;
                  const storeDisplayLabel = storeInfo
                    ? (lang === "en" ? storeInfo.labelEn : storeInfo.label)
                    : null;
                  return (
                    <AnimateIn key={i} delay={i * 80}>
                      <article className="bg-white border border-[#E8E0D0] p-8 hover:border-[#B8A882]/60 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {storeInfo && storeDisplayLabel && (
                            <span
                              className="font-[var(--font-cormorant)] text-[10px] tracking-[0.3em] uppercase px-2.5 py-1 rounded-full text-[#F7F5F0]"
                              style={{ backgroundColor: storeInfo.color }}
                            >
                              {storeDisplayLabel}
                            </span>
                          )}
                          <span
                            className="font-[var(--font-cormorant)] text-xs tracking-[0.3em] uppercase px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${item.badgeColor}20`,
                              color: item.badgeColor,
                            }}
                          >
                            {item.badge}
                          </span>
                          <span className="font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-wider ml-auto">
                            {item.date}
                          </span>
                        </div>
                        <h2 className="font-[var(--font-noto-serif-jp)] text-lg text-[#1A1A18] tracking-wider mb-3 leading-snug">
                          {item.title}
                        </h2>
                        <p className="font-[var(--font-noto-serif-jp)] text-sm text-[#6B6B5E] leading-[1.9] tracking-wide font-light">
                          {item.body}
                        </p>
                      </article>
                    </AnimateIn>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
