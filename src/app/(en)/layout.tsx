import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/site";
import { pageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chasen | Japanese Tea Stand in Kyoto & Kumamoto",
    template: "%s | Chasen",
  },
  description:
    "Chasen is a Japanese tea stand in Kyoto (Kodaiji) and Kumamoto. Carefully selected matcha, hojicha and sencha, served in a modern style.",
  keywords: "Chasen, Japanese tea, matcha, hojicha, Kyoto cafe, Kodaiji, Kumamoto cafe, tea stand",
  alternates: pageAlternates("/", "en"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "Chasen | Japanese Tea Stand in Kyoto & Kumamoto",
    description: "Carefully selected Japanese tea, served in a modern style. Stores in Kyoto (Kodaiji) and Kumamoto.",
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Chasen — Japanese Tea Stand" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chasen | Japanese Tea Stand in Kyoto & Kumamoto",
    description: "Carefully selected Japanese tea, served in a modern style.",
    images: [OG_IMAGE],
  },
};

export default function EnRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
