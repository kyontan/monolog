---
title: "shotgun じゃなくて rerun を使おうという話"
date: 2016-03-27T04:32:00+09:00
slug: "use-rerun-with-tmux-not-shotgun"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "rerun"
    label: "rerun"
  - slug: "ruby"
    label: "Ruby"
  - slug: "tmux"
    label: "tmux"
---
---

Ruby で Rack アプリケーションを書いているときに、コード変更したら自動的にサーバー再起動したいという話。

今までは [shotgun](https://github.com/rtomayko/shotgun) でやっていたのだけれど、これは毎回リクエストする度に変更の有無に関係なくサーバーを立ち上げ直すので、遅いという欠点があった。
副次的な問題として、[better_errors](https://github.com/charliesome/better_errors) で REPL が無効になるという欠点があった。(レスポンスを返すとそのコンテキストを捨ててしまうから?)

ずっと前からどうにかならないかなーと思っていたのでググったら [rerun](https://github.com/alexch/rerun) というものを見つけた。
Rack とか関係なくもっと汎用的なやつで、ファイル変更検知してサーバー上げ直すぞ! みたいなプロダクトらしい。

入れたら下のような感じで使える。便利。

`RACK_ENV=development rerun -- rackup -o 127.0.0.1

`調子に乗って通知有効化するぞ! というノリで [terminal-notifier](https://github.com/julienXX/terminal-notifier) を入れてみたらサーバーが上がらなくなった。何事かと思ったら tmux 上で使おうとすると一癖あるらしく、[こういうIssue ](https://github.com/julienXX/terminal-notifier/issues/115)が立っていたので適当に読んだら解決した。

要するに、`brew` なりなんなりで、`reattach-to-user-namespace` をインストールして、`.tmux.conf` に下を書き加えるという話。

```

set -g default-command "which reattach-to-user-namespace > /dev/null && reattach-to-user-namespace -l $SHELL || $SHELL -l"
```

再起動に掛かる時間が体感で倍ぐらいになったけれど、`better_errors`使えることで圧倒的効率アップみたいなところがあるので、トータルで幸福度が向上した気がする。
