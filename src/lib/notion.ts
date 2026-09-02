import { Client } from "@notionhq/client";
import type {
  MenuCard,
  NewsItem,
  BrandNewsItem,
  BrandStoryContent,
  YoshidaFeature,
  YoshidaImages,
  YoshidaSettings,
  SiteSettings,
  StoreInfo,
} from "@/data/storeContent";
import {
  defaultBrandStory,
  defaultBrandStoryEn,
  defaultYoshidaFeatures,
  defaultYoshidaFeaturesEn,
  defaultYoshidaSettings,
  defaultYoshidaSettingsEn,
  defaultSiteSettings,
  defaultSiteSettingsEn,
  storeContent,
} from "@/data/storeContent";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2022-06-28",
});

const MENU_DB_ID             = process.env.NOTION_MENU_DB_ID!;
const NEWS_DB_ID             = process.env.NOTION_NEWS_DB_ID!;
const KYOTO_MENU_DB_ID       = process.env.NOTION_KYOTO_MENU_DB_ID!;
const KUMAMOTO_MENU_DB_ID    = process.env.NOTION_KUMAMOTO_MENU_DB_ID!;
const BRAND_STORY_DB_ID      = process.env.NOTION_BRAND_STORY_DB_ID;
const YOSHIDA_DB_ID          = process.env.NOTION_YOSHIDA_DB_ID;
const SITE_SETTINGS_DB_ID    = process.env.NOTION_SITE_SETTINGS_DB_ID;
const STORE_INFO_DB_ID       = process.env.NOTION_STORE_INFO_DB_ID;
const YOSHIDA_SETTINGS_DB_ID = process.env.NOTION_YOSHIDA_SETTINGS_DB_ID;
const RESERVATION_DB_ID        = process.env.NOTION_RESERVATION_DB_ID;
const YOSHIDA_IMAGES_DB_ID     = process.env.NOTION_YOSHIDA_IMAGES_DB_ID;

function text(prop: Record<string, unknown>): string {
  const rt = (prop as { rich_text?: Array<{ plain_text: string }> }).rich_text;
  return rt?.[0]?.plain_text ?? "";
}

function selectName(prop: Record<string, unknown>): string {
  const s = (prop as { select?: { name: string } }).select;
  return s?.name ?? "";
}

type NotionFile = { type?: string; file?: { url: string }; external?: { url: string } };

/**
 * Notionのファイルプロパティから、失効しない画像URLを作る。
 *
 * Notionにアップロードされたファイル（file）の署名付きURLは1時間で失効するため、
 * そのまま埋め込まず /api/notion-image プロキシ経由のURLを返す。
 * 外部URL（external）は失効しないのでそのまま使う。
 */
function imageUrl(
  pageId: string,
  prop: Record<string, unknown> | undefined,
  propName: string,
  index = 0
): string | undefined {
  const files = (prop as { files?: NotionFile[] } | undefined)?.files ?? [];
  const target = files[index];
  if (!target) return undefined;
  if (target.external?.url) return target.external.url;
  if (!target.file?.url) return undefined;
  return `/api/notion-image/${pageId}/${index}/${encodeURIComponent(propName)}`;
}

