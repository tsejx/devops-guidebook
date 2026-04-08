---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: services 详解
order: 3
---

# services 详解

在 Compose 中，`services` 是最重要的部分。一个服务定义了“某个容器应该如何运行”，例如：使用哪个镜像、开放哪些端口、挂载哪些卷、加入哪些网络、依赖哪些服务。

## `image` 与 `build`

### `image`

当镜像已经存在于镜像仓库或本地时，直接使用 `image`。

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
```

### `build`

当项目需要基于 Dockerfile 自定义镜像时，使用 `build`。

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
```

如果同时写了 `build` 和 `image`，通常表示：

- 用 Dockerfile 构建镜像
- 构建后的镜像打上指定名称

```yaml
services:
  app:
    build: .
    image: myorg/app:latest
```

## `depends_on`

`depends_on` 用来描述服务之间的依赖关系。

```yaml
services:
  app:
    build: .
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0

  redis:
    image: redis:7-alpine
```

它能解决“启动顺序”问题，但默认不能保证数据库已经完成初始化。

如果需要更可靠的依赖判断，通常要配合 `healthcheck` 使用。

## `command` 与 `entrypoint`

### `command`

用于覆盖镜像默认的启动命令。

```yaml
services:
  app:
    image: node:20-alpine
    command: ["npm", "run", "dev"]
```

### `entrypoint`

用于覆盖镜像默认入口。

```yaml
services:
  worker:
    image: myorg/job:latest
    entrypoint: ["/app/entrypoint.sh"]
```

一般来说：

- 想改“执行参数”，更常用 `command`
- 想改“入口程序”，才用 `entrypoint`

## `ports` 与 `expose`

### `ports`

把容器端口映射到宿主机。

```yaml
ports:
  - "8080:80"
  - "127.0.0.1:3307:3306"
```

适合需要从宿主机或外部访问的服务。

### `expose`

只声明容器内部端口，不主动暴露到宿主机。

```yaml
expose:
  - "3000"
```

适合只给同一 Compose 项目内其他服务访问的端口。

## `restart`

设置容器退出后的重启策略。

```yaml
restart: always
```

常见取值：

- `no`
- `on-failure`
- `unless-stopped`
- `always`

对数据库、反向代理、后台服务来说，`unless-stopped` 或 `always` 更常见。

## `environment`

用于给容器传递环境变量。

字典写法：

```yaml
environment:
  NODE_ENV: production
  PORT: "3000"
```

列表写法：

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
```

如果值里有布尔语义或数字端口，建议使用字符串写法，减少 YAML 自动转换带来的问题。

## 服务之间如何通信

Compose 项目默认会创建网络，同一网络中的服务可以直接通过“服务名”通信。

例如下面的 `app` 可以直接连接 `db:3306` 和 `redis:6379`：

```yaml
services:
  app:
    build: .
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0

  redis:
    image: redis:7-alpine
```

这也是为什么在应用配置里，数据库主机名通常直接写成 `db`，而不是 `localhost`。

## 综合示例

```yaml
services:
  api:
    build: .
    image: demo/api:latest
    command: ["npm", "run", "start"]
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: db
      REDIS_HOST: redis
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: app
      MYSQL_ROOT_PASSWORD: example
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped
```

## 注意事项

- `depends_on` 不等于“依赖服务已就绪”，数据库初始化仍可能更慢
- 容器内部访问其他服务时，优先使用服务名，不要写 `localhost`
- `ports` 面向宿主机访问，`expose` 更偏向容器间沟通说明
- `command` 和 `entrypoint` 都能改启动行为，但不要两者一起滥用，否则排障会更难

---

**参考资料：**

- [Docker Docs: Services top-level element](https://docs.docker.com/reference/compose-file/services/)
- [Docker Docs: Startup order](https://docs.docker.com/compose/how-tos/startup-order/)
