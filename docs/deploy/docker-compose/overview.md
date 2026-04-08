---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 概览
order: 1
---

# 概览

Docker Compose 是 Docker 官方提供的多容器编排工具。它允许我们用一个 `compose.yaml`（或兼容的 `docker-compose.yml`）描述多个服务（service）之间的关系，然后通过 `docker compose up`、`docker compose down` 等命令统一完成启动、停止、重建、日志查看和网络组织。

它最适合以下场景：

- 本地开发环境：一键启动应用、数据库、缓存、反向代理
- 单机测试环境：把多个容器按项目维度组织起来
- 中小规模服务器部署：用一套配置快速交付一组服务

## Docker Compose 解决什么问题

如果只用 `docker run` 管理多个容器，很快会遇到几个问题：

- 命令太长，端口、卷、环境变量难维护
- 服务之间有依赖关系，启动顺序和网络关系容易混乱
- 团队成员本地环境不一致，重复搭环境成本高
- 更新服务时，需要手工记忆很多启动参数

Compose 的思路是把这些运行参数收敛到一个声明式文件中，让“多容器项目”可以被版本化、复用和审查。

## 与 `docker run`、Dockerfile 的关系

三者解决的问题并不相同：

- `docker run`：负责“启动一个容器”
- Dockerfile：负责“构建一个镜像”
- Docker Compose：负责“组织一组相关容器”

可以把它们理解为：

```text
Dockerfile -> 构建镜像
Docker Compose -> 编排多个服务
docker run -> 单次启动容器
```

在实际项目里很常见的组合是：

- 用 Dockerfile 构建应用镜像
- 用 Compose 组合 `app + mysql + redis + nginx`
- 用 `docker compose up -d` 启动整套环境

## 与 Kubernetes 的区别

Docker Compose 和 Kubernetes 都能描述容器应用，但定位不同：

- Docker Compose 更偏向单机、多容器项目编排
- Kubernetes 更偏向集群调度、弹性伸缩、服务治理和云原生平台能力

如果你的目标是：

- 本地开发
- 小型测试环境
- 单机服务器部署

那么 Compose 往往更直接。

如果你的目标是：

- 多机集群
- 自动扩缩容
- 更强的服务发现、滚动发布、故障自愈

那么 Kubernetes 更合适。

本系列最后一篇会专门讨论 Compose 与 Kubernetes 的取舍。

## 核心概念

### service

`service` 是 Compose 中最核心的概念。它描述一个服务如何运行，例如镜像、端口、环境变量、卷和网络。

一个 `service` 最终通常会对应一个或多个容器实例。

### container

容器（container）是服务运行后的实例。Compose 管的是“服务”，Docker 运行的是“容器”。

### image

镜像（image）是容器运行的基础。你可以直接使用现成镜像，也可以通过 `build` 基于 Dockerfile 构建。

### network

Compose 会为一个项目创建默认网络。同一个项目下的服务默认可以通过服务名互相访问，例如 `db`、`redis`。

### volume

卷（volume）用于持久化数据。数据库、缓存目录、上传文件等内容通常不应该直接写在容器可写层里，而应该挂载 volume 或 bind mount。

## 第一个 Compose 项目

下面是一个最小可运行的 Compose 示例：

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

启动：

```bash
docker compose up -d
```

查看服务：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f web
```

停止并删除容器、网络：

```bash
docker compose down
```

访问 `http://localhost:8080` 时，就能看到 Nginx 默认页面。

## 系列阅读导航

建议按下面顺序阅读：

1. [compose.yml 基本结构](./compose-yml-basics.md)
2. [services 详解](./services.md)
3. [网络与数据持久化](./network-and-volume.md)
4. [配置拆分与复用](./reuse-and-config.md)
5. [常见组合案例](./practical-cases.md)
6. [实战细节](./practical-details.md)
7. [构建流程与交付](./build-and-delivery.md)
8. [网络、数据与配置进阶](./advanced-topics.md)
9. [部署方案、常见问题与对比](./deployment-faq-and-comparison.md)

## 注意事项

- 新版本 Docker 官方命令更推荐使用 `docker compose`，而不是旧的 `docker-compose`
- 文件名更推荐使用 `compose.yaml` 或 `compose.yml`，但 `docker-compose.yml` 仍然很常见
- `depends_on` 只解决“启动顺序”，默认不代表依赖服务已经“可用”
- 数据库、Redis、上传目录等有状态数据，应该优先考虑 volume

---

**参考资料：**

- [Docker Docs: Compose overview](https://docs.docker.com/compose/)
- [Docker Docs: Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Docs: Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
