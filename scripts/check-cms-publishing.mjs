import assert from 'node:assert/strict';
import {test} from 'node:test';
import {registerHooks} from 'node:module';
import {existsSync} from 'node:fs';
import {respond,calls} from './fixtures/notion-client.mjs';

process.env.NOTION_MENU_PUBLICATION_DB_ID='publication-fixture';
process.env.NOTION_KYOTO_MENU_DB_ID='kyoto-fixture';
process.env.NOTION_BOOKING_DB_ID='booking-fixture';
process.env.NOTION_STORE_INFO_DB_ID='store-fixture';
process.env.NOTION_NEWS_DB_ID='news-fixture';
process.env.NOTION_BRAND_STORY_DB_ID='brand-fixture';
process.env.NOTION_YOSHIDA_SETTINGS_DB_ID='tea-fixture';
registerHooks({resolve(specifier,context,next){
  if(specifier==='./notionClient')return {url:new URL('./fixtures/notion-client.mjs',import.meta.url).href,shortCircuit:true};
  let url;
  if(specifier.startsWith('@/'))url=new URL('../src/'+specifier.slice(2)+'.ts',import.meta.url);
  else if(specifier.startsWith('.')&&!specifier.endsWith('.ts')&&!specifier.endsWith('.mjs'))url=new URL(specifier+'.ts',context.parentURL);
  if(url&&existsSync(url))return {url:url.href,shortCircuit:true};
  return next(specifier,context);
}});
const {getFullMenuSections,getBookingSettings,getAllStoreInfo,getExperience,getAllNewsItems,getNewsItems,getBrandStory,getYoshidaSettings}=await import('../src/lib/notion.ts');
const sel=name=>({select:{name}}), txt=value=>({rich_text:[{plain_text:value}]}), result=results=>({results,has_more:false,next_cursor:null});
const publication=status=>({properties:{店舗:sel('高台寺店'),公開設定:sel(status)}});

test('news visibility is read fresh and stays independent for both shops and languages',async()=>{
 const rows=['高台寺店','熊本店'].flatMap(store=>['日本語','英語'].map(lang=>({properties:{店舗:sel(store),言語:sel(lang),タイトル:{title:[{plain_text:store+lang}]},表示する:{checkbox:true}}})));
 respond(({filter})=>{const conditions=filter.and||[filter];return result(rows.filter(row=>conditions.every(f=>f.checkbox?row.properties[f.property].checkbox===f.checkbox.equals:row.properties[f.property].select.name===f.select.equals)));});
 for(const visible of [true,false,true,false]){
  rows[0].properties.表示する.checkbox=visible;
  const all=await getAllNewsItems();const kyoto=await getNewsItems('高台寺店');const kuma=await getNewsItems('熊本店');
  assert.equal(all.ja.length,visible?2:1);assert.equal(all.en.length,2);
  assert.equal(kyoto.ja.length,visible?1:0);assert.equal(kyoto.en.length,1);assert.equal(kuma.ja.length,1);
 }
 assert.ok(calls.every(c=>c.fresh));
 respond(()=>result([]));assert.deepEqual(await getAllNewsItems(),{ja:[],en:[]});assert.deepEqual(await getNewsItems('高台寺店'),{ja:[],en:[]});
});
test('unchecked brand and tea copy remain hidden instead of resurrecting sample text',async()=>{
 respond(()=>result([]));
 for(const load of [getBrandStory,getYoshidaSettings]){const content=await load();assert.equal(content.ja.visible,false);assert.equal(content.en.visible,false);}
 respond(()=>result([{properties:{言語:sel('日本語'),キャッチコピー:txt('現行ブランド'),紹介文:txt('現行のお茶')}}]));
 assert.notEqual((await getBrandStory()).ja.visible,false);assert.equal((await getBrandStory()).en.visible,false);
 assert.notEqual((await getYoshidaSettings()).ja.visible,false);assert.equal((await getYoshidaSettings()).en.visible,false);
});

