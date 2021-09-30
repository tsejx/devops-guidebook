---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 代理服务器
order: 8
---

# 代理服务器

Nginx 的一个常见应用是将其设置为代理服务器（Proxy Server），即接受客户端的请求并将其转发给真正的服务器，再接受真正的服务器发来的响应，将它们发送到客户端。

## 代理区别

- 正向代理的对象是客户端
- 反向代理代理的是服务器

### 正向代理

反向代理不好理解，正向代理大家总有用过，翻墙工具其实就是一个正向代理工具。它会把访问墙外服务器 Server 的网页请求，代理到一个可以访问该网站的代理服务器 Proxy，这个代理服务器 Proxy 把墙外服务器 Server 上的网页内容获取，再转发给客户。

概括说：就是客户端和代理服务器可以直接互相访问，属于一个 LAN（局域网）；代理对用户是非透明的，即用户需要自己操作或者感知得到自己的请求被发送到代理服务器；代理服务器通过代理用户端的请求来向域外服务器请求响应内容。

### 反向代理

在反向代理中（事实上，这种情况基本发生在所有的大型网站的页面请求中），客户端发送的请求，想要访问 Server 服务器上的内容。但将被发送到一个代理服务器 Proxy，这个代理服务器将把请求代理到和自己属于同一个 LAN 下的内部服务器上，而用户真正想获得的内容就储存在这些内部服务器上。看到区别了吗，这里 Proxy 服务器代理的并不是客户，而是服务器，即向外部客户端提供了一个统一的代理入口，客户端的请求，都先经过这个 proxy 服务器，至于在内网真正访问哪台服务器内容，由这个 Proxy 去控制。一般代理是指代理客户端，而这里代理的对象是服务器，这就是 **反向** 这个词的意思。Nginx 就是来充当这个 Proxy 的作用。

概括说：就是代理服务器和真正 Server 服务器可以直接互相访问，属于一个 LAN（服务器内网）；代理对用户是透明的，即无感知。不论加不加这个反向代理，用户都是通过相同的请求进行的，且不需要任何额外的操作；代理服务器通过代理内部服务器接受域外客户端的请求，并将请求发送到对应的内部服务器上。

使用反向代理最主要有两个原因：

1. 安全及权限。可以看出，使用反向代理后，用户端将无法直接通过请求访问真正的内容服务器，而必须首先通过 Nginx。可以通过在 Nginx 层上将危险或者没有权限的请求内容过滤掉，从而保证了服务器的安全。
2. 负载均衡。例如一个网站的内容被部署在若干台服务器上，可以把这些机子看成一个集群，那么 Nginx 可以将接收到的客户端请求“均匀地”分配到这个集群中所有的服务器上（内部模块提供了多种负载均衡算法），从而实现服务器压力的负载均衡。此外，nginx 还带有健康检查功能（服务器心跳检查），会定期轮询向集群里的所有服务器发送健康检查请求，来检查集群中是否有服务器处于异常状态，一旦发现某台服务器异常，那么在以后代理进来的客户端请求都不会被发送到该服务器上（直到后面的健康检查发现该服务器恢复正常），从而保证客户端访问的稳定性。

## 基本配置

首先，向 Nginx 的配置文件中添加一个 `server` 块来定义代理服务器：

```nginx
server {
    listen 8080;
    root /data/example;

    location / {}
}
```

此服务器侦听端口 8080，并将所有请求映射到本地文件系统上的 `/data/example` 目录。 创建此目录并将 `index.html` 放入其中。 注意，`root` 指令放在 `server` 上下文中，这样当 `location` 块中不含 `root` 指令时将使用所属 `server` 的 `root` 指令。

接下来，使用上一节中的服务器配置，并将其修改为代理服务器配置。 在第一个位置块中，加上 `proxy_pass` 指令：

```ngix
server {
  location / {
    # proxy_pass指令的参数为：协议+主机名+端口号
    proxy_pass http://localhost:8080;
  }

  location /images/ {
    root /data;
  }
}
```

修改第二个 匹配 `/images/` 前缀的 `location` 块，使其与请求图像文件的扩展名相匹配：

```nginx
location ~ \.(gif|jpg|png)$ {
    root /data/images;
}
```

该参数是一个正则表达式，匹配以 `.gif`、`.jpg` 或 `.png`结尾的所有 URI。 正则表达式应该以 `~` 开头。 相应的请求将映射到 `/data/images` 目录。

