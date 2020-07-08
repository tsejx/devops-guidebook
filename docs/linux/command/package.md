---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 软件包管理
order: 6
---

# 软件包管理

- 软件包管理
  - `yum` 基于 RPM 的软件包管理器
  - `apt-get` Debian Linux 发行版中的 APT 软件包管理工具

## yum

假定你用的是 CentOS，则包管理工具就是 yum。
如果你的系统没有 wget 命令，就可以使用如下命令进行安装。

```bash
yum install wget -y
```

## man

`man`（`manual` 的缩写）是 Linux 下的帮助命令，通过 `man` 指令可以查看 Linux 中的指令帮助、配置文件帮助和编程帮助等信息。

```bash
# 查看 ls 命令的帮助说明
man ls

# 查看 cd 命令的帮助说明
man cd
```

## help

```bash
# 内部命令使用 help 帮助，查看 cd 命令的帮助
help cd

# 外部命令使用 help 帮助，查看 ls 命令的帮助
ls --help
```

## info

info 帮助比 help 更详细，作为 help 的补充

```bash
# 查看 cd 命令的详细帮助信息
info cd
```
