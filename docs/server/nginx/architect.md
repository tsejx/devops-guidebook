---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 架构原理
order: 20
---

# 架构原理

## 进程架构

Nginx 启动之后，在 Linux 系统中有两个进程，一个为 `master`，一个为 `worker`。`master` 作为管理员不参与任何工作，只负责给多个 `worker` 分配不同的任务（`worker` 一般有多个）。

```bash
ps -ef |grep nginx
root     20473     1  0  2019 ?        00:00:00 nginx: master process /usr/sbin/nginx
nginx     4628 20473  0 Jan06 ?        00:00:00 nginx: worker process
nginx     4629 20473  0 Jan06 ?        00:00:00 nginx: worker process
```

<br />

```jsx | inline
import React from 'react';
import img from '../../assets/nginx/nginx-master-worker-model.png';

export default () => <img alt="nginx-master-worker-model" src={img} width={640} />;
```

`worker` 是如何工作的？ `master`，管理员收到请求后会将请求通知给 `worker`，多个 `worker` 以争抢的机制来抢夺任务，得到任务的 `worker` 会将请求经由 `tomcat` 等做请求转发、反向代理、访问数据库等。

一个 `master` 和多个 `worker` 使得 Nginx 可以使用 `nginx -s reload` 进行热部署。

每个 `worker` 是独立的进程，如果其中一个 `worker` 出现问题，其它 `worker` 是独立运行的，会继续争抢任务，实现客户端的请求过程，而不会造成服务中断。

Nginx 和 Redis 类似，都采用了 I/O 多路复用机制，每个 `worker` 都是一个独立的进程，每个进程里只有一个主线程，通过异步非阻塞的方式来处理请求，每个 `worker` 的线程可以把一个 CPU 的性能发挥到极致，因此，`worker` 数和服务器的 CPU 数相等是最为适宜的。

## 配置文件重载原理

`reload`  重载配置文件的流程：

1. 向 `master`  进程发送 `HUP`  信号（ `reload`  命令）；
2. `master`  进程检查配置语法是否正确；
3. `master`  进程打开监听端口；
4. `master`  进程使用新的配置文件启动新的 `worker` 子进程；
5. `master`  进程向老的 `worker` 子进程发送 `QUIT` 信号；
6. 老的 `worker` 进程关闭监听句柄，处理完当前连接后关闭进程；
7. 整个过程 Nginx  始终处于平稳运行中，实现了平滑升级，用户无感知；

## 模块化管理机制

Nginx 的内部结构是由核心部分和一系列的功能模块所组成。这样划分是为了使得每个模块的功能相对简单，便于开发，同时也便于对系统进行功能扩展。Nginx 的模块是互相独立的,低耦合高内聚。
