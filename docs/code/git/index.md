---
nav:
  title: 代码管理
  order: 5
title: 概述
order: 1
---

<img width="150" height="150" src="http://img.mrsingsing.com/git-logo.png">

# 版本控制

```jsx | inline
import React from 'react';

export default () => (
  <img
    alt="Git输送流程示意图"
    src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015120901.png"
    width="640"
  />
);
```

所谓版本控制，就是在文件修改的历程中保留修改历史，可以方便的撤销（如同文本编辑的撤销操作一般，只是版本控制会复杂的多）之前对文件的修改。一个版本控制系统的三个核心内容：版本控制（最基本的功能），主动提交（commit 历史）和远程仓库（协同开发）。

Git 基本概念

- Workspace: 工作区 - 就是你在电脑里能看到的目录
- Index / Stage: 暂存区 - 一般存放在 `.git` 目录下的 `index` 文件（`.git`/`index`）中，所以我们把暂存区有时也叫作索引（index）
- Repository: 仓库区（或本地库）- 工作区有一个隐藏目录 `.git`，这个不算工作区，而是 Git 的本地版本库，仓库所有版本信息都会存在这里
- Remote: 远程仓库

## 命令目录

- 设置和配置
  - [配置 git config](./code/config)
  - [帮助 git help](./code/help)
- 获取和创建项目
  - [初始化 git init](./code/init)
  - [克隆 git clone](./code/clone)
- 基本快照
  - [添加 git add](./code/add)
  - [状态 git status](./code/status)
  - [提交 git commit](./code/commit)
  - [撤销 git reset](./code/reset)
  - [删除 git rm](./code/rm)
  - [移动和重命名 git mv](./code/mv)
- 分支与合并
  - [分支 git branch](./code/branch)
  - [查看 git checkout](./code/checkout)
  - [合并 git merge](./code/merge)
  - [储藏 git stash](./code/stash)
  - [标签 git tag](./code/tag)
- 共享和更新项目
  - [提取 git fetch](./code/fetch)
  - [拉取 git pull](./code/pull)
  - [推送 git push](./code/push)
  - [远程 git remote](./code/remote)
- 检查和比较
  - [日志 git log](./code/log)
  - [差异 git diff](./code/diff)
- 修补
  - [变基 git rebase](./code/rebase)
  - [还原 git revert](./code/revert)
- 提交信息规范
- 扩展
- Q&A

---

**参考资料：**

- [📖 Git Reference](https://git-scm.com/docs)
- [📝 图解 Git 原理与日常实用指南](https://juejin.im/post/5c714d18f265da2d98090503)
