import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";
import StorePageLayout from "@/components/StorePageLayout";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { storeContent } from "@/data/storeContent";
import JsonLd from "@/components/JsonLd";
import { storeSchema } from "@/lib/structuredData";
import { getNewsItems, getStoreInfo, getReservationUrls, getExperience } from "@/lib/notion";

export const revalidate = 60;

export async function generateMetadata() { return cmsMetadata("/stores/kyoto", "ja", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Chasen 高台寺店",
  description: "京都・高台寺近くに佇む日本茶スタンド。厳選茶葉で一杯一杯を丁寧に。",
  alternates: pageAlternates("/stores/kyoto", "ja"),
  openGraph: { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen" }],
    title: "Chasen 高台寺店 | 茶筅 Chasen",
    description: "京都・高台寺近くに佇む日本茶スタンド。厳選茶葉で一杯一杯を丁寧に。",
    url: "/stores/kyoto",
    type: "website",
  },
};

export default async function KyotoStorePage() {
  const [newsResult, infoResult, reservationResult, experience] = await Promise.all([
    getNewsItems("高台寺店").catch(() => ({ ja: storeContent.kyoto.news, en: storeContent.kyoto.news })),
    getStoreInfo("高台寺店").catch(()  => ({ ja: storeContent.kyoto.info, en: storeContent.kyoto.info })),
    getReservationUrls().catch(()      => ({ ja: "#", en: "#" })),
    getExperience(),
  ]);

  const newsEn = newsResult.en.length > 0 ? newsResult.en : storeContent.kyoto.news;
  const reservationUrl    = reservationResult.ja !== "#" ? reservationResult.ja : undefined;
  const reservationUrlEn  = reservationResult.en !== "#" ? reservationResult.en : undefined;

  return (
    <>
      <JsonLd data={storeSchema(infoResult.ja)} />
      <StorePageLayout
        experience={experience}
        store={{ info: infoResult.ja, news: newsResult.ja }}
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
