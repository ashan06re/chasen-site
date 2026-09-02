import { INSTAGRAM } from "@/lib/site";

/**
 * ===================================================
 *  茶筅 Chasen — 店舗コンテンツ 一元管理ファイル
 * ===================================================
 *
 * ホームページのメニューカード・各店舗ページのニュースは
 * すべてここを編集するだけで反映されます。
 *
 * ▼ 編集方法
 *   - メニューカードを追加/変更 → 各店舗の `menuCards` を編集
 *   - ニュース・お知らせを追加/変更 → 各店舗の `news` を編集
 *   - 店舗情報を変更 → 各店舗の `info` を編集
 *
 * 将来的に Notion CMS と連携する場合は、このファイルの
 * データを Notion API のレスポンスに差し替えるだけで対応できます。
 * ===================================================
 */

// ────────────────────────────────────────────────────
// 型定義
// ────────────────────────────────────────────────────

export interface MenuCard {
  category: string;
  categoryEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price?: string;
  accent: string;
  bg: string;
  photoUrl?: string;
}

export interface NewsItem {
  badge: string;
  badgeEn?: string;
  badgeColor: string;
  title: string;
  titleEn?: string;
  body: string;
  bodyEn?: string;
  date: string;     // 例: "2026.06"
}

export interface BrandNewsItem extends NewsItem {
  store?: string;   // 例: "高台寺店" / "熊本店"
}

export interface StoreInfo {
  slug: "kyoto" | "kumamoto";
  name: string;       // 例: "Chasen 高台寺店"
  nameJa: string;     // 例: "茶筅 高台寺"
  nameEn?: string;    // 例: "Chasen Kodaiji"
  area: string;       // 例: "Kyoto"
  address: string;
  tel?: string;       // 例: "075-366-5905"（Notion「店舗情報」DBで管理）
  hours: string;
  closed: string;
  closedEn?: string;
  access: string;
  accessEn?: string;
  description: string;
  descriptionEn?: string;
  accentColor: string; // 店舗ページHeroの背景色
  instagram?: string;  // 店舗の公式 Instagram URL（Notion「店舗情報」DB で管理。無ければ site.ts の INSTAGRAM）
}

export interface FullMenuItem {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: string;
  note?: string;      // 例: "hot / ice", "夏季限定", "平日限定"
  noteEn?: string;
  photoUrl?: string;
}

export interface FullMenuSection {
  id: string;
  label: string;      // 日本語ラベル
  labelEn: string;    // 英語ラベル
  accent: string;     // アクセントカラー
  items: FullMenuItem[];
}

export interface StoreContent {
  info: StoreInfo;
  menuCards: MenuCard[];        // ホームページのメニューカード
  news: NewsItem[];             // 店舗ページの月替わりニュース
  fullMenu: FullMenuSection[];  // 店舗メニュー一覧ページ用
}

export interface BrandStoryContent {
  catchphrase: string;
  catchphraseHighlight: string;
  body1: string;
  body2: string;
  body3: string;
}

export interface YoshidaSettings {
  label: string;
  nameJa: string;
  nameEn: string;
  intro: string;
}

export interface YoshidaImages {
  main?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
}

export interface SiteSettings {
  heroEnglishLabel: string;
  heroCatchphrase: string;
  footerTagline: string;
  contactDescription: string;
  contactReservationUrl: string;
  contactEmail: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroEnglishLabel: "Japanese Tea Stand",
  heroCatchphrase: "日本の茶文化を、現代の日常へ。",
  footerTagline: "日本茶スタンド",
  contactDescription: "ご来店のご予約や、各種お問い合わせはこちらから。\n担当者が確認の上、メールにてご返信いたします。",
  contactReservationUrl: "#",
  contactEmail: "chasen.ky01@gmail.com",
};

export const defaultSiteSettingsEn: SiteSettings = {
  heroEnglishLabel: "Japanese Tea Stand",
  heroCatchphrase: "Bringing Japanese tea culture into modern everyday life.",
  footerTagline: "Japanese Tea Stand",
  contactDescription: "For reservations and general inquiries, please use the links below.\nWe will respond by email as soon as possible.",
  contactReservationUrl: "#",
  contactEmail: "chasen.ky01@gmail.com",
};

