"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/langContext";
import { useReducedMotion } from "@/lib/motion";
import { defaultExperience, type StoryScene } from "@/lib/experience";
import DepthPanel from "../DepthPanel";

const defaults = defaultExperience().scenes;
const sceneNames: Record<string, { ja: string; en: string }> = {
  "01": { ja: "高台寺", en: "Kodaiji" },
  "02": { ja: "お茶", en: "Tea" },
  "03": { ja: "窓辺", en: "Window" },
  "04": { ja: "茶畑", en: "Tea garden" },
  "05": { ja: "玉手箱", en: "Tamatebako" },
};

/** The product is visible immediately; exploring the story never consumes page scroll. */
export default function Story({ scenes = defaults, compact = true }: { scenes?: StoryScene[]; compact?: boolean }) {
  const { lang, localize } = useLang();
  const en = lang === "en";
  const reduce = useReducedMotion();
  const [still, setStill] = useState(false);
  const [selectedId, setSelectedId] = useState("05");
  const ordered = useMemo(() => {
    const available = scenes.length ? scenes : defaults;
    const treasure = available.find(scene => scene.id === "05");
    return treasure ? [treasure, ...available.filter(scene => scene !== treasure)] : available;
  }, [scenes]);
  const selected = ordered.find(scene => scene.id === selectedId) ?? ordered[0];
  const name = (scene: StoryScene) => sceneNames[scene.id]?.[en ? "en" : "ja"] ?? scene.label;

  return <section id="story" className="product-story" data-compact={compact} aria-labelledby="home-product-title">
    <div className="product-story-layout editorial-wrap">
      <div className="product-story-copy">
        <p className="eyebrow">KYOTO · KUMAMOTO</p>
        <h1 id="home-product-title">{en ? <>Matcha &amp;<br />Tamatebako sweets.</> : <>抹茶と、<br /><span className="product-story-name">玉手箱スイーツ。</span></>}</h1>
        <p className="product-story-description">{en ? "A wooden box filled with matcha sweets. A little time to savour, in Kyoto and Kumamoto." : "白木の箱に、抹茶の甘味を盛り合わせて。京都と熊本で、心ほどけるひとときを。"}</p>
        <p className="product-story-visit">{en ? "Enjoy Tamatebako without an advance reservation." : "玉手箱は、ご予約なしでお楽しみいただけます。"}</p>
        <div className="product-story-actions">
          <a className="editorial-button" href="#stores">{en ? "Shops & menus" : "店舗・お品書き"}<span aria-hidden="true">↓</span></a>
          <Link className="editorial-text-link" href={localize("/reserve")}>{en ? "Table bookings" : "お席の予約案内"}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="product-story-gallery">
        <figure>
          <div className="product-story-art" id="home-story-art" role="group" aria-label={name(selected)}>
            <DepthPanel key={selected.id + selected.src} src={selected.src} mobileSrc={selected.mobileSrc}
              // A rigid product must not bend along an estimated depth map.
              depthSrc={selected.id === "05" ? undefined : selected.depth}
              alt={en ? selected.altEn : selected.alt} aspect={selected.aspect}
              motion={!still && selected.motion} fit="contain" priority />
          </div>
          <figcaption className="product-story-caption" aria-live="polite" aria-atomic="true">
            <span>{name(selected)}</span><p>{en ? selected.detailEn : selected.detail}</p>
          </figcaption>
        </figure>
        <nav className="product-story-scenes" aria-label={en ? "Explore Chasen scenes" : "茶筅の風景を見る"}>
          {ordered.map(scene => <button key={scene.id} id={`scene-${scene.id}`} type="button"
            aria-pressed={selected.id === scene.id} aria-controls="home-story-art"
            onClick={() => setSelectedId(scene.id)}>{name(scene)}</button>)}
        </nav>
        {!reduce && <button className="product-story-motion" type="button" aria-pressed={still} onClick={() => setStill(value => !value)}>
          {en ? (still ? "Restore gentle motion" : "Pause motion") : (still ? "動きを戻す" : "動きを止める")}
        </button>}
      </div>
    </div>
  </section>;
}
