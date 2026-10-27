import assert from 'node:assert/strict';
import {test} from 'node:test';
import {GET} from '../src/app/api/notion-image/[...parts]/route.ts';
test('retired live image proxy cannot expose newly edited, hidden or arbitrary Notion rows',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('must not contact Notion');};
 try { const r=await GET();assert.equal(r.status,404);assert.equal(r.headers.get('cache-control'),'private, no-store');assert.equal(calls,0); }
 finally {globalThis.fetch=original;}
});
