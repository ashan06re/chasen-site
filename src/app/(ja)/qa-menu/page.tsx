import { notFound } from 'next/navigation';
import StoreMenuLayout from '@/components/StoreMenuLayout';
import { DEFAULT_APPEARANCE } from '@/lib/experience';
import { storeContent, type FullMenuSection } from '@/data/storeContent';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Local menu QA', robots: { index: false, follow: false } };

/** Synthetic, local-only fixture. No CMS mutations or unapproved product publication. */
export default async function MenuQaPage({ searchParams }: { searchParams: Promise<{ hidden?: string; photos?: string; long?: string }> }) {
  if (process.env.VERCEL || process.env.CHASEN_LOCAL_QA !== '1') notFound();
  const { hidden, photos, long } = await searchParams;
  const ja: FullMenuSection[] = [
    { id: 'qa-sweets', label: '甘味', labelEn: 'Sweets', accent: '#3D6B35', items: [
      { name: '検証用 玉手箱', note: 'CHASEN SPECIAL', description: 'ふたを開ける、その瞬間も。\n少しずつ楽しむ、甘味のひと箱。', price: '¥2,400', photoUrl: '/editorial/kyoto-treasure.webp' },
      { name: '検証用 季節の甘味', description: '写真を非表示にしても、品名・説明・価格は残ります。', price: '¥850', photoUrl: '/editorial/kyoto-treasure.webp', showPhoto: false },
      { name: '検証用 抹茶アイス', note: 'MATCHA', description: '写真未登録のメニューも掲載できます。', price: '¥650' },
      { name: '検証用 価格なし', description: '価格空欄の表示確認', price: '', photoUrl: '/editorial/kyoto-sweets.webp' },
    ] },
    { id: 'qa-tea', label: 'お茶', labelEn: 'Tea', accent: '#8B5E3C', items: [
      { name: '検証用 お抹茶', note: 'HOT', description: '写真なしの表示確認', price: '¥700' },
      { name: '検証用 ほうじ茶', description: '写真なしの表示確認', price: '¥550' },
    ] },
  ];
  if (photos === 'none') ja.forEach(section => section.items.forEach(item => { item.showPhoto = false; }));
  if (long === '1') {
    ja[0].items[0].name += ' 季節の特別な盛り合わせとお茶のセット';
    ja[0].items[0].description = '長い説明や改行でも内容を切り捨てず、行の高さを自然に広げて読みやすく表示します。'.repeat(4);
  }
  const en: FullMenuSection[] = ja.map(s=>({ ...s, items:s.items.map((item,i)=>({...item,name:`Test ${s.labelEn} ${i+1}`,description:long==='1'&&i===0?'An extended description that wraps naturally without covering the photo or price. '.repeat(5):'Local QA item. Photo visibility is independent of product visibility.'})) }));
  return <StoreMenuLayout info={storeContent.kyoto.info} fullMenu={hidden==='ja'?[]:ja} fullMenuEn={hidden==='en'?[]:en} appearance={{...DEFAULT_APPEARANCE,menuAspect:'1 / 1',priceNote:'税込'}} reservationUrl='/reserve' reservationUrlEn='/en/reserve' />;
}
