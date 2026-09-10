"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/langContext";
import type { BrandStoryContent, StoreInfo, YoshidaSettings } from "@/data/storeContent";
import Story from "./story/Story";
import DepthPanel from "./DepthPanel";
import TiltCard from "./TiltCard";
import SmoothScroll from "./SmoothScroll";
import type { Experience, Appearance } from '@/lib/experience';

type Props = { kyoto: StoreInfo; kumamoto: StoreInfo; kyotoEn?: StoreInfo; kumamotoEn?: StoreInfo; brand: BrandStoryContent; brandEn: BrandStoryContent; tea: YoshidaSettings; teaEn: YoshidaSettings; experience: Experience; appearance: Appearance };

export default function ImmersiveHome({ kyoto, kumamoto, kyotoEn, kumamotoEn, brand, brandEn, tea, teaEn, experience, appearance }: Props) {
  const { lang, localize } = useLang();
  const en = lang === "en";
  const story = en ? brandEn : brand;
  const teaStory = en ? teaEn : tea;
  const shops = en ? [kyotoEn ?? kyoto, kumamotoEn ?? kumamoto] : [kyoto, kumamoto];
  return <div className="immersive-home">
    <SmoothScroll />
    <Story scenes={experience.scenes} compact={appearance.compact} />
    <section id="stores" tabIndex={-1} className="immersive-shops editorial-wrap">
      <div className="shop-section-heading"><div><p className="eyebrow">THE JOURNEY CONTINUES</p><h2>{en ? experience.shopHeading.en : experience.shopHeading.ja}</h2></div><p>{en ? experience.shopHeading.detailEn : experience.shopHeading.detail}</p></div>
      <div id="menu" className="immersive-shop-panels">{shops.map((shop, i) => <article key={shop.slug} className="immersive-shop-card">
        <TiltCard maxTilt={4} className="shop-dimensional-frame">
          <Link href={localize(`/stores/${shop.slug}`)} className="shop-art-link" aria-label={en ? `${shop.name} — shop and access` : `${shop.name}の店舗情報・アクセス`}>
            <DepthPanel src={(i===0?experience.kyoto:experience.kumamoto).src} depthSrc={(i===0?experience.kyoto:experience.kumamoto).depth} motion={(i===0?experience.kyoto:experience.kumamoto).motion} alt={en?(i===0?experience.kyoto:experience.kumamoto).altEn:(i===0?experience.kyoto:experience.kumamoto).alt} fit="contain" />
            <div className="shop-art-caption"><span>{i === 0 ? "KYOTO" : "KUMAMOTO"}</span><span className="shop-art-arrow" aria-hidden="true">↗</span></div>
          </Link>
        </TiltCard>
        <div className="shop-panel-info"><div><p className="eyebrow">0{i + 1} / {i === 0 ? "KODAIJI" : "SAKURAMACHI"}</p><h3>{shop.name}</h3></div><p className="shop-hours">{shop.hours}</p></div>
        <div className="shop-panel-actions"><Link href={localize(`/stores/${shop.slug}/menu`)}>{en ? "Explore the menu" : "お品書きを見る"}<span aria-hidden="true">↗</span></Link><Link href={localize(`/stores/${shop.slug}`)}>{en ? "Shop & access" : "店舗情報・アクセス"}<span aria-hidden="true">→</span></Link></div>
      </article>)}</div>
      <p className="story-art-note">{en ? appearance.artNoteEn : appearance.artNote}</p>
    </section>
    <section id="brand" className="immersive-brand editorial-wrap">
      <div className="immersive-brand-heading"><p className="eyebrow">TEA, WITH A LITTLE WONDER.</p><h2>{story.catchphrase}<br />{story.catchphraseHighlight}</h2></div>
      <div className="immersive-brand-body"><div className="brand-masu"><Image src={experience.brand.src} alt={en ? experience.brand.altEn : experience.brand.alt} width={700} height={500} sizes="(max-width: 767px) 90vw, 32vw" className="object-cover" /></div><div><p className="editorial-body">{story.body1}</p><details className="editorial-details"><summary>{en ? "Chasen & our tea" : "茶筅と、お茶のこと"}<span aria-hidden="true">＋</span></summary><div className="editorial-body"><p>{story.body2}</p><p>{story.body3}</p><h3>{en ? teaStory.nameEn : teaStory.nameJa}</h3><p>{teaStory.intro}</p></div></details></div></div>
    </section>
  </div>;
}
