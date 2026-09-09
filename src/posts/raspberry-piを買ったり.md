---
title: "Raspberry Piを買ったり"
date: 2012-12-11T23:08:00+09:00
slug: "raspberry-piを買ったり"
categories:
  - slug: "雑記"
    label: "雑記"
post_tags:
  - slug: "raspberry-pi"
    label: "Raspberry Pi"
---
---

最近、巷で話題のRaspberry Piというものを買いました。
簡単にいえば約3000円のクレジットカードサイズのPCだそうです。



![](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/IMG_0603.jpg)


日本からだと下のリンクから買えるそうです。

[http://jp.rs-online.com/web/p/products/7568308/?
](http://jp.rs-online.com/web/p/products/7568308/?)今回は [@mactkg](https://twitter.com/mactkg) 先輩が送料無料にするべく購入者を集めていたので便乗させて頂きました。

CPUがARMアーキテクチャなのでどんなOSでも動くわけではないですが、公式ではDebianとArchが公開されてました。
他にもFreeBSDや、Androidも動くらしい！
とりあえず幾つかのサイトを参考にして(友人のステマが激しい)Arch Linuxを導入してみました。
[Raspberry Pi | Arch Linux ARM](http://archlinuxarm.org/platforms/armv6/raspberry-pi)[ArchLinux Install Guide - eLinux.org
](http://elinux.org/ArchLinux_Install_Guide)

![](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/IMG_0607.jpg)

ケーブルを接続してみた。画面出力はHDMIとコンポジットがありますが、HDMIが使えるモニタがなかったのでコンポジットに。
コンポジットが使えるモニタもないのですが、何故か[GV-USB](http://www.iodata.jp/product/av/capture/gv-usb/)があったのでそれでPCに取り込むことに。SSHでもいいみたい。

電源はMicroUSB端子です。700mAらしいので普通のPCだと足りないかも……？ACアダプタを買った方がいいかもしれません。
僕はMacBook AirのUSB端子で試しましたが、確かMBAは1A出せたはずなので普通に使えました。
電源ケーブルを差し込むと勝手に電源が入ります。


![](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/IMG_0606.jpg)


Arch Linuxでは初期状態でID:root, PASS:rootらしいのでログインして、キーボード配列を日本語配列に。

```

$ loadkeys jp106

```

次回起動時に自動的に読み込まれるよう/etc/rc.confにこんな感じで(なかったら作成する
`KEYMAP="jp106"
`あとはパーティションの設定をして、普通に使うのみ？(本当はスワップとか設定するべきところなんだろうけども……
[Arc Linux で SD Card の余り領域を使えるようにする - Debian GNU/Linux 3.1 on PowerMac G4
](http://d.hatena.ne.jp/paraches/20121015/1350308852) 

とりあえずここまでです。Rubyが普通に動いたので何か出来たら面白いなぁ……と
