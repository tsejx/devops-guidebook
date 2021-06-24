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

`git commit` 命令用于将更改记录（提交）到存储库。将索引库的 **当前内容** 与 **描述更改的用户** 和 **日志消息** 一起存储在新的提交中。

如果您提交，然后立即发现错误，可以使用  [git reset](./reset)  命令恢复。

## 提交至本地仓

`<msg>` 表示提交的版本描述，如果给出了多个 `-m` ，它们的值将作为单独的段落连接起来。

```bash
# 对代码进行提交，会进入 VIM 模式，可对提交信息进行描述
git commit

# 快速提交，只对提交进行单行描述
git commit --message <msg>

git commit -m <msg>
```

📍 **示例：对提交提交进行单行信息描述**

```bash
git commit -m 'the commit messge'
```

如果你想将暂存区指定的文件修改提交到本地仓库区，你可以使用如下的命令。`<file>` 表示你要提交的文件路径，文件可以是多个。

```bash
git commit <file1> <file2> ... -m <message>

# 例如
git commit demo1.js demo2.js -m '提交demo文件'
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

如果你想使用一次新的提交 `commit`，替代上一次提交，那么你可以使用如下命令。

如果代码没有任何新变化，则用来改写上一次 `commit` 的提交信息。

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

## 修改历史记录

先通过 `git log` 查看提交记录

```bash
git log
```

执行 `git rebase` 命令，修改近三次的信息

```bash
git rebase -i HEAD~3
```

将会得到如下信息，这里的提交日志是和 `git log`倒叙排序的，我们要修改的日志信息位于第一位。

```bash
  1 pick 2275781 should find method from parent
  2 pick 223fc80 unit test case
  3 pick 9ac1179 update test case
  4
  5 # Rebase 79db0bd..9ac1179 onto 79db0bd (3 commands)
  6 #
  7 # Commands:
  8 # p, pick = use commit
  9 # r, reword = use commit, but edit the commit message
 10 # e, edit = use commit, but stop for amending
 11 # s, squash = use commit, but meld into previous commit
 12 # f, fixup = like "squash", but discard this commit's log message
 13 # x, exec = run command (the rest of the line) using shell
 14 # d, drop = remove commit
 15 #
 16 # These lines can be re-ordered; they are executed from top to bottom.
 17 #
 18 # If you remove a line here THAT COMMIT WILL BE LOST.
 19 #
 20 # However, if you remove everything, the rebase will be aborted.
 21 #
 22 # Note that empty commits are commented out
```

我们现在要修改 `should find method from parent` 这条日志，那么修改的日志为第一个 `pick` 修改为 `edit`，然后 `:wq` 退出。

```vi
edit 2275781 should find method from parent
pick 223fc80 unit test case
pick 9ac1179 update test case
```

将会看到如下信息，意思就是如果要改日志，执行 `git commit --amend`，如果修改完成后，执行 `git rebase --continue`。

```bash
client_java git:(fix_aop_no_class_defined) git rebase -i HEAD~3
Stopped at 2275781...  should find method from parent
You can amend the commit now, with

  git commit --amend

Once you are satisfied with your changes, run

  git rebase --continue
➜  client_java git:(2275781)
```

正式修改，执行命令 `-s`，就是自动加上 `Signed-off-by`：

```bash
git commit --amend -s
```

修改完成后，`:wq` 退出，然后完成此次 log 的 `rebase`：

```bash
git rebase --continue
```

## 初始化提交记录

> ⚠️ **慎重操作**

也就是把所有的改动都重新放回工作区，并**清空所有的`commit`**，这样就可以重新提交第一个 `commit` 了。

```bash
git update-ref -d HEAD
```

---

**参考资料：**

- [修改 git 历史提交 commit 信息（重写历史）](https://www.jianshu.com/p/0f1fbd50b4be)
