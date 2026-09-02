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
  title: "Chasen 高台寺店",
  description: "京都・高台寺近くに佇む日本茶スタンド。厳選茶葉で一杯一杯を丁寧に。",
  alternates: pageAlternates("/stores/kyoto", "ja"),
  openGraph: {
    title: "Chasen 高台寺店 | 茶筅 Chasen",
    description: "京都・高台寺近くに佇む日本茶スタンド。厳選茶葉で一杯一杯を丁寧に。",
    url: "/stores/kyoto",
    type: "website",
  },
};

export default async function KyotoStorePage() {
  const [newsResult, infoResult, reservationResult] = await Promise.all([
    getNewsItems("高台寺店").catch(() => ({ ja: storeContent.kyoto.news, en: storeContent.kyoto.news })),
    getStoreInfo("高台寺店").catch(()  => ({ ja: storeContent.kyoto.info, en: storeContent.kyoto.info })),
    getReservationUrls().catch(()      => ({ ja: "#", en: "#" })),
  ]);

  const newsEn = newsResult.en.length > 0 ? newsResult.en : storeContent.kyoto.news;
  const reservationUrl    = reservationResult.ja !== "#" ? reservationResult.ja : undefined;
  const reservationUrlEn  = reservationResult.en !== "#" ? reservationResult.en : undefined;

  return (
    <>
      <JsonLd data={storeSchema(infoResult.ja)} />
      <StorePageLayout
        store={{ ...storeContent.kyoto, info: infoResult.ja, news: newsResult.ja }}
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
