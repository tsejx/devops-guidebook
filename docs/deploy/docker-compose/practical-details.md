---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 实战细节
order: 7
---

# 实战细节

会写 Compose 文件，只是第一步。实际使用中，很多问题都出现在启动顺序、健康检查、日志查看、镜像更新和容器重建这些细节上。

## 启动顺序与健康检查

`depends_on` 只能保证 Compose 先启动谁、后启动谁，但不保证依赖服务已经真正可用。

例如数据库容器已经启动，不代表表结构初始化已经完成。

### 使用 `healthcheck`

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-pexample"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

这样 `app` 会等待 `db` 进入健康状态后再启动。

## 日志查看与问题定位

排查 Compose 问题时，最常用的命令之一就是日志查看。

```bash
docker compose logs
docker compose logs -f app
docker compose logs --tail=100 nginx
```

常见排查顺序：

1. 看 `docker compose ps`
2. 看失败服务的 `logs`
3. 必要时进入容器检查配置或网络

```bash
docker compose exec app sh
```

## 容器重建

当镜像、配置、环境变量或挂载发生变化时，经常需要重建容器。

```bash
docker compose up -d --build
docker compose up -d --force-recreate
```

常见区别：

- `--build`：先构建镜像再启动
- `--force-recreate`：即使配置没检测到变化也重建容器

## 镜像更新

如果服务使用的是远程镜像，而不是本地 `build`，更新流程通常是：

```bash
docker compose pull
docker compose up -d
```

这样可以先拉取最新镜像，再按当前 Compose 配置重建相关服务。

## 平滑调整思路

Compose 不是完整的集群编排平台，但在单机场景中依然可以做一些相对平滑的变更：

- 先更新无状态服务，再更新有状态服务
- 对外入口（如 Nginx）尽量保持稳定
- 数据库升级前先备份 volume
- 通过健康检查降低“服务刚起来但还不可用”的窗口期

## 常见坑点

### 1. 容器起来了，但服务还没准备好

这是最常见的问题之一。根因通常是只用了 `depends_on`，没有做健康检查或应用重试。

### 2. 应用里把数据库地址写成 `localhost`

容器里 `localhost` 指向当前容器自己，不是数据库容器。应优先写成服务名，例如 `db`。

### 3. 改了配置却没生效

可能原因包括：

- 改的是 bind mount 文件，但容器里路径不对
- 改了 Dockerfile，却没有重新 build
- 改了环境变量，但旧容器没有重建

### 4. 删除容器后数据没了

通常是因为没有挂 volume，或者误删了 volume。

## 一组常用命令

```bash
# 后台启动
docker compose up -d

# 构建并启动
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f

# 进入容器
docker compose exec app sh

# 停止并删除容器、网络
docker compose down
```

## 注意事项

- 依赖服务建议配合 `healthcheck`，不要只依赖启动顺序
- 问题定位优先看 `docker compose logs`，不要一上来就猜
- 配置改动后不生效，优先检查是否需要 `--build` 或重建容器
- 更新数据库、消息队列等有状态服务前，先确认数据卷和备份策略

---

**参考资料：**

- [Docker Docs: Startup order](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker Docs: docker compose logs](https://docs.docker.com/reference/cli/docker/compose/logs/)
