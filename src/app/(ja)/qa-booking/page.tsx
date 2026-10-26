import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReservationPage from '@/components/ReservationPage';
import Footer from '@/components/Footer';
import { getAllStoreInfo } from '@/lib/notion';
import type { BookingSetting } from '@/lib/booking';

export const dynamic = 'force-dynamic';
export const metadata = { title: '予約の限定テスト / Booking test', robots: { index: false, follow: false } };

/** Never available on Vercel. Uses the real reservation component, not a mock form. */
export default async function BookingQaPage() {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== '1') notFound();
  const ja = process.env.CHASEN_TEST_FORM_JA;
  const en = process.env.CHASEN_TEST_FORM_EN;
  // Only the Google Forms responder links verified by the operator may be configured.
  const valid = (url: string | undefined) => !!url && /^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform(?:\?usp=[A-Za-z0-9_-]+)?$/.test(url);
  if (!valid(ja) || !valid(en)) notFound();
  const stores = await getAllStoreInfo();
  const settings: BookingSetting[] = [{
    store: '高台寺店', mode: '電話・お問い合わせ', url: ja, urlEn: en,
    note: '限定テスト：ご本人のテスト用メールのみ使用してください。送信だけでは予約確定になりません。申込受付は日本時間6:00〜22:00、来店希望は月〜日11:00〜21:00（不定休）。当日を含め、来店希望時刻の6時間前まで受付。1〜8名、9名以上は電話・店舗メールへ。返信目安12時間以内。',
    noteEn: 'Private test: use only the approved test email. Submitting a request does not confirm a booking. Requests: 06:00–22:00 Japan time. Visits: Mon–Sun 11:00–21:00, with irregular closures. Submit at least 6 hours before the requested visit time, including same-day requests. 1–8 guests; 9+ by phone or shop email. Reply within 12 hours.',
  }];
  return <>
    <aside style={{ position: 'relative', zIndex: 60, background: '#3d4b36', color: '#fff', padding: '16px 24px' }}>
      LOCAL TEST · 一般公開の予約ページではありません / Not public booking ·{' '}
      <Link href="/qa-booking" style={{ textDecoration: 'underline' }}>日本語</Link>{' / '}
      <Link href="/en/qa-booking" style={{ textDecoration: 'underline' }}>English</Link>
    </aside>
    <ReservationPage settings={settings} stores={[stores.ja['高台寺店']]} storesEn={[stores.en['高台寺店']]} />
    <Footer />
  </>;
}
