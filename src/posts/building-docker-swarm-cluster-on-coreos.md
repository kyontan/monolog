---
title: "CoreOS で Docker Swarm クラスタを作ってみた"
date: 2017-12-10T00:00:00+09:00
slug: "building-docker-swarm-cluster-on-coreos"
categories:
  - "Infrastructure"
post_tags:
  - "CoreOS"
  - "Docker"
  - "whywaita Advent Calendar"
---

こんばんは。kyontanです。JobHunting 活動は順調ではないので頭を抱えています。

寒いです。12月10日です。10日ということは、 [whywaita Advent Calendar 2017](https://adventar.org/calendars/2253) の10日目ということです。なんとあと1枠らしいです。

9日目は @kadokusei (~= @hyr3k) さんで [体重 - /var/log/](http://hyr3k.hatenablog.com/entry/2017/12/09/032008) でした。

ところで文脈もなにもないですが Just Because! が良いです。小宮恵那さん……


さて先日、 Twitter を眺めていたところ 「[真っ赤な“1/4Uサイズ”のブレードサーバーが税込4,980円で大量販売中](http://www.gdm.or.jp/crew/2017/1027/240884)」  という記事が流れていました。
Core i5-2520M@2.5GHz / RAM2G / Diskless という構成ですが、Intel の GbE NIC x4 があるなかなか変態なマシンです。5000円だったのでつい3台買いました。IPMI もあります。ちなみに1台当たりで RAM が 4GB でした。

kamijin_fanta さんという方がこれに VyOS on Hyper-V をやっている記事があるので、こちらもご参照ください。

> [赤鯖にVyos入れて最高のインターネッツを手に入れた](https://blog.kamijin-fanta.info/2017/12/1206.php)

これは [A.T.WORKS](https://www.atworks.co.jp/) というメーカーの国産サーバで、謎です。とりあえずドキュメントとかファームウェアの更新は[公式ストアのダウンロードページ](https://store.atworks.co.jp/download/)に転がっています。

何故かシャーシも付いてきたので適当に突っ込みます。10台入るので、あと7台追加できますね。とはいえ部屋の室温で冷却するにはこの程度の密度が限界かと……

![](https://monora-monolog-media.1line.dev/IMG_1398.jpg)

画像の左下にある赤いやつがそれです。雑ですね。周りも汚いですね……

さて、ディスクレスとはいえ開けてみると SATAポートもディスクベイもあるので、2.5インチのHDDを買えば普通に使えるでしょう。
しかし先立つものがなく、しかし他のサーバは余っているのでネットワークブートさせて遊んでみることにしました。

### PXE とは

PXE とは…… ざっくりと説明するとネットワークブートのための仕組みの1つです。
NIC に書き込まれたPXEブートローダが、ネットワーク上のサーバから OS のカーネルを取得して起動する方法です。

基本的には起動時に DHCP でIPアドレスを取得する際に、サーバが IPアドレス等の情報と一緒にカーネル等が置かれているサーバ(TFTPサーバ)のアドレスを返すことで実現されます。
いわゆる大量のPCを管理する手間を減らしたい(~ シンクライアント化したい) 大学なんかでよく見かけますね。MMA部室の端末でも同様の仕組みを採用しています。
もちろん一般的な誤家庭でも、DHCPサーバとTFTPサーバ等を立てれば実現できます。近年では PXE を発展させた iPXE などもあります。こちらだと例えばカーネルを通常の HTTPサーバから取得するようにできたりします。便利ですね。
実際の実現にあたっては、 「PXE 構築」なんかでググって頂ければ山のように日本語の資料がヒットしますので割愛します。

### Container Linux

今回はこれを用いて [CoreOS Container Linux](https://coreos.com/) を起動させ、自動的に Docker Swarm クラスタを構築したいという話をします。

Container Linux は CoreOS 社が開発している、コンテナ基盤のための軽量Linuxディストリビューションです。docker や etcd と言ったコンテナで用いるソフトウェアがデフォルトで入っているほか、fleet というクラスタマネージャ (というか分散 systemd) なんかがデフォルトで入っています。
CoreOS 社は他にも Docker Registry の Quay やコンテナランタイムである rkt や cloud-config の代替を狙っている Ignition, エンタープライズ向け Kubernetes こと Tectonic の開発なんかもしていますね。

もうお察しかと思いますが、 Container Linux には fleet というクラスタマネージャがあり、更に Tectonic があります。つまり、 Docker Swarm の文脈にはかすりもしません。イケイケな皆さんは Kubernetes を構築すると便利だと思います。
(実は Kubernetes クラスタを構築しようとしたらオンメモリファイルシステムでは容量が足りなかったので Docker Swarm でお茶を濁しています)
CoreOS は今回のよう物理ホスト(ベアメタル)に対して直接プロビジョニングをするためのプロダクトも用意しています。 [Matchbox](https://coreos.com/matchbox/docs/latest/) です。使ってください。
今回は使いません。

### 起動してみる

CoreOS はもちろん PXE での起動に対応しており、[簡潔なドキュメント](https://coreos.com/os/docs/latest/booting-with-pxe.html)があります。 これに従えば簡単に起動までは行なえます。やってみましょう。

最終的なディレクトリ構造としては以下のようになります。
`/tftpboot` は適宜 tftp のルートディレクトリに読み替えてください。また、 `pxelinux.cfg/default` の内容は下に書いてあります。

```
/tftpboot
├── coreos
│   ├── coreos_production_pxe_image.cpio.gz
│   └── coreos_production_pxe.vmlinuz
├── pxelinux.0
└── pxelinux.cfg
    └── default

```

```
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
menu default
kernel coreos/coreos_production_pxe.vmlinuz
initrd coreos/coreos_production_pxe_image.cpio.gz
append coreos.first_boot=1

```

さて、対象のマシンは起動したでしょうか? 手元では30秒ほど OS の読み込みに掛かったあと、OS本体が約4秒で起動してくるのが観測できました。速いです。

ただ、おそらくログインもできず、ssh もできないでしょう。直接本体に接続されている端末にログインしたい場合は、ドキュメントにある通り、 `coreos.autologin` を設定すれば可能です。

実際にもうこれで fleet で遊んだりできます。この状況では、 `/`(rootfs) がメモリ上にあるので、メモリの空き容量分しか書き込むことができませんが、メモリが潤沢にあればこの上に Tectonic や kubeadm を用いて Kubernetes を構築したりもできるでしょう。ちなみに 4GB では足りませんでした。

### Docker Swarm

Docker swarm というのは Docker 本体に取り込まれたクラスタリングの機能です。複数のノードでサービスという単位でコンテナの管理が行えます。
Docker 本体に統合されているので、Container Linux に docker がデフォルトで入っているということはそのまま docker swarm mode で既存のクラスタに join させればそのままクラスタの一員となります。
クラスタにはマネージャとワーカの区別があり、マネージャは Raft アルゴリズムで分散合意を行うため、本来であれば耐障害性のためにも3以上の奇数台を用意することが望ましいですが、今回は DHCP/TFTPにしたサーバをそのまま使います。

```
# docker swarm init
Swarm initialized: current node (hogefuga) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-... 10.0.xxx.yyy:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

上で表示されているコマンドを起動時に入力させればそのまま docker swarm のクラスタにジョインしてくれるでしょう。やっていきましょう。
(ちなみに、デフォルトでは docker swarm のマネージャ自信もコンテナが起動するホストの1つとなります。次のコマンドを打てばそのノードではコンテナが起動しなくなります。 `docker node update --availability drain`)

#### Ignition Config

起動時に任意のコマンド等を実行する方法といえば、あの `cloud-config` がありますね……
Container Linux では最近 [Ignition](https://coreos.com/ignition/docs/latest/) というものに置き換えられました。直接書いてもいいですが、 cloud-config の記法で書いたものは [ct](https://github.com/coreos/container-linux-config-transpiler) ([config-transpiler](https://coreos.com/os/docs/latest/overview-of-ct.html)) というコマンドを用いて変換することができます。
ちなみにオンラインの[バリデータ](https://coreos.com/validate/)があって、 どちらの記法でもここでバリデーションができます。

では用意しましょう。ついでに `ssh` できるように `authorized_keys` なんかも追加できます。 `ssh` したくない? 確かに。
ともかく `systemd unit` を2つ書くだけです。ところで `docker-swarm-leave.service` がちゃんと動いてない気がするのでどなたか教えてください。

```
passwd:
  users:
    - name: core
      ssh_authorized_keys:
        - ecdsa-sha2-nistp256 ...
systemd:
  units:
    - name: docker-swarm-join.service
      enabled: true
      contents: |
        [Unit]
        Description=Docker swarm join script
        Requires=docker.service
        After=docker.service

        [Service]
        Type=oneshot
        ExecStart=/usr/bin/docker swarm join --tokenSWMTKN-1-... 10.0.xxx.yyy:2377

        [Install]
        WantedBy=multi-user.target
    - name: docker-swarm-leave.service
      enabled: true
      contents: |
        [Unit]
        Description=Docker swarm leave script
        Before=shutdown.target reboot.target halt.target

        [Service]
        Type=oneshot
        RemainAfterExit=yes
        ExecStart=/bin/true
        ExecStop=/usr/bin/docker swarm leave

        [Install]
        WantedBy=multi-user.target
```

 

さて、このファイルを実際に起動時に渡すためには `ct` で変換したり、 newc 形式のアーカイブにしたりする必要があるのでやります。

```
$ mkdir usr/share/oem
$ ct < container-linux.config > usr/share/oem/raw.ign
$ find usr | cpio -o -H newc -O oem.cpio
$ gzip oem.cpio

```

結果的にでてきた oem.cpio.gz を以下のような感じに配置します。

```
/tftpboot
├── coreos
│   ├── coreos_production_pxe_image.cpio.gz
│   ├── coreos_production_pxe.vmlinuz
│   └── oem.cpio.gz
├── pxelinux.0
└── pxelinux.cfg
    └── default

```

 

また、 `pxelinux.cfg/default` も修正します。は以下のようになります。 `oem.cpio.gz` を読ませているのと、実際にそれを参照させている部分の2箇所です。

```
 
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
menu default
kernel coreos/coreos_production_pxe.vmlinuz
initrd coreos/coreos_production_pxe_image.cpio.gz,coreos/oem.cpio.gz
# append console=tty0 console=ttyS1 coreos.autologin=tty0
append coreos.first_boot=1 coreos.config.url=oem:///raw.ign

```

さて、起動させて見ましょう。マネージャ側で `docker node ls` とか叩けば分かると思います。
いい感じになりましたでしょうか?

あとは `docker service` コマンドでよしなにサービスを作ってやると、いい感じにロードバランスされたりヘルスチェックしたりライブアップデートできたりすると思います。
ポートの公開をすると、マネージャを含む全てのノードでそのポートが共有され、自動的にロードバランスされます。つまり、そのサービスのコンテナが動いていないノードにアクセスしても、内部のトンネル(VXLANです)を通ってコンテナへの疎通性が確保されます。

そのあたりは「docker swarm」とかでググると出ると思います。 `nginx` とかでも簡単にできますね。

ところでボリュームのマウントは癖があって、 bind なんかは各ノードのローカルファイルシステムを参照します。なので、そういったことをしたい時はよしなにやりましょう。 `nfs` とかを検証できると良いですね。

ちなみに再起動したりするとどんどん死んでるノードが一覧に増えますが気にしないでください。気になる時は `docker node rm` で消しましょう。以下がワンライナーです。

```
 
docker node ls | tail -n+2 | grep Down | cut -d' ' -f1 | xargs -r docker node rm"

```

さて、今回は簡単に Docker Swarm を用いたクラスタの構築をしてみましたが、実際により大きい規模でやろうとすると Kubernetes や DC/OS (Mesos, Marathon) なども候補に入るかと思います。
そちらについてもやっていきましょう。

ところで Docker / CoreOS をプロダクションでバリバリ使うサービスに興味のある方向けに、 [こんな求人](https://www.sakura.ad.jp/recruit/entry/career_29.html)や[こんな募集](https://www.wantedly.com/projects/23766)があります。もしご興味ありましたら Twitter 等でも良いのでお声掛けください。

では皆様、よいコンテナライフを!
