---
nav:
  title: 版本管理
  order: 5
title: 检查和比较
order: 7
---

# 检查和比较

## 日志 git log

> Show commit logs
>
> 用于显示提交日志信息

`git log ` 命令用于显示提交日志信息。

该命令采用适用于 `git rev-list` 命令的选项来控制显示的内容以及如何以及适用于 `git diff- *` 命令的选项，以控制如何更改每个提交引入的内容。

### 查看提交日志

📖 **语法：**

```bash
# 查看所有提交记录
$ git log

# 查看指定次数提交记录
$ git log -n

# 根据ID查看提交记录
$ git log <commit-id>

# 根据多个ID查看提交记录
$ git log <commit1_id> <commit2_id>

# 查看最后一次提交记录
$ git log HEAD

# 查看倒数第二次提交记录
$ git log HEAD^
$ git log HEAD~1
```






查看最近三次的提交日志。

```bash
$ git log -3
```

```bash
$ git log c5f8a258babf5eec54edc794ff980d8340396592
```

### 查看命令日志

📖 **语法：**

```bash
$ git relog
```

## 差异 git diff

> how changes between commits, commit and working tree, etc
>
> 用于显示提交和工作树等之间的更改。此命令比较的是工作目录中当前文件和暂存区域快照之间的差异,也就是修改之后还没有暂存起来的变化内容。

### 查看工作区与暂存区差异

查看文件在工作区与暂存区的差别。

📖 **语法：**

```bash
$ git diff <filename>
```

如果还没 add 到暂存区，则查看文件自身修改前后的差别。也可查看和另一分支的区别。

📖 **语法：**

```bash
$ git diff <branch> <filename>
```

### 查暂存区与最近版本的差异

表示查看已经 add 进暂存区但是尚未 commit 的内容同最新一次 commit 时的内容的差异。

📖 **语法：**

```bash
$ git diff --cached <filename>
```

如果你要比较指定仓库版本。

📖 **语法：**

```bash
$ git diff --cached <commit> <filename>
```

### 查看工作区与最近版本间差异

查看工作区同 Git 仓库指定提交版本的差异。

📖 **语法：**

```bash
$ git diff <commit> <filename>
```

### 查看提交版本间的差异

📖 **语法：**

```bash
$ git diff <commit> <commit>
```
### 查看工作区、暂存区和最近版本间的差异

📖 **语法：**

```bash
$ git diff HEAD
```

