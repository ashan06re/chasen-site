import HomePage from "@/app/(ja)/page";
import { cmsMetadata } from '@/lib/cmsMetadata';
import { metadata as defaultMetadata } from '../layout';
export async function generateMetadata() { return cmsMetadata('/', 'en', defaultMetadata); }

export const revalidate = 60;

export default HomePage;
