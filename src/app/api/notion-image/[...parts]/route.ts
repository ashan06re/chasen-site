import { notion } from '@/lib/notionClient';
import { EXPERIENCE_DB } from '@/lib/cmsIds';

/**
 * Notion画像プロキシ
 *
 * Notion API が返すファイルURLは署名付きで1時間で失効する。
 * そのURLをHTMLに直接埋めると、ISRキャッシュが配信されている間に署名が切れて
 * 画像が全滅する（アクセスが無い時間帯があるほど発生しやすい）。
 *
 * このルートは「ページID + プロパティ名」だけを受け取り、
 * リクエストのたびに Notion から新しい署名付きURLを取り直して中身を返す。
 * → HTML側に載るURLは永続的（/api/notion-image/...）になる。
 *
 * URL形式: /api/notion-image/<pageId>/<index>/<encodeURIComponentしたプロパティ名>
 * （next/image の localPatterns がクエリ文字列のワイルドカードに対応しないためパス形式）
 */

// SSRF防止: Notionの配信元以外は中継しない
const ALLOWED_HOST = /(^|\.)(amazonaws\.com|notion\.so|notion-static\.com)$/i;
const PAGE_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const normalize = (id: string) => id.replace(/-/g, '').toLowerCase();
const PUBLIC_DATABASES = new Set([EXPERIENCE_DB, ...Object.entries(process.env).filter(([key]) => /^NOTION_(MENU|KYOTO_MENU|KUMAMOTO_MENU|YOSHIDA_IMAGES)_DB_ID$/.test(key)).map(([,id]) => id || '')].filter(Boolean).map(normalize));

// CDNには長めに持たせ、失効の心配が無い形で配信する
const CACHE_OK = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
const CACHE_ERR = "public, max-age=0, s-maxage=60";

type NotionFile = { file?: { url: string }; external?: { url: string } };

const fail = (status: number, message: string) =>
  new Response(message, { status, headers: { "Cache-Control": CACHE_ERR } });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ parts: string[] }> }
) {
  const { parts } = await params;
  const [pageId, rawIndex, rawProp] = parts;
  const index = Number(rawIndex);
  let propName = '';
  try { propName = rawProp ? decodeURIComponent(rawProp) : ''; } catch { return fail(400, 'Bad Request'); }

  if (!pageId || !PAGE_ID.test(pageId) || !propName || propName.length > 100 || !Number.isInteger(index) || index < 0 || index > 20 || parts.length > 4) {
    return fail(400, "Bad Request");
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const parent = (page as { parent?: { database_id?: string } }).parent;
    if (!parent?.database_id || !PUBLIC_DATABASES.has(normalize(parent.database_id))) return fail(404, 'Not Found');
    const props = (page as { properties?: Record<string, Record<string, unknown>> }).properties ?? {};
    if (!['写真','画像','メイン画像','特徴1画像','特徴2画像','特徴3画像'].includes(propName)) return fail(404, 'Not Found');
    if (props['表示する']?.checkbox === false) return fail(404, 'Not Found');
    const files = (props[propName] as { files?: NotionFile[] } | undefined)?.files ?? [];
    const fresh = files[index]?.file?.url ?? files[index]?.external?.url;

    if (!fresh) return fail(404, "Not Found");
    const source = new URL(fresh);
    if (source.protocol !== 'https:' || !ALLOWED_HOST.test(source.hostname)) return fail(403, "Forbidden");

    const upstream = await fetch(fresh, { cache: "no-store", redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!upstream.ok || !upstream.body) return fail(502, "Upstream Error");
    const contentType = upstream.headers.get('content-type') || '';
    if (!/^image\/(jpeg|png|webp|avif|gif)(;|$)/i.test(contentType)) return fail(415, 'Unsupported Image');

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": CACHE_OK,
      },
    });
  } catch {
    return fail(500, "Error");
  }
}
