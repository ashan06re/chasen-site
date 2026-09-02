import type { Metadata } from "next";
import TermsPage from "@/app/(ja)/terms/page";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use, disclaimer and copyright for the Chasen website.",
  alternates: pageAlternates("/terms", "en"),
  robots: { index: true, follow: true },
};

export default TermsPage;
