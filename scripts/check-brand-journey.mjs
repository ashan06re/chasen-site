import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BRAND_CHAPTERS} from '../src/lib/brandJourney.ts';

test('food-first story has five unique optional chapters and no brewing ritual',()=>{
  assert.deepEqual(BRAND_CHAPTERS.map(c=>c.id),['tamatebako','sweets','cuisine','origin','space']);
  assert.equal(new Set(BRAND_CHAPTERS.map(c=>c.id)).size,5);
  assert.ok(BRAND_CHAPTERS.every(c=>c.title&&c.titleEn&&c.body&&c.bodyEn&&c.caption&&c.captionEn));
  assert.doesNotMatch(JSON.stringify(BRAND_CHAPTERS),/点てられるまで|湯を落とす|quiet ritual/i);
  assert.match(BRAND_CHAPTERS[3].body,/吉田銘茶園/);
});
