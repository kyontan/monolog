---
title: "Adventar::Listを作った"
date: 2013-12-01T21:39:00+09:00
slug: "adventarlistを作った"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "adventarlist"
    label: "AdventarList"
  - slug: "作った"
    label: "作った"
---
---

12月になりました。**アドベントカレンダー**の季節ですね。
アドベントカレンダーといえば、去年は[ATND](http://atnd.org/)を中心に行われているものが多かった気がするのですが、今年は[Adventar](http://www.adventar.org/)というサイトが使われているものを多く見かけます。
Adventarというのは、その名の通り、アドベントカレンダーの作成, 記事の公開に特化したサービスで、TwitterやGithubアカウントを用いて簡単にアドベントカレンダーへの参加, 作成が出来ます。

ただ、このサービス、1つ気になったことがあります。

### **なんでアドベントカレンダー作るのはそんなに簡単なのに今日の記事一覧が見れないんだ!!**

……何故でしょうか…… 今日公開された記事を5つ観ようとしたら、5つそれぞれのアドベントカレンダーのページを開き、そこから今日の日付のところまでスクロールし、リンクをクリックしないといけないのです……

これはまとめを作るしか無いなーと思いまして、作りました。

### [Adventar::List](http://adventarlist.monora.me/)


※ちょこちょこ稼働させながらコード書き換えてるので500返りますがご愛嬌

超シンプルです。めいどいんSinatraです。
最初はCGIで作っていて(何)、1ファイルで動いてミニマム感溢れていたのですが、あまりにも遅すぎたので途中でPassengerに変更しました。
データはAdventarから持ってきたものを[Nokogiri](http://nokogiri.org/)でスクレイピングして、[redis_orm](https://github.com/german/redis_orm)を使って[Redis](http://redis.io)に投げています。
ただ、redis_ormの実装がアレなのか良く分かりませんが、異様にバグります。なんでや!!
例えば、id=1なオブジェクトを検索したらid=2なものが返ってくるとか、find(:all, ...)で取得したデータが何故か最後に突っ込んだデータだけとか…
あまりにも残念すぎたので素直に[DataMapper]()を使うべきだったと反省。

最後に:
[クリスマスプレゼントお待ちしております!](http://www.amazon.co.jp/registry/wishlist/10E3CDBHPY7IP)
