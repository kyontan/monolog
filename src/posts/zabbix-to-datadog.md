---
title: "Zabbix で収集したデータを Datadog へ投げる"
date: 2017-08-06T01:23:00+09:00
slug: "zabbix-to-datadog"
categories:
  - slug: "infrastructure"
    label: "Infrastructure"
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "datadog"
    label: "datadog"
  - slug: "zabbix"
    label: "zabbix"
---
---

こんにちは。これを書いているのは JST 4:30 ですが、最近は JST+0900で生きているので、昼間です。そろそろ夕方でしょうか。
最近の仕事の成果は Zabbix に投げ込む XML をエイヤで自動生成するような何か、もしくは SQL を生成する何かです。

成果物は [kyontan/datadog-zabbix-history](https://github.com/kyontan/datadog-zabbix-history) です。

## 長い前置き

ところで皆様は Datadog を使われていますでしょうか?
インフラ監視系の SaaS やソフトウェアというと、今挙げた Datadog を始め, Mackerel や Zabbix, Nagios, AWS Cloudwatch 等々、現状では様々なプロダクトが存在しています。最近だと Datadog や Prometheus の名前をよく見かける気がします。

そんな中最近、自分のバイト先では使われているのが [Datadog](https://www.datadoghq.com/) です。サーバの監視なんかだと、 Integration の種類も多く、デフォルトで様々なメトリックが取れることや、ダッシュボードの見やすさなどがイケているかなと。
特に SaaS だと、バッファリングがあるにしてもメトリクスの抜け落ちや一時アクセスできなくなる問題などはあり、クリティカルなものを全部載せるわけにもいかず、ただ SaaS の恩恵は受けたいというのが正直なところでしょう。
(mackerel-agent のログを眺めているとたまに何故か 404 が返ってきていて笑います)

ただ、設定が複雑化したり、そもそも設定数が多くて移行がダルいというのが正直なところです。エイヤでやる体力があれば良いですが、ホスト数が増え、監視項目が万の単位であるとそれはそれは……

おそらく皆さんは Zabbix のアイテムやらなんやらを XML で書き出して**ごにょごにょ**したり、それを Prometheus の設定に**いい感じ**に変換する何かを書いたりされているかと存じます。そしてそんなコードは短いから/特定のドメインに特化しているからと公開せず、誰もが**誰かは書いているだろう**と思いながら書いていることでしょう。そうですよね?

今回ご紹介するのはそんなあるあるプロダクトです。やることは記事のタイトルに書いてありますね。



## 本編

最初にも書きましたがこれ ([kyontan/datadog-zabbix-history](https://github.com/kyontan/datadog-zabbix-history)) です。実装としては、Zabbix の DB からメトリクス (Zabbix でいうアイテムのヒストリ) を勝手に拾ってきます。
いい感じに動きます。良かったですね。

現状イケてないところが1つあって、 dd-agent は独自の組み込み python を使うので pip で入れたパッケージを読んでくれません。インポートパスを弄ります。良くないですね。

まだ、とりあえず動くというところなので、様子を見ていきたいですね。
