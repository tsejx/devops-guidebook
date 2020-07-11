---
nav:
  title: 版本管理
  order: 5
title: 分支与合并
order: 5
---

# 分支与合并

## 分支 git branch

> List, create, or delete branches
>
> 列出, 创建, 或者删除分支

### 查看分支

📖 **语法：**

```bash
# 查看本地所有分支
git branch

# 查看远程所有分支 -r 相当于 remote
git branch -r

# 查看本地分和远程所有分支 -a 相当于 all
git branch -a

# 查看本地分支关联远程分支的情况
git branch -vv
```

📍 **示例：**

```bash
# 本地分支
git branch
  master
* release/1.0.0

# 远程分支
git branch -a
* dev/1.0.0
  master
  release/1.0.0
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
  remotes/origin/release/1.0.0
```

上面查看本地分支的显示结果中，当前有两个分支：`master` 和 `release/1.0.0`，当前处于在 `release/1.0.0` 分支上，它前面有个星号 `*`。

### 关联远程分支

关联之后，`git branch -vv` 就可以展示关联的远程分支名了，同时推送到远程仓库。

📖 **语法：**

```bash
git branch -u <branch-name>
```

或者在 `git push` 时加上参数 `-u` 参数。

📖 **语法：**

```bash
git push -u origin/<branch-name>
git push --set-upstream origin/<branch-name>
```

### 新建分支

新建一个分支，但依然**停留在当前分支**。`<branch-name>` 为新建分支名称。

📖 **语法：**

```bash
# 基于当前分支末梢新建分支但并不切换分支
git branch <branch-name>

# 基于当前分支末梢新建分支并切换至该分支
git checkout -b <branch-name>

# 基于某次提交、分支或标签创建新分支
git branch <branch-name> <commit-id>

# 新建一个分支，与指定的远程分支建立追踪关系
git branch --track <branch-name> <remote-branch>
```

### 切出分支

切换到指定分支。`<branch-name>` 为切换到的目标分支。

📖 **语法：**

```bash
git checkout <branch-name>
```

📍 **示例：** 切换至 dev/1.0.0 分支上

```bash
git checkout dev/1.0.0
```

### 修改分支

修改指定分支名称。`<branch-name>` 为指定分支新名称。`-m` 即 `--move` 表示移动或重命名和相应的引用日志。

📖 **语法：**

```bash
git branch -m <branch-name>
git branch --move <branch-name>
```

📍 **示例：** 重命名 `dev/1.0.0` 分支为 `develop/1.0.0`

```bash
git branch -m dev/1.0.0 develop/1.0.0
```

### 删除分支

**删除本地分支**

```bash
# 语法
git branch -d <local-branch-name>
git branch --delete <local-branch-name>

# 示例
git push origin -d dev/1.0.0
```

**删除远程分支**

```bash
# 语法
git push origin --delete <branch-name>

git branch -dr [remote/branch]

# 示例
git push origin --delete dev/1.0.0

git branch -dr origin/branchA
```

### 重命名本地分支

📖 **语法：**

```bash
git branch -m <old-branch-name> <new-branch-name>
```

## 查看 git checkout

> Switch branches or restore working tree files
>
> 切换分支或恢复工作树文件。

### 撤销文件修改

📖 **语法：**

```bash
# 放弃工作区所有文件的修改
git checkout .

# 放弃工作区指定文件的修改
git checkout <file>

# 恢复某个提交的指定文件到暂存区和工作区
git checkout <commit> <file>
```

### 切换分支

📖 **语法：**

```bash
# 切换到指定分支
git checkout <branch-name>

# 切换到上一个分支
git checkout -
```

### 切换标签

一般上线之前都会打 `tag`，就是为了防止上线后出现问题，方便快速回退到上一版本。下面的命令是回到某一标签下的状态。

📖 **语法：**

```bash
git checkout -b <branch_name> <tag_name>
```

### 创建分支并切换分支

通过如下命令可以创建一个自定义命名的分支，并切换到该分支上。`<branch-name>` 为分支命名。

📖 **语法：**

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

### 从储藏库中拿出指定提交

📖 **语法：**

```bash
git checkout <stash@{n}> -- <file-name>
```

### 恢复删除的文件

📖 **语法：**

```bash
# 得到 deleting_commit
git rev-list -n 1 HEAD -- <file_path>

# 回到删除文件 deleting_commit 之前的状态
git checkout <deleting_commit>^ -- <file_path>
```

