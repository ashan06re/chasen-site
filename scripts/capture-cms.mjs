/** Read-only Notion -> local reviewed edition. Never pushes, deploys, or edits Notion. */
import {registerHooks} from 'node:module';
import nextEnv from '@next/env';
const {loadEnvConfig}=nextEnv;
import {existsSync} from 'node:fs';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
loadEnvConfig(root);
// Draft getters can use sensible defaults on the public site. A release capture
// must instead stop when a database is not configured, preserving the old edition.
for(const name of ['NOTION_TOKEN','NOTION_NEWS_DB_ID','NOTION_KYOTO_MENU_DB_ID','NOTION_KUMAMOTO_MENU_DB_ID','NOTION_BRAND_STORY_DB_ID','NOTION_SITE_SETTINGS_DB_ID','NOTION_STORE_INFO_DB_ID','NOTION_YOSHIDA_SETTINGS_DB_ID']){
 if(!process.env[name]?.trim())throw Error(name+' is required; previous edition kept');
}
registerHooks({resolve(specifier,context,next){
 if(specifier==='./notionClient')return {url:new URL('./lib/capture-notion-client.mjs',import.meta.url).href,shortCircuit:true};
 let url;if(specifier.startsWith('@/'))url=new URL('../src/'+specifier.slice(2)+'.ts',import.meta.url);
 else if(specifier.startsWith('.')&&!/\.(ts|mjs|json)$/.test(specifier))url=new URL(specifier+'.ts',context.parentURL);
 if(url&&existsSync(url))return {url:url.href,shortCircuit:true};return next(specifier,context);
}});
const live=await import('../src/lib/notionDraft.ts');
const {notion,queryNotion,failures,verifyUnchanged}=await import('./lib/capture-notion-client.mjs');
const {SEO_DB}=await import('../src/lib/cmsIds.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const payload={};
for(const [key,getter] of Object.entries({experience:'getExperience',appearance:'getAppearance',news:'getAllNewsItems',brand:'getBrandStory',tea:'getYoshidaSettings',site:'getSiteSettings',booking:'getBookingSettings',stores:'getAllStoreInfo'}))payload[key]=await live[getter]();
payload.menus={};
for(const store of ['高台寺店','熊本店'])payload.menus[store]={published:await live.getMenuPublication(store),sections:await live.getFullMenuSections(store)};
payload.seo={};
const seo=await queryNotion({database_id:SEO_DB,page_size:100});
if(seo.has_more)throw Error('SEO pagination requires review');
for(const page of seo.results){const p=page.properties,place=p?.['ページ']?.select?.name;if(!place)continue;if(payload.seo[place])throw Error('Duplicate SEO page');
 const text=k=>(p[k]?.rich_text||[]).map(t=>t.plain_text).join('').trim();
 payload.seo[place]={ja:{title:text('検索タイトル').slice(0,120),description:text('紹介文').slice(0,300)},en:{title:text('検索タイトル（英語）').slice(0,120),description:text('紹介文（英語）').slice(0,300)}};
}
if(failures.length)throw Error('CMS unavailable; previous edition kept');
const assets={},files=new Map(),pageCache=new Map();
const imageKeys=new Set(['image','src','mobileSrc','depth','photoUrl']);
const allowedHost=host=>/(^|\.)(amazonaws\.com|notion\.so|notion-static\.com)$/.test(host)||['chasenco.com','chasen-site-eight.vercel.app'].includes(host)||/^chasen-site-[a-z0-9-]+\.vercel\.app$/.test(host);
async function freeze(source){
 if(!source.startsWith('/api/notion-image/')&&!source.startsWith('https://'))return source;
 let remote=source;
 if(source.startsWith('/api/notion-image/')){
  const parts=source.split('/').slice(3),[pageId,idx,prop,revision]=parts;
  if(!pageCache.has(pageId))pageCache.set(pageId,await notion.pages.retrieve({page_id:pageId}));
  const page=pageCache.get(pageId);if(page.archived||page.in_trash)throw Error('Image source archived');
  const file=page.properties?.[decodeURIComponent(prop)]?.files?.[Number(idx)];remote=file?.file?.url||file?.external?.url;
  if(!remote||revision&&hash(remote.split('?')[0]).slice(0,12)!==revision)throw Error('Image changed during capture');
 }
 const url=new URL(remote);if(url.protocol!=='https:'||url.username||url.password||!allowedHost(url.hostname))throw Error('Image host requires explicit review: '+url.hostname);
 const response=await fetch(remote,{redirect:'error',signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('Image download failed');
 const contentType=(response.headers.get('content-type')||'').split(';')[0];
 const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif'})[contentType];
 if(!ext)throw Error('Unsupported image type');
 const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>30*1024*1024)throw Error('Image exceeds 30 MiB');chunks.push(chunk);}
 const bytes=Buffer.concat(chunks),id=hash(bytes),file=id+'.'+ext;
 assets[id]={file,contentType,bytes:bytes.length};files.set(file,bytes);return '/api/cms-image/'+id;
}
async function walk(value){if(Array.isArray(value)){for(let i=0;i<value.length;i++)value[i]=await walk(value[i]);}
 else if(value&&typeof value==='object'){for(const [key,v] of Object.entries(value))value[key]=imageKeys.has(key)&&typeof v==='string'?await freeze(v):await walk(v);}return value;}
await walk(payload);
await verifyUnchanged();
const revision=hash(JSON.stringify({payload,assets}));
const release={schema:1,revision,capturedAt:new Date().toISOString(),payload,assets};
const serialized=JSON.stringify(release,null,2)+'\n';
if(/X-Amz-|secret_[A-Za-z0-9]|ntn_[A-Za-z0-9]/i.test(serialized))throw Error('Private URL or credential detected');
const dir=resolve(root,'src/content/cms-assets');await mkdir(dir,{recursive:true});
for(const [file,bytes]of files)await writeFile(resolve(dir,file),bytes,{flag:'w'});
// The only pointer is replaced last, after every fetch, consistency check and asset write.
const target=resolve(root,'src/content/cms-release.json');
await writeFile(target+'.tmp',serialized);await rename(target+'.tmp',target);
console.log(JSON.stringify({revision,assets:files.size,bytes:[...files.values()].reduce((n,b)=>n+b.length,0),queries: 'all repeated and unchanged',notionWrites:0,deployed:false},null,2));
