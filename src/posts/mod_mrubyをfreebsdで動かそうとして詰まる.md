---
title: "mod_mrubyをFreeBSDで動かそうとして詰まる"
date: 2012-12-21T20:37:00+09:00
slug: "mod_mrubyをfreebsdで動かそうとして詰まる"
categories:
  - "FreeBSD"
  - "Programming"
post_tags:
  - "mruby Apache mod_mruby"
---

CombConfの発表が2日後に迫っているにも関わらず他の技術に手がでます。

組み込み向けのRubyである[mruby](https://github.com/mruby/mruby)をApacheに組み込めるようにした、[mod_mruby](https://github.com/matsumoto-r/mod_mruby)というものをFreeBSDで動かしてみようかと思って手を出したら大苦戦しました。

とりあえず動いたには動いたという状況ですが、簡単なメモとベンチマークを取ってみました。

> **2013/2/17追記**mod_mrubyの更新によって手順が変わりました⇒ [mod_mruby on FreeBSD](/2013/02/mod_mruby-on-freebsd/)

導入はmod_mrubyのページと同じようにやればいいのかと思いきや、makeでエラーを吐いてしまいます。

```

$ make
make: illegal option -- -
usage: make [-BPSXeiknpqrstv] [-C directory] [-D variable]
        [-d flags] [-E variable] [-f makefile] [-I directory]
        [-j max_jobs] [-m directory] [-V variable]
        [variable=value] [target ...]
rake aborted!
Command failed with status (2): [make -C src --no-print-directory CC='gcc' ...]

Tasks: TOP => default => all
(See full trace by running task with --trace)
*** [libmruby.a] Error code 1

Stop in /root/mod_mruby.

```

どうもmrubyのRakefileがLinux向けのようで、makeをgmakeに書き換える必要があるようです。

```

$ nano tmp/mruby/Rakefile
#MAKE = ENV['MAKE'] || 'make'
MAKE = ENV['MAKE'] || 'gmake'

```

mrubyは1回mod_mrubyをmakeをしないとRakefileが存在しないので注意です。

あとはWarningが出ますがとりあえずスルーして、make installすればApacheにモジュールが登録されます。
あとはhttpd.confに、

```

AddHandler mruby-script .mrb

```

と書き加えれば普通にmrubyファイルが動くはずなのですが……

自分の環境(Freebsd 9.1-BETA1 amd64, Apache/2.2.23 Event MPM)な環境では、httpdを起動した直後からCPUをバカ食いする上、リクエストに全く応答しなくなるという状況に陥ってしまい、解決策が分からなくなりました。
そんなことをTwitterで呟いたら、mod_mrubyの作者である、[matsumoto-r](http://blog.matsumoto-r.jp/)さんから

http://twitter.com/matsumotory/status/282046980342022144

という指摘を頂きました。試しに(FreeBSD 9.0 i386, Apache/2.2.22 Prefork MPM)な旧サーバーで試したところ、何も問題がないかのように動きました。
どうもApache 2.2でEvent MPMをやるのはだめみたい……？


試しにどのくらい速いのか、mruby, FastCGIのRuby(mod_fcgid, 1.9.3p125), 静的ファイルの3つで比較してみました。

```

$ cat test.mrb
Apache.rputs("Hello")
Apache.return(Apache::OK)
#!/usr/local/bin/ruby

$ cat test.rb
print "Content-type: text/plainnn"
print "Hello!"

$ cat test.txt
Hello!

```

検証機のスペック: [IBM ThinkCentre 8086-AGJ](http://support.lenovo.com/ja_JP/detail.page?LegacyDocID=SYP0-03184BF)CPU: Celeron D 330 2.66GHz
RAM: DDR-SDRAM 1GB
LAN: Gigabit Ethernet(Intel chip)

abの条件は下記の通り

```

$ ab -n 100000 -c 100

```

結果:

- mruby

Time taken for tests: 108.551 seconds
Requests per second: **921.23 [#/sec]** (mean)
Time per request: 108.551 [ms] (mean)
Time per request: 1.086 [ms] (mean, across all concurrent requests)

- Ruby(FastCGI)

Time taken for tests: 362.996 seconds
**Failed requests: 109**Requests per second: **275.48 [#/sec]** (mean)
Time per request: 362.996 [ms] (mean)
Time per request: 3.630 [ms] (mean, across all concurrent requests)

- txt

Time taken for tests: 98.767 seconds
Requests per second: **1012.48 [#/sec]** (mean)
Time per request: 98.767 [ms] (mean)
Time per request: 0.988 [ms] (mean, across all concurrent requests)

なんとmrubyが静的ファイルに迫る速度を出してました。すごい……

ちなみにmrubyが動かなかった方のメインサーバー(Core2 duo E6300@1.86Ghz, RAM512MB)ではRuby(FastCGI: mod_fcgid)で1857.93 [#/sec]とかいう値を叩きだしてました。後日メインのサーバーの方もPreforkにして検証してみようかと思います。
いつになったらFreeBSD PortsにApache 2.4が来るのだろう……

そういえば、もう明後日に迫っていますが、[CombConf](http://combconf.com/)に参加します！
内容は、「HTTPSを使わずに暗号化通信をしよう」でやる予定です。
出来るの………？(まだ検証してない
