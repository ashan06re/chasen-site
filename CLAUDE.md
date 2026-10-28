# Chasen サイト — 作業ガイド

> 2026-09-05 から Codex（VS Code）で作業している。今の状況・次にやること・決まりごとは
> `../引き継ぎ/引き継ぎ.md`（git 管理外・ローカルのみ）。素材と画像の承認フローは親フォルダ `chasen_project/` 側。

## プロジェクト概要

茶筅（Chasen）日本茶スタンドのコーポレートサイト。Next.js 16.4.3 (App Router) + Tailwind CSS v4 + Notion CMS。

**状態（2026-10-28 JST）**: 新ホーム・Notion固定版・日英URLをVercel Proの本番へ反映済み。両店メニューは準備中。京都予約は主要な送受信・変更取消・復旧と本人の通常操作を実測済み。開始制御の会社保存・読取診断、日英フォームの回答者一般アクセス変更まで完了し、申込み受付は停止中。京都の新フォーム入口は公開前の固定版で準備中。完成判定と残件は親の進行台帳を優先。

- 正式URL（本番公開中）: https://chasenco.com
- 旧Vercel URL: https://chasen-site-eight.vercel.app
- GitHub: https://github.com/ashan06re/chasen-site （pushで自動デプロイ、1〜2分で反映）

## 技術スタック

- Next.js 16.4.3 (App Router, Turbopack)
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

## Notion CMS（2026-10-27 固定版方式）

本番・`redesign`の確認用とも、Notionの全表示領域と画像を取得時点で固定して配信する。`src/lib/notion.ts`が固定版の公開読取、`notionDraft.ts`が取得処理専用のNotion読取。`src/content/cms-release.json`と`cms-assets/`を一組で管理する。画像は固定版に登録された`/api/cms-image/`経由。旧`/api/notion-image/`は固定版で404。署名付きURLをHTMLへ直接埋めない。

**PR #13で本番へ固定版方式を導入済み（2026-10-28 JST）。** Notion保存だけではHPは変わらず、制作担当が取得→redesign確認→本人が具体版を承認→同じ版を本番へ反映する。詳しくは [CMS_RELEASE.md](CMS_RELEASE.md)。Notion内に公開ボタンはない。公開単位は全サイト。

- `npm run cms:capture`：DB/画像の取得、取得中編集の二重照合、原子的な版更新。失敗時は前版を維持。
- `npm run cms:verify`、build、差分と実画面で編集意図を確認。誤ったCMS原本の内容を自動で正解へ変える仕組みではない。
- `npm run cms:status -- URL`：配備先と手元の内容版一致を確認。
- メニューは店舗の「投稿する」と行の「表示する」の両方が必要。非公開メニュー本文・画像は取得対象外。空タイトルのお知らせも除外。
- 日本語・英語は別行。メニュー英語の写真が空なら同じカテゴリ・表示順の日本語写真を使う。slugはkyoto/kumamoto固定。
- 商品179行は現行価格・提供有無が未確定、両店メニューは準備中。仮情報を公開しない。
- 予約台帳・処理履歴・認証情報はHP固定版へ含めない。秘密値は出力/コミットしない。

## SEO

| ファイル | 役割 |
|---------|------|
| `src/lib/site.ts` | `SITE_URL`（`NEXT_PUBLIC_SITE_URL` で上書き可）・OG画像パス |
| `src/lib/structuredData.ts` | JSON-LD（`CafeOrCoffeeShop` / `Organization` / `WebSite`）。住所・営業時間はNotionの店舗情報DBを参照 |
| `src/app/sitemap.ts` / `robots.ts` | `/sitemap.xml`・`/robots.txt` を自動生成。**ページを追加したら `sitemap.ts` にも追記する** |
| `public/og.jpg` | OGP画像（1200×630、ロゴ版）。SNSでURLを貼ったときのサムネイル |

独自ドメイン `chasenco.com` は接続済み。`NEXT_PUBLIC_SITE_URL`、canonical・hreflang・構造化データ・sitemap、wwwからapexへの恒久転送を維持する。
プレビューは `VERCEL_ENV=preview` でnoindex。本番では `NEXT_PUBLIC_NOINDEX` を有効にしない。詳しくは `../引き継ぎ/公開前SEOとドメイン_20260906.md`。

