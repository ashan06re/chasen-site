import { Client } from "@notionhq/client";

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

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2022-06-28",
});

// SSRF防止: Notionの配信元以外は中継しない
const ALLOWED_HOST = /(^|\.)(amazonaws\.com|notion\.so|notion-static\.com)$/i;
const PAGE_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

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
  const propName = rawProp ? decodeURIComponent(rawProp) : "";

  if (!pageId || !PAGE_ID.test(pageId) || !propName || !Number.isInteger(index) || index < 0) {
    return fail(400, "Bad Request");
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const props = (page as { properties?: Record<string, Record<string, unknown>> }).properties ?? {};
    const files = (props[propName] as { files?: NotionFile[] } | undefined)?.files ?? [];
    const fresh = files[index]?.file?.url ?? files[index]?.external?.url;

    if (!fresh) return fail(404, "Not Found");
    if (!ALLOWED_HOST.test(new URL(fresh).hostname)) return fail(403, "Forbidden");

    const upstream = await fetch(fresh, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) return fail(502, "Upstream Error");

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": CACHE_OK,
      },
    });
  } catch {
    return fail(500, "Error");
  }
}
