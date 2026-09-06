import assert from 'node:assert/strict';

// Non-destructive checks: only this site's public routes; no attack payloads.
const base = new URL(process.argv[2] || 'http://localhost:3102');
for (const path of ['/', '/en', '/reserve', '/stores/kyoto/menu']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.match(response.headers.get('content-security-policy') || '', /frame-ancestors 'self'/);
  assert.match(response.headers.get('content-security-policy') || '', /object-src 'none'/);
  assert.match(response.headers.get('permissions-policy') || '', /camera=\(\)/);
  assert.equal(response.headers.get('x-powered-by'), null);
  await response.text();
}
for (const [path, expected] of [
  ['/api/notion-image/not-a-page/0/image', 400],
  ['/api/notion-image/00000000-0000-0000-0000-000000000000/0/private-field', 404],
  ['/api/notion-image/00000000-0000-0000-0000-000000000000/0/%E7%94%BB%E5%83%8F/invalid-revision', 400],
  ['/qa-depth', 404],
]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, expected, path);
  await response.text();
}
console.log('PASS security: baseline headers, hidden framework header, image request validation, QA route unavailable');
