---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 扩展资源
order: 21
---

# 扩展资源

## 知识体系

《Docker 实践》

基础

- 初探
- 引擎
  - 架构
  - 守护进程
  - 客户端
  - 注册中心
  - Docker Hub

Docker 与开发

- 轻量级虚拟机
  - 从虚拟机到容器
  - 管理容器的服务
  - 保存和还原工作成果
  - 进程即环境
- Docker 日常
  - 卷——持久化问题
  - 运行容器
  - 构建镜像
  - 保持阵型
- 配置管理
  - DOCKERfile
  - 传统配置工具

第三部分 Docker 与 DevOps

- 持续集成
  - Docker Hub 自动化构建
  - 更有效的构建
  - 容器化 CI 过程
- 持续交付
  - CD 流水线上与其他团队互动
  - 推动 Docker 镜像的部署
  - 为不同环境配置镜像
  - 升级运行中的容器
- 网络模拟
  - 容器通信
  - 使用 Docker 来模拟真实世界的网络
  - Docker 与虚拟网络

第四部分 生产环境中的 Docker

- 容器编排
  - 单台宿主机
  - 多宿主机 Docker
  - 服务发现
- Docker 与安全
  - 访问权限
  - 安全手段
  - 其他安全问题
- 运维考量
  - 监控
  - 资源控制
  - 管理员用例
- 各种挑战
  - 性能
  - 调试 Docker
  - 小结

* Kubernetes
* Docker Swarm

## 资源链接

### 安装教程

