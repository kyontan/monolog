---
title: "lldbの使い方備忘録"
date: 2014-09-28T15:41:00+09:00
slug: "lldbの使い方備忘録"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "lldb"
    label: "lldb"
  - slug: "デバッガ"
    label: "デバッガ"
---
---

メモリ管理周りで色々ハマってたのだけど、普通にデバッガを使えばよかった。
Mac OSX だと、gdb より lldb を使う方が環境的に整ってて楽っぽい。LLVMさまさまだ。

> [LLDBの使い方（チュートリアル日本語訳） | こん](http://cont0f.net/2014-04-lldb-tutorial-ja/)

とりあえずここを読めばいいと思います。

以下は、上を読みながら実際にどのようにして作業を行ったかという流れのメモ。


まず、コンパイル時に -g オプションをつけてコンパイルすること
(これによって変数名や関数名のようなデバッグ情報が埋め込まれる)

```
$ pgrep a.out
```

なんかでプロセスのpidを取得して、

 

```
$ lldb -p [pid]
```

で対象プロセスにアタッチ

 

```
(lldb) breakpoint set -n malloc_error_break
```

とすると、mallocにまつわるエラーにブレークポイントがセットできる
(その他のブレークポイント等は元記事を参照)

これを叩いた時に、メインプロセスの実行が止まったら

```
(lldb) c
```

で再開出来る。(c は continue の省略コマンド)
で、実行すると、ブレークポイントで自動的に lldb がスタックトレースを吐いて止めてくれる。

 

```
(lldb) bt
```

でスタックトレースが表示できる (bt = thread backtrace)

 

```
(lldb) frame select [n]
```

で、n番目のフレームに移動出来る (btで表示した #n にあたるもの)

 

```
(lldb) frame variable
```

とすると、そのフレームから見える変数が表示できる。

 

```
(lldb) p [variable]
```

とかすると、 valiable の値が表示できる。
また、*, &, ->, [] みたいな演算子も使用可能

 

```
(lldb) expr (int)printf("hoge")
```

みたいにすると、 printf("hoge") の返り値を取得できる。
ただし、返り値のキャストが必須のよう
(普通にhogeと表示出来るらしいけれど、こちらの環境では上手くいかなかった)
