import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/i18n';
import { OG_IMAGE } from '@/lib/site';
import Page from '@/app/(ja)/reserve/page';
export const revalidate=60;
const description='Book your next Chasen moment in Kyoto or Kumamoto. Find shop-specific booking options, phone numbers, menus and guidance for changes or cancellations.';
export async function generateMetadata() { return cmsMetadata("/reserve", "en", defaultMetadata); }
const defaultMetadata:Metadata={title:'Reservations',description,alternates:pageAlternates('/reserve','en'),openGraph:{title:'Reservations | Chasen',description,url:'/en/reserve',images:[OG_IMAGE]}};
export default Page;
