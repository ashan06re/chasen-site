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
| `public/og.jpg` | OGP画像（1200×630、ロゴ版）。SNSでURLを貼ったときのサムネイル |

独自ドメインを設定したら、Vercelの環境変数 `NEXT_PUBLIC_SITE_URL` を変えるだけでよい。

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # 本番ビルド確認
```

## 残タスク

**優先度順**（2026-09-02 時点。ユーザーに A〜D の4択を提示して返事待ち）

- **A** 文字コントラストとタップ領域の修正 → 下の「デザイン監査」参照
- **B** メニュー写真38件をNotionに登録（ホーム用6件 / 高台寺16件 / 熊本16件が未登録）
  素材: `~/Downloads/chasen_project/KUMAMOTOchasen20260126JPEG` に62枚
- **C** 下の「確認待ち」の回答をサイトへ反映
- **D** デザインの作り直し（ユーザーの指摘箇所待ち）

**未着手**

1. 英語版のURL分離（`/en/...`）。現状 localStorage 切り替えのため英語ページが
   1つもインデックスされない。訪日客が主要ターゲットなら最大の機会損失
2. 予約フォームのiframe埋め込み or 予約SaaS連携（現状はGoogleフォームへの外部リンク）
3. `/privacy`・`/terms` の正式な事業者名・所在地（各ファイルの `TODO` コメント）
4. 独自ドメイン設定（設定後 `NEXT_PUBLIC_SITE_URL` を更新）
5. Vercelダッシュボードでの Analytics 有効化（コード側は導入済み・ユーザー作業）

## 確認待ち（ユーザーの回答が要る。勝手に変えないこと）

1. **フッターのInstagramが別店舗のもの** — 現在 `@chasen_kyoto10f`（京都駅10F店）。
   このサイトが扱う2店舗の公式は `@chasen_french_kodaiji`（高台寺）と
   `@chasen_cafe_kumamoto`（熊本）。`src/lib/site.ts` の `INSTAGRAM_URL` に集約済みで、
   構造化データの `sameAs` とフッターが共有している
2. **高台寺店の営業時間** — ユーザー指示により 22:00 で統一済み。ただし食べログ・るるぶは
   11:00〜21:00（L.O.20:30）で、22:00は京都駅店の時間と一致する
3. **京都駅にもう1店舗ある** — 「焼き窯スイーツ茶筅」075-352-3401。
   このサイトが高台寺店と熊本店しか扱っていないのが意図的かどうか未確認

## デザイン監査（2026-09-02 実測・未修正）

CDP で実測した結果。WCAG AA は小さい文字で 4.5:1 が必要。

| 組み合わせ | 実測 | 該当箇所 |
|---|---|---|
| ゴールド `#B8A882` on オフホワイト | **2.17:1** | Brand Story / Kyoto / 店舗詳細を見る / 税抜 |
| グレー `#6B6B5E` on オフホワイト | **3.23:1** | 本文・営業時間 |

計26箇所。ゴールドは**暗い背景の上では7.4:1で問題ない**ので、使い分けの問題。
修正案は「明るいセクションのラベルだけ深緑 `#3D6B35`（5.8:1）に置換、本文グレーを
`#5A5A4E` 前後へ」。スマホのタップ領域は23個中19個が44px未満（ナビ28px、JP/EN が17×20px）。

**測り方**: `next start` → Chrome を `--headless=new --remote-debugging-port=9222` で起動 →
Node の組み込み WebSocket で CDP に繋いで `Runtime.evaluate`。

## ロゴとアイコン

| ファイル | 用途 |
|---------|------|
| `public/logo.jpg` | 正式ロゴ（茶筅＋Chasen）。構造化データの `logo` に使用 |
| `public/logo-mark.png` | ロゴから「Chasen」の文字を外した筆文字マーク（透過PNG）。ヘッダー用 |
| `src/app/icon.png` / `apple-icon.png` / `favicon.ico` | タブ・ホーム画面のアイコン。マークをオフホワイト地に置いたもの |

小さいサイズでは「Chasen」の細い文字が潰れるため、アイコンはマークのみにしてある。

## モーション（3D演出）

演出は3種類に統一してある。すべて `prefers-reduced-motion` で無効化される。

| 対象 | 実装 | 中身 |
|-----|------|------|
| ヒーロー | `HeroCanvas.tsx`（three.js） | 深度マップで2.5Dパララックス |
| メニューカード | `TiltCard.tsx` | ポインタ追従の傾き＋光沢。タッチ端末では無効 |
| 写真枠 | `ParallaxFrame.tsx` | 枠の中で写真だけ遅れて動くスクロール視差 |

`src/lib/motion.ts` がスクロール購読を1つのrAFループにまとめている。
**スクロール連動の演出を足すときは、個別にリスナーを張らず `onScrollFrame()` を使うこと。**

### ヒーローの構成

| ファイル | 役割 |
|---------|------|
| `public/hero-kyoto.jpg` | 八坂の塔の写真。`next/image` で最初に表示される（LCP用） |
| `public/hero-kyoto-depth.jpg` | 深度マップ（白=手前 / 黒=奥）。写真から生成した推定値 |
| `src/components/HeroCanvas.tsx` | three.js。深度に応じて画素の動く量を変える |

three.js は**動的import**で初期バンドルから外してある。読み込み完了までは `<Image>` が
見えていて、準備できたらcanvasがフェードインする。段階的に品質が下がる作り：

1. WebGLあり → 深度パララックス（マウス・スクロール・自動ドリフト）
2. WebGLなし → CSSのパースペクティブ視差
3. `prefers-reduced-motion` → 完全に静止

写真を差し替えるときは深度マップも作り直すこと（明るさ・彩度・ディテール・縦位置から
推定する簡易生成）。

## 予約フォームURL管理

Notion「予約用Google Form」DB（`NOTION_RESERVATION_DB_ID`）で管理。  
URLを変えたいときはこのDBの`Contact予約URL`フィールドを編集するだけ（最大1分で全ページ反映）。  
読み取り関数: `getReservationUrls()` in `notion.ts`