export interface YoshidaFeature {
  icon: string;      // 例: "01", "02", "03"
  name: string;
  description: string;
}

export const defaultBrandStory: BrandStoryContent = {
  catchphrase: "一杯の茶が、",
  catchphraseHighlight: "日常を変える。",
  body1: "茶筅（Chasen）は、日本茶の持つ豊かな香りと味わいを、もっと気軽に、もっと日常に取り入れてほしいという想いから生まれた日本茶スタンドです。",
  body2: "厳選した産地の茶葉を丁寧に仕入れ、一杯一杯を心を込めて仕上げます。京都・熊本の二店舗から、茶の文化を現代の暮らしへとつなぎます。",
  body3: "茶筅という名前には、「一杯の茶の価値を見直してほしい」という願いが込められています。",
};

export const defaultBrandStoryEn: BrandStoryContent = {
  catchphrase: "A single cup",
  catchphraseHighlight: "changes your day.",
  body1: "Chasen is a Japanese tea stand born from a simple desire — to make the rich flavors and aromas of Japanese tea more accessible and woven into everyday life.",
  body2: "We carefully source tea leaves from select producers and craft each cup with care. From our two locations in Kyoto and Kumamoto, we connect the culture of tea to modern living.",
  body3: "The name 'Chasen' carries a wish: that you pause and rediscover the quiet value of a single, well-made cup of tea.",
};

export const defaultYoshidaSettings: YoshidaSettings = {
  label:  "Our Tea Partner",
  nameJa: "吉田\n銘茶\n園",
  nameEn: "Yoshida Meichaen",
  intro:
    "茶葉のほとんどを、信頼できる生産者・吉田銘茶園から仕入れています。" +
    "土地と向き合い続ける農家と、職人の手仕事が融合した茶葉だけを選び抜き、" +
    "茶筅の一杯に込めています。産地への敬意が、味わいに宿ります。",
};

export const defaultYoshidaSettingsEn: YoshidaSettings = {
  label:  "Our Tea Partner",
  nameJa: "吉田\n銘茶\n園",
  nameEn: "Yoshida Meichaen",
  intro:
    "We source most of our tea leaves from a trusted partner — Yoshida Meichaen. " +
    "We select only the finest leaves, born from the union of farmers who live and breathe the land " +
    "and artisans who bring generations of craft to every harvest. " +
    "Respect for the origin lives in every sip.",
};

export const defaultYoshidaFeatures: YoshidaFeature[] = [
  {
    icon: "01",
    name: "土地への敬意",
    description:
      "自然の恵みを最大限に引き出す農法で、茶畑の土から丁寧に向き合い続ける吉田銘茶園の姿勢が、豊かな風味を生み出します。",
  },
  {
    icon: "02",
    name: "職人の技",
    description:
      "代々受け継がれてきた茶づくりの知恵と、現代の技術を融合させた独自の製法が、吉田銘茶園の茶葉に深みと個性をもたらします。",
  },
  {
    icon: "03",
    name: "厳選の茶葉",
    description:
      "収穫の時期・天候・葉の状態を見極め、最上の状態でのみ摘まれた茶葉だけを仕入れ、茶筅の一杯に使用しています。",
  },
];

export const defaultYoshidaFeaturesEn: YoshidaFeature[] = [
  {
    icon: "01",
    name: "Respect for the Land",
    description:
      "Yoshida Meichaen's commitment to farming in harmony with nature — tending the soil of their tea fields with care — is what gives their leaves such a rich, expressive flavor.",
  },
  {
    icon: "02",
    name: "Artisan Craft",
    description:
      "A unique process that blends wisdom passed down through generations with modern technique, giving Yoshida Meichaen's leaves their distinctive depth and character.",
  },
  {
    icon: "03",
    name: "Curated Leaves",
    description:
      "Only leaves harvested at their peak — judged by season, weather, and condition — are selected for use in every cup at Chasen.",
  },
];

// ────────────────────────────────────────────────────
// 京都 高台寺店
// ────────────────────────────────────────────────────

