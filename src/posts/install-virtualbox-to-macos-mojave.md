---
title: "macOS Mojave へ VirtualBox をインストールする"
date: 2018-12-23T03:27:00+09:00
slug: "install-virtualbox-to-macos-mojave"
categories:
  - slug: "software"
    label: "Software"
  - slug: "雑記"
    label: "雑記"
post_tags:
  - slug: "macos"
    label: "macOS"
  - slug: "virtualbox"
    label: "VirtualBox"
  - slug: "トラブルシューティング"
    label: "トラブルシューティング"
---
---

月末金曜日なので研究から逃げようとしたところハマってしまった。タイトルからしてmacOS初心者感がつよい。

環境は macOS Mojave (10.14.1), Oracle VM VirtualBox のバージョンは 6.0.0 (5.2.22 でも再現)

[caption id="attachment_1920" align="aligncenter" width="620"]

![](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/failed_to_install_virtualbox.png)

 macOS へ VirtualBox のインストールを試行してエラーになっている様子[/caption]

以下、解決方法


結論から言うと「システム環境設定」-「セキュリティとプライバシー」-「一般」-「ダウンロードしたアプリケーションの実行許可」 で Oracle America, Inc かそれっぽいのを許可する。既に許可してしまったのでボタンが消えているが下の図の枠で囲った位置にボタンが出てくる。

![](https://pub-ceba25df58934fa492f19ecc3b50020e.r2.dev/approve_installing.png)

それっぽいエラーを何もユーザーへ提示せずに死ぬのでハマった。ちなみに macOS のインストーラはエラーログとかを `/var/log/install.log` に吐くのでそれを見ると何で落ちたのかは分かる。

```
installd[400]: PackageKit: ----- Begin install -----
...
installd[400]: ./postflight: /Library/Application Support/VirtualBox/VBoxDrv.kext failed to load - (libkern/kext) system policy prevents loading; check the system/kernel logs for errors or try kextutil(8).
...
Installer[9779]: Install failed: エラーによってインストールできませんでした。ソフトウェアの製造元に問い合わせてください。
```

ところで結局これでWindowsを起動したところで目的は達成できずに負けました。完全敗北
