---
title: "Ubuntu 14.04 LTSでCUDA環境を整える"
date: 2014-05-09T00:46:00+09:00
slug: "ubuntuでcuda環境を整える"
categories:
  - "Programming"
post_tags:
  - "CUDA"
  - "GPU"
  - "Ubuntu"
---

最近組んだPCで環境構築をしていて、何故か物凄くハマったので記録。

以下、気を付けた方が良いと思った点です。



- **そもそも**FreeBSDでCUDAをネイティブに扱うことは出来ないので辞めたほうが良さげ。(ハマった

- GUI環境だと何度もコケたので、**GUI環境は避ける方が良い** (Ubuntu Server をおすすめします。

- **apt-get** でドライバ, CUDA Toolkitを入れるのはハマることが多いので、NVIDIAのサイトから**.run**ファイルを落とすのがおすすめです。

- **nvidia-smi** コマンドでグラボが認識しているか確認出来る。

#### 参考リンク

- ドライバ: [NVIDIAドライバダウンロード](http://www.nvidia.co.jp/Download/index.aspx?lang=jp)

- CUDA Toolkit ([Downloads | NVIDIA Developer Zone](https://developer.nvidia.com/cuda-downloads#linux))
