"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/langContext";

/**
 * ヘッダー
 *
 * ここから直接飛べるのは「メニュー（店別）」「店舗」「コンタクト」「予約」「言語」だけ。
 * ブランド・お知らせはフッターへ移した（2026-09-05 のユーザー要件）。
 * 予約はスマホでも常時見える枠線ボタン。URL は Notion（予約用Google Form DB）から page が渡す。
 */

const stores = {
  ja: [
    { label: "Chasen 高台寺店", area: "Kyoto", href: "/stores/kyoto", menu: "/stores/kyoto/menu" },
    { label: "Chasen 熊本店", area: "Kumamoto", href: "/stores/kumamoto", menu: "/stores/kumamoto/menu" },
  ],
  en: [
    { label: "Chasen Kodaiji", area: "Kyoto", href: "/stores/kyoto", menu: "/stores/kyoto/menu" },
    { label: "Chasen Kumamoto", area: "Kumamoto", href: "/stores/kumamoto", menu: "/stores/kumamoto/menu" },
  ],
};

const nav = {
  ja: { menu: "メニュー", stores: "店舗", contact: "コンタクト", reserve: "予約", news: "お知らせ", brand: "ブランド" },
  en: { menu: "Menu", stores: "Stores", contact: "Contact", reserve: "Reserve", news: "News", brand: "Brand" },
};

interface Props {
  initialDark?: boolean;
  reservationUrl?: string;
  reservationUrlEn?: string;
}

