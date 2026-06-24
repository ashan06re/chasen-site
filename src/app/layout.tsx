import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/langContext";

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
  title: "茶筅 Chasen | 日本茶スタンド",
  description:
    "京都・熊本に展開する日本茶スタンド「茶筅」。厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
  keywords: "茶筅, Chasen, 日本茶, 抹茶, 京都, 熊本, お茶, カフェ",
  openGraph: {
    title: "茶筅 Chasen | 日本茶スタンド",
    description: "厳選された日本茶を、現代の暮らしに合わせた形でお届けします。",
    locale: "ja_JP",
    type: "website",
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
