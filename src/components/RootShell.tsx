import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import { LangProvider, type Lang } from "@/lib/langContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";

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

/**
 * 日本語（/）と英語（/en）の2つのルートレイアウトが共有する <html> 〜 <body>。
 * 言語は URL で決まり、LangProvider に固定値として渡す。
 */
export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${cormorant.variable} ${notoSerifJP.variable}`}>
      <body>
        <LangProvider lang={lang}>{children}</LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