const kyoto: StoreContent = {
  info: {
    slug: "kyoto",
    name: "Chasen 高台寺店",
    nameJa: "茶筅 高台寺",
    nameEn: "Chasen Kodaiji",
    area: "Kyoto",
    address: "〒605-0825 京都府京都市東山区下河原町高台寺境内",
    tel: "075-366-5905",
    hours: "11:00 — 22:00",
    closed: "不定休",
    closedEn: "Irregular",
    access: "京阪「祇園四条」駅より徒歩約15分",
    accessEn: "Approx. 15 min walk from Keihan 'Gion-Shijo' Station",
    description:
      "京都・高台寺のほど近く、石畳の路地に佇む日本茶スタンド。歴史ある街並みに溶け込みながら、訪れた方に一杯の茶でほっとしてほしいという想いで営業しています。厳選した産地の茶葉を、一杯一杯丁寧に仕上げます。",
    descriptionEn:
      "A Japanese tea stand nestled in a cobblestone alley near Kodaiji Temple in Kyoto. Blending quietly into the historic streetscape, we welcome every visitor with a carefully crafted cup made from select tea leaves.",
    accentColor: "#2A4D25",
    instagram: INSTAGRAM.kyoto,
  },

  // ▼ ここを編集 → ホームページのメニューカードに即反映
  menuCards: [
    {
      category: "季節のおすすめ",
      categoryEn: "Seasonal Pick",
      title: "抹茶オーレ",
      titleEn: "Matcha Au Lait",
      description: "濃厚な宇治抹茶をベースに、なめらかなミルクを合わせた一杯。",
      descriptionEn: "Rich Uji matcha paired with smooth, creamy milk.",
      price: "¥ 650",
      accent: "#3D6B35",
      bg: "#E8F0E4",
    },
    {
      category: "人気メニュー",
      categoryEn: "Popular",
      title: "煎茶ソーダ",
      titleEn: "Sencha Soda",
      description: "清々しい煎茶の旨みを炭酸水で引き立てた、夏らしい一杯。",
      descriptionEn: "Bright sencha flavor lifted by sparkling water — a perfect summer drink.",
      price: "¥ 600",
      accent: "#2A4D25",
      bg: "#F0F5ED",
    },
    {
      category: "限定品",
      categoryEn: "Limited",
      title: "和三盆ラテ",
      titleEn: "Wasanbon Latte",
      description: "希少な和三盆糖を使った、上品な甘みのラテ。",
      descriptionEn: "A refined latte sweetened with rare wasanbon sugar.",
      price: "¥ 750",
      accent: "#B8A882",
      bg: "#F5F0E8",
    },
    {
      category: "お知らせ",
      categoryEn: "News",
      title: "テイクアウト開始",
      titleEn: "Takeout Now Available",
      description: "2024年より一部メニューのテイクアウトを開始しました。散策のお供にどうぞ。",
      descriptionEn: "Select menu items are now available for takeout. Perfect to enjoy on a stroll.",
      accent: "#6B6B5E",
      bg: "#F7F5F0",
    },
    {
      category: "仕入れ情報",
      categoryEn: "Sourcing",
      title: "吉田銘茶園より",
      titleEn: "From Yoshida Meichaen",
      description: "今期の新茶が入荷しました。爽やかな若草の香りをお楽しみください。",
      descriptionEn: "This season's first-flush tea has arrived. Enjoy the fresh, vibrant aroma of young leaves.",
      accent: "#3D6B35",
      bg: "#EDF2EB",
    },
  ],

  // ▼ ここを編集 → /stores/kyoto/menu の全メニューページに即反映
  fullMenu: [
    {
      id: "drink",
      label: "ドリンク",
      labelEn: "Drink",
      accent: "#3D6B35",
      items: [
        {
          name: "宇治抹茶ラテ",
          nameEn: "Uji Matcha Latte",
          description: "京都宇治産の濃厚な石臼挽き抹茶と、なめらかなミルクを合わせた定番の一杯。",
          descriptionEn: "A signature cup of stone-ground matcha from Uji, Kyoto, paired with smooth milk.",
          price: "¥ 680",
          note: "hot / ice",
          noteEn: "hot / ice",
        },
        {
          name: "煎茶ソーダ",
          nameEn: "Sencha Soda",
          description: "清々しい煎茶の旨みを炭酸水で引き立てた、爽快な夏の一杯。",
          descriptionEn: "The bright, clean flavor of sencha lifted by sparkling water — a refreshing summer treat.",
          price: "¥ 620",
          note: "ice",
          noteEn: "ice",
        },
        {
          name: "和三盆ラテ",
          nameEn: "Wasanbon Latte",
          description: "希少な和三盆糖の上品な甘みと、なめらかなミルクが溶け合うラテ。",
          descriptionEn: "A refined latte where rare wasanbon sugar and silky milk come together.",
          price: "¥ 750",
          note: "hot / ice",
          noteEn: "hot / ice",
        },
        {
          name: "ほうじ茶オーレ",
          nameEn: "Hojicha Au Lait",
          description: "香ばしく焙じた茶葉をたっぷり使った、温かみのある一杯。",
          descriptionEn: "A warm, toasty cup made with generous hojicha leaves.",
          price: "¥ 650",
          note: "hot / ice",
          noteEn: "hot / ice",
        },
        {
          name: "玉露 水出し",
          nameEn: "Cold-Brew Gyokuro",
          description: "高貴な旨みを持つ玉露を、低温でゆっくり抽出したまろやかな一杯。",
          descriptionEn: "Noble gyokuro slowly cold-brewed for a mellow, umami-rich cup.",
          price: "¥ 700",
          note: "ice",
          noteEn: "ice",
        },
        {
          name: "抹茶フラッペ",
          nameEn: "Matcha Frappé",
          description: "濃い抹茶ベースにソフトクリームをのせた、贅沢な夏季限定ドリンク。",
          descriptionEn: "An indulgent summer-limited drink — rich matcha base topped with soft-serve ice cream.",
          price: "¥ 780",
          note: "夏季限定",
          noteEn: "Summer only",
        },
      ],
    },
    {
      id: "sweets",
      label: "スイーツ",
      labelEn: "Sweets",
      accent: "#B8A882",
      items: [
        {
          name: "抹茶わらびもち",
          nameEn: "Matcha Warabimochi",
          description: "もちもちのわらびもちに、抹茶きな粉と黒蜜をたっぷりかけて。",
          descriptionEn: "Chewy warabimochi topped generously with matcha kinako and black sugar syrup.",
          price: "¥ 480",
        },
        {
          name: "和三盆プリン",
          nameEn: "Wasanbon Pudding",
          description: "希少な和三盆糖を使った、滑らかで上品な甘みのプリン。黒蜜添え。",
          descriptionEn: "A silky, elegantly sweet pudding made with rare wasanbon sugar. Served with black sugar syrup.",
          price: "¥ 520",
        },
        {
          name: "抹茶どら焼き",
          nameEn: "Matcha Dorayaki",
          description: "自家製抹茶餡をたっぷり挟んだ、一枚焼きのどら焼き。",
          descriptionEn: "A single-baked dorayaki filled with generous house-made matcha bean paste.",
          price: "¥ 380",
        },
        {
          name: "上生菓子（日替わり）",
          nameEn: "Premium Wagashi (Daily)",
          description: "職人が手がける季節の上生菓子。お茶との相性抜群です。",
          descriptionEn: "Seasonal wagashi crafted by our artisan. A perfect match with any tea.",
          price: "¥ 450",
          note: "内容は日によって異なります",
          noteEn: "Selection changes daily",
        },
      ],
    },
    {
      id: "food",
      label: "フードメニュー",
      labelEn: "À la carte",
      accent: "#6B6B5E",
      items: [
        {
          name: "茶葉のおにぎり",
          nameEn: "Tea Leaf Onigiri",
          description: "煎茶塩を使ったシンプルなおにぎり。2個セット。",
          descriptionEn: "Simple onigiri seasoned with sencha salt. Set of two.",
          price: "¥ 380",
        },
        {
          name: "抹茶バターサンド",
          nameEn: "Matcha Butter Sand",
          description: "宇治抹茶のバタークリームを、厚みのあるサクサクのクッキーで挟みました。",
          descriptionEn: "Uji matcha buttercream sandwiched between thick, crisp cookies.",
          price: "¥ 420",
        },
        {
          name: "茶粥",
          nameEn: "Sencha Porridge",
          description: "煎茶で炊いた、ほっこり優しい一品。梅干し・香の物添え。",
          descriptionEn: "A comforting rice porridge cooked in sencha. Served with pickled plum and seasonal pickles.",
          price: "¥ 680",
        },
      ],
    },
    {
      id: "set",
      label: "セット",
      labelEn: "Set",
      accent: "#B8A882",
      items: [
        {
          name: "一服セット",
          nameEn: "Ippuku Set",
          description: "お好みのドリンク1杯と、当日の和菓子1点のセット。ゆったりとした一服にどうぞ。",
          descriptionEn: "One drink of your choice paired with the day's wagashi. A moment of quiet calm.",
          price: "¥ 980",
          note: "ドリンク + 和菓子",
          noteEn: "Drink + Wagashi",
        },
        {
          name: "ペアセット",
          nameEn: "Pair Set",
          description: "二人でゆっくり楽しむおすすめセット。ドリンク2杯とスイーツ2点。",
          descriptionEn: "Our recommended set for two — two drinks and two sweets.",
          price: "¥ 1,980",
          note: "ドリンク×2 + スイーツ×2",
          noteEn: "Drink ×2 + Sweets ×2",
        },
        {
          name: "茶筅体験セット",
          nameEn: "Chasen Experience Set",
          description: "抹茶を点てる体験（体験料含む）とお干菓子のセット。初めての方も歓迎。",
          descriptionEn: "A hands-on matcha whisking experience (fee included) with dry sweets. First-timers welcome.",
          price: "¥ 1,500",
          note: "体験料込み・要予約",
          noteEn: "Includes experience fee · Reservation required",
        },
      ],
    },
  ],

  // ▼ ここを編集 → 高台寺店ページの「今月のお知らせ」に即反映
  news: [
    {
      badge: "今月のおすすめ",
      badgeEn: "This Month's Pick",
      badgeColor: "#3D6B35",
      title: "新茶フェア 開催中",
      titleEn: "First-Flush Tea Fair — Now On",
      body: "吉田銘茶園から届いた今年の新茶を使った限定メニューを提供中。爽やかな若葉の香りと、すっきりとした後味をお楽しみください。数量限定のため、お早めにどうぞ。",
      bodyEn: "We're serving a limited menu made with this season's first-flush tea from Yoshida Meichaen. Enjoy the fresh, vibrant aroma of young leaves. While supplies last.",
      date: "2026.06",
    },
    {
      badge: "キャンペーン",
      badgeEn: "Campaign",
      badgeColor: "#B8A882",
      title: "ペア来店でドリンク1杯サービス",
      titleEn: "Free Drink for Pairs",
      body: "6月中、お二人でご来店いただくと、おすすめドリンクを1杯プレゼント。大切な人と、ゆっくりとした時間をどうぞ。（1組1回限り）",
      bodyEn: "Throughout June, any pair of guests receives a complimentary recommended drink. Enjoy a leisurely moment together. (One per group.)",
      date: "2026.06",
    },
    {
      badge: "お知らせ",
      badgeEn: "Notice",
      badgeColor: "#6B6B5E",
      title: "夏季テイクアウトカップ変更",
      titleEn: "New Summer Takeout Cups",
      body: "7月よりテイクアウト用カップをリニューアルします。サステナブルな素材を使用した新カップで、お散歩のお供にぜひご利用ください。",
      bodyEn: "From July, we'll be switching to new takeout cups made from sustainable materials. A great companion for your walks.",
      date: "2026.06",
    },
    {
      badge: "イベント",
      badgeEn: "Event",
      badgeColor: "#8B5E3C",
      title: "茶筅体験ワークショップ（7月開催予定）",
      titleEn: "Chasen Workshop (Planned for July)",
      body: "お茶を点てる道具「茶筅」の使い方を体験できるワークショップを7月に開催予定です。初めての方も歓迎。詳細は近日公開。",
      bodyEn: "A workshop where you can experience using the chasen whisk to make matcha. Beginners welcome. Details coming soon.",
      date: "2026.06",
    },
  ],
};

