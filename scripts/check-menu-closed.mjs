import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:3100';
const receipt=await fetch(new URL('/api/cms-release',base));
assert.equal(receipt.status,200,'fixed edition receipt');
assert.match((await receipt.json()).revision,/^[a-f0-9]{64}$/);
// Run only while both store publication rows are intentionally set to 投稿しない.
for(const lang of ['','/en'])for(const store of ['kyoto','kumamoto']){
  const path=`${lang}/stores/${store}/menu`;
  const response=await fetch(new URL(path,base));const html=await response.text();
  assert.equal(response.status,200,path);
  assert.match(html,/MENU · COMING SOON/,path);
  assert.match(html,lang?/A little more time\./:/お品書きは、ただいま準備中です。/,path);
  assert.doesNotMatch(html,/menu-items|menu-section|fullMenu|\/api\/notion-image\//,`${path}: no product HTML, props or image requests`);
  console.log(`PASS ${path}: fixed edition, upcoming, no product payload`);
}
