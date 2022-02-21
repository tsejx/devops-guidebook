---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 概述
order: 1
---

# Shell

Shell 是命令解释器，用于解释用户对操作系统的操作。

CentOS 7 默认使用的 Shell 是 `bash`。

## Shell 脚本

- UNIX 的哲学：一条命令只做一件事
- 为了组合鸣鹤多次执行，使用脚本文件来保存需要执行的命令
- 赋予该文件执行权限（`chmod u+rx filename`）

标准的 Shell 脚本要包含哪些元素：

- Sha-Bang
- 命令
- `#` 号开头的注释
- `chmod u+rx filename` 可执行权限
- 执行命令
  - `bash ./filename.sh`（使用 bash 执行不需要赋予执行权限 8）
  - `./filename.sh`（需要可执行权限）
  - `source ./filename.sh`（对当前运行环境造成影响）
  - `.filename.sh`

内建命令和外部命令的区别：

- 内建命令不需要创建子进程
- 内建命令对当前 Shell 生效

## 参考资料

- [Shell 脚本：Linux Shell 脚本学习指南](http://c.biancheng.net/shell/)
- [TLCL](http://billie66.github.io/TLCL/book/index.html)
- [3000 字扫盲 Shell 基础知识](https://juejin.im/post/5ef009b86fb9a058b10aaa28)
- [Bash 脚本教程](https://wangdoc.com/bash/index.html)
