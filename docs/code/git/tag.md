---
nav:
  title: 代码管理
  order: 5
title: 标签 git tag
order: 16
---

# 标签 git tag

> Create, list, delete or verify a tag object signed with GPG
>
> 用于创建，列出，删除或验证使用 GPG 签名的标签对象

`tag` 是 Git 版本库的一个快照，指向某个 commit 的指针。

使用 `tag` 标记发布版本。Git 提供了 `tag` 的增删改查的一系列操作，在 `tag` 的使用上，可谓非常之方便。

`tag` 和 `branch` 有点相似。但是它们的指责分工和本质都是不同的。`tag` 对应某次 commit 是一个点，是不可移动的。

`branch` 对应一系列 `commit`，是很多点连成的一根线，有一个 HEAD 指针，是可以依靠 HEAD 指针移动的。

所以，两者的区别决定了使用方式，改动代码用 `branch`，不该动只查看用 `tag`。

`tag` 和 `branch` 相互配合使用，有时候可以起到非常方便的效果，例如已经发布了 `v1.0`、`v2.0` 和 `v3.0` 三个版本。这个时候，我突然想不改现有代码的前提下，在 `v2.0` 的基础上加个新功能，作为 `v4.0` 发布。就可以检出 `v2.0` 的代码作为一个 `branch`，然后作为开发分支。

## 查看标签

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

## 新建标签

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

## 删除标签

```bash
# 删除本地标签
git tag -d <tag-name>

# 删除远程标签
git push --delete origin <tag-name>
```

## 推送标签

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

## 拉取标签

拉取远程指定标签

```bash
git fetch origin
```

---

**参考资料：**

- [📝 Git 应用详解第八讲：Git 标签、别名与 Git gc](https://juejin.im/post/6844904130977202190)
