---
title: "Gehirn DNS を DDNS っぽく使えるようにする gddns2 を作った"
date: 2015-10-13T02:15:00+09:00
slug: "wrote-gddns2-a-ddns-client-for-gehirn-dns"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "gddns2"
    label: "gddns2"
  - slug: "gehirn-dns"
    label: "Gehirn DNS"
  - slug: "作った"
    label: "作った"
---
---

皆さん Gehirn DNS 使ってますか? 僕は使ってます!

[Gehirn DNS](https://www.gehirn.jp/gis/dns.html) というのは、エイリアスやらマイグレーションやら機能が充実している DNSサービスです。
Web インターフェースもモダンで結構使いやすいのですが、もちろん API も叩けるので CLI でアップデートできて便利。
ステマっぽいですが、使ったところで僕には1円も入りません……
そんな Gehirn DNS を、[gddns](https://github.com/atpons/gddns) を使って DDNS っぽく使っていたのですが、Gehirn Infrastructure Service の開始に伴い API体型もガラッと変わりました。

新しい Gehirn DNS でも DDNS っぽく使いたいですよね。
というわけで [gddns2](https://github.com/kyontan/gddns2) を作りました。


gddns2、複数ゾーン/複数ドメイン使えて便利になった! みたいなのがあります。
そのうち IPv6 対応もしたいところですね。

ちなみに、新しい Gehirin DNS ではリクエスト元の グローバルIP が取得できなくなったので、[ipinfo.io](http://ipinfo.io) を使って取得しています。

Gehirn DNS、2円/日でとても安価なのですが、執筆時点(2015/10/13) ではプレビュー期間なので無料です。ぜひ使ってみてください。
