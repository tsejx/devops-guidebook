---
nav:
  title: 代码管理
  order: 5
title: 删除 git rm
order: 10
---

# 删除 git rm

> Remove files from the working tree and from the index
>
> 用于从工作区和索引中删除文件

## 删除物理文件

当我们需要删除暂存区或分支上的文件，同时工作区也不需要这个文件了。

```bash
git rm <file1> <file2> ...
```

## 删除文件修改记录

当我们需要删除**暂存区或分支**上的文件，但本地又需要使用，只是不希望这个文件被版本库控制。

```bash
git rm --cached <file>
```
