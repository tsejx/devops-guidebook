---
nav:
  title: 版本管理
  order: 5
title: 基本快照
order: 4
---

# 基本快照

## 添加 git add

> Add file contents to the index
>
> 将文件内容添加到索引

`git add` 命令将文件内容添加到**索引库**（将修改记录添加到暂存区）。也就是将要提交的文件的信息添加到索引库中。

### 添加修改记录至暂存区

📖 **语法：**

```bash
# 文件
$ git add <file1> <file2> <file3> ...

# 目录
$ git add <dir>

# 所有目录文件(包括修过过的文件、新建的文件，但不包括删除的文件)
$ git add .
```

📍 **示例：**

```bash
# 提交单个文件
$ git add index.html

# 提交 markdown 文件
$ git add *.md
```

### 分次添加修改至暂存区

添加每个变化前，都会要求确认。对于同一个文件的多处变化，可以实现分次提交。

`-p` 参数相当于 `--patch`，表示多次提交。

📖 **语法：**

```bash
$ git add -p
$ git add --patch
```

📍 **示例：**

```bash
# 将以Controller结尾的文件的所有修改添加到暂存区
$ git add *Controller

# 将所有以Hello开头的文件的修改添加到暂存区 例如:HelloWorld.txt,Hello.java,HelloGit.txt ...
$ git add Hello*

# 将以Hello开头后面只有一位的文件的修改提交到暂存区 例如:Hello1.txt,HelloA.java 如果是HelloGit.txt或者Hello.java是不会被添加的$ git add [file1] [file2] ...
$ git add Hello?
```

### 添加跟踪修改至暂存区

标记本地有改动（**包括删除和修改，但不包括新建**）的**已经追踪**的文件，并添加至暂存库。

`-u` 即 `--update` 表示更新索引，使其具有与 `<pathspec>` 匹配的条目。

省略 `<path>` 表示  `.` ，即当前目录。

📖 **语法：**

```bash
$ git add -u [<pathspec>]
$ git add --update [<pathspec>]
```

### 添加修改到暂存区

标记本地所有改动的文件（包括删除、修改和新建），并添加至暂存库。

`-A` 即 `--all` 或 `--no-ignore-removal` 表示更新索引，不仅在工作树具有匹配 `<pathspec>` 的文件的位置，而且索引已经有条目的位置。

📖 **语法：**

```bash
$ git add -A
$ git add --all
$ git add --no-ignore-removal
```

`git add -A` 相当于同时执行 `git add .` 和 `git add -u`。

## 状态 git status

> Show the working tree status
>
> 显示工作树的状态

执行该命令会返回三部分信息：

1. 拟提交的变更：这是已经放入暂存区，准备 `commit` 提交的变更
2. 未暂存的变更：这是工作目录和暂存区快照之间存在差异的文件列表
3. 未跟踪的文件：这类文件是被版本管理忽略的文件

