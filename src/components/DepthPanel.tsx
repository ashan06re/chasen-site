"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { onScrollFrame, useReducedMotion, viewportProgress } from "@/lib/motion";
import { createStorySignal } from "@/lib/storyScript";

const DepthCanvas = dynamic(() => import("./story/DepthCanvas"), { ssr: false });

export default function DepthPanel({ src, mobileSrc, depthSrc, alt, className = "", motion = true, ambient = false, fit = 'cover', aspect = 1.5, priority = false }: { src: string; mobileSrc?: string; depthSrc?: string; alt: string; className?: string; motion?: boolean; ambient?: boolean; fit?: 'cover'|'contain'; aspect?: number; priority?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [signal] = useState(createStorySignal);
  const frames = useMemo(() => [{ src, mobileSrc, depth: depthSrc, aspect, motion }], [src, mobileSrc, depthSrc, aspect, motion]);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !motion || !root.current) return;
    return onScrollFrame(() => {
      if (!root.current) return;
      const progress = viewportProgress(root.current);
      signal.set((progress + 1) / 2);
      root.current.style.setProperty("--panel-travel", String(progress));
    });
  }, [reduce, motion, signal]);
  useEffect(() => {
    const element = root.current;
    if (!element || !ambient || !motion || reduce) return;
    let visible = false;
    const sync = () => { element.dataset.playing = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); element.dataset.playing = "false"; };
  }, [ambient, motion, reduce]);
  return <div ref={root} className={`depth-panel ${ambient && motion && !reduce ? 'depth-panel-ambient' : ''} ${className}`}>
    <div className="depth-panel-travel"><div className="depth-panel-art">
    {/* eslint-disable-next-line @next/next/no-img-element -- The same artwork is used by the progressive WebGL layer. */}
    <img src={src} srcSet={mobileSrc ? `${mobileSrc} 960w, ${src} 1536w` : undefined} sizes="(max-width: 767px) 100vw, 60vw" alt={alt} width={1536} height={1024} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} style={{objectFit:fit}} />
    {!reduce && motion && <DepthCanvas frames={frames} signal={signal} fit={fit} />}
    </div></div>
  </div>;
}
