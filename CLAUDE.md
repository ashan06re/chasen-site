# Chasen サイト — 作業ガイド

> 2026-09-05 から Codex（VS Code）で作業している。今の状況・次にやること・決まりごとは
> `../引き継ぎ/引き継ぎ.md`（git 管理外・ローカルのみ）。素材と画像の承認フローは親フォルダ `chasen_project/` 側。

## プロジェクト概要

茶筅（Chasen）日本茶スタンドのコーポレートサイト。Next.js 16.2.9 (App Router) + Tailwind CSS v4 + Notion CMS。

**状態**: 全ページ完成・Notion連携済み・日英を URL で分離（`/` と `/en`）・**Vercel公開済み**

- 正式URL（接続準備中）: https://chasenco.com
- 旧Vercel URL: https://chasen-site-eight.vercel.app
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
    (ja)/          日本語ルート。layout.tsx（html lang="ja"）と全ページの実体
      page.tsx, news/, stores/kyoto/, stores/kyoto/menu/, stores/kumamoto/, stores/kumamoto/menu/, privacy/, terms/
    (en)/          英語ルート。layout.tsx（html lang="en"）
      en/…         (ja) の各 page.tsx を import して default export し直すだけ（メタデータのみ英語）
    globals.css, sitemap.ts, robots.ts, icon.png, api/notion-image/
  components/
    RootShell.tsx  両ルートレイアウト共通の <html>〜<body>（フォント・LangProvider・Analytics）
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

## 言語切り替えの仕組み（2026-09-02 に URL 分離へ移行）

言語は **URL で決まる**: `/…` が日本語、`/en/…` が英語。両方とも静的生成され、Google に別ページとして
インデックスされる（`hreflang` は `src/lib/i18n.ts` の `pageAlternates()` が全ページに付ける）。

- `src/lib/langContext.tsx` の `useLang()` → `{ lang, setLang, localize }`。
  `localize("/stores/kyoto")` が現在の言語に合った URL を返すので、**内部リンクは必ず `localize()` を通す**
- `setLang("en")` は同じページの英語 URL へ明示的に遷移する。クエリとハッシュも保持。
  保存言語による自動転送はしない。ユーザーが開いたURLを常に優先する（検索クローラー・共有URLの整合性）。
- 英語ページを増やすときは `(ja)` にページを作り、`(en)/en/` に同名ファイルで import して re-export、
  `sitemap.ts` にパスを1行足す（日英両 URL が自動で出る）
- EN時のテキストは Notion の英語行 → 無ければ `src/data/storeContent.ts` の `default〇〇En` 定数

## デザインカラー

| 名前 | カラーコード | 使いどころ |
|------|------------|-----------|
| 深緑 | `#3D6B35` | 見出しの強調・ボタン |
| オフホワイト | `#F7F5F0` | 明るいセクションの背景 |
| 墨黒 | `#1A1A18` | 暗いセクションの背景 |
| ゴールド | `#B8A882` | **暗い背景専用**（オフホワイト上では 2.1:1 で読めない） |
| ゴールド（濃） | `#75663F` | 明るい背景のラベル用（5.2:1）。Tailwind: `text-chasen-gold-deep` |
| グレイ | `#6B6B5E` | 明るい背景の本文用（4.9:1）。`text-chasen-muted` |
| グレイ（淡） | `#949486` | 暗い背景の本文用（5.7:1）。`text-chasen-muted-light` |

トークンは `src/app/globals.css` の `@theme`。**Notion から来るアクセント色**（カードの
`アクセントカラー`・バッジ色）は `src/lib/color.ts` の `readableOn(fg, bg)` を通してから
文字色に使うこと。基準（4.5:1、大きい文字は 3:1）を下回る色だけ自動で暗く／明るくする。
バッジのように半透明の下地がある場合は `mix()` で下地の見た目の色を先に求める。
タップ可能な要素は `min-h-11`（44px）を守る。

