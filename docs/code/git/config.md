---
nav:
  title: 代码管理
  order: 5
title: 配置 git config
order: 2
---

# 配置 git config

> Get and set repository or global options
>
> 获取并设置仓库

`git config` 命令用于获取并设置存储库或全局选项。这些变量可以控制 Git 的外观和操作的各个方面。

一般在新的系统上，我们都需要先配置下自己的 git 工作环境。配置工作只需一次，以后升级时还会沿用现在的配置。当然，如果需要，你随时可以用相同的命令修改已有的配置。

## 查看配置信息

配置信息分为：

- `--local`：局部（当前目录）配置信息 （默认值）
- `--global`：全局配置信息

```bash
# 当前目录
git config --local --list

# 全局
git config --global --list
```

## 配置开发者信息

当安装 Git 后你首先要做的事情是设置**用户名称**和**电子邮件地址**。这是非常重要的，因为每次 Git 提交都会使用该信息，它被永远的嵌入到了你的提交中。

```bash
# 全局配置(所有项目)
git config --global user.name <name>
git config --global user.email <email>

# 当前目录配置(当前项目)
git config user.name <name>
git config user.email <email>
```

📍 **示例：**

```bash
git config --global user.name "Mercedes-benz"
git config --global user.email "mercedes@gmail.com"

git config user.name "Lamborghini"
git config user.email "lammborghini@gmail.com"
```

## 添加配置项

`entry-name` 为配置项名称。

```bash
# 当前目录
git config --local –add <entry-name>

# 全局环境
git config --global –add <entry-name>

# 系统
git config --system –add <entry-name>
```

📍 **示例：**

```bash
git config -–add site.name yiibai
```

注意 add 后面的 `section` 、 `key`、 `value` 一项都不能少，否则添加失败。

## 删除配置项

```bash
# 当前目录
git config --local --unset <entry-name>

# 全局环境
git config --global--unset <entry-name>

# 系统环境
git config --system --unset <entry-name>
```

📍 **示例：**

```bash
git config --local -–unset site.name
```

## 简化命令

将冗长的命令简化。

```bash
git config --global alias.<handle> <command>
```

📍 **示例：**

`git status` 改成 `git st` ，这样可以简化输入命令。

```bash
git config --global alias.st status
```

## 忽略文件的权限变化

不再将文件的权限变化视作改动。

📍 **示例：**

```bash
git config core.fileMode false
```
