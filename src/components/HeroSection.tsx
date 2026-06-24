"use client";
import type { SiteSettings } from "@/data/storeContent";
import { defaultSiteSettingsEn } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

interface Props {
  settings: SiteSettings;
  settingsEn?: SiteSettings;
}

export default function HeroSection({ settings, settingsEn }: Props) {
  const { lang } = useLang();
  const enSettings = settingsEn ?? defaultSiteSettingsEn;
  const catchphrase = lang === "en" ? enSettings.heroCatchphrase : settings.heroCatchphrase;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="/hero.mp4"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A18]/60 via-[#1A1A18]/30 to-[#1A1A18]/70" />

      {/* Content */}
      <div className="relative z-10 text-center text-[#F7F5F0] px-6">
        <p className="font-[var(--font-cormorant)] text-sm md:text-base tracking-[0.4em] text-[#B8A882] mb-6 uppercase">
          {settings.heroEnglishLabel}
        </p>

        <h1 className="font-[var(--font-noto-serif-jp)] text-7xl md:text-9xl lg:text-[11rem] font-light tracking-[0.2em] leading-none mb-6">
          茶筅
        </h1>

        <p className="font-[var(--font-cormorant)] text-2xl md:text-3xl tracking-[0.2em] text-[#F7F5F0]/80 font-light mb-12">
          Chasen
        </p>

        <p className="font-[var(--font-noto-serif-jp)] text-sm md:text-base tracking-[0.15em] text-[#F7F5F0]/65 font-light">
          {catchphrase}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/40 text-xs tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-[#F7F5F0]/40 to-transparent" />
      </div>
    </section>
  );
}
