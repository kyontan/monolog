---
title: "Sinatra Modular-Application で configure が上書きされる問題の対処"
date: 2016-03-16T05:35:00+09:00
slug: "problem-about-overwritten-configure-in-sinatra-using-modular-application"
categories:
  - "Programming"
post_tags:
  - "Ruby"
  - "sinatra"
---

Ruby の [Siantra](http://www.sinatrarb.com/) で、Modular-Application を書いていたら良く分からない挙動にぶち当たって気が付いたら朝になっていたのでメモ。

app.rb

```
require_relative "hoge"

class App < Sinatra::Base
  configure do
    disable :protection
  end

  use HogeRoutes
end

```

hoge.rb

```
class HogeRoutes < Sinatra::Base
  get "/" do
     ...
  end
end

```

みたいな事をしていた。
`disable :protection` をしているのにどうしても `Rack::Protection` が有効になるので、どうしてこうなるんだとあちこちのコードを追いかけたりした結果、`HogeRoutes` が `App` とは別にもう一度 `session, protections` 等のセットアップが行われるので、以下のように、 `use HogeRoutes` を `configure` より上に持ってくる必要があった。

app.rb

```
require_relative "hoge"

class App < Sinatra::Base
  use HogeRoutes

  configure do
    disable :protection
  end
end

```

`HogeRoutes` 内の `configure` で `disable :protection` とやってもいいが、こうするとクラスが増えた際にその分だけ書かないといけなくて大変。セッションみたいなアプリケーション全体で統一的な設定を持つ部分は親の `App` でやって良いんじゃないかと思う。
