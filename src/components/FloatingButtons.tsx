"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/langContext";

export default function FloatingButtons({
  reservationUrl,
  reservationUrlEn,
}: {
  reservationUrl?: string;
  reservationUrlEn?: string;
}) {
  const { lang } = useLang();
  const url = lang === "en" ? (reservationUrlEn || reservationUrl) : reservationUrl;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed right-5 bottom-8 z-40 flex flex-col gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <a
        href={url || "#contact"}
        target={url ? "_blank" : undefined}
        rel={url ? "noopener noreferrer" : undefined}
        className="flex flex-col items-center justify-center gap-1 bg-[#3D6B35] text-[#F7F5F0] w-14 h-14 rounded-full shadow-lg hover:bg-[#2A4D25] transition-colors"
        aria-label={lang === "en" ? "Reservation" : "ご予約"}
      >
        <span className="text-lg leading-none">◎</span>
        <span className="font-[var(--font-noto-serif-jp)] text-[0.5rem] tracking-wider leading-none">
          {lang === "en" ? "Book" : "予約"}
        </span>
      </a>
      <a
        href="mailto:chasen.ky01@gmail.com"
        className="flex flex-col items-center justify-center gap-1 bg-[#1A1A18] text-[#F7F5F0] w-14 h-14 rounded-full shadow-lg hover:bg-[#333330] transition-colors border border-[#F7F5F0]/10"
        aria-label={lang === "en" ? "Contact" : "お問い合わせ"}
      >
        <span className="text-lg leading-none">✉</span>
        <span className="font-[var(--font-noto-serif-jp)] text-[0.5rem] tracking-wider leading-none">
          {lang === "en" ? "Mail" : "問合せ"}
        </span>
      </a>
    </div>
  );
}
