---
title: ブログをGitHub Pagesに移行した
date: 2026-09-08T21:04:00-05:00
slug: goodbye-wordpress
categories:
  - 雑記
post_tags:
  - AI
---
WordPress + MySQL on Kubernetes on 謎の仮想化基盤 on 自宅サーバー、あまりにも放置しすぎて全然メンテナンスできていなかったので、一回爆破することにした。

趣味コーディングも長らくしていなかったのだけれど、[OpenCode](https://opencode.ai/)というLLMのcoding agent(ハーネス)およびプロバイダーが安く使えそう(執筆時点で10USD/月)だったので、試しに契約してまとめてやらせてみた。

当初はCloudflareがリリースした[EmDash](https://blog.cloudflare.com/emdash-wordpress/)にしようかと思ったのだけれど、Cloudflare Workers の Paidプランでしか使えないようだったので思い切って静的サイトに方針転換して、[11ty](https://www.11ty.dev/)なる静的サイトジェネレータでビルドしてGitHub Pagesでホスティングすることにした。編集画面は[Decap](https://decapcms.org/)というOSS?を試しに使うことにして、画像はひとまずCloudflare R2 (free tier)という雑構成。ここまで紆余曲折しつつMeta Muse Spark 1.3 (Contributor) で $2.31 と言われているがマジでしょうか……



一旦自宅サーバーをクリーンインストールしてやり直したい気持ちに駆られることはや数年。いつ手を付けるのか……

<!--more-->

(追記)とりあえずタグ・カテゴリの編集機能と画像アップロード機能も追加して、普通にブラウザ上で記事が書けそうな環境が整った。画像の表示サイズの編集とか凝ったものはないけれど、ひとまず文字が書ければ良いでしょう。



![monologの編集画面](https://monora-monolog-media.1line.dev/2026/09/SCR-20260909-dupl.png)
