import type { Metadata } from "next";
import StoreMenuLayout from "@/components/StoreMenuLayout";
import Footer from "@/components/Footer";
import { storeContent } from "@/data/storeContent";
import { getFullMenuSections } from "@/lib/notion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "メニュー | Chasen 熊本店",
  description: "Chasen 熊本店の全メニュー。ドリンク・スイーツ・フードメニュー・セット。",
};

export default async function KumamotoMenuPage() {
  const { info, fullMenu: fallback } = storeContent.kumamoto;
  const result = await getFullMenuSections("熊本店").catch(() => ({ ja: fallback, en: [] as typeof fallback }));

  const jaMenu = result.ja.length > 0 ? result.ja : fallback;
  const enMenu = result.en.length > 0 ? result.en : fallback;

  return (
    <>
      <StoreMenuLayout info={info} fullMenu={jaMenu} fullMenuEn={enMenu} />
      <Footer />
    </>
  );
}
