---
title: "Cisco IOS で tftp を使ったアップロードが Permission denied で怒られる件"
date: 2020-05-13T16:52:00+09:00
slug: "permission-denied-during-tftp-upload-from-cisco-ios"
categories:
  - slug: "infrastructure"
    label: "Infrastructure"
post_tags:
  - slug: "cisco-ios"
    label: "Cisco IOS"
  - slug: "network"
    label: "Network"
  - slug: "tftpd"
    label: "tftpd"
---
---

家の回線をv6プラスにしたところ、外側から特定のポートへアクセスさせたいような用途、つまりこのブログを自宅サーバーから提供することができないことに変更してから気が付いた。
しばらくは FreeBSD で PPPoE を終端して遊んでいたが、うっかりご家庭用のルータであるところの Cisco C891FJを買ってしまった。

とりあえずIOSのバックアップをすべく `copy` コマンドで自宅のサーバへ IOS をアップロードしようとした。しかし、Permission denied と怒られてアップロードに成功しなかった。

tftp (具体的には tftpd-hpa) サーバでの `tftp 127.0.0.1` によるアップロード/ダウンロードはできる。何かがおかしい……



### 状況を整理

tftpd は `0.0.0.0:69/udp` で listen している。 (`systemctl start` で動かない問題もあったが、それはまた別の問題)

```
# sudo lsof -i:69
COMMAND    PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
in.tftpd 29780 root    4u  IPv4 xxxxxxx      0t0  UDP *:tftp
in.tftpd 29780 root    5u  IPv6 xxxxxxx      0t0  UDP *:tftp

```

tftpd root は `/srv/tftpboot`。こういう挙動をする。

```
# tftp 127.0.0.1
tftp> get something
Error code 2: Only absolute filenames allowed
tftp> get /something
Error code 2: Forbidden directory
tftp> get /srv/tftpboot/something
Received 7 bytes in 0.0 seconds

```

IOSでのエラーメッセージはこんな感じ。tftpd は verbose フラグを付けてもだんまり。

```
#copy flash:c800-universalk9-mz.SPA.153-3.M3.bin tftp://10.0.0.1/srv/tftpboot/ios/
Address or name of remote host [10.0.0.1]?
Destination filename [srv/tftpboot/ios/c800-universalk9-mz.SPA.153-3.M3.bin]?
%Error opening tftp://10.0.0.1/srv/tftpboot/ios/c800-universalk9-mz.SPA.153-3.M3.bin (Permission denied)

```

なるほど……?

### 解決方法

ホスト名とパスの間にもう1つ `/` を足せばよい。つまり `tftp://[ホスト名]`**/**`/パス` とすればよい。

```
#copy flash:c800-universalk9-mz.SPA.153-3.M3.bin tftp://10.0.0.1//srv/tftpboot/ios/
Address or name of remote host [10.0.0.1]?
Destination filename [/srv/tftpboot/ios/c800-universalk9-mz.SPA.153-3.M3.bin]?
!!!!!!!!!!!!!!(snip)!!
68176296 bytes copied in 129.832 secs (525112 bytes/sec)

```

気付いたきっかけは Destination filename の確認プロンプトだが、まさかこんなところでハマるとは思わなかった。
自宅インフラはトラブルシューティングが99%

<span id="more-permission-denied-during-tftp-upload-from-cisco-ios"></span>

最近はご家庭用の Wi-Fi AP であるところの Meraki Go も導入したが、こちらはコンソールに入る必要がないどころかそもそもコンソールポートが存在しない。
なんならインターネットに接続しないと初期セットアップすらできないし、Web設定画面はおまけでメインの設定は iOS / Android アプリから行うハイテク仕様。これがクラウドネイティブアクセスポイントってやつか〜

必要十分に高速で、かつ最高に安定している。おすすめです。

 


