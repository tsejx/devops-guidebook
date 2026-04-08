---
nav:
  title: 部署
  order: 4
group:
  title: Docker Compose
  order: 3
title: 部署方案、常见问题与对比
order: 10
---

# 部署方案、常见问题与对比

当 Compose 用在正式环境时，大家最关心的通常不是“字段怎么写”，而是：怎么部署、有哪些常见问题、做到什么程度该考虑 Kubernetes。

## 部署方案设计

### 单机部署

这是 Compose 最典型的使用方式。

一个常见结构是：

- `nginx`：对外入口
- `app`：业务服务
- `db`：数据库
- `redis`：缓存

这种模式的优点是：

- 简单直接
- 成本低
- 适合中小项目和内部系统

但它的边界也很明确：

- 所有服务集中在同一台机器
- 故障隔离能力有限
- 水平扩展能力有限

### 多机部署

Compose 本身不是面向多机调度设计的主力工具。

如果项目已经进入：

- 多台服务器协同
- 更复杂的服务发现
- 更严格的故障恢复
- 更灵活的扩缩容

那么就要认真评估更适合的编排方案，而不应强行把 Compose 用成“伪集群平台”。

## 服务器部署架构建议

单机场景下，一种常见架构是：

```text
Internet
   |
 Nginx / Caddy
   |
 App Services
   |
 MySQL / Redis / Other dependencies
```

实践建议：

- 对外只暴露必要端口，例如 `80/443`
- 数据库、缓存尽量只开放给内部网络
- 应用和数据目录分开管理
- 数据卷、配置文件、日志策略提前规划

## 常见问题

### 端口冲突

现象：`docker compose up` 时报端口已被占用。

常见原因：

- 宿主机已有服务占用同一端口
- 另一个 Compose 项目已经绑定该端口
- 旧容器未完全清理

思路：

- 调整宿主机映射端口
- 减少不必要的对外暴露
- 检查已有容器和本机服务占用情况

### 数据丢失

现象：容器重建后，数据库或上传文件消失。

常见原因：

- 没有挂 volume
- 使用了匿名卷却未管理
- 执行了 `docker compose down -v`

思路：

- 数据目录统一使用命名卷或清晰的 bind mount
- 对重要 volume 建立备份策略
- 在删除环境前先确认是否会删除卷

### 容器无法启动

现象：服务反复退出或状态异常。

常见原因：

- 镜像构建失败
- 启动命令错误
- 环境变量缺失
- 配置文件挂载路径不正确

思路：

- 查看 `docker compose logs`
- 必要时用 `docker compose config` 看最终配置
- 检查挂载路径、命令和镜像版本

### 网络无法访问

现象：服务之间连接失败，或外部访问不到容器。

常见原因：

- 应用里把依赖地址写成 `localhost`
- 服务不在同一网络
- 对外端口没有映射
- 防火墙或反向代理配置不正确

思路：

- 容器间优先使用服务名
- 对外访问检查 `ports`
- 有代理层时检查反向代理配置是否转发到正确服务

## 优化建议

### 合理设置 `restart`

对长期运行服务，通常建议：

```yaml
restart: unless-stopped
```

这样在宿主机重启后服务更容易自动恢复。

### 资源限制

在资源紧张的机器上，应关注服务的 CPU、内存消耗，避免单个服务拖垮整机。

具体限制方式要结合当前 Docker/Compose 版本和运行环境验证。

### 日志轮转

如果不控制日志大小，长期运行的容器日志可能占满磁盘。

可以在服务中配置日志驱动选项，例如：

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

### 固定镜像版本

生产环境尽量不要直接依赖 `latest`，而应使用明确版本号，便于回滚和审计。

## Compose vs Kubernetes

### Compose 更适合

- 本地开发环境
- 单机测试环境
- 中小型单机部署
- 团队希望快速上手

### Kubernetes 更适合

- 多机集群
- 大规模服务调度
- 自动扩缩容
- 更完整的滚动发布、自愈与服务治理能力

两者并不是简单的“谁替代谁”，而是服务于不同阶段和复杂度。

## Compose 的局限与方向

Compose 很强，但边界很清楚：

- 不擅长多机集群编排
- 不提供完整的自动调度和自愈能力
- 更适合作为项目级编排工具，而不是平台级调度系统

从今天的实践看，Compose 依然非常适合：

- 本地开发标准化
- 单机服务交付
- 中小项目快速部署

如果未来系统复杂度继续上升，再迁移到 Kubernetes 或其它平台型方案，会更自然。

## 注意事项

- Compose 适合解决“项目级编排”，不要勉强承担“平台级调度”职责
- 正式环境要优先考虑数据卷、备份、日志轮转和镜像版本管理
- 问题排查优先看 `docker compose config`、`ps`、`logs`
- 当需求转向多机弹性和服务治理时，应及时评估 Kubernetes，而不是继续堆叠 Compose 复杂度

---

**参考资料：**

- [Docker Docs: Compose production considerations](https://docs.docker.com/compose/production/)
- [Docker Docs: Docker logging drivers](https://docs.docker.com/engine/logging/configure/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
