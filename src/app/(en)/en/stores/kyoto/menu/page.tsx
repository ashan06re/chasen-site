import type { Metadata } from "next";
import KyotoMenuPage from "@/app/(ja)/stores/kyoto/menu/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "Full menu of Chasen Kodaiji, Kyoto: matcha and hojicha drinks, Japanese sweets, light meals and sets.";

export const metadata: Metadata = {
  title: "Menu — Chasen Kodaiji, Kyoto",
  description,
  alternates: pageAlternates("/stores/kyoto/menu", "en"),
  openGraph: { title: "Menu — Chasen Kodaiji, Kyoto | Chasen", description, url: "/en/stores/kyoto/menu", type: "website", locale: "en_US" },
};

export default KyotoMenuPage;
