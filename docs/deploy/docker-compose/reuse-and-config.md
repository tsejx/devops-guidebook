---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 配置拆分与复用
order: 5
---

# 配置拆分与复用

当 Compose 文件逐渐变大后，最容易出现的问题不是“不能用”，而是“越来越难维护”。这时就需要考虑配置拆分、变量管理和重复配置复用。

## 为什么要拆分配置

单个 `compose.yaml` 在项目初期通常够用，但随着环境增多，很容易出现：

- 开发、测试、生产配置混在一起
- 同样的 `environment`、`volumes`、`restart` 重复书写
- 某些服务只在开发环境需要，线上并不需要

这时建议把配置按照“公共部分 + 环境差异”组织。

## 多文件拆分思路

一种常见方式是保留一个基础文件，再用额外文件覆盖差异。

例如：

- `compose.yaml`：公共服务定义
- `compose.dev.yaml`：开发环境覆盖
- `compose.prod.yaml`：生产环境覆盖

基础配置：

```yaml
services:
  app:
    image: myorg/app:latest
    restart: unless-stopped

  db:
    image: mysql:8.0
    restart: unless-stopped
```

开发环境覆盖：

```yaml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src
    environment:
      NODE_ENV: development
```

使用时：

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d
```

Compose 会把多个文件合并，后面的配置覆盖前面的配置。

## 环境变量管理

Compose 中有两类常见环境变量使用方式。

### 给 Compose 文件做变量替换

```yaml
services:
  app:
    image: myorg/app:${APP_TAG}
```

如果当前 shell 或 `.env` 文件中存在 `APP_TAG`，Compose 会在加载配置时先替换。

### 给容器传递环境变量

```yaml
services:
  app:
    environment:
      NODE_ENV: production
      API_BASE_URL: https://api.example.com
```

这类变量会进入容器运行时环境。

## `.env` 文件

当需要集中管理默认值时，可以使用 `.env` 文件。

```env
APP_TAG=latest
MYSQL_DATABASE=app
MYSQL_ROOT_PASSWORD=example
```

然后在 Compose 文件中引用：

```yaml
services:
  app:
    image: myorg/app:${APP_TAG}

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
```

`.env` 非常适合保存“环境差异”，但不适合提交真实生产密码。

## `env_file`

如果想把容器环境变量集中放到文件中，可以使用 `env_file`。

```yaml
services:
  app:
    env_file:
      - .env.common
      - .env.dev
```

它更偏向“把文件内容注入容器”，而不是“给 Compose 解析器做模板替换”。

## YAML Anchor 与复用配置

当多个服务共享相同配置时，可以用 YAML anchor 做复用。

```yaml
x-common-env: &common-env
  TZ: Asia/Shanghai
  LANG: C.UTF-8

services:
  app:
    image: myorg/app:latest
    environment:
      <<: *common-env
      NODE_ENV: production

  worker:
    image: myorg/worker:latest
    environment:
      <<: *common-env
      QUEUE: default
```

这个写法适合复用：

- 通用环境变量
- 通用日志配置
- 通用重启策略

但不要为了“技术感”把所有字段都抽象掉，否则阅读成本会很高。

## 按开发、测试、生产组织配置

推荐的思路是：

### 开发环境

- 使用 `build`
- 挂载源码目录
- 开启调试端口
- 使用本地数据库卷

### 测试环境

- 尽量接近线上镜像
- 保留必要日志和可观测性配置
- 可引入专门的测试数据或覆盖配置

### 生产环境

- 优先使用稳定镜像标签
- 不直接挂源码目录
- 明确重启策略、日志策略和数据卷
- 敏感配置通过 `secrets`、外部注入或服务器侧管理

## 示例：公共配置 + 生产覆盖

```yaml
# compose.yaml
services:
  app:
    image: myorg/app:${APP_TAG}
    restart: unless-stopped
    environment:
      TZ: Asia/Shanghai

  nginx:
    image: nginx:alpine
    restart: unless-stopped
```

```yaml
# compose.prod.yaml
services:
  app:
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"

  nginx:
    ports:
      - "80:80"
      - "443:443"
```

## 注意事项

- 配置拆分的目标是降低维护成本，不是制造层层嵌套
- `.env` 常用于默认变量，不建议直接提交真实线上密钥
- `env_file` 和 `.env` 作用不同，前者偏容器环境，后者也会参与 Compose 模板替换
- Anchor 适合少量复用，过度抽象会让排障更难
- 修改多文件配置后，先执行 `docker compose config` 看最终展开结果

---

**参考资料：**

- [Docker Docs: Variable interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)
- [Docker Docs: Merge Compose files](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
