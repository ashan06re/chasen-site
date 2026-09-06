import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import PrivacyPage from "@/app/(ja)/privacy/page";
import { pageAlternates } from "@/lib/i18n";

export async function generateMetadata() { return cmsMetadata("/privacy", "en", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Privacy Policy",
  description: "How Chasen handles personal information.",
  alternates: pageAlternates("/privacy", "en"),
};

export default PrivacyPage;
export const revalidate = 60;
