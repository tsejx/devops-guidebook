---
nav:
  title: 部署
  order: 4
group:
  title: 部署理论
  order: 1
title: 持续集成
order: 3
---

# 持续集成

```jsx | inline
import React from 'react';
import img from '../../assets/deploy/continuous-integration.png';

export default () => <img alt="持续集成" src={img} width={720} />;
```

> **Continuous Integration (CI)** is the practice of merging all developer working copies to a shared mainline several times a day.

**持续集成**（Continuous Integration，简称 CI），是软件开发周期的一种实践，把代码仓库（Gitlab 或者 Github）、构建工具（如 Jenkins）和测试工具（SonarQube）集成在一起，频繁的将代码合并到主干然后自动进行构建和测试。简单来说持续集成就是一个监控版本控制系统中代码变化的工具，当发生变化是可以自动编译和测试以及执行后续自定义动作。

---

**参考资料：**

- [持续集成、持续交付、持续部署](https://blog.csdn.net/qq_35368183/article/details/84558134)
- [持续集成系统的演进之路——实践篇](http://jolestar.com/ci-practice/)
- [不可错过的持续集成进阶指南](https://zhuanlan.zhihu.com/p/23264046)
