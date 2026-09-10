import assert from 'node:assert/strict';
import {test} from 'node:test';
import {registerHooks} from 'node:module';

const kyoto='11111111-1111-1111-1111-111111111111';
const legacy='22222222-2222-2222-2222-222222222222';
const pageId='33333333-3333-3333-3333-333333333333';
process.env.NOTION_KYOTO_MENU_DB_ID=kyoto;
process.env.NOTION_MENU_DB_ID=legacy;
const fixture={published:false,visible:true,parent:kyoto,fetches:0};
globalThis.imagePublicationFixture=fixture;
const modules={
  '@/lib/cmsIds': 'export const EXPERIENCE_DB="44444444-4444-4444-4444-444444444444";',
  '@/lib/notion': 'export async function getMenuPublication(){return globalThis.imagePublicationFixture.published;}',
  '@/lib/notionClient': `export const notion={pages:{retrieve:async()=>({parent:{database_id:globalThis.imagePublicationFixture.parent},properties:{表示する:{checkbox:globalThis.imagePublicationFixture.visible},写真:{files:[{file:{url:'https://s3.amazonaws.com/fixture.jpg'}}]}}})}};`,
};
registerHooks({resolve(specifier,context,next){
  if(modules[specifier])return {url:'data:text/javascript,'+encodeURIComponent(modules[specifier]),shortCircuit:true};
  return next(specifier,context);
}});
const {GET}=await import('../src/app/api/notion-image/[...parts]/route.ts');
const request=()=>GET(new Request('https://example.com'),{params:Promise.resolve({parts:[pageId,'0','写真']})});
test('image route closes direct URLs with store switch, missing visibility and retired databases',async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async()=>{fixture.fetches++;return new Response(new Uint8Array([1,2]),{headers:{'Content-Type':'image/jpeg'}});};
  try{
    for(const state of [{published:false,visible:true,parent:kyoto},{published:true,visible:undefined,parent:kyoto},{published:true,visible:false,parent:kyoto},{published:true,visible:true,parent:legacy}]){
      Object.assign(fixture,state);const r=await request();assert.equal(r.status,404);assert.equal(r.headers.get('cache-control'),'private, no-store');
    }
    assert.equal(fixture.fetches,0);
    Object.assign(fixture,{published:true,visible:true,parent:kyoto});
    const r=await request();assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'private, no-store');assert.equal(fixture.fetches,1);await r.arrayBuffer();
  }finally{globalThis.fetch=original;delete globalThis.imagePublicationFixture;}
});
