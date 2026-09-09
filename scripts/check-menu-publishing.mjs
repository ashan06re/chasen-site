import assert from 'node:assert/strict';
import {test} from 'node:test';
import {menuIsPublished,photoPreset} from '../src/lib/menuPublishing.ts';
import {bookingHref,DEFAULT_BOOKING} from '../src/lib/booking.ts';

test('only one explicit store publication opens the menu',()=>{
  const yes={store:'高台寺店',status:'投稿する'};
  assert.equal(menuIsPublished([yes],'高台寺店'),true);
  for(const rows of [[],[{...yes,status:'投稿しない'}],[{...yes,status:''}],[yes,yes],[{...yes,store:'熊本店'}]])assert.equal(menuIsPublished(rows,'高台寺店'),false);
  assert.equal(menuIsPublished([yes,{store:'熊本店',status:'投稿しない'}],'高台寺店'),true);
});
test('photo choices map to safe crop values and preserve advanced settings',()=>{
  assert.deepEqual(photoPreset('少し寄る','上'),{photoZoom:115,photoX:50,photoY:20});
  assert.deepEqual(photoPreset('標準','中央'),{photoZoom:100,photoX:50,photoY:50});
  assert.deepEqual(photoPreset('詳細調整','詳細調整'),{photoZoom:undefined,photoX:undefined,photoY:undefined});
});
test('booking targets respond to language, edited URL and pause',()=>{
  const s={...DEFAULT_BOOKING[0],mode:'外部予約サイト',url:'https://example.com/ja',urlEn:'https://example.com/en'};
  assert.equal(bookingHref(s,'ja'),s.url);
  assert.equal(bookingHref(s,'en'),s.urlEn);
  assert.equal(bookingHref({...s,urlEn:'https://example.com/new'},'en'),'https://example.com/new');
  assert.equal(bookingHref({...s,urlEn:''},'en'),s.url);
  assert.equal(bookingHref({...s,urlEn:'javascript:alert(1)'},'en'),s.url);
  assert.equal(bookingHref({...s,mode:'受付停止'},'ja'),undefined);
  assert.equal(bookingHref({...s,mode:'受付停止'},'en'),undefined);
});
