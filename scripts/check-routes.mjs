import assert from 'node:assert/strict';

// Run against a production build: node scripts/check-routes.mjs http://localhost:3100
const base = process.argv[2] || 'http://localhost:3100';
const paths = ['', '/news', '/stores/kyoto', '/stores/kyoto/menu', '/stores/kumamoto', '/stores/kumamoto/menu', '/privacy', '/terms'];
const routes = ['', '/en'].flatMap(prefix => paths.map(path => `${prefix}${path}` || '/'));
const known = new Set(routes);
let checkedLinks = 0;
for (const route of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, new RegExp(`<html[^>]+lang="${route.startsWith('/en') ? 'en' : 'ja'}"`), route);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: one h1`);
  assert.match(html, /rel="canonical"/, `${route}: canonical`);
  assert.match(html, /hrefLang="en"/i, `${route}: English alternate`);
  assert.match(html, /hrefLang="ja"/i, `${route}: Japanese alternate`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, new URL(route, base));
    if (url.origin !== new URL(base).origin) continue;
    assert.ok(known.has(url.pathname), `${route}: unknown internal route ${href}`);
    if (url.pathname === route && url.hash) {
      assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing anchor ${href}`);
    }
    checkedLinks++;
  }
  console.log(`PASS ${route}`);
}
for (const id of ['kyoto-artwork', 'kyoto-treasure', 'kyoto-sweets', 'kyoto-interior', 'kyoto-detail']) {
  const response = await fetch(new URL(`/editorial/${id}.webp`, base));
  assert.equal(response.status, 200, id);
  assert.match(response.headers.get('content-type') || '', /image\/webp/);
}
for (let index = 1; index <= 6; index++) {
  for (const suffix of ['', '-mobile', '-depth']) {
    const asset = `/story-art/${String(index).padStart(2, '0')}${suffix}.webp`;
    const response = await fetch(new URL(asset, base));
    assert.equal(response.status, 200, asset);
    assert.match(response.headers.get('content-type') || '', /image\/webp/);
  }
}
// Withdrawn imagery must not remain publicly accessible on the current deployment.
assert.equal((await fetch(new URL('/editorial/kumamoto-treasure.webp', base))).status, 404, 'withdrawn Kumamoto photo');
for (const id of ['01', '02', '03', '04', '06', '08']) {
  const response = await fetch(new URL(`/story/${id}.webp`, base));
  assert.equal(response.status, 404, `withdrawn image ${id}`);
}
console.log(`PASS ${routes.length} routes, ${checkedLinks} internal links, 18 painted assets, 5 editorial photos, withdrawn images absent`);
