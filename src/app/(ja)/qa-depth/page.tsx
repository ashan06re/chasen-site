import { notFound } from "next/navigation";
import DepthChecks from "@/components/story/DepthChecks";

export const dynamic = "force-dynamic";
export const metadata = { title: "Local depth QA", robots: { index: false, follow: false } };

/** Explicit local-only fixture: unavailable on every Vercel deployment and absent from the sitemap. */
export default function DepthQaPage() {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== "1") notFound();
  return <DepthChecks />;
}