当 Nginx 选择一个 `location` 块来处理请求时，它首先检查指定 `location` 块的前缀，记住具有最长前缀的 `location` 块，然后检查正则表达式。 如果与正则表达式匹配， Nginx 选择此 `location` 块，否则，选择先前记住的 `location` 块。

代理服务器的最终配置如下：

```nginx
server {
    location / {
        proxy_pass http://localhost:8080/;
    }

    location ~ \.(gif|jpg|png)$ {
        root /data/images;
    }
}
```

此服务器将过滤以 `.gif`、`.jpg` 或 `.png` 结尾的请求，并将它们映射到 `/data/images` 目录（通过向 `root` 指令的参数添加请求的 `URI`），并将所有其他请求发送给上面配置的代理服务器。

这样，图片和其他请求就可以使用不同的服务器来处理。

## 通用配置

```nginx
server {
    # 监听 80 端口
    listen 80;
    # 转发至的目标服务器，如果是本地服务器地址则是 localhost
    server_name target.domain.com;

    # charset koi8-r;
    access_log /var/log/nginx/test_proxy.access.log main;

    location / {
        # HTTP 版本
        proxy_http_version 1.1;

        # 代理服务器指向的真正服务器地址
        proxy_pass http://127.0.0.1:8080

        # 跳转重定向配置
        proxy_redirect default;

        # 头信息配置（在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息）
        # 请求 host 传给真正服务器
        proxy_set_header    Host              $http_host;
        # 请求 IP 传给真正服务器
        proxy_set_header    X-Real-IP         $remote_addr;
        # 请求协议传给真正服务器
        proxy_set_header    X-Scheme          $scheme;
        proxy_set_header    X-Forward-For     $proxy_add_x_forwarded_for;

        # 超时配置（配置 Nginx 与后端代理服务器尝试建立连接的超时时间）
        proxy_connect_timeout 30;
        # 配置 Nginx 向后端服务器组发出 read 请求后，等待相应的超时时间
        proxy_send_timeout 60;
        # 配置 Nginx 向后端服务器组发出 write 请求后，等待相应的超时时间
        proxy_read_timeout 60;

        # 缓冲区配置
        # 被代理服务器数据和客户端请求异步
        proxy_buffering on;
        # 特殊 Buffer 大小
        proxy_buffer_size 32k;
        # 代理服务器可占用 Buffer 个数和每个 Buffer 大小
        proxy_buffers 4 128k;
        proxy_busy_buffers_size 256k;
        # 临时文件目录及层级
        proxy_temp_path /usr/local/nginx/proxy_temp 1 2;
        # 临时文件总大小
        proxy_max_temp_file_size 256k;

        # 路径重写
        # 在使用 Nginx 做反向代理的时候，需要匹配到跨域的接口再作转发，为了方便匹配之后、转发之前把添加的那段去掉，因此需要 rewrite
        # rewrite /api/(.*) /$1 break;
    }
}
```

## 单端口部署多个应用

相同 IP 端口部署多个单页应用（前端应用）的方法。

### 子域名区分

使用子域名区分，此种方法最是简单。但是限制也大，必须要买域名，或者修改访问者电脑的 hosts 文件。

```nginx
server {
    listen          80;
    server_name     test.mrsingsing.com;  #子域名 test 访问时
    localtion / {
       root         /usr/local/test;
       try_files    $uri /index.html index.html;
    }
}

server {
   listen           80;
   server_name      demo.mrsingsing.com; # 访问子域名 demo 时。
   location / {
       root         /usr/local/demo;
       try_files    $uri /index.html index.html;
   }

}
```

### 子路径区分

如果一个域名下有多个项目，那么使用根路径配置就不合适了，我们需要在根路径下指定一层路径。

非根路径配置方式：

```nginx
location ^~ /admin {
        # 此处为 admin 的路径
        alias /usr/local/admin;
        index index.html;
        try_files $uri $uri/ /index.html = 404;
}
location ^~ /web {
        # 此处为 web 的路径
        alias /usr/local/web;
        index index.html;
        try_files $uri $uri/ /index.html = 404;
}
```

---

**参考资料：**

- [📝 Nginx 反向代理之 proxy_buffering](https://www.cnblogs.com/yyxianren/p/10831673.html)
