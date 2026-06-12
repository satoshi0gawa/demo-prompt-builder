# Prompt Builder EC-Demo

ECサイトの商品登録や運営業務で使うAIプロンプトを作成する、静的HTMLのデモサイトです。

公開URL:

https://satoshi0gawa.github.io/demo-prompt-builder/

## Overview

Prompt Builder EC-Demo は、EC担当者が日常的に行う文章作成やHTML作成を補助するためのプロンプト生成ツールです。入力内容に応じて、AIチャットへ貼り付けやすいプロンプトや、商品ページで使えるHTMLコードを生成します。

## Features

- 商品説明文プロンプトの生成
- 英語商品情報の日本語翻訳プロンプトの生成
- SEOを意識したタグキーワード出力
- サイズテーブルHTMLの生成
- 生成結果のコピー
- サイズテーブルのHTML表示とデモ表示の切り替え

## Files

```text
index.html
css/
  dev-reset.css
  style.css
js/
  main.js
scss/
  style.scss
img/
  dummy/
```

## Development

このリポジトリは、GitHub Pages で公開できる静的サイトとして構成しています。ルート直下の `index.html` が公開ページです。

SCSS を更新した場合は、公開用CSSである `css/style.css` へ反映してからコミットします。

## GitHub Pages

公開URL:

```text
https://satoshi0gawa.github.io/demo-prompt-builder/
```
