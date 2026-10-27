import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL, SITE_NAME, OG_IMAGE, IS_PREVIEW } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chasen | Tamatebako, Matcha Sweets & Dining",
    template: "%s | Chasen",
  },
  description:
    "Discover Tamatebako, matcha sweets and dining at Chasen in Kyoto and Kumamoto, featuring matcha from Yoshida Meichaen.",
  keywords: "Chasen, Tamatebako, matcha sweets, dining, Yoshida Meichaen, Kyoto cafe, Kodaiji, Kumamoto cafe",
  alternates: pageAlternates("/", "en"),
  robots: { index: !IS_PREVIEW, follow: true },
  openGraph: {
    title: "Chasen | Tamatebako, Matcha Sweets & Dining",
    description: "Tamatebako, matcha sweets and dining in Kyoto and Kumamoto, featuring matcha from Yoshida Meichaen.",
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Chasen — Tamatebako, Matcha Sweets & Dining" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chasen | Tamatebako, Matcha Sweets & Dining",
    description: "Tamatebako, matcha sweets and dining, featuring matcha from Yoshida Meichaen.",
    images: [OG_IMAGE],
  },
};

export default function EnRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
