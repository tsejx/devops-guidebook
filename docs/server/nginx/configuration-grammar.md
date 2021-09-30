---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 配置语法
order: 5
---

# 配置语法

更多更详细的配置请查阅：[nginx documentation](http://nginx.org/en/docs/) 或 [Nginx 中文文档](https://www.nginx.cn/doc/)

## 配置结构

Nginx 配置的核心是定义要处理的 `URL` 以及如何响应这些 `URL` 请求，即定义一系列的 **虚拟服务器（Virtual Servers）** 控制对来自特定域名或者 IP 的请求的处理。每一个虚拟服务器定义一系列的 `location` 控制处理特定的 URI 集合。每一个 `location` 定义了对映射到自己的请求的处理场景，可以返回一个文件或者代理此请求。

```bash
# main 全局块

# Events 块
events { }

# Http 块
# 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
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
- `server`：配置虚拟主机的相关参数，一个 HTTP 中可以有多个 `server` 块
- `location`：用于配置请求的路由，以及各种页面的处理情况
- `upstream`：配置后端服务器具体地址，负载均衡配置不可或缺的部分

配置文件的语法规则：

- 配置文件由指定的指令控制，指令分为 **简单指令** 与 **指令块** 构成
- 简单指令包含 **指令名称** 和 **指令参数**
- 指令与参数间以空格符号分隔，每条指令以 `;` 分号结尾
- 指令块以 `{}` 大括号将多条指令组织在一起
- `include` 语句允许组合多个配置文件以提升可维护性
- 使用 `#` 符号添加注释，提高可读性
- 使用 `$` 符号使用变量
- 部分指令的参数支持正则表达式

## main 全局块

该部分配置用于设置影响 Nginx 全局的指令，通常包括以下几个部分：

- 配置运行 Nginx 服务器用户（组）
- worker process 数
- Nginx 进程 PID 存放路径
- 错误日志的存放路径
- 配置文件引入

```nginx
# 配置运行 Nginx 服务器用户（组）
user root;

# 错误日志的存放路径
error_log /var/log/nginx/error.log;

# Nginx 进程 PID 存放路径
pid /run/nginx.pid;

# 设置工作进程数量
worker_process 1;

# 配置文件引入
include /usr/share/nginx/modules/*.conf;
```

### user

指定运行 Nginx 的 `woker` 子进程的属主和属组，其中组可以不指定。

```nginx
user <USERNAME> [GROUP]

# 用户是 nginx; 组是 dev
user nginx dev;
```

### pid

指定运行 Nginx `master` 主进程的 `pid` 文件存放路径。

```nginx
# master 主进程的的 pid 存放在 nginx.pid 的文件
pid /opt/nginx/logs/nginx.pid
```

### worker_rlimit_nofile_number

指定 `worker` 子进程可以打开的最大文件句柄数。

```nginx
# 可以理解成每个 worker 子进程的最大连接数量
worker_rlimit_nofile 20480;
```

### worker_rlimit_core

指定 `worker` 子进程异常终止后的 `core` 文件，用于记录分析问题。

```nginx
# 存放大小限制
worker_rlimit_core 50M;
# 存放目录
working_directory /opt/nginx/tmp;
```

### worker_processes_number

指定 Nginx 启动的 `worker` 子进程数量。

```nginx
# 指定具体子进程数量
worker_processes 4;
# 与当前cpu物理核心数一致
worker_processes auto;
```

### worker_cpu_affinity

将每个 `worker` 子进程与我们的 `cpu` 物理核心绑定。

```nginx
# 4 个物理核心，4 个 worker 子进程
worker_cpu_affinity 0001 0010 0100 1000;
```

将每个 `worker` 子进程与特定 CPU 物理核心绑定，优势在于，避免同一个 `worker` 子进程在不同的 CPU 核心上切换，缓存失效，降低性能。但其并不能真正的避免进程切换。

### worker_priority

指定 `worker` 子进程的 `nice` 值，以调整运行 Nginx 的优先级，通常设定为负值，以优先调用 Nginx。

```nginx
# 120-10=110，110 就是最终的优先级
worker_priority -10;
```

Linux 默认进程的优先级值是 120，值越小越优先； `nice` 定范围为 `-20` 到 `+19` 。

**备注**：应用的默认优先级值是 120 加上 `nice` 值等于它最终的值，这个值越小，优先级越高。

### worker_shutdown_timeout

指定 `worker` 子进程优雅退出时的超时时间。

```nginx
worker_shutdown_timeout 5s;
```

### timer_resolution

`worker` 子进程内部使用的计时器精度，调整时间间隔越大，系统调用越少，有利于性能提升；反之，系统调用越多，性能下降。

```nginx
timer_resolution 100ms;
```

在 Linux 系统中，用户需要获取计时器时需要向操作系统内核发送请求，有请求就必然会有开销，因此这个间隔越大开销就越小。

### daemon

指定 Nginx 的运行方式，前台还是后台，前台用于调试，后台用于生产。

```nginx
# 默认是 on，后台运行模式
daemon off;
```

## events 块

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

### use

Nginx 使用何种事件驱动模型。

```nginx
# 不推荐配置它，让 Nginx 自己选择
use <method>;
```

`method` 的可选值：

- `select`
- `poll`
- `kqueue`
- `epoll`
- `/dev/poll`
- `eventport`

### worker_connections

`worker` 子进程能够处理的最大并发连接数。

```nginx
# 每个子进程的最大连接数为1024
worker_connections 1024;
```

### accept_mutex

是否打开负载均衡互斥锁。

```nginx
# 默认是 off 关闭的，这里推荐打开
accept_mutex on;
```

## http 块

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

## server 块

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

### server_name

指定虚拟主机域名。

```nginx
server_name <name1> <name2> <name3> ...

# 示例：
server_name www.nginx.com;
```

域名匹配的四种写法：

- 精确匹配：`server_name www.nginx.com`
- 左侧通配：`server_name *.nginx.com`
- 右侧通配：`server_name www.nginx.*`
- 正则匹配：`server_name ~^www\.nginx\.*$`

匹配优先级： **精准匹配** > **左侧通配符匹配** > **右侧通配符匹配** > **正则表达式匹配**

`server_name` 配置实例：

1. 配置本地 DNS 解析 `vim /etc/hosts`（macOS 系统）

```bash
# 添加如下内容，其中 121.42.11.34 是云服务器的 IP 地址
121.42.11.34 www.nginx-test.com
121.42.11.34 mail.nginx-test.com
121.42.11.34 www.nginx-test.org
121.42.11.34 doc.nginx-test.com
121.42.11.34 www.nginx-test.cn
121.42.11.34 fe.nginx-test.club
```

**注意**：这里使用的是虚拟域名进行测试，因此需要配置本地 DNS 解析，如果使用云服务提供商（例如阿里云）上购买的域名，则需要在云服务提供商上设置好域名解析。

```nginx
# 这里只列举了 http 端中的 sever 端配置

# 左匹配
server {
  listen         80;
  server_name    *.nginx-test.com;
  root           /usr/share/nginx/html/nginx-test/left-match/;

  location / {
    index index.html;
  }
}

# 正则匹配
server {
  listen         80;
  server_name    ~^.*\.nginx-test\..*$;
  root          /usr/share/nginx/html/nginx-test/reg-match/;

  location / {
    index index.html;
  }
}

# 右匹配
server {
  listen        80;
  server_name   www.nginx-test.*;
  root          /usr/share/nginx/html/nginx-test/right-match/;
  location / {
    index index.html;
  }
}

# 完全匹配
server {
  listen        80;
  server_name   www.nginx-test.com;
  root          /usr/share/nginx/html/nginx-test/all-match/;
  location / {
    index index.html;
  }
}

```

3. 访问分析

- 当访问 `www.nginx-test.com` 时，都可以被匹配上，因此选择优先级最高的完全匹配
- 当访问 `mail.nginx-test.com` 时，会进行左匹配
- 当访问 `www.nginx-test.org` 时，会进行右匹配
- 当访问 `doc.nginx-test.com` 时，会进行左匹配
- 当访问 `www.nginx-test.cn` 时，会进行右匹配
- 当访问 `fe.nginx-test.club` 时，会进行正则匹配

### root

指定静态资源目录位置，它可以写在 `http`、`servr`、`location` 块等配置中。

`root` 与 `alias` 的区别主要在于 Nginx 如何解释 `location` 后面的路径的 URI，这会使两者分别以不同的方式将请求映射到服务器文件上。具体来看：

- `root` 的处理结果是：`root` 路径 + `location` 路径
- `alias` 的处理结果是：使用 `alias` 路径替换 `location` 路径

```nginx
root path;

# 例如
location /image {
  root /opt/nginx/static;
}
```

当用户访问 `www.test.com/image/1.png` 时，实际在服务器找的路径是 `/opt/nginx/static/image/1.png`。

另一个例子：

```nginx
server {
  listen        9001;
  server_name   localhost;
  location /hello {
    root        /usr/local/var/www;
  }
}
```

在请求 `http://localhost:9001/hello` 时，服务器返回的路径地址应该是 `/usr/local/var/www/hello/index.html`。

**注意**：`root` 会将定义路径与 `URI` 叠加，`alias` 则只取定义路径。

### try_files

`try_files` 的作用就是在匹配 location 的路径时，如果没有匹配到对应的路径的话，提供一个回退的方案。

工作原理：按顺序检查文件是否存在，返回第一个找到的文件或文件夹（结尾加斜线表示为文件夹），如果所有的文件或文件夹都找不到，会进行一个内部重定向到最后一个参数。

需要注意的是，只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部 URI 的指向。最后一个参数是回退 URI 且必须存在，否则会出现内部 500 错误。命名的 `location` 也可以使用在最后一个参数中。

示例一：

```ngix
locaton / {
  try_files /app/cache/ $uri @fallback;
  index index.php index.html;
}
```

它将检测 `$document_root/app/cache/index.php`、`$document_root/app/cache/index.html` 和 `$document_root$uri` 是否存在，如果不存在将内部重定向到 `@fallback`（`@` 表示配置文件中预定义标记点）。

你也可以使用一个文件或者状态码（`=404`）作为最后一个参数，如果是最后一个参数是文件，那么这个文件必须存在。

在非根路径下使用 `try_files`，当我们希望在 `/test` 路径下部署一个路由使用 History 的 Vue 应用，那么可以使用如下的 Nginx 配置：

```nginx
server {
  listen            9001;
  server_name       localhost;
  location /test {
    root            /usr/local/var/www/hello/;
    index           index.html;
    try_files       $uri $uri/ /test/index.html;
  }
}
```

这个时候：

- 当 `/test` 路径下的请求，不会收到上面的配置影响
- 当访问 `/test` 时，会使用 `root` 的匹配规则，到服务器 `/usr/local/var/www/hello/test` 路径下寻找 `index.html` 文件
- 当访问 `/test/demo1` 时，会使用 `try_files` 的匹配规则，到 `root` 路径下去寻找最后一个参数 `/test/index.html` 的回退方案，也就是说去 `/usr/local/var/www/hello/test` 路径下寻找 `index.html` 文件

## location 块

`location` 块：配置请求的路由，以及各种页面的处理情况。

- location 配置
- 请求根目录配置
- 更改 location 的 URI
- 网站默认首页配置

### 匹配命令

不同模块指令关系：`server` 继承 `main`；`location` 继承 `server`；`upstream` 既不会继承指令也不会被继承，它有自己的特殊指令，不需要在其他地方的应用

Nginx 的路径分类：

| 参数 | 名称                 | 说明                                                                                                                                | 示例               |
| :--- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| 空   | 普通前端匹配的路径   | location 后没有参数直接跟着 **标准 URI**，表示前缀匹配，代表跟请求中的 URI 从头开始匹配。                                           | `location / {}`    |
| `=`  | 精确匹配的路径       | 用于**标准 URI** 前，要求请求字符串与其精准匹配，成功则立即处理，nginx 停止搜索其他匹配。                                           | `location ^~ / {}` |
| `^~` | 抢占式前缀匹配的路径 | 用于**标准 URI** 前，并要求一旦匹配到就会立即处理，不再去匹配其他的那些个正则 URI，一般用来匹配目录                                 | `location = / {}`  |
| `~`  | 正则匹配             | 用于**正则 URI** 前，表示 URI 包含正则表达式， **区分**大小写                                                                       | `location @a {}`   |
| `~*` | 正则匹配             | 用于**正则 URI** 前， 表示 URI 包含正则表达式， **不区分**大小写                                                                    |                    |
| `@`  | 命名路径             | @ 定义一个命名的 location，@ 定义的 locaiton 名字一般用在内部定向，例如 error_page, try_files 命令中。它的功能类似于编程中的 goto。 |                    |

实例配置：

```nginx
server {
  listen  80;
  server_name www.nginx-test.com;

  # 只有当访问 www.nginx-test.com/match_all/ 时才会匹配到/usr/share/nginx/html/match_all/index.html
  location = /match_all/ {
      root  /usr/share/nginx/html
      index index.html
  }

  # 当访问 www.nginx-test.com/1.jpg 等路径时会去 /usr/share/nginx/images/1.jpg 找对应的资源
  location ~ \.(jpeg|jpg|png|svg)$ {
    root /usr/share/nginx/images;
  }

  # 当访问 www.nginx-test.com/bbs/ 时会匹配上 /usr/share/nginx/html/bbs/index.html
  location ^~ /bbs/ {
    root /usr/share/nginx/html;
    index index.html index.htm;
  }
}
```

### 匹配优先级

Nginx `location` 的大致匹配顺序：

- 精确匹配的路径和两类前缀匹配的路径（字母序，如果某个精确匹配的路径的名字和前缀匹配的路径相同，精确匹配的路径排在前面）
- 正则路径（出现序）
- 命名路径（字母序）
- 无名路径（出现序）

### 反斜线

```nginx
location /test {
  ...
}

location /test/ {
  ...
}
```

- 不带 `/` 当访问 `www.nginx-test.com/test` 时，Nginx 先找是否有 `test` 目录，如果有则找 `test` 目录下的 `index.html`；如果没有 `test` 目录，Nginx 则会找是否有 `test` 文件
- 带 `/` 当访问 `www.nginx-test.com/test` 时，Nginx 先找是否有 `test` 目录，如果有则找 `test` 目录下的 `index.html`；如果没有它也不会去找是否存在 `test` 文件

### alias

它也是指定静态资源目录位置，它只能写在 `location` 中。

```nginx
location /image {
  alias /opt/nginx/static/image/;
}
```

当用户访问 `www.test.com/image/1.png` 时，实际在服务器找的路径是 `/opt/nginx/static/image/1.png`。

**注意**：使用 `alias` 末尾一定要添加 `/`，并且它只能位于 `location` 中。

### return

停止处理请求，直接返回响应码或重定向到其他 URL；执行 `return` 指令后，`location` 中后续指令讲不会被执行。

```nginx
return code [text];
return code URL;
return URL;

# 例如
location / {
  # 直接返回状态码
  return 404;
}

location / {
  # 返回状态码 + 一段文本
  return 404 'page not found';
}

location / {
  # 返回状态码 + 重定向地址
  return 302 /bbs;
}

location / {
  # 返回重定向地址
  return https://www.baidu.com;
}
```

### rewrite

根据指定正则表达式匹配规则，重写 `URL`。

仅可在 `servr`、`location` 或 `if`

```nginx
# 语法
rewrite <regexp> <content> [flag];

# $1 是前面括号(.*\.jpg)的反向引用
rewirte /images/(.*\.jpg)$ /pic/$1;
```

`flag` 可选值的含义：

- `last`：重写后的 `URL` 发起新请求，再次进入 `server` 段，重试 `location` 中的匹配
- `break`：直接使用冲邂逅的 `URL`，不再匹配其他 `location` 中语句
- `redirect`：返回 302 临时重定向
- `permanent`：返回 301 永久重定向

实例：

```nginx
server{
  listen 80;
  # 要在本地 hosts 文件进行配置
  server_name mrsingsing.com;
  root html;
  location /search {
    rewrite ^/(.*) https://www.google.com redirect;
  }

  location /images {
  r ewrite /images/(.*) /pics/$1;
  }

  location /pics {
    rewrite /pics/(.*) /photos/$1;
  }

  location /photos {

  }
}
```

按照这个配置我们来分析：

- 当访问 `fe.mrsingsing.club/search` 时，会自动帮我们重定向到 `https://www.google.com`
- 当访问 `fe.mrsingsing.club/images/1.jpg` 时，第一步重写 `URL` 为 `fe.mrsingsing.club/pics/1.jpg`，找到 `pics` 的 `location`，继续重写 `URL` 为 `fe.mrsingsing.club/photos/1.jpg`，找到 `/photos` 的 `location` 后，去 `html/photos` 目录下寻找 `1.jpg` 静态资源

### if 指令

`if` 指令仅存在于 `server` 和 `location` 块中

```nginx
# 语法
if (condition) {}

# 示例
if($http_user_agent ~ Chrome) {
  rewrite /(.*)/browser/$1 break;
}
```

`condition` 判断条件：

- `$variable` 仅为变量时，值为空或以 0 开头字符串都会被当做 `false` 处理
- `=` 或 `!=` 相等或不等
- `~` 正则匹配
- `!~` 非正则匹配
- `~*` 正则匹配，不区分大小写
- `-f` 或 `! -f` 检测文件存在或不存在
- `-d` 或 `! -d` 检测目录存在或不存在
- `-e` 或 `! -e` 检测文件、目录、符号链接等存在或不存在
- `-x` 或 `! -x` 检测文件可以执行或不可执行

```nginx
server {
  listen 8080;
  server_name localhost;
  root html;

  location / {
    if ( $uri = "/images/" ) {
      rewrite (.*) /pics/ break;
    }
  }
}
```

当访问 `localhost:8080/images/` 时，会进入 `if` 判断里面执行 `rewrite` 命令。

### autoindex

用户请求以 `/` 结尾时，列出目录结构，可以用于快速搭建静态资源下载网站。

配置实例：

```nginx
server {
  listen 80;
  server_name mrsingsing.com;

  location /download/ {
    root /opt/source;

    # 打开 autoindex，，可选参数有 on | off
    autoindex on;
    # 修改为 off，以KB、MB、GB 显示文件大小，默认为 on，以 bytes 显示出⽂件的确切⼤⼩
    autoindex_exact_size on;
    # 以 html 的方式进行格式化，可选参数有 html | json | xml
    autoindex_format html;
    # 显示的⽂件时间为⽂件的服务器时间。默认为 off，显示的⽂件时间为 GMT 时间
    autoindex_localtime off;
  }
}
```

当访问 mrsingsing.com/download/ 时，会把服务器 /opt/source/download/ 路径下的文件展示出来。

## 变量

Nginx 可以使用变量简化配置与提高配置的灵活性，所有的变量值都可以通过这种方式引用：

- 自定义变量
- 内置预定义变量

### 自定义变量

可以在 `server`、`http`、`location` 等标签中使用 `set` 命令（非唯一）声明变量，语法如下：

```nginx
set $variable value;
```

注意 Nginx 中的变量必须都以 `$` 开头。

### 内置预定义变量

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
| `$http_cookie`          | Cookie 信息                                                                                              |
| `$http_referer`         | 来源地址                                                                                                 |
| `$http_user_agent`      | 客户端代理信息                                                                                           |
| `$http_via`             | 最后一个访问服务器的 IP 地址                                                                             |
| `$http_x_forwarded_for` | 相当于网络访问路径。                                                                                     |
| `$limit_rate`           | 对连接速率的限制                                                                                         |
| `$remote_addr`          | 客户端 `IP` 地址                                                                                         |
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

## 配置文件目录

- 执行目录 `/usr/local/nginx/sbin/nginx`
- 模块所在目录 `/usr/lib64/nginx/modules`
- 配置所在目录 `/etc/nginx`
- 主要配置文件 `/etc/nginx/nginx.conf` 指向 `/etc/nginx/conf.d/default.conf`
- 默认站点目录 `/usr/share/nginx/html`

## 参考资料

- [📖 Nginx Documentation: Alphabetical index of variables](http://nginx.org/en/docs/varindex.html)
- [📝 Nginx 快速入门配置篇](https://mp.weixin.qq.com/s/1Y-B5HdOB2N8z27X-mWc7w)
- [📝 一文厘清 Nginx 中的 location 配置](https://segmentfault.com/a/1190000022315733)
- [📝 一文厘清 Nginx 中的 rewrite 配置](https://segmentfault.com/a/1190000022407797)
- [📝 Nginx 访问日志切割的三种方法](https://www.jiangexing.cn/355.html)
- [📝 Nginx 的 try_files 指令使用实例](https://www.cnblogs.com/zhengchunyuan/p/11281568.html)
