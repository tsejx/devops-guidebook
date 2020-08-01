---
nav:
  title: 代码管理
  order: 5
title: 克隆 git clone
order: 5
---

# 克隆 git clone

> Clone a repository into a new directory
>
> 将已有存储库克隆到新目录中

## 克隆至本地仓库

克隆一个现有项目和它的整个版本历史。`<url>` 为项目路径，该路径可为**本地路径**，亦可是**远程服务端路径**。

```bash
git clone <url>

# 本地仓库
git clone /path/to/repository

# 远程仓库
git clone username@host:/path/to/repository
```

## 克隆仓库至指定到分支

```bash
git clone -b <branch-name> --single-branch <url>
```

📍 **示例：**

```bash
git clone -b master --single-branch https://github.com/tsejx/git-guidebook.git
```
