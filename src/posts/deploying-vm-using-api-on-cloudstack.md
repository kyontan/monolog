---
title: "CloudStack の VM を cs コマンドでデプロイしようとしてハマった"
date: 2016-10-24T02:00:00+09:00
slug: "deploying-vm-using-api-on-cloudstack"
categories:
  - slug: "infrastructure"
    label: "Infrastructure"
post_tags:
  - slug: "cloudstack"
    label: "CloudStack"
  - slug: "ictsc6"
    label: "ICTSC6"
---
---

こんばんは。タイトルだけ書いた下書きが溜まっているので書いていきますということです。

[ICTSC6](http://icttoracon.net/archives/category/%E7%AC%AC6%E5%9B%9E%E3%83%88%E3%83%A9%E3%82%B3%E3%83%B3) で CloudStack を使用していた話はまだ書いていなし多分書かないですが、使用していました。

その中で、API を叩いてくれる薄っぺらいラッパーコマンドであるところの [exoscale/cs](https://github.com/exoscale/cs) を叩いてデプロイなりVMの起動停止なりボリュームのアタッチなどをやっていたわけですが、デプロイ関連で少しハマったので解決策を紹介。

ちなみにこれ: [https://github.com/exoscale/cs](https://github.com/exoscale/cs)。 exoscale 、 CloudStack なんですかね……

~~CloudStack の API はあまりにも愚直なのでパラメータが無限に多くてしんどいという話はさておき
~~APIの一覧は [http://cloudstack.apache.org/api/apidocs-4.9/](http://cloudstack.apache.org/api/apidocs-4.9/) にあります。 (4.9 の場合)
VM を作成する場合は、 [deployVirtualMachine
](http://cloudstack.apache.org/api/apidocs-4.9/apis/deployVirtualMachine.html)書いてある通りですが、必須なパラメータは以下の3つです。

- serviceofferingid

- templateid

- zoneid

それとは別に、IPアドレスを固定したり複数のネットワークにVMを接続するときは iptonetworklist パラメータを指定するわけですが、このパラメータの設定がなんもわからんという感じです。

```
iptonetworklist[0].ip=10.10.10.11&iptonetworklist[0].ipv6=fc00:1234:5678::abcd&iptonetworklist[0].networkid=uuid
```

難しすぎる。なんで突然配列の演算子が出てきて & で繋ぐ必要があるんだ……

実際に直に API を叩いたことはないのですが、 cs ではこの通りにパラメータを書いても上手く動いてくれません。
なので、以下のようにする必要があります

```
cs deployVirtualMachine ... iptonetworklist[0].ip=192.168.15.3 iptonetworklist[0].networkid=4bbc38e5-3e36-4a11-9c93-5a5261911120
```

ただ & で繋げずにスペースで区切るだけです。どういう挙動なんだろう……
どこにも仕様が載っていないので試行錯誤せざるを得ないわけですが、やっていきましょう

結局 cs コマンドの引数はこんな感じになってしまうので非常に読みづらい。各位 Ansible のパワーに頼っていきましょう。僕は Ruby でラッパーを書きました。

```
cs deployVirtualMachine displayname='vm1-p15-t7' name='vm-x-hoge' serviceofferingid='3ebb38bf-dbb6-42b1-b301-041d3546b5dc' templateid='cec5838f-1bae-442f-9009-9e27dcf33941' zoneid='57305097-d51a-467b-bbec-862ab20850d1' hostid='3edc5cc0-5375-462d-8a38-b2e4920791f4' account='xxx' domainid='1d43bf7b-b00c-41ba-959a-e422c4649547' startvm='false' iptonetworklist[0].ip=192.168.15.3 iptonetworklist[0].networkid=4bbc38e5-3e36-4a11-9c93-5a5261911120
```
