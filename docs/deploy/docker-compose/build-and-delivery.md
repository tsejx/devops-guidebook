---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 构建流程与交付
order: 8
---

# 构建流程与交付

Compose 不只是“本地一键启动工具”，它也经常出现在项目的构建、交付和服务器部署流程里。

## `build` 与 `image`

在 Compose 中，`build` 和 `image` 经常一起出现，但职责不同。

### `build`

表示基于 Dockerfile 构建镜像。

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
```

### `image`

表示直接使用某个已有镜像，或者给构建结果指定镜像名。

```yaml
services:
  app:
    image: myorg/app:1.0.0
```

### 两者结合

```yaml
services:
  app:
    build: .
    image: myorg/app:1.0.0
```

这通常表示：

- 本地通过 Dockerfile 构建
- 构建成功后命名为 `myorg/app:1.0.0`

## `build` 与 Dockerfile 的关系

Compose 本身不负责“定义镜像内容”，镜像内容仍然由 Dockerfile 决定。

也就是说：

- Dockerfile 定义镜像怎么做出来
- Compose 定义这个镜像和其它服务怎么一起运行

这是两层职责，不要混淆。

## 多阶段构建

如果应用需要编译产物，推荐使用多阶段构建（multi-stage build）减小镜像体积。

例如前端项目：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

Compose 只需要引用这个 Dockerfile 即可：

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
```

## 私有镜像仓库

当镜像不适合在服务器本地构建时，常见做法是：

1. 在 CI 中构建镜像
2. 推送到私有仓库
3. 服务器执行 `docker compose pull && docker compose up -d`

例如：

```yaml
services:
  app:
    image: registry.example.com/project/app:1.2.0
```

这样服务器只负责拉取和运行，而不是重新构建。

## CI/CD 与 Docker Compose

Compose 在 CI/CD 中常见的几种用法：

### 1. CI 测试依赖环境

例如在流水线里临时启动 MySQL、Redis、MinIO 等依赖服务。

### 2. 构建后做集成验证

先构建镜像，再通过 Compose 拉起一整套服务做联调测试。

### 3. 服务器部署入口

在部署脚本中执行：

```bash
docker compose pull
docker compose up -d
```

## 服务器上的典型交付流程

一个常见的单机交付流程是：

1. 本地或 CI 构建镜像
2. 推送到镜像仓库
3. 把 Compose 配置同步到服务器
4. 在服务器执行镜像拉取与服务更新

示例：

```bash
# 服务器端
docker compose pull
docker compose up -d
docker compose ps
```

如果项目依赖本地构建，也可以在服务器上执行：

```bash
docker compose up -d --build
```

但这意味着服务器要具备完整构建环境，也会增加部署不确定性。

## 适合本地构建还是远程拉镜像

### 本地/服务器构建适合

- 小团队项目
- 服务器环境简单
- 没有独立镜像仓库流程

### 远程仓库拉镜像适合

- 正式生产环境
- 需要可追踪版本
- 需要 CI 统一产出制品
- 需要多台服务器复用同一镜像

## 注意事项

- `build` 适合开发和小规模部署，正式交付更推荐固定 `image` 标签
- 多阶段构建能显著减小最终镜像体积
- 生产环境尽量避免直接使用 `latest`，应使用明确版本号
- 服务器部署前应明确：谁负责构建镜像，谁负责拉取镜像，谁负责运行 Compose

---

**参考资料：**

- [Docker Docs: Build with Compose](https://docs.docker.com/compose/how-tos/dependent-images/)
- [Docker Docs: Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Docs: docker compose pull](https://docs.docker.com/reference/cli/docker/compose/pull/)
