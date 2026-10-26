"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/langContext';
import { useReducedMotion } from '@/lib/motion';
import type { BrandChapter } from '@/lib/brandJourney';
import styles from './BrandJourney.module.css';

const imageDescriptions: Record<string, { ja: string; en: string }> = {
  tamatebako: { ja: '木箱に盛り合わせた抹茶の甘味と京都の夕景', en: 'Matcha sweets in a wooden box against an evening Kyoto view' },
  sweets: { ja: 'ガラスの器に盛った抹茶のかき氷', en: 'Matcha shaved ice in a glass bowl' },
  cuisine: { ja: '木の器に盛った肉料理', en: 'A meat and rice dish in a wooden vessel' },
  origin: { ja: '黒い覆いの下に広がる宇治の茶園', en: 'Uji tea rows beneath a shade canopy' },
  space: { ja: '高台寺店の木のカウンターと青緑の椅子', en: 'The Kodaiji interior with a wooden counter and teal chairs' },
};

export default function BrandJourney({ chapters }: { chapters: BrandChapter[] }) {
  const { lang, localize } = useLang();
  const en = lang === 'en';
  const reduced = useReducedMotion();
  const [still, setStill] = useState(false);
  const [index, setIndex] = useState(0);
  const selected = chapters[index];
  const moving = !still && !reduced;

  if (!selected) return null;
  return <section id="story" className={styles.journey} data-motion={moving ? 'playing' : 'paused'} data-reduced={reduced} aria-labelledby="home-product-title">
    <div className={styles.stage}>
      <div className={styles.visual} id="brand-journey-art" role="img" aria-label={imageDescriptions[selected.id]?.[en ? 'en' : 'ja'] ?? (en ? selected.nameEn : selected.name)}>
        {chapters.map((chapter, i) => <div className={styles.scene} key={chapter.id} data-scene={chapter.id} data-active={index === i} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- Local review displays the untouched source image. */}
          {chapter.image && <img className={styles.original} src={chapter.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />}
          <div className={styles.light} />
        </div>)}
      </div>
      <div className={`${styles.copyWrap} editorial-wrap`}>
        <div className={styles.copy}>
          <p className={styles.identity}>{en ? 'CHASEN / MATCHA SWEETS & DINING' : '抹茶スイーツと料理を楽しむ、京都・熊本の茶筅。'}</p>
          <div key={selected.id} className={styles.copyEntrance}>
            <p className="eyebrow">{selected.label}</p>
            <h1 id="home-product-title">{en ? selected.titleEn : selected.title}</h1>
            <p className={styles.description}>{en ? selected.bodyEn : selected.body}</p>
          </div>
          <div className={styles.actions}>
            <a className="editorial-button" href="#stores">{en ? 'Shops & menus' : '店舗・お品書き'}<span aria-hidden="true">↓</span></a>
            <Link className="editorial-text-link" href={localize('/reserve')}>{en ? 'Table bookings' : 'お席の予約案内'} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </div>
    <div className={`${styles.controls} editorial-wrap`}>
      <div className={styles.caption} aria-live="polite" aria-atomic="true"><span>{String(index + 1).padStart(2, '0')} / 05</span><p>{en ? selected.captionEn : selected.caption}</p></div>
      <nav className={styles.chapters} aria-label={en ? 'Discover Chasen' : '茶筅の楽しみを選ぶ'}>
        {chapters.map((chapter, i) => <button key={chapter.id} id={`chapter-${chapter.id}`} aria-pressed={index === i} aria-controls="brand-journey-art" type="button" onClick={() => setIndex(i)}>
          <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span><span>{en ? chapter.nameEn : chapter.name}</span>
        </button>)}
      </nav>
      <div className={styles.transport}>
        <p>{en ? 'Discover freely. Scroll on whenever you like.' : '気になる楽しみから、茶筅へ。'}</p>
        <div>
          {!reduced && <button type="button" aria-pressed={still} onClick={() => setStill(!still)}>{en ? (still ? 'Resume motion' : 'Pause motion') : (still ? '動きを戻す' : '動きを止める')}</button>}
          <button type="button" aria-label={en ? 'Previous scene' : '前の場面'} onClick={() => setIndex((index + chapters.length - 1) % chapters.length)}>←</button>
          <button type="button" aria-label={en ? 'Next scene' : '次の場面'} onClick={() => setIndex((index + 1) % chapters.length)}>→</button>
        </div>
      </div>
    </div>
    <div className={`${styles.invitation} editorial-wrap`}>
      <p className="eyebrow">MATCHA, FOOD & A LITTLE WONDER</p>
      <h2>{en ? <>For the meal.<br />For the matcha.<br />For the moment.</> : "お料理を楽しみ、\n抹茶にときめく。\nそんな一日を、茶筅で。"}</h2>
      <p>{en ? 'The tea of Uji, the pleasure of sweets, and time well spent.' : '宇治のお茶の香りも、甘味の楽しみも。\nひとつの場所で、ゆっくり味わう。'}</p>
    </div>
  </section>;
}
