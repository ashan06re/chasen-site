"use client";

import { useRef, useState } from "react";
import Story from "./Story";
import DepthCanvas from "./DepthCanvas";
import { createStorySignal } from "@/lib/storyScript";

const good = [{ src: "/story-art/01.webp", depth: "/story-art/01-depth.webp", aspect: 1.5 }];
const badImage = [{ ...good[0], src: "/__qa/missing-image.webp" }];
const badDepth = [{ ...good[0], depth: "/__qa/missing-depth.webp" }];

export default function DepthChecks() {
  const extension = useRef<WEBGL_lose_context | null>(null);
  const [mounted, setMounted] = useState(true);
  const [mode, setMode] = useState<"story" | "image" | "depth">("story");
  const [signal] = useState(createStorySignal);
  const lose = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas");
    extension.current = canvas?.getContext("webgl2")?.getExtension("WEBGL_lose_context") || null;
    extension.current?.loseContext();
  };
  return <main style={{ color: "#fff", background: "#161710" }}>
    <div data-lenis-prevent style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#161710", display: "flex", flexWrap: "wrap", gap: 16, padding: 12 }}>
      <button onClick={lose}>Simulate GPU loss</button>
      <button onClick={() => extension.current?.restoreContext()}>Restore GPU</button>
      <button onClick={() => setMounted(v => !v)}>Mount / unmount</button>
      <button onClick={() => setMode("image")}>Missing image</button>
      <button onClick={() => setMode("depth")}>Missing depth</button>
      <button onClick={() => setMode("story")}>Story mode</button>
    </div>
    {mounted && (mode === "story" ? <Story /> : <div style={{ position: "relative", height: "100svh" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Deliberate fault-injection fallback. */}
      <img src="/story-art/01.webp" alt="Fallback entrance remains visible" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <DepthCanvas frames={mode === "image" ? badImage : badDepth} signal={signal} />
    </div>)}
    <section id="stores" style={{ padding: 60 }}>Local QA only. Production returns 404.</section>
  </main>;
}
