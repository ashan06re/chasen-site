import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";
import StoreMenuLayout from "@/components/StoreMenuLayout";
import Footer from "@/components/Footer";
import { storeContent } from "@/data/storeContent";
import { getFullMenuSections, getAllStoreInfo, getReservationUrls } from "@/lib/notion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chasen 高台寺店 メニュー",
  description: "Chasen 高台寺店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
  alternates: pageAlternates("/stores/kyoto/menu", "ja"),
  openGraph: { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen" }],
    title: "Chasen 高台寺店 メニュー | 茶筅 Chasen",
    description: "Chasen 高台寺店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
    url: "/stores/kyoto/menu",
    type: "website",
  },
};

export default async function KyotoMenuPage() {
  const { info, fullMenu: fallback } = storeContent.kyoto;
  const [result, stores, reservation] = await Promise.all([
    getFullMenuSections("高台寺店").catch(() => ({ ja: fallback, en: [] as typeof fallback })),
    getAllStoreInfo().catch(() => null),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
  ]);
  const currentInfo = stores?.ja["高台寺店"] || info;

  const jaMenu = result.ja.length > 0 ? result.ja : fallback;
  const enMenu = result.en.length > 0 ? result.en : fallback;

  return (
    <>
      <StoreMenuLayout info={currentInfo} fullMenu={jaMenu} fullMenuEn={enMenu} reservationUrl={reservation.ja !== "#" ? reservation.ja : undefined} reservationUrlEn={reservation.en !== "#" ? reservation.en : undefined} />
      <Footer />
    </>
  );
}
