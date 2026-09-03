import Header from "@/components/Header";
import Opening from "@/components/opening/Opening";
import SmoothScroll from "@/components/SmoothScroll";
import BrandStorySection from "@/components/BrandStorySection";
import YoshidaSection from "@/components/YoshidaSection";
import StoreSection from "@/components/StoreSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import {
  storeContent,
  defaultBrandStory,
  defaultBrandStoryEn,
  defaultYoshidaFeatures,
  defaultYoshidaFeaturesEn,
  defaultYoshidaSettings,
  defaultYoshidaSettingsEn,
  defaultSiteSettings,
  defaultSiteSettingsEn,
} from "@/data/storeContent";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, storeSchema } from "@/lib/structuredData";
import {
  getMenuCards,
  getBrandStory,
  getYoshidaFeatures,
  getYoshidaSettings,
  getYoshidaImages,
  getSiteSettings,
  getReservationUrls,
  getAllStoreInfo,
} from "@/lib/notion";

export const revalidate = 60;

export default async function HomePage() {
  const [
    kyotoResult,
    kumamotoResult,
    brandStoryResult,
    yoshidaFeaturesResult,
    yoshidaSettingsResult,
    yoshidaImagesResult,
    siteSettingsResult,
    storeInfoResult,
    reservationResult,
  ] = await Promise.all([
    getMenuCards("高台寺店").catch(() => ({ ja: storeContent.kyoto.menuCards,    en: storeContent.kyoto.menuCards    })),
    getMenuCards("熊本店").catch(()   => ({ ja: storeContent.kumamoto.menuCards, en: storeContent.kumamoto.menuCards })),
    getBrandStory().catch(()          => ({ ja: defaultBrandStory,         en: defaultBrandStoryEn         })),
    getYoshidaFeatures().catch(()     => ({ ja: defaultYoshidaFeatures,    en: defaultYoshidaFeaturesEn    })),
    getYoshidaSettings().catch(()     => ({ ja: defaultYoshidaSettings,    en: defaultYoshidaSettingsEn    })),
    getYoshidaImages().catch(()       => ({})),
    getSiteSettings().catch(()        => ({ ja: defaultSiteSettings,       en: defaultSiteSettingsEn       })),
    getAllStoreInfo().catch(()         => ({
      ja: { "高台寺店": storeContent.kyoto.info,    "熊本店": storeContent.kumamoto.info },
      en: { "高台寺店": storeContent.kyoto.info,    "熊本店": storeContent.kumamoto.info },
    })),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
  ]);

  const kyotoInfo    = storeInfoResult.ja["高台寺店"];
  const kumamotoInfo = storeInfoResult.ja["熊本店"];

  const kyotoCardsEn    = kyotoResult.en.length    > 0 ? kyotoResult.en    : storeContent.kyoto.menuCards;
  const kumamotoCardsEn = kumamotoResult.en.length > 0 ? kumamotoResult.en : storeContent.kumamoto.menuCards;

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(siteSettingsResult.ja.contactEmail),
          websiteSchema(),
          storeSchema(kyotoInfo),
          storeSchema(kumamotoInfo),
        ]}
      />
      <SmoothScroll />
      <Header />
      <main>
        <Opening />
        <BrandStorySection
          content={brandStoryResult.ja}
          contentEn={brandStoryResult.en}
        />
        <YoshidaSection
          settings={yoshidaSettingsResult.ja}
          features={yoshidaFeaturesResult.ja}
          settingsEn={yoshidaSettingsResult.en}
          featuresEn={yoshidaFeaturesResult.en}
          images={yoshidaImagesResult}
        />
        <StoreSection
          store={{ ...storeContent.kyoto, info: kyotoInfo, menuCards: kyotoResult.ja }}
          menuCardsEn={kyotoCardsEn}
        />
        <StoreSection
          store={{ ...storeContent.kumamoto, info: kumamotoInfo, menuCards: kumamotoResult.ja }}
          menuCardsEn={kumamotoCardsEn}
          dark
        />
        <ContactSection
          settings={siteSettingsResult.ja}
          settingsEn={siteSettingsResult.en}
          reservationUrl={reservationResult.ja !== "#" ? reservationResult.ja : undefined}
          reservationUrlEn={reservationResult.en !== "#" ? reservationResult.en : undefined}
        />
      </main>
      <Footer />
      <FloatingButtons
        reservationUrl={reservationResult.ja !== "#" ? reservationResult.ja : undefined}
        reservationUrlEn={reservationResult.en !== "#" ? reservationResult.en : undefined}
      />
    </>
  );
}
