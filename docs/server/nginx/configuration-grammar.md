---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 配置语法
order: 3
---

# 配置语法

## 配置结构

Nginx 配置的核心是定义要处理的 `URL` 以及如何响应这些 `URL` 请求，即定义一系列的 **虚拟服务器（Virtual Servers）** 控制对来自特定域名或者 IP 的请求的处理。

每一个虚拟服务器定义一系列的 `location` 控制处理特定的 URI 集合。每一个 `location` 定义了对映射到自己的请求的处理场景，可以返回一个文件或者代理此请求。

Nginx 由不同的模块组成，这些模块由配置文件中指定的**指令**控制。 指令分为 **简单指令** 和 **块指令**。

一个简单指令包含 **指令名称** 和 **指令参数**，以空格分隔，以分号（`;`）结尾。 块指令与简单指令类似，但是由大括号（`{` 和 `}`）包围。 如果块指令大括号中包含其他指令，则称该指令为上下文（如：[events](#events-块)、[http](#http-块)、[server](#server-块) 和 [location](#location-块)）。

配置文件中的放在上下文之外的指令默认放在主配置文件中（类似继承主配置文件）。`events` 和 `http` 放置在主配置文件中，`server` 放置在 `http` 块指令中，`location` 放置在 `server` 块指令中。

配置文件的注释以 `#` 开始。

```bash
# 全局块

# Events 块
events {}

# Http 块
http {

  # Server 块
  server {

    # Location 块
    location [PATTERN] {}

    location [PATTERN] {}
  }
}
```

- `main`：Nginx 的全局配置，对全局生效
- `events`：配置影响 Nginx 服务器或与用户的网络连接
- `http`：可以嵌套多个 Server，配置代理、缓存、日志定义等绝大多数功能和第三方模块的配置
- `server`：配置虚拟主机的相关参数，一个 HTTP 中可以有多个 Server
- `location`：配置请求的路由，以及各种页面的处理情况
- `upstream`：配置后端服务器具体地址，负载均衡配置不可或缺的部分

### 全局块

该部分配置用于设置影响 Nginx 全局的指令，通常包括以下几个部分：

- 配置运行 Nginx 服务器用户（组）
- worker process 数
- Nginx 进程 PID 存放路径
- 错误日志的存放路径
- 配置文件引入

```nginx
# 设置工作进程数量
worker_process 1;
```

### events 块

`events` 块配置影响 Nginx 服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

该部分配置主要影响 Nginx 服务器与用户的网络连接，主要包括：

- 设置网络连接的序列化
- 是否允许同时接收多个网络连接
- 事件驱动模型的选择
- 最大连接数的配置

```nginx
# 处理连接
events {
  # 默认使用的网络 I/O 模型，Linux 系统推荐采用 epoll 模型，FreeBSD 推荐采用 kqueue 模型
  # use epoll;

  # 设置连接数
  worker_connections: 1024;
}
```

### http 块

`http` 块可以嵌套多个 `server`，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，`mime-type` 定义，日志自定义，是否使用 `sendfile` 传输文件，连接超时时间，单连接请求数等。

- 定义 MIMI-Type
- 自定义服务日志
- 允许 sendfile 方式传输文件
- 连接超时时间
- 单连接请求数上限

```nginx
http {
  # 文件拓展名查找集合
  include   mime.types;

  # 当查找不到对应类型的时候默认值
  default_type    application/octet-stream;

  # 日志格式，定义别名为 main
  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x"_forwarded_for"';

  # 指定日志输入目录
  access_log logs/access.log main;

  # 调用 sendfile 系统传输文件，开启高效传输模式
  # sendfile 开启的情况下，提高网络包的传输效率（等待，一次传输）
  sendfile      on;
  # 减少网络报文段的数量
  tcp_nopush    on;

  # 客户端与服务器连接超时时间，超时自动断开
  # keepalive_timeout   0;
  keepalive_timeout     65;

  # 开启 Gzip 压缩
  gzip    on;

  # proxy_cache_path /nginx/cache levels=1:2 keys_zone=mycache:16m inactive=24h max_size=1g

  # 当存在多个域名的时候，如果所有配置都写在 nginx.conf 主配置文件中，难免显得杂乱无章
  # 为了方便维护，可以进行拆分配置
  include /etc/nginx/conf.d/*.conf;

  # 虚拟主机
  server {
    # 省略，详细配置看 server 块

    # 位置路由，详细配置看 location 块
    location / {

    }
  }

  # 引入其他的配置文件
  include servers/*;
}
```

### server 块

`server` 块：配置虚拟主机的相关参数，一个 `http` 中可以有多个 `server`。

- 配置网络监听
- 基于名称的虚拟主机配置
- 基于 IP 的虚拟主机配置

```nginx
# 虚拟主机
server {
  listen          8080;
  # 浏览器访问域名
  server_name     domain.com;

  charset utf-8;
  access_log  logs/domain.access.log  access;

  # 路由
  location / {
    # 访问根目录
    root    www;
    # 入口文件
    index   index.html index.htm;
  }
}
```

### location 块

`location` 块：配置请求的路由，以及各种页面的处理情况。

- location 配置
- 请求根目录配置
- 更改 location 的 URI
- 网站默认首页配置

不同模块指令关系：`server` 继承 `main`；`location` 继承 `server`；`upstream` 既不会继承指令也不会被继承，它有自己的特殊指令，不需要在其他地方的应用

Nginx 的路径分类：

- 普通前端匹配的路径，例如 `location / {}`
- 抢占式前缀匹配的路径，例如 `location ^~ / {}`
- 精确匹配的路径，例如 `location = / {}`
- 命名路径，比如 `location @a {}`
- 无名路径，比如 `if {}` 或者 `limit_except {}` 生成的路径

Nginx location 的大致匹配顺序：

- 精确匹配的路径和两类前缀匹配的路径（字母序，如果某个精确匹配的路径的名字和前缀匹配的路径相同，精确匹配的路径排在前面）
- 正则路径（出现序）
- 命名路径（字母序）
- 无名路径（出现序）

## 日志

Nginx 中的日志类型包括：

- `access.log`：记录 Nginx 处理的请求的过程，包含请求类型、时间、客户端信息、处理结果、处理时长等信息，具体可以通过 `log_format` 指令引用特定变量来记录相关信息。
- `error.log`：记录 Nginx 进程启动、停止、重启及处理请求过程中发生的错误信息。
- `rewrite.log`：记录 rewrite 规则工作的过程，可以用于调试 rewrite 规则

默认情况下回自动记录 access 日志，默认存放路径为 `/usr/local/nginx/logs/access.log`。

Nginx 提供了 `log_format` 指令用于自定义 access 日志的格式，它统一在 HTTP 层级进行配置。

**`log_format` 可使用的变量：**

| 变量名                  | 说明                                                                                                             |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `$remote_addr`          | 记录客户端 IP 地址                                                                                               |
| `$http_x_forwarded_for` | 当 Nginx 处于负载均衡器、Squid、反向代理之后时，需要这个字段才能记录用户的实际 IP 地址                           |
| `$remote_user`          | 记录客户端用户名称，针对启用了用户认证的请求进行记录                                                             |
| `$request`              | 记录用户请求的 URL                                                                                               |
| `$status`               | 记录请求结果状态码                                                                                               |
| `$body_bytes_sent`      | 发送给客户端的字节数，不包括响应头的大小                                                                         |
| `$bytes_sent`           | 发送给客户端的字节数，不包括响应头的大小                                                                         |
| `$connection`           | 连接的序列号                                                                                                     |
| `$msec`                 | 日志写入时间，单位为秒，精度为毫秒                                                                               |
| `$pipe`                 | 如果请求是通过 HTTP 流水线发送，则其值为 i `p`，否则为 `.`                                                       |
| `$http_referer`         | 记录从哪个页面链接过来的                                                                                         |
| `$http_user_agent`      | 记录客户端浏览器相关信息                                                                                         |
| `$request_length`       | 请求的长度（包括请求行、请求头和主体）                                                                           |
| `$request_time`         | 请求处理时长，单位为秒，精度为毫秒，从读入客户端的第一个字节开始，知道把最后一个字符发送给客户端进行日志写入为止 |
| `$time_iso8601`         | 标准格式下的本地时间 `2017-05-24T18:31:27+0800`                                                                  |
| `$time_local`           | 通过日志格式下的本地时间，形如 `24/May/2017:18:31:27 +0800`                                                      |

常见配置：

```nginx
# 访问日志
# access_log [存储路径] [buff=大小] [gzip=压缩级别] [flush=time 刷新时间]
acess_log /user/local/nginx/logs/access.log buffer=64k flush=1m;

log_format combined    '$remote_addr - $remote_user [$time_local]'
                                         ' "$request"  $status   $body_bytes_sent '
                                         ' "$http_referer"    "$http_user_agent" ';

# 设置日志文件缓存
open_log_file_cache max=1000 inactive=20s min_uses=1 valid=60s;

# 是否将 not found 错误记录在 error_log 中
log_not_found on;

# 在 access_log 在记录子请求的访问日志
log_subrequest off;

# 记录重写日志，默认关闭，开启后记录在 error_log
rewrite_log logs/rewrite.log on;

# 记录错误日志
error_log logs/error.log error;
```

## 变量

变量类型：

- HTTP 请求变量
- 内置变量
- 自定义变量

### 内置变量

列出常用的 Nginx 内置变量：

| 变量                    | 说明                                                                                                     |
| :---------------------- | :------------------------------------------------------------------------------------------------------- |
| `$args`                 | 这个变量等于 `GET` 请求中的所有参数,所以是复数带有 s。例如，`foo=123&bar=blahblah;` 这个变量只可以被修改 |
| `$arg_param`            | 获取 `GET` 请求中 `param` 参数的值。如 `/index.html?order=111`, 则 `$arg_order=111`                      |
| `$binary_remote_addr`   | 二进制码形式的客户端地址                                                                                 |
| `$body_bytes_sent`      | 已发送的消息体字节数                                                                                     |
| `$content_length`       | HTTP 请求信息里的 `Content-Length`                                                                       |
| `$content_type`         | 请求信息里的 `Content-Type`                                                                              |
| `$document_root`        | 针对当前请求的根路径设置值                                                                               |
| `$document_uri`         | 与 `$uri` 相同                                                                                           |
| `$host`                 | 请求信息中的 `Host`，如果请求中没有 `Host` 行，则等于设置的服务器名;                                     |
| `$http_cookie`          | cookie 信息                                                                                              |
| `$http_referer`         | 来源地址                                                                                                 |
| `$http_user_agent`      | 客户端代理信息                                                                                           |
| `$http_via`             | 最后一个访问服务器的 IP 地址                                                                             |
| `$http_x_forwarded_for` | 相当于网络访问路径。                                                                                     |
| `$limit_rate`           | 对连接速率的限制                                                                                         |
| `$remote_addr`          | 客户端地址                                                                                               |
| `$remote_port`          | 客户端端口号                                                                                             |
| `$remote_user`          | 客户端用户名，认证用                                                                                     |
| `$request`              | 用户请求信息                                                                                             |
| `$request_body`         | 用户请求主体                                                                                             |
| `$request_body_file`    | 发往后端的本地文件名称                                                                                   |
| `$request_filename`     | 当前请求的文件路径名                                                                                     |
| `$request_method`       | 请求的方法，比如 `GET`、`POST` 等                                                                        |
| `$request_uri`          | 请求的 URI，带参数                                                                                       |
| `$server_addr`          | 服务器地址，如果没有用 listen 指明服务器地址，使用这个变量将发起一次系统调用以取得地址(造成资源浪费)     |
| `$server_name`          | 请求到达的服务器名                                                                                       |
| `$server_port`          | 请求到达的服务器端口号                                                                                   |
| `$server_protocol`      | 请求的协议版本，`HTTP/1.0` 或 `HTTP/1.1`                                                                 |
| `$uri`                  | 请求的 URI，可能和最初的值有不同，比如经过重定向之类的                                                   |

## 模块

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
  - Gzip [ngx_http_gzip_module]()
  - HTTP Headers 模块 [ngx_http_headers_module](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_headers_module.html)
  - HTTP Index 模块 [ngx_http_index_module]()
  - HTTP Referer 模块 [ngx_http_referer_module]()
  - HTTP Limit Zone 模块
  - HTTP Limit Requests 模块 [ngx_http_limit_req_module]()
  - Log [ngx_http_log_module](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_log_module.html)
  - Map\*
  - Memcached [ngx_http_memcached_module]()
  - HTTP Proxy 模块 [ngx_http_proxy_module]()
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
  - Real IP [ngx_http_realip_module]()
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

## 配置文件目录

- 执行目录 `/usr/local/nginx/sbin/nginx`
- 模块所在目录 `/usr/lib64/nginx/modules`
- 配置所在目录 `/etc/nginx`
- 主要配置文件 `/etc/nginx/nginx.conf` 指向 `/etc/nginx/conf.d/default.conf`
- 默认站点目录 `/usr/share/nginx/html`

---

**参考资料：**

- [📖 Nginx Documentation: Alphabetical index of variables](http://nginx.org/en/docs/varindex.html)
- [📝 Nginx 快速入门配置篇](https://mp.weixin.qq.com/s/1Y-B5HdOB2N8z27X-mWc7w)
- [📝 Nginx 访问日志切割的三种方法](https://www.jiangexing.cn/355.html)
