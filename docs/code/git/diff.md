---
nav:
  title: 代码管理
  order: 5
title: 差异 git diff
order: 22
---

# 差异 git diff

> how changes between commits, commit and working tree, etc
>
> 用于显示提交和工作树等之间的更改。此命令比较的是工作目录中当前文件和暂存区域快照之间的差异,也就是修改之后还没有暂存起来的变化内容。

## 查看工作区与暂存区差异

查看文件在工作区与暂存区的差别。

```bash
git diff <filename>
```

如果还没 add 到暂存区，则查看文件自身修改前后的差别。也可查看和另一分支的区别。

```bash
git diff <branch> <filename>
```

## 查暂存区与最近版本的差异

表示查看已经 add 进暂存区但是尚未 commit 的内容同最新一次 commit 时的内容的差异。

```bash
git diff --cached <filename>
```

如果你要比较指定仓库版本。

```bash
git diff --cached <commit> <filename>
```

## 查看工作区与最近版本间差异

查看工作区同 Git 仓库指定提交版本的差异。

```bash
git diff <commit> <filename>
```

## 查看提交版本间的差异

```bash
git diff <commit> <commit>
```

## 查看工作区、暂存区和最近版本间的差异

```bash
git diff HEAD
```
