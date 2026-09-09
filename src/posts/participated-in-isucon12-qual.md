---
title: "ISUCON12 予選に参加しました (最終スコア15532点)"
date: 2022-07-27T03:01:00+09:00
slug: "participated-in-isucon12-qual"
categories:
  - "Infrastructure"
  - "Programming"
post_tags:
  - "ISUCON"
  - "コンテスト"
  - "参加しました"
---

2022年7月23日 (土) に開催された ISUCON12 の予選に「DJ起床失敗とMC布団 w/o MC布団」として [id:h-otter](https://h-otter.hatenablog.jp/) と参加しました。

言語は Go、最終スコアは**15532点**、[参考スコア](https://isucon.net/archives/56838276.html)を上から数えると**45位**だったようです。悔しい。
具体的な取り組みは下の方で述べますが、MySQL移行はバグなく完遂し、さてここからチューニングしていくぞ！という感じのところで終わりました。エンジンが掛かるまでの速度が足りなかった。

![](https://monora-monolog-media.1line.dev/821f8740d91c148254ae8f29eb6f836a.jpg)

毎回、運営の皆様にはいくら感謝しても足りませんが、今回も取り組みがいのある問題で楽しかったです。ベンチマーカーも最後まで待ち時間がほぼなく、スコアも安定していたのでとてもストレスフリーでした。ありがとうございました。

マルチテナントで大量の SQLite3 データベースがあることが分かったとき、ISUCON本を読んだだけの人間には解かせないってことね!と思いながらニコニコしました。

ところで知り合いがたくさん著者に名を連ねている[ISUCON本](https://amzn.to/3J29GVW)ですが、予選の2週間前に購入し、予選開始1時間前に部屋から発掘されました。
30分ぐらいで流し読みしたのですが、大変実利的な内容に溢れているなあと感じました。nginx の upstream で keep-alive を有効にする方法は知らなかった……

<https://twitter.com/sukukyon/status/1550642844624617473>

<span id="more-participated-in-isucon12-qual"></span>

### 9:00 起床

前日も早く寝るぞと自分に言い聞かせながら4時半まで起きてしまい、念には念で8時に掛けた目覚ましが1時間鳴っていました。すでにこの時点で心も体も終わっています。

部屋の隅にISUCON本が積まれているのを発見しました。[ちいとぽ](https://amzn.to/3PxJipt)も積まれています。
h-otterと合流するために移動しつつ、パラパラと眺めます。

### 10:00

まだ合流のため移動中ですが予選が始まっているようです

### 10:05

合流しました。 CloudFormation テンプレートを流します

### 10:22 初回スコア 2732

起動したのでベンチを回しました。この時点で分担も何も決まっていません。

とりあえず kataribe を入れたり pt-query-digest を入れたりします。
「そういえば先日の社内ISUCONで Cloud Profiler 便利だったな……」みたいなことを思いながら、入れ方を調べます。
GCPプロジェクトが必要らしいので作ったり、サービスアカウントキーを発行したりします。予選始まってからやることではない。

### 11:30ごろ

Cloud Profiler を入れたので眺めました

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/3aa8c1532fe9417aa4141a1860fd5623-scaled.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">SQLite だね〜という感想。</figcaption></figure>

### 12:00

h-otter が MySQL 対応の実装を終わらせて、「Uber eatsでも呼ぶか〜」と言いながら、なぜか歩いてマクドナルドに飯を買いに行きます。なんで??

### 13:03 MySQL移行 3023点

MySQL移行が一段落します。今思うと速かった。

sqlite から SQL をダンプしてゴニョゴニョやり始めて十分程度経ったあと、 `sqlite3-to-sql` って名前のスクリプトあるけど?? と気付いて笑ってました。先に気付こうね。

とりあえず MySQL に流し込むこと数分、INSERT が一向に終わらないことに気が付きます。このままでは `POST /initialize` がタイムアウトしてしまうため、バルクインサートをするクエリに書き換えることにしました。

sed で気合でバルクインサートに書き換えましたが遅い。ここで1台目のインスタンスがメモリを食いつぶして死にます。160万件のINSERTを一発でやると死ぬことが分かる。
先日の社内ISUCONでもインスタンスのメモリを食いつぶしたんだよな……と思いながら1台目を捨てます。

これが答えです。

```
for i in `seq 1 100`; do echo $i; mv $i.sql $i.sql.bak; sed -z -e "s/);\n/);\n\n/" -e "s/NULL\n);/NULL\n);\n\n/g" -e "s/);\nINSERT INTO [a-z_]* VALUES/)\n,/g" $i.sql.bak > $i.sql; done
```

![](https://monora-monolog-media.1line.dev/7a8c7f354c775e1cf36854c39890c9ae-scaled.jpg)

それなりに早くなりましたが、まだ遅いので tenant の player_score テーブルにおいて、 updated_at が一定以上のレコードを DELETE する作戦に切り替えます。これで10秒程度で POST /initialize が通るようになりました。

```
DELETE FROM tenant_X.player_score WHERE updated_at > 1654041599;
DROP TABLE tenant_X.competition;
DROP TABLE tenant_X.player;
```

他のチームの参加記を読んだら 「`/var/lib/mysql` をコピーする」「毎回 mysqldump を実行する」みたいな筋肉実装が多くて震えました……

確かここらへんで h-otter がなぜか flock を倒す実装を書くもベンチがコケました。
「そこはボトルネックじゃないっぽいし一旦revertしよ?」と、人の競技中の努力を無に帰すような心無い発言をしました。ごめんなさい。

なぜかここからしばらく無の時間が続きます。なぜ……

### 15:20 3758点

h-otter が competitionRankingHandler の N+1 を潰したようです。

![](https://monora-monolog-media.1line.dev/e8db1bd829ae516c4856e01202912365.png)

### 15:50 6336点

グッとクエリを睨んで indexを追加。`playerAddHandler` がかなり速くなりました。

```
ALTER TABLE visit_history ADD INDEX (competition_id, player_id, created_at);
ALTER TABLE visit_history ADD INDEX (created_at);
ALTER TABLE tenant_X.player_score ADD INDEX (competition_id, player_id, row_num DESC);
```

マルチテナントのDBをそのまま持ってきたので、tenant_id は無視するようにしました。

![](https://monora-monolog-media.1line.dev/972569bfa063fe01a93c6e5a51327b27-scaled.jpg)

### 16:08 7923点

h-otter が `playerHandler` の N+1 を潰したようです。

そして `player_score` に index を追加。
`ALTER TABLE player_score ADD INDEX (player_id, competition_id);`

バルクインサートと、JSONシリアライザの変更(encoding/json → [goccy/go-json](https://github.com/goccy/go-json))をした結果、スコアがやや増加しました。(8269点)

![](https://monora-monolog-media.1line.dev/d402be907bf0ee74f9251569549ca330-scaled.jpg)

### 16:36 10253点

なんかヤバそうな実装の dispenseId を倒しました。1万点突破。
よくわからんけど順序保証されてたほうが良さそうな気がしたので、 time.Now().UnixNano() を文字列にしてそのまま突っ込みました。爆速。

たしかこのあたりで、 tenant の `player_score` は `(tenant_id, competition_id, player_id)` ごとに最新の1行だけあればいいことに h-otter が気付きましたが、あまり速くならず。
この時点で row_num に関する index を落とすべきでした。

既存の `tenant_{1..100}` に対してもそれを適用しましたが、スコアとしては特に変化なしでした。

![](https://monora-monolog-media.1line.dev/69e135768348aefdc430576563a0b8fb-scaled.jpg)

このあたりでベンチマーカのログから、タイムアウトでユーザーが減ったという表示がなくなり、ようやくISUCON始まったな! という気持ちになります。すでに手遅れ。

### 17:03 12505点

h-otter が jwt のパース結果をキャッシュします。神

![](https://monora-monolog-media.1line.dev/8b40f5fa7a5b915e094f0c19106aaaf3.jpg)

### 17:45 14363点

app + DB の2台構成にした気がします。

### 17:50 15962点

流石にやや諦めムード。ログを切ったりできることをしました。
忘れずDEBUGログを切ったりスロークエリーを切ったりしました。偉い。

「再起動試験はしなくていいでしょ！」で終了

## 感想

1. MySQL 移行をバグらせずに完遂できた俺達は偉い (本当に偉いと思っている)

1. 毎回意味不明なバグを仕込んで後半暗澹たる感じにあるので、今回はほぼ最後までノーバグで駆け抜けられたのは良かった。良くも悪くも我々は大人になった

1. プロファイラ / スロークエリ / アクセスログの3本柱をちゃんと見ながら走れたのは本当に良かった。常に事実は正しい。fact based / metrics-driven

1. 後半のスコアのブチ上がり方が楽しかった。というかここに来るまでを自分は第一関門を突破した段階だと思っている。やれる改善はたくさん残っていたし、あと1時間あれば更に2倍, 3倍のスコアは出ていたんだろうなと思うと悔しい

そのほか

1. 午前中からの競技は本当に心も体も終了していて何も捗らなかった。ISUCONに必要なのは健康な心と身体

1. デカいテレビで h-otter がリゼ・ヘルエスタと名取さなの原神ガチャ配信をずっと流していた。「縁起がいいと思ったんだけどなあ」って何?

1. その後はリゼがパワプロしてた。リゼ・ヘルエスタについて私が知っているのは第一第二第三皇女のいずれかであるということぐらいです。

1. 最後1時間ぐらいローテンションお嬢様 (壱百満天原サロメ)流したら集中力が0になった。何?
