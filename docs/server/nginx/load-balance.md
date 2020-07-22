---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 负载均衡
order: 8
---

# 负载均衡

当一个应用单位时间内访问量激增，服务器的带宽及性能受到影响，影响大到自身承受能力时，服务器就会宕机奔溃，为了防止这种现象发生，以及实现更好的用户体验，我们可以通过配置 Nginx 负载均衡的方式来分担服务器压力。

当有一台服务器宕机时，负载均衡器就分配其他的服务器给用户，极大的增加的网站的稳定性。当用户访问 Web 时候，首先访问到的是负载均衡器，再通过负载均衡器将请求转发给后台服务器。

负载均衡是 Nginx 比较常用的一个功能，可优化资源利用率，最大化吞吐量，减少延迟，确保容错配置，将流量分配到多个后端服务器。

Nginx 作为负载均衡主要有以下几个理由：

1. 高并发连接
2. 内存消耗少
3. 配置文件非常简单
4. 成本低廉
5. 支持 Rewrite 重写规则
6. 内置的健康检查功能
7. 节省带宽
8. 稳定性高

Nginx 工作在网络的 7 层，可以针对 HTTP 应用本身来做分流策略。支持七层 HTTP、HTTPS 协议的负载均衡。对四层协议的支持需要第三方插件 `-yaoweibin` 的 `ngx_tcp_proxy_module` 实现了 TCP upstream。

## 均衡策略

Nginx 的负载均衡策略可以划分为两大类：`内置策略` 和 `扩展策略`。

内置策略包含 **加权轮询** 和 **ip hash**，在默认情况下这两种策略会编译进 Nginx 内核，只需在 Nginx 配置中指明参数即可。

扩展策略有很多，如 **fair**、**通用 hash**、**consistent hash** 等，默认不编译进 Nginx 内核。

| 策略        | 作用                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| 轮询        | 按时间顺序逐一分配到不同的后端服务器                                         |
| 加权轮询    | weight 值越大，分配到的访问几率越高                                          |
| ip_hash     | 每个请求按访问 ip 的 hash 结果分配，这样来自同个 ip 的固定访问一个后端服务器 |
| least_conn  | 最少链接数，那个机器连接数少就分支                                           |
| url_hash    | 按照访问的 url 的 hash 结果来分配请求，是每个 url 定向到同一个后端服务器     |
| hash 关键值 | hash 自定义的 key                                                            |

这里举出常用的几种调度算法策略：

- 轮询策略（默认），请求按时间顺序，逐一分配到 Web 层服务，然后周而复始，如果 Web 层服务挂掉，自动剔除

```nginx
upstream backend {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
}
```

- `weight=number` 设置服务器的权重，默认为 1，权重大的会被优先分配

```nginx
upstream backend {
  server 127.0.0.1:3000 weight=2;
  server 127.0.0.1:3001 weight=1;
}
```

- `backup` 标记为备份服务器。当主服务器不可用时，将传递与备份服务器的连接。

```nginx
upstream backend {
  server 127.0.0.1:3000 backup;
  server 127.0.0.1:3001;
}
```

- 客户端 IP 绑定：`ip_hash` 保持会话，保证同一客户端始终访问一台服务器。

```nginx
upstream backend {
  ip_hash;
  server 127.0.0.1:3000 backup;
  server 127.0.0.1:3001;
}
```

- 最小连接数策略：`least_conn` 优先分配最少连接数的服务器，避免服务器超载请求过多。

```nginx
upstream backend {
  least_conn;
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
}
```

- 最快响应时间策略：`fair` 依赖于 Nginx Plus，有限分配给响应时间最短的服务器

当我们需要代理一个集群时候可以通过下面这种方式实现

```nginx
http {
  upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
  }

  server {
    listen      9000;
    server_name localhost;

    location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Scheme $scheme;

      proxy_pass backend;
    }
  }
}
```

七层配置：

```nginx
upstream imooc {
    server 116.62.103.228:8001;
    server 116.62.103.228:8002;
    server 116.62.103.228:8003;
}

server {
    listen 80;
    server_name localhost jeson.t.imooc.io;

    #charset koi8-r
    access_log /var/log/nginx/test_proxy.access.log main;

    location / {
        proxy_pass http://imooc;
        include proxy_params;
    }

    # error_page 404 /404.html
}
```

## 动态负载均衡

### 自身监控

内置了对后端服务器的健康检查功能。如果 Nginx Proxy 后端的某台服务器宕机了，会把返回错误的请求重新提交到另一个节点，不会影响前端访问。它没有独立的健康检查模块，而是使用业务请求作为健康检查，这省去了独立健康检查线程，这是好处。坏处是，当业务复杂时，可能出现误判，例如后端响应超时，这可能是后端宕机，也可能是某个业务请求自身出现问题，跟后端无关。

### 可扩展性

Nginx 属于典型的微内核设计，其内核非常简洁和优雅，同时具有非常高的可扩展性。

Nginx 是纯 C 语言的实现，其可扩展性在于其模块化的设计。目前，Nginx 已经有很多的第三方模块，大大扩展了自身的功能。`nginx_lua_module` 可以将 Lua 语言嵌入到 Nginx 配置中，从而利用 Lua 极大增强了 Nginx 本身的编程能力，甚至可以不用配合其它脚本语言（如 PHP 或 Python 等），只靠 Nginx 本身就可以实现复杂业务的处理。

### 配置修改

Nginx 支持热部署，几乎可以做到 7\*24 不间断运行，即使运行数个月也不需要重新启动。能够在不间断服务的情况下，对软件版本进行进行升级。Nginx 的配置文件非常简单，风格跟程序一样通俗易懂，能够支持 perl 语法。使用 `nginx –s reload` 可以在运行时加载配置文件，便于运行时扩容/减容。重新加载配置时，master 进程发送命令给当前正在运行的 worker 进程 worker 进程接到命令后会在处理完当前任务后退出。同时，master 进程会启动新的 worker 进程来接管工作。

---

**参考资料：**

- [五分钟看懂 Nginx 负载均衡](https://juejin.im/post/5e806d84e51d4546b659b370)
- [Nginx 负载均衡](https://zhuanlan.zhihu.com/p/46601216)
