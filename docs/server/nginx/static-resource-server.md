---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 静态资源服务器
order: 5
---

# 静态资源服务器

## 静态资源

- 浏览器端渲染：HTML、CSS、JS
- 图片：JPEG、GIF、PNG
- 视频：FLV、MPEG
- 文件：TXT 等任意下载文件

## 文件读取配置

📖 **语法**：

```bash
syntax: sendfile on | off
deafult: sendfile off
context: http,server,location,if in location
```

`--with-file-aio` 异步文件读取。

📖 **语法**：

```bash
syntax: tcp_nopush on | off
default: tcp_nopush off
context: http, server, location
```

sendfile 开启的情况下，提高网络包的传输效率（等待，一次传输）

## 浏览器缓存

添加 `cache-control` 和 `expires` 头。

📖 **语法**：

```bash
syntax: expires [modified] time;
                expires epoch | max | off;
default: expires off;
context: http, server, location
```

🌰 **配置示例**：

```nginx
location ~ .*\.(htm|html)$ {
    #expires 24h;
    root /opt/app/code;
}
```

## 跨域访问

📖 **语法**：

```bash
syntax: add_header bane value [always]
default: -
context: http, server, location, if in location
```

添加请求头：Access-Control-Allow-Origin

```nginx
location ~ .*\.(htm|html)$ {
    #add_header Access-Control-Allow-Origin http://www.jesonc.com;
    #add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
    root /opt/app/code;
}
```

## 防盗链

防盗链机制的目的是防止服务器上的资源（例如图片、文件等）被其它用户采用其它的技术手段来访问或下载。

实现方式：区别哪些请求是非正常的用户请求

基于 `http_refer` 防盗链配置模块：

```nginx
location ~* \.(gif|jpg|png|jpeg)$ {
    # 只允许 192.168.0.1 请求资源
    valid_referers none blocked 192.168.0.1;
    if ($invalid_referer) {
        rewrite ^/ http://$host/logo.png;
    }
}
```

- 设置防盗链文件类型，自行修改，每个后缀用 `|` 符号分隔
- 允许文件链出的域名白名单，自行修改成己方域名，域名与域名之间使用空格隔开

---

**参考资料：**

- [Nginx 从入门到实践](https://juejin.im/post/5a2600bdf265da432b4aaaba#heading-76)
- [后端必备 Nginx 配置](https://juejin.im/entry/5d7e4540f265da03b76b50cc)
