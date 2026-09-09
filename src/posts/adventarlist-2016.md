---
title: "Adventar::List 2016"
date: 2016-12-13T02:28:00+09:00
slug: "adventarlist-2016"
categories:
  - slug: "雑記"
    label: "雑記"
post_tags:
  - slug: "adventarlist"
    label: "AdventarList"
---
---

この記事は [MMA Advent Calendar 2016](http://www.adventar.org/calendars/1414) 12日目 の記事ということになりました。若干遅刻しました。一般に終電で帰宅すると日付が変わっていることが知られています。

MMA といえば花火なので、合宿担当をやった話でも書こうかと思ったのですが、あまりにも特異なケースすぎて全く一般化できない上に、多少書くのが微妙なラインもあったのでやめました。

また、Team MMA として [SECCON 2016 Online CTF に参加した話](/2016/12/seccon-2016-online-ctf-write-up/)は昨日書きました。
というわけで、宣伝も兼ねて [Adventar::List](http://adventarlist.monora.me) について書きます。

[Advenar::List](http://adventarlist.monora.me) というサービスを作った話は[過去にも monolog に書いていますが](/2013/12/adventarlist%e3%82%92%e4%bd%9c%e3%81%a3%e3%81%9f/)、今年も少しアップデートしたので書きます。


[kyontan/AdventarList](https://github.com/kyontan/AdventarList) だいたいこのようになっており、[このようなマイルストーン](https://github.com/kyontan/AdventarList/milestone/1)があります。

見た目上の変化はないですが、クローラがモジュールっぽく書き直されて少しイケた感じになったり、N+1問題が解決して4倍ぐらい早くなったりしています。特に最近は1日500件以上の記事が上がるので、それなりに速度が求められている気がします。

つまり現時点では何もやっていないということが分かるのですが、頑張ってやっていて、フロントを書き直そうとしています。

このフロントは確か2年前からそのまま使っているし、最低限の機能しかないのでそろそろ検索なりお気に入りカレンダー機能なりを付けようとしていて、せっかくだしモダンフロントJSを書きたいなあと思いつつやっています。

ちなみに開発が止まった最大の理由は、MacBook Air と盃を交わしたところ9万円が飛んだ一連の事象に寄るものです。データが飛ばなかったのが不幸中の幸いです。
皆さんもお気をつけ下さい。

一先ず、先行実装で雑に各ページに .json という拡張子をつけることで[このような JSON](http://adventarlist.monora.me/2016/12/1.json) が返る API は実装してあります。後はこれを良い感じに表示するだけです。

という訳で、クリスマスまでにはおそらく完成するのではないでしょうか。

こんなサービスが存在するということで、暇つぶしにでもお使い頂ければ幸いです。
