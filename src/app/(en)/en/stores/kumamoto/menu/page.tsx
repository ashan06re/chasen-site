import type { Metadata } from "next";
import KumamotoMenuPage from "@/app/(ja)/stores/kumamoto/menu/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "Full menu of Chasen Kumamoto: matcha and hojicha drinks, shaved ice, Japanese sweets, meals and sets.";

export const metadata: Metadata = {
  title: "Menu — Chasen Kumamoto",
  description,
  alternates: pageAlternates("/stores/kumamoto/menu", "en"),
  openGraph: { title: "Menu — Chasen Kumamoto | Chasen", description, url: "/en/stores/kumamoto/menu", type: "website", locale: "en_US" },
};

export default KumamotoMenuPage;
