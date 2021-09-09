---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 地址重定向
order: 11
---

# 地址重定向

应用场景：

- URL 访问跳转，支持开发设计
  - 页面跳转、兼容性支持、展示效果等
- SEO 优化
- 维护
  - 后台维护、流量转发
- 安全

使用方式：

```nginx
rewrite ^(.*)$ /pages/maintain.html break;
```

| 字段        | 作用                                                                              |
| :---------- | :-------------------------------------------------------------------------------- |
| `last`      | 停止 rewrite 检测                                                                 |
| `break`     | 停止 rewrite 检测                                                                 |
| `redirect`  | 返回 302 临时重定向，地址栏会显示跳转后的地址                                     |
| `permanent` | 返回 301 永久重定向，地址栏会显示跳转后的地址（浏览器下次直接访问重定向后的地址） |

<br />

```nginx
root /opt/app/code;

location ~ ^/break {
    rewrite ^/break /test/ break;
}

location ~ ^/last {
    rewrite ^/last /test/ last;
}

location /test/ {
    default_type application/json;
    return 200 '{"status": "success"}'
}

location ~ ^/imooc {
    #rewrite ^/imooc http://www.imooc.com/ permanent;
    #rewrite ^/imooc http://www.imooc.com/ redirect;
}
```

规则优先级：

- 执行 server 块的 rewrite 指令
- 执行 location 匹配
- 执行指定的 location 中的 rewrite

## 常用 301 跳转

```nginx
# 将 domain.com 重定向到 www.domain.com
server {
  listen 80;
  server_name domain.com;
  rewrite ^/(.*) http://www.domain.com/$1 permanent;
}

server {
  listen 80;
  server_name www.domain.com;
  location / {
    root html/brain;
    index index.html index.htm;
  }

  access.log logs/brain.log.main gzip buffer=128k flush=5s;
  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
    root html;
  }
}
```

## 跨端适配

Nginx 可以通过内置变量 `$http_user_agent`，获取到请求客户端的 `userAgent`，从而知道用户处于移动端还是 PC 端，进而控制重定向到 H5 站还是 PC 站。

```nginx
location / {
    # 当 userAgent 中检测到移动端设备
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
        set $mobile_request '1';
    }
    # 则重定向至
    if ($mobile_request = '1') {
        rewrite ^.+ http://h5.example.com;
    }
}
```
