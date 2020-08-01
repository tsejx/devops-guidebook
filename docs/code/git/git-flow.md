---
nav:
  title: 代码管理
  order: 5
title: 工作流
order: 51
---

# 工作流

Git 最强大的就是其分支功能，但是如何分支才能更有效的提高开发效率，减少因为代码合并带来的问题，需要一个分支模型来规范，其实在 Git Flow 出现之前，已经有分支模型理论流程，当时是根据此理论，手动的按照规范操作分支，Git Flow 出现之后，将一部分操作流程简化为命令，并没有增加新的功能，只是简化了操作。

```jsx | inline
import React from 'react';
import img from '../../assets/git/git-flow.png';

export default () => <img alt="Git Flow" src={img} width="640" />;
```

统一团队的 Git 工作流，包括分支使用、Tag 规范、Issue 等
统一团队的 Git Commit 日志标准，便于后续代码 Review，版本发布以及日志自动化生成

## 分支管理

Git Flow 管理方式把项目分为 5 条线，通常会是下面的管理方式。

- **Master**：作为稳定主分支，用于部署生产环境的分支，长期有效。不可以在此分支进行任何提交，只能接受从 Hotfix 分支或者 Release 分支发起的 Merge Request，该分支上的每一个提交都对应一个 Tag 提交标签。
- **Develop**：开发主分支，长期有效。不可以在此分支上做任何提交，只接受从 Feature 分支发起的 Merge Request。所有的 Alpha Release 都应该在这个分支发布。
- **Feature**：功能分支，生命周期为产品迭代周期，每个分支对应一期的需求。开发新功能时，以 develop 为基础创建 feature 分支。分支命令规则 `feature/user_module`、`feature/cart_module`。可以 `merge` Release 分支的代码，生命周期结束后，需要 `merge` 回 Develop 分支。方式需要采用 Merge Request。
- **Release**：发布分支，声明周期从新需求的预发布到正式发布，每一个分支对应一个新版本的版本号。只可以从 Develop 分支 Kick Off。声明周期结束后，需要 Merge 回 Master 及 Develop 分支，方式同样需要采用 Merge Request。所有的 Beta Release 均需要在该分支发布。
- **Hotfix**：热修复分支，生命周期对应一个或者多个需要紧急修复并上线的 Bug，每一个分支对应一个小版本号。只可以从 Master 分支进行 Kick Off。声明周期结束后，需要 merge 回 Master 分支和 Develop 分支，方式当然也是采用 Merge Request。

在研发流程中分支通常对应不同的部署环境：

- `tag` -> 生产环境（Production）
- `master` -> 预发布/灰度环境（Pre-Production/Staging）
- `develop` -> 测试环境（Test）
-

实际上，如果你熟悉 Git 的话，你会很快发现上面的管理方式会存在历史提交非常混乱的缺点，但觉得不失为一个 Git 分支管理的经典。实际上，我们可以用 `rebase` 去替换 `merge` 让 `commit` 看起来更加清晰。对 `rebase` 和 `merge` 的优劣对比这里暂不做讲解，感兴趣的可以直接 Google 搜索。

## 提交规范

业界使用比较广泛的代码提交规范是：[Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

占位标签解析：

- `type`：代表某次提交的类型，比如是修复了 BUG 还是新增了 Feature
- `scope`：说明 Commit 影响的范围，根据项目而定。例如在业务项目中可以依据菜单活功能模块划分；如果是组件库开发，则可以依据组件划分。
- `subject`：Commit 的简短描述
- `body`：提交代码的详细描述
- `footer`：如果代码的提交是不兼容变更或关闭缺陷，则 Footer 必需，否则可以省略

### 提交类型

| 类型     | 说明                                                                 |
| -------- | -------------------------------------------------------------------- |
| feat     | 特性：新功能                                                         |
| fix      | 修复：修复错误                                                       |
| docs     | 文档：文档修改（比如 README.md、CHANGELOG、CONTRIBUTE 等等）         |
| style    | 格式：格式修改（不影响代码运行的变化，如空白、格式化、缺少分号等）   |
| refactor | 重构：代码重构（既不新增功能，也不是修改错误的代码变动）             |
| perf     | 优化：改进性能的代码更改                                             |
| test     | 测试：测试用例，包括单元测试、集成测试（添加缺失测试或更正现有测试） |
| chore    | 工具：构建过程或辅助工具的变动（或者增加依赖库、工具等）             |
| revert   | 回滚：回滚到上一个版本                                               |

示例：

```
特性: 添加头像功能
特性: 添加收藏功能
修复: 在 Android 机器上传崩溃问题解决
文档: 修改 README，增加了使用说明
优化: 首页图片加载缓慢优化
重构: 对头像功能进行封装重构
```

### 格式要求

Git Commit 代码提交的标题、内容的格式要求。

```bash
# 标题行：50个字符以内，描述主要变更内容
#
# 主体内容：更详细的说明文本，建议72个字符以内。 需要描述的信息包括:
#
# * 为什么这个变更是必须的? 它可能是用来修复一个bug，增加一个feature，提升性能、可靠性、稳定性等等
# * 他如何解决这个问题? 具体描述解决问题的步骤
# * 是否存在副作用、风险?
#
# 如果需要的话可以添加一个链接到 issue 地址或者其它文档
```

### 辅助工具

用于约束 commit 的插件工具：

- `commitizen`：一个格式化 commit message 的工具
- `commitlint`：检查 commit message 是否符合常规的提交格式
- `conventional-changelog-cli`：每次 commit 后产生 CHANGELOG 日志文件
- `@commitlint/config-conventional`：一些常规的 commitlint 规则，如果不满足，将产生一个非零的退出代码，退出当前执行程序

辅助工具：

- `husky`：Git Hooks

## 标签版本管理

项目标签版本管理的规范有多种多样，这里我们讲述的是 [版本语义化版本 2.0.0](https://semver.org/lang/zh-CN/) 的规范。

版本格式：`主版本号.次版本号.修订号`，版本号递增规则如下：

- 主版本号：当你做了不兼容的 API 修改
- 次版本号：当你做了向下兼容的功能性新增
- 修订号：当你做了向下兼容的问题修正

先行版本号及版本编译元数据可以加到 `主版本号.次版本号.修订号` 的后面，作为延伸。

命名规范：

- 新功能开发使用第二位版本号，BUG 修复使用第三位版本号
- 首版本号是全新的功能类，功能模块上线才做的调整

---

**参考资料：**

- 工作流
  - [📝 A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
  - [📝 Git 工作流和 Git Commit 规范](https://juejin.im/post/6844903866451001352)
  - [📝 考拉海购：便于 Code Review 的 Git 流程方案](https://juejin.im/post/59e5b683f265da432c22ec89)
- 版本控制
  - [📖 语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
  - [📝 你知道 Git 是如何做版本控制的吗？](https://juejin.im/post/6844903967525208078)
- 更新日志
  - [📝 git commit、CHANGLEOG 和版本发布的标准自动化](https://juejin.im/entry/5c0b74856fb9a049ed30af49/detail)
  - [📝 从 Commmit 规范化到发布自定义 CHANGELOG 模版](https://juejin.im/post/5d27f84a6fb9a07ed064ddf1)
  - [📝 优雅地提交你的 Git Commit Message](https://juejin.im/post/5afc5242f265da0b7f44bee4)
  - [📝 用工具思路来规范化 git commit message](https://juejin.im/entry/5aded911f265da0ba5672f62/detail)
