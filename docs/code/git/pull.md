---
nav:
  title: 代码管理
  order: 5
title: 拉取 git pull
order: 18
---

# 拉取 git pull

> Fetch from and integrate with another repository or a local branch
>
> 用于从另一个存储库或本地分支获取并集成（整合）。

```jsx | inline
import React from 'react';
import img from '../../assets/git/pull.gif';

export default () => <img alt="pull" src={img} width={720} />;
```

## 获取版本修改记录

```bash
# 更新本地仓库至最新改动
git pull

# 当本地分支与远程分支没有共同祖先
git pull --rebase origin master
```
