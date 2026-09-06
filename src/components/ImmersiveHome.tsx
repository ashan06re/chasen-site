"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/langContext";
import type { BrandStoryContent, StoreInfo, YoshidaSettings } from "@/data/storeContent";
import Story from "./story/Story";
import DepthPanel from "./DepthPanel";
import TiltCard from "./TiltCard";
import SmoothScroll from "./SmoothScroll";

type Props = { kyoto: StoreInfo; kumamoto: StoreInfo; brand: BrandStoryContent; brandEn: BrandStoryContent; tea: YoshidaSettings; teaEn: YoshidaSettings };

export default function ImmersiveHome({ kyoto, kumamoto, brand, brandEn, tea, teaEn }: Props) {
  const { lang, localize } = useLang();
  const en = lang === "en";
  const story = en ? brandEn : brand;
  const teaStory = en ? teaEn : tea;
  return <div className="immersive-home">
    <SmoothScroll />
    <Story />
    <section id="stores" tabIndex={-1} className="immersive-shops editorial-wrap">
      <div className="shop-section-heading"><div><p className="eyebrow">THE JOURNEY CONTINUES</p><h2>{en ? <>Two places.<br />One Chasen moment.</> : <>この続きは、<br />お店で。</>}</h2></div><p>{en ? <>Kyoto and Kumamoto.<br />Find your place for tea and sweets.</> : <>京都と熊本。<br />それぞれの街で、お茶と甘いものを。</>}</p></div>
      <div id="menu" className="immersive-shop-panels">{[kyoto, kumamoto].map((shop, i) => <article key={shop.slug} className="immersive-shop-card">
        <TiltCard maxTilt={4} className="shop-dimensional-frame">
          <Link href={localize(`/stores/${shop.slug}`)} className="shop-art-link" aria-label={en ? `${shop.nameEn || shop.name} — shop and access` : `${shop.name}の店舗情報・アクセス`}>
            <DepthPanel src={`/story-art/${i === 0 ? "03" : "06"}.webp`} depthSrc={`/story-art/${i === 0 ? "03" : "06"}-depth.webp`} alt={i === 0 ? (en ? "A painted view of Kodaiji's window counter" : "高台寺店の窓辺を描いた背景画") : (en ? "A painted view of Kumamoto's matcha treasure box" : "熊本店の抹茶の宝箱を描いた背景画")} />
            <div className="shop-art-caption"><span>{i === 0 ? "KYOTO" : "KUMAMOTO"}</span><span className="shop-art-arrow" aria-hidden="true">↗</span></div>
          </Link>
        </TiltCard>
        <div className="shop-panel-info"><div><p className="eyebrow">0{i + 1} / {i === 0 ? "KODAIJI" : "SAKURAMACHI"}</p><h3>{en ? shop.nameEn || shop.name : shop.name}</h3></div><p className="shop-hours">{shop.hours}</p></div>
        <div className="shop-panel-actions"><Link href={localize(`/stores/${shop.slug}/menu`)}>{en ? "Explore the menu" : "お品書きを見る"}<span aria-hidden="true">↗</span></Link><Link href={localize(`/stores/${shop.slug}`)}>{en ? "Shop & access" : "店舗情報・アクセス"}<span aria-hidden="true">→</span></Link></div>
      </article>)}</div>
      <p className="story-art-note">{en ? "Story illustrations are inspired by our shops and sweets. See each shop’s menu for product details." : "物語の背景画は、店舗と商品をもとにしたイメージです。商品については各店のお品書きをご覧ください。"}</p>
    </section>
    <section id="brand" className="immersive-brand editorial-wrap">
      <div className="immersive-brand-heading"><p className="eyebrow">TEA, WITH A LITTLE WONDER.</p><h2>{story.catchphrase}<br />{story.catchphraseHighlight}</h2></div>
      <div className="immersive-brand-body"><div className="brand-masu"><Image src="/editorial/kyoto-detail.webp" alt={en ? "Chasen's wooden masu boxes" : "茶筅の印が入った木の枡"} width={520} height={390} sizes="(max-width: 767px) 90vw, 32vw" className="object-cover" /></div><div><p className="editorial-body">{story.body1}</p><details className="editorial-details"><summary>{en ? "Chasen & our tea" : "茶筅と、お茶のこと"}<span aria-hidden="true">＋</span></summary><div className="editorial-body"><p>{story.body2}</p><p>{story.body3}</p><h3>{en ? teaStory.nameEn : teaStory.nameJa}</h3><p>{teaStory.intro}</p></div></details></div></div>
    </section>
  </div>;
}
