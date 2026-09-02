import type { Metadata } from "next";
import StoreMenuLayout from "@/components/StoreMenuLayout";
import Footer from "@/components/Footer";
import { storeContent } from "@/data/storeContent";
import { getFullMenuSections } from "@/lib/notion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chasen 高台寺店 メニュー",
  description: "Chasen 高台寺店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
  alternates: { canonical: "/stores/kyoto/menu" },
  openGraph: {
    title: "Chasen 高台寺店 メニュー | 茶筅 Chasen",
    description: "Chasen 高台寺店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
    url: "/stores/kyoto/menu",
    type: "website",
  },
};

export default async function KyotoMenuPage() {
  const { info, fullMenu: fallback } = storeContent.kyoto;
  const result = await getFullMenuSections("高台寺店").catch(() => ({ ja: fallback, en: [] as typeof fallback }));

  const jaMenu = result.ja.length > 0 ? result.ja : fallback;
  const enMenu = result.en.length > 0 ? result.en : fallback;

  return (
    <>
      <StoreMenuLayout info={info} fullMenu={jaMenu} fullMenuEn={enMenu} />
      <Footer />
    </>
  );
}