test('Kumamoto replacement retires only the old built-in art and preserves later CMS uploads',async()=>{
  const {approvedAssetId}=await import('../src/lib/approvedArtwork.ts');
  assert.equal(approvedAssetId('/api/notion-image/3d3c3347-6cb5-8188-8371-e4b5d49148bd/0/%E7%94%BB%E5%83%8F/81fe8f233b23'),'06-entry-v2');
  assert.equal(approvedAssetId('/api/notion-image/3d3c3347-6cb5-8188-8371-e4b5d49148bd/0/%E7%94%BB%E5%83%8F/111111111111'),undefined);
  const row=src=>({id:'33333333-3333-3333-3333-333333333333',properties:{掲載場所:sel('熊本の店舗パネル'),画像:{files:[{external:{url:src}}]},画像の説明:txt('CMSの説明'),'画像の説明（英語）':txt('CMS description')}});
  respond(()=>result([row('https://chasen-site-eight.vercel.app/story-art/06.webp')]));
  const replaced=(await getExperience()).kumamoto;
  assert.equal(replaced.src,'/story-art/06-entry-v2.webp');
  assert.equal(replaced.depth,'/story-art/06-entry-v2-depth.webp');
  assert.equal(replaced.motion,true);
  assert.match(replaced.alt,/イメージ画/);
  respond(()=>result([row('https://example.com/new-approved-store.webp')]));
  const custom=(await getExperience()).kumamoto;
  assert.equal(custom.src,'https://example.com/new-approved-store.webp');
  assert.equal(custom.alt,'CMSの説明');
  assert.equal(custom.altEn,'CMS description');
  assert.equal(custom.depth,undefined);
});

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
test('store CMS retains independently editable English shop content',async()=>{
  const store=(lang,name,area,hours)=>({properties:{店舗名:{title:[{plain_text:name}]},slug:txt('kyoto'),言語:sel(lang),日本語名:txt(name),エリア:txt(area),住所:txt(`${area} address`),電話番号:txt('000-0000'),営業時間:txt(hours),定休日:txt(`${lang} closed`),アクセス:txt(`${lang} access`),紹介文:txt(`${lang} description`),アクセント色:sel('抹茶'),Instagram:txt('https://www.instagram.com/example/'),'表示する':{checkbox:true}}});
  respond(()=>result([store('日本語','京都店','Kyoto','10:00–18:00'),store('英語','Kodaiji Shop','Higashiyama','10 am–6 pm')]));
  const stores=await getAllStoreInfo();
  assert.equal(stores.ja['高台寺店'].name,'京都店');
  assert.equal(stores.en['高台寺店'].name,'Kodaiji Shop');
  assert.equal(stores.en['高台寺店'].area,'Higashiyama');
  assert.equal(stores.en['高台寺店'].hours,'10 am–6 pm');
});


test('new home reads all five bilingual chapters, uploaded replacements, captions and motion from CMS', async()=>{
  const { JOURNEY_PLACEMENTS } = await import('../src/lib/brandJourney.ts');
  respond(()=>result(JOURNEY_PLACEMENTS.map((place,i)=>({id:`33333333-3333-3333-3333-33333333333${i}`,properties:{掲載場所:sel(place),画像:{files:[{file:{url:`https://s3.amazonaws.com/new-photo-${i}.jpg?signature=private`}}]},見出し:txt(`新しい見出し${i}`),'見出し（英語）':txt(`New title ${i}`),説明文:txt(`説明${i}`),'説明文（英語）':txt(`Body ${i}`),タブ名:txt(`タブ${i}`),'タブ名（英語）':txt(`Tab ${i}`),注記:txt(`注記${i}`),'注記（英語）':txt(`Caption ${i}`),画像の説明:txt(`代替${i}`),'画像の説明（英語）':txt(`Alt ${i}`),動き:sel(i===1?'なし':'奥行き（対応素材）')}}))));
  const {journey}=await getExperience();
  assert.equal(journey.length,5);
  journey.forEach((c,i)=>{assert.equal(c.title,`新しい見出し${i}`);assert.equal(c.titleEn,`New title ${i}`);assert.equal(c.body,`説明${i}`);assert.equal(c.bodyEn,`Body ${i}`);assert.equal(c.name,`タブ${i}`);assert.equal(c.nameEn,`Tab ${i}`);assert.equal(c.caption,`注記${i}`);assert.equal(c.captionEn,`Caption ${i}`);assert.equal(c.alt,`代替${i}`);assert.equal(c.altEn,`Alt ${i}`);assert.equal(c.motion,i!==1);assert.match(c.image,/^\/api\/notion-image\//);assert.ok(!c.image.includes('signature'));});
});
test('legacy CMS story cannot overwrite new chapters and missing CMS retains approved defaults', async()=>{
  respond(()=>result([{id:'old',properties:{掲載場所:sel('入口の物語'),見出し:txt('OLD RITUAL'),画像:{files:[{external:{url:'https://example.com/old.jpg'}}]}}}]));
  const content=await getExperience();assert.equal(content.scenes[0].ja,'OLD RITUAL');assert.notEqual(content.journey[0].title,'OLD RITUAL');assert.equal(content.journey[0].image,'/journey/tamatebako.webp');
  respond(()=>{throw Error('offline')});assert.equal((await getExperience()).journey.length,5);
});
test('new home introduction is editable in both languages',async()=>{
 respond(()=>result([{id:'intro',properties:{掲載場所:sel('新ホーム｜導入文'),見出し:txt('導入'),'見出し（英語）':txt('Introduction'),説明文:txt('本文'),'説明文（英語）':txt('Body'),画像の説明:txt('店の説明'),'画像の説明（英語）':txt('Identity'),ラベル:txt('LABEL')}}]));
 const {journeyIntro:c}=await getExperience();assert.deepEqual(c,{identity:'店の説明',identityEn:'Identity',label:'LABEL',title:'導入',titleEn:'Introduction',body:'本文',bodyEn:'Body'});
});
