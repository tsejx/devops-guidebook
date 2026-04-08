---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 常见组合案例
order: 6
---

# 常见组合案例

学习 Compose 最有效的方法之一，就是直接看“常见服务组合”如何组织。下面挑几个最常见的组合场景，重点不是字段穷举，而是理解组织方式。

## 案例一：Node.js + MySQL + Redis

这是 Web 应用里最典型的三件套之一。

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: db
      DB_PORT: "3306"
      REDIS_HOST: redis
      REDIS_PORT: "6379"
    depends_on:
      - db
      - redis
    volumes:
      - .:/app

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: app
      MYSQL_ROOT_PASSWORD: example
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  mysql-data:
  redis-data:
```

### 关键点

- 应用通过服务名 `db`、`redis` 访问依赖
- MySQL、Redis 使用 named volume 保存数据
- 开发环境下把源码目录挂进 `app`，方便热更新

## 案例二：Nginx + 前端静态资源

如果前端项目构建后输出静态文件，可以直接由 Nginx 承载。

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
```

### 关键点

- `dist` 目录挂载到静态资源目录
- Nginx 配置文件通过 bind mount 注入
- `:ro` 表示只读挂载，更安全也更符合用途

## 案例三：Nginx + 前端 + 后端 API

当前后端拆分部署时，Nginx 通常作为统一入口。

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api

  api:
    build: ./backend
    expose:
      - "3000"
    environment:
      NODE_ENV: production
```

对应的 Nginx 配置通常会把 `/api` 转发给 `api:3000`。

### 关键点

- `api` 不一定要暴露宿主机端口，可以只用 `expose`
- Nginx 作为外部入口，统一处理静态资源和反向代理
- 前后端在同一个 Compose 项目里更容易联调

## 案例四：应用 + PostgreSQL

除了 MySQL，PostgreSQL 也是高频组合。

```yaml
services:
  app:
    build: .
    environment:
      DB_HOST: postgres
      DB_PORT: "5432"
      DB_NAME: app
      DB_USER: postgres
      DB_PASSWORD: example
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: example
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## 这些案例的共同模式

无论组合是什么，Compose 配置通常都围绕下面几件事展开：

- 应用服务通过服务名连接依赖
- 通过 `ports` 决定是否开放给宿主机
- 通过 `volumes` 管理持久化数据或本地文件映射
- 通过 `environment` 传递运行参数
- 通过 `depends_on` 描述依赖关系

## 注意事项

- 开发环境为了方便，常把数据库端口也映射到宿主机；生产环境应按需开放
- 数据库目录一定要挂卷，否则容器重建后容易丢数据
- 反向代理类服务通常对外暴露端口，业务服务可以只在项目内部通信
- 案例要根据项目实际调整，不要机械照搬镜像版本、端口和目录结构

---

**参考资料：**

- [Docker Docs: Compose getting started](https://docs.docker.com/compose/gettingstarted/)
- [Docker Docs: Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
