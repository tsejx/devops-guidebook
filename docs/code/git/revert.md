---
nav:
  title: 代码管理
  order: 5
title: 还原 git revert
order: 24
---

# 还原 git revert

> Revert some existing commits
>
> 恢复一些现有的提交

开发者可以使用 `git revert` 命令撤销已经 `push` 到远程仓库的 `commit` 提交。

当你想使用 `git reset` 或 `git rebase -i` 从历史记录中删除上一次 `commit` 提交，这也许不是一种很好的操作方式，主要是因为这会导致远程仓库与其他协作成员的本地仓库不同步。

![Revert](../../assets/git/undoing_changes_001.png)

## 还原提交

`git revert` 会提交一个新的版本，将需要 `revert` 的版本的内容再反向修改回去，版本会递增，不影响之前提交的内容。

```bash
# 还原前一次 commit
git revert HEAD

# 还原前前一次 commit
git revert HEAD^

# 还原指定版本
git revert <commit-id>
```

`reset` 如上 **本地文件撤销** 例子所述，会删除掉原本已有的提交记录，在合并分支中，会删除原本合并分支的记录。`revert` 则有不同，会保留原本合并分支的记录，并在其上新增一条提交记录，便于之后有需要仍然能够回溯到 `revert` 之前的状态。

从需要提交到远程分支的角度来讲，`reset` 能够 **毁尸灭迹**，不让别人发现我们曾经错误的合并过分支（注：多人协作中，需要谨慎使用）；`revert` 则会将合并分支和撤回记录一并显示在远程提交记录上。
