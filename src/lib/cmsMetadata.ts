import type { Metadata } from 'next';
import { publishedContent } from './cmsRelease';
import { OG_IMAGE } from './site';

const places:Record<string,string>={'/':'ホーム','/stores/kyoto':'高台寺の店舗案内','/stores/kyoto/menu':'高台寺のお品書き','/stores/kumamoto':'熊本の店舗案内','/stores/kumamoto/menu':'熊本のお品書き','/news':'お知らせ','/reserve':'ご予約','/privacy':'プライバシーポリシー','/terms':'利用規約'};

/** Only editorial metadata can be changed in the CMS. Canonical, language URLs
 * and preview noindex remain protected, independent of what an editor enters. */
export async function cmsMetadata(path:string,lang:'ja'|'en',fallback:Metadata):Promise<Metadata>{
  const row=publishedContent('seo')[places[path]]?.[lang];
  if(!row)return fallback;
  const title=row.title.slice(0,120);
  const description=row.description.slice(0,300);
  if(!title&&!description)return fallback;
  const socialTitle=title||fallback.openGraph?.title;
  const socialDescription=description||fallback.description||undefined;
  return {...fallback,...(title?{title:{absolute:title}}:{}),...(description?{description}:{}),
    openGraph:{...fallback.openGraph,...(socialTitle?{title:socialTitle}:{}),description:socialDescription,images:fallback.openGraph?.images||[OG_IMAGE]},
    twitter:{card:'summary_large_image',...(typeof socialTitle==='string'?{title:socialTitle}:{}),description:socialDescription,images:[OG_IMAGE]}};
}
