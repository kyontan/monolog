# monolog (Eleventy)

Astro/EmDash を使わず、D1 から書き出した JSON だけで静的サイトをビルドする PoC。

## 手順

```bash
# 1. コンテンツ書き出し（ローカル D1 → src/_data/*.json）
python3 scripts/export-11ty.py

# 2. ビルド
pnpm install
pnpm build   # _site に出力（122 ファイル、約0.2秒）

# 3. 確認
python3 -m http.server --directory _site 8931
```

## 構成

- `_data/*.json` — 書き出し済みコンテンツ（`scripts/export-11ty.py` で再生成可）
- `_includes/pt.js` — Portable Text レンダラ（block/image/code/break/htmlBlock/embed/columns/gallery＋marks対応、リスト結対応）
- `index.njk` — トップ（10件/ページのページネーション付き）
- `posts.njk` — 個別記事（110件生成）
- `archive.njk` — 全件タイトルリスト
- `css/` — codium テーマ CSS のコピー

## 本実装時の残課題

- 画像 301 件（`/_emdash/api/media/file/*`）の書き出し＋URL 書換え
- category/tag/年月アーカイブ、検索（Google site:）、リダイレクトページ、RSS
- エディタ（別途検討：ブラウザベース＋GitHub API 等）
