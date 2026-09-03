"use client";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import {
  CAMERA_KEYS,
  createOpeningState,
  smoothstep,
  updateOpeningState,
  type OpeningState,
} from "@/lib/openingScript";
import { buildEnvironment } from "./environment";
import Room from "./Room";
import TeaBowl from "./TeaBowl";
import Chasen3D from "./Chasen3D";
import Foam from "./Foam";
import Steam from "./Steam";
import Pour from "./Pour";

/** カメラの通り道を補間する。区間ごとに smoothstep をかけて等速に見せない */
function sampleCamera(p: number, pos: THREE.Vector3, look: THREE.Vector3) {
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && p > CAMERA_KEYS[i + 1].p) i++;
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1];
  const t = smoothstep((p - a.p) / (b.p - a.p));
  pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  );
  look.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], t),
    THREE.MathUtils.lerp(a.look[1], b.look[1], t),
    THREE.MathUtils.lerp(a.look[2], b.look[2], t),
  );
  return THREE.MathUtils.lerp(a.fov, b.fov, t);
}

function Rig({ s, progress }: { s: OpeningState; progress: RefObject<number> }) {
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useRef(0);

  // 進行度の更新は他のどのフレーム処理より先に走らせる
  useFrame((state, delta) => {
    // 生のスクロール値をそのまま使うとホイールの段差が出る。追従を1フレーム分ならす
    const target = progress.current ?? 0;
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 9);
    const p = smoothed.current;
    updateOpeningState(s, p);

    const cam = state.camera as THREE.PerspectiveCamera;
    const baseFov = sampleCamera(p, pos, look);

    // 縦長の画面では垂直画角のままだと横が足りず、茶碗が画面からはみ出す。
    // 横方向の画角を基準（16:10相当）に保つよう垂直画角を広げる
    const aspect = cam.aspect || 1.6;
    const fov = THREE.MathUtils.clamp(
      THREE.MathUtils.radToDeg(
        2 * Math.atan((Math.tan(THREE.MathUtils.degToRad(baseFov) / 2) * 1.6) / aspect),
      ),
      baseFov,
      82,
    );

    // 手持ちのわずかな揺れ。寄るほど小さくする（実写のマクロと同じ）
    const t = state.clock.elapsedTime;
    const shake = THREE.MathUtils.lerp(0.010, 0.0009, p);
    cam.position.set(
      pos.x + Math.sin(t * 0.37) * shake,
      pos.y + Math.sin(t * 0.29 + 1.3) * shake * 0.7,
      pos.z + Math.sin(t * 0.23 + 2.1) * shake * 0.5,
    );
    cam.lookAt(look);
    if (Math.abs(cam.fov - fov) > 0.001) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  }, -10);

  return null;
}

/** 手続き生成の環境マップをシーンに挿す */
function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const tex = buildEnvironment(gl);
    scene.environment = tex;
    // 指数フォグだと寄りと引きで効き方が極端になる。線形にして
    // 「カウンターの奥がいつのまにか闇に溶ける」ところだけを作る。
    // 背景色をフォグ色と揃えないと、天板の奥の縁が黒地に切り抜かれて線に見える
    const haze = new THREE.Color("#080907");
    scene.fog = new THREE.Fog(haze, 0.6, 7.0);
    scene.background = haze;
    return () => {
      scene.environment = null;
      tex.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Lights({ shadows }: { shadows: boolean }) {
  const key = useRef<THREE.SpotLight>(null);
  const win = useRef<THREE.RectAreaLight>(null);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
    key.current?.target.position.set(0, 0.03, 0);
    key.current?.target.updateMatrixWorld();
    win.current?.lookAt(0, 0.04, 0);
  }, []);

  return (
    <>
      <ambientLight intensity={0.05} color="#28323C" />

      {/* 障子の面光源。陶器を「プラスチックの塊」に見せない一番効く光 */}
      <rectAreaLight
        ref={win}
        position={[-0.34, 0.26, 0.26]}
        width={0.42}
        height={0.62}
        intensity={3.1}
        color="#FFEAD0"
      />

      {/* 影を落とすためだけの弱い上手（かみて）の光 */}
      <spotLight
        ref={key}
        position={[0.30, 0.62, 0.26]}
        angle={0.55}
        penumbra={0.95}
        decay={2}
        intensity={shadows ? 0.55 : 0.9}
        color="#FFE0B8"
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00006}
        shadow-normalBias={0.0012}
        shadow-camera-near={0.15}
        shadow-camera-far={1.4}
        shadow-camera-fov={62}
      />

      {/* 縁を切る弱い逆光 */}
      <directionalLight position={[-0.9, 0.55, -1.1]} intensity={0.35} color="#8FB2C8" />

      {/* 茶碗の内側に回り込む光。これが無いと水面と泡が黒く沈む */}
      <pointLight position={[-0.055, 0.135, 0.075]} intensity={0.012} distance={0.26} decay={2} color="#FFF0D8" />
    </>
  );
}

interface Props {
  progress: RefObject<number>;
  onReady?: () => void;
}

export default function OpeningCanvas({ progress, onReady }: Props) {
  const s = useMemo(createOpeningState, []);

  // 端末の力に合わせて後処理を切り替える。スマホで DOF まで焼くと 60fps が出ない
  const heavy = useMemo(() => {
    if (typeof window === "undefined") return false;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    return !coarse && cores >= 6 && window.innerWidth >= 900;
  }, []);

  return (
    <Canvas
      dpr={heavy ? [1, 2] : [1, 1.5]}
      shadows={heavy}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 40, near: 0.02, far: 24, position: [0.16, 0.58, 2.6] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        onReady?.();
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Environment />
      <Lights shadows={heavy} />
      <Rig s={s} progress={progress} />

      <Room />
      <TeaBowl s={s} />
      <Chasen3D s={s} />
      <Foam s={s} />
      <Pour s={s} />
      <Steam s={s} />

      <EffectComposer multisampling={heavy ? 4 : 0} enableNormalPass={false}>
        {heavy ? (
          <DepthOfField target={[0, 0.04, 0]} focalLength={0.045} bokehScale={3.2} height={480} />
        ) : (
          <></>
        )}
        <Bloom intensity={0.34} luminanceThreshold={0.82} luminanceSmoothing={0.4} mipmapBlur radius={0.62} />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.055} />
        <Vignette offset={0.26} darkness={0.72} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
