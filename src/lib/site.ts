/** サイト全体で共有する定数（canonical / OGP / sitemap で使用） */

// 独自ドメインを設定したら Vercel の環境変数 NEXT_PUBLIC_SITE_URL を上書きするだけでよい
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chasen-site-eight.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "茶筅 Chasen";
export const OG_IMAGE = "/og.jpg";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
