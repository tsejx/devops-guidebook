---
nav:
  title: 代码管理
  order: 5
title: 添加 git add
order: 6
---

# 添加 git add

> Add file contents to the index
>
> 将文件内容添加到索引

`git add` 命令将文件内容添加到**索引库**（将修改记录添加到暂存区）。也就是将要提交的文件的信息添加到索引库中。

## 添加修改记录至暂存区

```bash
# 文件
git add <file1> <file2> <file3> ...

# 目录
git add <dir>

# 所有目录文件(包括修过过的文件、新建的文件，但不包括删除的文件)
git add .
```

📍 **示例：**

```bash
# 提交单个文件
git add index.html

# 提交 markdown 文件
git add *.md
```

## 分次添加修改至暂存区

添加每个变化前，都会要求确认。对于同一个文件的多处变化，可以实现分次提交。

`-p` 参数相当于 `--patch`，表示多次提交。

```bash
git add -p
git add --patch
```

📍 **示例：**

```bash
# 将以Controller结尾的文件的所有修改添加到暂存区
git add *Controller

# 将所有以Hello开头的文件的修改添加到暂存区 例如:HelloWorld.txt,Hello.java,HelloGit.txt ...
git add Hello*

# 将以Hello开头后面只有一位的文件的修改提交到暂存区 例如:Hello1.txt,HelloA.java 如果是HelloGit.txt或者Hello.java是不会被添加的git add [file1] [file2] ...
git add Hello?
```

## 添加跟踪修改至暂存区

标记本地有改动（**包括删除和修改，但不包括新建**）的**已经追踪**的文件，并添加至暂存库。

`-u` 即 `--update` 表示更新索引，使其具有与 `<pathspec>` 匹配的条目。

省略 `<path>` 表示 `.` ，即当前目录。

```bash
git add -u [<pathspec>]
git add --update [<pathspec>]
```

## 添加修改到暂存区

标记本地所有改动的文件（包括删除、修改和新建），并添加至暂存库。

`-A` 即 `--all` 或 `--no-ignore-removal` 表示更新索引，不仅在工作树具有匹配 `<pathspec>` 的文件的位置，而且索引已经有条目的位置。

```bash
git add -A
git add --all
git add --no-ignore-removal
```

`git add -A` 相当于同时执行 `git add .` 和 `git add -u`。