## Notion CMS

`revalidate = 60`（更新後最大1分で反映）。`表示する` チェックボックスが必須。  
環境変数は `.env.local`。slug は `kyoto` / `kumamoto` 固定（変更禁止）。

### メニューの日英の対応

フルメニューDB・ホームカードDBとも、日本語行と英語行は別レコード。**写真は日本語行にだけ登録すればよい**
（英語行に写真が無ければ、同じカテゴリ・同じ順番の日本語行の写真を使う）。並び順は `表示順`（数値）。
日英で同じ `表示順` を付けておくと対応がずれない。

熊本店のメニューは 2026-09-02 に写真ベースで仮登録した（8カテゴリ58品、価格は空欄）。
それ以前のダミー行は削除せず `表示する` を外してある。ロールバック用の page id は
このリポジトリ外（作業ログ）にあるが、Notion 上で `表示する` を戻せば復元できる。
高台寺店のメニューはまだダミーデータのまま。

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

独自ドメイン設定時は `NEXT_PUBLIC_SITE_URL` を更新して再ビルド。canonical・hreflang・構造化データ・sitemapを検査し、www/非wwwと旧URLからの恒久転送も設定する。
プレビューは `VERCEL_ENV=preview` でnoindex。本番では `NEXT_PUBLIC_NOINDEX` を有効にしない。詳しくは `../引き継ぎ/公開前SEOとドメイン_20260906.md`。

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # 本番ビルド確認
```

## 残タスク

**2026-09-02 に完了**: コントラスト/タップ領域修正、英語 URL 分離、Instagram の店舗別リンク、
熊本店メニューの仮登録（写真つき）。

**ユーザーの確認待ち**

1. 熊本店メニューの仮登録内容の確認（品名・価格・「要確認」印の付いた10品。Notion 上で直接編集できる）
2. 高台寺店のメニュー実データ（現状ダミー。写真素材も未受領）
3. 下の「確認待ち」

**未着手**

1. 予約フォームのiframe埋め込み or 予約SaaS連携（現状はGoogleフォームへの外部リンク）
2. `/privacy`・`/terms` の正式な事業者名・所在地（各ファイルの `TODO` コメント）
3. 独自ドメイン `chasenco.com` のVercel接続（コードの正式URLは更新済み。Vercel Production切替とDNS設定が残り）
4. Vercelダッシュボードでの Analytics 有効化（コード側は導入済み・ユーザー作業）
5. Google Search Console に `/en` 配下の登録（sitemap.xml を再送信するだけ）

## 確認待ち（ユーザーの回答が要る。勝手に変えないこと）

1. ~~フッターのInstagram~~ → 2026-09-02 に店舗別へ変更済み。Notion「店舗情報」DB の `Instagram` 列で管理
   （空なら `src/lib/site.ts` の `INSTAGRAM`）。フッターと店舗ページの店舗情報、構造化データの `sameAs` が共有
2. ~~高台寺店の営業時間~~ → ユーザーが 22:00 で確定（2026-09-02）
3. **京都駅にもう1店舗ある** — 「焼き窯スイーツ茶筅」075-352-3401。
   このサイトが高台寺店と熊本店しか扱っていないのが意図的かどうか未確認

## デザイン監査（2026-09-02 実測 → 同日修正済み）

修正後の実測（モバイル390px・デスクトップ1280px、全6ページ）: **コントラスト未達 0件、44px未満のタップ領域 0件**。

修正前に未達だった組み合わせ:

| 組み合わせ | 修正前 | 対処 |
|---|---|---|
| ゴールド on オフホワイト／カード地 | 2.1:1 | `text-chasen-gold-deep`（`#75663F`）に置換 |
| グレー on 墨黒（フッター・店舗ページのお知らせ） | 3.2:1 | `text-chasen-muted-light`（`#949486`） |
| 吉田セクション本文 `#5E5E54` on `#0D1209` | 2.9:1 | 同上 |
| ゴールド on 深緑（Contactラベル） | 2.7:1 | ベージュ `#E8E0D0`（4.8:1） |
| ゴールド on 高台寺ヒーロー `#2A4D25` | 4.1:1 | `readableOn()` で自動補正 |
| Notion由来のアクセント色・バッジ色 | 色による | `readableOn()` で自動補正 |

