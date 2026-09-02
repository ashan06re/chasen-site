import type { Metadata } from "next";
import { pageAlternates } from "@/lib/i18n";
import StorePageLayout from "@/components/StorePageLayout";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { storeContent } from "@/data/storeContent";
import JsonLd from "@/components/JsonLd";
import { storeSchema } from "@/lib/structuredData";
import { getNewsItems, getStoreInfo, getReservationUrls } from "@/lib/notion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chasen 熊本店",
  description: "熊本・桜町の日本茶スタンド。熊本の自然が育てた茶葉を現代のスタイルで。",
  alternates: pageAlternates("/stores/kumamoto", "ja"),
  openGraph: {
    title: "Chasen 熊本店 | 茶筅 Chasen",
    description: "熊本・桜町の日本茶スタンド。熊本の自然が育てた茶葉を現代のスタイルで。",
    url: "/stores/kumamoto",
    type: "website",
  },
};

export default async function KumamotoStorePage() {
  const [newsResult, infoResult, reservationResult] = await Promise.all([
    getNewsItems("熊本店").catch(() => ({ ja: storeContent.kumamoto.news, en: storeContent.kumamoto.news })),
    getStoreInfo("熊本店").catch(()  => ({ ja: storeContent.kumamoto.info, en: storeContent.kumamoto.info })),
    getReservationUrls().catch(()     => ({ ja: "#", en: "#" })),
  ]);

  const newsEn = newsResult.en.length > 0 ? newsResult.en : storeContent.kumamoto.news;
  const reservationUrl    = reservationResult.ja !== "#" ? reservationResult.ja : undefined;
  const reservationUrlEn  = reservationResult.en !== "#" ? reservationResult.en : undefined;

  return (
    <>
      <JsonLd data={storeSchema(infoResult.ja)} />
      <StorePageLayout
        store={{ ...storeContent.kumamoto, info: infoResult.ja, news: newsResult.ja }}
        newsEn={newsEn}
        infoEn={infoResult.en}
        reservationUrl={reservationUrl}
        reservationUrlEn={reservationUrlEn}
      />
      <Footer />
      <FloatingButtons reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    </>
  );
}
