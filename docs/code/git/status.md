---
nav:
  title: 代码管理
  order: 5
title: 状态 git status
order: 7
---

# 状态 git status

> Show the working tree status
>
> 显示工作树的状态

执行该命令会返回三部分信息：

1. 拟提交的变更：这是已经放入暂存区，准备 `commit` 提交的变更
2. 未暂存的变更：这是工作目录和暂存区快照之间存在差异的文件列表
3. 未跟踪的文件：这类文件是被版本管理忽略的文件

`git status` 不显示已经 `commit` 到项目历史中去的信息。看项目历史的信息要使用 [`git log`](./6_Inspection%26Comparison.md#日志-log)。

## 查看版本修改

在每次执行 `git commit` 之前先使用 `git status` 检查文件状态是一个很好的习惯，这样能防止你不小心提交了您不想提交的东西。

```bash
git status
```

## 查看忽略文件

可以查看添加到 `.gitignore` 的文件的状态信息。

```bash
git status --ignored
```
