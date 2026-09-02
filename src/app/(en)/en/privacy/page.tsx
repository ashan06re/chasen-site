import type { Metadata } from "next";
import PrivacyPage from "@/app/(ja)/privacy/page";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Chasen handles personal information.",
  alternates: pageAlternates("/privacy", "en"),
  robots: { index: true, follow: true },
};

export default PrivacyPage;
