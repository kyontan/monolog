---
title: "Google 日本語入力 で和英変換ができる辞書を公開しました"
date: 2015-12-24T03:02:00+09:00
slug: "published-edict-for-google-ime"
categories:
  - slug: "雑記"
    label: "雑記"
post_tags:
  - slug: "google日本語入力"
    label: "Google日本語入力"
  - slug: "作った"
    label: "作った"
  - slug: "辞書"
    label: "辞書"
---
---

作ったというか既存のものを3行書き換えただけなのですが……。

[https://github.com/kyontan/edict-for-google-ime
](https://github.com/kyontan/edict-for-google-ime)たまに、ちょっと単語を英訳したいとなることがあって、そういった時に重宝する辞書です。

元々は以下のものを使っていたのですが、これの(2) 以降がダウンロードできなくなってしまい、新しい環境に導入することができず……
(完成してから、 [google-ime-user-dictionary-ja-en](https://code.google.com/p/google-ime-user-dictionary-ja-en/) の上部によく見たら *付きの辞書が公開されているのを見つけましたが、それは見なかったことにしました。)

> [google-ime-user-dictionary-ja-en
> ](https://code.google.com/p/google-ime-user-dictionary-ja-en/)Google日本語入力の和英辞書作成プロジェクトです。主に「カタカナ語英語辞書」の代替辞書作成を目的としています。(EDICT使用) - Google Project Hosting

 

調べてみると、これの MS-IME 版の辞書を公開しているところを見つけました。

> [IME和英辞書 - EDICT for MS-IME 2
> ](http://www.nurs.or.jp/~nagadomi/edictime2/)IME和英辞書 EDICT for MS-IME 2は、豪モナシュ大学による[EDICTプロジェクト](http://www.csse.monash.edu.au/~jwb/j_edict.html)の日英辞書をMS-IME用に変換したものです。
> 「@日本語」と入力することで、英語に変換することができます。

MS-IME 用の辞書 は Google 日本語入力の辞書ツールで読めそう! と思って取り込もうとしたらなんでか失敗してしまう……。
試しに、nkf で文字コードを Shift-JIS から UTF-8 に変換して、ファイル先頭にあるコメント3行を消してみたら取り込むことに成功してとてもよい感じになりました。

というわけで公開します。(記事最初のものの再掲になりますが)

[https://github.com/kyontan/edict-for-google-ime
](https://github.com/kyontan/edict-for-google-ime)もしよければ使ってやってください。

 
