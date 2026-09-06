"use client";
import { createContext, useContext, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localizePath, stripLang } from "@/lib/i18n";

export type Lang = "ja" | "en";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  /** 現在の言語に合わせたパスを返す。例: localize("/stores/kyoto") → "/en/stores/kyoto" */
  localize: (path: string) => string;
}>({ lang: "ja", setLang: () => {}, localize: (p) => p });

/**
 * 言語は URL（/ = 日本語、/en = 英語）で決まる。
 * 切り替えは同じページの別言語 URL へ遷移する。
 * 共有URL・検索結果・戻る操作を壊さないため、保存設定での強制リダイレクトはしない。
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLang = (l: Lang) => {
    if (l !== lang) router.push(localizePath(pathname, l) + window.location.search + window.location.hash);
  };

  const localize = (path: string) => localizePath(path, lang);

  return (
    <LangContext.Provider value={{ lang, setLang, localize }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
export { stripLang };
