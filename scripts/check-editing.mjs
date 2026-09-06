import assert from 'node:assert/strict';
import {test} from 'node:test';
import {safeBookingUrl,DEFAULT_BOOKING} from '../src/lib/booking.ts';
import {readFile} from 'node:fs/promises';
import {imageControls} from '../src/lib/imageFraming.ts';
import {approvedAssetId} from '../src/lib/approvedArtwork.ts';
import {depthFit} from '../src/lib/depthFit.ts';

test('desktop WebGL and HTML fill wide, tall and resized viewports without letterboxes',async()=>{
  for(const [w,h] of [[1512,906],[1920,1004],[2560,1004],[1024,1290],[768,924]]) {
    for(const aspect of [1.5,16/9,4/3]) {
      const [x,y]=depthFit(w/h,aspect,'cover');
      assert.ok(x>0&&x<=1&&y>0&&y<=1);
      assert.ok(x===1||y===1); // smallest possible crop, not extra zoom
      assert.ok(Math.abs((x/y)*aspect-w/h)<1e-10);
    }
  }
  assert.deepEqual(depthFit(1.5,1.5,'contain'),[1,1]);
  assert.deepEqual(depthFit(0,NaN,'cover'),[1,1]);
  const css=await readFile(new URL('../src/app/globals.css',import.meta.url),'utf8');
  assert.match(css,/\.painted-story-images img\s*\{[^}]*object-fit:\s*cover/);
  const story=await readFile(new URL('../src/components/story/Story.tsx',import.meta.url),'utf8');
  assert.match(story,/<DepthCanvas frames=\{frames\} signal=\{signal\} fit="cover"/);
  assert.match(story,/<DepthPanel[^>]+fit="contain"/); // phone keeps the whole painting
});

test('approved paintings resolve by immutable file identity, not CMS row',()=>{
  const prefix='/api/notion-image/3d3c3347-6cb5-8164-abfd-e8c0d38a216b/0/%E7%94%BB%E5%83%8F/';
  assert.equal(approvedAssetId(prefix+'ea764152a01a'),'02-v2');
  assert.equal(approvedAssetId(prefix+'0af7d818a996'),'05-v3');
  assert.equal(approvedAssetId(prefix+'87ca624c7165'),'brand-v1');
  assert.equal(approvedAssetId(prefix+'aaaaaaaaaaaa'),undefined);
  assert.equal(approvedAssetId('https://attacker.example/story-art/02-v2.webp'),undefined);
  assert.equal(approvedAssetId('https://chasen-site-eight.vercel.app/story-art/02-v2.webp'),'02-v2');
});

test('image crop defaults, valid edits and invalid CMS values remain safe',()=>{
  assert.deepEqual(imageControls(),{zoom:1,x:50,y:50});
  assert.deepEqual(imageControls(120,25,75),{zoom:1.2,x:25,y:75});
  assert.deepEqual(imageControls(999,-20,200),{zoom:1.8,x:0,y:100});
  assert.deepEqual(imageControls(NaN,Infinity,undefined),{zoom:1,x:50,y:50});
});

test('booking links accept HTTPS only, never script/data/credential URLs',()=>{
  for(const input of ['javascript:alert(1)','data:text/html,test','http://example.com','https://user:pass@example.com','//example.com','',null])assert.equal(safeBookingUrl(input),undefined);
  assert.equal(safeBookingUrl('https://example.com/book?shop=kyoto'),'https://example.com/book?shop=kyoto');
  assert.ok(DEFAULT_BOOKING.every(s=>s.mode==='電話・お問い合わせ'&&!s.url));
});
test('menu layout retains four/two columns and editable 7:5 framing',async()=>{
  const css=await readFile(new URL('../src/app/globals.css',import.meta.url),'utf8');
  assert.match(css,/\.menu-items\s*\{[^}]*repeat\(4,/);
  assert.match(css,/\.menu-items\s*\{[^}]*repeat\(2,/);
  assert.doesNotMatch(css,/\.menu-items\s*\{[^}]*grid-template-columns:\s*1fr;/);
  assert.match(css,/aspect-ratio:\s*var\(--menu-image-aspect/);
});
test('new uploads cannot inherit unrelated depth maps',async()=>{
  const source=await readFile(new URL('../src/lib/notion.ts',import.meta.url),'utf8');
  assert.match(source,/mobileSrc:undefined, depth:undefined/);
  assert.match(source,/createHash\("sha256"\)/);
});
test('CMS metadata does not make indexing and canonical editable',async()=>{
  const source=await readFile(new URL('../src/lib/cmsMetadata.ts',import.meta.url),'utf8');
  assert.doesNotMatch(source,/read\(['"](?:robots|canonical|index|URL)/);
  assert.match(source,/\.\.\.fallback/);
});
