"use client";
import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import type { FullMenuSection, StoreInfo } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";
import DepthPanel from "./DepthPanel";
import { DEFAULT_APPEARANCE, defaultExperience, type Appearance, type Experience } from '@/lib/experience';
import { readableOn } from '@/lib/color';

interface Props {
  info: StoreInfo;
  infoEn?: StoreInfo;
  fullMenu: FullMenuSection[];
  fullMenuEn?: FullMenuSection[];
  reservationUrl?: string;
  reservationUrlEn?: string;
  appearance?: Appearance;
  experience?: Experience;
}

export default function StoreMenuLayout({ info, infoEn, fullMenu, fullMenuEn, reservationUrl, reservationUrlEn, appearance = DEFAULT_APPEARANCE, experience = defaultExperience() }: Props) {
  const { lang, localize } = useLang();
  const en = lang === "en";
  const currentInfo = en && infoEn ? infoEn : info;
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const selectCategory = (id: string) => {
    setCategory(id);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" }));
  };
  const sections = en && fullMenuEn?.length ? fullMenuEn : fullMenu;
  const normalizedQuery = query.normalize("NFKC").trim().toLocaleLowerCase();
  const selectedCategory = sections.some(section => section.id === category) ? category : "all";
  const visibleSections = sections
    .filter(section => selectedCategory === "all" || section.id === selectedCategory)
    .map(section => ({
      ...section,
      items: section.items.filter(item => !normalizedQuery ||
        [item.name, item.nameEn, item.description, item.descriptionEn, item.note, section.label, section.labelEn]
          .filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase().includes(normalizedQuery)),
    })).filter(section => section.items.length);
  const count = visibleSections.reduce((sum, section) => sum + section.items.length, 0);
  const name = currentInfo.name;
  const reserve = (en ? reservationUrlEn || reservationUrl : reservationUrl) || localize("/#contact");
  const reset = () => { setQuery(""); selectCategory("all"); };
  const artwork = info.slug === 'kyoto' ? experience.scenes[4] : experience.kumamoto;

  return <>
    <Header initialDark reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    <main className="editorial-page" style={{'--menu-image-aspect':appearance.menuAspect} as CSSProperties}>
      <div className="editorial-wrap">
        <nav className="menu-breadcrumb" aria-label={en ? "Breadcrumb" : "パンくずリスト"}>
          <Link href={localize("/")}>Chasen</Link><span aria-hidden>/</span>
          <Link href={localize(`/stores/${currentInfo.slug}`)}>{name}</Link><span aria-hidden>/</span><span>{en ? "Menu" : "お品書き"}</span>
        </nav>
        <section className="menu-intro">
          <div><p className="eyebrow">{currentInfo.area.toUpperCase()} / MENU</p><h1>{en ? "A taste of Chasen." : "お品書き"}<small>{name}</small></h1><p>{en ? "Find your next favourite. Browse by category or search the menu." : "気になる一品を、ゆっくりと。\nカテゴリーや品名から、お好きな味をお探しください。"}</p></div>
          <div className="editorial-photo menu-painted-intro"><DepthPanel src={artwork.src} depthSrc={artwork.depth} motion={artwork.motion} alt={en ? artwork.altEn : artwork.alt} fit="contain" /></div>
        </section>
      </div>

      <div className="menu-tools">
        <div className="editorial-wrap menu-tools-inner">
          <label className="menu-search"><span aria-hidden>⌕</span><span className="sr-only">{en ? "Search menu" : "メニューを検索"}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={en ? "Search menu…" : "品名・キーワードで検索"} /></label>
          <nav className="menu-categories" aria-label={en ? "Menu categories" : "メニューカテゴリー"}>
            <button type="button" aria-pressed={selectedCategory === "all"} onClick={() => selectCategory("all")}>{en ? "All" : "すべて"}</button>
            {sections.map(section => <button type="button" key={section.id} aria-pressed={selectedCategory === section.id} onClick={() => selectCategory(section.id)}>{en ? section.labelEn : section.label}</button>)}
          </nav>
        </div>
      </div>

      <div className="editorial-wrap menu-results" ref={resultsRef}>
        <p className="menu-count" role="status" aria-live="polite">{en ? `${count} items` : `${count} 品を表示`}</p>
        {visibleSections.map(section => <section id={section.id} className="menu-category" key={section.id}>
          <div className="menu-category-heading"><h2>{en ? section.labelEn : section.label}</h2>{!en && <p>{section.labelEn}</p>}</div>
          <div className="menu-items">
            {section.items.map((item, index) => <article className={`menu-item ${item.photoUrl ? "" : "no-photo"}`} key={`${item.name}-${index}`} style={{'--menu-accent':readableOn(item.accent || section.accent, '#0B0C0A')} as CSSProperties}>
              {item.photoUrl && <div className="menu-item-photo"><Image src={item.photoUrl} alt={en ? item.nameEn || item.name : item.name} fill sizes="(max-width: 767px) 45vw, (max-width: 1279px) 23vw, 280px" style={{objectFit:'cover',objectPosition:'center'}} /></div>}
              {item.note && <p className="menu-item-note">{en ? item.noteEn || item.note : item.note}</p>}
              <h3>{en ? item.nameEn || item.name : item.name}</h3>
              {item.description && <p className="menu-item-description">{en ? item.descriptionEn || item.description : item.description}</p>}
              {item.price && <p className="menu-price">{item.price}{appearance.priceNote && <small>{en ? appearance.priceNote==='税込'?'incl. tax':'excl. tax' : appearance.priceNote}</small>}</p>}
            </article>)}
          </div>
        </section>)}
        {count === 0 && <div className="menu-empty"><p>{en ? "No items match your search. Try a different word or category." : "該当するメニューがありません。\nキーワードやカテゴリーを変えてお探しください。"}</p><button type="button" className="editorial-button" onClick={reset}>{en ? "Show all items" : "すべてのメニューを表示"}</button></div>}
        <div className="menu-bottom"><Link href={localize(`/stores/${currentInfo.slug}`)} className="editorial-text-link">{en ? "Shop information & access" : "店舗情報・アクセス"}<span aria-hidden>↗</span></Link><a href={reserve} target={reserve.startsWith("http") ? "_blank" : undefined} rel={reserve.startsWith("http") ? "noopener noreferrer" : undefined} className="editorial-button">{en ? "Make a reservation" : "ご来店のご予約"}<span aria-hidden>↗</span></a></div>
      </div>
    </main>
  </>;
}