// ── メニュー取得（ホームSwiperカード用）──────────────────
export async function getMenuCards(
  store: "高台寺店" | "熊本店"
): Promise<{ ja: MenuCard[]; en: MenuCard[] }> {
  const res = await notion.databases.query({
    database_id: MENU_DB_ID,
    filter: {
      and: [
        { property: "店舗",   select:   { equals: store } },
        { property: "表示する", checkbox: { equals: true } },
      ],
    },
  });

  const ja: MenuCard[] = [];
  const en: MenuCard[] = [];

  for (const page of res.results) {
    const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
    const photoUrl = imageUrl((page as { id: string }).id, p["写真"], "写真");
    const lang = selectName(p["言語"]);

    const card: MenuCard = {
      category: selectName(p["カテゴリ"]),
      title:    (p["メニュー名"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
      description: text(p["説明"]),
      price:    text(p["価格"]) || undefined,
      accent:   text(p["アクセントカラー"]) || "#3D6B35",
      bg:       text(p["背景カラー"])       || "#F7F5F0",
      photoUrl,
    };

    if (lang === "英語") {
      en.push(card);
    } else {
      ja.push(card);
    }
  }

  return { ja, en };
}

// ── フルメニュー取得（店舗詳細メニューページ用）────────────
const FULL_MENU_DB: Record<"高台寺店" | "熊本店", string> = {
  "高台寺店": KYOTO_MENU_DB_ID,
  "熊本店":   KUMAMOTO_MENU_DB_ID,
};

export async function getFullMenuSections(
  store: "高台寺店" | "熊本店"
): Promise<{ ja: import("@/data/storeContent").FullMenuSection[]; en: import("@/data/storeContent").FullMenuSection[] }> {
  const res = await notion.databases.query({
    database_id: FULL_MENU_DB[store],
    filter: { property: "表示する", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  type FullMenuSection = import("@/data/storeContent").FullMenuSection;

  const jaMap = new Map<string, FullMenuSection>();
  const enMap = new Map<string, FullMenuSection>();

  for (const page of res.results) {
    const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;

    const categoryId = selectName(p["カテゴリID"]);
    const lang       = selectName(p["言語"]);
    const photoUrl   = imageUrl((page as { id: string }).id, p["写真"], "写真");

    const item: import("@/data/storeContent").FullMenuItem = {
      name:        (p["メニュー名"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
      description: text(p["説明"]),
      price:       text(p["価格"]),
      note:        text(p["備考"]) || undefined,
      photoUrl,
    };

    const targetMap = lang === "英語" ? enMap : jaMap;

    if (!targetMap.has(categoryId)) {
      targetMap.set(categoryId, {
        id:      categoryId,
        label:   text(p["カテゴリ名"]),
        labelEn: text(p["カテゴリ名英語"]),
        accent:  text(p["アクセントカラー"]) || "#3D6B35",
        items:   [],
      });
    }
    targetMap.get(categoryId)!.items.push(item);
  }

  return {
    ja: Array.from(jaMap.values()),
    en: Array.from(enMap.values()),
  };
}

// ── お知らせ取得（ブランド全体お知らせページ用）──────────
export async function getAllNewsItems(): Promise<{ ja: BrandNewsItem[]; en: BrandNewsItem[] }> {
  const res = await notion.databases.query({
    database_id: NEWS_DB_ID,
    filter: { property: "表示する", checkbox: { equals: true } },
    sorts: [{ property: "日付", direction: "descending" }],
  });

  const ja: BrandNewsItem[] = [];
  const en: BrandNewsItem[] = [];

  for (const page of res.results) {
    const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
    const lang = selectName(p["言語"]);
    const item: BrandNewsItem = {
      store:      selectName(p["店舗"]),
      badge:      selectName(p["バッジ"]),
      badgeColor: text(p["バッジカラー"]) || "#3D6B35",
      title:      (p["タイトル"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
      body:       text(p["本文"]),
      date:       text(p["日付"]),
    };

    if (lang === "英語") {
      en.push(item);
    } else {
      ja.push(item);
    }
  }

  return { ja, en };
}

// ── ブランドストーリー取得 ────────────────────────────────
export async function getBrandStory(): Promise<{ ja: BrandStoryContent; en: BrandStoryContent }> {
  if (!BRAND_STORY_DB_ID) return { ja: defaultBrandStory, en: defaultBrandStoryEn };

  try {
    const res = await notion.databases.query({
      database_id: BRAND_STORY_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
    });

    let ja: BrandStoryContent | null = null;
    let en: BrandStoryContent | null = null;

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const lang = selectName(p["言語"]);
      const content: BrandStoryContent = {
        catchphrase:          text(p["キャッチコピー"])    || defaultBrandStory.catchphrase,
        catchphraseHighlight: text(p["キャッチコピー強調"]) || defaultBrandStory.catchphraseHighlight,
        body1:                text(p["本文1"])             || defaultBrandStory.body1,
        body2:                text(p["本文2"])             || defaultBrandStory.body2,
        body3:                text(p["本文3"])             || defaultBrandStory.body3,
      };
      if (lang === "英語") en = content;
      else ja = content;
    }

    return {
      ja: ja ?? defaultBrandStory,
      en: en ?? defaultBrandStoryEn,
    };
  } catch {
    return { ja: defaultBrandStory, en: defaultBrandStoryEn };
  }
}

// ── 吉田銘茶園 セクション設定取得 ────────────────────────────
export async function getYoshidaSettings(): Promise<{ ja: YoshidaSettings; en: YoshidaSettings }> {
  if (!YOSHIDA_SETTINGS_DB_ID) return { ja: defaultYoshidaSettings, en: defaultYoshidaSettingsEn };

  try {
    const res = await notion.databases.query({
      database_id: YOSHIDA_SETTINGS_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
    });

    let ja: YoshidaSettings | null = null;
    let en: YoshidaSettings | null = null;

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const lang = selectName(p["言語"]);
      const settings: YoshidaSettings = {
        label:  text(p["ラベル英語"]) || defaultYoshidaSettings.label,
        nameJa: text(p["名前日本語"]) || defaultYoshidaSettings.nameJa,
        nameEn: text(p["名前英語"])   || defaultYoshidaSettings.nameEn,
        intro:  text(p["紹介文"])     || defaultYoshidaSettings.intro,
      };
      if (lang === "英語") en = settings;
      else ja = settings;
    }

    return {
      ja: ja ?? defaultYoshidaSettings,
      en: en ?? defaultYoshidaSettingsEn,
    };
  } catch {
    return { ja: defaultYoshidaSettings, en: defaultYoshidaSettingsEn };
  }
}

// ── 吉田銘茶園 特徴カード取得 ─────────────────────────────
export async function getYoshidaFeatures(): Promise<{ ja: YoshidaFeature[]; en: YoshidaFeature[] }> {
  if (!YOSHIDA_DB_ID) return { ja: defaultYoshidaFeatures, en: defaultYoshidaFeaturesEn };

  try {
    const res = await notion.databases.query({
      database_id: YOSHIDA_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
      sorts: [{ property: "表示順", direction: "ascending" }],
    });

    if (res.results.length === 0) return { ja: defaultYoshidaFeatures, en: defaultYoshidaFeaturesEn };

    const ja: YoshidaFeature[] = [];
    const en: YoshidaFeature[] = [];

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const lang = selectName(p["言語"]);
      const feature: YoshidaFeature = {
        icon:        text(p["アイコン"]) || "•",
        name:        (p["特徴名"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
        description: text(p["説明"]),
      };
      if (lang === "英語") en.push(feature);
      else ja.push(feature);
    }

    return {
      ja: ja.length > 0 ? ja : defaultYoshidaFeatures,
      en: en.length > 0 ? en : defaultYoshidaFeaturesEn,
    };
  } catch {
    return { ja: defaultYoshidaFeatures, en: defaultYoshidaFeaturesEn };
  }
}

// ── サイト設定取得（Hero・Contact・Footerテキスト用）────────
export async function getSiteSettings(): Promise<{ ja: SiteSettings; en: SiteSettings }> {
  if (!SITE_SETTINGS_DB_ID) return { ja: defaultSiteSettings, en: defaultSiteSettingsEn };

  try {
    const res = await notion.databases.query({
      database_id: SITE_SETTINGS_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
    });

    let ja: SiteSettings | null = null;
    let en: SiteSettings | null = null;

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const lang = selectName(p["言語"]);
      const s: SiteSettings = {
        heroEnglishLabel:      text(p["Hero英語ラベル"])    || defaultSiteSettings.heroEnglishLabel,
        heroCatchphrase:       text(p["Heroキャッチコピー"]) || defaultSiteSettings.heroCatchphrase,
        footerTagline:         text(p["フッタータグライン"])  || defaultSiteSettings.footerTagline,
        contactDescription:    text(p["Contact説明文"])     || defaultSiteSettings.contactDescription,
        contactReservationUrl: text(p["Contact予約URL"])    || defaultSiteSettings.contactReservationUrl,
        contactEmail:          text(p["Contactメール"])      || defaultSiteSettings.contactEmail,
      };
      if (lang === "英語") en = s;
      else ja = s;
    }

    const jaResult = ja ?? defaultSiteSettings;
    const enBase   = en ?? defaultSiteSettingsEn;

    return {
      ja: jaResult,
      en: {
        ...enBase,
        contactReservationUrl: enBase.contactReservationUrl || jaResult.contactReservationUrl,
        contactEmail:          enBase.contactEmail          || jaResult.contactEmail,
      },
    };
  } catch {
    return { ja: defaultSiteSettings, en: defaultSiteSettingsEn };
  }
}

// ── 予約フォームURL取得（予約用Google Form DB）───────────
export async function getReservationUrls(): Promise<{ ja: string; en: string }> {
  if (!RESERVATION_DB_ID) return { ja: "#", en: "#" };

  try {
    const res = await notion.databases.query({
      database_id: RESERVATION_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
    });

    let ja = "#";
    let en = "#";

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const lang = selectName(p["言語"]);
      const url  = text(p["Contact予約URL"]);
      if (lang === "英語") en = url || en;
      else                  ja = url || ja;
    }

    return { ja, en: en !== "#" ? en : ja };
  } catch {
    return { ja: "#", en: "#" };
  }
}

// ── 店舗情報取得（全店舗）───────────────────────────────
export async function getAllStoreInfo(): Promise<{
  ja: Record<"高台寺店" | "熊本店", StoreInfo>;
  en: Record<"高台寺店" | "熊本店", StoreInfo>;
}> {
  const fallbackJa = {
    "高台寺店": storeContent.kyoto.info,
    "熊本店":   storeContent.kumamoto.info,
  };
  const fallbackEn = {
    "高台寺店": storeContent.kyoto.info,
    "熊本店":   storeContent.kumamoto.info,
  };

  if (!STORE_INFO_DB_ID) return { ja: fallbackJa, en: fallbackEn };

  try {
    const res = await notion.databases.query({
      database_id: STORE_INFO_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
    });

    const ja = { ...fallbackJa };
    const en = { ...fallbackEn };

    for (const page of res.results) {
      const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
      const slug = text(p["slug"]) as "kyoto" | "kumamoto";
      if (slug !== "kyoto" && slug !== "kumamoto") continue;

      const storeKey = slug === "kyoto" ? "高台寺店" : "熊本店" as const;
      const def      = fallbackJa[storeKey];
      const lang     = selectName(p["言語"]);

      const info: StoreInfo = {
        slug,
        name:          (p["店舗名"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? def.name,
        nameJa:        text(p["日本語名"])         || def.nameJa,
        nameEn:        def.nameEn,
        area:          text(p["エリア"])           || def.area,
        address:       text(p["住所"])             || def.address,
        tel:           text(p["電話番号"])         || def.tel,
        hours:         text(p["営業時間"])         || def.hours,
        closed:        text(p["定休日"])           || def.closed,
        closedEn:      def.closedEn,
        access:        text(p["アクセス"])         || def.access,
        accessEn:      def.accessEn,
        description:   text(p["紹介文"])           || def.description,
        descriptionEn: def.descriptionEn,
        accentColor:   text(p["アクセントカラー"])  || def.accentColor,
      };

      if (lang === "英語") {
        en[storeKey] = info;
      } else {
        ja[storeKey] = info;
      }
    }

    return { ja, en };
  } catch {
    return { ja: fallbackJa, en: fallbackEn };
  }
}

// ── 吉田銘茶園 画像取得（専用DB: 吉田銘茶園 設定_画像）──────────
export async function getYoshidaImages(): Promise<YoshidaImages> {
  if (!YOSHIDA_IMAGES_DB_ID) return {};

  try {
    const res = await notion.databases.query({
      database_id: YOSHIDA_IMAGES_DB_ID,
      filter: { property: "表示する", checkbox: { equals: true } },
      page_size: 1,
    });

    if (res.results.length === 0) return {};

    const pageId = (res.results[0] as { id: string }).id;
    const p = (res.results[0] as { properties: Record<string, Record<string, unknown>> }).properties;

    return {
      main:     imageUrl(pageId, p["メイン画像"], "メイン画像"),
      feature1: imageUrl(pageId, p["特徴1画像"], "特徴1画像"),
      feature2: imageUrl(pageId, p["特徴2画像"], "特徴2画像"),
      feature3: imageUrl(pageId, p["特徴3画像"], "特徴3画像"),
    };
  } catch {
    return {};
  }
}

// ── 店舗情報取得（単店舗）───────────────────────────────
export async function getStoreInfo(
  store: "高台寺店" | "熊本店"
): Promise<{ ja: StoreInfo; en: StoreInfo }> {
  const all = await getAllStoreInfo();
  return { ja: all.ja[store], en: all.en[store] };
}

// ── お知らせ取得（店舗ページ用）──────────────────────────
export async function getNewsItems(
  store: "高台寺店" | "熊本店"
): Promise<{ ja: NewsItem[]; en: NewsItem[] }> {
  const res = await notion.databases.query({
    database_id: NEWS_DB_ID,
    filter: {
      and: [
        { property: "店舗",   select:   { equals: store } },
        { property: "表示する", checkbox: { equals: true } },
      ],
    },
  });

  const ja: NewsItem[] = [];
  const en: NewsItem[] = [];

  for (const page of res.results) {
    const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;
    const lang = selectName(p["言語"]);

    const item: NewsItem = {
      badge:      selectName(p["バッジ"]),
      badgeColor: text(p["バッジカラー"]) || "#3D6B35",
      title:      (p["タイトル"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
      body:       text(p["本文"]),
      date:       text(p["日付"]),
    };

    if (lang === "英語") {
      en.push(item);
    } else {
      ja.push(item);
    }
  }

  return { ja, en };
}