明るい背景上のグレー `#6B6B5E` は 4.95:1 で元々合格（以前の記録の 3.23:1 は暗い背景上の値）。

**測り方**（再現用スクリプトは会話ごとに作り直す）: `next start -p 3100` → Chrome を
`--headless=new --remote-debugging-port=9222` で起動 → Node の組み込み WebSocket で CDP に繋ぎ
`Runtime.evaluate` で全テキストノードの色と実効背景色、`a,button` の矩形を集める。
`.fade-up` に `visible` を付けてから測らないと AnimateIn 配下が透明のまま除外される。

## ロゴとアイコン

| ファイル | 用途 |
|---------|------|
| `public/logo.jpg` | 正式ロゴ（茶筅＋Chasen）。構造化データの `logo` に使用 |
| `public/logo-mark.png` | ロゴから「Chasen」の文字を外した筆文字マーク（透過PNG）。ヘッダー用 |
| `src/app/icon.png` / `apple-icon.png` / `favicon.ico` | タブ・ホーム画面のアイコン。マークをオフホワイト地に置いたもの |

小さいサイズでは「Chasen」の細い文字が潰れるため、アイコンはマークのみにしてある。

## 現行リデザイン（2026-09-06・背景画と立体物語）

静的な写真貼付型への変更は却下。トップは `ImmersiveHome.tsx` と `components/story/Story.tsx`。
IMG_6983は筆致・色・空気感の参照であり、写真を主役に貼る方針ではない。

- 承認済み6画から5場面（入口→湯→窓辺→夕暮れ茶園→宝箱）＋2店の立体パネル。590svhの物語、場面ジャンプ・店舗への近道・静止モード。
- `public/story-art/01..06` の通常・mobile・depth計18WebP。原本は親の承認済み、採用記録を確認。入口はv2。手元whisk・砂壁sand-roomは採用しない。
- `../tools/export_story_art.py` が承認原本だけを書き出す。旧 `export_web.py` は停止を維持。撤回画像とそのURLを復活させない。
- `DepthCanvas.tsx` を物語・店舗・メニューで共用。Three.jsの深度視差、控えめなカメラ移動、クロスディゾルブ。Lenisは一つだけ。
- DOM背景画を常設しWebGLは追加演出。GPU停止・画像失敗時はHTMLへ戻る。画面外停止、DPR上限1.5、テクスチャ枚数制限、破棄処理、ResizeObserver。
- 拡大画像の枠は `overflow: clip`。`hidden`へ戻すとアンカージャンプで内部スクロールが発生しレイヤーがずれる。
- 商品一覧はNotionの実写真・日英データを維持。メニューヒーローのみ背景画。カテゴリー絞込・検索・未登録価格の非表示。
- ブランドと銘茶園の本文もNotion取得を維持。冗長な紹介だけdetailsに整理し、物語や立体演出を削除しない。
- 単体7検査＋全16ルート/368リンク＋SEO検査。GPU強制停止/復旧・欠落データはローカル専用 `/qa-depth` で検査（`CHASEN_LOCAL_QA=1`、Vercelは404）。
- Vercelのログイン不要プレビューへredesignだけpush。本番main・独自ドメイン購入は別途判断。

## 予約フォームURL管理

Notion「予約用Google Form」DB（`NOTION_RESERVATION_DB_ID`）で管理。  
URLを変えたいときはこのDBの`Contact予約URL`フィールドを編集するだけ（最大1分で全ページ反映）。  
読み取り関数: `getReservationUrls()` in `notion.ts`
