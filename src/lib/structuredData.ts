import type { StoreInfo } from "@/data/storeContent";
import { SITE_NAME, SITE_URL, OG_IMAGE, absoluteUrl } from "@/lib/site";

/**
 * 構造化データ（JSON-LD）ビルダー
 *
 * Googleのローカル検索・マップ表示に効くのは店舗（CafeOrCoffeeShop）スキーマ。
 * 住所・営業時間は Notion「店舗情報」DB の値をそのまま使うので、
 * Notion側を正式住所に更新すれば構造化データも自動で追従する。
 */

const AREA: Record<StoreInfo["slug"], { region: string; locality: string }> = {
  kyoto:    { region: "京都府", locality: "京都市東山区" },
  kumamoto: { region: "熊本県", locality: "熊本市中央区" },
};

/** "11:00 — 21:00" のような文字列から開店・閉店時刻を取り出す */
function parseHours(hours: string): { opens: string; closes: string } | null {
  const m = hours.match(/(\d{1,2}:\d{2})\s*[^\d]{1,3}\s*(\d{1,2}:\d{2})/);
  if (!m) return null;
  return { opens: m[1], closes: m[2] };
}

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday",
];

export function storeSchema(info: StoreInfo) {
  const path = `/stores/${info.slug}`;
  const hours = parseHours(info.hours);
  const area = AREA[info.slug];

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": absoluteUrl(`${path}#store`),
    name: info.name,
    alternateName: [info.nameJa, info.nameEn].filter(Boolean),
    description: info.description,
    url: absoluteUrl(path),
    image: absoluteUrl(OG_IMAGE),
    servesCuisine: ["日本茶", "抹茶", "和スイーツ"],
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    hasMenu: absoluteUrl(`${path}/menu`),
    address: {
      "@type": "PostalAddress",
      streetAddress: info.address,
      addressLocality: area.locality,
      addressRegion: area.region,
      addressCountry: "JP",
    },
    ...(hours
      ? {
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: DAYS,
              opens: hours.opens,
              closes: hours.closes,
            },
          ],
        }
      : {}),
    parentOrganization: { "@id": `${SITE_URL}#organization` },
  };
}

export function organizationSchema(email?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    alternateName: "Chasen",
    url: SITE_URL,
    logo: absoluteUrl("/logo.jpg"),
    image: absoluteUrl(OG_IMAGE),
    ...(email ? { email } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["ja", "en"],
    publisher: { "@id": `${SITE_URL}#organization` },
  };
}
