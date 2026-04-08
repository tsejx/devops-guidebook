---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: compose.yml 基本结构
order: 2
---

# compose.yml 基本结构

Compose 的核心就是配置文件。常见文件名包括：

- `compose.yaml`
- `compose.yml`
- `docker-compose.yml`

无论文件名是什么，关注点都一样：它用 YAML 描述一个多容器项目的结构。

## 基本结构

一个 Compose 文件通常由以下部分组成：

- `services`：定义服务，是最常用的部分
- `networks`：定义自定义网络
- `volumes`：定义命名卷（named volume）
- `configs`：定义配置对象
- `secrets`：定义敏感信息对象

一个简化示例：

```yaml
services:
  app:
    image: node:20-alpine
    ports:
      - "3000:3000"

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example

networks:
  default:
    name: demo-network

volumes:
  db-data:
```

## 顶层字段说明

### `services`

`services` 是 Compose 文件的主体。每个键都是一个服务名，例如 `app`、`db`、`redis`。

```yaml
services:
  web:
    image: nginx:alpine

  redis:
    image: redis:7-alpine
```

### `networks`

用于声明项目需要的网络。服务可以加入一个或多个网络。

```yaml
networks:
  frontend:
  backend:
```

### `volumes`

用于声明命名卷，适合数据库、缓存、上传文件等持久化目录。

```yaml
volumes:
  mysql-data:
  redis-data:
```

### `configs`

用于管理配置文件内容。它更适合“配置对象”而不是“敏感数据”。

```yaml
configs:
  nginx-conf:
    file: ./nginx.conf
```

### `secrets`

用于管理密码、Token、证书等敏感信息。

```yaml
secrets:
  db-password:
    file: ./secrets/db-password.txt
```

## YAML 书写规则

Compose 文件本质上是 YAML，所以常见错误往往不是 Compose 语法，而是 YAML 格式问题。

### 缩进要统一

推荐统一使用两个空格，不要混用 Tab。

```yaml
services:
  web:
    image: nginx:alpine
```

### 列表使用 `-`

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

### 布尔值和端口建议加引号

像 `yes`、`no`、`on`、`off` 容易被 YAML 解析为布尔值。端口映射里的 `80:80` 也建议用引号包起来，减少歧义。

```yaml
environment:
  FEATURE_FLAG: "true"

ports:
  - "8080:80"
```

### 相对路径以 Compose 文件所在目录为基准

例如：

```yaml
volumes:
  - ./data:/var/lib/mysql
```

这里的 `./data` 默认相对当前 Compose 文件位置解析。

## 一个完整但最小可运行的示例

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro

volumes: {}
networks: {}
```

这个示例已经包含了 Compose 最常见的三类信息：

- 服务定义
- 端口映射
- 卷挂载

启动后，宿主机的 `./html` 会被挂载到容器中的 Nginx 静态目录。

## 常用检查命令

在真正启动前，建议先检查配置展开后的结果：

```bash
docker compose config
```

它可以帮助你发现：

- YAML 缩进错误
- 变量替换后的结果
- 多文件合并后的最终配置

## 注意事项

- 新版 Compose 已经不再要求必须写 `version` 字段，重点应该放在实际字段内容上
- `configs` 与 `secrets` 是否可用，和 Docker/Compose 运行环境有关，正式使用前应先验证
- 如果项目只是本地开发，先把 `services`、`ports`、`volumes`、`environment` 用清楚，通常已经足够
- 配置复杂时，优先使用 `docker compose config` 看最终结果，而不是靠肉眼猜

---

**参考资料：**

- [Docker Docs: Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Docs: Environment variables in Compose](https://docs.docker.com/compose/environment-variables/)
