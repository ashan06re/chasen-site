import data from '../content/cms-release.json';
import type * as Draft from './notionDraft';

export type CmsPayload = {
  experience: Awaited<ReturnType<typeof Draft.getExperience>>;
  appearance: Awaited<ReturnType<typeof Draft.getAppearance>>;
  news: Awaited<ReturnType<typeof Draft.getAllNewsItems>>;
  brand: Awaited<ReturnType<typeof Draft.getBrandStory>>;
  tea: Awaited<ReturnType<typeof Draft.getYoshidaSettings>>;
  site: Awaited<ReturnType<typeof Draft.getSiteSettings>>;
  booking: Awaited<ReturnType<typeof Draft.getBookingSettings>>;
  stores: Awaited<ReturnType<typeof Draft.getAllStoreInfo>>;
  menus: Record<'高台寺店' | '熊本店', { published: boolean; sections: Awaited<ReturnType<typeof Draft.getFullMenuSections>> }>;
  seo: Record<string, { ja: { title: string; description: string }; en: { title: string; description: string } }>;
};
export type CmsRelease = { schema: 1; revision: string; capturedAt: string; payload: CmsPayload; assets: Record<string, { file: string; contentType: string; bytes: number }> };
// Bundled server-side, so an entire deployment reads exactly the reviewed edition.
// There is deliberately no fallback to the editable Notion databases.
export const cmsRelease = data as unknown as CmsRelease;
export function publishedContent<K extends keyof CmsPayload>(key: K): CmsPayload[K] {
  if (cmsRelease.schema !== 1 || !/^[a-f0-9]{64}$/.test(cmsRelease.revision) || !(key in cmsRelease.payload)) throw new Error('Invalid CMS release');
  return structuredClone(cmsRelease.payload[key]);
}
