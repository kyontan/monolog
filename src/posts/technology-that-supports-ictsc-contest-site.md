---
title: "ICTSCのコンテストサイトを支えた技術"
date: 2020-12-10T00:00:00+09:00
slug: "technology-that-supports-ictsc-contest-site"
categories:
  - "Programming"
post_tags:
  - "ICTSC"
  - "Ruby"
  - "whywaita Advent Calendar"
---

この記事は [whywaita Advent Calendar 2020](https://adventar.org/calendars/5082) の10日目の記事です。2週目です。来週何を書くか考えるだけで気が遠くなります。

昨日は @icchy さんで 「whywaitaであいうえお作文する」でした。タイトルだけでだいたい想像できますね。

<https://twitter.com/icchyr/status/1336325587929976834>

なるほど。


@icchy さんのおすすめインターネットコンテンツは[飲酒日記](https://alcoholog.hatenablog.jp/)です。


<figure class="wp-block-embed-wordpress wp-block-embed is-type-wp-embed is-provider-hatena-blog"><div class="wp-block-embed__wrapper">
https://alcoholog.hatenablog.jp/entry/2020/12/01/015540
</div></figure>


閑話休題。
アドベントカレンダー、書くネタはあれど頭を使うものばかりで泣きそうになったので、とりあえず過去の下書きを漁っていたらタイトルだけ書かれたこの記事の下書きを見つけました。
最近思うこともあったので、すでに忘れ去られ、誰もが忘れたままでいたいと思っていたICTSCのコンテストサイトの歴史を紐解いてみたいと思います。
whyawitaさんとの関わりもあるし、whywaita Advent Calendar的には100点満点のネタですね。よろしくお願いします。

<span id="more-technology-that-supports-ictsc-contest-site"></span>

### ICTSCとは

早速本題に入りたいのですが、そのためにはICTSCに関する簡単な知識が必要です。
[ICTSC (ICTトラブルシューティングコンテスト)](https://icttoracon.net/archives/8570) は学生による学生のためのインフラ技術を競うコンテストで、最近は年1回開催されています。途中でナンバリングが回数から年号になるの、あるあるって感じですね。
予選もありますが、予選のことは一旦考えないこととして、本選の話をします。選ばれた本選の参加者は、当日の限られた制限時間内に与えられる問題へ挑むことになります。

問題は次のような形式で与えられます。

> 「A社の技術者であるXさんは、自社の端末からあるWebサイトを開こうとするといつも失敗することに気が付きました。A社の社内ネットワークのトポロジは下の図のようになっており(省略)、ルータの管理コンソールへアクセスするために必要な情報はXXです。あなたはXさんに変わってこの問題を解決してください」

> 管理コンソールのIP: xxx.yyy.zzz.www
> ユーザ名: admin
> パスワード: nyannyan
> 
> 社内端末のIP, ユーザ名, パスワード: ...

参加者はこれらの情報を元に、持てる限りの知識と経験を活かして挑み、気合で問題を解決することになります。
(大会インフラとしてはVMがいて、仮想ないし物理のルータがいて……となりますが、今回の本題からはそれるので割愛します)

そうして、問題に不明点があれば質問をし (競技界隈では clar(ification) と呼ばれたりするみたいですね)、解決に必要な情報をまとめて回答します。基本的に回答はテキストで自由な形式で行われます。
運営は提出された回答を読み、必要があれば実際にVMへアクセスして回答の検証をし、採点を行います。
採点を行った結果、正答であれば点数が加算され、不正答であれば改めて参加者が挑戦する、というのが一連の流れになります。

### コンテストサイトの必要性

ICTSCでは、約15問の問題が2日間かけて出題され、参加チーム数も15チーム近くに上ります。賞金が出るということもあり、運営は限られた時間内に公平性をできるだけ保ちつつ採点や質問対応といったタスクをこなさなければなりません。
15チームというのは意外と少なく見えますが、人数でいうと60人から80人近くおり、1つのチームでも分担して複数の問題に取り組んでいたりします。そうなると、意外と想像を絶する数の質問や回答が来ます。15チーム×15問で単純に225回答ですし。

私がICTSCの運営にジョインしたのは、遠い昔のICTSC5でした。当時はプロジェクト管理ツールである [Redmine](https://redmine.jp/) を使って出題を行っていました。チームごとにプロジェクトを立て、問題ごとにIssueを立てて、そのコメントで質問や回答の管理をしていた気がします。
この構成で実際に開催を行ったところ、様々なトラブルが生じました。
質問や回答の状況が適切に把握できない(どの質問にまだ返答してないのか?採点は行われたか?)だけでなく、特定チームへの紙のトポロジ図の配布漏れ (これなんで紙で配ってたんでしたっけ?) などが生じました。

今思えばこれなんで起きたんだ?みたいなトラブルですね。Redmineを賢く使えば良かったのではないかと思ってきた……

さて、こういった課題に対処するために若者がやることは一つですね?
そう、**「僕が考えた最強のコンテストサイトで解決しよう」**です！

### コンテストサイトの開発

さて、経緯はどうあれコンテストサイトの開発が始まります。正確にはすでに私の知らないところで一度頓挫していたのですが、忘れます。

今のコンテストサイトは様々あり(後述)、私が知らない構成になっているので、とりあえず私が知っている構成の最後の回のブランチへのリンクを貼ります。

[GitHub: ictsc/ictsc-score-server at ictsc2018](https://github.com/ictsc/ictsc-score-server/tree/ictsc2018)

さて、途中で採用技術が二転三転している(なぜ?)ので、老害らしく順を追っていくことにしましょう。

#### ICTSC6

輝かしいコンテストサイト初回導入のときです。当時関わっていた人からはICTSC6の文字列すら見たくないという話も聞きます。当時の振り返りはこちら。


<figure class="wp-block-embed-wordpress wp-block-embed is-type-wp-embed is-provider-monolog"><div class="wp-block-embed__wrapper">
https://blog.monora.me/2016/10/had-been-a-steering-committee-of-ictsc6/
</div></figure>


[https://github.com/ictsc/ictsc-score-server/tree/ictsc6](https://github.com/ictsc/ictsc-score-server/tree/ictsc6)

開発が始まりました、技術的には、特に面白みのない簡単な REST API + SPA 構成です。

私はフロントエンド技術には疎かったので、同じ運営学生のメンバーの方と、スポンサーの中の方々に協力して頂きました。
一体本業外のこんなことにどれだけの工数を割いていただいたのか、想像を絶する状況になっていたことだろうと思います。本当にありがとうございました。

特に、デザイナーの方にはふわっとしたユースケースから具体的な行動パターンの書き起こしから何から何までお世話になってばかりでした。特に、第6回は初めてコンテストサイトを導入するので何が起こるかわからない、というときに「じゃあ念の為に紙の解答用紙も作っておきますね!」とネタで解答用紙までデザインして渡していただいたときは笑いました。

さて、当時の採用技術は次の通りです。

- REST API



  - Ruby

  - Sinatra (Ruby のシンプルなWebフレームワーク)

  - ActiveRecord (Rails で使われている O/Rマッパー)

  - (SQLite3)



- Web UI (SPA)



  - Angular 2.0

  - RxJS 5.0

REST API の方は私がRailsの経験がほとんどなかったので必然的にこうなりました。Web UIはおまかせしたらこうなりました。[package.json](https://github.com/ictsc/ictsc-score-server/blob/ictsc6/ui/package.json) 見るとわかるんですけど、Angular 2.0 って当時まだRCなんですよね。尖ってますね
RxJSが使われたコード、当時ちょっと弄ろうとしたら手も足も出なかったきおくがあります。今なら読めるかもしれない

ところで、当時のREST APIには致命的な設計ミスがあり、REST APIでN+1をしていました。例えば、参加者が問題文の書かれたページを開くと、次のようなアクセスが走ります。

- `/problems/2`

- `/problems/2/comments`

- `/problems/2/issues`

- `/problems/2/issues/37/comments`

- `/problems/2/issues/39/comments`

- ...

- `/problems/2/answers`

- `/problems/2/answers/27`

- `/problems/2/answers/27/comments`

- ...

うーんひどい、典型的なN+1ですね。

N+1 はデータ量が少ないと影響が見えにくいので、この問題は回答や質問量が増えてきた2日目に顕著になりました。
そして当時の私はDBにインデックスを貼るということを知らなかったらしい。いま schema.rb 見て吐き気が……

そして、運営は全ての参加者の回答や質問を見ることができる、つまりどうなるでしょうか? 大変なことになります。
10秒経っても帰ってこないAPIが乱舞して開発者ツールはさながらナイアガラの滝の様相を呈していました。同一IPに同時に張れるセッション数限界までリクエストが飛んでドーン、返ってきたら第2弾がドーン、もう見たくない……

当時は完全にテンパっていたのでAPI側の修正を入れる余裕はなく、フロントエンド側で急遽キャッシュ等の対応を入れてもらったものの、却って新しいリソースが見えなくなるなどして大変でした。

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/b0b2b8f0-2cc5-4725-ad4f-e39880c3d9d1.png" alt="" loading="lazy"><figcaption class="gallery-caption">私が出題した問題の問題詳細ページ。VoIPに関するトラブルを出題しました。</figcaption></figure>

そんなこんながありつつも、なんとか(?)大会は閉幕。次回への課題を残しつつ、コンテストは第7回へ続きます。

#### ICTSC7

知り合いのOB、みんなICTSC7の話しかしたがらんがち。
[https://github.com/ictsc/ictsc-score-server/tree/ictsc7](https://github.com/ictsc/ictsc-score-server/tree/ictsc7)


<figure class="wp-block-embed-wordpress wp-block-embed is-type-wp-embed is-provider-monolog"><div class="wp-block-embed__wrapper">
https://blog.monora.me/2017/03/had-been-a-steering-committee-of-ictsc7/
</div></figure>


ICTSC6で辛酸を嘗めた私達[誰?]は、次こそは運営がトラブルシューティングしないコンテストにすべく様々な改善を行いました。

- REST API



  - Ruby

  - Sinatra (Ruby のシンプルなWebフレームワーク)

  - ActiveRecord (Rails で使われている O/Rマッパー)

  - MySQL (MariaDBだったかも?)



- Web UI (SPA)



  - Vue.JS 2.1

  - Vuex 2.0

API は N+1 問題を潰すべく、様々な対策が取られました。
その集大成が [nested_entity.rb](https://github.com/ictsc/ictsc-score-server/blob/ictsc7/services/nested_entity.rb) です。この100行に満たないコードがこのコンテストサイトの真価といっても過言ではないでしょう。私はそう思います。
これは要するに「僕の考えた最強のGraphQLっぽいやつ」で、指定した関連リソースをいい感じに取ってきてくれます。[こうやって](https://github.com/ictsc/ictsc-score-server/blob/d5fc08d0f0d889092f5390885fa9c7669a4d06a1/controllers/problem.rb#L23)使います。 こんな読みづらい使い方だからだめなんだわ。

これを使うと、上記のICTSC6の例が次の1リクエストで完結します。

- `/problems/2?with=comments,issues-comments,answers-comments`

便利なのは分かりました。さて、ここで内部的には何をやっているのかというと、大きく次の2つのことを行っています。

- アクセスするユーザの権限によるRBAC (Role-Based Access Control) の適用

- N+1を避けるクエリの生成

コンテストサイトのユーザには、参加者や運営、スポンサーといったロールが割り当てられており、それぞれ見ることができる情報に差があります。例えば参加者が他チームの回答を見られては困りますね。

これ、すなわちRBACを実現するために、全てのロールに対してあらゆるモデルで読めるものを ActiveRecord の scope で定義しています。例えば[こんな感じ](https://github.com/ictsc/ictsc-score-server/blob/d5fc08d0f0d889092f5390885fa9c7669a4d06a1/db/model.rb#L421-L430)です。
scope とは何かというと、あらかじめ用意されたパラメータの指定可能なクエリといえばいいでしょうか。scope は `ActiveRecord::Relation` 型の値を返します。これは何かというと、ActiveRecord の抽象的なクエリ表現なので、これを更に合成したりできます。便利

クエリレベルでもN+1を避けるためにはどうしたら良いでしょうか? 気合でクエリを合成したらできそうです。
なんと ActiveRecord はクエリに `include` パラメータを渡すと勝手に合成してくれます。そうしましょう。
nested_entity.rb では、[このあたり](https://github.com/ictsc/ictsc-score-server/blob/d5fc08d0f0d889092f5390885fa9c7669a4d06a1/services/nested_entity.rb#L45-L47)で与えられたクエリパラメータをいい感じに ActiveRecord が解釈できる形に変換しています。

全てが ActiveRecord の世界で簡潔するので、RBACもN+1もクエリレベルで表現されます。これはすごくて、あとは全てのロールがアクセスできるリソースをActiveRecordのクエリで表現できれば大丈夫です。[つらい](https://github.com/ictsc/ictsc-score-server/blob/d5fc08d0f0d889092f5390885fa9c7669a4d06a1/db/model.rb#L220-L247)、[二度とやりたくない](https://github.com/ictsc/ictsc-score-server/blob/d5fc08d0f0d889092f5390885fa9c7669a4d06a1/db/model.rb#L481-L513)。

ちゃんとDBもMySQLにしてインデックスも貼ったので、APIも水平スケールできるようになりました。こうしてコンテストサイトの Iikanji Speed-Up に成功した我々は、その後数回に渡って予選敗退を繰り返しました。何が足りないん?

そして、フロントエンド担当のエンジニアの方の異常な熱意により、唐突に [ui2](https://github.com/ictsc/ictsc-score-server/tree/ictsc7/ui2) ディレクトリが爆誕しました。突然のAngular引退宣言に人々は涙を禁じえませんでした。

そうして開催されたICTSC7は、少なくともコンテストサイトについては成功裏に終わったといっても過言ではないでしょう。

ユーザから見える部分としては、問題がこれまでの2日間の午前午後、計4パートでの固定出題から、問題を解くごとに次の問題が解けるようになったり、最初に問題を解いたチームに追加点数(first blood)を与えるようになったりという変化の方が大きかったかもしれませんが、これもコンテストサイトの貢献ということで。

ちなみにこの頃のスクリーンショットがこちら。

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/ictsc7-contest-site.png" alt="ICTSC7 コンテストサイト" loading="lazy"><figcaption class="gallery-caption">ICTSC8におけるコンテストサイトのトップ画面</figcaption></figure>

<figure class="gallery-item"><img src="https://monora-monolog-media.1line.dev/bf705b46-8524-43f3-a4b9-8c2698fd1a86.png" alt="" loading="lazy"><figcaption class="gallery-caption">問題一覧画面の一部。このときは、出題された問題群ごとにちゃんと設定があり、その説明文が左に表示されていました。</figcaption></figure>

#### ICTSC8

ICTSC8の記憶があまりありません。


<figure class="wp-block-embed-wordpress wp-block-embed is-type-wp-embed is-provider-monolog"><div class="wp-block-embed__wrapper">
https://blog.monora.me/2017/10/had-been-a-steering-committee-of-ictsc8/
</div></figure>



[https://github.com/ictsc/ictsc-score-server/tree/ictsc8
](https://github.com/ictsc/ictsc-score-server/tree/ictsc8)コミットログを見ると、たしかに差分はあるけどあまり変わってないですね。確かプッシュ通知を実装しました。CyberAgentのFRESHチーム?が作った [plasma](https://github.com/opensaasstudio/plasma) を使っています。

ICTSC8では小さなバグフィックスやルール変更の対応等はあったものの、それよりはテストを書くことにご執心だったようです。RSpecの鬼になったkyontanの姿が垣間見えますね。増える緑の. (RSpecではテストケースが1つPASSするごとに.がプリントされた)にエクスタシーでも感じていたんでしょうか。
[https://github.com/ictsc/ictsc-score-server/tree/ictsc8/spec/requests
](https://github.com/ictsc/ictsc-score-server/tree/ictsc8/spec/requests)相変わらず[へんなヘルパー](https://github.com/ictsc/ictsc-score-server/blob/fb5884fc643facdd0a76cd54f2cbe3be0a58cce1/spec/support/api_helpers.rb#L25-L55)定義しててウケました。そんなんだからお前のコードは人に読まれない。

そうして満足したので運営委員を引退しました。それはそれとして、参加記を見ると毎回のように後悔が綴られていますね。

#### ICTSC9

関わっていないのでほとんど分かりません。

[https://github.com/ictsc/ictsc-score-server/blob/3730cfaa8d62b14a573a1e3a5998f045993e2504/services/nested_entity.rb#L16](https://github.com/ictsc/ictsc-score-server/blob/3730cfaa8d62b14a573a1e3a5998f045993e2504/services/nested_entity.rb#L16)

ほんまにすまんて

#### ICTSC2018

運営に出戻ったものの何したのか覚えてません。コンテストサイトには手を出していないはず。

このあたりで API 向けの CLI が生えたらしい。今までシードデータ投入をSQLでやってたのを、 REST API 経由でやるようにしたんですかね。

[https://github.com/ictsc/ictsc-score-server/tree/ictsc2018/cli](https://github.com/ictsc/ictsc-score-server/tree/ictsc2018/cli)

あとはしれっと Kubernetes 化とかされている。モダンなインフラってやつ

私が知るのはここまでです

#### ICTSC2019

[Big Bang! · ictsc/ictsc-score-server@5d5fd50](https://github.com/ictsc/ictsc-score-server/commit/5d5fd505944f7df9314b5e6378c770fbd9cb6182)

唐突に api2 と ui3 が爆誕する。担当者のキレ具合が垣間見えますね。僕も同情します。

- REST API



  - Ruby

  - Rails 6.0

  - GraphQL

  - PostgreSQL



- Web UI (SPA)



  - Nuxt.js 2.0

  - Apollo Client 2.6

ザ・モダン・Webアプリケーション大全。僕の心境としては「GraphQLもどきを作って公園で砂遊びしてたらいつのまにか本物のGraphQLで置き換えられていた、何が起きているのか(ry」って感じです。
DB が Postgres に変わったのはなんでなんでしょうね? 僕は理由を知らないので知っている人がいたら教えて下さい。

増えた機能が多すぎて良くわかりませんが、Webでだいたいのリソースが編集できるようになってたり、問題VMへのアクセスに必要な情報を専用のテーブルで管理できるようになったりしたようです。憶測ですが、VMをプロビジョニングするいい感じのツールと連携していい感じにできるんじゃないですかね。

こうして生み出したプロダクトが自分の手を離れて育っていく様子をまだ学生の身にして実感することができました。ハッピー。

### 万物は流転する

私事になりますが、先日[JANOG47](https://www.janog.gr.jp/meeting/janog47/)？っていう日本最大級のネットワークエンジニアの集まり？ってやつでNETCONっていうあいしーてぃーえすしー？みたいなのをやるって言われてあれやそれやで運営委員になりました。

どうやらコンテストサイトが必要らしいんですよね。

………というわけで最近[fork](https://github.com/janog-netcon/netcon-score-server)しました。これどうしたらいいんですか?

そんなこんなで、泣きながら Ruby の GraphQL実装を調べています。ドキュメントの大切さが目に染みる。

明日は同期だったはずのくるとんさんです。ワンワールドサファイアステータスを求めて飛び回りたいという発言を最近目にしましたがお元気ですか?
