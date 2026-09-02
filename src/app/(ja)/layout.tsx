import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "茶筅 Chasen | 日本茶スタンド",
    template: "%s | 茶筅 Chasen",
  },
  description:
    "京都・熊本に展開する日本茶スタンド「茶筅」。厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
  keywords: "茶筅, Chasen, 日本茶, 抹茶, 京都, 熊本, お茶, カフェ",
  alternates: pageAlternates("/", "ja"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "茶筅 Chasen | 日本茶スタンド",
    description: "厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen — 日本茶スタンド" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "茶筅 Chasen | 日本茶スタンド",
    description: "厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
    images: [OG_IMAGE],
  },
};

export default function JaRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="ja">{children}</RootShell>;
}
