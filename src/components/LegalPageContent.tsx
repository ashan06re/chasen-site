"use client";
import Header from "./Header";
import { useLang } from "@/lib/langContext";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  title: string;
  label: string;      // 英字ラベル（Cormorant表示）
  updated: string;
  intro: string;
  sections: LegalSection[];
}

interface Props {
  ja: LegalDocument;
  en: LegalDocument;
}

export default function LegalPageContent({ ja, en }: Props) {
  const { lang } = useLang();
  const doc = lang === "en" ? en : ja;

  return (
    <>
      <Header initialDark />
      <main className="bg-[#F7F5F0] min-h-screen pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-[var(--font-cormorant)] text-xs tracking-[0.4em] text-chasen-gold-deep uppercase mb-4">
            {doc.label}
          </p>
          <h1 className="font-[var(--font-noto-serif-jp)] text-3xl md:text-4xl font-light tracking-[0.1em] text-[#1A1A18] mb-3">
            {doc.title}
          </h1>
          <p className="font-[var(--font-noto-serif-jp)] text-xs text-[#6B6B5E] mb-12">
            {doc.updated}
          </p>

          <p className="font-[var(--font-noto-serif-jp)] text-sm leading-8 text-[#1A1A18]/80 mb-14">
            {doc.intro}
          </p>

          <div className="flex flex-col gap-12">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-[var(--font-noto-serif-jp)] text-lg font-medium tracking-[0.08em] text-[#3D6B35] mb-4">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-[var(--font-noto-serif-jp)] text-sm leading-8 text-[#1A1A18]/75 mb-3"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
