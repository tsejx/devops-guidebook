---
nav:
  title: 版本管理
  order: 5
title: 共享和更新项目
order: 6
---

# 共享和更新项目

## 提取 git fetch

> Download objects and refs from another repository
>
> 用于从另一个存储库下载对象和引用

### 获取远程分支列表

可以用于本地显示的更新远程分支列表。

```bash
# 语法
git fetch <remote>

# 示例
git fetch origin
```

### 本地删除远程已废弃分支

在本地删除远程已经不存在的分支

```bash
git fetch --prune

# 或者
git fetch -p

# 删除指定分支
git fetch -p origin

git remote prune origin
```

### 获取远程指定分支提交记录

一旦远程主机的版本库有了更新，需要将这些更新取回本地。

```bash
# 语法
git fetch <repository>

# 示例
git fetch git@github.com:facebook/react.git
```

### 拉取 `pull`

> Fetch from and integrate with another repository or a local branch
>
> 用于从另一个存储库或本地分支获取并集成(整合)。

### 获取版本修改记录

📖 **语法：**

```bash
# 更新本地仓库至最新改动
$ git pull

# 当本地分支与远程分支没有共同祖先
$ git pull --rebase origin master
```

## 推送 git push

> Update remote refs along with associated objects
>
> 将本地分支的更新，推送到远程主机。

### 推送到远程仓库

执行如下命令以将本地仓库 HEAD 中的版本改动提交到远程仓库。

📖 **语法：**

```bash
$ git push
```

上面命令表示，将本地的 `master` 分支推送到 `origin` 主机的 `master` 分支。如果 `master` 不存在，则会被新建。

📖 **语法：**

```bash
$ git push origin master
```

可以将 master 换成你想要推送的任何分支。

### 删除指定的远程分支

📖 **语法：**

```bash
$ git push origin --delete <branch-name>
```

下面命令表示删除`origin`主机的`master`分支。如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

📍 **示例：**

```bash
$ git push origin --delete master
# 等同于
$ git push origin
```

### 推送标签修改

📖 **语法：**

```bash
# 推送标签
$ git push origin --tags

# 删除远程标签
$ git push origin :<tag-name>
```

### 推送分支修改

将当前分支推送到远程的同名的简单方法。

📖 **语法：**

```bash
$ git push origin HEAD
```

## 远程 git remote

> Manage set of tracked repositories
>
> 管理一组跟踪的存储库。

📖 **语法：**

```bash
# 查看远程分支
$ git remote

# 列出远程分支的详细信息
$ git remote -v

# 查看指定远程仓库信息
$ git remote show <remote>

# 添加新的远程仓库
$ git remote add orgin <shortname> <url>

# 获取远程仓库变化
$ git pull <remote> <branch>
```
