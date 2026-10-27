import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { cmsRelease } from '@/lib/cmsRelease';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fail = (status: number) => new Response('Not Found', { status, headers: { 'Cache-Control': 'private, no-store' } });
  if (!/^[a-f0-9]{64}$/.test(id)) return fail(404);
  const asset = cmsRelease.assets[id];
  // Only the CURRENT edition is exposed. Old/hidden/unpublished assets stay closed.
  if (!asset || !new RegExp('^'+id+'\\.(jpg|png|webp|avif|gif)$').test(asset.file)) return fail(404);
  try {
    const bytes = await readFile(join(process.cwd(), 'src/content/cms-assets', asset.file));
    if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== id) return fail(503);
    return new Response(bytes, { headers: { 'Content-Type': asset.contentType, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' } });
  } catch { return fail(503); }
}
