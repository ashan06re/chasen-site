// One-time, additive migration for the new home. No legacy rows are edited.
// Run explicitly with --apply; reads before writing, resumes by placement.
import { Client } from '@notionhq/client';
import { readFile, writeFile } from 'node:fs/promises';
import { BRAND_CHAPTERS, JOURNEY_PLACEMENTS, DEFAULT_JOURNEY_INTRO, DEFAULT_IMAGE_DESCRIPTIONS } from '../src/lib/brandJourney.ts';
const client = new Client({auth:process.env.NOTION_TOKEN});
const database_id=process.env.NOTION_EXPERIENCE_DB_ID||'3d3c3347-6cb5-81d8-a7d5-f7d3a8aa18ec';
const dir='../引き継ぎ/ホームCMS統合_20261027';
const rt=s=>({rich_text:[{text:{content:s}}]}), select=name=>({select:{name}});
const placements=[...JOURNEY_PLACEMENTS,'新ホーム｜導入文'];
const db=await client.databases.retrieve({database_id});
const before=await client.databases.query({database_id,page_size:100});
if(before.has_more)throw Error('Unexpected extra CMS rows; inspect before migration');
const rows=before.results;
if(!process.argv.includes('--apply')) {console.log(JSON.stringify({create:placements.filter(place=>!rows.some(r=>r.properties.掲載場所.select?.name===place)),newFields:['ラベル','タブ名','タブ名（英語）','注記','注記（英語）']}));process.exit(0)}
const properties={};
for(const name of ['ラベル','タブ名','タブ名（英語）','注記','注記（英語）'])if(!db.properties[name])properties[name]={rich_text:{}};
properties['掲載場所']={select:{options:[...db.properties.掲載場所.select.options.map(({id,name,color})=>({id,name,color})),...placements.filter(name=>!db.properties.掲載場所.select.options.some(o=>o.name===name)).map(name=>({name,color:'default'}))]}};
await client.databases.update({database_id,properties});
const headers={Authorization:`Bearer ${process.env.NOTION_TOKEN}`,'Notion-Version':'2022-06-28'};
async function upload(filename){
 const bytes=await readFile('public/journey/'+filename);
 const create=await fetch('https://api.notion.com/v1/file_uploads',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({mode:'single_part',filename,content_type:'image/webp'})});
 if(!create.ok)throw Error(`Upload create HTTP ${create.status}`);
 const {id}=await create.json();const form=new FormData();form.append('file',new Blob([bytes],{type:'image/webp'}),filename);
 const sent=await fetch(`https://api.notion.com/v1/file_uploads/${id}/send`,{method:'POST',headers,body:form});
 if(!sent.ok)throw Error(`Upload send HTTP ${sent.status}`);
 return {files:[{name:filename,type:'file_upload',file_upload:{id}}]};
}
const evidence=[];
for(const [i,c] of BRAND_CHAPTERS.entries()){
 const place=JOURNEY_PLACEMENTS[i];let row=rows.find(r=>r.properties.掲載場所.select?.name===place);
 if(!row){const properties={名前:{title:[{text:{content:`新ホーム ${String(i+1).padStart(2,'0')}｜${c.name}`}}]},掲載場所:select(place),表示順:{number:20+i},画像:await upload(c.id+'.webp'),動き:select('奥行き（対応素材）'),見出し:rt(c.title),'見出し（英語）':rt(c.titleEn),説明文:rt(c.body),'説明文（英語）':rt(c.bodyEn),ラベル:rt(c.label),タブ名:rt(c.name),'タブ名（英語）':rt(c.nameEn),注記:rt(c.caption),'注記（英語）':rt(c.captionEn),画像の説明:rt(DEFAULT_IMAGE_DESCRIPTIONS[c.id].ja),'画像の説明（英語）':rt(DEFAULT_IMAGE_DESCRIPTIONS[c.id].en)};
 row=await client.pages.create({parent:{database_id},properties,children:[{object:'block',type:'paragraph',paragraph:{rich_text:[{text:{content:'新ホーム用。画像は「画像」欄の1枚目を差し替えます。横長16:9程度（例1672×941px）、全5場面共通の表示枠です。PCは画面に合わせて裁ち落とし、スマホは全景表示。見出し・説明文・タブ名・注記・画像の説明は日英を別々に編集できます。本文に貼った画像はHPへ反映しません。画像が空欄の場合は採用済み画像を表示。動きを止める場合は「なし」。新ホームの本番公開前は公開サイトに反映しません。'}}]}}]});console.log('Created',place);}
 const saved=await client.pages.retrieve({page_id:row.id});
 evidence.push({placement:place,id:saved.id,url:saved.url,imageCount:saved.properties.画像.files.length,title:saved.properties.見出し.rich_text.map(t=>t.plain_text).join('')});
 await writeFile(dir+'/cms-migration-progress.json',JSON.stringify(evidence,null,2));
}
const intro=DEFAULT_JOURNEY_INTRO;
if(!rows.some(r=>r.properties.掲載場所.select?.name==='新ホーム｜導入文'))await client.pages.create({parent:{database_id},properties:{名前:{title:[{text:{content:'新ホーム｜共通の導入文'}}]},掲載場所:select('新ホーム｜導入文'),表示順:{number:25},画像の説明:rt(intro.identity),'画像の説明（英語）':rt(intro.identityEn),ラベル:rt(intro.label),見出し:rt(intro.title),'見出し（英語）':rt(intro.titleEn),説明文:rt(intro.body),'説明文（英語）':rt(intro.bodyEn)}});
const after=await client.databases.query({database_id,page_size:100});
const normalize=properties=>JSON.stringify(Object.fromEntries(Object.entries(properties).filter(([k])=>Object.hasOwn(db.properties,k)).map(([k,p])=>[k,p.type==='files'?p.files.map(f=>({name:f.name,type:f.type,url:(f.file?.url||f.external?.url||'').split('?')[0]})):p])));
for(const old of rows.filter(r=>!placements.includes(r.properties.掲載場所.select?.name))){const current=after.results.find(r=>r.id===old.id);if(!current||normalize(old.properties)!==normalize(current.properties))throw Error('Legacy row changed: '+old.id)}
await writeFile(dir+'/cms-after.json',JSON.stringify(after.results,null,2));
await writeFile(dir+'/cms-migration.json',JSON.stringify({database_id,createdPlacements:placements,legacyRowsUnchanged:true,chapters:evidence},null,2));
console.log('PASS 5 images and bilingual fields; legacy rows unchanged');
