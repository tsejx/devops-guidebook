---
nav:
  title: 代码管理
  order: 5
title: 撤销 git reset
order: 9
---

# 撤销 git reset

> Reset current HEAD to the specified state
>
> 用于将当前 `HEAD` 复位到指定状态（一般用于撤消之前的一些操作）

## 撤销暂存

相当于对 `git add` 命令的反向操作。

和 `revert` 的区别：`reset` 命令会抹去某个提交记录 `commit id` 之后的所有提交 `commit`。

```bash
# 撤销暂存区的修改，重新放回工作区
git reset <file-name>

# 回退 add 到暂存区里的文件，还原为（HEAD commit 里面该文件的状态）
# 会撤销从上次提交之后的一些操作
git reset HEAD

git reset HEAD -- <file-name>

# 回滚当前分支的指针到指定提交版本，同时重置暂存区，但工作区不变（默认就是-mixed参数）
git reset <commit-id>
```

### 已提交本地需撤回

已经将更改提交 commit 到本地，需要撤回提交。

```bash
# 语法
git reset --soft <commit-id>

git reset --soft <HEAD~n>

# 示例
# 回退上次提交 coomit 的修改记录放回暂存区（也就是 add 之后存放区域）
git reset --soft HEAD~1

# 回退至三个版本之前，只回退了提交的信息，暂存区和工作区与回退之前保持一致
# 如果还要提交，直接 commit 即可
git reset --soft HEAD~3
```

回退至指定版本

```bash
# 回退至指定提交版本
# 先查看提交日志
git log
> commit 2xx
> commit 1xx
# 回退到 1xx
git reset 1xx
```

### 用新更改替换撤回的更改

```bash
# 回滚至上个版本，它将重置 HEAD 到另外一个提交记录，并且重置暂存区以便和 HEAD 相匹配，但是也到此为止。工作区不会被更改。
git reset --mixed HEAD^

# 回退到指定提交版本，但保持暂存区和工作区不变
git reset --keep <commit-id>
```

已变更的文件都未添加到暂存区，撤销了 commit 和 add 的操作。

### 本地提交错误文件

回到某次提交的状态，修改都会抹掉，所以谨慎使用。

```bash
# 重置暂存区与工作区，与上一次提交保持一致
git reset --hard

# 回退到指定的提交版本，暂存区和工作区也会与变为指定提交版本一致
git reset --hard <commit-id>
```

已追踪文件的变更内容都消失了，撤销了 `commit` 和 `add` 的操作，同时撤销了本地已追踪内容的修改；未追踪的内容不会被改变。从上面的效果可以看到，文件的修改都会被撤销。-hard 参数需要谨慎使用。

## 中断工作流程处理

在实际开发中经常出现这样的情形：你正在开发一个大的新功能（工作在分支：`feature`  中），此时来了一个紧急的 BUG 需要修复，但是目前在工作区中的内容还没有成型，还不足以提交，但是又必须切换的另外的分支去修改 BUG。

📍 **示例：**

```bash
# you were working in 'feature' branch
git checkout feature

# develop new feature
git commit -a -m "snapshot WIP" 						# (1)
git checkout master

# fix bug
git commit				# commit with real log

git checkout feature
git reset --soft HEAD^ 	# go back to WIP state		# (2)
git reset												# (3)
```

1. 这次属于临时提交，因此随便添加一个临时注释即可
2. 这次 `reset` 删除了 `WIP commit`，并且把工作区设置成提交 WIP 快照之前的状态。
3. 此时，在索引中依然遗留着“snapshot WIP”提交时所做的未提交变化，`git reset` 将会清理索引成为尚未提交”_snapshot WIP_“时的状态便于接下来继续工作。
