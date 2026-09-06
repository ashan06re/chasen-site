"use client";
import { useEffect, useRef, useState } from "react";
import { onScrollFrame, useReducedMotion, viewportProgress } from "@/lib/motion";

/**
 * 写真＋深度マップの小さな WebGL パネル
 *
 * 店舗パネルのように「写真そのものが立体になる」ところに使う。
 * マウス（デスクトップ）とスクロールで、手前の物ほど大きく動く。
 * three.js は動的 import。WebGL が無い・reduced-motion のときは <img> のまま。
 */
interface Props {
  src: string;
  depthSrc: string;
  alt: string;
  className?: string;
  /** 視差の強さ */
  amount?: number;
}

const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uImg; uniform sampler2D uDep; uniform vec2 uCover; uniform vec2 uShift; uniform float uAmt;
  varying vec2 vUv;
  void main(){
    vec2 uv = (vUv - 0.5) * uCover * 0.90 + 0.5;
    float d = texture2D(uDep, uv).r - 0.45;
    vec2 off = uShift * d * uAmt;
    vec3 c = texture2D(uImg, clamp(uv + off, 0.002, 0.998)).rgb;
    gl_FragColor = vec4(c, 1.0);
  }`;

export default function DepthPanel({ src, depthSrc, alt, className = "", amount = 0.015 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const textures = new Set<{ dispose: () => void }>();
    const lost = (event: Event) => { event.preventDefault(); setVisible(false); };
    canvas.addEventListener("webglcontextlost", lost);
    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
      } catch { return; }
      const loader = new THREE.TextureLoader();
      type Tex = InstanceType<typeof THREE.Texture>;
      const load = (s: string) => new Promise<Tex>((res, rej) => loader.load(s, (t) => { if (disposed) { t.dispose(); rej(new Error("Disposed")); return; } textures.add(t); t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; res(t); }, undefined, rej));
      let img: Tex, dep: Tex;
      try { [img, dep] = await Promise.all([load(src), load(depthSrc)]); } catch { renderer.dispose(); return; }
      if (disposed) { renderer.dispose(); return; }
      const uniforms = { uImg: { value: img }, uDep: { value: dep }, uCover: { value: new THREE.Vector2(1, 1) }, uShift: { value: new THREE.Vector2(0, 0) }, uAmt: { value: amount } };
      const scene = new THREE.Scene(); const camera = new THREE.Camera();
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }));
      scene.add(mesh);
      const im = img.image as { width: number; height: number };
      const aspect = im.width / im.height;
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas; if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2)); renderer.setSize(w, h, false);
        const va = w / h; if (va > aspect) uniforms.uCover.value.set(1, aspect / va); else uniforms.uCover.value.set(va / aspect, 1);
      };
      resize(); window.addEventListener("resize", resize);
      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = -(((e.clientY - r.top) / r.height - 0.5) * 2);
      };
      const onLeave = () => { target.x = 0; target.y = 0; };
      canvas.addEventListener("pointermove", onMove, { passive: true });
      canvas.addEventListener("pointerleave", onLeave);
      let scrollShift = 0;
      const unsub = onScrollFrame(() => { scrollShift = viewportProgress(canvas) * 0.9; });
      let onScreen = false;
      const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { rootMargin: "10% 0px" });
      io.observe(canvas);
      let frame = 0;
      let lastRender = "";
      const tick = () => {
        frame = requestAnimationFrame(tick); if (!onScreen || document.hidden) return;
        const s = uniforms.uShift.value;
        s.x += (target.x - s.x) * 0.05; s.y += (target.y - scrollShift - s.y) * 0.05;
        const renderKey = `${s.x.toFixed(4)}:${s.y.toFixed(4)}:${canvas.width}:${canvas.height}`;
        if (renderKey !== lastRender) { renderer.render(scene, camera); lastRender = renderKey; }
      };
      tick(); setVisible(true);
      cleanup = () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerleave", onLeave); unsub(); io.disconnect(); mesh.geometry.dispose(); (mesh.material as { dispose: () => void }).dispose(); img.dispose(); dep.dispose(); renderer.dispose(); };
    })().catch(() => { if (!disposed) setVisible(false); });
    return () => { disposed = true; canvas.removeEventListener("webglcontextlost", lost); cleanup?.(); textures.forEach((t) => t.dispose()); };
  }, [src, depthSrc, amount, reduce]);

  return (
    <div className={`overflow-hidden ${className || "relative"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- WebGL のフォールバック兼 初期表示 */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full transition-opacity duration-700" style={{ opacity: visible && !reduce ? 1 : 0 }} />
    </div>
  );
}
