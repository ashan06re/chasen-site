import type { Metadata } from 'next';
import { cache } from 'react';
import { queryNotion } from './notionClient';
import { SEO_DB } from './cmsIds';
import { OG_IMAGE } from './site';

const load=cache(async()=>{try{return(await queryNotion({database_id:SEO_DB,page_size:100})).results;}catch{return[];}});
const places:Record<string,string>={'/':'ホーム','/stores/kyoto':'高台寺の店舗案内','/stores/kyoto/menu':'高台寺のお品書き','/stores/kumamoto':'熊本の店舗案内','/stores/kumamoto/menu':'熊本のお品書き','/news':'お知らせ','/reserve':'ご予約','/privacy':'プライバシーポリシー','/terms':'利用規約'};

/** Only editorial metadata can be changed in the CMS. Canonical, language URLs
 * and preview noindex remain protected, independent of what an editor enters. */
export async function cmsMetadata(path:string,lang:'ja'|'en',fallback:Metadata):Promise<Metadata>{
  const rows=await load();
  const row=rows.find(r=>'properties' in r&&(r.properties['ページ'] as {select?:{name?:string}})?.select?.name===places[path]);
  if(!row||!('properties' in row))return fallback;
  const read=(key:string)=>{const p=row.properties[`${key}${lang==='en'?'（英語）':''}`];return p?.type==='rich_text'?p.rich_text.map(t=>t.plain_text).join('').trim():'';};
  const title=read('検索タイトル').slice(0,120);
  const description=read('紹介文').slice(0,300);
  if(!title&&!description)return fallback;
  const socialTitle=title||fallback.openGraph?.title;
  const socialDescription=description||fallback.description||undefined;
  return {...fallback,...(title?{title:{absolute:title}}:{}),...(description?{description}:{}),
    openGraph:{...fallback.openGraph,...(socialTitle?{title:socialTitle}:{}),description:socialDescription,images:fallback.openGraph?.images||[OG_IMAGE]},
    twitter:{card:'summary_large_image',...(typeof socialTitle==='string'?{title:socialTitle}:{}),description:socialDescription,images:[OG_IMAGE]}};
}
