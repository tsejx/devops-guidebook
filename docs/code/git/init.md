---
nav:
  title: 代码管理
  order: 5
title: 初始化 git init
order: 4
---

# 初始化 git init

> Create an empty Git repository or reinitialize an existing one
>
> 创建一个空的 Git 仓库或重新初始化现有的仓库

## 初始化版本仓库

- 初始化空目录，通过 Git 对该目录进行版本管理
- 初始化已关联版本仓库目录

该命令将创建一个名为 `.git` 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。

```bash
git init
```

新建一个目录，将其初始化为 Git 代码库。`<project-name>` 为新建代码库的名称。

```bash
git init <project-name>
```

📍 **示例：**

```bash
git init git-guidebook
```
