import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import TermsPage from "@/app/(ja)/terms/page";
import { pageAlternates } from "@/lib/i18n";

export async function generateMetadata() { return cmsMetadata("/terms", "en", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use, disclaimer and copyright for the Chasen website.",
  alternates: pageAlternates("/terms", "en"),
};

export default TermsPage;
export const revalidate = 60;
