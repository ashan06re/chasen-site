<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 茶筅サイト — 作業ガイド

日本語で答えること。**作業ガイドの本体は `CLAUDE.md`**（ファイル構成・Notion CMS・日英の URL 分離・SEO・デザイントークン・モーション）。
このリポジトリは `chasen_project/` の中にある。素材と画像の承認フローは親フォルダ側にあるので、
VS Code では **`chasen_project` を開く**こと。引き継ぎは `../引き継ぎ/引き継ぎ.md`。

## よく使うコマンド

```bash
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド（push 前に必ず通す）
npx eslint src   # 手元の保存ページ由来のノイズを避けるため src だけ見る
```

`.env.local`（gitignore・ディスク上にある）が無いと Notion から取れず起動しない。

## ブランチ

- **`redesign`** … トップページのリデザイン。ここで作業し、Vercel プレビューで確認する
- `main` … 本番。リデザインは切り替えの判断が出るまで push しない

## 注意点

- 2026-09-06 最新訂正：物語・立体演出の撤去はユーザーの意図と違った。`ImmersiveHome.tsx` と `components/story/` で再構築。
- IMG_6983は筆致・色・空気感の参照。写真をそのまま主役に貼らず、元の場面を描き込まれた背景画にする。
- 2026-10-26の本人フィードバックを優先：玉手箱を初期表示し、スマホの5場面スクロール拘束を解消する。5場面の選択・他場面の深度視差・2店舗の立体パネルは保持。商品が歪む深度加工は避ける。新しい実写風候補は個別採用前であり、本番画像へ差し替えない。
- 新背景画6枚は親の `承認済み/`。入口はv2が最新、点てる手元と砂壁の新画は未採用。撤回された旧画像は復活させない。
- 背景画の書き出しは `../tools/export_story_art.py`。承認済みフォルダと採用記録が揃うまで書き出さない。
- Notion の画像は必ずプロキシ経由（詳細は `CLAUDE.md`）
- QA: `node --test scripts/check-story.mjs`、本番ビルド起動後に `node scripts/check-routes.mjs <URL>` と `node scripts/check-seo.mjs <URL>`（プレビューは `--preview`）。
- `/qa-depth` はローカルの `CHASEN_LOCAL_QA=1` 時だけ有効。Vercelでは必ず404。独自ドメイン・main公開は別途判断。
- `/qa-home` と `/en/qa-home` はローカルQA有効時に通常ホームへ転送。Vercelでは404。本人指定・採用済みの5原画像は通常ホームとNotionへ統合済み。未採用の新画像を混ぜない。

## 2026-10-27 本人の最新指定（過去の画風指定より優先）

5場面は切抜き前の原画像を使い、全体が静かに浮上する演出。BrandJourneyの切抜き/背景分離/継続揺れは撤回。店舗の従来Tilt/スクロール演出は維持し、熊本は指定06-entry-v2自身の深度で従来どおり動かす（旧画像のdepthを流用しない）。原画像使用記録は親の承認済み/ブランド体験_原画像_20261027。通常の / と /en に統合し、実Notionの「新ホーム｜…」6行から画像・日英本文等を読む。旧9行は本番共有のため保持。新5場面は全て同じ画像枠と動き。原画像QA用の環境変数は不要。本番未反映。全体の正本は親の進行台帳.md。
