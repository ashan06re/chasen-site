/** Retired live proxy. Unreviewed Notion images must never bypass the edition. */
export async function GET() {
  return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'private, no-store' } });
}
