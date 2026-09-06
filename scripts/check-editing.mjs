import assert from 'node:assert/strict';
import {test} from 'node:test';
import {safeBookingUrl,DEFAULT_BOOKING} from '../src/lib/booking.ts';
import {readFile} from 'node:fs/promises';
import {imageControls} from '../src/lib/imageFraming.ts';

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
