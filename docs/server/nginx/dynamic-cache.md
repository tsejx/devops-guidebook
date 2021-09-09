---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 动态缓存
order: 10
---

# 动态缓存

## 代理缓存

```nginx
upstream imooc {
    server 116.62.103.228:8001;
    server 116.62.103.228:8002;
    server 116.62.103.228:8003;
}

proxy_cache_path /opt/app/cache levels=1:2 keys_zone=imooc_cache:10m max_size=10g inactive=10m use_temp_path=off;

server {
    listen 80;
    server_name localhost jeson.t.imooc.io;

    access_log /var/log/nginx/test_proxy.access.log main;

    location / {
        # 代理缓存开关
        proxy_cache             imooc_cache;
        proxy_pass              http://imooc;
        # 代理缓存过期周期
        proxy_cache_valid       200 304 12h;
        proxy_cache_valid       any 10m;
        # 缓存的维度
        proxy_cache_key         $host$uri$is_args$args;
        add_header              Nginx-Cache "$upstream_cache_status";

        proxy_next_upstream     error timeout invalid_header http_500 http_502 http_503 http_504;
        include proxy_params;
    }
}
```

## 动态匹配

动态匹配（请求过滤）

通常在开发环境或者测试环境的时候呢我们修改了代码，因为浏览器缓存，可能不会生效，需要手动清除缓存，才能看到修改后的效果，这里我们做一个配置让浏览器不缓存相关的资源。

```nginx
location ~* \.(js|css|png|jpg|gif)$ {
    add_header Cache-Control no-store;
}
```

`~* \.(js|css|png|jpg|gif)$` 是匹配以相关文件类型然后单独处理。`add_header` 是给请求的响应加上一个头信息 `Cache-Control: no-store`，告知浏览器禁用缓存，每次都从服务器获取。

通常动态匹配的规则形式如下：

```nginx
# 精准匹配
location = / {
    # Configuration
}

# 通用匹配
location / {
    # Configuration
}

# 路径匹配
location /documents/ {
    # Configuration
}

# 最佳匹配
location ^~ /images/ {
    # Configuration
}

# 正则匹配
location ~* \.(gif|jpg|jpeg)$ {
    # Configuration
}
```

- `=`：表示精确匹配，只有请求的 URL 路径与后面的字符串完全相等时，才会命中（优先级最高）
- `^~`：表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找
- `~`：表示该规则是使用正则定义的，区分大小写
- `~*`：表示该规则是使用正则定义的，不区分大小写

我们也可以通过状态码来过滤请求：

```nginx
# 通过状态码，返回指定的错误页面
error_page 500 502 503 504 /50x.html;

location = /50x.html {
    root /source/error_page;
}
```
