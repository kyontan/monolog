---
title: "sigma.js に送った Pull Request が マージされた"
date: 2014-10-09T20:50:00+09:00
slug: "sigma-jsに送ったpullrequestがマージされた"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "github"
    label: "Github"
  - slug: "sigma-js"
    label: "sigma.js"
---
---

[sigma.js](http://sigmajs.org/) という便利なグラフ(グラフ理論の方)の描画ライブラリがあって、研究のGUI部分で使っていたらバグを踏んだという話。

グラフの描画領域をスクロールした時に、ノードをドラッグしようとすると座標がぶっ飛ぶという割りと深刻なバグなのだけれど、sigma.js のサンプルは全てページに全画面で描画されていたので今まで気が付かなかったんだと思う。

原因はブラウザの座標系の違い (pageX/Y と clientX/Y のズレ) だった。JavaScriptでブラウザの座標系なんて今まで意識したこともなかったせいで、原因を突き止めるのにかなり手間取ってしまった……


結果として、修正は以下の2行の変更で済んだ。

```
-  x = event.pageX - offset.left,
-  y = event.pageY - offset.top,
+  x = event.clientX - offset.left,
+  y = event.clientY - offset.top,

```

僕はこのコードが存在するもう一箇所(タッチデバイス向けのコードだった)にも修正をして、PR(Pull Request) を送ったのだけれど、これが問題だった。

送ってから数週間反応が無かったので、いつ Merge されるのかなと楽しみにしていたら、昨日 Issue に返信があって、「そのPRはタッチデバイスのピンチイン/アウト操作を破壊している」と突っ込まれ、………?! とびっくりしつつ、返信の検証コードを試したら確かにバグっていて、急いで元々の修正点1箇所だけを修正したPRを送信。

[昨夜未明に無事 Merge されました。](https://github.com/jacomyal/sigma.js/pull/412)よかったよかった。

OSS、こうして人のプロダクトに貢献出来るの良いな〜と思いますし、承認欲求も満たせて一石二鳥な感じがありますね。
今後も貢献していきたい

なんとなくこの記事を書きながら、Issue の英語間違ってて恥ずかしいなこれーとかなっていた。恥ずかしい恥ずかしい
