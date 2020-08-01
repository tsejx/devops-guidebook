---
nav:
  title: 代码管理
  order: 5
title: 推送 git push
order: 19
---

# 推送 git push

> Update remote refs along with associated objects
>
> 将本地分支的更新，推送到远程主机。

## 推送到远程仓库

执行如下命令以将本地仓库 HEAD 中的版本改动提交到远程仓库。

```bash
git push
```

上面命令表示，将本地的 `master` 分支推送到 `origin` 主机的 `master` 分支。如果 `master` 不存在，则会被新建。

```bash
git push origin master
```

可以将 master 换成你想要推送的任何分支。

## 删除指定的远程分支

```bash
git push origin --delete <branch-name>
```

下面命令表示删除`origin`主机的`master`分支。如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

📍 **示例：**

```bash
git push origin --delete master
# 等同于
git push origin
```

## 推送标签修改

```bash
# 推送标签
git push origin --tags

# 删除远程标签
git push origin :<tag-name>
```

## 推送分支修改

将当前分支推送到远程的同名的简单方法。

```bash
git push origin HEAD
```
