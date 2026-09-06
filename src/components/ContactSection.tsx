"use client";
import AnimateIn from "./AnimateIn";
import type { SiteSettings } from "@/data/storeContent";
import { defaultSiteSettingsEn } from "@/data/storeContent";
import { useLang } from "@/lib/langContext";

interface Props {
  settings: SiteSettings;
  settingsEn?: SiteSettings;
  reservationUrl?: string;
  reservationUrlEn?: string;
}

const t = {
  ja: {
    label: "Reservation & Contact",
    heading: ["ご予約・", "お問い合わせ"],
    reserve: "ご予約はこちら",
    email: "メールで問い合わせ",
  },
  en: {
    label: "Reservation & Contact",
    heading: ["Reservations &", "Contact"],
    reserve: "Make a Reservation",
    email: "Send an Email",
  },
};

export default function ContactSection({ settings, settingsEn, reservationUrl, reservationUrlEn }: Props) {
  const { lang } = useLang();
  const tx = t[lang];
  const enSettings = settingsEn ?? defaultSiteSettingsEn;
  const description = lang === "en"
    ? enSettings.contactDescription
    : settings.contactDescription;
  const resolvedReservationUrl = lang === "en"
    ? (reservationUrlEn || reservationUrl || enSettings.contactReservationUrl)
    : (reservationUrl || settings.contactReservationUrl);

  return (
    <section id="contact" className="bg-[#0B0C0A] py-16 md:py-24 px-6 border-t border-[#B8A882]/15">
      <div className="max-w-4xl mx-auto text-center">
        <AnimateIn>
          <p className="font-[var(--font-cormorant)] text-chasen-gold text-sm tracking-[0.5em] uppercase mb-8">
            {tx.label}
          </p>
        </AnimateIn>

        <AnimateIn delay={100}>
          <h2 className="font-[var(--font-noto-serif-jp)] text-3xl md:text-4xl font-light text-[#F7F5F0] tracking-wider leading-relaxed mb-6">
            {tx.heading[0]}<br className="md:hidden" />
            {tx.heading[1]}
          </h2>
        </AnimateIn>

        <AnimateIn delay={200}>
          <p className="font-[var(--font-noto-serif-jp)] text-chasen-muted-light text-base leading-[2.2] tracking-wide font-light max-w-lg mx-auto mb-14 whitespace-pre-line">
            {description}
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={resolvedReservationUrl}
              target={resolvedReservationUrl.startsWith('https:')?'_blank':undefined}
              rel={resolvedReservationUrl.startsWith('https:')?'noopener noreferrer':undefined}
              className="inline-flex items-center gap-3 bg-[#F7F5F0] text-[#1A1A18] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.25em] px-12 py-5 hover:bg-[#E8E0D0] transition-colors w-full sm:w-auto justify-center"
            >
              <span className="text-[#3D6B35] text-base" aria-hidden>◎</span>
              {tx.reserve}
            </a>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="inline-flex items-center gap-3 border border-[#B8A882]/60 text-[#F7F5F0] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.25em] px-12 py-5 hover:bg-[#F7F5F0]/10 transition-colors w-full sm:w-auto justify-center"
            >
              <span className="text-[#B8A882] text-base" aria-hidden>✉</span>
              {tx.email}
            </a>
          </div>
        </AnimateIn>

        <AnimateIn delay={400}>
          <p className="mt-10 font-[var(--font-cormorant)] text-chasen-muted-light text-sm tracking-wider">
            {settings.contactEmail}
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
