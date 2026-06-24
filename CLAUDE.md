# Chasen サイト — Claude 作業ガイド

## プロジェクト概要

茶筅（Chasen）日本茶スタンドのコーポレートサイト。Next.js 16.2.9 (App Router) + Tailwind CSS v4 + Notion CMS。

**状態**: 全ページ完成・Notion連携済み・JP/EN言語切り替え実装済み・ビルドエラーなし

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

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # 本番ビルド確認
```

## 残タスク

1. 各店舗の正式住所 → Notion「店舗情報」DBの`住所`を更新
2. メニュー写真 → 各メニューDBの`写真`フィールドに画像アップロード
3. Vercel 公開

## 予約フォームURL管理

Notion「予約用Google Form」DB（`NOTION_RESERVATION_DB_ID`）で管理。  
URLを変えたいときはこのDBの`Contact予約URL`フィールドを編集するだけ（最大1分で全ページ反映）。  
読み取り関数: `getReservationUrls()` in `notion.ts`
