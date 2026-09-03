# Chasen サイト — Claude 作業ガイド

## プロジェクト概要

茶筅（Chasen）日本茶スタンドのコーポレートサイト。Next.js 16.2.9 (App Router) + Tailwind CSS v4 + Notion CMS。

**状態**: 全ページ完成・Notion連携済み・日英を URL で分離（`/` と `/en`）・**Vercel公開済み**

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
- `setLang("en")` は同じページの英語 URL へ遷移する（`localStorage("chasen_lang")` にも保存）。
  保存済みの言語と逆の URL を開いたときだけ、クライアント側でその言語へ寄せる
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

独自ドメインを設定したら、Vercelの環境変数 `NEXT_PUBLIC_SITE_URL` を変えるだけでよい。

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
3. 独自ドメイン設定（設定後 `NEXT_PUBLIC_SITE_URL` を更新）
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

## 序幕「点てる」（redesign ブランチ）

トップの `HeroSection` を置き換えた、スクロール＝時間の3D序幕。`src/components/opening/`。

| ファイル | 役割 |
|---------|------|
| `src/lib/openingScript.ts` | 台本。進行度→各演出の値、カメラの通り道。**three.js を import しないこと**（初期バンドルに乗る） |
| `Opening.tsx` | 420svh の枠と sticky。`onScrollFrame()` で進行度を出し、文字の不透明度は DOM に直接書く |
| `OpeningCanvas.tsx` | R3F の Canvas。動的 import。カメラ・光・後処理 |
| `environment.ts` | 環境マップ（IBL）を小さなシーンから PMREM で焼く。HDRI 画像は読まない |
| `textures.ts` | 手続き生成の法線／粗さ／木目／泡マップ |
| `Room.tsx` `TeaBowl.tsx` `Chasen3D.tsx` `Foam.tsx` `Steam.tsx` `Pour.tsx` | 物語に出てくる物だけ |

**進行度の渡し方**: 毎フレーム setState すると 60fps で再描画が走る。`OpeningState`（可変オブジェクト）
を共有し、各コンポーネントが自分の `useFrame` の中で読む。`Rig` が priority `-10` で先に書き換える。

**3Dが安っぽく見えたときに疑う順番**（実際にこの順で直した）:

1. **環境マップが無い** — ライトだけだと陶器がプラスチックに見える。`environment.ts`
2. **被写界深度が無い** — マクロで全部にピントが合っているとCGに見える。`DepthOfField`
3. **形が完璧すぎる** — 回転体の茶碗に手びねりの歪みを足す
4. **法線マップの周波数が高すぎる** — ちらついて面が白茶ける。`normalScale` と repeat を下げ、`anisotropy` を上げる
5. **回転体の継ぎ目** — 最終列の法線を先頭列で上書きする（`TeaBowl.tsx`）。ノイズも整数周期にしてタイル可能にする
6. **泡を球のインスタンスで並べる** — 必ず「粒」に見える。微泡は法線マップを貼ったドーム面、粗い泡だけインスタンス
7. **湯気・湯を出しすぎ** — 煙幕・蛍光灯に見える。薄く短く

**フォールバック3段階**: WebGL → `public/opening/opening-still.jpg`（3Dの1コマ目をそのまま書き出したもの）
→ `prefers-reduced-motion` で 100svh の静止画。静止画は演出を変えたら撮り直す。

**性能**: `(pointer: coarse)` / コア数 / 画面幅で後処理と影を落とす（`heavy`）。縦長画面では横画角を
保つよう垂直画角を広げる（これが無いとスマホで茶碗がはみ出す）。

**素材**: 2019年の実写動画は全クリップ不採用（2026-09-03 ユーザー判断）。`素材_選定/posters/` の静止画は使用可。

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
