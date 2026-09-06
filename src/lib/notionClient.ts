import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

// One queue per server process, plus Next's shared data cache across renders.
// The installed SDK v2 does not retry rate limits itself.
let queue: Promise<unknown> = Promise.resolve();
let nextAllowed = 0;
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const transport: NonNullable<ConstructorParameters<typeof Client>[0]>['fetch'] = (url, init) => {
  const request = queue.then(async () => {
    for (let attempt = 0; ; attempt++) {
      await pause(Math.max(0, nextAllowed - Date.now()));
      const response = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(12000) });
      nextAllowed = Date.now() + 350;
      const retryable = [429, 529].includes(response.status) ||
        (init?.method === 'GET' && [500, 502, 503, 504].includes(response.status));
      if (!retryable || attempt >= 3) return response;
      const retryAfter = Number(response.headers.get('retry-after'));
      const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, 2 ** attempt);
      // Do not hammer the service if it requests a long backoff; let ISR retain
      // its existing response instead of holding a serverless request open.
      if (delay > 10) return response;
      await response.body?.cancel();
      nextAllowed = Date.now() + delay * 1000 + Math.random() * 250;
    }
  });
  queue = request.catch(() => {});
  return request;
};

export const notion = new Client({ auth: process.env.NOTION_TOKEN, notionVersion: '2022-06-28', fetch: transport, timeoutMs: 30000 });
const queryCached = unstable_cache(
  async (parameters: string) => notion.databases.query(JSON.parse(parameters)),
  ['chasen-public-cms-query-v1'],
  { revalidate: 60 },
);
export const queryNotion = (parameters: Parameters<typeof notion.databases.query>[0]) => queryCached(JSON.stringify(parameters));
