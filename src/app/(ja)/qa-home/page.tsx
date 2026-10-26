import Header from "@/components/Header";
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BRAND_CHAPTERS } from '@/lib/brandJourney';
export const metadata = { title: 'CHASEN — local design review', robots: { index: false, follow: false } };
import ImmersiveHome from "@/components/ImmersiveHome";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { storeContent, defaultBrandStory, defaultBrandStoryEn, defaultYoshidaSettings, defaultYoshidaSettingsEn, defaultSiteSettings, defaultSiteSettingsEn } from "@/data/storeContent";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, storeSchema } from "@/lib/structuredData";
import { getBrandStory, getYoshidaSettings, getSiteSettings, getReservationUrls, getAllStoreInfo, getExperience, getAppearance } from "@/lib/notion";

export const dynamic = "force-dynamic";

/** Pending artwork is read only in an explicitly enabled local review. Never deployed. */
export default async function HomeReviewPage() {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== '1' || !process.env.CHASEN_HERO_REVIEW_FILE) notFound();
  const candidate = await readFile(process.env.CHASEN_HERO_REVIEW_FILE).catch(() => null);
  if (!candidate) notFound();
  const [brand, tea, settings, stores, reservation, experience, appearance] = await Promise.all([
    getBrandStory().catch(() => ({ ja: defaultBrandStory, en: defaultBrandStoryEn })),
    getYoshidaSettings().catch(() => ({ ja: defaultYoshidaSettings, en: defaultYoshidaSettingsEn })),
    getSiteSettings().catch(() => ({ ja: defaultSiteSettings, en: defaultSiteSettingsEn })),
    getAllStoreInfo().catch(() => ({ ja: { "高台寺店": storeContent.kyoto.info, "熊本店": storeContent.kumamoto.info }, en: { "高台寺店": storeContent.kyoto.info, "熊本店": storeContent.kumamoto.info } })),
    getReservationUrls().catch(() => ({ ja: "#", en: "#" })),
    getExperience(), getAppearance(),
  ]);
  experience.scenes = experience.scenes.map(scene => scene.id === '05' ? {
    ...scene, src: `data:image/webp;base64,${candidate.toString('base64')}`,
    mobileSrc: undefined, depth: undefined, aspect: 1672 / 941, motion: false,
    alt: '木箱の甘味と京都の夕景を描いた玉手箱の制作候補',
    altEn: 'A Tamatebako concept image with sweets and an evening Kyoto view',
  } : scene);
  if (process.env.CHASEN_JOURNEY_REVIEW_DIR) {
    const reviewDir = process.env.CHASEN_JOURNEY_REVIEW_DIR;
    const readArt = async (file: string) => `data:image/webp;base64,${(await readFile(join(reviewDir, file))).toString('base64')}`;
    const [box, sweets, cuisine, background, origin, space] = await Promise.all([
      'tamatebako-subject.webp', 'sweets-subject.webp', 'cuisine-subject.webp',
      'tamatebako-background.webp', 'origin-background.webp', 'space-background.webp',
    ].map(readArt));
    experience.journey = BRAND_CHAPTERS.map(chapter => ({ ...chapter,
      subject: chapter.id === 'tamatebako' ? box : chapter.id === 'sweets' ? sweets : chapter.id === 'cuisine' ? cuisine : undefined,
      background: chapter.id === 'tamatebako' ? background : chapter.id === 'origin' ? origin : chapter.id === 'space' ? space : undefined,
    }));
  }
  const kyoto = stores.ja["高台寺店"] || storeContent.kyoto.info;
  const kumamoto = stores.ja["熊本店"] || storeContent.kumamoto.info;
  const reservationUrl = reservation.ja !== "#" ? reservation.ja : undefined;
  const reservationUrlEn = reservation.en !== "#" ? reservation.en : undefined;
  return <>
    <JsonLd data={[organizationSchema(settings.ja.contactEmail), websiteSchema(), storeSchema(kyoto), storeSchema(kumamoto)]} />
    <Header initialDark reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    <main>
      <ImmersiveHome kyoto={kyoto} kumamoto={kumamoto} kyotoEn={stores.en["高台寺店"]} kumamotoEn={stores.en["熊本店"]} brand={brand.ja} brandEn={brand.en} tea={tea.ja} teaEn={tea.en} experience={experience} appearance={appearance} />
      <ContactSection settings={settings.ja} settingsEn={settings.en} reservationUrl={reservationUrl} reservationUrlEn={reservationUrlEn} />
    </main>
    <Footer />
  </>;
}
