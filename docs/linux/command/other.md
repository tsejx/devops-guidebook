---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 其他命令
order: 7
---

# 其他命令

## date

date 命令用来输出当前的系统时间，可以使用 `-s` 参数指定输出格式。但设置时间涉及到设置硬件，所以有另外一个命令叫做 hwclock。

## xargs

xargs 读取输入源，然后逐行处理。这个命令非常有用。举个栗子，删除目录中的所有 class 文件。

```bash
find . | grep .class$ | xargs rm -rvf

#把所有的rmvb文件拷贝到目录
ls *.rmvb | xargs -n1 -i cp {} /mount/xiaodianying
```
