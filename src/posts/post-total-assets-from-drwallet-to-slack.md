---
title: "総資産を Dr.Wallet から Slack へポストするようにした"
date: 2017-07-10T00:22:00+09:00
slug: "post-total-assets-from-drwallet-to-slack"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "docker"
    label: "Docker"
  - slug: "dr-wallet"
    label: "Dr.Wallet"
  - slug: "ruby"
    label: "Ruby"
  - slug: "総資産"
    label: "総資産"
---
---

こんにちは。JST+11で生きているので昼です。
ところで最近は世界から10年遅れて Rails に入門したり、それとは関係なく Sinatra のアプリケーションに
RSpec を書いてテストの重要性を感じながら七夕に笹の葉ラプソディを見たりしています。10年前って単語がよく聞かれる今日このごろです。

皆さんはおそらく何らかのチームでのコミュニケーションに Slack を使っていて、総資産を Dr.Wallet で管理されていて (ここで読者の8割が脱落)、その総資産を逐次仲間に共有したいですよね! (残存者0)

で、やっぱり皆さんも共有したいでしょう、というわけで作りました。


(実は1年ぐらい前に作ってあったのですが、環境依存が辛かったので Docker に押し込む作業をしました)
[GitHub kyontan/assets2slack
](https://github.com/kyontan/assets2slack)雑に `docker-compose run --rm crawler` とかやると共有できて便利です。

![assets2slack demo](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/2017-07-09-23.png)

おそらく最近のアプリケーションなので `docker-compose.yml` が置いてあります。ポジショントーク?じゃないですが、こういう環境作りが面倒くさいアプリケーションの共有には向いていると思います。
1コンテナにまとめたかったのですが、少し面倒くさそうだったので投げました。PRお待ちしています。

実装は至極簡単に、 Ruby あるあるな capybara + selenium-webdriver で雑にクロールして Webhook で投げているだけです。技術に新規性はありません。

話が逸れますが、 Dr.Wallet のレシート人力OCRは精度も良いしおすすめです。あと、どうやら iOS より Android アプリの方が3倍ぐらい機能が充実していて便利です。NFC で Suica も読めるし。

皆さんもこれを使って総資産で殴り合っていきましょう。僕の総資産はたまにマイナスになります。
