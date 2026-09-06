import type { Metadata } from "next";
import { pageAlternates } from "@/lib/i18n";
import StoreMenuLayout from "@/components/StoreMenuLayout";
import Footer from "@/components/Footer";
import { storeContent } from "@/data/storeContent";
import { getFullMenuSections, getAllStoreInfo, getReservationUrls } from "@/lib/notion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chasen 熊本店 メニュー",
  description: "Chasen 熊本店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
  alternates: pageAlternates("/stores/kumamoto/menu", "ja"),
  openGraph: {
    title: "Chasen 熊本店 メニュー | 茶筅 Chasen",
    description: "Chasen 熊本店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
    url: "/stores/kumamoto/menu",
    type: "website",
  },
};

export default async function KumamotoMenuPage() {
  const { info, fullMenu: fallback } = storeContent.kumamoto;
  const [result, stores, reservation] = await Promise.all([
    getFullMenuSections("熊本店").catch(() => ({ ja: fallback, en: [] as typeof fallback })),
    getAllStoreInfo().catch(() => null),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
  ]);
  const currentInfo = stores?.ja["熊本店"] || info;

  const jaMenu = result.ja.length > 0 ? result.ja : fallback;
  const enMenu = result.en.length > 0 ? result.en : fallback;

  return (
    <>
      <StoreMenuLayout info={currentInfo} fullMenu={jaMenu} fullMenuEn={enMenu} reservationUrl={reservation.ja !== "#" ? reservation.ja : undefined} reservationUrlEn={reservation.en !== "#" ? reservation.en : undefined} />
      <Footer />
    </>
  );
}
