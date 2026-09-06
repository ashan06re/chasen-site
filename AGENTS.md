<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
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
- 承認された5場面のスクロール物語＋深度視差＋2店舗の立体パネルを保持。短縮可なのは冗長な物語構成であり、演出全体ではない。
- 新背景画6枚は親の `承認済み/`。入口はv2が最新、点てる手元と砂壁の新画は未採用。撤回された旧画像は復活させない。
- 背景画の書き出しは `../tools/export_story_art.py`。承認済みフォルダと採用記録が揃うまで書き出さない。
- Notion の画像は必ずプロキシ経由（詳細は `CLAUDE.md`）
- QA: `node --test scripts/check-story.mjs`、本番ビルド起動後に `node scripts/check-routes.mjs <URL>` と `node scripts/check-seo.mjs <URL>`（プレビューは `--preview`）。
- `/qa-depth` はローカルの `CHASEN_LOCAL_QA=1` 時だけ有効。Vercelでは必ず404。独自ドメイン・main公開は別途判断。
