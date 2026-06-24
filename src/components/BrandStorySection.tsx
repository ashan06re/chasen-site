"use client";
import AnimateIn from "./AnimateIn";
import type { BrandStoryContent } from "@/data/storeContent";
import { defaultBrandStory, defaultBrandStoryEn } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

interface Props {
  content?: BrandStoryContent;
  contentEn?: BrandStoryContent;
}

export default function BrandStorySection({ content = defaultBrandStory, contentEn }: Props) {
  const { lang } = useLang();
  const c = lang === "en" ? (contentEn ?? defaultBrandStoryEn) : content;

  return (
    <section id="brand" className="bg-[#F7F5F0] py-28 md:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <AnimateIn>
          <p className="font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-16">
            Brand Story
          </p>
        </AnimateIn>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left: large heading */}
          <AnimateIn delay={100}>
            <div>
              <h2 className="font-[var(--font-noto-serif-jp)] text-5xl md:text-6xl lg:text-7xl font-light text-[#1A1A18] leading-tight tracking-wide">
                {c.catchphrase}<br />
                <span className="text-[#3D6B35]">{c.catchphraseHighlight}</span>
              </h2>
              <div className="mt-10 w-12 h-px bg-[#B8A882]" />
            </div>
          </AnimateIn>

          {/* Right: body text */}
          <AnimateIn delay={250}>
            <div className="space-y-6">
              <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light">
                {c.body1}
              </p>
              <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light">
                {c.body2}
              </p>
              <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light">
                {c.body3}
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
