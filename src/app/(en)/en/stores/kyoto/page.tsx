import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import KyotoStorePage from "@/app/(ja)/stores/kyoto/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "A Japanese tea stand near Kodaiji Temple in Kyoto's Higashiyama. Carefully selected tea leaves, brewed one cup at a time.";

export async function generateMetadata() { return cmsMetadata("/stores/kyoto", "en", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Chasen Kodaiji, Kyoto",
  description,
  alternates: pageAlternates("/stores/kyoto", "en"),
  openGraph: { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen" }], title: "Chasen Kodaiji, Kyoto | Chasen", description, url: "/en/stores/kyoto", type: "website", locale: "en_US" },
};

export default KyotoStorePage;
