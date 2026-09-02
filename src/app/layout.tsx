import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/langContext";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "茶筅 Chasen | 日本茶スタンド",
    template: "%s | 茶筅 Chasen",
  },
  description:
    "京都・熊本に展開する日本茶スタンド「茶筅」。厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
  keywords: "茶筅, Chasen, 日本茶, 抹茶, 京都, 熊本, お茶, カフェ",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "茶筅 Chasen | 日本茶スタンド",
    description: "厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "茶筅 Chasen — 日本茶スタンド",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "茶筅 Chasen | 日本茶スタンド",
    description: "厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSerifJP.variable}`}
    >
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