- [Docker Engine overview](https://docs.docker.com/install/)
- [多版本和操作系统的安装教程](https://docker_practice.gitee.io/zh-cn/install/)

### 文档教程

- [《Docker 技术入门与实战》电子版](https://vuepress.mirror.docker-practice.com/)

### 视频教程

- [Docker 入门与部署实战（Bilibili）](https://www.bilibili.com/video/av43360195/?spm_id_from=333.788.videocard.1)
- [慕课网：Docker+Kubernetes(k8s)微服务容器化实践(366)](https://coding.imooc.com/class/198.html)
- [慕课网：系统学习 Docker 践行 DevOps 理念 2019 全新升级(299)](https://coding.imooc.com/class/189.html)
- [慕课网：Kubernetes 实战 高可用集群搭建、配置、运维与应用(199)](https://coding.imooc.com/class/284.html)
- [慕课网：Docker 环境下的前后端分离项目部署与运维(148)](https://coding.imooc.com/class/219.html)

### 实战教程

- [Docker 搭建你的第一个 Node 项目到服务器](https://juejin.im/post/5dff84e051882512290f2fc2)
- [📝 写给前端的 Docker 实战教程](https://juejin.im/post/5d8440ebe51d4561eb0b2751)
- [基于 Docker 打造前端持续集成开发环境（使用 DaoCloud）](https://juejin.im/post/5a142d7b6fb9a0451170c2c7)
- [Docker 容器化部署尝试——多容器通信](https://juejin.im/post/5c17492ef265da614e2bfc47)
- [Node 项目从构建到使用 Jenkins + Docker + Nginx + MySQL + Redis 自动化部署](https://juejin.im/post/5dde46b2e51d4554350715f5)

## 技术社区

- [DockOne.io](http://dockone.io/)

## 行业实践

- [网易云音乐前端团队：前端领域的 Docker 与 Kubernets](https://juejin.im/post/5dddd15b6fb9a071576dbd7a)
- [Docker 在 B 站的实施之路](https://mp.weixin.qq.com/s?__biz=MzA5OTAyNzQ2OA==&mid=2649692067&idx=1&sn=a944922e5adbd4c0fa05cd8091ce0c7e&chksm=889328c0bfe4a1d66a276ecdf88e32acc4ea3bc054e9af56769c4d3dc094e94b764b761c2bbe&mpshare=1&scene=1&srcid=1009FDaiOLLfveQDyg9a8gb8#rd)
- [美团点评 Docker 容器管理平台](https://tech.meituan.com/2017/01/23/mt-docker-practice.html)
- [沪江容器化运维实践](<https://mp.weixin.qq.com/s?__biz=MzA5OTAyNzQ2OA==&mid=2649694025&idx=1&sn=3ea6df098d1d9c89a24adb19b1ee7fb4&chksm=8893202abfe4a93c34c0711bfdce92fb8f6e7cca915033412dc1a17f216085b301c829fbb473&mpshare=1&scene=1&srcid=0511QMlNRKZnIyZn4QF1mEZq&key=73411870bc3f198aa2dfe97568ff575222ab5611284cae939c4eebc04c7dc3e80da5312b7f817e1ccbf760b3478bf2688eafcaab2ce870c937b9d95660121800adab893335c656f2aa59984edf0437e3&ascene=0&uin=Mjk0NzA5ODIzMw==&devicetype=iMac%20MacBookAir7,1%20OSX%20OSX%2010.11.6%20build(15G1421)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=%20gXCA7wUhuFg3CtothrP9EkYODPWYx6qcjIkWMs%20Xk7yH7In8733araSI9Mks/j2>)
- [爱奇艺基于 Docker 的 App Engine 实践](<https://mp.weixin.qq.com/s?__biz=MzA5OTAyNzQ2OA==&mid=2649690916&idx=1&sn=bd2bd3ebc6205505c52e5bd0cc2eb970&scene=1&srcid=0725t8jvIeEol645PqFEMTzf&key=77421cf58af4a65396abc1d2a527bbbc2cc4021212f6110853b4237f9292ea07d25075e8fe53fa513e056775558d0ba4&ascene=0&uin=Mjk0NzA5ODIzMw%3D%3D&devicetype=iMac+MacBookAir7%2C1+OSX+OSX+10.11.5+build(15F34)&version=11020201&pass_ticket=gCPpBARjtPHbuFOzWKo7qcE7Bw23BFb%2BRGSJlIzZ84GW8cnszkcHH4nUhX%2BzeFFk>)
- [来自谷歌团队的容器运维最佳实践](https://juejin.im/entry/5b598d596fb9a04fe11aec7f/detail)
- [高可用 Docker 容器云在 58 集团的实践](https://mp.weixin.qq.com/s/mq-Nwwg3e5exZeidbbvezg)
- [美团云的 Docker 实践之路](http://dockone.io/article/1556)
- [美团容器平台架构及容器技术实践](https://juejin.im/post/5bee24dff265da61141c2ea1)
- [当当网 Docker 应用实践](https://mp.weixin.qq.com/s?__biz=MzA5OTAyNzQ2OA==&mid=2649691964&idx=1&sn=e87b52b5f5fada2bb6023f18f915d091&chksm=8893285fbfe4a149b5a9dd1e67bb053c3b49c4a88e419ee27dceee2bcae86ce0336f320a853c&mpshare=1&scene=1&srcid=0929nsF3u5eS9CxD0jvba7XR&pass_ticket=5gvtDmfQOdQcU0jbTT%2B2tdbUDW9Beu%2Fs%2FE8%2BsDfqtjQ%3D#rd)
- [新浪公有云 Docker 编排实践](http://dockone.io/article/1495)
- [传统金融企业的 Docker 实践](https://mp.weixin.qq.com/s?__biz=MjM5NzAwNDI4Mg==&mid=2652190935&idx=1&sn=a2cc5918fc6ba42b5f851f67d7515223#rd)

## 业务实践

### 微服务

- [如何使用 Node.js 和 Docker 构建高质量的微服务](https://mp.weixin.qq.com/s?__biz=MzA5OTAyNzQ2OA==&mid=2649692459&idx=1&sn=5f7bae5f64e8f8156b5b4f1f9bdd2426&chksm=88932648bfe4af5ef87070f59c907d060b1e209d1a962b54a01c8704bbf2fa2aac2941cafbef&mpshare=1&scene=2&srcid=11083n5Ul8yYcFZayUFDag0A&from=timeline&isappinstalled=0#wechat_redirect)
- [微服务从设计到部署](http://oopsguy.com/2017/08/27/microservices-from-design-to-deployment-intro-microservices/)

### 容器监控

- [Docker 容器的自动化监控实现](https://juejin.im/post/5ad589dc5188253edd4d8f5e)
- [Docker 容器监控系统初探](https://www.jianshu.com/p/abfa502e43a6)
- [Docker 可视化监控](https://juejin.im/post/5b3ee37b5188251b11094fc4)
- [打造高逼格、可视化的 Docker 容器监控系统平台](https://mp.weixin.qq.com/s?__biz=MzI0MDQ4MTM5NQ==&mid=2247486129&idx=1&sn=986d170f115071cbe676d211a0458008&chksm=e91b6fadde6ce6bb271dedda23acef2c031ee3bdd7d9e2034ceab9a9e2c65f2caa98932e9491#rd)
- [跟我一起学 Docker：监控日志和日志管理](https://juejin.im/post/5b66547e5188251ac8586e98)
- [Container 及其内部进程监控剖析](https://juejin.im/post/5bcfe734f265da0aa5294a9e)
- [某小公司自动化智能监控平台的实践](https://juejin.im/post/5a56cabd51882573432d11ef)
- [建设 DevOps 统一运维监控平台，全面的系统监控你做好了吗？](https://mp.weixin.qq.com/s/Wq7VRoeWWNjPmFf3Zbp7kw)

### 性能优化

- [如何清理 Docker 占用的磁盘空间](https://juejin.im/post/5a65a6af6fb9a01c9f5b89f9)
- [基于 Docker 的负载均衡和服务发现](https://juejin.im/entry/57a132e6165abd0061252628/detail)

### 容器协作

- [Docker 中如何连接多个 Container 协同工作](https://www.oschina.net/translate/dockerlinks)

### 应用实践

**MySQL**

- [Docker 最全教程 MySQL 容器化](http://www.imooc.com/article/287829)

**MongoDB**

- [Docker 最全教程：MongoDB 容器化](https://www.cnblogs.com/codelove/p/10312692.html)

**ELK**

- [利用 ELK 搭建 Docker 容器化应用日志中心](https://juejin.im/post/5ac2bcbff265da239e4e410d)

**数据库容器化**

- [Docker 最全教程：数据库容器化](http://www.imooc.com/article/283715)
- [Docker 最全教程：数据库容器化之持久保存数据](http://www.imooc.com/article/283787)
- [Docker 最全教程：MongoDB 容器化](http://www.imooc.com/article/283855)
- [Docker 最全教程：Redis 容器化](http://www.imooc.com/article/284018)
- [Docker 最全教程：MySQL 容器化](http://www.imooc.com/article/287829)

## 其他

### 教程系列

- [Docker 教程系列：初级篇](https://idig8.com/category/docker/docker-up/)
- [Docker 教程系列：中级篇](https://idig8.com/category/docker/docker-middle/)
- [Docker 教程系列：终极篇](https://idig8.com/category/docker/docker-down/)
- [开源项目 docker 化](https://idig8.com/category/docker/docker-tshizhan1/)
- [从 docker 走向 k8s 进阶](https://idig8.com/category/docker/shizhanpiancongdockerzouxiangk8sjinjie/)

### 路线大纲

- [Docker 学习路线图](https://developer.aliyun.com/article/40494?spm=5176.12281978.0.0.37724127b5WHbA)
- [Docker 学习资源整理](https://zhuanlan.zhihu.com/p/23508637)
- [Docker 集合](https://www.cnblogs.com/sparkdev/tag/docker/)

### 工具技术

- [精通 Docker 的 50 个必备教程、工具、资源](https://mp.weixin.qq.com/s/JRxjr9SCHOJa9NrtWXrlXg?)
- [五个你应该知道的 Docker 实用工具](https://juejin.im/entry/5939f0dbda2f60006701b30a/detail)
- [100 个容器技术相关技能栈](https://juejin.im/post/5b686e4ff265da0fae4f4340)

### 容器平台

- [Docker 容器平台选型调研](https://juejin.im/post/5a6dd118f265da3e3a6e0982)
