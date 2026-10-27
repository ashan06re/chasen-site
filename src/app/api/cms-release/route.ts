import { cmsRelease } from '@/lib/cmsRelease';
/** Public verification receipt, without Notion IDs, credentials, or draft rows. */
export async function GET() {
  return Response.json({ revision: cmsRelease.revision, capturedAt: cmsRelease.capturedAt }, { headers: { 'Cache-Control': 'no-store' } });
}
