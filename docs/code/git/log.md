---
nav:
  title: 代码管理
  order: 5
title: 日志 git log
order: 21
---

# 日志 git log

> Show commit logs
>
> 用于显示提交日志信息

`git log` 命令用于显示提交日志信息。

该命令采用适用于 `git rev-list` 命令的选项来控制显示的内容以及如何以及适用于 `git diff- *` 命令的选项，以控制如何更改每个提交引入的内容。

## 查看提交日志

```bash
# 查看所有提交记录
git log

# 查看指定次数提交记录
git log -n

# 根据ID查看提交记录
git log <commit-id>

# 根据多个ID查看提交记录
git log <commit1_id> <commit2_id>

# 示例：查看某次提交
git log c5f8a258babf5eec54edc794ff980d8340396592

# 查看最后一次提交记录
git log HEAD

# 查看倒数第二次提交记录
git log HEAD^
git log HEAD~1

#查看最近三次的提交日志
git log -3
```

## 查看提交改动细节

```bash
git log -p
```

## 查看命令日志

```bash
git relog
```
