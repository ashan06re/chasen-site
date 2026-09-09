"use client";
import Header from "./Header";
import DepthPanel from "./DepthPanel";
import Link from "next/link";
import type { StoreContent } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";
import { INSTAGRAM } from "@/lib/site";
import { defaultExperience, type Experience } from '@/lib/experience';
import { readableOn } from '@/lib/color';

/** "https://www.instagram.com/chasen_cafe_kumamoto/" → "@chasen_cafe_kumamoto" */
const instagramHandle = (url: string) => {
  const m = url.match(/instagram\.com\/([^/?#]+)/);
  return m ? `@${m[1]}` : url;
};

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
  experience = defaultExperience(),
}: {
  store: Pick<StoreContent, 'info' | 'news'>;
  newsEn?: import("@/data/storeContent").NewsItem[];
  infoEn?: import("@/data/storeContent").StoreInfo;
  reservationUrl?: string;
  reservationUrlEn?: string;
  experience?: Experience;
}) {
  const { lang, localize } = useLang();
  const resolvedReservationUrl = lang === "en" ? (reservationUrlEn || reservationUrl) : reservationUrl;
  const tx = t[lang];
  const { info } = store;
  const news = lang === "en" && newsEn && newsEn.length > 0 ? newsEn : store.news;

  const tel = (lang === "en" ? infoEn?.tel : info.tel) ?? info.tel;
  const instagram = info.instagram || INSTAGRAM[info.slug];

  const infoRows: Array<{ label: string; value: string; href?: string; external?: boolean }> = [
    { label: tx.address, value: lang === "en" ? (infoEn?.address ?? info.address) : info.address },
    { label: tx.hours,   value: info.hours },
    ...(tel ? [{ label: tx.tel, value: tel, href: `tel:${tel.replace(/-/g, "")}` }] : []),
    { label: tx.closed,  value: lang === "en" ? (infoEn?.closed ?? info.closedEn ?? info.closed) : info.closed },
    { label: tx.access,  value: lang === "en" ? (infoEn?.access ?? info.accessEn ?? info.access) : info.access },
    ...(instagram ? [{ label: "Instagram", value: instagramHandle(instagram), href: instagram, external: true }] : []),
  ];

  const description = lang === "en"
    ? (infoEn?.description ?? info.descriptionEn ?? info.description)
    : info.description;

  const name = lang === "en" ? infoEn?.nameEn || info.nameEn || info.name : info.name;
  const isKyoto = info.slug === "kyoto";
  const art = isKyoto ? experience.kyoto : experience.kumamoto;
  return <>
    <Header initialDark reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    <main className="editorial-page">
      <section className="editorial-wrap store-intro">
        <nav className="menu-breadcrumb" aria-label={lang === "en" ? "Breadcrumb" : "パンくずリスト"}><Link href={localize("/")}>Chasen</Link><span aria-hidden>/</span><span>{name}</span></nav>
        <div className="store-intro-top">
          <div><p className="eyebrow" style={{color:readableOn((lang==='en'?infoEn?.accentColor:undefined)||info.accentColor,'#0B0C0A')}}>{info.area.toUpperCase()} / OUR SHOP</p><h1>{name}</h1></div>
          <Link href={localize(`/stores/${info.slug}/menu`)} className="editorial-button">{tx.viewMenu}<span aria-hidden>↗</span></Link>
        </div>
        <div className="editorial-photo store-intro-image"><DepthPanel src={art.src} depthSrc={art.depth} motion={art.motion} alt={lang==='en'?art.altEn:art.alt} fit="contain" /></div>
        <div className="store-information-grid">
          <div><p className="eyebrow">{tx.about}</p><p className="editorial-body">{description}</p><div className="editorial-actions"><a href={resolvedReservationUrl ? `${resolvedReservationUrl}#${info.slug}` : localize('/reserve')} className="editorial-button">{tx.reserve}<span aria-hidden>↗</span></a></div></div>
          <div><p className="eyebrow">{tx.storeInfo}</p><dl className="store-information">
            {infoRows.filter(row => row.value).map(({ label, value, href, external }) => <div key={label}><dt>{label}</dt><dd>{href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{value}</a> : value}</dd></div>)}
          </dl></div>
        </div>
      </section>
      {news.length > 0 && <section className="editorial-wrap editorial-section">
        <div className="editorial-heading"><div><p className="eyebrow">FROM OUR SHOP</p><h2>{tx.monthlyNews}</h2></div></div>
        <div className="store-news-list">{news.map((item, i) => <article key={i}><div><time>{item.date}</time><span>{item.badge}</span></div><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </section>}
      <div className="editorial-wrap menu-bottom"><Link href={localize("/#stores")} className="editorial-text-link">{lang === "en" ? "All shops" : "店舗一覧へ"}<span aria-hidden>↗</span></Link><Link href={localize(`/stores/${info.slug}/menu`)} className="editorial-text-link">{tx.viewMenu}<span aria-hidden>↗</span></Link></div>
    </main>
  </>;
}
