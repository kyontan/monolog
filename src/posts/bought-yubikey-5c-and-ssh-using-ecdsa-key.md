---
title: "YubiKey 5C を買ったので ECDSA鍵で ssh した"
date: 2019-04-19T01:38:00+09:00
slug: "bought-yubikey-5c-and-ssh-using-ecdsa-key"
categories:
  - slug: "infrastructure"
    label: "Infrastructure"
  - slug: "software"
    label: "Software"
post_tags:
  - slug: "macos"
    label: "macOS"
  - slug: "openssh"
    label: "OpenSSH"
  - slug: "yubikey"
    label: "YubiKey"
---
---

こんにちは。唐突に YubiKey が欲しくなったので買いました。こんなことをやっている場合ではない……

正確には、Amazon.co.jp を見たら異常に高くてそりゃ転売したら儲かるな、という気持ちになったので、適当に人を募って Amazon.com (US) で共同購入しました。
関税や送料を足した結果、YubiKey 5 NFC が5500円, YubiKey 5C が6100円ぐらいで買えました。良かったですね。

YubiKey といえばそもそも OTP が出てくるキーボードとして認識されるデバイスですが、最近だと WebAuthn で使えたりしますね。あとは PKCS#11 の署名用や適当な鍵を登録できたりします。

雑に手元の macOS でssh するぞ、と思ったら地味にハマってしまったのでいろいろやった結果動くようになったのでメモ

