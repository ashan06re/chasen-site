import { notFound, redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };
/** Local compatibility entry. Review and normal navigation now use one home. */
export default function HomeReviewPage() {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== '1') notFound();
  redirect('/en');
}
