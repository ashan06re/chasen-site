/** Published CMS edition. Editing Notion never changes a deployed edition. */
import { publishedContent } from './cmsRelease';
type Store = '高台寺店' | '熊本店';
export const getExperience = async () => publishedContent('experience');
export const getAppearance = async () => publishedContent('appearance');
export const getAllNewsItems = async () => publishedContent('news');
export const getBrandStory = async () => publishedContent('brand');
export const getYoshidaSettings = async () => publishedContent('tea');
export const getSiteSettings = async () => publishedContent('site');
export const getBookingSettings = async () => publishedContent('booking');
export const getAllStoreInfo = async () => publishedContent('stores');
export const getReservationUrls = async () => ({ ja: '/reserve', en: '/en/reserve' });
export const getMenuPublication = async (store: Store) => publishedContent('menus')[store].published;
export const getFullMenuSections = async (store: Store) => {
  const menu = publishedContent('menus')[store];
  return menu.published ? menu.sections : { ja: [], en: [] };
};
export const getStoreInfo = async (store: Store) => {
  const all = publishedContent('stores');
  return { ja: all.ja[store], en: all.en[store] };
};
export const getNewsItems = async (store: Store) => {
  const all = publishedContent('news');
  return { ja: all.ja.filter(item => item.store === store), en: all.en.filter(item => item.store === store) };
};
