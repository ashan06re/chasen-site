import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import KumamotoStorePage from "@/app/(ja)/stores/kumamoto/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "Visit Chasen at SAKURA MACHI Kumamoto for Japanese tea and matcha sweets. Explore the menu, opening hours and directions.";

export async function generateMetadata() { return cmsMetadata("/stores/kumamoto", "en", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Chasen Kumamoto",
  description,
  alternates: pageAlternates("/stores/kumamoto", "en"),
  openGraph: { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "茶筅 Chasen" }], title: "Chasen Kumamoto | Chasen", description, url: "/en/stores/kumamoto", type: "website", locale: "en_US" },
};

export default KumamotoStorePage;
