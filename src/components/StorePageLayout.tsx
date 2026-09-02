"use client";
import Header from "./Header";
import AnimateIn from "./AnimateIn";
import Link from "next/link";
import type { StoreContent } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";
import { readableOn, mix } from "@/lib/color";

const t = {
  ja: {
    storeInfo: "Store Info",
    about: "About",
    address: "住所",
    hours: "営業時間",
    tel: "電話",
    closed: "定休日",
    access: "アクセス",
    viewMenu: "全メニューを見る",
    reserve: "ご予約はこちら",
    monthlyNews: "今月のお知らせ",
    monthlyNewsLabel: "Monthly News",
    backToStores: "Back to Stores",
  },
  en: {
    storeInfo: "Store Info",
    about: "About",
    address: "Address",
    hours: "Hours",
    tel: "Tel",
    closed: "Closed",
    access: "Access",
    viewMenu: "View Full Menu",
    reserve: "Make a Reservation",
    monthlyNews: "Monthly News",
    monthlyNewsLabel: "Monthly News",
    backToStores: "Back to Stores",
  },
};

export default function StorePageLayout({
  store,
  newsEn,
  infoEn,
  reservationUrl,
  reservationUrlEn,
}: {
  store: StoreContent;
  newsEn?: import("@/data/storeContent").NewsItem[];
  infoEn?: import("@/data/storeContent").StoreInfo;
  reservationUrl?: string;
  reservationUrlEn?: string;
}) {
  const { lang } = useLang();
  const resolvedReservationUrl = lang === "en" ? (reservationUrlEn || reservationUrl) : reservationUrl;
  const tx = t[lang];
  const { info } = store;
  const news = lang === "en" && newsEn && newsEn.length > 0 ? newsEn : store.news;

  const tel = (lang === "en" ? infoEn?.tel : info.tel) ?? info.tel;

  const infoRows: Array<{ label: string; value: string; href?: string }> = [
    { label: tx.address, value: lang === "en" ? (infoEn?.address ?? info.address) : info.address },
    { label: tx.hours,   value: info.hours },
    ...(tel ? [{ label: tx.tel, value: tel, href: `tel:${tel.replace(/-/g, "")}` }] : []),
    { label: tx.closed,  value: lang === "en" ? (infoEn?.closed ?? info.closedEn ?? info.closed) : info.closed },
    { label: tx.access,  value: lang === "en" ? (infoEn?.access ?? info.accessEn ?? info.access) : info.access },
  ];

  const description = lang === "en"
    ? (infoEn?.description ?? info.descriptionEn ?? info.description)
    : info.description;

  return (
    <>
      <Header initialDark />

      <main>
        {/* Hero */}
        <section
          className="relative pt-40 pb-28 px-6"
          style={{ backgroundColor: info.accentColor }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="font-[var(--font-cormorant)] text-sm tracking-[0.5em] uppercase mb-4" style={{ color: readableOn("#B8A882", info.accentColor) }}>
              {info.area}
            </p>
            <h1 className="font-[var(--font-cormorant)] text-6xl md:text-8xl font-light text-[#F7F5F0] tracking-wider leading-tight">
              {lang === "en" ? (infoEn?.nameEn ?? info.nameEn ?? info.name) : info.name}
            </h1>
            <p className="mt-3 font-[var(--font-noto-serif-jp)] text-[#F7F5F0]/60 text-lg tracking-wider font-light">
              {info.nameJa}
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

        {/* 店舗情報 */}
        <section className="bg-[#F7F5F0] py-20 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14">
            <AnimateIn>
              <div>
                <p className="font-[var(--font-cormorant)] text-chasen-gold-deep text-xs tracking-[0.5em] uppercase mb-6">
                  {tx.storeInfo}
                </p>
                <dl className="space-y-5">
                  {infoRows.map(({ label, value, href }) => (
                    <div
                      key={label}
                      className="flex gap-6 border-b border-[#E8E0D0] pb-5"
                    >
                      <dt className="font-[var(--font-noto-serif-jp)] text-xs tracking-wider text-chasen-gold-deep w-20 flex-shrink-0 pt-0.5">
                        {label}
                      </dt>
                      <dd className="font-[var(--font-noto-serif-jp)] text-sm text-[#1A1A18] leading-relaxed tracking-wide">
                        {href ? (
                          <a href={href} className="inline-block py-3 -my-3 hover:text-[#3D6B35] transition-colors">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </AnimateIn>

            <AnimateIn delay={150}>
              <div>
                <p className="font-[var(--font-cormorant)] text-chasen-gold-deep text-xs tracking-[0.5em] uppercase mb-6">
                  {tx.about}
                </p>
                <p className="font-[var(--font-noto-serif-jp)] text-chasen-muted text-base leading-[2.2] tracking-wide font-light">
                  {description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={`/stores/${info.slug}/menu`}
                    className="inline-flex items-center gap-3 border border-[#3D6B35] text-[#3D6B35] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.2em] px-8 py-4 hover:bg-[#3D6B35] hover:text-[#F7F5F0] transition-colors"
                  >
                    {tx.viewMenu}
                  </Link>
                  <a
                    href={resolvedReservationUrl || "#contact"}
                    target={resolvedReservationUrl ? "_blank" : undefined}
                    rel={resolvedReservationUrl ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-3 bg-[#3D6B35] text-[#F7F5F0] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.2em] px-8 py-4 hover:bg-[#2A4D25] transition-colors"
                  >
                    {tx.reserve}
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* 月替わりニュース */}
        <section className="bg-[#1A1A18] py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <p className="font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-4">
                {tx.monthlyNewsLabel}
              </p>
              <h2 className="font-[var(--font-noto-serif-jp)] text-3xl md:text-4xl font-light text-[#F7F5F0] tracking-wider mb-12">
                {tx.monthlyNews}
              </h2>
            </AnimateIn>

            <div className="grid md:grid-cols-2 gap-6">
              {news.map((item, i) => (
                <AnimateIn key={i} delay={i * 100}>
                  <article className="border border-[#F7F5F0]/10 p-8 hover:border-[#B8A882]/40 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="font-[var(--font-cormorant)] text-xs tracking-[0.3em] uppercase px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${item.badgeColor}25`,
                          color: readableOn(item.badgeColor, mix(item.badgeColor, "#1A1A18", 0.15)),
                        }}
                      >
                        {item.badge}
                      </span>
                      <span className="font-[var(--font-cormorant)] text-chasen-muted-light text-xs tracking-wider">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-[var(--font-noto-serif-jp)] text-lg text-[#F7F5F0] tracking-wider mb-3">
                      {item.title}
                    </h3>
                    <p className="font-[var(--font-noto-serif-jp)] text-sm text-chasen-muted-light leading-[1.9] tracking-wide font-light">
                      {item.body}
                    </p>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* 戻るリンク */}
        <section className="bg-[#F7F5F0] py-16 px-6 text-center">
          <Link
            href="/#stores"
            className="inline-flex items-center gap-3 py-3 font-[var(--font-cormorant)] text-sm tracking-[0.3em] uppercase text-chasen-gold-deep hover:opacity-60 transition-opacity"
          >
            <span className="w-8 h-px bg-current inline-block" />
            <span>{tx.backToStores}</span>
          </Link>
        </section>
      </main>
    </>
  );
}
