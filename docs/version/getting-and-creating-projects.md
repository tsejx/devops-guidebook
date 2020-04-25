---
nav:
  title: 版本管理
  order: 5
title: 获取和创建项目
order: 3
---

# 获取和创建项目

有两种取得 Git 项目仓库的方法：

- 在**现有项目或目录**下导入所有文件到 Git 中
-  从**服务器克隆**到现有的 Git 仓库

## 初始化 git init

> Create an empty Git repository or reinitialize an existing one
>
> 创建一个空的 Git 仓库或重新初始化现有的仓库

### 初始化版本仓库

* 初始化空目录，通过 Git 对该目录进行版本管理
* 初始化已关联版本仓库目录

该命令将创建一个名为 `.git` 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。

📖 **语法：**

```bash
$ git init
```

📖 **语法：**

新建一个目录，将其初始化为 Git 代码库。`<project-name>` 为新建代码库的名称。

```bash
$ git init <project-name>
```

📍 **示例：**

```bash
$ git init git-guidebook
```

## 克隆 git clone

> Clone a repository into a new directory
>
> 将已有存储库克隆到新目录中

### 克隆至本地仓库

克隆一个现有项目和它的整个版本历史。`<url>` 为项目路径，该路径可为**本地路径**，亦可是**远程服务端路径**。

📖 **语法：**

```bash
$ git clone <url>

# 本地仓库
$ git clone /path/to/repository

# 远程仓库
$ git clone username@host:/path/to/repository
```

### 克隆仓库至指定到分支

📖 **语法：**

```bash
$ git clone -b <branch-name> --single-branch <url>
```

📍 **示例：**

```bash
$ git clone -b master --single-branch https://github.com/tsejx/git-guidebook.git
```
