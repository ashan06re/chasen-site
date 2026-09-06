"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/lib/langContext";
import { onScrollFrame, useReducedMotion } from "@/lib/motion";
import { createStorySignal, cutState, STORY_SCROLL_SVH } from "@/lib/storyScript";
import { defaultExperience, type StoryScene } from '@/lib/experience';
import DepthPanel from '../DepthPanel';

const DepthCanvas = dynamic(() => import("./DepthCanvas"), { ssr: false });
const defaults=defaultExperience().scenes;
const subscribeMobile=(callback:()=>void)=>{const query=window.matchMedia('(max-width: 767px)');query.addEventListener('change',callback);return()=>query.removeEventListener('change',callback);};
const readMobile=()=>window.matchMedia('(max-width: 767px)').matches;

export default function Story({ scenes = defaults, compact = true }: { scenes?: StoryScene[]; compact?: boolean }) {
  const { lang } = useLang();
  const en = lang === "en";
  const reduce = useReducedMotion();
  const mobile=useSyncExternalStore(subscribeMobile,readMobile,()=>false);
  const frames=useMemo(()=>scenes.map(cut=>({src:cut.src,mobileSrc:cut.mobileSrc,depth:cut.depth,aspect:cut.aspect,motion:cut.motion})),[scenes]);
  const scrollLength=compact?420:STORY_SCROLL_SVH;
  const [still, setStill] = useState(false);
  const [active, setActive] = useState(0);
  const [signal] = useState(createStorySignal);
  const root = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const refresh = useRef(() => {});
  const flat = still || reduce;

  useEffect(() => {
    if (flat || mobile) return;
    const section = root.current;
    const viewport = sticky.current;
    if (!section || !viewport) return;
    let lastShown = 0;
    const update = () => {
      const travel = section.offsetHeight - viewport.offsetHeight;
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / Math.max(1, travel)));
      const state = cutState(progress, scenes.length);
      const preload = (i: number) => {
        const image = images.current[i];
        if (image && !image.getAttribute("src")) {
          if(scenes[i].mobileSrc) image.srcset = `${scenes[i].mobileSrc} 960w, ${scenes[i].src} 1536w`;
          image.src = scenes[i].src;
        }
      };
      preload(state.a); preload(state.b);
      if (state.b + 1 < scenes.length && state.t > .3) preload(state.b + 1);
      const ready = (i: number) => !!images.current[i]?.complete && !!images.current[i]?.naturalWidth;
      const first = ready(state.a) ? state.a : lastShown;
      const mix = ready(state.b) && ready(state.a) ? state.mix : 0;
      const shown = mix > .5 ? state.b : first;
      images.current.forEach((image, i) => {
        if (!image) return;
        image.style.opacity = String(i === first ? 1 : i === state.b ? mix : 0);
        image.style.zIndex = i === state.b && mix > 0 ? "2" : "1";
      });
      lastShown = shown;
      setActive(shown);
      viewport.style.setProperty("--story-progress", String(progress));
      signal.set(progress);
    };
    refresh.current = update;
    const unsubscribe = onScrollFrame(update);
    const resize = new ResizeObserver(update);
    resize.observe(section); resize.observe(viewport);
    return () => { unsubscribe(); resize.disconnect(); refresh.current = () => {}; };
  }, [flat, mobile, signal, scenes]);

  function toggle() {
    setStill(value => !value);
    requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: "instant", block: "start" }));
  }

  if(mobile && !flat) return <section ref={root} id="story" className="mobile-painted-story" aria-label={en?'Chasen, an illustrated tea journey':'茶筅、背景画でめぐる物語'}>
    <div className="mobile-story-intro"><span>KYOTO · KODAIJI</span><a href="#stores">{en?'Shops & menu':'店舗・お品書き'} ↗</a></div>
    {scenes.map((cut,i)=><article key={cut.id} id={`scene-${cut.id}`} className="mobile-painted-scene">
      <div className="mobile-scene-art"><DepthPanel src={cut.mobileSrc||cut.src} depthSrc={cut.depth} alt={en?cut.altEn:cut.alt} motion={cut.motion} fit="contain" aspect={cut.aspect} priority={i===0} /></div>
      <div className="mobile-scene-caption"><p className="story-kicker">0{i+1}<span/>{cut.label}</p>{i===0?<h1>{en?cut.en:cut.ja}</h1>:<h2>{en?cut.en:cut.ja}</h2>}<p>{en?cut.detailEn:cut.detail}</p></div>
    </article>)}
    <div className="mobile-story-end"><button type="button" onClick={toggle}>{en?'Still view':'動きを抑えて見る'}</button><a href="#stores">{en?'Explore our shops':'この続きは、お店で。'} ↗</a></div>
  </section>;

  if (flat) return <section ref={root} id="story" className="painted-story-static">
    <div className="editorial-wrap story-static-heading"><p className="eyebrow">THE CHASEN STORY</p><h1>{en ? scenes[0].en : scenes[0].ja}</h1><div className="editorial-actions">{!reduce && <button type="button" onClick={toggle} className="editorial-text-link">{en ? "Resume the immersive story" : "立体の物語に戻る"} ↗</button>}<a className="editorial-text-link" href="#stores">{en ? "Explore our shops" : "店舗・お品書きへ"} ↓</a></div></div>
    <div className="story-static-grid editorial-wrap">{scenes.map((cut, i) => <figure key={cut.id}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Same responsive file as WebGL, no second optimizer download. */}
      <img src={cut.src} srcSet={cut.mobileSrc?`${cut.mobileSrc} 960w, ${cut.src} 1536w`:undefined} sizes="(max-width: 767px) 100vw, 50vw" width={1536} height={1024} alt={en ? cut.altEn : cut.alt} loading={i === 0 ? "eager" : "lazy"} />
      <figcaption><span>0{i + 1} / {cut.label}</span><p>{en ? cut.en : cut.ja}</p></figcaption>
    </figure>)}</div>
  </section>;

  return <section ref={root} id="story" className="painted-story" aria-label={en ? "Chasen, an illustrated scroll story" : "茶筅、背景画でめぐる物語"} style={{ height: `${scrollLength}svh` }}>
    {scenes.map((cut, i) => <span key={cut.id} id={`scene-${cut.id}`} className="story-anchor" style={{ top: `${(i === 0 ? 0 : (i + .12) / scenes.length) * (scrollLength - 100)}svh` }} />)}
    <div ref={sticky} className="painted-story-viewport">
      <div className="painted-story-images" aria-hidden="true">{scenes.map((cut, i) =>
        /* eslint-disable-next-line @next/next/no-img-element -- HTML first paint and context-loss fallback share WebGL image URLs. */
        <img key={cut.id} ref={element => { images.current[i] = element; }} src={i < 2 ? cut.src : undefined} srcSet={i < 2 && cut.mobileSrc ? `${cut.mobileSrc} 960w, ${cut.src} 1536w` : undefined} sizes="100vw" alt="" width={1536} height={1024} fetchPriority={i === 0 ? "high" : "auto"} onLoad={() => refresh.current()} style={{ opacity: i === 0 ? 1 : 0 }} />
      )}</div>
      <DepthCanvas frames={frames} signal={signal} fit="contain" />
      <div className="painted-story-shade" aria-hidden="true" />
      <div className="story-location"><span>KYOTO · KODAIJI</span><span>{en ? "AN ILLUSTRATED TEA JOURNEY" : "一杯をめぐる、小さな旅。"}</span></div>
      <div className="story-caption-stack">{scenes.map((cut, i) => <div key={cut.id} className="story-caption" data-active={active === i} aria-hidden={active !== i}>
        <p className="story-kicker">0{i + 1}<span />{cut.label}</p>
        {i === 0 ? <h1>{en ? cut.en : cut.ja}</h1> : <h2>{en ? cut.en : cut.ja}</h2>}
        <p className="story-detail">{en ? cut.detailEn : cut.detail}</p>
      </div>)}</div>
      <div className="story-controls">
        <nav aria-label={en ? "Story scenes" : "物語の場面"} className="story-chapters">{scenes.map((cut, i) => <a key={cut.id} href={`#scene-${cut.id}`} aria-label={`${i + 1}. ${en ? cut.en : cut.ja}`} aria-current={active === i ? "step" : undefined}><span className="story-chapter-line" /><span>0{i + 1}</span></a>)}</nav>
        <div className="story-shortcuts"><button type="button" onClick={toggle}>{en ? "Still view" : "動きを抑えて見る"}</button><a href="#stores">{en ? "Shops & menu" : "店舗・お品書き"}<span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="story-progress-track" aria-hidden="true"><span /></div>
    </div>
  </section>;
}
