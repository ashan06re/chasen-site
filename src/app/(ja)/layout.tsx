import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL, SITE_NAME, OG_IMAGE, IS_PREVIEW } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "茶筅 Chasen｜玉手箱と抹茶スイーツ・お料理",
    template: "%s | 茶筅 Chasen",
  },
  description:
    "玉手箱、抹茶スイーツ、お料理を楽しむ茶筅 Chasen。吉田銘茶園の抹茶と、京都・高台寺と熊本それぞれの空間をご紹介します。",
  keywords: "茶筅, Chasen, 玉手箱, 抹茶スイーツ, お料理, 吉田銘茶園, 京都, 高台寺, 熊本",
  alternates: pageAlternates("/", "ja"),
  robots: { index: !IS_PREVIEW, follow: true },
  openGraph: {
    title: "茶筅 Chasen｜玉手箱と抹茶スイーツ・お料理",
    description: "玉手箱、抹茶スイーツ、お料理を楽しむ茶筅。京都・高台寺と熊本で、吉田銘茶園の抹茶とともに。",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen — 玉手箱と抹茶スイーツ・お料理" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "茶筅 Chasen｜玉手箱と抹茶スイーツ・お料理",
    description: "玉手箱、抹茶スイーツ、お料理を楽しむ茶筅。京都・高台寺と熊本で、吉田銘茶園の抹茶とともに。",
    images: [OG_IMAGE],
  },
};

export default function JaRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="ja">{children}</RootShell>;
}
