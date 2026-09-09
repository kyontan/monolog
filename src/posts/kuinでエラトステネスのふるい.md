---
title: "Kuinでエラトステネスのふるい"
date: 2012-08-27T01:54:00+09:00
slug: "kuinでエラトステネスのふるい"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "kuin"
    label: "Kuin"
---
---

Kuin0.02が公開されたので[エラトステネスのふるい](http://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%A9%E3%83%88%E3%82%B9%E3%83%86%E3%83%8D%E3%82%B9%E3%81%AE%E7%AF%A9)を使って素数を計算してみた。

Kuin0.02でコンパイル, 動作確認してます。

まだKuin用のシンタックスハイライトがない………

**constに関するコンパイルエラー、Kuin0.021で修正されました。くいなちゃんに感謝です。 (2012/8/27 22:55)**

```
{
  エラトステネスのふるい

  Author: きょんたん (@kyonline)
}

func Main()
  const N : int :: 10000000

  var isPrime : []bool :: @new [N]bool
  var Prime : []int :: @new [N]int
  var numPrime : int :: 0

  for i(0, N - 1)
    do isPrime[i] :: true
  end for

  do Prime[0] :: 2
  do numPrime :+ 1

  for i(3, N - 1, 2)
    if (!isPrime[(i - 1) / 2 - 1])
      continue i
    end if

    do isPrime[(i - 1) / 2 - 1] :: false
    do Prime[numPrime] :: i
    do numPrime :+ 1

    do Kuin@Dbg(i.ToStr())

    var j : int :: (i - 1) / 2 - 1 + i
    while (j < N)
      do isPrime[j] :: false
      do j :+ i
    end while

  end for

  do Kuin@Stop()
end func

```
