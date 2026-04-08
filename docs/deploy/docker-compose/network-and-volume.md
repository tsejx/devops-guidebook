---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 网络与数据持久化
order: 4
---

# 网络与数据持久化

多容器应用离不开两个问题：

- 服务之间如何通信
- 容器删除后数据如何保留

在 Compose 中，这两个问题分别主要通过 `networks` 和 `volumes` 解决。

## Compose 默认网络

当你执行 `docker compose up` 时，Compose 会为当前项目自动创建一个默认网络。项目中的服务默认加入这个网络，并且可以通过服务名互相访问。

例如：

```yaml
services:
  app:
    build: .
    depends_on:
      - db

  db:
    image: mysql:8.0
```

这里 `app` 可以直接连接 `db:3306`。

## 自定义 `networks`

当项目中存在前后端隔离、数据库内网、反向代理等需求时，可以自定义网络。

```yaml
services:
  nginx:
    image: nginx:alpine
    networks:
      - frontend

  app:
    build: .
    networks:
      - frontend
      - backend

  db:
    image: mysql:8.0
    networks:
      - backend

networks:
  frontend:
  backend:
```

这个配置的含义是：

- `nginx` 只能看到 `frontend` 网络里的服务
- `db` 只暴露给 `backend` 网络
- `app` 同时连接两个网络，负责承上启下

## `network_mode`

某些场景下，你可能不想使用 Compose 默认的桥接网络，而是直接指定网络模式。

```yaml
services:
  node-exporter:
    image: prom/node-exporter:latest
    network_mode: host
```

常见模式包括：

- `bridge`
- `host`
- `none`
- `service:<name>`
- `container:<name>`

其中 `host` 模式最常见，但也最需要谨慎，因为它会让容器直接共享宿主机网络栈。

## 为什么容器删除后数据会丢

容器默认把写入数据放在容器可写层中。这个存储层适合临时数据，不适合数据库、上传文件、日志归档等需要持久化保存的内容。

一旦容器被删除，写在容器可写层里的数据通常也会一起消失。

因此，有状态服务应优先考虑 volume 或 bind mount。

## `volumes`

Compose 中的 `volumes` 常用于命名卷（named volume）。

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

这样即使 `db` 容器被重建，只要卷还在，数据库数据通常就还在。

## bind mount 与 named volume

### bind mount

把宿主机目录直接挂载进容器。

```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./html:/usr/share/nginx/html:ro
```

适合：

- 开发环境挂载源码
- 挂载本地配置文件
- 需要直接在宿主机查看或修改内容

### named volume

由 Docker 管理卷目录。

```yaml
services:
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

适合：

- 数据库存储
- 缓存持久化
- 不希望绑定宿主机具体目录结构

## 常见写法示例

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    networks:
      - app-net
    volumes:
      - ./src:/app/src

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: app
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-net

networks:
  app-net:

volumes:
  mysql-data:
```

这个组合很常见：

- 代码目录用 bind mount，方便开发调试
- 数据库目录用 named volume，降低数据丢失风险

## 注意事项

- 需要持久化的数据不要写进容器可写层
- 开发环境常用 bind mount，生产环境的数据库更适合 named volume
- `network_mode: host` 很方便，但会弱化网络隔离，且通常只适合 Linux 场景
- 如果 volume 名称写成 `xxx:/path`，记得在顶层 `volumes` 中声明，方便维护和迁移

---

**参考资料：**

- [Docker Docs: Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Docker Docs: Volumes](https://docs.docker.com/engine/storage/volumes/)
- [Docker Docs: Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