## 合并 git merge

> Join two or more development histories together
>
> 用于将两个或两个以上的开发历史加入(合并)一起。

### 合并分支

以在你的工作目录中*获取（fetch）* 并 *合并（merge）*远端的改动。

如果你要合并指定分支到当前分支。`branch` 为需要合并到当前分支的名称。

📖 **语法：**

```bash
git merge <branch1> <branch2> ...
```

## 储藏 git stash

> Stash the changes in a dirty working directory away
>
> 将更改储藏在脏工作目录中

### 储藏文件修改

储藏文件修改，但是不用提交到版本库。

📖 **语法：**

```bash
# 将所有文件修改添加至暂时储藏库
git stash

# 暂时储藏库包括未跟踪（untracked）的文件
git stash -u
```

### 查看储藏记录

📖 **语法：**

```bash
git stash list
```

### 重回指定储藏版本

重新应用你刚刚实施的储藏（但是储藏的内容仍然在栈上）。

📖 **语法：**

```bash
git stash apply <stash@{n}>
```

也可以应用更早的储藏，你需要通过名称指定它。如果你不指明，Git 默认使用最近的储藏并尝试使用它。

📍 **示例：**

```bash
git stash apply stash@{2}
```

### 重回最后储藏版本

重回最后一个储藏的版本，并删除这个储藏版本库中的版本。

📖 **语法：**

```bash
git stash pop
```

### 移除储藏

你可以运行 `git stash drop` 加上你希望移除的储藏的名称来移除储藏。

📖 **语法：**

```bash
git stash drop <stash@{n}>
```

📍 **示例：**

```bash
git stash drop stash@{0}
```

### 清空储藏

📖 **语法：**

```bash
git stash clear
```

## 标签 git tag

> Create, list, delete or verify a tag object signed with GPG
>
> 用于创建，列出，删除或验证使用 GPG 签名的标签对象

`tag` 是 Git 版本库的一个快照，指向某个 commit 的指针。

使用 `tag` 标记发布版本。Git 提供了 `tag` 的增删改查的一系列操作，在 `tag` 的使用上，可谓非常之方便。

`tag` 和 `branch` 有点相似。但是它们的指责分工和本质都是不同的。`tag` 对应某次 commit 是一个点，是不可移动的。

`branch` 对应一系列 `commit`，是很多点连成的一根线，有一个 HEAD 指针，是可以依靠 HEAD 指针移动的。

所以，两者的区别决定了使用方式，改动代码用 `branch`，不该动只查看用 `tag`。

`tag` 和 `branch` 相互配合使用，有时候可以起到非常方便的效果，例如已经发布了 `v1.0`、`v2.0` 和 `v3.0` 三个版本。这个时候，我突然想不改现有代码的前提下，在 `v2.0` 的基础上加个新功能，作为 `v4.0` 发布。就可以检出 `v2.0` 的代码作为一个 `branch`，然后作为开发分支。

### 查看标签

```bash
# 查看所有标签
git tag

# 查看符合条件的标签
git tag -l <tag>
# 示例：查看标签名开头为v1.的标签
git tag -l v1.*

# 查看标签信息
git show <tag-name>

# 展示当前分支的最近标签
git describe --tags --abbrev=0
```

### 新建标签

> ⚠️ 注意标签无法重命名，需谨慎操作

在当前提交新建标签（默认打在最近一次提交记录上）

```bash
# 语法
git tag <tag-name>

# 示例
git tag v1.0.0
```

在指定提交中新建标签

```bash
# 语法
git tag <tag-name> <commit-id>

# 示例
git tag v1.0.0 f1bb97a
```

新建分支指向标签

```bash
# 语法
git checkout -b <branch-name> <tag-name>

# 示例
git checkout -b branchA v1.0.0
```

### 删除标签

```bash
# 删除本地标签
git tag -d <tag-name>


# 删除远程标签
git push origin <tag-name>
```

### 推送标签

首先要保证本地创建好了标签才可以推送标签到远程仓库。

推送指定标签：

```bash
# 语法
git push <remote> <tag-name>

# 示例
git push
```

```bash
# 推送本地所有标签到远程
git push <remote> --tags

# 示例
git push origin --tags
```

### 拉取标签

拉取远程指定标签

```bash
git fetch origin
```
