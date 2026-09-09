---
title: "sinatra-activerecord で seed_fu を使ってみた"
date: 2015-10-14T04:02:00+09:00
slug: "use-seed_fu-in-sinatra-with-sinatra-activerecord"
categories:
  - slug: "programming"
    label: "Programming"
post_tags:
  - slug: "activerecord"
    label: "ActiveRecord"
  - slug: "ruby"
    label: "Ruby"
  - slug: "sinatra"
    label: "sinatra"
---
---

Sinatra で、[sinatra-activerecord](https://github.com/janko-m/sinatra-activerecord) を使っているときに、`$ rake db:seed` すると、既に存在するレコードが重複登録される。

これ、とても一般的な問題で、 Rails だと、[seed_fu](https://github.com/mbleigh/seed-fu) というのを使って解決したりするらしい。

Rails (ActiveRecord 4.x) で動くなら Sinatra (sinatra-activerecord) でも問題なく動くとおもいきや、`$ rake -T` しても `db:seed_fu` が表示されない……

ソースやらなんやら見ながら唸っていたら、どうも Rake のタスク追加を、 [Railtie を使ってやろうとしているところ](https://github.com/mbleigh/seed-fu/blob/master/lib/seed-fu/railtie.rb)を発見した。
どうやら Rails だと、初期化時にここのコードが走るらしいのだけれど、Sinatra にそんなものはないので当然タスクは追加されない。

というわけで、`Rakefile` にベタ書きしてみる。
メインのアプリケーションソースが `./app.rb` にあるということになっています。(適宜書き換えてください)
あと、なぜか `<<` が `< <` に置き換えられたので修正してください。

```
namespace :db do
  desc < <-EOS Loads seed data for the current environment. It will look for ruby seed files in (settings.root)/db/fixtures/ and (settings.root)/db/fixtures/(settings.environment)/. By default it will load any ruby files found. You can filter the files loaded by passing in the FILTER environment variable with a comma-delimited list of patterns to include. Any files not matching the pattern will not be loaded. You can also change the directory where seed files are looked for with the FIXTURE_PATH environment variable. Examples: # default, to load all seed files for the current environment rake db:seed_fu # to load seed files matching orders or customers rake db:seed_fu FILTER=orders,customers # to load files from settings.root/features/fixtures rake db:seed_fu FIXTURE_PATH=features/fixtures EOS task :seed_fu => :environment do

    if ENV["FILTER"]
      filter = /#{ENV["FILTER"].gsub(/,/, "|")}/
    end

    if ENV["FIXTURE_PATH"]
      fixture_paths = [ENV["FIXTURE_PATH"], ENV["FIXTURE_PATH"] + "/" + settings.environment.to_s]
    end

    SeedFu.seed(fixture_paths, filter)
  end

  task :load_config do
    require "./app"
  end
end

Rake::Task["db:seed_fu"].enhance(["db:load_config"])

SeedFu.fixture_paths = [
  Pathname(settings.root).join("db/fixtures").to_s,
  Pathname(settings.root).join("db/fixtures/#{settings.environment}").to_s
]

```

コードとしては、[seed_fu の rakeファイル](https://github.com/mbleigh/seed-fu/blob/master/lib/tasks/seed_fu.rake) を元に、[sinatra-activerecord から、データベースの接続設定を拾ってくる部分](https://github.com/janko-m/sinatra-activerecord/blob/master/lib/sinatra/activerecord/rake/activerecord_4.rb)を参考にしたりした。

```
Rake::Task["db:seed_fu"].enhance(["db:load_config"])

```

の部分がミソで、これでアプリケーションを通してデータベースに接続する必要がある。ここで2時間ぐらいハマった。
