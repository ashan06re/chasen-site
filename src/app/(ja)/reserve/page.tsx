import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/i18n';
import { OG_IMAGE } from '@/lib/site';
import { getAllStoreInfo, getBookingSettings } from '@/lib/notion';
import ReservationPage from '@/components/ReservationPage';
import Footer from '@/components/Footer';
import { storeContent } from '@/data/storeContent';
export const revalidate=60;
const description='茶筅 高台寺店・熊本店のご予約案内。店舗ごとの受付方法、お電話、お品書き、予約の変更・キャンセルについてご確認いただけます。';
export async function generateMetadata() { return cmsMetadata("/reserve", "ja", defaultMetadata); }
const defaultMetadata:Metadata={title:'ご予約のご案内',description,alternates:pageAlternates('/reserve','ja'),openGraph:{title:'ご予約のご案内 | 茶筅 Chasen',description,url:'/reserve',images:[OG_IMAGE]}};
export default async function Page(){const [settings,stores]=await Promise.all([getBookingSettings(),getAllStoreInfo().catch(()=>({ja:{'高台寺店':storeContent.kyoto.info,'熊本店':storeContent.kumamoto.info},en:{'高台寺店':storeContent.kyoto.info,'熊本店':storeContent.kumamoto.info}}))]);return <><ReservationPage settings={settings} stores={[stores.ja['高台寺店'],stores.ja['熊本店']]} storesEn={[stores.en['高台寺店'],stores.en['熊本店']]}/><Footer/></>;}
