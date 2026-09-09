---
title: "SECCON 2015 Online CTF に参加しました (Write-up)"
date: 2015-12-07T02:56:00+09:00
slug: "seccon-2015-online-ctf-write-up"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "ctf"
    label: "CTF"
---
---

CTF 完全初心者なのになぜか SECCON 2015 九州大会「Attack & Defense」 というオンサイトCTFへ参加し、 -163125 点を獲得した kyontan です。
その節は本当に申し訳ありませんでした。関係各位へお詫び申し上げます。

> 15:57:20 MMA(kyontan) got -163215 points from ....
> 
> [http://pastebin.com/KTqNZ4Jf](http://pastebin.com/KTqNZ4Jf)

さて、今回は人生2回目のCTF大会である、SECCON  2015 Online CTF へ、学校の同級生である h-otter / @hogextend と共にチーム overflow として参加しました。

最終順位は 1200点 147位 でした。初心者なりには良くできたのではないでしょうか…… ([http://score.quals.seccon.jp](http://score.quals.seccon.jp))

![seccon2015-ranking](https://media.monora.me/seccon2015-ranking.png)


自分が解いたのは、以下の通りです

- SECCON WARS 2015 (100)
何かQRコードが見えるなという感じだったので、良く分からないままにとりあえず動画をダウンロードし、適当にQRが見えている部分のスクリーンショットをVLCで17枚ほど取って、ImageMagick で比較(明) 合成してみたら解けた。
(参考: [http://d-poppo.nazo.cc/blog/2014/04/imagemagick/](http://d-poppo.nazo.cc/blog/2014/04/imagemagick/))

- Unzip the file (100)
既知ファイル2個を h-otter が見つけたものの、既知ファイルを圧縮したものを引数に与えるのを忘れていたっぽいので渡してみたら解けた。

- Reverse-Engineering Android APK 1 (100)
一番苦戦しました。
apk を逆アセンブルしてソースを除いたら native で libcalc.so の `calc()` を呼んでいるところまでは分かったものの、どうやって呼ぶかと……
x86 やら armeabi-v7a の so があったので、Raspberry Pi でビルドしてみたりするものの上手くいかず、結局 Android Studio を入れてアプリケーションを1から作って解くというかなりつらい解き方をした。
他の人の Write-up を見た感じだと、`calc()` のバイナリを読めば 7 を返すことが一瞬で分かったらしい。なるほどつらい

- Exec dmesg (300)
問題の zip を展開したら iso があったのでとりあえず VirtualBox で起動。
Tiny Core Linux なるものが起動するも、 `dmesg` コマンドがなくて怒られる。調べてみたら busybox 使ってることが分かったので、フルバイナリ落とせば行けるやろ! と busybox のバイナリを wget で落としてきて `dmesg` を叩いて終わり。
300点……? という感じのさっくり感でした。うーん……

- Last Challenge (50)
換字式暗号です!! 1問目でハッシュのキーとバリューを逆向きに作るとかいう凡ミスをやらかしている間に h-otter に解かれましたが、今度はちゃんと解けました。

QR puzzle (Nonogram) についてはソルバを持って来たりパーサでごにょごにょしたりして数時間粘るものの ソルバの精度が低い && QRコードの認識精度が低い という二重苦に苦しめられ、最終的に全操作を自動化して寝て数時間放置するも、2000回 問題を試行して最大正解数が 22/30 とかいうことになっていたので完全に敗北しました。つらい

その他の感想としては、 h-otter が割と色々やってくれて強いな―って思ったみたいなのがあります。
あと、@hogextend が QR puzzle (Windows) を手動で300問 9パズルを解いてフラグを得ていたのが印象的でした。お疲れ様でした。

初めてにしては頑張ったと思っていますが、同じサークルの先輩方のチームには完全敗北を喫したので頑張っていきたい。最強のQRソルバがあるんだよ〜〜などと言われまして、それは何処に……という感じです。
