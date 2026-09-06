import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import KyotoMenuPage from "@/app/(ja)/stores/kyoto/menu/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "Full menu of Chasen Kodaiji, Kyoto: matcha and hojicha drinks, Japanese sweets, light meals and sets.";

export async function generateMetadata() { return cmsMetadata("/stores/kyoto/menu", "en", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Menu — Chasen Kodaiji, Kyoto",
  description,
  alternates: pageAlternates("/stores/kyoto/menu", "en"),
  openGraph: { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen" }], title: "Menu — Chasen Kodaiji, Kyoto | Chasen", description, url: "/en/stores/kyoto/menu", type: "website", locale: "en_US" },
};

export default KyotoMenuPage;
