"use client";

import { useEffect, useRef } from "react";
import { cutState, type StorySignal } from "@/lib/storyScript";
import { depthFit } from '@/lib/depthFit';

export interface DepthFrame { src: string; mobileSrc?: string; depth?: string; aspect: number; motion?: boolean }
interface Props { frames: readonly DepthFrame[]; signal: StorySignal; className?: string; fit?: 'cover' | 'contain' }

const vertexShader = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D imageA, imageB, depthA, depthB;
  uniform vec2 coverA, coverB, pointer;
  uniform float phaseA, phaseB, blend, strength;
  vec3 layer(sampler2D colorMap, sampler2D depthMap, vec2 cover, float t) {
    // Overscan contains the edges. A small iterative parallax lookup preserves
    // perspective without the large rubber-sheet deformation of the old scene.
    vec2 base = (vUv - .5) * cover * (1.0 - .009 * t * strength) + .5;
    if (base.x < 0.0 || base.x > 1.0 || base.y < 0.0 || base.y > 1.0) return vec3(.043,.047,.039);
    vec2 camera = vec2(pointer.x * .008 + (t - .5) * .005,
                       pointer.y * .006 - (t - .5) * .010) * strength;
    vec2 uv = base;
    for (int i = 0; i < 3; i++) {
      float depth = texture2D(depthMap, uv).r - .45;
      uv = base + camera * depth;
    }
    return texture2D(colorMap, clamp(uv, .001, .999)).rgb;
  }
  void main() {
    vec3 a = layer(imageA, depthA, coverA, phaseA);
    vec3 b = layer(imageB, depthB, coverB, phaseB);
    // A quiet cross-dissolve: no black dip or particle effect between paintings.
    gl_FragColor = vec4(mix(a, b, blend), 1.0);
  }
