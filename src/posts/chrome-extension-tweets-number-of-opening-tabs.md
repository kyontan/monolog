---
title: "開いているタブ数をツイートする Chrome Extension を作ってみた。"
date: 2013-09-22T00:37:00+09:00
slug: "chrome-extension-tweets-number-of-opening-tabs"
categories:
  - "Programming"
post_tags:
  - "Chrome Extension"
  - "Twitter"
  - "作った"
---

ふとした思いつきで作ってみた。

[https://twitter.com/sukukyon/status/381401707759935489
]()[https://twitter.com/sukukyon/status/381401849338683394

]()Chrome Extension 、作るの面倒くさそうだなーという思い込みがあったのだけど、実際に試してみたらかなり簡単でした。

情報も充実してて、分からないことはググったら一発で解決したので、ふとした思いつきという微妙なモチベーションでも詰まらずに完成したわけですっ。

今更、作り方を説明などしても無駄な感じなので、参考になったサイトを2つだけ。

> [Chrome Extensions API リファレンス](http://dev.screw-axis.com/doc/chrome_extensions/)

ただのリファレンスと言っては何だけれど、困ったことは大体ここを見れば良いと思う。

> [What are extensions? - Google Chrome](https://developer.chrome.com/extensions/index.html)

公式の解説ページ。リファレンスにもなっているけれど、チュートリアルだったり、各機能のサンプルが豊富にあったり。

単に自分が使えればいいやー程度の、そもそも公開する気なんてさらっさら無い拡張機能なので、セキュリティ周りとかを何も考えずに作ったら1時間で出来た。

それにしてもお手軽だなーと。

JavaScript やら HTML やらの基本知識さえあれば、そこそこの物は簡単に作れる気がする。ただ、既存の物は結構多いのでやはり**新規性**が…

とりあえず出来上がったものを置いておきますね。

[http://dev.monora.me/test/TabCount.crx
](http://dev.monora.me/test/TabCount.crx)Chromeでそのままインストールしようとするとエラーが出るので、一旦ダウンロードしてから、設定->拡張機能 のところに ドラッグすればインストール出来る気がします。