/** ホバーで開く小さなプルダウン（店別メニュー／店舗） */
function Dropdown({
  label,
  items,
  open,
  onToggle,
  onClose,
}: {
  label: string;
  items: { key: string; area: string; label: string; href: string }[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-1.5 min-h-11 text-[#F7F5F0]/80 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
      >
        {label}
        <svg className={`w-2.5 h-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l4 4 4-4" />
        </svg>
      </button>
      <div
        inert={!open}
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="relative bg-[#1A1A18] border border-[#B8A882]/25 min-w-[248px] shadow-[0_20px_56px_rgba(0,0,0,0.55)]">
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#1A1A18] rotate-45 border-t border-l border-[#B8A882]/25" />
          <div className="h-px bg-gradient-to-r from-transparent via-[#B8A882]/55 to-transparent" />
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              onClick={onClose}
              className="group relative flex flex-col px-7 py-[18px] border-b border-[#F7F5F0]/5 last:border-0 overflow-hidden"
            >
              <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#3D6B35] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
              <span className="font-[var(--font-cormorant)] text-[#B8A882]/70 group-hover:text-[#B8A882] text-[10px] tracking-[0.6em] uppercase mb-1.5 transition-colors duration-200">
                {it.area}
              </span>
              <span className="font-[var(--font-cormorant)] text-[#F7F5F0]/65 group-hover:text-[#F7F5F0] text-[13px] tracking-[0.15em] transition-colors duration-200">
                {it.label}
              </span>
            </Link>
          ))}
          <div className="h-px bg-gradient-to-r from-transparent via-[#B8A882]/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function Header({ initialDark = false, reservationUrl, reservationUrlEn }: Props) {
  const { lang, setLang, localize } = useLang();
  const [scrolled, setScrolled] = useState(initialDark);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<"menu" | "stores" | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const t = nav[lang];
  const list = stores[lang];
  const reserveHref = (lang === "en" ? (reservationUrlEn || reservationUrl) : reservationUrl) || localize("/#contact");
  const reserveExternal = reserveHref.startsWith("http");

  useEffect(() => {
    if (initialDark) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialDark]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        document.querySelector<HTMLButtonElement>('header button[aria-expanded="true"]')?.focus();
        setOpenDrop(null); setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDrop(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const reserveButton = (extra = "") => (
    <a
      href={reserveHref}
      target={reserveExternal ? "_blank" : undefined}
      rel={reserveExternal ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center min-h-11 px-5 border border-[#B8A882]/70 text-[#F7F5F0] hover:bg-[#F7F5F0] hover:text-[#1A1A18] hover:border-[#F7F5F0] text-[13px] tracking-[0.25em] transition-colors font-[var(--font-cormorant)] ${extra}`}
    >
      {t.reserve}
    </a>
  );

  const langSwitch = (extra = "") => (
    <div className={`flex items-center text-[#F7F5F0]/60 text-xs tracking-widest font-[var(--font-cormorant)] ${extra}`}>
      <button onClick={() => setLang("ja")} aria-label="日本語" aria-pressed={lang === "ja"} className={`inline-flex items-center justify-center min-w-11 min-h-11 transition-colors ${lang === "ja" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`}>JP</button>
      <span>/</span>
      <button onClick={() => setLang("en")} aria-label="English" aria-pressed={lang === "en"} className={`inline-flex items-center justify-center min-w-11 min-h-11 transition-colors ${lang === "en" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`}>EN</button>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-[#1A1A18]/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
        <Link href={localize("/")} className="flex items-center gap-3 min-h-11 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F7F5F0] ring-1 ring-white/30 flex-shrink-0 p-[5px]">
            <Image src="/logo-mark.png" alt="茶筅 Chasen" width={36} height={36} className="object-contain w-full h-full" priority />
          </div>
          <span className="max-[380px]:hidden font-[var(--font-cormorant)] text-[#F7F5F0] text-xl tracking-[0.3em] font-light">Chasen</span>
        </Link>

        {/* Desktop */}
        <nav ref={navRef} className="hidden md:flex items-center gap-9">
          <Dropdown
            label={t.menu}
            items={list.map((s) => ({ key: s.menu, area: s.area, label: s.label, href: localize(s.menu) }))}
            open={openDrop === "menu"}
            onToggle={() => setOpenDrop((d) => (d === "menu" ? null : "menu"))}
            onClose={() => setOpenDrop(null)}
          />
          <Dropdown
            label={t.stores}
            items={list.map((s) => ({ key: s.href, area: s.area, label: s.label, href: localize(s.href) }))}
            open={openDrop === "stores"}
            onToggle={() => setOpenDrop((d) => (d === "stores" ? null : "stores"))}
            onClose={() => setOpenDrop(null)}
          />
          <Link
            href={localize("/#contact")}
            className="inline-flex items-center min-h-11 text-[#F7F5F0]/80 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]"
          >
            {t.contact}
          </Link>
          {reserveButton()}
          {langSwitch()}
        </nav>

        {/* Mobile: 予約は常時見せる。残りはハンバーガー */}
        <div className="md:hidden flex items-center gap-1">
          {reserveButton("px-4 text-[12px]")}
          <button
            className="text-[#F7F5F0] w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={lang === "en" ? "Menu" : "メニュー"}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div inert={!menuOpen} className={`md:hidden overflow-y-auto transition-all duration-500 ${menuOpen ? "max-h-[calc(100svh-72px)] opacity-100" : "max-h-0 opacity-0"} bg-[#1A1A18]/98`}>
        <nav className="px-6 py-4 flex flex-col gap-1">
          <p className="py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]">{t.menu}</p>
          <div className="pl-4 flex flex-col border-l border-[#F7F5F0]/10 mb-2">
            {list.map((s) => (
              <Link key={s.menu} href={localize(s.menu)} onClick={() => setMenuOpen(false)} className="block py-3 text-[#F7F5F0]/60 text-sm tracking-wider font-[var(--font-cormorant)] hover:text-[#F7F5F0] transition-colors">
                {s.label}
              </Link>
            ))}
          </div>
          <p className="py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]">{t.stores}</p>
          <div className="pl-4 flex flex-col border-l border-[#F7F5F0]/10 mb-2">
            {list.map((s) => (
              <Link key={s.href} href={localize(s.href)} onClick={() => setMenuOpen(false)} className="block py-3 text-[#F7F5F0]/60 text-sm tracking-wider font-[var(--font-cormorant)] hover:text-[#F7F5F0] transition-colors">
                {s.label}
              </Link>
            ))}
          </div>
          <Link href={localize("/#contact")} onClick={() => setMenuOpen(false)} className="block py-2 text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]">
            {t.contact}
          </Link>
          <Link href={localize("/news")} onClick={() => setMenuOpen(false)} className="block py-2 text-[#F7F5F0]/55 text-base tracking-widest font-[var(--font-noto-serif-jp)]">
            {t.news}
          </Link>
          <Link href={localize("/#brand")} onClick={() => setMenuOpen(false)} className="block py-2 text-[#F7F5F0]/55 text-base tracking-widest font-[var(--font-noto-serif-jp)]">
            {t.brand}
          </Link>
          <div className="mt-2 pt-1 border-t border-[#F7F5F0]/10">{langSwitch()}</div>
        </nav>
      </div>
    </header>
  );
}
