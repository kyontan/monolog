---
title: "tmux でも Touch ID で sudo を使う"
date: 2018-11-15T22:50:00+09:00
slug: "use-touch-id-for-sudo-in-tmux"
categories:
  - slug: "software"
    label: "Software"
  - slug: "お役立ち情報"
    label: "お役立ち情報"
post_tags:
  - slug: "macos"
    label: "macOS"
  - slug: "touch-id"
    label: "Touch ID"
---
---

Touch ID が搭載された MacBook Air を買いました。MacBook Air に欲しかった機能の8つ中8つが実現されたので買いました。1つ10点としたら10^8 で1億点だね、という話をしたら首を傾げられました。

Touch ID が `sudo` でもパスワードを入力する代わりに使えそうだな、と思ったので調べてみたらどうやら `pam_tid.so` という PAMモジュールが用意されており、コンフィグを弄ることで使えるようです。具体的には `/etc/pam.d/sudo` へ `auth sufficient pam_tid.so` を追記するだけです。簡単ですね。

しかし、tmux のようなターミナルマルチプレクサを使用している場合にはこれだけではうまく動作せず、`sudo`コマンドを用いても普通にパスワードを求められてしまいます。
(これは各ユーザごとに存在する bootstrap namespace に tmux が存在しないこと? が原因のようです。詳しくは当該リポジトリに説明と詳細へのリンクがあります。)

これに対処するために pam_reattach という PAMモジュールを書いた人がいて、これが使えます。

> [fabianishere/pam_reattach: A pluggable authentication module that reattaches to the user's GUI (Aqua) session on macOS](https://github.com/fabianishere/pam_reattach)

[参考にした元の記事](https://blog.birkhoff.me/make-sudo-authenticate-with-touch-id-in-a-tmux/)やこのリポジトリの README.md には何事もなく以下のようにやれば入ると書いてありますが、これは失敗します。

`$ cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr
``$ make
``$ sudo make install
`これは最近の macOS の保護機能の1つである System Integrity Protection が有効になっているためで、rootであっても `/` 配下のほとんどが書き込み不可能になっています。つまり `/usr/lib/pam` にビルドされた `pam_reattach.so` をコピーすることができず失敗します。
多分これを開発するような人は無効にしてるんじゃないでしょうか……

実は`/usr/lib/pam` は `/usr/local/lib/pam`で代替できます。というわけでそうします。具体的には以下のように PREFIX を変えるだけです。

`$ cmake -DCMAKE_INSTALL_PREFIX:PATH=`**`/usr/local`**`$ make
``$ sudo make install
`それではよい tmux life をお過ごしください。
