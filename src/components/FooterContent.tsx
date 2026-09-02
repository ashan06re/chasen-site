"use client";
import Link from "next/link";
import type { StoreInfo, SiteSettings } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";
import { INSTAGRAM_URL } from "@/lib/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

interface Props {
  kyoto: StoreInfo;
  kumamoto: StoreInfo;
  kyotoEn?: StoreInfo;
  kumamotoEn?: StoreInfo;
  settings: SiteSettings;
  settingsEn?: SiteSettings;
}

export default function FooterContent({ kyoto, kumamoto, kyotoEn, kumamotoEn, settings, settingsEn }: Props) {
  const { lang } = useLang();
  const currentYear = new Date().getFullYear();

  const currentKyoto    = lang === "en" && kyotoEn    ? kyotoEn    : kyoto;
  const currentKumamoto = lang === "en" && kumamotoEn ? kumamotoEn : kumamoto;
  const tagline = lang === "en"
    ? (settingsEn?.footerTagline ?? "Japanese Tea Stand")
    : settings.footerTagline;
  const copyright = lang === "en"
    ? `© ${currentYear} Chasen Co., Ltd. All rights reserved.`
    : `© ${currentYear} 株式会社チャセン. All rights reserved.`;

  return (
    <footer className="bg-[#1A1A18] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 pb-12 border-b border-[#F7F5F0]/10">
          {/* Brand */}
          <div>
            <p className="font-[var(--font-noto-serif-jp)] text-[#F7F5F0] text-3xl tracking-[0.25em] mb-1">
              茶筅
            </p>
            <p className="font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.3em]">
              Chasen
            </p>
            <p className="mt-4 font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs leading-relaxed tracking-wide">
              {tagline}
            </p>

            {/* SNS */}
            <div className="mt-6 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 text-[#6B6B5E] hover:text-[#B8A882] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
                <span className="font-[var(--font-cormorant)] text-sm tracking-wider">
                  Instagram
                </span>
              </a>
            </div>
          </div>

          {/* Stores */}
          <div>
            <p className="font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.4em] uppercase mb-5">
              Stores
            </p>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/stores/kyoto"
                  className="font-[var(--font-cormorant)] text-[#F7F5F0]/70 text-base tracking-wider hover:text-[#F7F5F0] transition-colors"
                >
                  {currentKyoto.name}
                </Link>
                <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs mt-0.5">
                  {currentKyoto.area} / {currentKyoto.hours}
                </p>
              </li>
              <li>
                <Link
                  href="/stores/kumamoto"
                  className="font-[var(--font-cormorant)] text-[#F7F5F0]/70 text-base tracking-wider hover:text-[#F7F5F0] transition-colors"
                >
                  {currentKumamoto.name}
                </Link>
                <p className="font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs mt-0.5">
                  {currentKumamoto.area} / {currentKumamoto.hours}
                </p>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.4em] uppercase mb-5">
              Contact
            </p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="font-[var(--font-cormorant)] text-[#F7F5F0]/60 text-sm tracking-wide hover:text-[#F7F5F0] transition-colors"
            >
              {settings.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider">
            {copyright}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider hover:text-[#B8A882] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider hover:text-[#B8A882] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
