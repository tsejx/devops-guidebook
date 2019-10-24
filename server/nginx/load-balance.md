# 负载均衡

## GSLB

> GSLB 是英文 Global Server Load Balance 的缩写，意思是全局负载均衡。作用：实现在广域网（包括互联网）上不同地域的服务器间的流量调配，保证使用最佳的服务器服务离自己最近的客户，从而确保访问质量。

## SLB

> 负载均衡（Server Load Balancer，简称 SLB）是一种网络负载均衡服务，针对阿里云弹性计算平台而设计，在系统架构、系统安全及性能，扩展，兼容性设计上都充分考虑了弹性计算平台云服务器使用特点和特定的业务场景。

## 四层负载均衡

## 七层负载均衡

配置语法：

```linux
syntax: upstream name{...}
default: -
context: http
```

🌰 **示例：**

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

**后端服务器在负载均衡调度中的状态**

| 字段         | 作用                                  |
| ------------ | ------------------------------------- |
| down         | 当前的 Server 暂时不参与负载均衡      |
| backup       | 预留的备份服务器                      |
| max_fails    | 允许请求失败的次数                    |
| fail_timeout | 经过 max_fails 失败后，服务暂停的时间 |
| max_conns    | 限制最大的接收的连接数                |

## 调度算法

| 字段        | 作用                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| 轮询        | 按时间顺序逐一分配到不同的后端服务器                                         |
| 加权轮询    | weight 值越大，分配到的访问几率越高                                          |
| ip_hash     | 每个请求按访问 ip 的 hash 结果分配，这样来自同个 ip 的固定访问一个后端服务器 |
| least_conn  | 最少链接数，那个机器连接数少就分支                                           |
| url_hash    | 按照访问的 url 的 hash 结果来分配请求，是每个 url 定向到同一个后端服务器     |
| hash 关键值 | hash 自定义的 key                                                            |
