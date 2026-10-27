export interface BrandChapter {
  id: string;
  label: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  caption: string;
  captionEn: string;
  image?: string;
  alt?: string;
  altEn?: string;
  motion?: boolean;
}

/** Food and hospitality first. Stable IDs are separate from the legacy CMS scene IDs. */
export const BRAND_CHAPTERS: readonly BrandChapter[] = [
  { id: 'tamatebako', label: '01 / SIGNATURE', name: '玉手箱', nameEn: 'Tamatebako', title: 'ひらく、玉手箱。\n広がる、抹茶の楽しみ。', titleEn: 'Lift the lid.\nDiscover matcha.', body: '白木の箱に、抹茶スイーツの楽しみを。\n目で楽しみ、ひとくちずつ味わう、茶筅のひととき。', bodyEn: 'A wooden box of matcha sweets. A little wonder to discover, one delicious bite at a time.', caption: '玉手箱は、ご予約なしでお楽しみいただけます。', captionEn: 'No advance reservation is required for Tamatebako.' },
  { id: 'sweets', label: '02 / MATCHA SWEETS', name: '抹茶スイーツ', nameEn: 'Matcha sweets', title: '抹茶の余韻を、\n甘いひとくちに。', titleEn: 'Rich matcha.\nA sweeter moment.', body: '香り、ほろ苦さ、やさしい甘さ。\n食感まで楽しむ、茶筅の抹茶スイーツ。', bodyEn: 'Fragrance, a gentle bitterness, and sweetness. Discover the textures and pleasures of matcha sweets.', caption: 'スイーツの内容・提供状況は、各店のお品書きへ。', captionEn: 'See each shop’s menu for sweets and availability.' },
  { id: 'cuisine', label: '03 / DINING', name: 'お料理', nameEn: 'Dining', title: '甘い時間の前に、\nおいしい一皿を。', titleEn: 'Stay for a meal.\nLinger for sweets.', body: 'お食事から甘味まで、その日の気分に合わせて。\nひとつの席で、茶筅の味わいを。', bodyEn: 'From a satisfying meal to matcha sweets, settle in and enjoy Chasen at your own pace.', caption: 'お料理の内容は店舗によって異なります。', captionEn: 'Dishes vary by location. Explore each shop’s menu.' },
  { id: 'origin', label: '04 / YOSHIDA MEICHAEN', name: '吉田銘茶園', nameEn: 'Our tea origin', title: 'おいしさの背景に、\n宇治のお茶。', titleEn: 'Behind the flavour,\nthe tea of Uji.', body: '茶筅のお茶を支える、宇治・吉田銘茶園。\n育まれた香りと味わいを、スイーツや一杯のお茶へ。', bodyEn: 'Yoshida Meichaen in Uji is our tea partner. Its tea brings depth and fragrance to the Chasen experience.', caption: '吉田銘茶園の覆下茶園。', captionEn: 'Yoshida Meichaen’s shaded tea garden.' },
  { id: 'space', label: '05 / TIME AT CHASEN', name: '茶筅の空間', nameEn: 'Time at Chasen', title: '味わう時間も、\nごちそうに。', titleEn: 'A place to pause.\nA moment to savour.', body: '京都・高台寺と熊本。\nそれぞれの街で、お料理と抹茶スイーツをゆっくりと。', bodyEn: 'In Kyoto’s Kodaiji neighbourhood and in Kumamoto, make time for good food, matcha sweets, and conversation.', caption: '高台寺店の窓辺。', captionEn: 'The window counter at Chasen Kodaiji.' },
];

/** New placements are ignored by the currently deployed legacy home. */
export const JOURNEY_PLACEMENTS = ['新ホーム｜玉手箱', '新ホーム｜抹茶スイーツ', '新ホーム｜お料理', '新ホーム｜吉田銘茶園', '新ホーム｜茶筅の空間'] as const;
export interface JourneyIntro { identity: string; identityEn: string; label: string; title: string; titleEn: string; body: string; bodyEn: string }
export const DEFAULT_JOURNEY_INTRO: JourneyIntro = {
  identity: '抹茶スイーツと料理を楽しむ、京都・熊本の茶筅。', identityEn: 'CHASEN / MATCHA SWEETS & DINING',
  label: 'MATCHA, FOOD & A LITTLE WONDER', title: 'お料理を楽しみ、\n抹茶にときめく。\nそんな一日を、茶筅で。', titleEn: 'For the meal.\nFor the matcha.\nFor the moment.',
  body: '宇治のお茶の香りも、甘味の楽しみも。\nひとつの場所で、ゆっくり味わう。', bodyEn: 'The tea of Uji, the pleasure of sweets, and time well spent.',
};
export const DEFAULT_IMAGE_DESCRIPTIONS: Record<string, {ja: string; en: string}> = {
  tamatebako: {ja:'木箱に盛り合わせた抹茶の甘味と京都の夕景',en:'Matcha sweets in a wooden box against an evening Kyoto view'},
  sweets: {ja:'ガラスの器に盛った抹茶のかき氷',en:'Matcha shaved ice in a glass bowl'},
  cuisine: {ja:'木の器に盛った肉料理',en:'A meat and rice dish in a wooden vessel'},
  origin: {ja:'黒い覆いの下に広がる宇治の茶園',en:'Uji tea rows beneath a shade canopy'},
  space: {ja:'高台寺店の木のカウンターと青緑の椅子',en:'The Kodaiji interior with a wooden counter and teal chairs'},
};
export function defaultJourney(): BrandChapter[] {
  return BRAND_CHAPTERS.map(chapter => ({...chapter, image: `/journey/${chapter.id}.webp`, alt: DEFAULT_IMAGE_DESCRIPTIONS[chapter.id].ja, altEn: DEFAULT_IMAGE_DESCRIPTIONS[chapter.id].en, motion:true}));
}
