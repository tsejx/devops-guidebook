---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 多容器部署
order: 10
---

# 多容器部署

Docker Compose 相关内容已经从原来的单页拆分为独立专题，统一收录到 `docs/deploy/docker-compose` 分组下。

如果你想系统学习，建议从这里开始：

- [Docker Compose / 概览](../docker-compose/overview.md)
- [Docker Compose / compose.yml 基本结构](../docker-compose/compose-yml-basics.md)
- [Docker Compose / services 详解](../docker-compose/services.md)
- [Docker Compose / 网络与数据持久化](../docker-compose/network-and-volume.md)
- [Docker Compose / 配置拆分与复用](../docker-compose/reuse-and-config.md)
- [Docker Compose / 常见组合案例](../docker-compose/practical-cases.md)
- [Docker Compose / 实战细节](../docker-compose/practical-details.md)
- [Docker Compose / 构建流程与交付](../docker-compose/build-and-delivery.md)
- [Docker Compose / 网络、数据与配置进阶](../docker-compose/advanced-topics.md)
- [Docker Compose / 部署方案、常见问题与对比](../docker-compose/deployment-faq-and-comparison.md)

## 为什么拆分

原有内容已经覆盖了 Compose 的很多主题，但随着内容增多，单页会逐渐变得过长，不利于导航、维护和后续补充案例。因此这里保留为入口页，具体内容迁移到独立章节中。

## 阅读建议

- 初学者先看“概览”与“compose.yml 基本结构”
- 需要写配置时重点看“services 详解”和“网络与数据持久化”
- 需要落地部署时重点看“实战细节”“构建流程与交付”“部署方案、常见问题与对比”

---

**参考资料：**

- [Docker Docs: Compose overview](https://docs.docker.com/compose/)
- [Docker Docs: Compose file reference](https://docs.docker.com/reference/compose-file/)
