---
title: "DigitalArts プログラミングコンテスト2012に参加しました!"
date: 2012-11-24T21:47:00+09:00
slug: "digitalarts-プログラミングコンテスト2012に参加しました"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "プログラミングコンテスト"
    label: "プログラミングコンテスト"
---
---

タイトルの通りです。
[DigitalArts Programming Contest 2012
](http://www.daj.jp/company/recruit/contest/)なんとかA, B問題を解くことが出来ました。流れはこんな感じ。

http://twitter.com/kyonfuee/status/272311520388591616

長いでんがな……
C問題は解けなかったです。時間足らず。

今回は初のRubyで挑戦してみました。getsとsplitとchompでどうにかなりそう？とか思いつつ、ARCで他人のRuby解答を見よう見まねでやってました。



#### 提出コード

[A - C-Filter](http://digitalarts2012.contest.atcoder.jp/tasks/digitalarts_1)見た瞬間に正規表現で解けそうだと思ったのでそのまんま。
/aaa/だと"aaaa"にマッチしてしまうので、/^aaa$/にするようにして解決

```
#!/usr/bin/ruby -Ku
input = gets.split

ng = []
num = gets.to_i
num.times { ng < < gets.chomp }

ng.map!{|v| v = Regexp.new("^" + v.gsub("*", ".") + "$")}
ng.each{|n| input.map!{|i| i =~ n ? i = "*" * i.length : i}}

input.length.times.each {|n| print input[n]; print " " if n != input.length}
puts

```

298Bytes(提出時から若干変更あり)

[B - Password
](http://digitalarts2012.contest.atcoder.jp/tasks/digitalarts_2)[最初は簡潔なコードにして書いていたつもりが、前述の通りひたすらにA問題に提出してWAを返されていたので焦りながら修正していたらこんなありさまに…
](http://digitalarts2012.contest.atcoder.jp/tasks/digitalarts_2)[でも最後のこのコードしか通らなかったり。本当に良く分からないミラクル。
](http://digitalarts2012.contest.atcoder.jp/tasks/digitalarts_2)Rubyではchar ⇒ intは "a".ord, int => charは 96.chr みたいにやるらしい。へえ
というのを利用して、後は普通のC言語でやるような感じで解いた。

後半のif out == input 以降が若干キモ？のようです。
入力が"b"の時に"aa"を返したり、"zz"のときに"yza"を返すようにしてます。

```
#!/usr/bin/ruby -Ku

hash = 0
input = gets.chomp
input.each_char {|s| hash += s.ord - 96}

if hash == 520 || hash == 1 #a, zzzzzzzzzzzzzzzzzzzz
  puts "NO"
  exit
end

out = ""
out += "z" * (hash / 26)
out += ((hash % 26) + 96).chr unless (hash % 26) == 0

if out == input
  if hash < 26
    out = "a"
    out += (hash - 1 + 96).chr
  else
    out = "y"
    hash -= 25
    out += "z" * (hash / 26)
    out += ((hash % 26) + 96).chr unless (hash % 26) == 0
  end
end

puts out

```

484Bytes

#### 総評
もう少し落ち着いたほうがいいと思う(4度の提出ミスに対して
後はC言語みたいなコンパイラ言語が書けなくなってるくさいので、またそっちも書かないといけないような……
そういえばJOI予選も控えてますし…(PCKはあと1問が5分という所で予選落ち)

そして結構謎なのが、表彰式(1問以上解いたら参加出来る)の開始が12/3(月)の16時からということ。
平日の16時とか参加出来る人が限られそうです……

かくいう僕も地理的には近いけれども時間的に無理ゲなので遅刻の旨を伝えた上で良さげなら参加します。

#### (どうでも)いいこと

[12/22 プログラミング生放送勉強会 第19回＠品川 参加受付中！ #pronama « プログラミング生放送](http://pronama.wordpress.com/2012/11/23/pronama-1-at-shinagawa/)参加するよ！
[第12回 日本情報オリンピック](http://www.ioi-jp.org/joi/2012/top.html)予選参加しますよ！

以上