## よく使うコマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # 本番ビルド確認
```

## 旧残タスク（2026-09-02時点の履歴）

現在の残件は `../引き継ぎ/進行台帳.md`。下記の予約未着手等を現状と解釈しない。

**2026-09-02 に完了**: コントラスト/タップ領域修正、英語 URL 分離、Instagram の店舗別リンク、
熊本店メニューの仮登録（写真つき）。

**ユーザーの確認待ち**

1. 熊本店メニューの仮登録内容の確認（品名・価格・「要確認」印の付いた10品。Notion 上で直接編集できる）
2. 高台寺店のメニュー実データ（現状ダミー。写真素材も未受領）
3. 下の「確認待ち」

**未着手／運用準備中**

1. 京都の予約リクエストForm・受付台帳・承認後Calendar登録・Gmail下書き（熊本は当面Hot Pepper）
2. `/privacy`・`/terms` の正式な事業者名・所在地（各ファイルの `TODO` コメント）
3. Vercelダッシュボードでの Analytics 有効化（コード側は導入済み）
4. Google Search Consoleで `https://chasenco.com/sitemap.xml` の確認
5. Notionメニューの編集版と公開版を分離し、編集中も直前の公開版を維持する仕組み

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

## リデザイン候補（2026-10-26・商品を最初に見せる）

本人の最新フィードバックは「玉手箱と分かるまで遅い」「スマホで5番までスクロールを拘束される」「3Dが不自然」。redesignでは次を検証。本番への切替は別途判断する。

- `Story.tsx`は玉手箱を初期表示し、日英の商品説明・予約不要・店舗と予約への導線を表示。5場面はボタンで選択でき、縦スクロールを消費しない。旧420/590svhの固定区間は使わない。
- 玉手箱は推定深度による商品変形を避け、画像全体の控えめな動きに限定。他の場面と店舗パネル、静止モード、WebGLが使えない場合のDOM画像は保持。
- 実写に近い方向は本人選択済み。ただし新しい静止画候補は親の承認待ちにあり、個別採用前なので既存の承認済み画像を使用。画像の採否とホーム構成の採否を分ける。
- CMSの場面画像・本文・動き設定、日英URLとSEOを保持。未確定の価格や商品仕様を追加しない。

## 以前のリデザイン（2026-09-06・背景画と立体物語）

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
- `redesign` はPR #1で `main` へ反映済み。`chasenco.com` で本番公開中。

## 予約リンク管理

サイト内の予約入口は `/reserve` と `/en/reserve`。各店舗の実際の受付先はNotionの現行予約設定DBで管理する。
店舗ごとに `受付方法`、`予約ページ`、`予約ページ（英語）`、日英の案内文を変更できる。
`getBookingSettings()` が現行DBを読み、`getReservationUrls()` はサイト内予約ページへの固定入口を返す。
旧「予約用Google Form」DBは現行HPでは使わない。

## 2026-10-27 原画像版v5

ローカルQAのBrandJourneyは玉手箱/抹茶スイーツ/料理/吉田銘茶園/空間の5元画像。原画像のまま2.8秒/24pxの浮上とフェード、以後静止。停止/OS抑制対応。新しい生成や切抜きは行わない。店舗は既存構造/黒基調/Tilt/スクロール演出を維持。熊本の強制motion=falseを解除し、新画像へ旧深度を継承させない。

元画像使用は本人指示済み。本番反映は別判断。公開用圧縮・サイズ別配信・通常ホームとCMSの編集統合は未完。最新手順は `../引き継ぎ/全体再点検_20261027/README.md`。

## 2026-10-27 通常ホーム・新Notion編集・導線の統合

`defaultExperience()` のjourneyを / と /en で使用する。QAページの直接画像/固定文上書きは廃止、ローカルQA入口は通常ホームへの転送だけ。/reserve等からの /#contact・フッター・ロゴでも旧Storyへ戻らない。

同じEXPERIENCE_DBの新しい掲載場所「新ホーム｜玉手箱」「新ホーム｜抹茶スイーツ」「新ホーム｜お料理」「新ホーム｜吉田銘茶園」「新ホーム｜茶筅の空間」「新ホーム｜導入文」が編集元。旧9行は公開中の本番のため変更しない。画像・見出し・説明文・タブ名・注記・altは日英、ラベルと動きもCMS。導入行は画像の説明欄を店の一行説明へ、見出し/説明文を下部導入へ使う。UIの予約/店舗ボタン名などの操作文言はコードのまま。

5画像は全てPC cover・スマホcontainの共通枠。推奨は約16:9/1672×941。元写真の縦横比で個別幅を変えない。Notion画像は署名対策プロキシとNext Image経由。承認原本からのWebP予備画像はpublic/journey。Notion未登録/取得失敗なら予備値を使う。

熊本06-entry-v2は同じ指定画から計算したdepthを追加し、従来DepthCanvas/TiltCardで動かす。画像差替え時は別画像のdepthを継承しない。編集ガイドと実測は `../引き継ぎ/ホームCMS統合_20261027/`。実Notion注記を一時変更→再ビルドなしで画面反映→元へ復元まで確認済み。本番公開は別判断。
