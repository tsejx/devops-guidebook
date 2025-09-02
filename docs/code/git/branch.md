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

### 按照特定规则查看分支

```bash
# 按修改时间排序显示分支
git for-each-ref --sort=-committerdate

# 把日期也显示出来
git for-each-ref --sort='-committerdate' --format='*** %(refname)%09%(committerdate)' | sed -e 's-refs/heads/--'

# 如果加上 `refs/heads/` ，可以只显示本地分支
git for-each-ref --sort='-committerdate' --format='*** %(refname)%09%(committerdate)' refs/heads | sed -e 's-refs/heads/--'

# 加上颜色显示（强烈推荐）
git for-each-ref --sort=-committerdate refs/heads/ --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:red)%(committerdate:relative)%(color:reset) - %(contents:subject)'

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

# 删除本地分支的同时也删除远程分支（my-branch）
git branch -D my-branch && git push origin --delete my-branch
```

### 批量删除分支

注意：
- `-d`：参数是安全删除（分支未合并时不会删掉）
- `-D`：参数是强制删除

```bash
# 删除本地所有以 `feature/` 开头的分支
git branch | grep 'feature/' | xargs git branch -D

# 删除远程所有以 `feature/` 开头的分支
git branch -r | grep 'origin/feature/' | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```