手順だけ分かればおっけー！という方は Gist にパッチ等まとめたので、そちらを参照してください: [https://gist.github.com/kyontan/763952e7be68a2e96d5c3f0ad0d3bce8

](https://gist.github.com/kyontan/763952e7be68a2e96d5c3f0ad0d3bce8)検証環境のバージョンは macOS Mojave 10.14.4 で、OpenSSH は 7.9p1, LibreSSL 2.7.3 が入っていました。
ただ、今回は最終的に OpenSSH と OpenSSL は自前でビルドしたのであまり関係ありません。
より重要そうな Homebrew でインストールしたパッケージのバージョンは、 OpenSSH 7.9p1, OpenSSL 1.0.2r (26 Feb 2019), OpenSC 0.19.0 です。

まず、下記の記事などを参考に鍵の生成を試みます。

> Putty CAC で SSH に YubiKey を使う(OpenSC編) - enjoy struggling
> [https://blog.haniyama.com/2018/02/02/yubikey-ssh-opensc/](https://blog.haniyama.com/2018/02/02/yubikey-ssh-opensc/)

GUI のツール (YubiKey PIV Manager) の場合は PIN を設定すると自動的に Authentication と Key Management 用の鍵を生成してくれます。現代だとデフォルトで `ecdsa-sha2-nistp256` の鍵が生成されるんですね。便利。

## 公開鍵を取り出そうとした

YubiKey へのアクセスや署名(でよいのでしょうか?) にはスマートカード等で使う OpenSC を使用するようです。今回は Homebrew でインストールしました。 (`brew install opensc`)

早速試してみます。まずは上の

```
# ssh-keygen -D /usr/local/Cellar/opensc/0.19.0/lib/opensc-pkcs11.so
C_GetAttributeValue failed: 18
C_GetAttributeValue failed: 18
cannot read public key from pkcs11
```

うまく行きませんね。(上手く行った場合はこの記事を読む必要はありません。最後のステップまで飛ばしてください。

## パッチを当てる

エラー文でググると偉大な先達の記事が出てきます。今回この記事がなかったら即死していたでしょう。

> ssh with yubikey ECDSA keys - lithium03の物置
> [https://lithium03.info/yubikey/index.html](https://lithium03.info/yubikey/index.html)

この記事を読むと、「RSA鍵なら問題なくいける」「OpenSSH が OpenSC を使うときに (具体的には PKCS#11 の署名等で) ECDSA鍵に対応できてない」ということが分かります。

親切にパッチや、そのパッチの元になったチケットまでリンクがあります。

> 2474 – Enabling ECDSA in PKCS#11 support for ssh-agent
> [https://bugzilla.mindrot.org/show_bug.cgi?id=2474](https://bugzilla.mindrot.org/show_bug.cgi?id=2474)

このチケットを見ると、Fedora 28 では既にこのパッチがバックポートされていること、upstream には OpenSSH 8.0 でマージされる予定であることが分かります。

ちなみにパッチは OpenSSH 7.6p1 用で、上の記事では 7.8p1 用に書き換えられたものが公開されていますが、現時点の Homebrew でインストール可能なのは 7.9p1 ということで、パッチを修正しました。

というわけでパッチです: [https://gist.github.com/kyontan/763952e7be68a2e96d5c3f0ad0d3bce8](https://gist.github.com/kyontan/763952e7be68a2e96d5c3f0ad0d3bce8)

## ビルドする

Homebrew でパッチとかどうやるんだ……と思いましたが、どうやら `brew edit openssh` で行けるみたいです。こんなに簡単に当てられるなんて……便利だ……

> Homebrew: Patching an existing package
> [https://www.ralfebert.de/snippets/brew-apply-patch-to-package-formula/](https://www.ralfebert.de/snippets/brew-apply-patch-to-package-formula/)

というわけで雑に既に書かれている `patch` の下に、以下のように追記してやるとパッチが当たります。

```
# Add support ECDSA for PKCS11, ref: https://bugzilla.mindrot.org/show_bug.cgi?id=2474
patch do
  url "https://gist.githubusercontent.com/kyontan/763952e7be68a2e96d5c3f0ad0d3bce8/raw/2ad5f854eba7704fbb7af2182ac57ee82b9a8f61/openssh-7.9p1-pkcs11-ecdsa.patch"
  sha256 "93b4e48321db94d785833a9414b12467a4741156cec90fa3052a4092acec8938"
end
```

 

インストールは `brew install --build-from-source openssh` です。既にインストールしてあるものがある人は `install` を `reinstall` に読み替えてください。

ビルドできたら、ビルドした ssh や ssh-keygen のパスをよしなに通してやります。勝手に通ってるかもしれません。(`rehash` なりしてから `ssh -V` の結果を見るとかすれば分かると思います)

うおおおおお！！！！

```
# ssh-keygen -D /usr/local/Cellar/opensc/{version}/lib/opensc-pkcs11.so
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBDnIbZ4ANu...
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBv0e8HKnx...

```

というわけで公開鍵が見られました。2つ見えたのは、上で自動的に作られると行っていた Authentication と Key Management 用の鍵がどちらも見えてるからだと思います。普通は上の方を使えば良いはずです。

鍵を登録して、`ssh` していきます。 `ssh -I /usr/local/Cellar/opensc/{version}/lib/opensc-pkcs11.so host` です。

```
# ssh -v -I /usr/local/Cellar/opensc/0.19.0/lib/opensc-pkcs11.so user@xxx.monora.me
OpenSSH_7.9p1, OpenSSL 1.0.2r  26 Feb 2019
...
debug1: Connection established.
debug1: provider /.../opensc-pkcs11.so: manufacturerID <OpenSC Project> cryptokiVersion 2.20 libraryDescription <OpenSC smartcard framework> libraryVersion 0.19
debug1: provider /.../opensc-pkcs11.so slot 0: label <Yubico PIV Authentication> manufacturerID <piv_II> model <PKCS#15 emulate> serial <...> flags 0x40d
debug1: have 1 keys
debug1: have 2 keys
...
debug1: Will attempt key: /.../opensc-pkcs11.so ECDSA SHA256:nr/MvmFI6cYmChV97dMVIBeE2Uq5UmhVvoIdIuayLvg token
debug1: Will attempt key: /.../opensc-pkcs11.so ECDSA SHA256:Z7dluZC4FCEsUAC0HYiITr5+I83bLtHUxOwdla81Rtc token
...
debug1: Authentications that can continue: publickey,password
debug1: Next authentication method: publickey
debug1: Offering public key: /.../opensc-pkcs11.so ECDSA SHA256:nr/MvmFI6cYmChV97dMVIBeE2Uq5UmhVvoIdIuayLvg token
debug1: Server accepts key: /.../opensc-pkcs11.so ECDSA SHA256:nr/MvmFI6cYmChV97dMVIBeE2Uq5UmhVvoIdIuayLvg token
Enter PIN for 'Yubico PIV Authentication':
debug1: Authentication succeeded (publickey).
Authenticated to xxx.monora.me ([xxx.yyy.zzz.www]:22).
...
# sl
...

```

というわけで ssh 出来ました。嬉しいですね。

パッチを見て当ててみたらエラーが出た瞬間にやる気をなくして、うだうだやっていたら3時間ぐらい掛かってしまいましたが、なんとか動いてよかったです。

それでは皆さまもハッピーYubiKeyライフをお過ごしください！
