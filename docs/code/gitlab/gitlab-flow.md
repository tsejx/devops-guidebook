# GitLab Flow

## 上游优先

Gitlab flow 的最大原则叫做 **上游优先**（upsteam first），即只存在一个主分支 `master`，它是所有其他分支的 **上游**。只有上游分支采纳的代码变化，才能应用到其他分支。

Chromium 项目就是一个例子，它明确规定，上游分支依次为：

- Linux Torvalds 的分支
- 子系统（例如 netdev）的分支
- 设备厂商（例如三星）的分支

## 持续发布模式

```jsx | inline
import React from 'react';
import img from '../../assets/git/gitlab-flow-cd.png';

export default () => <img alt="gitlab-flow-cd" src={img} width="480" />;
```

对于 **持续发布** 的项目，它建议在 `master` 分支以外，再建立不同的环境分支。比如，**开发环境**的分支是 `master`，"预发环境"的分支是 `pre-production`，**生产环境** 的分支是 `production`。

开发分支是预发分支的 **上游**，预发分支又是生产分支的 **上游**。代码的变化，必须由 **上游** 向 **下游** 发展。比如，生产环境出现了 BUG，这时就要新建一个功能分支，先把它合并到 `master`，确认没有问题，再 `cherry-pick` 到 `pre-production`，这一步也没有问题，才进入 `production`。

只有紧急情况，才允许跳过上游，直接合并到下游分支。

## 版本发布模式

```jsx | inline
import React from 'react';
import img from '../../assets/git/gitlab-flow-vd.png';

export default () => <img alt="gitlab-flow-vd" src={img} width="480" />;
```

对于 **版本发布** 的项目，建议的做法是每一个稳定版本，都要从 `master` 分支拉出一个分支，比如 `2-3-stable`、`2-4-stable` 等等。

以后，只有修补 BUG，才允许将代码合并到这些分支，并且此时要更新小版本号。

--

**参考资料：**

- [字节研发设施下的 Git 工作流](https://juejin.cn/post/6875874533228838925)