// ────────────────────────────────────────────────────
// 熊本店
// ────────────────────────────────────────────────────

const kumamoto: StoreContent = {
  info: {
    slug: "kumamoto",
    name: "Chasen 熊本店",
    nameJa: "茶筅 熊本",
    nameEn: "Chasen Kumamoto",
    area: "Kumamoto",
    address: "〒860-0805 熊本県熊本市中央区桜町3-10 SAKURA MACHI Kumamoto 3F",
    tel: "096-285-9336",
    hours: "11:00 — 21:00",
    closed: "不定休",
    closedEn: "Irregular",
    access: "熊本市電「花畑町」停留場より徒歩約5分",
    accessEn: "Approx. 5 min walk from Kumamoto City Tram 'Hanabata-machi' Stop",
    description:
      "熊本桜町の賑わいの中に生まれた、日本茶の新しい楽しみ方を提案するスタンドです。熊本の豊かな自然が育てた茶葉を、現代的なスタイルでお届けします。地元の方にも、旅の途中の方にも、気軽に立ち寄っていただける場所を目指しています。",
    descriptionEn:
      "A tea stand in the heart of Sakuramachi, Kumamoto, offering a fresh take on Japanese tea. We bring the finest leaves grown in Kumamoto's rich natural environment, served in a modern style. Whether you're a local or just passing through, you're always welcome to stop in.",
    accentColor: "#1A1A18",
    instagram: INSTAGRAM.kumamoto,
  },

  // ▼ ここを編集 → ホームページのメニューカードに即反映
  menuCards: [
    {
      category: "季節のおすすめ",
      categoryEn: "Seasonal Pick",
      title: "ほうじ茶ラテ",
      titleEn: "Hojicha Latte",
      description: "深く焙じた香ばしさと、甘いミルクが溶け合う定番の一杯。",
      descriptionEn: "The deep, roasted aroma of hojicha meets sweet, creamy milk.",
      price: "¥ 600",
      accent: "#8B5E3C",
      bg: "#F5EEE6",
    },
    {
      category: "人気メニュー",
      categoryEn: "Popular",
      title: "玉露フィズ",
      titleEn: "Gyokuro Fizz",
      description: "上質な玉露の旨みを、スパークリングウォーターで爽やかに。",
      descriptionEn: "The rich umami of premium gyokuro, brightened with sparkling water.",
      price: "¥ 700",
      accent: "#3D6B35",
      bg: "#E8F0E4",
    },
    {
      category: "新メニュー",
      categoryEn: "New",
      title: "抹茶あずきラテ",
      titleEn: "Matcha Azuki Latte",
      description: "北海道産あずきと宇治抹茶の組み合わせ。和のデザート感覚で。",
      descriptionEn: "Uji matcha meets Hokkaido red bean — a dessert in a glass.",
      price: "¥ 780",
      accent: "#2A4D25",
      bg: "#F0F5ED",
    },
    {
      category: "お知らせ",
      categoryEn: "News",
      title: "土日限定スイーツ",
      titleEn: "Weekend Sweets",
      description: "週末限定で和スイーツセットを提供中。数量限定のためお早めに。",
      descriptionEn: "A Japanese sweets set, available weekends only. Limited quantities — don't miss it.",
      accent: "#B8A882",
      bg: "#F5F0E8",
    },
    {
      category: "イベント",
      categoryEn: "Event",
      title: "茶道ワークショップ",
      titleEn: "Tea Ceremony Workshop",
      description: "初めての方でも楽しめる茶道体験を月1回開催中。予約はお早めに。",
      descriptionEn: "A monthly tea ceremony experience, welcoming first-timers. Book early.",
      accent: "#6B6B5E",
      bg: "#F7F5F0",
    },
  ],

  // ▼ ここを編集 → /stores/kumamoto/menu の全メニューページに即反映
  fullMenu: [
    {
      id: "drink",
      label: "ドリンク",
      labelEn: "Drink",
      accent: "#3D6B35",
      items: [
        {
          name: "ほうじ茶ラテ",
          nameEn: "Hojicha Latte",
          description: "深く焙じた香ばしさと甘いミルクが溶け合う、熊本店の定番ドリンク。",
          descriptionEn: "Kumamoto's signature drink — deep, toasty hojicha paired with sweet creamy milk.",
          price: "¥ 650",
          note: "hot / ice",
          noteEn: "hot / ice",
        },
        {
          name: "玉露フィズ",
          nameEn: "Gyokuro Fizz",
          description: "上質な玉露の豊かな旨みを、スパークリングウォーターで爽やかに仕上げました。",
          descriptionEn: "Premium gyokuro's rich umami, served refreshingly over sparkling water.",
          price: "¥ 700",
          note: "ice",
          noteEn: "ice",
        },
        {
          name: "抹茶あずきラテ",
          nameEn: "Matcha Azuki Latte",
          description: "北海道産あずきと宇治抹茶の組み合わせ。和のデザート感覚でお楽しみください。",
          descriptionEn: "Hokkaido red bean meets Uji matcha. Enjoy it like a Japanese dessert.",
          price: "¥ 780",
          note: "hot / ice",
          noteEn: "hot / ice",
        },
        {
          name: "水出し煎茶",
          nameEn: "Cold-Brew Sencha",
          description: "ゆっくり時間をかけて抽出した、まろやかで旨みたっぷりの一杯。",
          descriptionEn: "Slowly cold-brewed for a mellow, deeply flavorful cup.",
          price: "¥ 580",
          note: "ice",
          noteEn: "ice",
        },
        {
          name: "ほうじ茶ソーダ",
          nameEn: "Hojicha Soda",
          description: "香ばしいほうじ茶のソーダ割り。すっきりとした飲み口が心地よい。",
          descriptionEn: "Roasted hojicha over soda — a clean, refreshing sip.",
          price: "¥ 620",
          note: "ice",
          noteEn: "ice",
        },
      ],
    },
    {
      id: "sweets",
      label: "スイーツ",
      labelEn: "Sweets",
      accent: "#B8A882",
      items: [
        {
          name: "ほうじ茶アイスクリーム",
          nameEn: "Hojicha Ice Cream",
          description: "深煎りほうじ茶の香ばしさがギュッと詰まった濃厚なアイスクリーム。",
          descriptionEn: "Dense, richly toasted hojicha packed into every scoop.",
          price: "¥ 480",
        },
        {
          name: "抹茶バスクチーズケーキ",
          nameEn: "Matcha Basque Cheesecake",
          description: "なめらかな口どけと抹茶の深みが重なる、大人のスイーツ。",
          descriptionEn: "Silky smooth with the deep complexity of matcha — a grown-up sweet.",
          price: "¥ 580",
        },
        {
          name: "和三盆クレープ",
          nameEn: "Wasanbon Crêpe",
          description: "和三盆クリームと季節のフルーツを包んだ、上品な薄焼きクレープ。",
          descriptionEn: "A delicate thin crêpe filled with wasanbon cream and seasonal fruit.",
          price: "¥ 620",
        },
        {
          name: "ほうじ茶かき氷",
          nameEn: "Hojicha Kakigori",
          description: "自家製ほうじ茶シロップとたっぷりのあずきで仕上げた夏の名物。",
          descriptionEn: "A summer signature — shaved ice with house-made hojicha syrup and generous red bean.",
          price: "¥ 880",
          note: "夏季限定",
          noteEn: "Summer only",
        },
      ],
    },
    {
      id: "food",
      label: "フードメニュー",
      labelEn: "À la carte",
      accent: "#6B6B5E",
      items: [
        {
          name: "茶葉香るサンドイッチ",
          nameEn: "Tea-Scented Sandwich",
          description: "煎茶塩で仕上げたチキンと新鮮な野菜のサンドイッチ。軽食にどうぞ。",
          descriptionEn: "Chicken seasoned with sencha salt and fresh vegetables — a light, satisfying meal.",
          price: "¥ 680",
        },
        {
          name: "抹茶チョコレート",
          nameEn: "Matcha Chocolate",
          description: "宇治抹茶を使った自家製チョコレート。お土産にもどうぞ（5粒入り）。",
          descriptionEn: "House-made chocolates using Uji matcha. A great souvenir too. (5 pieces)",
          price: "¥ 380",
        },
      ],
    },
    {
      id: "set",
      label: "セット",
      labelEn: "Set",
      accent: "#B8A882",
      items: [
        {
          name: "くつろぎセット",
          nameEn: "Relaxation Set",
          description: "お好みのドリンク1杯と、当日のスイーツ1点のセット。",
          descriptionEn: "One drink of your choice paired with the day's sweets.",
          price: "¥ 1,020",
          note: "ドリンク + スイーツ",
          noteEn: "Drink + Sweets",
        },
        {
          name: "モーニングセット",
          nameEn: "Morning Set",
          description: "煎茶または抹茶ラテ＋和菓子の朝のセット。ゆったりとした朝のひとときに。",
          descriptionEn: "Sencha or matcha latte with a wagashi — a gentle way to start the morning.",
          price: "¥ 780",
          note: "平日 11:00〜13:00 限定",
          noteEn: "Weekdays 11:00–13:00 only",
        },
        {
          name: "ペアセット",
          nameEn: "Pair Set",
          description: "二人でゆっくり楽しむおすすめセット。ドリンク2杯とスイーツ2点。",
          descriptionEn: "Our recommended set for two — two drinks and two sweets.",
          price: "¥ 2,000",
          note: "ドリンク×2 + スイーツ×2",
          noteEn: "Drink ×2 + Sweets ×2",
        },
      ],
    },
  ],

  // ▼ ここを編集 → 熊本店ページの「今月のお知らせ」に即反映
  news: [
    {
      badge: "今月のおすすめ",
      badgeEn: "This Month's Pick",
      badgeColor: "#3D6B35",
      title: "ほうじ茶かき氷 登場",
      titleEn: "Hojicha Kakigori Is Here",
      body: "夏季限定メニューとして、深煎りほうじ茶のかき氷が登場しました。自家製の濃厚ほうじ茶シロップとたっぷりのあずきで、見た目も涼やかな一品です。",
      bodyEn: "Our seasonal summer menu is here — shaved ice drenched in our house-made deep-roast hojicha syrup and topped with generous red bean. A stunning, cooling treat.",
      date: "2026.06",
    },
    {
      badge: "キャンペーン",
      badgeEn: "Campaign",
      badgeColor: "#B8A882",
      title: "SNS投稿でドリンク割引",
      titleEn: "Post & Save on Your Next Visit",
      body: "店内でお飲みになったドリンクをInstagramに投稿いただくと、次回ご来店時に100円引きになります。ハッシュタグ #chasen熊本 をつけてご投稿ください。",
      bodyEn: "Post a photo of your drink on Instagram and receive ¥100 off your next order. Tag it with #chasen熊本.",
      date: "2026.06",
    },
    {
      badge: "お知らせ",
      badgeEn: "Notice",
      badgeColor: "#6B6B5E",
      title: "平日モーニングセット開始",
      titleEn: "Weekday Morning Set Launching in July",
      body: "7月より平日11時〜13時限定でモーニングセットを提供予定。煎茶または抹茶ラテと和菓子のセットです。ゆったりとした朝のひとときにご利用ください。",
      bodyEn: "From July, we'll be offering a morning set from 11:00–13:00 on weekdays — sencha or matcha latte paired with wagashi. A peaceful start to your morning.",
      date: "2026.06",
    },
    {
      badge: "イベント",
      badgeEn: "Event",
      badgeColor: "#8B5E3C",
      title: "熊本の茶農家さんとトークイベント",
      titleEn: "Talk Event with a Local Tea Farmer",
      body: "地元熊本で茶葉を育てる農家さんをお招きし、お茶の産地や製法についてのトークイベントを開催します。試飲つき。詳細は近日公開予定。",
      bodyEn: "We're hosting a talk by a local Kumamoto tea farmer on the origins and craft behind our tea. Tasting included. Details coming soon.",
      date: "2026.06",
    },
  ],
};

// ────────────────────────────────────────────────────
// エクスポート
// ────────────────────────────────────────────────────

export const storeContent: Record<"kyoto" | "kumamoto", StoreContent> = {
  kyoto,
  kumamoto,
};

export const allStores = [kyoto, kumamoto];

export const brandNewsFallback: BrandNewsItem[] = [
  ...kyoto.news.map((n) => ({ ...n, store: "高台寺店" })),
  ...kumamoto.news.map((n) => ({ ...n, store: "熊本店" })),
];
