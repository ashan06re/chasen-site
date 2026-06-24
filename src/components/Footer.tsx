import { getAllStoreInfo, getSiteSettings } from "@/lib/notion";
import { storeContent, defaultSiteSettings, defaultSiteSettingsEn } from "@/data/storeContent";
import FooterContent from "./FooterContent";

export default async function Footer() {
  const [storeInfoResult, settingsResult] = await Promise.all([
    getAllStoreInfo().catch(() => ({
      ja: { "高台寺店": storeContent.kyoto.info,    "熊本店": storeContent.kumamoto.info },
      en: { "高台寺店": storeContent.kyoto.info,    "熊本店": storeContent.kumamoto.info },
    })),
    getSiteSettings().catch(() => ({ ja: defaultSiteSettings, en: defaultSiteSettingsEn })),
  ]);

  return (
    <FooterContent
      kyoto={storeInfoResult.ja["高台寺店"]}
      kumamoto={storeInfoResult.ja["熊本店"]}
      kyotoEn={storeInfoResult.en["高台寺店"]}
      kumamotoEn={storeInfoResult.en["熊本店"]}
      settings={settingsResult.ja}
      settingsEn={settingsResult.en}
    />
  );
}
