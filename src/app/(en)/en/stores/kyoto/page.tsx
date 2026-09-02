import type { Metadata } from "next";
import KyotoStorePage from "@/app/(ja)/stores/kyoto/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "A Japanese tea stand near Kodaiji Temple in Kyoto's Higashiyama. Carefully selected tea leaves, brewed one cup at a time.";

export const metadata: Metadata = {
  title: "Chasen Kodaiji, Kyoto",
  description,
  alternates: pageAlternates("/stores/kyoto", "en"),
  openGraph: { title: "Chasen Kodaiji, Kyoto | Chasen", description, url: "/en/stores/kyoto", type: "website", locale: "en_US" },
};

export default KyotoStorePage;
