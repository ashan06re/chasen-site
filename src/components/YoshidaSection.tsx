"use client";
import Image from "next/image";
import AnimateIn from "./AnimateIn";
import ParallaxFrame from "./ParallaxFrame";
import type { YoshidaFeature, YoshidaImages, YoshidaSettings } from "@/data/storeContent";
import { defaultYoshidaSettingsEn, defaultYoshidaFeaturesEn } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

interface Props {
  settings: YoshidaSettings;
  features: YoshidaFeature[];
  settingsEn?: YoshidaSettings;
  featuresEn?: YoshidaFeature[];
  images?: YoshidaImages;
}

function RoundedImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return (
    <ParallaxFrame className={`rounded-[2rem] bg-[#1A1E14] ${className}`} amount={0.07}>
      {src && (
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      )}
    </ParallaxFrame>
  );
}

export default function YoshidaSection({ settings, features, settingsEn, featuresEn, images }: Props) {
  const { lang } = useLang();
  const s = lang === "en" ? (settingsEn ?? defaultYoshidaSettingsEn) : settings;
  const f = lang === "en" ? (featuresEn ?? defaultYoshidaFeaturesEn) : features;
  const { label, nameJa, nameEn, intro } = s;

  const featureImages = [images?.feature1, images?.feature2, images?.feature3];

  return (
    <section className="bg-[#0D1209] py-32 md:py-48 px-6 overflow-hidden relative">
      <div
        className="absolute right-[-4rem] top-1/2 -translate-y-1/2 font-[var(--font-noto-serif-jp)] pointer-events-none select-none leading-none"
        style={{ fontSize: "clamp(20rem, 40vw, 36rem)", color: "rgba(255,255,255,0.015)" }}
        aria-hidden
      >
        茶
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section label */}
        <AnimateIn>
          <div className="flex items-center gap-6 mb-20">
            <span className="font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.5em] uppercase">
              {label}
            </span>
            <div className="flex-1 h-px bg-[#1E2018]" />
          </div>
        </AnimateIn>

        {/* Intro grid: large JP heading + image + text */}
        <div className="grid md:grid-cols-[5fr_7fr] gap-16 md:gap-32 items-start mb-14 md:mb-20">

          <AnimateIn delay={100}>
            <div>
              <h2
                className="font-[var(--font-noto-serif-jp)] font-light text-white leading-[1.15] tracking-widest whitespace-pre-line"
                style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
              >
                {nameJa}
              </h2>
              <p className="mt-6 font-[var(--font-cormorant)] text-[#B8A882] tracking-[0.35em]"
                style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}>
                {nameEn}
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={220}>
            <div>
              {/* メイン画像 — 16/9で横長・短め */}
              <RoundedImage
                src={images?.main}
                alt={nameEn}
                className="w-full aspect-[16/9] mb-10"
              />
              <div className="w-8 h-px bg-[#3D6B35] mb-8" />
              <p className="font-[var(--font-noto-serif-jp)] text-[#C8C2B8] text-base md:text-lg leading-[2.4] tracking-wide font-light">
                {intro}
              </p>
            </div>
          </AnimateIn>
        </div>

        {/* Divider */}
        <AnimateIn delay={350}>
          <div className="h-px bg-[#1A1E14] mb-14 md:mb-20" />
        </AnimateIn>

        {/* Feature columns */}
        <div className="grid md:grid-cols-3 gap-14 md:gap-10">
          {f.map((feature, i) => (
            <AnimateIn key={i} delay={450 + i * 130}>
              <div>
                {/* 数字 + 画像（右側） */}
                <div className="flex items-start gap-4 mb-5">
                  <p
                    className="font-[var(--font-cormorant)] text-[#3D6B35] font-light leading-none flex-shrink-0"
                    style={{ fontSize: "clamp(3rem, 6vw, 4rem)" }}
                  >
                    {feature.icon}
                  </p>
                  <RoundedImage
                    src={featureImages[i]}
                    alt={feature.name}
                    className="flex-1 aspect-[16/9]"
                  />
                </div>
                <h3 className="font-[var(--font-noto-serif-jp)] text-white font-light tracking-wide mb-3 text-lg md:text-xl">
                  {feature.name}
                </h3>
                <div className="w-6 h-px bg-[#2E3028] mb-5" />
                <p className="font-[var(--font-noto-serif-jp)] text-[#5E5E54] text-sm leading-[2.2] tracking-wide font-light">
                  {feature.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  );
}
