"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/langContext";
import type { BrandStoryContent, StoreInfo, YoshidaSettings } from "@/data/storeContent";

type Props = {
  kyoto: StoreInfo;
  kumamoto: StoreInfo;
  brand: BrandStoryContent;
  brandEn: BrandStoryContent;
  tea: YoshidaSettings;
  teaEn: YoshidaSettings;
};

export default function EditorialHome({ kyoto, kumamoto, brand, brandEn, tea, teaEn }: Props) {
  const { lang, localize } = useLang();
  const en = lang === "en";
  const story = en ? brandEn : brand;
  const teaStory = en ? teaEn : tea;
  return (
    <div className="editorial-home">
      <section className="editorial-hero editorial-wrap">
        <div className="hero-copy">
          <p className="eyebrow">KYOTO · KUMAMOTO / JAPANESE TEA STAND</p>
          <h1>{en ? <>A little pause.<br />A taste of Japan.</> : <>お茶と、甘いもの。<br />心ほどける、ひととき。</>}</h1>
          <p className="hero-description">{en ? "Discover Japanese tea and matcha sweets at Chasen. A moment to slow down, in Kyoto and Kumamoto." : "抹茶の香りに、お菓子の彩り。\n京都と熊本、茶筅で過ごす小さなご褒美の時間。"}</p>
          <div className="editorial-actions">
            <a href="#menu" className="editorial-button">{en ? "Explore the menu" : "お品書きを見る"}<span aria-hidden>↗</span></a>
            <a href="#stores" className="editorial-text-link">{en ? "Find a shop" : "お店を探す"}<span aria-hidden>↓</span></a>
          </div>
          <p className="hero-signoff">Tea, sweets & a little Kyoto.</p>
        </div>
        <figure className="hero-artwork">
          <div className="hero-artwork-frame"><Image src="/editorial/kyoto-artwork.webp" alt={en ? "A painted Kyoto streetscape displayed at Chasen, with stone steps, trees and a pagoda" : "茶筅の店内を彩る、石段と木々、塔を描いた京都の風景画"} fill sizes="(max-width: 767px) 90vw, 44vw" preload className="object-cover" /></div>
          <figcaption><span>01 / A SCENE OF KYOTO</span><span>{en ? "From our shop" : "店内の風景画より"}</span></figcaption>
        </figure>
      </section>

      <section id="menu" className="editorial-wrap editorial-section">
        <div className="editorial-heading"><div><p className="eyebrow">TEA & SWEETS</p><h2>{en ? "Something to savour." : "ひと口に、心おどる。"}</h2></div><p>{en ? "Choose a shop to explore its menu." : "お店ごとのお品書きを、ご覧ください。"}</p></div>
        <div className="editorial-menu-grid">
          <Link href={localize("/stores/kyoto/menu")} className="editorial-menu-card">
            <div className="editorial-photo portrait"><Image src="/editorial/kyoto-treasure.webp" alt={en ? "Matcha sweets served in Chasen's wooden treasure box" : "木の宝箱に並ぶ抹茶のお菓子"} fill sizes="(max-width: 767px) 90vw, 48vw" className="object-cover" /></div>
            <div className="editorial-card-caption"><div><p className="eyebrow">KYOTO / KODAIJI</p><h3>{en ? "Tea time in Kyoto" : "京都で楽しむ、お茶の時間。"}</h3></div><span className="round-arrow" aria-hidden>↗</span></div>
            <span className="editorial-text-link">{en ? "Kodaiji menu" : "高台寺店のお品書き"}<span aria-hidden>→</span></span>
          </Link>
          <Link href={localize("/stores/kumamoto/menu")} className="editorial-menu-card secondary">
            <div className="editorial-photo square"><Image src="/editorial/kumamoto-treasure.webp" alt={en ? "Chasen Kumamoto's matcha treasure box sweets" : "熊本店の抹茶の宝箱スイーツ"} fill sizes="(max-width: 767px) 90vw, 40vw" className="object-cover" /></div>
            <div className="editorial-card-caption"><div><p className="eyebrow">KUMAMOTO</p><h3>{en ? "A sweet moment in Kumamoto" : "熊本で出会う、抹茶の彩り。"}</h3></div><span className="round-arrow" aria-hidden>↗</span></div>
            <span className="editorial-text-link">{en ? "Kumamoto menu" : "熊本店のお品書き"}<span aria-hidden>→</span></span>
          </Link>
        </div>
      </section>

      <section id="stores" tabIndex={-1} className="editorial-wrap editorial-section">
        <div className="editorial-heading"><div><p className="eyebrow">OUR SHOPS</p><h2>{en ? "Find your moment." : "旅の途中にも、いつもの日にも。"}</h2></div></div>
        <div className="editorial-shop-grid">
          {[kyoto, kumamoto].map((shop, index) => <article className="editorial-shop" key={shop.slug}>
            <div className="editorial-photo landscape"><Image src={index === 0 ? "/editorial/kyoto-interior.webp" : "/editorial/kumamoto-treasure.webp"} alt={index === 0 ? (en ? "Light-filled counter seats at Chasen Kodaiji" : "高台寺店の窓辺のカウンター席") : (en ? "Sweets at Chasen Kumamoto" : "熊本店で楽しめる抹茶スイーツ")} fill sizes="(max-width: 767px) 90vw, 45vw" className="object-cover" /></div>
            <div className="editorial-shop-info"><p className="eyebrow">0{index + 1} / {shop.area}</p><h3>{en ? shop.nameEn || shop.name : shop.name}</h3><p className="shop-hours">{shop.hours}</p><div className="editorial-actions"><Link href={localize(`/stores/${shop.slug}`)} className="editorial-text-link">{en ? "Shop & access" : "店舗情報・アクセス"}<span aria-hidden>↗</span></Link><Link href={localize(`/stores/${shop.slug}/menu`)} className="editorial-text-link">{en ? "Menu" : "お品書き"}<span aria-hidden>↗</span></Link></div></div>
          </article>)}
        </div>
      </section>

      <section id="brand" className="editorial-wrap editorial-section editorial-brand">
        <div className="editorial-photo brand-photo"><Image src="/editorial/kyoto-detail.webp" alt={en ? "Wooden masu boxes bearing the Chasen mark" : "茶筅の印が入った木の枡"} fill sizes="(max-width: 767px) 90vw, 40vw" className="object-cover" /></div>
        <div><p className="eyebrow">THE CHASEN STORY</p><h2>{story.catchphrase}<br />{story.catchphraseHighlight}</h2><p className="editorial-body">{story.body1}</p><details className="editorial-details"><summary>{en ? "More about Chasen & our tea" : "茶筅と、お茶のこと"}<span aria-hidden>＋</span></summary><div className="editorial-body"><p>{story.body2}</p><p>{story.body3}</p><h3>{en ? teaStory.nameEn : teaStory.nameJa}</h3><p>{teaStory.intro}</p></div></details></div>
      </section>
    </div>
  );
}
