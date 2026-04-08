---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 网络、数据与配置进阶
order: 9
---

# 网络、数据与配置进阶

当前面几篇的基础已经熟悉之后，就可以继续深入几个更容易在实战中踩坑的话题：网络原理、DNS 解析、跨项目通信、数据卷生命周期、备份恢复，以及 `.env`、`secrets` 等配置管理细节。

## bridge 网络的基本理解

Compose 默认最常见的网络模式是 bridge。可以把它理解为：

- 每个服务容器接入一个虚拟交换网络
- 同一网络内的容器可以互相通信
- 对外访问通常通过端口映射完成

在这个模型下：

- 宿主机访问容器：依赖 `ports`
- 容器访问容器：优先用服务名和内部端口

因此，很多应用在 Compose 中并不需要对所有服务都开放宿主机端口。

## 容器 DNS

Compose 一个非常实用的能力是自动提供服务名解析。

例如：

```yaml
services:
  app:
    build: .

  db:
    image: mysql:8.0
```

在 `app` 容器内部，通常可以直接通过 `db` 访问数据库服务。

这意味着应用配置可以写成：

```env
DB_HOST=db
DB_PORT=3306
```

而不是写成宿主机 IP。

## 跨 Compose 项目通信

默认情况下，不同 Compose 项目会创建各自独立的网络，项目之间不能直接通过服务名互相访问。

如果确实需要跨项目通信，常见做法有两种。

### 方式一：使用外部网络

先创建一个共享网络：

```bash
docker network create shared-net
```

然后在多个 Compose 项目中显式引用：

```yaml
networks:
  shared-net:
    external: true
```

服务加入这个网络后，就可以跨项目通信。

### 方式二：通过宿主机端口通信

如果不想共享网络，也可以让一个项目对外暴露端口，另一个项目通过宿主机地址访问。

这种方式更直接，但会引入额外端口管理成本。

## volume 生命周期

卷（volume）的生命周期独立于容器。

这意味着：

- 删除容器，不一定删除 volume
- 重建容器时，只要仍挂载同一个 volume，数据通常还在
- 执行 `docker compose down` 时，默认不会删除命名卷

如果显式使用 `-v`：

```bash
docker compose down -v
```

那么关联的命名卷也会被删除，需要非常谨慎。

## 数据备份与恢复

数据库、上传目录、配置目录如果挂在 volume 中，就应该有备份意识。

### 备份思路

- 应用级备份：如 `mysqldump`、`pg_dump`
- 文件级备份：备份 volume 对应的数据目录
- 服务器级备份：结合快照、对象存储或远程备份系统

### 恢复思路

- 先确认恢复目标是“新容器 + 旧卷”还是“新卷 + 导入备份”
- 数据库恢复通常更推荐应用级导入，而不是直接复制运行中数据目录

Compose 自己不负责备份，但 Compose 决定了哪些目录和卷需要被备份。

## `.env` 的优先级理解

Compose 中经常把 `.env` 和 `environment` 混在一起理解，实际它们作用不同。

### 常见优先关系

一般可以这样理解：

1. Compose 文件中显式写死的值
2. 当前 shell 导出的环境变量
3. `.env` 文件中的默认值
4. Dockerfile 中的 `ENV`

因此：

- 如果 Compose 文件里已经把某个变量写死，`.env` 通常覆盖不了它
- `.env` 更适合给 Compose 文件提供默认替换值
- 容器运行时最终拿到什么值，建议用 `docker compose config` 检查

## `secrets` 的敏感信息管理

对于数据库密码、API Token、证书类内容，不建议直接硬编码在 Compose 文件里。

Compose 可以使用 `secrets` 管理敏感信息。

```yaml
services:
  db:
    image: mysql:8.0
    secrets:
      - db-root-password
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db-root-password

secrets:
  db-root-password:
    file: ./secrets/db-root-password.txt
```

这样敏感值不需要直接出现在 `environment` 明文中。

不过在不同运行环境下，`secrets` 的可用能力和体验会有差异，落地前应先验证。

## 注意事项

- 容器间通信优先使用服务名，不要依赖写死 IP
- 跨 Compose 通信尽量通过外部网络统一管理
- `docker compose down -v` 会删除卷，执行前务必确认
- `.env` 是默认值来源，不是万能覆盖层
- 密码、Token、证书等敏感内容优先考虑 `secrets` 或外部注入机制

---

**参考资料：**

- [Docker Docs: Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Docker Docs: Use secrets in Compose](https://docs.docker.com/compose/how-tos/use-secrets/)
- [Docker Docs: Environment variables in Compose](https://docs.docker.com/compose/environment-variables/)
