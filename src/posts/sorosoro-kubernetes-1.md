---
title: "そろそろ Kubernetes 入門する (1)"
date: 2021-06-21T23:15:00+09:00
slug: "sorosoro-kubernetes-1"
categories:
  - "Cloud Native"
post_tags:
  - "Kubernetes"
  - "n0stack"
  - "Server"
---

いい加減クラウドネイティブっぽいことをやりたいと言い出して早数年、世の中の流れには完全に乗り遅れた感がありますが、今更入門することにしました。

この記事を書いている時点で、すでにこのブログが構築したクラスタ上で動いているところまでは来ていますが、ゆっくり備忘録がてらまとめていくことにします。

ただkubeadmでシングルノードで立てても面白くないよね、ということで、色々と試してみることにしました。

1. 実験のしやすさを考慮して**VMの上に建てる**



  1. VM基盤は n0stack を使う



1. 可能な範囲でちゃんと**冗長化する**

1. ちゃんと**アプリケーションを乗っける**

1. 完全な**お遊び用のクラスタは別に作る**

あたりを基本方針にしました。

### ホストについて

さて、まずサーバはどうするかという問題がありました。現代なので冗長化するなら3台欲しいので、お手軽かつ高速なマシンが3台必要でした。

また、過去にも同じことをやろうとして、[秋葉原で安く売っていたサーバ](https://akiba-pc.watch.impress.co.jp/docs/wakiba/find/1088686.html)(通称赤鯖)を3台買ってはいましたが、CPUもRAMも足りない && ファンの音がうるさいということで放置されて早3年が経過したので、次は静かなマシンが良かったわけです。

というわけで安くて速くて静かでRAMが積めるマシンを検討した結果、 [Lenovo の M75q Tiny Gen2](https://kakaku.com/item/K0001307634/?cid=shop_google_dsa_00010001_direct&gclid=CjwKCAjw8cCGBhB6EiwAgOReyxZcWi0C0wSqHRzfkyFRluRvWuDv91OxBaqiQAZwCQ9ZlUKHZtgU9BoCqs4QAvD_BwE) を購入しました。定番ですね。Ryzen 7はコアが多くて速い。
ただ、予算の都合でまだ2台しか買えてません。

購入後の感想ですが、静かで小さいので自室の足元に置いても気にならずかなり満足しています。CPU使うと流石にファン回って気になりますけどね。

<https://twitter.com/sukukyon/status/1382987513598382081>

一方で、色々構築をすすめるにつれ、ストレージが256GBだと足りないか? と思うことがあり、SATAのSSDを追加することを検討しています。
ストレージ足すなら別に小さい必要はなかったのでは……という気持ちがあり、 [V55t Mini-Tower](https://kakaku.com/item/K0001314866/) とかでも良かったのでは……という気持ちに。計画性がない。

ストレージをどうするか問題は常に付きまといますね。後述するかもしれませんが、現在は、このクラスタとは別に以前から運用していた FreeBSDサーバに刺さっている雑なディスクをミラーリングしてNFS共有しています。RDBMSとかやろうとするとiSCSIの方が良いかもしれない……

OSは雑に Ubuntu 20.04 Server を選択。

### n0stack

今回のVM基盤です。別にlibvirtでもOpenStackでもなんでも良いのですが、構築が楽 & 動作が軽くて、コードはなんとなく分かるので気になったら自分で直せるし、ぐらいの気持ちで選択しました。

n0tsack は 友人の @h-otter が主となって開発していて、過去には ICTトラブルシューティングという大会で数百VM規模で動いた実績があります。紹介記事は本人が書いてるので読んでください。

> n0stackの紹介 - h-otterの備忘録

[https://github.com//n0stack/n0stack](https://github.com//n0stack/n0stack) を眺めて、 n0core と n0cli があれば動くことが分かったので適当にやります。

VMを起動する/管理する本体である n0core は、全体の管理をする api とQEMU等を制御する agent からなります。
データストアは api にいて、デフォルトでは設定不要の LevelDB を使用します。LevelDB は特にデーモン等が不要のDBで、api が動くホストの `/var/lib/n0core` あたりに勝手に保存されます。
冗長化したければ etcd も使えます、が構築時点では
etcd or LevelDB を使っていて、デフォルトだと LevelDB を使うので、特にDBの設定は不要です。雑に [GitHub の README](https://github.com//n0stack/n0stack#deploy-all-in-one) を見てデプロイします。

VMのセットアップはあまり考えずに[ドキュメント](https://docs.n0st.ac/en/master/user/usecases/boot_vm_from_iso.html)を参照すれば良い、と思いきやハマりました。QEMUの仕様が変わったらしい? [https://github.com/n0stack/n0stack/pull/239](https://github.com/n0stack/n0stack/pull/239) で解決。そのうちマージします。

適当な Ubuntu が起動することを確認したところで一旦ここまで。(ホスト名は k8s-0X だが別に Kubernetes は動いていない)

<https://twitter.com/sukukyon/status/1390780779911802884>



