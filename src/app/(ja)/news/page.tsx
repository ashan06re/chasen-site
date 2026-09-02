import type { Metadata } from "next";
import { pageAlternates } from "@/lib/i18n";
import Footer from "@/components/Footer";
import NewsPageContent from "@/components/NewsPageContent";
import { getAllNewsItems } from "@/lib/notion";
import { brandNewsFallback, type BrandNewsItem } from "@/data/storeContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "お知らせ",
  description: "茶筅 Chasen のブランド全体のお知らせ・イベント情報をご覧いただけます。",
  alternates: pageAlternates("/news", "ja"),
  openGraph: {
    title: "お知らせ | 茶筅 Chasen",
    description: "茶筅 Chasen のブランド全体のお知らせ・イベント情報をご覧いただけます。",
    url: "/news",
    type: "website",
  },
};

const toEnglish = (items: BrandNewsItem[]): BrandNewsItem[] =>
  items.map((item) => ({
    ...item,
    badge: item.badgeEn ?? item.badge,
    title: item.titleEn ?? item.title,
    body:  item.bodyEn  ?? item.body,
  }));

export default async function NewsPage() {
  const { ja: itemsJa, en: itemsEn } = await getAllNewsItems().catch(() => ({
    ja: brandNewsFallback,
    en: toEnglish(brandNewsFallback),
  }));
  return (
    <>
      <NewsPageContent itemsJa={itemsJa} itemsEn={itemsEn} />
      <Footer />
    </>
  );
}
