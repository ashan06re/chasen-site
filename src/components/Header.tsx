"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/langContext";

const storesJa = [
  { label: "Chasen 高台寺店", href: "/stores/kyoto",     area: "Kyoto" },
  { label: "Chasen 熊本店",   href: "/stores/kumamoto", area: "Kumamoto" },
];
const storesEn = [
  { label: "Chasen Kodaiji",  href: "/stores/kyoto",     area: "Kyoto" },
  { label: "Chasen Kumamoto", href: "/stores/kumamoto", area: "Kumamoto" },
];

const nav = {
  ja: { brand: "ブランド", stores: "店舗", news: "お知らせ", contact: "お問い合わせ" },
  en: { brand: "Brand",    stores: "Stores", news: "News",    contact: "Contact" },
};

interface Props {
  initialDark?: boolean;
}

export default function Header({ initialDark = false }: Props) {
  const { lang, setLang }              = useLang();
  const [scrolled, setScrolled]        = useState(initialDark);
  const [menuOpen, setMenuOpen]        = useState(false);
  const [storeOpen, setStoreOpen]      = useState(false);
  const storeRef = useRef<HTMLDivElement>(null);

  const t      = nav[lang];
  const stores = lang === "en" ? storesEn : storesJa;

  useEffect(() => {
    if (initialDark) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialDark]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) {
        setStoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#1A1A18]/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 min-h-11 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F7F5F0] ring-1 ring-white/30 flex-shrink-0 p-[5px]">
            <Image
              src="/logo-mark.png"
              alt="茶筅 Chasen"
              width={36}
              height={36}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-[var(--font-cormorant)] text-[#F7F5F0] text-xl tracking-[0.3em] font-light">
            Chasen
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/#brand"
            className="inline-flex items-center min-h-11 text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
          >
            {t.brand}
          </Link>

          {/* 店舗ドロップダウン */}
          <div ref={storeRef} className="relative">
            <button
              onClick={() => setStoreOpen((o) => !o)}
              className="flex items-center gap-1.5 min-h-11 text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
            >
              {t.stores}
              <svg
                className={`w-2.5 h-2.5 transition-transform duration-300 ${storeOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 10 6"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l4 4 4-4" />
              </svg>
            </button>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 transition-all duration-300 ease-out ${
                storeOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="relative bg-[#1A1A18] border border-[#B8A882]/25 min-w-[248px] shadow-[0_20px_56px_rgba(0,0,0,0.55)]">
                <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#1A1A18] rotate-45 border-t border-l border-[#B8A882]/25" />
                <div className="h-px bg-gradient-to-r from-transparent via-[#B8A882]/55 to-transparent" />

                {stores.map((store) => (
                  <Link
                    key={store.href}
                    href={store.href}
                    className="group relative flex flex-col px-7 py-[18px] border-b border-[#F7F5F0]/5 last:border-0 overflow-hidden"
                    onClick={() => setStoreOpen(false)}
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#3D6B35] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                    <span className="font-[var(--font-cormorant)] text-[#B8A882]/70 group-hover:text-[#B8A882] text-[10px] tracking-[0.6em] uppercase mb-1.5 transition-colors duration-200">
                      {store.area}
                    </span>
                    <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/65 group-hover:text-[#F7F5F0] text-[13px] tracking-[0.15em] transition-colors duration-200">
                      {store.label}
                    </span>
                  </Link>
                ))}

                <div className="h-px bg-gradient-to-r from-transparent via-[#B8A882]/20 to-transparent" />
              </div>
            </div>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center min-h-11 text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
          >
            {t.news}
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center min-h-11 text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
          >
            {t.contact}
          </Link>
        </nav>

        {/* 言語切り替え */}
        <div className="hidden md:flex items-center text-[#F7F5F0]/60 text-xs tracking-widest font-[var(--font-cormorant)]">
          <button
            onClick={() => setLang("ja")}
            className={`inline-flex items-center justify-center min-w-11 min-h-11 transition-colors ${lang === "ja" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`}
          >
            JP
          </button>
          <span>/</span>
          <button
            onClick={() => setLang("en")}
            className={`inline-flex items-center justify-center min-w-11 min-h-11 transition-colors ${lang === "en" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`}
          >
            EN
          </button>
        </div>

        {/* モバイル ハンバーガー */}
        <button
          className="md:hidden text-[#F7F5F0] w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* モバイルメニュー */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        } bg-[#1A1A18]/98`}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          <Link
            href="/#brand"
            className="block py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]"
            onClick={() => setMenuOpen(false)}
          >
            {t.brand}
          </Link>

          <div>
            <p className="py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)] mb-1">
              {t.stores}
            </p>
            <div className="pl-4 flex flex-col border-l border-[#F7F5F0]/10">
              {stores.map((store) => (
                <Link
                  key={store.href}
                  href={store.href}
                  className="block py-3 text-[#F7F5F0]/55 text-sm tracking-wider font-[var(--font-cormorant)] hover:text-[#F7F5F0] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {store.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/news"
            className="block py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]"
            onClick={() => setMenuOpen(false)}
          >
            {t.news}
          </Link>

          <Link
            href="/#contact"
            className="block py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]"
            onClick={() => setMenuOpen(false)}
          >
            {t.contact}
          </Link>

          {/* モバイル言語切り替え */}
          <div className="flex items-center mt-2 pt-1 border-t border-[#F7F5F0]/10">
            <button
              onClick={() => { setLang("ja"); setMenuOpen(false); }}
              className={`inline-flex items-center justify-center min-w-11 min-h-11 font-[var(--font-cormorant)] text-sm tracking-widest transition-colors ${lang === "ja" ? "text-[#F7F5F0]" : "text-[#F7F5F0]/40 hover:text-[#F7F5F0]"}`}
            >
              JP
            </button>
            <span className="text-[#F7F5F0]/30">/</span>
            <button
              onClick={() => { setLang("en"); setMenuOpen(false); }}
              className={`inline-flex items-center justify-center min-w-11 min-h-11 font-[var(--font-cormorant)] text-sm tracking-widest transition-colors ${lang === "en" ? "text-[#F7F5F0]" : "text-[#F7F5F0]/40 hover:text-[#F7F5F0]"}`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
