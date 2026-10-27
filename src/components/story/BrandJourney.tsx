"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLang } from '@/lib/langContext';
import { useReducedMotion } from '@/lib/motion';
import { DEFAULT_JOURNEY_INTRO, type BrandChapter, type JourneyIntro } from '@/lib/brandJourney';
import styles from './BrandJourney.module.css';

export default function BrandJourney({ chapters, intro = DEFAULT_JOURNEY_INTRO }: { chapters: BrandChapter[]; intro?: JourneyIntro }) {
  const { lang, localize } = useLang();
  const en = lang === 'en';
  const reduced = useReducedMotion();
  const [still, setStill] = useState(false);
  const [index, setIndex] = useState(0);
  const selected = chapters[index];
  const moving = !still && !reduced && selected?.motion !== false;

  if (!selected) return null;
  return <section id="story" className={styles.journey} data-motion={moving ? 'playing' : 'paused'} data-reduced={reduced} aria-labelledby="home-product-title">
    <div className={styles.stage}>
      <div className={styles.visual} id="brand-journey-art" role="img" aria-label={(en ? selected.altEn : selected.alt) ?? (en ? selected.nameEn : selected.name)}>
        {chapters.map((chapter, i) => <div className={styles.scene} key={chapter.id} data-scene={chapter.id} data-active={index === i} aria-hidden="true">
          {chapter.image && <Image className={styles.original} src={chapter.image} alt="" fill sizes="100vw" unoptimized={chapter.image.startsWith('http')} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />}
          <div className={styles.light} />
        </div>)}
      </div>
      <div className={`${styles.copyWrap} editorial-wrap`}>
        <div className={styles.copy}>
          <p className={styles.identity}>{en ? intro.identityEn : intro.identity}</p>
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
      <p className="eyebrow">{intro.label}</p>
      <h2>{en ? intro.titleEn : intro.title}</h2>
      <p>{en ? intro.bodyEn : intro.body}</p>
    </div>
  </section>;
}
