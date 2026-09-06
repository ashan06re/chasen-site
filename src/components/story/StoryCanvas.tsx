"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { CUTS, cutState, type CutState } from "@/lib/storyScript";

/**
 * 物語の写真を描く WebGL 層
 *
 * 1枚の平面に「今のコマ」と「次のコマ」の写真と深度マップを渡し、
 * スクロールに合わせて 寄り（ゆっくり近づく）・視差（深度で動く量を変える）・溶け（次のコマへ）を
 * シェーダで作る。写真は生成した静止画、深度は Depth Anything で推定したもの。
 *
 * three.js はマウント後に動的import。準備できるまでは Story.tsx 側の <img> が見えている。
 * WebGL が無ければ onFail を呼んで、CSS のフォールバックに任せる。
 */

interface Props {
  progress: RefObject<number>;
  onReady?: () => void;
  onFail?: () => void;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uImgA; uniform sampler2D uDepA; uniform vec2 uCoverA; uniform float uTA;
  uniform sampler2D uImgB; uniform sampler2D uDepB; uniform vec2 uCoverB; uniform float uTB;
  uniform float uMix;
  uniform vec2  uPointer;
  uniform float uTime;
  uniform float uMobile;
  varying vec2 vUv;

  // 1コマぶん: 寄り＋視差
  vec3 layer(sampler2D img, sampler2D dep, vec2 cover, float t, float lead) {
    // ゆっくり寄る（コマの終わりで 6% 大きく）。次のコマは少し引いた所から始まる
    float zoom = 1.0 / (1.0 + 0.06 * t - 0.02 * lead);
    vec2 uv = (vUv - 0.5) * cover * 0.92 * zoom + 0.5;

    float d = texture2D(dep, uv).r - 0.45;   // 手前 +, 奥 -

    // 常時ゆっくり漂う成分。マウスは目標へ追従済み
    vec2 drift = vec2(sin(uTime * 0.06) * 0.5, cos(uTime * 0.047) * 0.35);
    vec2 off = (uPointer * (1.0 - uMobile) + drift) * d * 0.022;
    // スクロールで奥と手前が逆向きに流れる（カメラが寄る時の視差）
    off.y += (t - 0.5) * d * 0.028;
    off.x += (t - 0.5) * d * 0.010;

    vec2 s = clamp(uv + off, 0.002, 0.998);
    return texture2D(img, s).rgb;
  }

  void main() {
    vec3 a = layer(uImgA, uDepA, uCoverA, uTA, 0.0);
    vec3 col = a;
    if (uMix > 0.001) {
      vec3 b = layer(uImgB, uDepB, uCoverB, uTB, 1.0 - uMix);
      // 溶ける時は一度わずかに暗くなる（実写のディゾルブに近い）
      float dip = 1.0 - 0.10 * sin(uMix * 3.14159);
      col = mix(a, b, uMix) * dip;
    }
    // 微かな粒子（バンディング防止も兼ねる）
    float g = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.014;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function StoryCanvas({ progress, onReady, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
      } catch {
        onFail?.();
        return;
      }

      const mobile = window.innerWidth < 768;
      const suffix = mobile ? "-m" : "";
      const loader = new THREE.TextureLoader();
      type Tex = InstanceType<typeof THREE.Texture>;
      // 写真は色空間を付けずに読む。付けると GPU が線形に戻し、ShaderMaterial の出力では
      // sRGB に戻されないので暗く沈む（この平面は加工せずそのまま出したい）
      const prep = (t: Tex, color: boolean) => {
        if (color) t.colorSpace = THREE.NoColorSpace;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        return t;
      };
      const load = (src: string, color: boolean) =>
        new Promise<Tex>((resolve, reject) => loader.load(src, (t) => resolve(prep(t, color)), undefined, reject));

      // コマごとの写真と深度。今と次と、その次だけ読んでおく
      const cache = new Map<number, Promise<{ img: Tex; dep: Tex }>>();
      const get = (i: number) => {
        let p = cache.get(i);
        if (!p) {
          const id = CUTS[i].id;
          p = Promise.all([load(`/story/${id}${suffix}.webp`, true), load(`/story/${id}-depth.webp`, false)]).then(
            ([img, dep]) => ({ img, dep }),
          );
          cache.set(i, p);
        }
        return p;
      };

      let first: { img: Tex; dep: Tex };
      try {
        first = await get(0);
        void get(1);
      } catch {
        renderer.dispose();
        onFail?.();
        return;
      }
      if (disposed) { renderer.dispose(); return; }

      const uniforms = {
        uImgA: { value: first.img }, uDepA: { value: first.dep }, uCoverA: { value: new THREE.Vector2(1, 1) }, uTA: { value: 0 },
        uImgB: { value: first.img }, uDepB: { value: first.dep }, uCoverB: { value: new THREE.Vector2(1, 1) }, uTB: { value: 0 },
        uMix: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uMobile: { value: mobile ? 1 : 0 },
      };
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
      );
      scene.add(mesh);

      let viewAspect = 1;
      const cover = (aspect: number, out: InstanceType<typeof THREE.Vector2>) => {
        if (viewAspect > aspect) out.set(1, aspect / viewAspect);
        else out.set(viewAspect / aspect, 1);
      };
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
        renderer.setSize(w, h, false);
        viewAspect = w / h;
        cover(CUTS[stateNow.a].aspect, uniforms.uCoverA.value);
        cover(CUTS[stateNow.b].aspect, uniforms.uCoverB.value);
      };

      const target = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      let onScreen = true;
      const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0 });
      observer.observe(canvas);

      const stateNow: CutState = { a: 0, b: 0, mix: 0, ta: 0, tb: 0 };
      let shownA = 0, shownB = 0;
      let smoothed = 0;
      const clock = new THREE.Clock();
      let frame = 0;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!onScreen) return;
        const dt = Math.min(0.05, clock.getDelta());
        uniforms.uTime.value = clock.elapsedTime;

        // スクロールの段差を1フレームぶんならす
        const p = progress.current ?? 0;
        smoothed += (p - smoothed) * Math.min(1, dt * 10);
        cutState(smoothed, stateNow);

        // 表示するコマが変わったらテクスチャを差し替える（読めていなければ前のまま）
        if (stateNow.a !== shownA) {
          const i = stateNow.a;
          get(i).then((t) => { if (stateNow.a === i) { uniforms.uImgA.value = t.img; uniforms.uDepA.value = t.dep; shownA = i; cover(CUTS[i].aspect, uniforms.uCoverA.value); } });
        }
        if (stateNow.b !== shownB) {
          const i = stateNow.b;
          get(i).then((t) => { if (stateNow.b === i) { uniforms.uImgB.value = t.img; uniforms.uDepB.value = t.dep; shownB = i; cover(CUTS[i].aspect, uniforms.uCoverB.value); } });
          void get(Math.min(CUTS.length - 1, i + 1));
        }
        uniforms.uTA.value = stateNow.ta;
        uniforms.uTB.value = stateNow.tb;
        uniforms.uMix.value = shownB === stateNow.b ? stateNow.mix : 0;

        const pt = uniforms.uPointer.value;
        pt.x += (target.x - pt.x) * 0.04;
        pt.y += (target.y - pt.y) * 0.04;

        renderer.render(scene, camera);
      };

      resize();
      window.addEventListener("resize", resize);
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
        cache.forEach((p) => p.then((t) => { t.img.dispose(); t.dep.dispose(); }).catch(() => {}));
        renderer.dispose();
      };
    })();

    return () => { disposed = true; cleanup?.(); };
  }, [progress, onReady, onFail]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full transition-opacity duration-[900ms] ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
