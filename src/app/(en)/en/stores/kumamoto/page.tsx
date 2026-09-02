import type { Metadata } from "next";
import KumamotoStorePage from "@/app/(ja)/stores/kumamoto/page";
import { pageAlternates } from "@/lib/i18n";

export const revalidate = 60;

const description = "A Japanese tea café in Sakuramachi, Kumamoto. Tea grown in Kumamoto's nature, served in a modern style.";

export const metadata: Metadata = {
  title: "Chasen Kumamoto",
  description,
  alternates: pageAlternates("/stores/kumamoto", "en"),
  openGraph: { title: "Chasen Kumamoto | Chasen", description, url: "/en/stores/kumamoto", type: "website", locale: "en_US" },
};

export default KumamotoStorePage;