`git status` 不显示已经 `commit` 到项目历史中去的信息。看项目历史的信息要使用 [`git log`](./6_Inspection%26Comparison.md#日志-log)。

### 查看版本修改

在每次执行 `git commit` 之前先使用 `git status` 检查文件状态是一个很好的习惯，这样能防止你不小心提交了您不想提交的东西。

📖 **语法：**

```bash
$ git status
```

### 查看忽略文件

可以查看添加到 `.gitignore` 的文件的状态信息。

📖 **语法：**

```bash
$ git status --ignored
```

## 提交 git commit

> Record changes to the repository
>
> 记录对存储库的更改

`git commit` 命令用于将更改记录（提交）到存储库。将索引库的**当前内容**与**描述更改的用户**和**日志消息**一起存储在新的提交中。

如果您提交，然后立即发现错误，可以使用 [git reset](#回滚-git-reset) 命令恢复。

### 提交至本地仓

`<msg>` 表示提交的版本描述，如果给出了多个 `-m` ，它们的值将作为单独的段落连接起来。

📖 **语法：**

```bash
$ git commit -m <msg>
$ git commit --message <msg>
```

📍 **示例：**

```bash
$ git commit -m 'the commit messge'
```

如果你想将暂存区指定的文件修改提交到本地仓库区，你可以使用如下的命令。`<file>` 表示你要提交的文件路径，文件可以是多个。

📖 **语法：**

```bash
$ git commit <file1> <file2> ... -m <message>
```

### 提交跟踪文件

如果你想将工作区所有自上一次提交 `commit` 之后的变化直接提交到仓库区，你可以使用如下命令，相当于省略了 `git add`。

对于还没有跟踪 `track` 的文件，还是需要执行 `git add <file>` 命令。

📖 **语法：**

```bash
$ git commit -a
```

### 提交时查看文件修改详情

📖 **语法：**

```bash
$ git commit -v
```

### 增补提交

如果你想重做上一次 `commit`，并包括指定文件的新变化，那么你可以使用如下命令。

增补提交，会使用与当前提交节点相同的父节点进行一次新的提交，旧的提交将会被取消。

📖 **语法：**

```bash
$ git commit -amend <file1> <file2>
```

如果你想使用一次新的提交 `commit`，替代上一次提交，那么你可以使用如下命令。如果代码没有任何新变化，则用来改写上一次 `commit` 的提交信息。

📖 **语法：**


```bash
$ git commit -amend -m <message>
```

### 修改提交者信息

📖 **语法：**

```bash
$ git commit --amend --author=<author>
```

📍 **示例：**

```bash
$ git commit --amend --author='tsejx <tsejx@foxmail.com>'
```

### 初始化提交记录

> ⚠️ **慎重操作**

也就是把所有的改动都重新放回工作区，并**清空所有的`commit`**，这样就可以重新提交第一个 `commit` 了。

📖 **语法：**

```bash
$ git update-ref -d HEAD
```

## 撤销 git reset

> Reset current HEAD to the specified state
>
> 用于将当前 `HEAD` 复位到指定状态（一般用于撤消之前的一些操作）

### 撤销暂存

相当于对 `git add` 命令的反向操作。

📖 **语法：**

```bash
# 撤销暂存区的修改，重新放回工作区
$ git reset <file-name>

# 回退暂存区里的文件，还原为（HEAD commit 里面该文件的状态）
# 会撤销从上次提交之后的一些操作
$ git reset HEAD -- <file-name>

# 重置暂存区与工作区，与上一次提交保持一致
$ git reset --hard
```

### 撤销到某个提交版本

和 `revert` 的区别：`reset` 命令会抹去某个提交记录 `commit id` 之后的所有提交 `commit`。

📍 **示例：**

```bash
# 回滚当前分支的指针到指定提交版本，同时重置暂存区，但工作区不变（默认就是-mixed参数）
$ git reset <commit-id>

# 回滚至上个版本，它将重置HEAD到另外一个提交记录,并且重置暂存区以便和HEAD相匹配，但是也到此为止。工作区不会被更改。
$ git reset -mixed HEAD^

# 回退至三个版本之前，只回退了提交的信息，暂存区和工作区与回退之前保持一致。如果还要提交，直接commit即可。
$ git reset -soft HEAD~3

# 回退到指定的提交版本，暂存区和工作区也会与变为指定提交版本一致
$ git reset --hard <commit-id>

# 回退到指定提交版本，但保持暂存区和工作区不变
$ git reset --keep <commit-id>
```

### 中断工作流程处理

在实际开发中经常出现这样的情形：你正在开发一个大的新功能（工作在分支：`feature` 中），此时来了一个紧急的 BUG 需要修复，但是目前在工作区中的内容还没有成型，还不足以提交，但是又必须切换的另外的分支去修改 BUG。

📍 **示例：**

```bash
# you were working in 'feature' branch
$ git checkout feature

# develop new feature
$ git commit -a -m "snapshot WIP" 						# (1)
$ git checkout master

# fix bug
$ git commit				# commit with real log

$ git checkout feature
$ git reset --soft HEAD^ 	# go back to WIP state		# (2)
$ git reset												# (3)
```

1. 这次属于临时提交，因此随便添加一个临时注释即可
2. 这次 `reset` 删除了 `WIP commit`，并且把工作区设置成提交 WIP 快照之前的状态。
3. 此时，在索引中依然遗留着“snapshot WIP”提交时所做的未提交变化，`git reset` 将会清理索引成为尚未提交”*snapshot WIP*“时的状态便于接下来继续工作。

## 删除 git rm

> Remove files from the working tree and from the index
>
> 用于从工作区和索引中删除文件

### 删除物理文件

当我们需要删除暂存区或分支上的文件，同时工作区也不需要这个文件了。

📖 **语法：**

```bash
$ git rm <file1> <file2> ...
```

### 删除文件修改记录

当我们需要删除**暂存区或分支**上的文件，但本地又需要使用，只是不希望这个文件被版本库控制。

📖 **语法：**

```bash
$ git rm --cached <file>
```

## 移动和重命名 git mv

> Move or rename a file, a directory, or a symlin
>
> 用于移动或重命名文件，目录或符号链接。

### 重命名文件

如果你想重命名文件，并且将这个改名放入暂存区。`source` 必须存在，并且是文件，符号链接或目录。`destination` 为重命名后的名称。

📖 **语法：**

```bash
$ git mv <source> <destination>
```

### 移动文件

移动 `<source>` 到 `<destination directory>` 。最后一个参数必须是目标目录。

索引在成功完成后更新，但仍必须提交更改。

📖 **语法：**

```bash
$ git mv <source> ... <destination directory>
```
