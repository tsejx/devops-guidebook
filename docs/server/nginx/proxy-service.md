---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 代理服务
order: 4
---

# 代理服务

## 代理区别

- 正向代理的对象是客户端
- 反向代理代理的是服务器

## 代理配置

```bash
syntax: proxy_pass URL;
default: -
context: location, if in location, limit_except
```

URL 一般为：

- `http://localhost:8000/uri`
- `https://192.168.1.1:8000/uri`
- `http://unix:/tmp/backend.socket:/uri/`

**反向代理配置**：

```nginx
listen 80;
server_name localhost jeson.t.imooc.io;

#charset koi8-r
access_log /var/log/nginx/test_proxy.access.log main;

location / {
  root  /usr/share/nginx/html;
  index index.html index.htm;
}

location ~ /test_proxy.html$ {
    proxy_pass http://127.0.0.1:8080
}
```

想访问 8080，只能访问到 80，通过 80 然后通过反向代理可以访问到 8080。

## 缓存区配置

📖 **语法**：

```bash
syntax: proxy_buffering on | off
default: proxy_buffering on
context: location, http, server
```

扩展：

- `proxy_buffer_size`
- `proxy_buffers`
- `proxy_busy_buffers size`

## 跳转重定向配置

```bash
syntax: proxy_redirect default;proxy_redirect off;proxy_redirect redirect replacement;
default: proxy_redirect default;
context: location,http,server
```

## 头信息配置

```bash
syntax: proxy_set_header field value;
default: proxy_set_header host $proxy_host
		 proxy_set_header connection close;
context: location,http,server
```

## 超时配置

```bash
syntax: proxy_connect_timeout time;
default: proxy_connect_timeout 60s;
context:location,http,server

```

扩展：

- `proxy_read_timeout`
- `proxy_send_timeout`

## 总配置

```nginx
server {
    listen 80;
    server_name localhostjeson.t.imooc.io;

    # charset koi8-r;
    access_log /var/log/nginx/test_proxy.access.log main;

    location / {
        proxy_pass http://127.0.0.1:8080
        proxy_redirect default;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_connect_timeout 30;
        proxy_send_timeout 60;
        proxy_read_timeout 60;

        proxy_buffer_size 32k;
        proxy_buffering on;
        proxy_buffers 4 128k;
        proxy_busy_buffers_size 256k;
        proxy_max_temp_file_size 256k;
    }
}
```
