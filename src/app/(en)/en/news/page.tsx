import type { Metadata } from "next";
import NewsPage from "@/app/(ja)/news/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "News, events and announcements from Chasen, a Japanese tea stand in Kyoto and Kumamoto.";

export const metadata: Metadata = {
  title: "News",
  description,
  alternates: pageAlternates("/news", "en"),
  openGraph: { title: "News | Chasen", description, url: "/en/news", type: "website", locale: "en_US" },
};

export default NewsPage;
