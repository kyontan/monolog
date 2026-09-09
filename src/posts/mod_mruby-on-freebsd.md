---
title: "mod_mruby on FreeBSD"
date: 2013-02-17T18:31:00+09:00
slug: "mod_mruby-on-freebsd"
categories:
  - slug: "freebsd"
    label: "FreeBSD"
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "mod_mruby"
    label: "mod_mruby"
---
---

[mod_mrubyをFreeBSDで動かそうとして詰まる](/2012/12/mod_mruby%e3%82%92freebsd%e3%81%a7%e5%8b%95%e3%81%8b%e3%81%9d%e3%81%86%e3%81%a8%e3%81%97%e3%81%a6%e8%a9%b0%e3%81%be%e3%82%8b/)の修正点が変わってしまったのと、mod_mrubyが更新されてEvent MPMとWorker MPMでも動くようになったようなので再チャレンジしてみました。

FreeBSDでのmakeのやり方がまた変わってしまったので後述します。
とりあえずベンチマークの結果から。

```

$ cat test.txt
Hello!

$ cat test.rb
#!/usr/local/bin/ruby

print "Content-type: text/plainnn"
print "Hello"

$ cat test.mrb
Apache.rputs("Hello")
Apache.return(Apache::OK)

```

検証機のスペック: IBM ThinkCentre A55 (9636-A16)
CPU: Core2 duo E6300@1.86GHz
RAM: DDR2-SDRAM 1GB
LAN: Broadcom Gigabit Ethernet
Apache/2.2.23 (FreeBSD), mod_fcgid/2.3.6

Varnish(3.0.3)がリバースプロキシとして動いているので参考値であることをご了承ください。

abの条件は前回と同じく下記の通りで、3回計測して平均を取っています。

```

$ ab -n 100000 -c 100

```

Typereq/sPlain Text6318.693Ruby 1.9.3p194(mod_fcgid)5159.423**mod_mruby****6700.153** ~~4626.193
~~~~な……何故か、FastCGIのrubyに負けてますが、このような結果となりました。~~

> 2013/2/17 21:15追記:
> mod_mrubyの作者である @matsumotory さんが[こんな事](https://twitter.com/matsumotory/status/303099603451015168)を仰っていたので最新版をビルドし直して再測定しました。は、速い…

mod_mrubyはApacheのモジュールとかを書くのに面白く使えそうなので、そちらの道を模索してみたいなぁ……と

FreeBSDでmod_mrubyを使うためには、またちょこっと弄る必要があるみたいです。

```

$ git submodule init && git submodule update
$ cd mruby

```

mruby本体のビルド設定に**-fPIC**を付ける。

```

$ nano tasks/toolchains/gcc.rake
4: cc.flags = [ENV['CFLAGS'] || %w(-g -O3 -Wall -Werror-implicit-function-declaration -fPIC)]

```

makeではなく**gmake**を使う。

```

$ rake
$ cd ..
$ ./configure
$ gmake && gmake install

```

この2点だけです。エラーが読めない人間には辛い……
もう httpd.conf が mod_mruby を読み込むよう設定されているはずなので、 Apache を再起動させれば終わりです。

```

$ httpd -k restart

```
