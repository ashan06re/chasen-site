import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
const raw=await readFile(new URL('../src/content/cms-release.json',import.meta.url),'utf8');
const release=JSON.parse(raw),digest=x=>createHash('sha256').update(x).digest('hex');
registerHooks({resolve(specifier,context,next){
 let url;if(specifier.startsWith('@/'))url=new URL('../src/'+specifier.slice(2)+'.ts',import.meta.url);
 else if(specifier.startsWith('.')&&!/\.(ts|mjs|json)$/.test(specifier))url=new URL(specifier+'.ts',context.parentURL);
 if(url&&existsSync(url))return {url:url.href,shortCircuit:true};return next(specifier,context);
},load(url,context,next){if(url.endsWith('/cms-release.json'))return {format:'module',source:'export default '+raw,shortCircuit:true};return next(url,context);}});
const cms=await import('../src/lib/notion.ts');
const {GET:image}=await import('../src/app/api/cms-image/[id]/route.ts');
test('edition includes every content area, a valid digest, and no raw CMS metadata or signed URLs',()=>{
 assert.equal(release.schema,1);assert.equal(release.revision,digest(JSON.stringify({payload:release.payload,assets:release.assets})));
 assert.deepEqual(Object.keys(release.payload).sort(),['appearance','booking','brand','experience','menus','news','seo','site','stores','tea']);
 assert.doesNotMatch(raw,/X-Amz-|secret_|ntn_|last_edited_by|created_by|\/api\/notion-image\//i);
 for(const menu of Object.values(release.payload.menus))if(!menu.published)assert.deepEqual(menu.sections,{ja:[],en:[]});
});
test('all published getters work without contacting Notion, and caller changes cannot mutate the release',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>assert.fail('Published edition must not read editable CMS');
 try{
  for(const name of ['getExperience','getAppearance','getAllNewsItems','getBrandStory','getYoshidaSettings','getSiteSettings','getBookingSettings','getAllStoreInfo','getReservationUrls'])assert.ok(await cms[name]());
  for(const store of ['高台寺店','熊本店']){await cms.getStoreInfo(store);await cms.getNewsItems(store);await cms.getFullMenuSections(store);await cms.getMenuPublication(store);}
  const content=await cms.getExperience();content.journey[0].title='MUTATED';assert.notEqual((await cms.getExperience()).journey[0].title,'MUTATED');
 }finally{globalThis.fetch=original;}
});
test('frozen image bytes match their digest, old/unknown assets cannot be retrieved',async()=>{
 for(const [id,asset] of Object.entries(release.assets)){
  const r=await image(new Request('https://example.com'),{params:Promise.resolve({id})});assert.equal(r.status,200);const bytes=Buffer.from(await r.arrayBuffer());assert.equal(bytes.length,asset.bytes);assert.equal(digest(bytes),id);assert.equal(r.headers.get('cache-control'),'private, no-store');
 }
 for(const id of ['..','../cms-release.json','0'.repeat(64)])assert.equal((await image(new Request('https://example.com'),{params:Promise.resolve({id})})).status,404);
});
test('Japanese and English news filter by store without reviving hidden notices',async()=>{
 const all=await cms.getAllNewsItems();for(const store of ['高台寺店','熊本店']){const selected=await cms.getNewsItems(store);for(const lang of ['ja','en'])assert.deepEqual(selected[lang],all[lang].filter(row=>row.store===store));}
});
