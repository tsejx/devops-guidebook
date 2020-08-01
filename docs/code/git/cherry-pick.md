---
nav:
  title: 代码管理
  order: 5
title: 移植 git cherry-pick
order: 26
---

# 移植 git cherry-pick

> Apply the changes introduced by some existing commits

**适用场景：**

合并其他分支中的某个 commit 或者某个范围内的 commits 到当前分支。比如两个分支差异较大，整个分支的合并会带来 N 多冲突，且因为历史原因，不好确定哪部分代码是正确的，但是又有这样的需求，需要将其中一个分支中的某部分功能合并到另外的分支，这种情况下，可以用此命令，将涉及该功能的某些 commit 合并到目标分支。

## 基本用法

```bash
# 将指定的提交 commit 应用于其他分支
git cherry-pick <commitHash>
```

上面命令就会指定的提交 commitHash，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

举例来说，代码仓库有 `master` 和 `feature` 分支。

```
  a - b - c - d   Master
        \
          e - f - g Feature
```

现在将提交 `f` 应用到 `master` 分支。

```bash
# 切换到 master 分支
git checkout master

# Cherry Pick 操作
git cherry-pick f
```

上面的操作完成以后，代码库就变成了下面的样子。

```
  a - b - c - d - f   Master
        \
          e - f - g Feature
```

从上面可以看到，`master` 分支的末尾增加了一个提交 f。

`git cherry-pick` 命令的参数，不一定是提交的 `哈希值`，`分支名` 也是可以的，表示转移该分支的最新提交。

```bash
# 语法
git cherry-pick branch-name

# 示例
git cherry-pick feature
```

上面代码表示将 `feature` 分支的最近一次提交，转移到当前分支。

## 其他命令

```bash
# 单独合并某个 commit_id 到当前分支
git cherry-pick <commit_id>

# 同上，只是在合并的时候，保留原提交者信息
git cherry-pick -x <commit_id>

# 合并某一范围内的commit 到当前分支, 不包括 <start_commit_id>
git cherry-pick <start_commit_id>..<end_commit_id>

# 同上，区别：包括<start_commit_id>
git cherry-pick <start_commit_id>^..<end_commit_id>
```

> 注意 :
>
> 1. 如果出现合并冲突，按照正常的文件冲突解决就好；
> 2. <commit_id>取前 6 位就行；
> 3. <start_commit_id>在时间上必须早于<end_commit_id>;
> 4. 如果想使用合并某一范围内的 commit 功能，git 版本需 >=1.7.2;

---

**参考资料：**

- [阮一峰：git cherry-pick 教程](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)
