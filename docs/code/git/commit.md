---
nav:
  title: 代码管理
  order: 5
title: 提交 git commit
order: 8
---

# 提交 git commit

> Record changes to the repository
>
> 记录对存储库的更改

`git commit` 命令用于将更改记录（提交）到存储库。将索引库的**当前内容**与**描述更改的用户**和**日志消息**一起存储在新的提交中。

如果您提交，然后立即发现错误，可以使用  [git reset](#回滚-git-reset)  命令恢复。

## 提交至本地仓

`<msg>` 表示提交的版本描述，如果给出了多个 `-m` ，它们的值将作为单独的段落连接起来。

```bash
git commit -m <msg>
git commit --message <msg>
```

📍 **示例：**

```bash
git commit -m 'the commit messge'
```

如果你想将暂存区指定的文件修改提交到本地仓库区，你可以使用如下的命令。`<file>` 表示你要提交的文件路径，文件可以是多个。

```bash
git commit <file1> <file2> ... -m <message>
```

## 提交跟踪文件

如果你想将工作区所有自上一次提交 `commit` 之后的变化直接提交到仓库区，你可以使用如下命令，相当于省略了 `git add`。

对于还没有跟踪 `track` 的文件，还是需要执行 `git add <file>` 命令。

```bash
git commit -a
```

## 提交时查看文件修改详情

```bash
git commit -v
```

## 增补提交

如果你想重做上一次 `commit`，并包括指定文件的新变化，那么你可以使用如下命令。

增补提交，会使用与当前提交节点相同的父节点进行一次新的提交，旧的提交将会被取消。

```bash
git commit -amend <file1> <file2>
```

如果你想使用一次新的提交 `commit`，替代上一次提交，那么你可以使用如下命令。如果代码没有任何新变化，则用来改写上一次 `commit` 的提交信息。

```bash
git commit -amend -m <message>
```

增补提交能够不 `reset` 上次 `commit` 而通过再 `commit` 覆盖。

## 修改提交备注内容

修改最近一次 commit message

```bash
# 语法
git commit --amend --author=<author>

# 示例 修改提交者
git commit --amend --author='tsejx <tsejx@foxmail.com>'

# 修改后可以用 log 命令查看
git log --pretty=oneline
```

## 初始化提交记录

> ⚠️ **慎重操作**

也就是把所有的改动都重新放回工作区，并**清空所有的`commit`**，这样就可以重新提交第一个 `commit` 了。

```bash
git update-ref -d HEAD
```
