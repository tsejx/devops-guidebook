---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 实用配置
order: 20
---

# 实用配置

## 访问限制

`deny` 和 `allow` 是 `ngx_http_access_module` 模块中的语法。在实际生产中，经常和 `ngx_http_geo_module` 模块配合使用。

```nginx
location / {
    # 禁止访问
    deny  192.168.1.100;
    # 允许 IP 段访问（已排除 100）
    allow 192.168.1.10/200;
    # 允许该单独 IP 访问
    allow 10.110.50.16;
    # 剩下未匹配到的全部禁止访问
    deny  all;
}
```

## 合并请求

通过 `nginx-http-concat` 模块（淘宝开发的第三方模块，需单独安装）用一种特殊的请求 URL 规则（例如：`https://www.example.com/??a.js,b.js,c.js`），前端可将多个资源请求合并成一个请求，服务端 Nginx 会获取各个资源并拼接成一个结果进行返回。

```nginx
# JavaScript 资源 http-concat
# nginx-http-concat 模块的参数远不止下面三个，剩下的请查阅文档
location /static/js/ {
    # 是否打开资源合并开关
    concat on;
    # 允许合并的资源类型
    concat_types application/javascript;
    # 是否允许合并不同类型的资源
    concat_unique off;
    # 允许合并的最大资源数目
    concat_max_files 5;
}
```

## 页面内容修改

Nginx 可以通过向页面底部或者顶部插入额外的 CSS 和 JS 文件，从而实现修改页面内容。这个功能需要额外模块的支持，例如：`nginx_http_footer_filter` 或者 `ngx_http_addition_module` (都需要安装)。

工作中，经常需要切换各种测试环境，而通过 `switchhosts` 等工具切换后，有时还需要清理浏览器 DNS 缓存。可以通过 `页面内容修改 + Nginx 反向代理` 来实现轻松快捷的环境切换。

这里首先在本地编写一段 JavaScript 代码（`switchhost.js`），里面的逻辑是：在页面插入 hosts 切换菜单以及点击具体某个环境时，将该 `host` 的 IP 和 `hostname` 储存在 Cookie 中，最后刷新页面；接着编写一段 CSS 代码（`switchhost.css`）用来设置该 `hosts` 切换菜单的样式。

然后 Nginx 脚本配置：

```nginx
server {
    listen 80;
    listen  443 ssl;
    expires -1;

    # 想要代理的域名
    server_name m-element.kaola.com;
    set $root /Users/cc/Desktop/server;
    charset utf-8;
    ssl_certificate      /usr/local/etc/nginx/m-element.kaola.com.crt;
    ssl_certificate_key  /usr/local/etc/nginx/m-element.kaola.com.key;

    # 设置默认 $switch_host，一般默认为线上 host，这里的 1.1.1.1 随便写的
    set $switch_host '1.1.1.1';
    # 设置默认 $switch_hostname，一般默认为线上 'online'
    set $switch_hostname '';

    # 从 Cookie 中获取环境 IP
    if ($http_cookie ~* "switch_host=(.+?)(?=;|$)") {
        set $switch_host $1;
    }

    # 从 Cookie 中获取环境名
    if ($http_cookie ~* "switch_hostname=(.+?)(?=;|$)") {
        set $switch_hostname $1;
    }

    location / {
        expires -1;
        index index.html;
        proxy_set_header Host $host;
        # 把 HTML 页面的 gzip 压缩去掉，不然 sub_filter 无法替换内容
        proxy_set_header Accept-Encoding '';
        # 反向代理到实际服务器 IP
        proxy_pass  http://$switch_host:80;
        # 全部替换
        sub_filter_once off;
        # ngx_http_addition_module 模块替换内容。
        # 这里在头部插入一段 CSS，内容是 hosts 切换菜单的 CSS 样式
        sub_filter '</head>' '</head><link rel="stylesheet" type="text/css" media="screen" href="/local/switchhost.css" />';
        # 将页面中的'网易考拉'文字后面加上环境名，便于开发识别目前环境
        sub_filter '网易考拉' '网易考拉:${switch_hostname}';
        # 这里用了另一个模块nginx_http_footer_filter，其实上面的模块就行，只是为了展示用法
        # 最后插入一段js，内容是hosts切换菜单的js逻辑
        set $injected '<script language="javascript" src="/local/switchhost.js"></script>';
        footer '${injected}';
    }

    # 对于/local/请求，优先匹配本地文件
    # 所以上面的/local/switchhost.css，/local/switchhost.js会从本地获取
    location ^~ /local/ {
        root $root;
    }
}

```

## 持久连接

HTTP 运行在 TCP 连接之上，自然也有着跟 TCP 一样的三次握手、慢启动等特性。

启用持久连接情况下，服务器发出响应后让 TCP 连接继续打开着。同一对客户/服务器之间的后续请求和响应可以通过这个连接发送。

为了尽可能的提高 HTTP 性能，使用持久连接就显得尤为重要了。

HTTP/1.1 默认支持 TCP 持久连接，HTTP/1.0 也可以通过显式指定 Connection: keep-alive 来启用持久连接。对于 TCP 持久连接上的 HTTP 报文，客户端需要一种机制来准确判断结束位置，而在 HTTP/1.0 中，这种机制只有 Content-Length。而在 HTTP/1.1 中新增的 Transfer-Encoding: chunked 所对应的分块传输机制可以完美解决这类问题。

nginx 同样有着配置 chunked 的属性 chunked_transfer_encoding，这个属性是默认开启的。

Nginx 在启用了 GZip 的情况下，不会等文件 GZip 完成再返回响应，而是边压缩边响应，这样可以显著提高 TTFB(Time To First Byte，首字节时间，WEB 性能优化重要指标)。这样唯一的问题是，Nginx 开始返回响应时，它无法知道将要传输的文件最终有多大，也就是无法给出 Content-Length 这个响应头部。

所以，在 HTTP1.0 中如果利用 Nginx 启用了 GZip，是无法获得 Content-Length 的，这导致 HTTP1.0 中开启持久链接和使用 GZip 只能二选一，所以在这里 gzip_http_version 默认设置为 1.1。

## 其他配置

- [Nginx 出现 500 Internal Server Error 错误的解决方案](https://www.cnblogs.com/hiit/p/8568480.html)
- [Nginx: Stat() failed(13: permission denied)](https://www.jianshu.com/p/61dc693a51f1)
- [Nginx 405 not allowed 最简单快速解决方法](https://blog.csdn.net/zhaoxiace/article/details/86146797)

---

**参考资料：**

- [Nginx 与前端开发](https://juejin.im/post/5bacbd395188255c8d0fd4b2)
