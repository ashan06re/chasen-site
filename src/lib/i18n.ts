import type { Lang } from "@/lib/langContext";

export const LANGS: Lang[] = ["ja", "en"];

/** "/en/stores/kyoto" → "/stores/kyoto"。日本語 URL はそのまま */
export function stripLang(path: string): string {
  if (path === "/en") return "/";
  return path.startsWith("/en/") ? path.slice(3) : path;
}

/** 言語に合わせた URL を返す。ハッシュ・クエリはそのまま保持する */
export function localizePath(path: string, lang: Lang): string {
  const m = path.match(/^([^?#]*)(.*)$/);
  const base = stripLang(m?.[1] || "/");
  const rest = m?.[2] ?? "";
  if (lang === "ja") return base + rest;
  return (base === "/" ? "/en" : `/en${base}`) + rest;
}

/** メタデータの canonical / hreflang をまとめて作る */
export function pageAlternates(path: string, lang: Lang) {
  const ja = localizePath(path, "ja");
  const en = localizePath(path, "en");
  return {
    canonical: lang === "ja" ? ja : en,
    languages: { ja, en, "x-default": ja },
  };
}
