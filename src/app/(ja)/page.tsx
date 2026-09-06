import Header from "@/components/Header";
import { cmsMetadata } from '@/lib/cmsMetadata';
import { metadata as defaultMetadata } from './layout';
export async function generateMetadata() { return cmsMetadata('/', 'ja', defaultMetadata); }
import ImmersiveHome from "@/components/ImmersiveHome";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { storeContent, defaultBrandStory, defaultBrandStoryEn, defaultYoshidaSettings, defaultYoshidaSettingsEn, defaultSiteSettings, defaultSiteSettingsEn } from "@/data/storeContent";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, storeSchema } from "@/lib/structuredData";
import { getBrandStory, getYoshidaSettings, getSiteSettings, getReservationUrls, getAllStoreInfo, getExperience, getAppearance } from "@/lib/notion";

export const revalidate = 60;

export default async function HomePage() {
  const [brand, tea, settings, stores, reservation, experience, appearance] = await Promise.all([
    getBrandStory().catch(() => ({ ja: defaultBrandStory, en: defaultBrandStoryEn })),
    getYoshidaSettings().catch(() => ({ ja: defaultYoshidaSettings, en: defaultYoshidaSettingsEn })),
    getSiteSettings().catch(() => ({ ja: defaultSiteSettings, en: defaultSiteSettingsEn })),
    getAllStoreInfo().catch(() => ({ ja: { "高台寺店": storeContent.kyoto.info, "熊本店": storeContent.kumamoto.info }, en: { "高台寺店": storeContent.kyoto.info, "熊本店": storeContent.kumamoto.info } })),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
    getExperience(), getAppearance(),
  ]);
  const kyoto = stores.ja["高台寺店"] || storeContent.kyoto.info;
  const kumamoto = stores.ja["熊本店"] || storeContent.kumamoto.info;
  const reservationUrl = reservation.ja !== "#" ? reservation.ja : undefined;
  const reservationUrlEn = reservation.en !== "#" ? reservation.en : undefined;
  return <>
    <JsonLd data={[organizationSchema(settings.ja.contactEmail), websiteSchema(), storeSchema(kyoto), storeSchema(kumamoto)]} />
    <Header initialDark reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    <main>
      <ImmersiveHome kyoto={kyoto} kumamoto={kumamoto} brand={brand.ja} brandEn={brand.en} tea={tea.ja} teaEn={tea.en} experience={experience} appearance={appearance} />
      <ContactSection settings={settings.ja} settingsEn={settings.en} reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    </main>
    <Footer />
  </>;
}
