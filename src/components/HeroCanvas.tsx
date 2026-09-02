"use client";
import { useEffect, useRef, useState } from "react";

/**
 * ヒーローの2.5Dパララックス（WebGL）
 *
 * 写真と深度マップ（public/hero-kyoto-depth.jpg）を重ね、
 * 深度に応じてピクセルの動く量を変えることで、1枚の写真に奥行きを作る。
 * 手前の松や瓦は大きく、奥の空や山はほとんど動かない。
 *
 * three.js は初期バンドルに入れず、マウント後に動的importする。
 * それまでは HeroSection 側の <Image> がそのまま見えている（LCPを損なわない）。
 * WebGLが使えない環境・prefers-reduced-motion では何も描かず、静止画のままにする。
 */

interface Props {
  imageSrc: string;
  depthSrc: string;
  /** 準備が整ってフェードインしたときに通知する */
  onReady?: () => void;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform vec2  uCover;    // object-cover 相当のUVスケール
  uniform vec2  uPointer;  // -1〜1（スムージング済み）
  uniform float uScroll;   // 0〜1
  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // object-cover と同じ見え方になるようUVを補正し、視差で端が出ないよう少し内側を使う
    vec2 uv = (vUv - 0.5) * uCover * 0.94 + 0.5;

    float depth = texture2D(uDepth, uv).r - 0.45;

    // 常時ゆっくり漂う成分（マウスを触らなくても生きている画面にする）
    vec2 drift = vec2(sin(uTime * 0.07) * 0.5, cos(uTime * 0.052) * 0.35);

    vec2 offset = (uPointer + drift) * depth * 0.030;
    offset.y += uScroll * 0.085 * (0.45 + depth);

    vec2 sampleUv = clamp(uv + offset, 0.001, 0.999);
    vec3 color = texture2D(uImage, sampleUv).rgb;

    // 奥ほどわずかに霞ませ、空気遠近を強調する
    float haze = smoothstep(0.55, -0.35, depth);
    color = mix(color, vec3(0.80, 0.82, 0.80), haze * 0.10);

    // フィルムグレイン（バンディング防止も兼ねる）
    float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.016;

    gl_FragColor = vec4(color, uOpacity);
  }
`;

export default function HeroCanvas({ imageSrc, depthSrc, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
      } catch {
        return; // WebGL非対応 → 静止画のまま
      }

      const loader = new THREE.TextureLoader();
      const load = (src: string) =>
        new Promise<InstanceType<typeof THREE.Texture>>((resolve, reject) =>
          loader.load(src, resolve, undefined, reject)
        );

      let image: Awaited<ReturnType<typeof load>>;
      let depth: Awaited<ReturnType<typeof load>>;
      try {
        [image, depth] = await Promise.all([load(imageSrc), load(depthSrc)]);
      } catch {
        renderer.dispose();
        return;
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      image.colorSpace = THREE.SRGBColorSpace;
      for (const t of [image, depth]) {
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
      }

      const uniforms = {
        uImage:   { value: image },
        uDepth:   { value: depth },
        uCover:   { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uScroll:  { value: 0 },
        uTime:    { value: 0 },
        uOpacity: { value: 1 },
      };

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms,
          transparent: true,
        })
      );
      scene.add(mesh);

      const source = image.image as { width: number; height: number };
      const imageAspect = source.width / source.height;

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h, false);

        // CSS の object-cover と同じ切り取りになるようUVを縮める
        const viewAspect = w / h;
        if (viewAspect > imageAspect) {
          uniforms.uCover.value.set(1, imageAspect / viewAspect);
        } else {
          uniforms.uCover.value.set(viewAspect / imageAspect, 1);
        }
      };
      resize();
      window.addEventListener("resize", resize);

      // マウスは目標値へ緩やかに追従させる（カクつきと過敏な動きを防ぐ）
      const target = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      // 画面外に出たら描画を止める（電池とCPUのため）
      let onScreen = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      observer.observe(canvas);

      const clock = new THREE.Clock();
      let frame = 0;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!onScreen) return;

        const p = uniforms.uPointer.value;
        p.x += (target.x - p.x) * 0.045;
        p.y += (target.y - p.y) * 0.045;

        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uScroll.value = Math.min(window.scrollY / 900, 1);

        renderer.render(scene, camera);
      };
      tick();

      setVisible(true);
      onReady?.();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        observer.disconnect();
        mesh.geometry.dispose();
        (mesh.material as { dispose: () => void }).dispose();
        image.dispose();
        depth.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [imageSrc, depthSrc, onReady]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