`;

/** Progressive enhancement only: the HTML painting always remains underneath. */
export default function DepthCanvas({ frames, signal, className = "", fit = 'cover' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let running = false;
    let inView = false;
    let cleanup = () => {};
    let wake = () => {};
    const hide = () => { canvas.style.opacity = "0"; canvas.dataset.renderer = "fallback"; };
    const lost = (event: Event) => { event.preventDefault(); hide(); };
    canvas.addEventListener("webglcontextlost", lost);
    const restore = () => wake();
    canvas.addEventListener("webglcontextrestored", restore);

    async function start() {
      if (running || disposed) return;
      running = true;
      const THREE = await import("three");
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: false, alpha: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const textures = new Set<InstanceType<typeof THREE.Texture>>();
      const cache = new Map<number, { image: InstanceType<typeof THREE.Texture>; depth: InstanceType<typeof THREE.Texture> }>();
      const pending = new Set<number>();
      const failed = new Set<number>();
      const loader = new THREE.TextureLoader();
      let raf = 0;
      const target = new THREE.Vector2();
      const pointer = new THREE.Vector2();
      const uniforms = {
        imageA: { value: null as InstanceType<typeof THREE.Texture> | null }, imageB: { value: null as InstanceType<typeof THREE.Texture> | null },
        depthA: { value: null as InstanceType<typeof THREE.Texture> | null }, depthB: { value: null as InstanceType<typeof THREE.Texture> | null },
        coverA: { value: new THREE.Vector2(1, 1) }, coverB: { value: new THREE.Vector2(1, 1) }, pointer: { value: pointer },
        phaseA: { value: 0 }, phaseB: { value: 0 }, blend: { value: 0 }, strength: { value: 1 },
      };
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false });
      const scene = new THREE.Scene();
      scene.add(new THREE.Mesh(geometry, material));
      const camera = new THREE.Camera();
      const load = (url: string) => new Promise<InstanceType<typeof THREE.Texture>>((resolve, reject) => {
        loader.load(url, texture => {
          if (disposed) { texture.dispose(); reject(new Error("disposed")); return; }
          texture.colorSpace = THREE.NoColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          textures.add(texture);
          resolve(texture);
        }, undefined, reject);
      });
      const request = (index: number) => {
        if (index < 0 || index >= frames.length || cache.has(index) || pending.has(index) || failed.has(index)) return;
        pending.add(index);
        const frame = frames[index];
        const src = window.innerWidth < 768 ? frame.mobileSrc || frame.src : frame.src;
        const neutral = () => {
          const texture = new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);
          texture.needsUpdate=true; textures.add(texture); return texture;
        };
        void Promise.allSettled([load(src), frame.depth ? load(frame.depth) : Promise.resolve(neutral())]).then(results => {
          pending.delete(index);
          if (disposed) return;
          const [image, depth] = results;
          if (image.status === "fulfilled" && depth.status === "fulfilled") cache.set(index, { image: image.value, depth: depth.value });
          else {
            failed.add(index);
            for (const result of results) if (result.status === "fulfilled") { result.value.dispose(); textures.delete(result.value); }
          }
          wake();
        });
      };
      const cover = (value: InstanceType<typeof THREE.Vector2>, aspect: number) => {
        const viewport = canvas!.clientWidth / Math.max(1, canvas!.clientHeight);
        value.set(...depthFit(viewport, aspect, fit));
      };
      function render() {
        raf = 0;
        if (disposed || !inView || document.hidden || renderer.getContext().isContextLost()) return;
        const { a, b, t, mix } = cutState(signal.read(), frames.length);
        request(a); request(b);
        if (t > .4) request(b + 1);
        if (t < .3) request(a - 1);
        const first = cache.get(a);
        const next = cache.get(b);
        if (!first || (mix > 0 && !next)) { hide(); return; }
        const second = next || first;
        uniforms.imageA.value = first.image; uniforms.depthA.value = first.depth;
        uniforms.imageB.value = second.image; uniforms.depthB.value = second.depth;
        uniforms.phaseA.value = t; uniforms.phaseB.value = 0;
        uniforms.blend.value = mix;
        const aspectOf = (texture: InstanceType<typeof THREE.Texture>, fallback: number) => {
          const size = texture.image as { width?: number; height?: number };
          return size?.width && size?.height ? size.width / size.height : fallback;
        };
        cover(uniforms.coverA.value, aspectOf(first.image, frames[a].aspect));
        cover(uniforms.coverB.value, aspectOf(second.image, frames[b].aspect));
        pointer.lerp(target, .14);
        uniforms.strength.value = frames[a].motion === false ? 0 : window.innerWidth < 768 ? .7 : 1;
        renderer.render(scene, camera);
        canvas!.style.opacity = "1";
        canvas!.dataset.renderer = "webgl";
        canvas!.dataset.frame = String(mix > .5 ? b + 1 : a + 1);
        // Bound decoded GPU memory even after traversing the entire story.
        for (const [index, pair] of cache) if (Math.abs(index - a) > 2) {
          pair.image.dispose(); pair.depth.dispose(); textures.delete(pair.image); textures.delete(pair.depth); cache.delete(index);
        }
        if (pointer.distanceTo(target) > .001) wake();
      }
      wake = () => { if (!disposed && inView && !document.hidden && !raf) raf = requestAnimationFrame(render); };
      const resize = () => {
        if (disposed || !canvas!.clientWidth || !canvas!.clientHeight) return;
        renderer.setSize(canvas!.clientWidth, canvas!.clientHeight, false);
        wake();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas!);
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const r = canvas!.getBoundingClientRect();
        target.set(Math.max(-1, Math.min(1, (event.clientX - r.left) / r.width * 2 - 1)), Math.max(-1, Math.min(1, 1 - (event.clientY - r.top) / r.height * 2)));
        wake();
      };
      const leave = () => { target.set(0, 0); wake(); };
      // The story's readable HTML overlay must not block pointer tracking.
      const parent = canvas!.parentElement!;
      parent.addEventListener("pointermove", move, { passive: true });
      parent.addEventListener("pointerleave", leave);
      document.addEventListener("visibilitychange", wake);
      const unsubscribe = signal.subscribe(wake);
      cleanup = () => {
        cancelAnimationFrame(raf); unsubscribe(); ro.disconnect();
        parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave);
        document.removeEventListener("visibilitychange", wake);
        textures.forEach(texture => texture.dispose()); cache.clear(); geometry.dispose(); material.dispose(); renderer.dispose();
      };
      resize(); wake();
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) { void start().catch(hide); wake(); }
    }, { rootMargin: "150px 0px" });
    observer.observe(canvas);
    return () => {
      disposed = true; observer.disconnect(); cleanup();
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restore);
    };
  }, [frames, signal, fit]);
  return <canvas ref={ref} aria-hidden="true" data-renderer="fallback" data-fit={fit} className={`depth-canvas ${className}`} />;
}
