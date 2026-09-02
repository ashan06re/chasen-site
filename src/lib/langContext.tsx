"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localizePath, stripLang } from "@/lib/i18n";

export type Lang = "ja" | "en";

const STORAGE_KEY = "chasen_lang";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  /** 現在の言語に合わせたパスを返す。例: localize("/stores/kyoto") → "/en/stores/kyoto" */
  localize: (path: string) => string;
}>({ lang: "ja", setLang: () => {}, localize: (p) => p });

/**
 * 言語は URL（/ = 日本語、/en = 英語）で決まる。
 * 切り替えは同じページの別言語 URL へ遷移する。
 * 一度明示的に選んだ言語は localStorage に残し、次回逆言語の URL を開いたときだけ
 * クライアント側で寄せる（検索エンジンは localStorage を持たないので影響しない）。
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if ((stored === "en" || stored === "ja") && stored !== lang) {
        router.replace(localizePath(pathname, stored) + window.location.hash);
      }
    } catch {
      /* localStorage が使えない環境では何もしない */
    }
    // 初回マウント時のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
    if (l !== lang) router.push(localizePath(pathname, l) + window.location.hash);
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
