---
nav:
  title: 代码管理
  order: 5
title: 提取 git fetch
order: 17
---

# 提取 git fetch

> Download objects and refs from another repository
>
> 用于从另一个存储库下载对象和引用

```jsx | inline
import React from 'react';
import img from '../../assets/git/fetch.gif';

export default () => <img alt="fetch" src={img} width={720} />;
```

## 获取远程分支列表

可以用于本地显示的更新远程分支列表。

```bash
# 语法
git fetch <remote>

# 示例
git fetch origin master
```

## 本地删除远程已废弃分支

在本地删除远程已经不存在的分支

```bash
git fetch --prune

# 或者
git fetch -p

# 删除指定分支
git fetch -p origin

git remote prune origin
```

## 获取远程指定分支提交记录

一旦远程主机的版本库有了更新，需要将这些更新取回本地。

```bash
# 语法
git fetch <repository>

# 示例
git fetch git@github.com:facebook/react.git
```

## 跟随远程删除分支的操作

```bash
# 跟随远程删除分支的操作删除本地分支
git fetch -p

# 跟随远程删除分支的操作删除本地tag
git fetch -P
```
