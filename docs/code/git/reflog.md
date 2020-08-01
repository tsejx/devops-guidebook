---
nav:
  title: 代码管理
  order: 5
title: 操作日志 git reflog
order: 25
---

# 操作日志 git reflog

> Manage reflog information

`git reflog` 用于显示所有已执行操作的日志！包括合并、重置、还原，也就是记录了对分支的一切更改行为。

```jsx | inline
import React from 'react';
import img from '../../assets/git/reflog.gif';

export default () => <img alt="reflog" src={img} width={720} />;
```

如果，你不想合并 `origin/master` 分支了。就需要执行 `git reflog` 命令，合并之前的仓库状态位于 `HEAD@{1}` 这个地方，所以我们使用 `git reset` 指令将 `HEAD` 头指向 `HEAD@{1}` 就可以了。

```jsx | inline
import React from 'react';
import img from '../../assets/git/reflog-reset.gif';

export default () => <img alt="reflog-reset" src={img} width={720} />;
```
