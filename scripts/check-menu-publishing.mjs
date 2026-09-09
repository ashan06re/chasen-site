import assert from 'node:assert/strict';
import {test} from 'node:test';
import {menuIsPublished} from '../src/lib/menuPublishing.ts';
import {ACCENT_PALETTE,accentColor} from '../src/lib/palette.ts';
import {readableOn,contrastRatio} from '../src/lib/color.ts';
import {bookingHref,DEFAULT_BOOKING} from '../src/lib/booking.ts';

test('only one explicit store publication opens the menu',()=>{
  const yes={store:'高台寺店',status:'投稿する'};
  assert.equal(menuIsPublished([yes],'高台寺店'),true);
  for(const rows of [[],[{...yes,status:'投稿しない'}],[{...yes,status:''}],[yes,yes],[{...yes,store:'熊本店'}]])assert.equal(menuIsPublished(rows,'高台寺店'),false);
  assert.equal(menuIsPublished([yes,{store:'熊本店',status:'投稿しない'}],'高台寺店'),true);
});
test('named accents override legacy colors and retain readable contrast',()=>{
  assert.equal(accentColor('ほうじ茶','#3D6B35'),'#8B5E3C');
  assert.equal(accentColor('','#b8a882'),'#B8A882');
  assert.equal(accentColor('invalid','url(https://example.com)'),'#3D6B35');
  for(const hex of Object.values(ACCENT_PALETTE))assert.ok(contrastRatio(readableOn(hex,'#0B0C0A'),'#0B0C0A')>=4.5);
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
