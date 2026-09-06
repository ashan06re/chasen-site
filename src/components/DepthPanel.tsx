"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { onScrollFrame, useReducedMotion, viewportProgress } from "@/lib/motion";
import { createStorySignal } from "@/lib/storyScript";

const DepthCanvas = dynamic(() => import("./story/DepthCanvas"), { ssr: false });

export default function DepthPanel({ src, depthSrc, alt, className = "" }: { src: string; depthSrc: string; alt: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [signal] = useState(createStorySignal);
  const frames = useMemo(() => [{ src, depth: depthSrc, aspect: 1.5 }], [src, depthSrc]);
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
    <img src={src} alt={alt} width={1536} height={1024} loading="lazy" />
    {!reduce && <DepthCanvas frames={frames} signal={signal} />}
  </div>;
}
