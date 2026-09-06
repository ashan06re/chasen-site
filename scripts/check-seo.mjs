import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://localhost:3102');
const preview = process.argv.includes('--preview');
const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://chasen-site-eight.vercel.app').replace(/\/$/, '');
const paths = ['', '/news', '/stores/kyoto', '/stores/kyoto/menu', '/stores/kumamoto', '/stores/kumamoto/menu', '/privacy', '/terms'];
const routes = ['', '/en'].flatMap(prefix => paths.map(path => `${prefix}${path}` || '/'));
for (const route of routes) {
  const res = await fetch(new URL(route, base));
  const html = await res.text();
  assert.equal(res.status, 200, route);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  assert.equal(canonical?.replace(/\/$/, ''), `${site}${route === '/' ? '' : route}`, `${route} canonical`);
  assert.ok(/hrefLang="x-default"/i.test(html), `${route} language fallback`);
  assert.ok(/name="description" content="[^"<]{20,}"/.test(html), `${route} description`);
  assert.ok(/property="og:image"/.test(html), `${route} social image`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route} h1`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || '';
  if (preview) assert.match(robots, /noindex/, `${route} preview noindex`);
  else assert.ok(!robots.includes('noindex'), `${route} production indexable`);
  for (const json of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(json[1]);
    for (const item of Array.isArray(data) ? data : [data]) {
      assert.equal(item['@context'], 'https://schema.org');
      assert.ok(item['@type']);
      if (item.url) assert.ok(item.url.startsWith(site));
    }
  }
}
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.equal(locations.length, 16, 'sitemap covers every ja/en route');
assert.ok(locations.every(url => url.startsWith(site)));
assert.ok(!sitemap.includes('/qa-depth'), 'QA is not discoverable in sitemap');
assert.ok(!sitemap.includes('<lastmod>'), 'no fabricated modification dates');
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.ok(!/Disallow:\s*\/(?:api)?\s*$/m.test(robots), 'page and image crawling allowed');
if (!preview) assert.ok(robots.includes(`${site}/sitemap.xml`));
if (preview) {
  const qa = await fetch(new URL('/qa-depth', base));
  assert.equal(qa.status, 404, 'local fault-injection route blocked on Vercel');
  await qa.text();
}
console.log(`PASS SEO: 16 canonicals, ja/en/x-default, metadata, JSON-LD, sitemap, ${preview ? 'preview noindex' : 'production indexability'}`);
