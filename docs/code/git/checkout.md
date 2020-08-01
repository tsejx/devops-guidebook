---
nav:
  title: 代码管理
  order: 5
title: 查看 git checkout
order: 13
---

# 查看 git checkout

> Switch branches or restore working tree files
>
> 切换分支或恢复工作树文件。

## 撤销文件修改

```bash
# 放弃工作区所有文件的修改
git checkout .

# 放弃工作区指定文件的修改
git checkout <file>

# 恢复某个提交的指定文件到暂存区和工作区
git checkout <commit> <file>
```

## 切换分支

```bash
# 切换到指定分支
git checkout <branch-name>

# 切换到上一个分支
git checkout -
```

## 切换标签

一般上线之前都会打 `tag`，就是为了防止上线后出现问题，方便快速回退到上一版本。下面的命令是回到某一标签下的状态。

```bash
git checkout -b <branch_name> <tag_name>
```

## 创建分支并切换分支

通过如下命令可以创建一个自定义命名的分支，并切换到该分支上。`<branch-name>` 为分支命名。

```bash
# 切换的分支保留提交记录日志
git checkout -b <branch-name>

# 切换的分支重写提交记录日志
git checkout --orphan <branch-name>
```

创建一个命名为 `feature_x` 的分支，并切换到该分支上。

📍 **示例：**

```bash
git checkout -b feature_x
```

## 从储藏库中拿出指定提交

```bash
git checkout <stash@{n}> -- <file-name>
```

## 恢复误删的文件

恢复本地工作区文件的撤回。

```bash
# 撤回已删除文件 index.md
git checkout index.md
```

## 恢复误删的本地分支

本地分支拉取之后，由于疏忽被删除，而且本地的分支并没有被同步到远程分支上，此时想要恢复本地分支。

误删的分支为 `feature/delete`，使用 `git reflog` 命令可查看到该仓库下的所有历史操作。

```bash
# 查看该仓库所有历史操作
git reflog

# 语法
git checkout -b <branch-name> <commit-id>

# 示例
git checkout -b feature/delete HEAD@{2}
```

命令执行完成后，分支恢复到 `HEAD@{2}` 的快照，即从 `master` 分支拉取 `feature/delete` 分支的内容，仍然缺少 **新增 xxx 文件** 的提交，直接将文件内容恢复到最新的提交内容，使用命令 `git reset --hard HEAD@{1}` 即可实现硬性覆盖本地工作区内容的目的。`git reflog` 命令获取到的内容为本地仓库所有发生过的变更，可谓恢复利器，既可向前追溯，亦可向后调整，满满的时光追溯器的感觉。
