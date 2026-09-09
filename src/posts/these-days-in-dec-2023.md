---
title: "2023年12月あたりの今日このごろ"
date: 2023-12-29T23:59:00+09:00
slug: "these-days-in-dec-2023"
categories:
  - "雑記"
post_tags:
  - "登山"
  - "近況報告"
---

意外としていない近況報告

無事今年も生き延びることができそうでホッとしています。

でもこれを書いているのは2023-12-29で、なぜか明日/明後日と2日連続で[C103](https://www.comiket.co.jp/info-a/C103/C103Info.html)に行くことになってしまったのでまだ休むには早いらしい。
最後にコミケに行ったのはコロナ禍前だったので、2019-08のC97でしょうか?

今年は起伏があり、良くも悪くも変化に満ちた1年だったと思いますが、なんとなく振り返ってみようと思います。

<span id="more-these-days-in-dec-2023"></span>

## 仕事

新卒で入社した会社を(なんと)辞めることなく2年半と少しが過ぎました。周りにも驚かれますが、ちゃんと自分が一番驚いてます。
今のチームに来てからも2年が過ぎ、所属部署の名称は半年ごとに変わっているが実態は変化していません。

恵まれた同僚のもと楽しくお仕事させて頂いており、今年はクラウドサービスのコスト最適化や開発者との距離を縮める活動に終始していた……ような気がしますが、つまりはサービスに対しても組織に対しても、観測可能な情報を増やし、それを正しく解釈し次の行動を考える、ということを繰り返していたというのが正しいかもしれません。

要は今あるものが最適でないと自分が感じたときに、それが最適であると合理的に説得できないのであれば最適化できる余地があるはずで、今年はそれを頑張ってみたと今なら振り返られる気がします。

言い換えると、要するにやり方はなんでもよくて、メトリクスやログを取得して頑張って可視化しつつ合理的な解釈・理解を求めることもあれば、サーベイなどを取ってより組織が成果を出せるようにはどうしたらいいか考えるみたいなこともやる、というのが自分のやりたかったことなのかもしれないですね。どうでしょう。

今年も自分のアウトプットがほとんどない。多分表に出ているもので自分が大なり小なり関わっていたものはここらへんです。

- MongoDB on self-hosted EC2 を Graviton に載せるべくディスクのベンチマークをして[AWSのイベントで登壇したり](https://aws.amazon.com/jp/blogs/news/event-report-wwso-compute-ec2-20230720/)

- AWS EKS (Elastic Kubernetes Service) で Karpenter という新しいautoscalerを活用してみたり([同僚の記事](https://blog.studysapuri.jp/entry/2023/11/20/karpenter-intro))

- チームの取り組みについてサーベイをもとに改善してみたり([同僚の発表](https://speakerdeck.com/chaspy/sreing-with-developers))

あとは Amazon Aurora Serverless v2 をプロダクションの過半数に入れるみたいな少し変わったことをしたり、日々襲ってくるDDoSに対して色々頭を悩ませつつ対策をしていたりしました。たぶん

今年もあまりコードを書けておらず悔しい気もしますが、自分としては長年の負債になったり、誰も手がつけられなくなっていたりする部分を少しずつ解明しては倒していく、みたいなことをして、少し先に誰かが困ることが3つぐらいは減らせたのかなと思うのでヨシとします。

一方で、ここ2, 3ヶ月は仕事難しいな〜と思うことが多くて、それは良くも悪くも自分がやる仕事の影響力が大きくなっていたり、慣れや怠慢が表面化してしまったりしたことによるものも多かったのかなと思います。ちゃんとコミュニケーションを取っていこうと改めて気を引き締める所存でした。

ポジティブな話としては、なんやかんやあって大きな組織のMVPを頂いたり、来年は全社のテックカンファレンスで登壇することになったりと評価して頂いている気がします。
期待に添えていない部分のほうが多いと思いますが、引き続き頑張っていきたいと思います。

来年も? 1月1日より勤務予定です。

## 旅

今年もあちこちに行くことができて充実した1年でした。

これを書き始めるまで、今年あまり旅行行かなかったな〜とか思っていたが完全に杞憂だったようです。写真マシマシでお送りします。

### 登山

何と言っても今年を振り返るならこれでしょう。去年の夏頃から登山をはじめて、今年は登山をした1年だったといっても過言ではありません。
絶景と汗は心を豊かにするわよ、と数年前の自分に言っても信じてもらえないでしょう。人は変わるものですね。

特に6−8月と10月は延々と山に登っていた気がします
そして秋になぜか道具やウェアがどんどん生えて大変なことになってきた。来年は楽しくなるわね。

山行ほぼ全ては[YAMAPで記録している](https://yamap.com/users/1033228)。RubyKaigiでは開発者の方にお会いできてお礼が言えてよかった。今後もお世話になります。

今年行ったところのうち、おすすめしたいものを取り上げてみましょう。だいたいおすすめです。

#### 旧東海道 箱根峠 (三嶋大社→箱根湯本)

- 過去に熊野古道も少し歩いたことがあるのだけれど、緑に包まれた石畳の古道を歩くのは楽しい

- ちゃんと今もなお道として整備されているのもかなり良かった

- でも後半の国道一号(現道)と重なるあたりはつらかった……

![](https://monora-monolog-media.1line.dev/image.jpg)

#### 三ツ峠

- ヤマノススメを見て登山をはじめた(?)オタクとしてはやはり外せないところ

- 富士山がデカくて良かった

#### 塔ノ岳

- 地元神奈川を代表する山の一つ。こんな身近なところにこんな良い尾根があるのかと感動した記憶

- 来年は足を伸ばして丹沢山と蛭ヶ岳も行きたいところ

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-23-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">こんな尾根が神奈川県にあるなんて</figcaption></figure>

#### 大菩薩嶺

- 無限に車がいて登山口で駐車するのが大変だった記憶

- 眺めが良くて富士山が最高でございました

![](https://monora-monolog-media.1line.dev/01M1ZWPKPTQ809ZN86C02EQ0JE-image-1.jpg)

#### 筑波山

- 人人人人人

- 「西の富士、東の筑波」の異名は伊達じゃねえと思いました。眺めが良すぎる

#### [硫黄岳](https://yamap.com/activities/25327736)

- 八ヶ岳シリーズ1

- 本沢温泉と夏沢鉱泉を巡る温泉回でした。どっちも良かった……! また行きたい

- 八ヶ岳の魅力に取り憑かれた回



  - これを機に八ヶ岳周辺の山には何度も登ることになりました

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-2-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">友人、写真上手すぎないか?</figcaption></figure>

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-3-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">雲上の湯の呼び名は伊達ではない</figcaption></figure>

#### [鳳凰山 (鳳凰三山)](https://yamap.com/activities/25523317)

- テント泊したいな〜と思っていたら知り合いに誘われて行くことになった回

- なぜ25Lのザックにテントも食料もマットも入ったのかは全員が首を傾げていた

- 朝の稜線からの絶景があまりにも良すぎて南アルプスも最高だなと思ってしまった



  - 来年は北岳を目指します

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-5-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">2023年のベストショットです</figcaption></figure>

#### 蓼科山 / 霧ヶ峰 / 美ヶ原

- 八ヶ岳シリーズ2 (蓼科山は北八ヶ岳の一峰)

- 「近いし1日で3箇所行くか」の謎のノリで行った回。疲れました

- 「シカって警戒してると『ピャッ』って鳴くらしいよ」「ピャッ」「なるほど〜〜」

- 蓼科山の無限に同じ風景続く登りつらかった……! があまりにも眺めが良かったので許しました

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-7.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">美ヶ原高原のRPGみたいな光景はかなりウケました</figcaption></figure>

#### [木曽駒ヶ岳](https://yamap.com/activities/26186912)

- 名古屋に行く予定があり、地図を眺めていたところ「千畳敷カールこんなところにあるんだ、一生で一度見たいな……」となり行ってきた回。

- 偶然高速のインター降りたところの駐車場で車を駐めたおかげで助かった (バスがそこで満席になった)

- 千畳敷カールすごい、無限に人がいて無限にバテてて大変そうでした

- 中央アルプスも楽しいね

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-8.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">千畳敷カール。こんなに眺めが良くていいんですか?</figcaption></figure>

#### [西穂高岳](https://yamap.com/activities/26389033)

- 今年ほぼ唯一の北アルプス。来年は色々行きたいな……

- これまで登った山にない岩場続きで高度感もあり、またちまちまとピークがあって11峰から本峰の1峰までカウントダウンされてくのも楽しかった

- 帰りは西穂丸山あたりからかなり雨だった記憶。今年は意外とここと次の横岳でしか降られてないらしいことに今気づきました。

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-9.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">かなり崖</figcaption></figure>

#### 横岳

- 八ヶ岳シリーズ3

- よく考えたら横岳の山頂で障害対応のMeet入ってた記憶があるな……なんでだろうな……

- 横岳〜赤岳天望荘〜赤岳 の予定だったが、2日目は土砂降りだったので頑張って降りてきた回。[山なめんなよ](http://akadake.main.jp/news/220807/gyozagyouja.html)

- 帰りの車の中でも障害対応やってたような記憶があるな……なんでだろうな……

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-10-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">1日目、小屋に着いたその瞬間に一瞬見えた赤岳。来年は行きたい</figcaption></figure>

#### [水平歩道 / 下ノ廊下](https://yamap.com/activities/27346602)

- 偶然のタイミングで人生の目標が1つ達成されてしまった回

- もともと温泉が好きで、せっかくなら歩いてしか辿り着けない秘湯にも行ってみたいと思っていて、それで始めた登山で最初に行ったのも[那須の三斗小屋温泉](https://yamap.com/activities/18150051)だったり、今年も上で書いたように本沢温泉や夏沢鉱泉に行ったりしていましたが、その目標は黒部の[阿曽原温泉](https://azohara.niikawa.com/)でした

- (写真の通り)どう見ても危ない道なのでいつか登れたらいいな、ぐらいの気持ちではいましたが、偶然にも行くチャンスが巡ってきたので



  - 一緒に行ってくれたお二方には改めて感謝を。ありがとうございました

  - 人生楽しい



- 寿命は縮んだ気がします

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-19-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">水平歩道が水平歩道であることが良く分かるポイント</figcaption></figure>

![](https://monora-monolog-media.1line.dev/image-16-scaled.jpg)

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-18.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">阿曽原温泉、また行きたい</figcaption></figure>

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-15-scaled.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">冗談抜きでだいたいこんな感じの道でした</figcaption></figure>

#### [奥大日岳](https://yamap.com/activities/27537622)

- 今年も立山に行こうとしたら雪降ってました定期。なんでなん?

- そして奥大日岳へ。去年も登っているのだけれど、ルート上も山頂からの眺めも楽しく、山頂からは剱岳を眼前に拝める最高の立地にあるのにほとんど人を見かけない



  - やはり室堂からだと眼前に広がる立山が人を惹きつけてしまうのだろうか

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-11.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">せっかくなので行ったことのない浄土山に行こうとしたが登山口で力尽きる友人</figcaption></figure>

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-12-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">後ろに見えるあの山綺麗だな〜来年登ってみたいな〜</figcaption></figure>

(力尽きた写真はフリです)

#### 南木曽岳

- なぜか中山道のそのあたりに行く機会があったのでシュッと登ってきた

- 「ハシゴと階段歩きが怖い」という他人の山行レポートを見て、なぜ? と思ったらたしかに怖かった……

- でもルートの短さの割に山頂からの眺めはなかなかに良かったです

#### [由布岳](https://yamap.com/activities/28576105)

- 別府から由布院や阿蘇へ車を走らせたら、道中見えるその山容に見惚れることは間違いないあの由布岳

- 偶然、別府旅行の最終日に登ることができた。やったね

- 登った感想、やっぱりこれが百名山に入ってないのは百名山のバグです

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-13.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">山頂はうっすら雪に覆われていて霧氷も見れました。やったね</figcaption></figure>

#### 金時山 / 明神ヶ岳

- いわゆる神奈川の海沿いで、西の遠くに見える、名前も知らないあの山

- こんな地元にこんな眺めが良い山があるなんて聞いてないですわよ

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-14-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">箱根の外輪山の外輪っぷりがよく分かる1枚</figcaption></figure>

こうして振り返るとなかなかに山だらけな1年だった気がします。来年は剣と槍という話もありますが、さてどうなることやら。

### 温泉や移動

別に山に行かなくても温泉は行ってます。多分今年は40湯ぐらい。
今年はじめて行ってよかったのはここらへん。

- 青森県 あたご温泉

- 岩手県 藤七温泉 彩雲荘



  - なんと行った日が今年のオープン日だった文句なしで露天風呂が最高飯もうまい1位

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-22-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">オープン初日</figcaption></figure>

- 福島県 木賊温泉 共同浴場 岩風呂

- 新潟県 かのせ温泉赤湯

- 新潟県 貝掛温泉



  - 有名なだけだと思っててごめんなさい1位



- 新潟県 ナステビュウ湯の山



  - 正直そこらへんの日帰りスパだと思っていったら度肝を抜かれた1位



- 新潟県 寺宝温泉

- 新潟県 新津温泉



  - 石油臭が最高〜!1位



- 栃木県 日光山 温泉寺

- 群馬県 万座温泉 万座亭

- 千葉県 むつざわ温泉 つどいの湯



  - 千葉県にこんないい温泉があるなんて1位 南関東ガス田を感じる



- 山梨県 やまと天目山温泉



  - 地元のバス会社がやってるなんてずるい、登山で使いやすすぎる1位



- 山梨県 韮崎旭温泉



  - ここの温泉水持って帰って焼酎割りたい1位 (今はできないらしい)



- 長野県 本沢温泉



  - 硫黄岳を見上げる雲上の露天風呂は最高1位



- 長野県 釜沼温泉 大喜泉



  - 泉質名が長くて嬉しい源泉そのままの水風呂もあるなんて嬉しい冷鉱泉1位



- 長野県 子安温泉



  - 木がふんだんに使われた浴室も黄土色の含よう素泉も広い休憩所も嬉しい1位



- 長野県 箱山温泉

- 長野県 きそふくしま温泉 二本木の湯



  - 飲んでうまい温泉1位



- 岐阜県 湯屋温泉 ニコニコ荘



  - シュワシュワで飲んでうまい温泉1位タイ



- 富山県 阿曽原温泉



  - 優勝



- 和歌山県 湯川温泉 きよもん湯

- 徳島県 ホテル祖谷温泉



  - ケーブルカーに乗れ

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-21-edited.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">浴槽は遥か下</figcaption></figure>

- 大分県 長湯温泉 水神之森



  - とにかくパワーが強い、長湯に行くならここも行け1位

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/image-20.jpg" alt="" loading="lazy"><figcaption class="gallery-caption">見てくださいこの膜</figcaption></figure>

- 大分県 寒の地獄旅館



  - 最高、来年は源泉水風呂も入れる時期に行きます



- 大分県 筌の口温泉共同浴場

- 大分県 はげの湯温泉 くぬぎ湯



  - 眺めが良い!! [記事を書きました](/2023/12/waita/)



- 大分県 七福温泉 宇戸の庄

- 大分県 湯の坪温泉

山に行った関係で長野県を開拓できたり、新潟旅行に行って新潟の魅力に気付いたりと充実した1年でした。来年も温泉に浸かっていきたい。

### 飛行機

全然乗ってないのにマイルが一方的に溜まっていくので完全に陸マイラーになってしまいました。

来年は手が滑ったので春に台湾、夏にヨーロッパの予定です。うっかりビジネスクラスのチケットを取ってしまったがはたして……

### 船

沖縄に海路で上陸する実績を達成しました。

<https://twitter.com/sukukyon/status/1662050774678147072>

## お酒

今年もたくさん飲んで良かった。奄美大島で飲んだ焼酎が優勝でした。また行きたい。

<https://twitter.com/sukukyon/status/1660608033343574016>

## スポーツ

### スキー

板が生えた。2組も。そんなはずでは……

来年はスキーに行ってスキーに行ってスキーに行って帰ってきた翌日にスキーに行くことが今のところ予定として決まっています。

## お金

つい先日口座残高が4桁円になっていたのを見ました。そんなはずでは……と思いましたが、ここまでを振り返ってすべてを理解しました。

来年はヨーロッパ旅行に行くらしいです。そんな……

## 人生

Q. なにか進捗はありましたか?
A. 人の結婚式に行くと結婚したくなる人の気持ちがよく理解できました

## 振り返りと来年に向けて

今年も楽しい1年だったので来年も楽しくしたい。

来年の目標は「本を読む」「山に登る」「まだ、ここにない、出会い。」です。
