---
nav:
  title: Linux
  order: 1
group:
  title: 常用命令
  order: 1
title: 环境变量
order: 100
---

# 环境变量

## export

很多安装了 jdk 的同学找不到 java 命令，export 就可以帮你办到它。export 用来设定一些环境变量，env 命令能看到当前系统中所有的环境变量。比如，下面设置的就是 jdk 的。

```bash
export PATH=$PATH:/home/xjj/jdk/bin
```

有时候，你想要知道所执行命令的具体路径。那么就可以使用 whereis 命令，我是假定了你装了多个版本的 jdk。
