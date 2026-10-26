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
}

/** Food and hospitality first. Stable IDs are separate from the legacy CMS scene IDs. */
export const BRAND_CHAPTERS: readonly BrandChapter[] = [
  { id: 'tamatebako', label: '01 / SIGNATURE', name: '玉手箱', nameEn: 'Tamatebako', title: 'ひらく、玉手箱。\n広がる、抹茶の楽しみ。', titleEn: 'Lift the lid.\nDiscover matcha.', body: '白木の箱に、抹茶スイーツの楽しみを。\n目で楽しみ、ひとくちずつ味わう、茶筅のひととき。', bodyEn: 'A wooden box of matcha sweets. A little wonder to discover, one delicious bite at a time.', caption: '玉手箱は、ご予約なしでお楽しみいただけます。', captionEn: 'No advance reservation is required for Tamatebako.' },
  { id: 'sweets', label: '02 / MATCHA SWEETS', name: '抹茶スイーツ', nameEn: 'Matcha sweets', title: '抹茶の余韻を、\n甘いひとくちに。', titleEn: 'Rich matcha.\nA sweeter moment.', body: '香り、ほろ苦さ、やさしい甘さ。\n食感まで楽しむ、茶筅の抹茶スイーツ。', bodyEn: 'Fragrance, a gentle bitterness, and sweetness. Discover the textures and pleasures of matcha sweets.', caption: 'スイーツの内容・提供状況は、各店のお品書きへ。', captionEn: 'See each shop’s menu for sweets and availability.' },
  { id: 'cuisine', label: '03 / DINING', name: 'お料理', nameEn: 'Dining', title: '甘い時間の前に、\nおいしい一皿を。', titleEn: 'Stay for a meal.\nLinger for sweets.', body: 'お食事から甘味まで、その日の気分に合わせて。\nひとつの席で、茶筅の味わいを。', bodyEn: 'From a satisfying meal to matcha sweets, settle in and enjoy Chasen at your own pace.', caption: 'お料理の内容は店舗によって異なります。', captionEn: 'Dishes vary by location. Explore each shop’s menu.' },
  { id: 'origin', label: '04 / YOSHIDA MEICHAEN', name: '吉田銘茶園', nameEn: 'Our tea origin', title: 'おいしさの背景に、\n宇治のお茶。', titleEn: 'Behind the flavour,\nthe tea of Uji.', body: '茶筅のお茶を支える、宇治・吉田銘茶園。\n育まれた香りと味わいを、スイーツや一杯のお茶へ。', bodyEn: 'Yoshida Meichaen in Uji is our tea partner. Its tea brings depth and fragrance to the Chasen experience.', caption: '吉田銘茶園の覆下茶園。', captionEn: 'Yoshida Meichaen’s shaded tea garden.' },
  { id: 'space', label: '05 / TIME AT CHASEN', name: '茶筅の空間', nameEn: 'Time at Chasen', title: '味わう時間も、\nごちそうに。', titleEn: 'A place to pause.\nA moment to savour.', body: '京都・高台寺と熊本。\nそれぞれの街で、お料理と抹茶スイーツをゆっくりと。', bodyEn: 'In Kyoto’s Kodaiji neighbourhood and in Kumamoto, make time for good food, matcha sweets, and conversation.', caption: '高台寺店の窓辺。', captionEn: 'The window counter at Chasen Kodaiji.' },
];
