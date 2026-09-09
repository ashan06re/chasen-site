import assert from 'node:assert/strict';
import {test} from 'node:test';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
import {respond,calls} from './fixtures/notion-client.mjs';

process.env.NOTION_MENU_PUBLICATION_DB_ID='publication-fixture';
process.env.NOTION_KYOTO_MENU_DB_ID='kyoto-fixture';
process.env.NOTION_BOOKING_DB_ID='booking-fixture';
registerHooks({resolve(specifier,context,next){
  if(specifier==='./notionClient')return {url:new URL('./fixtures/notion-client.mjs',import.meta.url).href,shortCircuit:true};
  let url;
  if(specifier.startsWith('@/'))url=new URL('../src/'+specifier.slice(2)+'.ts',import.meta.url);
  else if(specifier.startsWith('.')&&!specifier.endsWith('.ts')&&!specifier.endsWith('.mjs'))url=new URL(specifier+'.ts',context.parentURL);
  if(url&&existsSync(url))return {url:url.href,shortCircuit:true};
  return next(specifier,context);
}});
const {getFullMenuSections,getBookingSettings}=await import('../src/lib/notion.ts');
const sel=name=>({select:{name}}), txt=value=>({rich_text:[{plain_text:value}]}), result=results=>({results,has_more:false,next_cursor:null});
const publication=status=>({properties:{店舗:sel('高台寺店'),公開設定:sel(status)}});

test('real CMS getter never fetches menu rows when hidden, missing, ambiguous or unavailable',async()=>{
  for(const rows of [[publication('投稿しない')],[],[publication('投稿する'),publication('投稿する')],null]){
    respond(({database_id})=>{assert.equal(database_id,'publication-fixture');if(rows===null)throw Error('offline fixture');return result(rows);});
    assert.deepEqual(await getFullMenuSections('高台寺店'),{ja:[],en:[]});
    assert.equal(calls.length,1);
    assert.equal(calls[0].fresh,true);
  }
});
test('real CMS getter uses bilingual category and named accent without photo controls',async()=>{
  respond(({database_id})=>database_id==='publication-fixture'?result([publication('投稿する')]):result([
    {id:'ja-row',properties:{メニュー名:{title:[{plain_text:'試験用のお茶'}]},カテゴリー:sel('お茶｜Tea'),言語:sel('日本語'),価格:txt('¥500'),アクセント色:sel('ほうじ茶')}},
    {id:'en-row',properties:{メニュー名:{title:[{plain_text:'Test tea'}]},カテゴリー:sel('お茶｜Tea'),言語:sel('英語'),価格:txt('¥500')}}
  ]));
  const menus=await getFullMenuSections('高台寺店');
  assert.equal(menus.ja[0].label,'お茶');assert.equal(menus.en[0].labelEn,'Tea');
  assert.equal(menus.ja[0].items[0].accent,'#8B5E3C');
  assert.equal('photoZoom' in menus.ja[0].items[0],false);
  assert.equal('photoX' in menus.ja[0].items[0],false);
  assert.equal(calls[1].filter.property,'表示する');
});
test('real booking getter reads independently editable language URLs',async()=>{
  respond(()=>result([{properties:{店舗:sel('高台寺店'),受付方法:sel('外部予約サイト'),予約ページ:{url:'https://example.com/ja'},'予約ページ（英語）':{url:'https://example.com/en'}}}]));
  const settings=await getBookingSettings();
  assert.equal(settings[0].url,'https://example.com/ja');assert.equal(settings[0].urlEn,'https://example.com/en');
});
