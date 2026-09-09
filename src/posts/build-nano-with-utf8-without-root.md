---
title: "non-root な環境で UTF-8 対応の nano をビルドする"
date: 2015-10-13T05:53:00+09:00
slug: "build-nano-with-utf8-without-root"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "gnu-nano"
    label: "GNU nano"
  - slug: "ubuntu"
    label: "Ubuntu"
---
---

Ubuntu なレンタルサーバーで、 `GNU nano` を使おうとしたらそもそも `nano` が入ってなくて、適当にソースを拾ってきて野良ビルドしたら日本語が打てなくてつらくなった。
つらくなったので、`--with-utf8` を付けてビルドしようとしたら、 `configure` で以下のエラーが出てつらくなって結構ハマったので備忘録。

```
*** UTF-8 support was requested, but insufficient UTF-8 support was
*** detected in your curses and/or C libraries. Please verify that your
*** slang was built with UTF-8 support or your curses was built with
*** wide character support, and that your C library was built with wide
*** character support.

```

これを non-root な環境で以下の方法にて解決した。
とてもシンプルではあるんだけど、 --enable-widec とか忘れるねん……

バージョンは執筆時点のものです。

```
$ wget http://www.nano-editor.org/dist/v2.4/nano-2.4.2.tar.gz
$ rm nano-2.4.2.tar.gz
$ cd nano-2.4.2
$ apt-get source libncursesw5
$ cd ncurses-5.9-20140118
$ ./configure --enable-widec --prefix=$HOME --with-shared
$ make
$ make install
$ cd ../nano-2.4.2
$ ./configure --prefix=$HOME --enable-color --enable-multibuffer --enable-nanorc --enable-utf8
$ make
$ make install

```

#### 追記 (2015/10/14)

http://twitter.com/yosida95/status/653926613772447745

とのことなので、Gehirn RS2 では non-root でも何もしなくても nano が使えるようになるらしい。ありがたい……。
