import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";
import StoreMenuLayout from "@/components/StoreMenuLayout";
import MenuUpcoming from "@/components/MenuUpcoming";
import { getMenuPublication } from "@/lib/notion";
import Footer from "@/components/Footer";
import { storeContent } from "@/data/storeContent";
import { getFullMenuSections, getAllStoreInfo, getReservationUrls, getExperience, getAppearance } from "@/lib/notion";

export const revalidate = 0;

export async function generateMetadata() { return cmsMetadata("/stores/kyoto/menu", "ja", defaultMetadata); }
const defaultMetadata: Metadata = {
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
  const { info } = storeContent.kyoto;
  const [published, stores] = await Promise.all([
    getMenuPublication("高台寺店"),
    getAllStoreInfo().catch(() => null),
  ]);
  const currentInfo = stores?.ja["高台寺店"] || info;
  if (!published) return <><MenuUpcoming info={currentInfo} /><Footer /></>;
  const [result, reservation, experience, appearance] = await Promise.all([
    getFullMenuSections("高台寺店").catch(() => ({ ja: [], en: [] })),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
    getExperience(), getAppearance(),
  ]);

  if (!result.ja.length) return <><MenuUpcoming info={currentInfo} /><Footer /></>;
  const jaMenu = result.ja;
  const enMenu = result.en;

  return (
    <>
      <StoreMenuLayout info={currentInfo} fullMenu={jaMenu} fullMenuEn={enMenu} experience={experience} appearance={appearance} reservationUrl={reservation.ja !== "#" ? reservation.ja : undefined} reservationUrlEn={reservation.en !== "#" ? reservation.en : undefined} />
      <Footer />
    </>
  );
}
