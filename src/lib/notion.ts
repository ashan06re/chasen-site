import { notion, queryNotion, queryNotionFresh } from './notionClient';
import { createHash } from "node:crypto";
import { cache } from "react";
import { EXPERIENCE_DB, APPEARANCE_DB, BOOKING_DB } from "./cmsIds";
import { DEFAULT_BOOKING, safeBookingUrl, type BookingSetting } from './booking';
import { defaultExperience, DEFAULT_APPEARANCE, PLACEMENTS, registeredArt, type Artwork, type Appearance } from "./experience";
import { approvedAssetId } from './approvedArtwork';
import { menuIsPublished } from './menuPublishing';
import { accentColor } from './palette';
import { MENU_PUBLICATION_DB } from './cmsIds';
import type {
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

/** Notion API は1回100件までしか返さないので、続きページも全部読む（メニューは日英で100行を超える） */
async function queryAll(params: Parameters<typeof notion.databases.query>[0], fresh = false) {
  const results: Awaited<ReturnType<typeof notion.databases.query>>["results"] = [];
  let cursor: string | undefined;
  do {
    const res = await (fresh ? queryNotionFresh : queryNotion)({ ...params, start_cursor: cursor, page_size: 100 });
    results.push(...res.results);
    cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined;
  } while (cursor);
  return { results };
}

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

/** Human-readable Notion fields, with safe defaults and no editable technical keys. */
export const getExperience = cache(async () => {
  const result = defaultExperience();
  try {
    const data = await queryAll({ database_id: EXPERIENCE_DB, sorts: [{ property: '表示順', direction: 'ascending' }] });
    for (const page of data.results) {
      const row = page as { id: string; properties: Record<string, Record<string, unknown>> };
      const p = row.properties;
      const place = selectName(p['掲載場所']);
      const index = PLACEMENTS.indexOf(place as typeof PLACEMENTS[number]);
      if (index < 0) continue;
      if (index === 8) {
        result.shopHeading = { ja:text(p['見出し'])||result.shopHeading.ja, en:text(p['見出し（英語）'])||result.shopHeading.en, detail:text(p['説明文'])||result.shopHeading.detail, detailEn:text(p['説明文（英語）'])||result.shopHeading.detailEn };
        continue;
      }
      const base: Artwork = index < 5 ? result.scenes[index] : index === 5 ? result.kyoto : index === 6 ? result.kumamoto : result.brand;
      const src = imageUrl(row.id, p['画像'], '画像');
      let art = { ...base };
      if (src) {
        // Only our exact, precomputed painting/depth pairs can use displacement.
        // A new upload never inherits the previous picture's unrelated depth map.
        const known = approvedAssetId(src);
        art = known ? { ...base, ...registeredArt(known) } : { ...base, src, mobileSrc:undefined, depth:undefined };
        if (src.endsWith('/editorial/kyoto-detail.webp') && src.startsWith('https://chasen-site-')) art.src='/editorial/kyoto-detail.webp';
      }
      art.alt = text(p['画像の説明']) || base.alt;
      art.altEn = text(p['画像の説明（英語）']) || base.altEn;
      art.motion = selectName(p['動き']) !== 'なし';
      if (index < 5) result.scenes[index] = { ...result.scenes[index], ...art, ja:text(p['見出し'])||result.scenes[index].ja, en:text(p['見出し（英語）'])||result.scenes[index].en, detail:text(p['説明文'])||result.scenes[index].detail, detailEn:text(p['説明文（英語）'])||result.scenes[index].detailEn };
      else if(index===5) result.kyoto=art;
      else if(index===6) result.kumamoto=art;
      else result.brand=art;
    }
  } catch { console.warn('CMS experience unavailable; using safe published defaults.'); }
  return result;
});

export const getAppearance = cache(async (): Promise<Appearance> => {
  try {
    const data = await queryAll({ database_id: APPEARANCE_DB });
    const p = (data.results[0] as { properties?: Record<string, Record<string, unknown>> })?.properties;
    if (!p) return DEFAULT_APPEARANCE;
    const ratio=selectName(p['メニュー画像の比率']);
    const note=selectName(p['価格の注記']);
    return { menuAspect:({'7:5':'7 / 5','4:3':'4 / 3','3:2':'3 / 2','1:1':'1 / 1'} as Record<string,string>)[ratio]||DEFAULT_APPEARANCE.menuAspect,
      priceNote:note==='税込'||note==='税抜'?note:'', operator:text(p['運営者の表示名'])||DEFAULT_APPEARANCE.operator,
      compact:selectName(p['物語の長さ'])!=='標準', artNote:text(p['画像の注記'])||DEFAULT_APPEARANCE.artNote,artNoteEn:text(p['画像の注記（英語）'])||DEFAULT_APPEARANCE.artNoteEn };
  } catch { console.warn('CMS appearance unavailable; using safe published defaults.'); return DEFAULT_APPEARANCE; }
});

function text(prop: Record<string, unknown> | undefined): string {
  if (prop?.select) return selectName(prop);
  if (prop?.date) return (prop.date as {start?: string}).start || '';
  const rt = (prop as { rich_text?: Array<{ plain_text: string }> } | undefined)?.rich_text;
  return rt?.map(part => part.plain_text).join("") ?? "";
}

function selectName(prop: Record<string, unknown> | undefined): string {
  const s = (prop as { select?: { name: string } } | undefined)?.select;
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
  // A replacement gets a new immutable URL; changing hourly signatures does not.
  const revision = createHash("sha256").update(target.file.url.split("?")[0]).digest("hex").slice(0, 12);
  return `/api/notion-image/${pageId}/${index}/${encodeURIComponent(propName)}/${revision}`;
}

// ── フルメニュー取得（店舗詳細メニューページ用）────────────
const FULL_MENU_DB: Record<"高台寺店" | "熊本店", string> = {
  "高台寺店": KYOTO_MENU_DB_ID,
  "熊本店":   KUMAMOTO_MENU_DB_ID,
};

export const getMenuPublication = cache(async (store: '高台寺店' | '熊本店'): Promise<boolean> => {
  if (!MENU_PUBLICATION_DB) return false;
  try {
    const {results} = await queryAll({database_id: MENU_PUBLICATION_DB}, true);
    const rows = results.filter(p => 'properties' in p).map(page => {
      const p = (page as {properties: Record<string, Record<string, unknown>>}).properties;
      return {store: selectName(p['店舗']), status: selectName(p['公開設定'])};
    });
    return menuIsPublished(rows, store);
  } catch { console.warn('Menu publication unavailable; keeping menus closed.'); return false; }
});

export async function getFullMenuSections(
  store: "高台寺店" | "熊本店"
): Promise<{ ja: import("@/data/storeContent").FullMenuSection[]; en: import("@/data/storeContent").FullMenuSection[] }> {
  if (!await getMenuPublication(store)) return {ja: [], en: []};
  const res = await queryAll({
    database_id: FULL_MENU_DB[store],
    filter: { property: "表示する", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  type FullMenuSection = import("@/data/storeContent").FullMenuSection;

  const jaMap = new Map<string, FullMenuSection>();
  const enMap = new Map<string, FullMenuSection>();
  const photoSources = new Map<string, import('@/data/storeContent').FullMenuItem>();
  const photoReferences = new WeakMap<import('@/data/storeContent').FullMenuItem,string>();

  for (const page of res.results) {
    const p = (page as { properties: Record<string, Record<string, unknown>> }).properties;

    // The visible category choice is authoritative; editors need not sync a hidden ID.
    const categoryId = text(p['カテゴリー']);
    const [categoryJa, categoryEn] = text(p['カテゴリー']).split('｜');
    const lang       = selectName(p["言語"]);
    const photoUrl   = imageUrl((page as { id: string }).id, p["写真"], "写真");

    const item: import("@/data/storeContent").FullMenuItem = {
      name:        (p["メニュー名"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ?? "",
      description: text(p["説明"]),
      price:       text(p["価格"]),
      note:        text(p["備考"]) || undefined,
      photoUrl,
      accent: accentColor(selectName(p['アクセント色'])),
      photoMatchOrder: (p['表示順'] as { number?: number })?.number,
    };
    if(lang!=='英語')photoSources.set(page.id,item);
    const reference=(p['対応する日本語商品'] as {relation?:{id:string}[]})?.relation;
    if(reference?.length===1)photoReferences.set(item,reference[0].id);

    const targetMap = lang === "英語" ? enMap : jaMap;

    if (!targetMap.has(categoryId)) {
      targetMap.set(categoryId, {
        id:      categoryId,
        label:   categoryJa,
        labelEn: categoryEn || categoryJa,
        accent:  item.accent || "#3D6B35",
        items:   [],
      });
    }
    targetMap.get(categoryId)!.items.push(item);
  }

  // Match explicit display order, not array position (hiding one row must not
  // silently attach the following product's photo to a different translation).
  for (const [categoryId, enSection] of enMap) {
    const jaItems = jaMap.get(categoryId)?.items ?? [];
    enSection.items.forEach(item => {
      const matches = typeof item.photoMatchOrder==='number' ? jaItems.filter(ja=>ja.photoMatchOrder===item.photoMatchOrder) : [];
      const linkedId=photoReferences.get(item);
      const match=linkedId?photoSources.get(linkedId):matches.length===1?matches[0]:undefined;
      if (!item.photoUrl && match?.photoUrl) {
        item.photoUrl = match.photoUrl;
      }
    });
  }

  return {
    ja: Array.from(jaMap.values()),
    en: Array.from(enMap.values()),
  };
}

// ── お知らせ取得（ブランド全体お知らせページ用）──────────
export async function getAllNewsItems(): Promise<{ ja: BrandNewsItem[]; en: BrandNewsItem[] }> {
  const res = await queryAll({
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
    const res = await queryAll({
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
    const res = await queryAll({
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
    const res = await queryAll({
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
    const res = await queryAll({
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
  return { ja: '/reserve', en: '/en/reserve' };
}

export const getBookingSettings = cache(async (): Promise<BookingSetting[]> => {
  try {
    const {results}=await queryAll({database_id:BOOKING_DB});
    return DEFAULT_BOOKING.map(fallback=>{
      const row=results.find(page=>'properties' in page && selectName(page.properties['店舗'] as Record<string,unknown>)===fallback.store);
      if(!row||!('properties' in row))return fallback;
      const p=row.properties as Record<string,Record<string,unknown>>;
      const mode=selectName(p['受付方法']);
      return {...fallback,mode:mode==='受付停止'||mode==='外部予約サイト'?mode:'電話・お問い合わせ',url:safeBookingUrl(p['予約ページ']?.url),urlEn:safeBookingUrl(p['予約ページ（英語）']?.url),note:text(p['ご案内'])||fallback.note,noteEn:text(p['ご案内（英語）'])||fallback.noteEn};
    });
  } catch { return DEFAULT_BOOKING; }
});

export async function getLegacyReservationUrls(): Promise<{ ja: string; en: string }> {
  if (!RESERVATION_DB_ID) return { ja: "#", en: "#" };

  try {
    const res = await queryAll({
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
    const res = await queryAll({
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
        accentColor:   accentColor(selectName(p['アクセント色']), def.accentColor),
        instagram:     (p["Instagram"] ? text(p["Instagram"]) : "") || def.instagram,
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
    const res = await queryAll({
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
  const res = await queryAll({
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
