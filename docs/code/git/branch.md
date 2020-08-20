---
nav:
  title: 代码管理
  order: 5
title: 分支 git branch
order: 12
---

# 分支 git branch

> List, create, or delete branches
>
> 列出, 创建, 或者删除分支

## 查看分支

### 查看本地分支

```bash
# 查看本地所有分支
git branch
```

### 查看远程分支

```bash
# 查看远程所有分支 -r 相当于 --remote
git branch -r

# 查看本地分和远程所有分支 -a 相当于 all
git branch -a

# 查看本地分支关联远程分支的情况（可以看到本地与远程的差距）
git branch -v
```

更新远程分支列表：

```bash
git remote update origin --prune
```

## 新建分支

新建一个分支，但依然**停留在当前分支**。

```bash
# 基于当前分支末梢新建分支但并不切换分支
git branch <branchname>

# 基于当前分支末梢新建分支并切换至该分支
git checkout -b <branchname>

# 基于某次提交、分支或标签创建新分支
git branch <branchname> <commit-id>

# 新建一个分支，与指定的远程分支建立追踪关系
git branch --track <branch-name> <remote-branch>
```

### 关联远程分支

关联之后，`git branch -vv` 就可以展示关联的远程分支名了，同时推送到远程仓库。

```bash
git branch -u <branch-name>
```

或者在 `git push` 时加上参数 `-u` 参数。

```bash
git push -u origin/<branch-name>
git push --set-upstream origin/<branch-name>
```

## 切换分支

切换到指定分支。`<branch-name>` 为切换到的目标分支。

```bash
git checkout <branch-name>
```

## 修改分支

修改指定分支名称。`<branch-name>` 为指定分支新名称。`-m` 即 `--move` 表示移动或重命名和相应的引用日志。

```bash
# 修改指定分支名称
git branch -m <old_name> <new_name>
```

## 删除分支

### 删除本地分支

```bash
git branch -d <local-branch-name>
```

### 删除远程分支

```bash
# 语法
git push origin --delete <branch-name>

git branch -dr [remote/branch]

# 示例：删除远程分支 feature/test
git push origin --delete feature/test

git branch -dr origin/branchA

# 删除后推送至远程仓库
git push origin:<branchname>
```
