---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 配置模块
order: 6
---

# 配置模块

Nginx 中的模块分为：

- 官方模块
- 第三方模块

### 官方模块

- 基本模块
  - HTTP Core 模块 [ngx_http_core_module](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_core_module.html)
  - HTTP Upstream 模块 [ngx_http_upstream_module]()
  - HTTP Auth Basic 模块 [ngx_http_auth_basic_module]()
  - HTTP AutoIndex 模块 [ngx_http_autoindex_module]()
  - Browser [ngx_http_browser_module]()
  - Charset [ngx_http_charset_module]()
  - Empty GIF
  - FastCGI
  - Geo
  - Gzip [ngx_http_gzip_module](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)
  - HTTP Headers 模块 [ngx_http_headers_module](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_headers_module.html)
  - HTTP Index 模块 [ngx_http_index_module]()
  - HTTP Referer 模块 [ngx_http_referer_module](http://nginx.org/en/docs/http/ngx_http_referer_module.html)
  - HTTP Limit Zone 模块
  - HTTP Limit Requests 模块 [ngx_http_limit_req_module]()
  - Log [ngx_http_log_module](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_log_module.html)
  - Map\*
  - Memcached [ngx_http_memcached_module]()
  - HTTP Proxy 模块 [ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
  - Rewrite
  - SSI 模块
  - User ID [ngx_http_userid_module]()
- 其他模块
  - HTTP Addition 模块 [ngx_http_addition_module]()
  - Embedded Perl\*
  - FLV [ngx_http_flv_module]()
  - Gzip Precompression
  - Random Index
  - GeoIP
  - Real IP [ngx_http_realip_module](http://nginx.org/en/docs/http/ngx_http_realip_module.html)
  - SSL [ngx_http_ssl_module]()
  - Stub Status
  - Substitution
  - WebDAV
  - Google Perftools
  - XSLT\*
  - Secure Link
  - Image Filer [ngx_http_image_filter_module]()
- 邮件模块
  - Mail Core 模块 [ngx_mail_core_module]()
  - Mail Auth 模块 [ngx_mail_auth_http_module]()
  - Mail Proxy 模块 [ngx_mail_proxy_module]()
  - Mail SSL 模块 [ngx_mail_ssl_module]()

## upstream

`upstream` 为 Nginx 内置模块，用于定义上游服务器（指的是后台提供的应用服务器）的相关信息。

```nginx
# 语法
upstream <name> {
  ...
}

# 示例
upstream back_end_server {
  server 192.168.100.33:8081;
}
```

在 `upstream` 内可使用的指令：

| 指令                 | 说明                                 |
| :------------------- | :----------------------------------- |
| `server`             | 定义上游服务器地址                   |
| `zone`               | 定义共享内存，用于跨 `worker` 子进程 |
| `keepalive`          | 对上游服务启用长连接                 |
| `keepalive_requests` | 一个长连接最多请求 HTTP 的个数       |
| `keepalive_timeout`  | 空闲情形下，一个长连接的超时时长     |
| `hash`               | 哈希负载均衡算法                     |
| `ip_hash`            | 依据 IP 进行哈希计算的负载均衡算法   |
| `least_conn`         | 最少连接数负载均衡算法               |
| `least_time`         | 最短响应时间负载均衡算法             |
| `random`             | 随机负载均衡算法                     |

### server

定义上游服务器

```nginx
# 语法
srver <address> [parameters]
```

`parameters` 可选值：

- `weight=number`  权重值，默认为 1
- `max_conns=number`  上游服务器的最大并发连接数
- `fail_timeout=time`  服务器不可用的判定时间
- `max_fails=numer`  服务器不可用的检查次数
- `backup`  备份服务器，仅当其他服务器都不可用时才会启用
- `down`  标记服务器长期不可用，离线维护

### keepalive

### keepalive_requests

### keepalive_timeout

## proxy_pass

用于配制代理服务器

可用上下文：`location`、`if`、`limit_except`

```nginx
# 语法
proxy_pass <URL>

# 示例
proxy_pass http://127.0.0.1:8081;
proxy_pass http://127.0.0.1/proxy
```

`URL` 参数原则：

1. `URL` 必须以 `http` 或 `https` 开头
2. `URL` 中可以携带变量
3. `URL` 中是否带 `URI`，会直接影响发往上游请求的 `URL`

接下来我们看看两种常见的 `URL` 用法：

1. `proxy_pass http://192.168.100.33:8001`
2. `proxy_pass http://192.168.100.33:8001/`

这两种用法的区别就是带 `/` 和不带 `/`，在配置代理时它们的区别可大了：

- 不带 `/` 意味着 Nginx 不会修改用户 `URL`，而是直接透传给上游的应用服务器
- 带 `/` 意味着 Nginx 会修改用户 `URL`，修改方案是将 `location` 后的 `URL` 从用户 `URL` 中删除

不带 `/` 的用法：

```nginx
location /bbs/ {
  proxy_pass http://127.0.0.1:8080;
}
```

分析：

1. 用户请求 `URL`：`/bbs/abc/test.html`
2. 请求到达 Nginx 的 `URL`：`/bbs/abc/test.html`
3. 请求到达上游应用服务器的 `URL`：`/bbs/abc/test.html`

带 `/` 的用法：

```nginx
location /bbs/ {
  proxy_pass http://127.0.0.1:8080;
}
```

分析：

1. 用户请求 `URL`：`/bbs/abc/test.html`
2. 请求到达 Nginx 的 `URL`：`/bbs/abc/test.html`
3. 请求到达上游应用服务器的 `URL`：`/abc/test.html`

并没有接上 `/bbs`，这点和 `root` 与 `alias` 之间的区别是保持一致的。
