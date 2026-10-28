import { notFound } from 'next/navigation';
import StoreMenuLayout from '@/components/StoreMenuLayout';
import { storeContent, type FullMenuSection } from '@/data/storeContent';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Local menu QA', robots: { index: false, follow: false } };

/** Synthetic, local-only fixture. No CMS mutations or unapproved product publication. */
export default async function MenuQaPage({ searchParams }: { searchParams: Promise<{ hidden?: string }> }) {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== '1') notFound();
  const { hidden } = await searchParams;
  const ja: FullMenuSection[] = [
    { id: 'qa-sweets', label: '甘味', labelEn: 'Sweets', accent: '#3D6B35', items: [
      { name: '検証用 抹茶スイーツ', description: '検索・分類の動作確認', price: '¥500', photoUrl: '/journey/sweets.webp' },
      { name: '検証用 価格なし', description: '価格空欄の表示確認', price: '', photoUrl: '/journey/tamatebako.webp' },
    ] },
    { id: 'qa-tea', label: 'お茶', labelEn: 'Tea', accent: '#8B5E3C', items: [
      { name: '検証用 ほうじ茶', description: '写真なしの表示確認', price: '¥300' },
    ] },
  ];
  const en: FullMenuSection[] = ja.map(s=>({ ...s, items:s.items.map((item,i)=>({...item,name:`Test ${s.labelEn} ${i+1}`,description:'Local QA item'})) }));
  return <StoreMenuLayout info={storeContent.kyoto.info} fullMenu={hidden==='ja'?[]:ja} fullMenuEn={hidden==='en'?[]:en} reservationUrl='/reserve' reservationUrlEn='/en/reserve' />;
}
