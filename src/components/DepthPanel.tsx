"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { onScrollFrame, useReducedMotion, viewportProgress } from "@/lib/motion";
import { createStorySignal } from "@/lib/storyScript";

const DepthCanvas = dynamic(() => import("./story/DepthCanvas"), { ssr: false });

export default function DepthPanel({ src, depthSrc, alt, className = "", motion = true, fit = 'cover', aspect = 1.5, priority = false }: { src: string; depthSrc?: string; alt: string; className?: string; motion?: boolean; fit?: 'cover'|'contain'; aspect?: number; priority?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [signal] = useState(createStorySignal);
  const frames = useMemo(() => [{ src, depth: depthSrc, aspect, motion }], [src, depthSrc, aspect, motion]);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !root.current) return;
    return onScrollFrame(() => {
      if (!root.current) return;
      const progress = viewportProgress(root.current);
      signal.set((progress + 1) / 2);
      root.current.style.setProperty("--panel-travel", String(progress));
    });
  }, [reduce, signal]);
  return <div ref={root} className={`depth-panel ${className}`}>
    {/* eslint-disable-next-line @next/next/no-img-element -- The same artwork is used by the progressive WebGL layer. */}
    <img src={src} alt={alt} width={1536} height={1024} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} style={{objectFit:fit}} />
    {!reduce && motion && <DepthCanvas frames={frames} signal={signal} fit={fit} />}
  </div>;
}
