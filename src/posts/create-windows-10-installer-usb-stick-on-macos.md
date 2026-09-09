---
title: "macOS で Windows 10 のインストーラをUSBメモリに作る"
date: 2020-05-07T21:19:00+09:00
slug: "create-windows-10-installer-usb-stick-on-macos"
categories:
  - slug: "software"
    label: "Software"
  - slug: "雑記"
    label: "雑記"
post_tags:
  - slug: "windows10"
    label: "Windows10"
---
---

2020年にもなってこんなことで微妙に苦しんだので備忘録。

EFIなら何も考えなくてもいいのかもしれないが、レガシーPC向けにMBRでやろうとすると微妙にはまったので

1. Windows 10 の ISO をダウンロードしてくる
 	[https://www.microsoft.com/ja-jp/software-download/windows10ISO](https://www.microsoft.com/ja-jp/software-download/windows10ISO)

1. これに従う
 	[https://alexlubbock.com/bootable-windows-usb-on-mac](https://alexlubbock.com/bootable-windows-usb-on-mac)

1. ブートローダーを書く
 	このリンクの Step 3 以降に従う

1. [https://www.oueta.com/macos/create-windows-7-8-10-bootable-usb-drive-in-macos-with-command-line-mbr-partitioning-scheme/](https://www.oueta.com/macos/create-windows-7-8-10-bootable-usb-drive-in-macos-with-command-line-mbr-partitioning-scheme/)


ざっくりコマンドの流れを書くとこんな感じ。ディスクは `/dev/disk2` とします。ツール等のリンクは参照した記事ママなので、リンク切れしていたら別のところから探してきてください。

```
$ brew install wimlib
$ hdiutil mount Win10_1909_Japanese_x64.iso
$ sudo diskutil eraseDisk MS-DOS "WIN10" MBR /dev/disk2

$ rsync -vha --exclude=sources/install.wim /Volumes/[isoのマウント先]/ /Volumes/WIN10
$ wimlib-imagex split /Volumes/[isoのマウント先]/sources/install.wim /Volumes/WIN10/sources/install.swm 4000

$ curl https://www.oueta.com/wp-content/uploads/2018/10/syslinux-4.03.tar.gz -o syslinux-4.03.tar.gz
$ tar -zxvf syslinux-4.03.tar.gz

$ curl https://www.oueta.com/wp-content/uploads/2018/10/syslinux-mac.tar.gz -o syslinux-mac.tar.gz
$ tar -zxvf syslinux-mac.tar.gz

$ sudo dd if=syslinux-4.03/mbr/mbr.bin of=/dev/disk2 bs=440 count=1
$ sudo ./syslinux -i /dev/disk2s1

$ mkdir /Volumes/WIN10/syslinux
$ cp syslinux-4.03/com32/modules/*.c32 /Volumes/WIN10/syslinux
$ $EDITOR /Volumes/WIN10/syslinux/syslinux.cfg

$ sudo diskutil unmountDisk disk2

$ sudo fdisk -e /dev/disk2
fdisk: 1> flag 1
Partition 1 marked active.
fdisk:*1> write
Writing MBR at offset 0.
fdisk: 1> exit
$ diskutil eject disk2
```
