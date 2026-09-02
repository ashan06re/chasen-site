# Chasen サイト — Claude 作業ガイド

## プロジェクト概要

茶筅（Chasen）日本茶スタンドのコーポレートサイト。Next.js 16.2.9 (App Router) + Tailwind CSS v4 + Notion CMS。

**状態**: 全ページ完成・Notion連携済み・JP/EN言語切り替え実装済み・**Vercel公開済み**（2026-07-04確認）

- 本番URL: https://chasen-site-eight.vercel.app
- GitHub: https://github.com/ashan06re/chasen-site （pushで自動デプロイ、1〜2分で反映）

## 技術スタック

- Next.js 16.2.9 (App Router, Turbopack)
- Tailwind CSS v4
- Notion API (CMS)
- フォント: Cormorant Garamond / Noto Serif JP

## ファイル構成（重要なもの）

```
src/
  app/
    layout.tsx, page.tsx, news/page.tsx
    stores/kyoto/page.tsx, stores/kyoto/menu/page.tsx
    stores/kumamoto/page.tsx, stores/kumamoto/menu/page.tsx
  components/
    Header.tsx, HeroSection.tsx, BrandStorySection.tsx, YoshidaSection.tsx
    StoreSection.tsx, ContactSection.tsx, AnimateIn.tsx
    StorePageLayout.tsx, StoreMenuLayout.tsx
    Footer.tsx（async server）, FooterContent.tsx, FloatingButtons.tsx
    NewsPageContent.tsx
  data/storeContent.ts  # 英語デフォルト定数（defaultBrandStoryEn等）
  lib/
    langContext.tsx     # LangContext / LangProvider / useLang
    notion.ts           # Notion API クライアント・全DB関数
```

## 言語切り替えの仕組み

`src/lib/langContext.tsx` の `useLang()` で `lang: "ja" | "en"` を取得。  
EN時は `src/data/storeContent.ts` の `default〇〇En` 定数にフォールバック。  
設定は `localStorage("chasen_lang")` に保存。

## デザインカラー

| 名前 | カラーコード |
|------|------------|
| 深緑 | `#3D6B35` |
| オフホワイト | `#F7F5F0` |
| 墨黒 | `#1A1A18` |
| ゴールド | `#B8A882` |
| グレイ | `#6B6B5E` |

## Notion CMS

`revalidate = 60`（更新後最大1分で反映）。`表示する` チェックボックスが必須。  
環境変数は `.env.local`。slug は `kyoto` / `kumamoto` 固定（変更禁止）。

### 画像は必ずプロキシ経由（重要）

Notion API が返すファイルURLは **1時間で失効する署名付きURL**。HTMLに直接埋めると
ISRキャッシュ配信中に署名が切れて画像が全滅する。そのため `notion.ts` の `imageUrl()` は
署名付きURLではなく `/api/notion-image/<pageId>/<index>/<プロパティ名>` を返す。
実体は `src/app/api/notion-image/[...parts]/route.ts` がリクエストごとに Notion から
新しいURLを取り直して中継する（CDNに24時間キャッシュ）。

**新しく画像プロパティを読むときも、必ず `imageUrl()` を使うこと。**
`file.url` をそのまま返すと同じ不具合が再発する。

## SEO

| ファイル | 役割 |
|---------|------|
| `src/lib/site.ts` | `SITE_URL`（`NEXT_PUBLIC_SITE_URL` で上書き可）・OG画像パス |
| `src/lib/structuredData.ts` | JSON-LD（`CafeOrCoffeeShop` / `Organization` / `WebSite`）。住所・営業時間はNotionの店舗情報DBを参照 |
| `src/app/sitemap.ts` / `robots.ts` | `/sitemap.xml`・`/robots.txt` を自動生成。**ページを追加したら `sitemap.ts` にも追記する** |
| `public/og.jpg` | OGP画像（1200×630） |

独自ドメインを設定したら、Vercelの環境変数 `NEXT_PUBLIC_SITE_URL` を変えるだけでよい。

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # 本番ビルド確認
```

## 残タスク

1. 各店舗の正式住所 → Notion「店舗情報」DBの`住所`を更新（JSON-LDの住所もここを参照している）
2. メニュー写真 → 各メニューDBの`写真`フィールドに画像アップロード（熊本店の63枚が未登録）
3. `/privacy`・`/terms` の正式な事業者名・所在地（各ファイルの `TODO` コメント箇所）
4. ドメイン設定（独自ドメイン設定後、`NEXT_PUBLIC_SITE_URL` を更新）
5. 英語版のURL分離（現状は localStorage 切り替えのため `/en/...` が無く、英語ページがGoogleにインデックスされない）
6. 予約フォームのiframe埋め込み or 予約SaaS連携（現状はGoogleフォームへの外部リンク）

## ヒーロー

`public/hero-kyoto.jpg`（八坂の塔）を `next/image` で表示し、マウス位置とスクロールに
連動したパースペクティブ視差＋Ken Burns（`globals.css` の `hero-drift`）で動かしている。
`prefers-reduced-motion` では動きを止める。動画版（`public/hero.mp4` / `hero_compressed.mp4`）は
`.gitignore` で除外されたまま未使用。

## 予約フォームURL管理

Notion「予約用Google Form」DB（`NOTION_RESERVATION_DB_ID`）で管理。  
URLを変えたいときはこのDBの`Contact予約URL`フィールドを編集するだけ（最大1分で全ページ反映）。  
読み取り関数: `getReservationUrls()` in `notion.ts`
