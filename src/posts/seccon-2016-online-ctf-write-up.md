---
title: "SECCON 2016 Online CTF に参加しました (Write-up)"
date: 2016-12-11T15:36:00+09:00
slug: "seccon-2016-online-ctf-write-up"
categories:
  - "Programming"
post_tags:
  - "CTF"
  - "MMA"
  - "参加しました"
---

なんか直前に参加しない? と誘われたので今年もYouTube問題担当として参加しました。Team MMA で 700 Points, Rank: 107 (国内: 27) だったっぽいです。(暫定?)
あと500 Points で国内予選でしたね。先は長い

MMA は大学のサークルですが、[前回](/2015/12/seccon-2015-online-ctf-write-up/)のチーム overflow +αみたいな感じでした。主要メンバーが運営にいるし、新たに入ってきた後輩はなぜか別チームでやっていたので、謎です。

僕は VoIP (Forensics 100), Memory Analysis(Forensics 100), PNG over Telegraph (Crypto 300) を解きました。とりあえずメモです。

### VoIP (Forensics 100)

pcap が振ってくるので、WireShark で開いて VoIPツールで再生して終わり。これICTSCでやったやつや……
`SECCON{9001IVR}`

### Memory Analysis(Forensics 100)


[Volatility](http://www.volatilityfoundation.org/) というツールを使えということだったのでその通り頑張ってみる。

`strings forensic_100.raw | grep http` をメモ
`./volatility_2.5_mac -f forensic_100.raw dumpfiles --dump-dir dumpdir -S summary.txt`summary.txt を見るとプロセスの絶対パスが取れて、怪しい svchost が分かる (PID1776)

```
$ ./volatility_2.5_mac -f forensic_100.raw pstree
(snip)
.... 0x81f65da0:svchost.exe 1776 672 2 23 2016-12-06 05:27:10 UTC+0000
..... 0x8225bda0:IEXPLORE.EXE 380 1776 22 385 2016-12-06 05:27:19 UTC+0000
...... 0x8229f7e8:IEXPLORE.EXE 1080 380 19 397 2016-12-06 05:27:21 UTC+0000
(snip)

```

プロセスツリーが取れて、 PID 1776 の子プロセスが分かる

```
$ ./volatility_2.5_mac -f forensic_100.raw connscan
Offset(P) Local Address Remote Address Pid
---------- ------------------------- ------------------------- ---
0x018c3cc8 192.168.88.131:1077 180.70.134.87:80 3676
0x0196f6a0 192.168.88.131:1122 175.126.170.70:80 3676
0x0233bbe8 192.168.88.131:1034 153.127.200.178:80 1080
0x02470238 192.168.88.131:1036 172.217.27.78:443 2776

```

PID 1080 がアクセスしてるのが `153.127.200.178` だと分かる

上の strings でアクセスしてた URL のドメイン部分を全部 `153.127.200.178` に変えて、curl

```
echo http://153.127.200.178/
curl -I http://153.127.200.178/ 2>/dev/null | head -1 | grep -v 404

```

こういうのを書き連ねて、 200 OK が返ってくるものを探す

```
(snip)
http://153.127.200.178/entry/Data-Science-import-pandas-as-pd
HTTP/1.1 200 OK
(snip)

```

後はアクセスして取ってきたファイルを開く

```
$ cat Data-Science-import-pandas-as-pd [/Users/kyontan/Code/ctf/2016online]
SECCON{_h3110_w3_h4ve_fun_w4rg4m3_}

```

### [PNG over Telegraph](https://www.youtube.com/watch?v=Y6voaURtKlM) (Crypto 300)

待っていました YouTube 問題、と思ったんですが、50分を超える動画で最初から心が折れる。
とりあえずダウンロードして、ffmpeg で 1fps で連番画像へ変換。

```
mkdir tower; ffmpeg -i SECCON\ TOWER\ 2016\ -\ YouTube.mp4 -vf fps=1 tower/out%04d.png
```

これ、最近授業でやった気がするなーと思いつつググルも、一般的な手旗信号ではないようで少し戸惑っていたら、 @f_dita 先輩が最初のデモから対応表を作っていたようなので拝借。

そもそもパターン数が26+αあって、コマ数がトータルで3000を超えていたので人間技で分けるのは無理だと判断し、ImageMagick でごにょごにょするも、動画内の棒がブレるわ、次第に少しずつカメラがずれている? やらで全く精度が出ず、ここまで3-4時間近く。

[caption id="attachment_1463" align="aligncenter" width="620"]

![分類器の様子](https://monora-monolog-media.1line.dev/semaphore_magick.png)

 ImageMagickで頑張って自動分類を試みていた形跡[/caption]

最終的に心が折れ、手動分類アシストツールを書きやっていくこととなります。
そのようにして、[160行のSinatraアプリケーション](https://gist.github.com/kyontan/f329c52ec12e52767e538e8c968d6000)がここに爆誕しました。HTMLを文字列として扱って結合する簡単仕様。
そして去年のごとく、突然 @hogas を呼び出し、ひたすら朝まで単純作業。

それに伴い少しずつ分類器の機能が向上され、再分類(間違えた画像のやり直し)や大分類(軸となる棒の向き)→小分類 などの仕組みが整いスピードアップ。

[caption id="attachment_1464" align="aligncenter" width="620"]

![手動分類の様子](https://monora-monolog-media.1line.dev/borns.png)

 二値化して見やすくしたら骨を分けている気持ちになれた[/caption]

これはSECCONではないと思いつつやるも、結局どのようにしてフラグを得たら良いのか分からず、更に混乱するなど。
問題文でPNGに戻せることが示唆されているので、何らかの方法で元に戻るはずですが、そもそも動画の冒頭で文字の対応が示されたのは20パターンほどに過ぎず、全部で何パターンあるのかも良く分からないままひたすら分類していきます。
最終的に32パターンになるのですが、途中で分類を誤ったりなんやかんやあった結果、36パターンの分類が完成し、Base36という誤った道を踏みそうに。答えは Base32 でした。

気合でバイナリに戻したら、馴染み深い IHDR の文字列が見えて感動しつつ、ここから更に間違えた分類画像100枚以上を探しつつ、気合でCRCを合わせて行きます。

最終的に、IHDR や PLTE, tRNS, pHYs, IEND 領域は CRC32 がマッチして、IDAT の inflate がチェックサムでコケるところまでは上手く戻せました。

```
input = "rfie3rynbinauaaaaagusscekiaaaaw5aaaafwqbamaaaabvebthaaaaaadfatcuiuaaaahzzzz5lwmz4uaaaaacorje3uzzzzellx1haaaaaclqjbmxgaaabmjaaaalcia2fxl1zqaaabwyjfcecvdyttw2uqms1i2ayrsrkvsqclbjlpxslmiavl5bus3zuqagz3xdt0oq15ci3kjuy0gjjknzzyjqobyha3dqobyha3dqobyhb3cpxdstrxdzt0zu1zzi5dwzc11jzvydx44gx2t0zfz3d4244rhdlcpir50u2mcaob1zrddyzj4bw11np1v02y5u1lcdrzjwouzjnzqobyb41geohcxsxdb3fdz3c0sejzsd2nbcye40jeapcdi3dt1g13gp2giw23z5jta0dfrt1ih55btxvmhxa3hqhzdpwdrl4whjsfrdqkzc2gljdeob0zdp1d55oe2uai1mnd4wxifhag344rpcm0rrbuha2pqr02i1dz2pd1bmbqobgzrhgrbqmzg00w12lpxgk1yn5c2obvnjwj4quha3pqjx2t2g1bmaq3rvpav5dmynuv2wlkuoppsrwidqodyl41hizwxhrl5lkz0ssvqdjwyzuvtev3k2dh05yha3d2zbdhljc1h4kj5ynk0100gw2xb5hz2jtuv2qobyg41gj2k3kl4jhftp2vfrr40fyme1l2vhc1dgzbpcnqgbyf41ewivxoh2pkn0qn5zpztpyllw33nzxoe2kqbhyda3cnzbepo3nylrfs0zjchnxcqyepu4krkupr1dqkbyh41evurfvlpar4ujdekpk34e1211lzzxacaob5zb5n5t0muzhmbs2urt2yr5524npkwukyot4z4xaiobyzbhtyzrj1okx5fv0g53voxfjfwqupsrj442n0ku0v4nyda3d2za4v0bvhnf5fpbv2lr3hvdndispkg5vi1byhatpyntgnwgusdvdnvh433x0rovk2r1lxzj0wi3dqohyi31nuunlupdqruvpo2gtp4lpzot4u2z053g3dqobg4qsfjvh1cz4jfy1kvg4u55givzw4acoobyzbdlyo21oo4wunlu5zmafr3tlqla0c0k4o5zwbihazpysw0wtz0feuyiyzznmxvk312gcpeyj4khmfy3dr1cwpvsvjt5mhl44404l4zuztj25ysxgf1vmmyldqohyl11yvxrlskky5fh02ncwlszjofoaffnleoiyha3d2zbzuvcoit5pxvqazyokxh1235ektpk3rd1tm4qibyh41cupelmkyzw40xl4t3omhlcvwmlwwq40zkf5klqodye4oekmt12pq5p2v3yh4dedtfui0pe5gu4fs1saeha2pqpc2u4gxeolww4j2lngsflw0xohl2byj1ayha4pymzf53hjbupoen5x4noc5beplaq4in2xb0ogq3dr1fz3o2ihvn0wxe34vlatswxkinpxmp5hxsomd55fqgbyf41g3kbgwk2ngbtfpupxwcndg3yzhkdaqdqpx3bmzgpntd4p0sfgwa441hppwmq2lsk2janbyhl3e1ptgpbdlnat2w21ukhm1kv4dpclpzp0p2vauob0zb4hsxvzi0gywexxzltim5ilmyvnrmwlk40hsly3q4xaadqpx3cvntfnn0ytnffkjc4x5trs44454sgucu4kx2m2byfa3d2zbshssd5wir0f13l14ln1xfcpe2w5j0d5rdnsda3dqjx3g3vdlk5xcjpcok1wypokpwgnlil4khjqkbyh41d5vruumwors0fu024zgkot100vjtrk34lx3ga3dv1cnlvhsmf1z5wutp0vkw2pwixvctl5j4iobypa4zrvkkch05giwwq4lmwqrf1ntwih21ly4fv1eiobyha4pylyyefx2tombpdl1lte5jlg3p0vilw5xmcla3dqnx3knm50tjlqnv12pwmz152ponnmafzs4iobyha4zrb4vtrlcxl20oqj54rxsuv5lrxcvdphm3dr1dgzqjp3otwo022qlrx0tlfiz3yfff4znfbyda3dp1eop2klbgoufqi2w3m5vqkyczlsjoagpxmuda3dqlx3dy020t0gde3vngk0d1u2vnkke1pnpf0a43kp3aha3dz1dwp2tvxklwknk55dlv2fbs135r0ix3pxbysdiob0zc44q1showz05sgn1moezliktgbku3lw55gmt3mo1ceobypaxlyx0mbl5ik1cl2oo4kdh40wwkxx5zoki1gbfyhb3fnxdmwqicfgdlzijcvkyvqz03h5yc31ev55ycxa3hqlx3n0qp5mxolk1nn4q1bwtkvmvtw22upeu5dqohys23m0lbxg04rx114zs3u31ehzki34jzihpotha3hpkbiha4pyu1xnmdt35ww31ht1f2epymzjf2x0phwwhamdqjx3ek1a54ufwoadzvikpo5iorjtplsm24eonyhb3dnzaef0m00jfmzvkatlu0xxdn0zpjueaaob5za4p23twus04k0ildq2nugd0dytpfsxgli22y1c33dr1cxpcgsax512lsmyq1h243s4kzmjmn3vtgayhazpyuj2yhgmv0nltaz01spccxf44kpn20mowlyodyh51h3kc2i43lddhvevviv1r4hqp5jkzkbtzvxqzlbi3dq1bg4yqr2gpw25vc4v3l4aan2xgx2zvxixhyobyg41eols0ong5koxbvretcf52ochl1nwbihazzqwpcif3ulfl3oixqvyulo5vky2ir45yag521jyha4pyplj3kmtoranly3wmn2mjoworm1wunnjcmx1adqobzzb4hvdqn3x5m1fzi3xnp4tm4y0ybhxfo5lfxyha3d2zbz15eaqobyha3dqobyha3dqobyhp3mz3apaujsxhmrfz0maaaaaacjivhejlscmcbaaaaaaaaaa"

s = "abcdefghijklmnopqrstuvwxy054321z"

x = [input.chars.map{|x| s.index(x) }.map{|x| ("00000" + x.to_s(2))[-5..-1] }.join].pack("B*")

# "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x02\xDA\x00\x00\x02\xDA\x01\x03\x00\x00\x005 fp\x00\x00\x00\x06PLTE\x00\x00\x00\xFF\xFF\xFF\xA5\xD9\x9F\xDD\x00\x00\x00\x02tRNS\xFF\xFF\xC8\xB5\xDF\xC7\x00\x00\x00\tpHYs\x00\x00\v\x12\x00\x00\v\x12\x01\xD2\xDD~\xFC\x00\x00\x06\xD8IDATx\x9C\xED\xDAA\x92\xF2:\fFQUe\x01,)[\xEF%\xB1\x00\xAA\xF4\x1AK\x9F\xA4\x00o\xF2\xE3\x9E]\x0FhH\xE2\x93Ld\xC9J\x9B\xFF\xE10ppppppppppppp\xF0O\xB8\xE58\xDC\x7F\x9E\x7FO\x7F\xE8\xD0\xED\xF1{\xC9\xFDp;\xEFf\xBFg\x9F\x97\xFC\x1E\xFB\xBD\xC4\xE3X\x9E\x88\xEB4\xEB\x04\a\a\xDF\x88\xC7\x8F\xA7a\xB7\xBC\xD7\xFA\xB9\xEE5O,C\x8F\xD3gS\xE9o\xE0\xE0\xE0;\xF1\x88\xE3\x8A\xF2\xB8\xC3\xC2\x8F\xFC\x16dD\xFEC\xEBB,\x13yI\x00\xF1\r\x1C\x1C\xFCop\xCF\xE9\x91n\xF3\xFAL\xC1\x91\x963\xF2\x0F\xAD\x06w\xAB\x0Fpp\xF0?\xC6\xFB\x0E+\xDD\x8E\x99\x16#\x82\xBE.\x99i\x19\x1C\x1C\xFCo\xF0\xF5\xA7\x13\xB4\x02<\xC6\x8Fv\xBA\np\e\x9B\xDC^&f1\r\x0E\x0E\xBE\x11\xCFQ\xE1\xFF\xAF\x1F\x82\xC0\xC1\xC17\xE2sD0g\xCD\x9C\xDB\xDD[\xEEe{\r\xD0\xBA\xE0\xD5\xA9\xB2w\n\x1C\x1C|\x13~\xCF\xA6\xF0X\br5x+\xA1\xB3\r\xA5{e\xAA\x8E{\xE5\e pp\xF0\xBD\xF8\xE8\xFD\xAEx\xAFKW\xF3)V\x03M\xB1\xFAVd\xAF\x15\xD1\x9F:\xC1\xC1\xC1\xF7\xE1\x19\xD6\x91x\xFBRu\x86\xAB>\xCEMn\xDC:?\xFA\x99\xD2\xBD\x83\x83\x83o\xC6OU\xC5/i9f\xFE\xD4\xB1\x8E\xF2\\0\x9E_jqxf\xF8^&\xC0\xC1\xC1w\xE2Y\x15\xBB\x8F\xD7\xA9\xB9\x83u\xF7\xFEo\xC2\xD7nq\xBF\xBB\x89\xD5@'\xC0\xC1\xC17\xE1#\xDD\xC6\xE1q,\xB3\xF4\x88\xED\xB8\xA1\x82>\x9BTUG\xC7\xC3\x82\x83\x83\xEF\xC4\xAD\"Z\xAD\xE0\x8E\xE8\x91\x91OW6Ow\xDE_\xFFp\b\x0E\x0E\xBE\x1D7S\xCB)\xF3\xB02\xED#>\xE2:\xD7v\xD7\xAA\xD4V\x1D=\xFFw\x02\x1C\x1C|'\x9E?\x14\xF9\xCA\xBE\x8B\\\x9B\\\xAB\xAET\x96\xD0\xA3\xE5\x14\xEF}nUL\xD7m\xC0\xC1\xC1\xF7\xE0\xDDr\x1A\x9D\xA5\xD1^\x1A\xF5q\xE1\xEA6\x8D\x12z\x8D\xAA\xA3\xC1\xC1\xC17\xE1\xB33ljHu\ej}\xF3\x97\xCC]Uv>]\xFE\x9C\xD9\x1C\x1C\x1C|#\x9Em(\xD5\xD1\xE3\x84iW\xBB\xA6\x9B\xF6\xB7\xFD\xD3\xDD;\xFC\xEB\x86\xE0\xE0\xE0\x9Bp\x91SS\xF8_\xDAK\x8F*\xA6\xDD5\xA3\"\xBF\xB6\xC0'88\xF8F\xBC;\xBEs\xB7j5t\xD7\xD8\x02\xC7\x93\\\x16\f\x8B*\xDB\xB5\xFB\x05\a\a\xDF\x89[6\x9F\xF2RS\b\xC7\xFE\xD6^\xAA\xE7\xBAa<\x98N\xD4v\x17\x1C\x1C|+>\xB2\xAAg\xA6\x1D{\xDE\xF3\xB5\xEF\xF4\xFC\xD3\xDDbW1}V3\v\x1C\x1C|/\xDE\xC5o\x15\xC9J\xC6\x8A|\xF5\xA2\xB2\xE5\xF4\xB8\xAE\x01J\xD5\x91\xC8\xC1\xC1\xC1\xF7\xE1\xFD*'\"z}\xEB\x00\x7F\x0EU\xCF\xEE\xF3DT\xDE\xAED~\x9B7\x04\a\a\xDF\x85G\x91lV?m\xE6\xEB\xDC\xF8\xE6\x1Db\xAD\x98\xBBZ\e\xCF\xD4])pp\xF0M\xB8\x8Ad\xFD\xD7\xC3O\xEDy\x83\xECd\x1C\xCBDe\xE4\xD1\xA9\xB2\xCB\xD2\x01\x0E\x0E\xBE\x0F\x17i\xB3\\\x8E]\xAD\xB4\xF5m4\x8A\xBBf\xEE:\xFA\x1C'\xC0\xC1\xC1\xB7\xE1\x9F.\xB8t\x86\x8Fq\e\xAB\xED\xAE\x16\x82G\xAC\x10\xDA\e\xDB\x87.488\xF8\xBF\xE3\xBA\x83\xD5\xB9\xB5\xC9\xCD\xD5`\x9C\xADu!\xAF\xBB\x1F\xA3\xDEN`\xF5\xA2\xC0\xC1\xC1w\xE3qA5\x95\xD6\x983+\xE8\xFB\xD8M\x19\xB9\x8F\x9DC\x04\a\a\xDF\x81g\xCC\xF6\xCC{~dSX\e\xDF\x8E\xF7\xD9\x90\xEA\xE4\xAE\xA4\r\x0E\x0E\xBE\x13\xCF\x99\x9E\x11\xAD\xA0\x9Fm\xDFQGg\x95]\x8D\xE2[\xFE\xFC\xBF\xB5\x05\x1C\x1C\xFC;<\xAF_\xA3&\xC5\x89{\xFDsC4\x85\xB3\x15lYe\xABy<\x97\x8ECw\x00\a\a\xDF\x82\xABfV\xB78\x9BJU$[\xBE\xA7\x19o{\xD6\xE4j\n\x9BU\xFA\xCE\x87\x05\a\a\xDF\x86G\x94\x87\xAB\"9/\xB8\xBFmm\xF5\xCA'\x93\xB6\xD2r=Dm\x90\xC1\xC1\xC17\xE1\xB9Q\xADZ\xB8\x92\xF19^\xB6\x1E\xE5>\xC6j\xD0\xBD\xA8\xE9\x82\x83\x83\xEF\xC3\xD5cJ2\xCE\x8C\xB2Zg\xBB\xF9\x94\xE9\xFB9\xAAg\x15sk\xBF\f\x0E\x0E\xBE\x13WS\xC9\x85\xF7\xF5jM\xF9\xAA\xAD\xD7\xD9\x17\xA8\xA6\xBD'hpp\xF0o\xF1\xAA\x94#\xE7FE\xAD\r\xAD\x96\x84K\xE6\xCE\xC8?|\xBCl\xB5\xF1\x10\xE0\xE0\xE0\xDB\xF0\xBC`\x85\xBFf\xE6\x05\xE3_\x972i+7\x1F\x9A\xA1v\xD5\xD8%\x83\x83\x83o\xC55\x9A\xCC\xD2\xB86\xBE\xEB\xEC\xCF\xFB]{\x9A\xD6\x00\xBF\x96\xD0\xE0\xE0\xE0\xDF\xE2\x1D\xD6qX\xAE\xBE\xE5\xD0N\xB7\e\xCA\x95\xD2\xE3qTo;88\xF8f\xFC\x12\xFE:vv{\xD8.7\xCC\xD6T\x7F\x98)K\xBF\xB4\xA1\xC0\xC1\xC1\xBF\xC4s\xFA\xA5\x84\xCE\xA1`\x8E\xDB\x8C\xD5`\xAC\v\xEB\x92\\\x03>\xEC\xA0\xC1\xC1\xC1w\xE0\xF1\x9E\xE6y0\xC9\xCA\xB4\xCA\xC8\xFDN\xD5\xAAQ<\xF6\xBC\xB9\x06\xF8\xA7\xF0\a\a\a\xFF\x0E\xCF\xEC\xEBu.\xCAj\xB5\xA1\xAE\xBD(e\xEEj9E\xF8\xFB\x87\x12\x1A\x1C\x1C\xFC[\xDC=#\xBA\xDF\xCE\xA4f\xF9\x8E'\xD6\x85L\xC1U8\xBBkFd\xF8\xC7xDpp\xF0]x\xBEX\x15\xE9\n\xF0\x97\xD7;j\x19\xF7\x9BYW\xBE\xBE\xE5#\xC6\tpp\xF0\xAD\xB8\xD9h E0\xD7\xF4$UV+\x0F\xE7\x87\xD6\x05\xCF\x12\xBA\xD6\x05pp\xF0]\xF8\xDC\xC1\xFAe\xDC\xB5y\xAD\xDC<\eMUegn\xF6\x8F%488\xF8\x97x\xCC\xAC76w\e\xFB\xDB\xFC\xB9Nx\x87\xFA\x91\xCD\xA7\xE8;\xDD3\x83\x87z\x82\x83\x83o\xC5=v\xB0s\xE6\xADnx\xF3\xF1zG\xE1\x9FI{|\xBC\xF6\xB1\xC0\xC1\xC17\xE1\x15\xE0kt-\x9C\x01\xFE\xA8S\xDD\xA4:)\x9B\xD7&wdspp\xF0m\xF8\b\\\xB39IY\xFA\xA8\x13]3{\x8D\xB9\xFB\xD3B\x00\x0E\x0E\xBE\r\xBF\xBC\x9D\xA9,\xEDYB\xC7\x0E\xB6\x86\x1EG\x89\xBC\xB2\xB9\x96\x8E\xF7\x1E\x1788\xF8Wx\x8D _^\xEA\xE4\xCCC\xC7\xEE\xF9-\xAB\xECK\e\xCA\xCC\xC0\xC1\xC1\xF7\xE2\x89\xEE\x0EfW-\\\xC1\xFC\xFAO\x10\xAE]\xEDOor\xC7Yxp\xF0}x\xFCP\xBA\x8D\xF1c\x19\xEAJ\xD5\x15\xF4vx?IW\xD4\x19\xFE\xB7\x87\xD6\x14pp\xF0M\xBCB=3\xED\xDDT[\xAF\x17\xB0\x01\xBD\xB9\xAF\xDF\xD6\xE8\xB9\xF0\xE0\xE0\xDB\xF1\x1C\xB9e\xCD6\x94\xEB\x86\xB1$\xC4]u\xC2:\xFC\xDB\x05\a\a\xFF\v<H/(\xB2\xAF\x8EE\xE1\\Qn\xD5U\x8E\xA2;\xD6\x00mw\xC9\xC1\xC1\xB7\xE1\xEBO\x14\xC9\xBA j\xF1\xCB1\xBDb]gE\x9E\xB5\x1A\xD4\x89\x97\xF0\a\a\a\xFF\x0E\xCFQ\xC1\xBC\xBE\x99\xE2\xFD\x1C\xBB_\xB9\xB3x\xCE\x02{\x95\xDAYo\x83\x83\x83\xEF\xC3\xFFh\x80\x83\x83\x83\x83\x83\x83\x83\x83\x83\x83\x83\x83\x83\xBF\x8C\xFF\x00\xF0Q2\xB9\xD9\x12\xFF,\x00\x00\x00\x00IEND\xAEB`\x82\x00\x00\x00\x00\x00\x00\x00"

```

圧縮の展開に失敗するため、普通の Preview.app などでは見ることができませんでしたが、とりあえず Chrome に投げたらある程度の断片が拾えて、QRコードだったので、なるほど〜といいつつ画像をチームチャットに投げたところ誰かのアプリが良い感じに読んでくれました。

```
SECCON{SEMAPHORE_LINE_IS_THE_1ST_TELEGRAPH_SYSTEM_IN_THE_WORLD}
```

7番目ぐらいに解けた気がします。これ、多分うまくやると自動分類できるんですが、それでもそこそこしんどい気がしますね。結局PNGは最後まで戻せるのかどうか……

普段 Web 系の人間なはずなのに全く分からなくてしんどいし困りますね。でもバイナリにも強くなりたいですね。やっていきましょう。
