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

- 2026-09-06：スクロール物語と深度演出は廃止。トップは `EditorialHome.tsx`、画像は `public/editorial/`。
- 提供実写と店内風景画の写真を使用。旧画像はローカル `引き継ぎ/旧スクロール物語_20260906/` に退避済み。承認撤回された画像を復活させない。
- 画像書き出しは `../tools/export_editorial.py`。`承認済み/実写_選定/` に存在する画像だけを書き出す。
- Notion の画像は必ずプロキシ経由（詳細は `CLAUDE.md`）
