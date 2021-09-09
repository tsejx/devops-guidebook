---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 静态资源服务器
order: 7
---

# 静态资源服务器

## 静态资源

静态资源即非服务器动态生成的文件。

常见静态资源类型：

- 浏览器端渲染：HTML、CSS、JS
- 图片：JPEG、GIF、PNG
- 视频：FLV、MPEG
- 文件：TXT 等任意下载文件

## 基本配置

Web 服务器一个重要的功能是服务静态文件（图像或静态 HTML 页面）。例如，Nginx 可以很方便的让服务器从 `/data/www` 获取 `html` 文件，从 `/data/images` 获取图片来返回给客户端，这只需要在 `http` 块指令中的 `server` 块指令中设置两个 `location` 块指令。

首先，创建 `/data/www` 目录，并放入 `index.html`，创建 `/data/images` 目录并在其中放置一些图片。

接下来，打开配置文件。 创建一个 server 块：

```nginx
http {
    server {

    }
}
```

通常，配置文件可以包括多个 `server` 块，它们以 **端口** 和 **服务器名称** 来区分。当 Nginx 决定某一个 `server` 处理请求后，它将请求头中的 `URI` 和 `server` 块中的 `location` 块进行对比。

加入 `location` 块指令到 `server` 中：

将以下 `location` 块添加到 `server` 块：

```nginx
location / {
  root /data/www;
}
```

上面的 `location` 块指定 `/` 前缀与请求中的 `URI` 对比。对于匹配的请求，`URI` 将被添加到 `root` 指令中指定的路径，即 `/data/www`，以此形成本地文件系统的路径，如访问 `http://localhost/bog/welcome.html`，对应服务器文件路径为 `/data/www/bog/welcome.html`。 如果 `URI` 匹配多个 `location` 块，Nginx 采用 **最长前缀匹配原则**（类似计算机网络里面的 IP 匹配）， 上面的 `location` 块前缀长度为 1，因此只有当所有其他 `location` 块匹配时，才使用该块。

接下来，添加第二个位置块：

```nginx
location /images/ {
  root /data;
}
```

它将匹配以 `/images/`（`/` 也匹配这样的请求，但具有较短的前缀）开始的请求。

`server` 块的最终配置如下：

```nginx
server {
  location / {
    root /data/www;
  }

  location /images/ {
      root /data;
  }
}
```

到目前为止，这已经是一个可以正常运行的服务器，它监听端口 80，并且可以在本地计算机上访问 `http://localhost/`。 对于 `/images/` 开头的请求，服务器将从 `/data/images` 目录发送文件。 如，对于 `http://localhost/images/example.png` 请求，nginx 将响应 `/data/images/example.png` 文件。 如果不存在，Nginx 将返回 404。`URI` 不以 `/images/` 开头的请求将映射到 `/data/www` 目录。 例如，对于 `http://localhost/some/example.html` 请求，Nginx 将响应 `/data/www/some/example.html` 文件。

**简易配置**

```nginx
# 虚拟主机server块
server {
    # 端口
    listen   8080;
    # 匹配请求中的host值
    server_name  localhost;

    # 监听请求路径
    location / {
        # 查找目录
        root /source;
        # 默认查找
        index index.html index.htm;
    }
}
```

说明相关配置字段：

- `server`：配置虚拟主机的相关参数，可以有多个
- `server_name`：通过请求中的 host 值，找到对应的虚拟主机的配置
- `location`：配置请求路由，处理相关页面情况
- `root`：查找资源的路径

配置完成后执行 `nginx -t` 看是否有错误，如果看到的是下面这种就是成功：

```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

然后执行 `nginx -s reload` 更新 Nginx 配置文件

## 文件读取配置

```nginx
http {
  # 调用 sendfile 系统传输文件，开启高效传输模式
  # sendfile 开启的情况下，提高网络包的传输效率（等待，一次传输）
  sendfile      on;

  # 减少网络报文段的数量
  tcp_nopush    on;

  # 与 tcp_nopush 相反
  # tcp_nodelay off;
}
```

在 Keep-Alive 连接下，提高网络包的传输实时性。

## 文件压缩配置

开发过程中难免用到一些成熟的框架，或者插件，这些外部的依赖，有时候体积比较大，导致页面响应缓慢，我们可以用打包工具（Webpack、rollup），将代码进行压缩，以缩小代码体积。 开启 Nginx Gzip 压缩功能。需要注意的是 Gzip 压缩功能需要浏览器跟服务器都支持，即服务器压缩，浏览器解析。

### Nginx 配置 gzip

```nginx
server {
    # 开启 gzip 压缩(默认 off)
    gzip on;

    # 设置压缩文件的类型（text/html)
    gzip_types text/csv text/xml text/css text/plain text/javascript application/javascript application/json application/xml;

    # 设置 gzip 所需的 HTTP 协议最低版本（HTTP/1.1, HTTP/1.0）
    gzip_http_version 1.1;

    # 设置压缩级别，压缩级别越高压缩时间越长  （1-9）
    gzip_comp_level 4;

    # 设置压缩的最小字节数， 页面 Content-Length 获取
    gzip_min_length 1000;
}
```

- `gzip_types`：要采用 `gzip` 压缩的 MIME 文件类型，其中 `text/html` 被系统强制启用；
- `gzip_static`：默认 off，该模块启用后，Nginx 首先检查是否存在请求静态文件的 gz 结尾的文件，如果有则直接返回该 `.gz` 文件内容；
- `gzip_proxied`：默认 off，Nginx 做为反向代理时启用，用于设置启用或禁用从代理服务器上收到相应内容 `gzip` 压缩；
- `gzip_vary`：用于在响应消息头中添加 `Vary：Accept-Encoding`，使代理服务器根据请求头中的 `Accept-Encoding` 识别是否启用 `gzip` 压缩；
- `gzip_comp_level`：`gzip` 压缩比，压缩级别是 1-9，1 压缩级别最低，9 最高，级别越高压缩率越大，压缩时间越长，建议 4-6；
- `gzip_buffers`：获取多少内存用于缓存压缩结果，16 8k 表示以 `8k*16` 为单位获得；
- `gzip_min_length`：允许压缩的页面最小字节数，页面字节数从 `header` 头中的 `Content-Length` 中进行获取。默认值是 0，不管页面多大都压缩。建议设置成大于 1k 的字节数，小于 1k 可能会越压越大；
- `gzip_http_version`：默认 1.1，启用 `gzip` 所需的 HTTP 最低版本；

查看配置是否生效，查看响应头中的 `Content-Encoding` 字段，值为 `gzip`。

注意：一般 `gzip` 的配置建议加上 `gzip_min_length 1k`，否则会因为文件太小，压缩后体积还比压缩之前体积还大，所以最好设置 `1kb` 的文件就不要 `gzip` 压缩了。

### Webpack 的 gzip 配置

当前端项目使用 Webpack 进行打包的时候，也可以开启 gzip 压缩：

```js
// vue-cli3 的 vue.config.js 文件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  // gzip 配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      return {
        plugins: [new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css/,    // 匹配文件名
          threshold: 10240,               // 文件压缩阈值，对超过10k的进行压缩
          deleteOriginalAssets: false     // 是否删除源文件
        })]
      }
    }
  },
  ...
}
```

> 既然已经有 Nginx 的 gzip 压缩了，为什么还需要 Webpack 进行 gzip 压缩？

因为如果全都是使用 Nginx 来压缩文件，会耗费服务器的计算资源，如果服务器的 `gzip_comp_level` 配置的比较高，就更增加服务器的开销，相应增加客户端的请求时间，得不偿失。如果压缩的动作在前端打包的时候就做了，把打包之后的高压缩等级文件作为静态资源放在服务器上，Nginx 会优先查找这些压缩之后的文件返回给客户端，相当于把压缩文件的动作从 Nginx 提前给 Webpack 打包的时候完成，节约了服务器资源，所以一般推介在生产环境应用 Webpack 配置 `gzip` 压缩。

## 浏览器缓存

浏览器缓存是为了加速浏览，浏览器在用户磁盘上，对最近请求过的文档进行存储。当访问者再次请求这个页面时，浏览器就可以从本地磁盘显示文档，这样，就可以加速页面的阅览，缓存的方式节约了网络的资源，提高了网络的效率。

浏览器缓存可以通过添加 `expires` 和 `cache-control` 头来实现。

HTTP 协议的 Cache -Control 指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置 Cache-Control 并不会影响另一个消息处理过程中的缓存处理过程。

- 请求时的缓存指令：`no-cache`、`no-store`、`max-age`、`max-stale`、`min-fresh`、`only-if-cache` 等
- 响应消息中的指令：`public`、`private`、`no-cache`、`no-store`、`no-transform`、`must-revalidate`、`proxy-revalidate`、`max-age`。

### 设置绝对过期时间

设置以分钟为单位的绝对过期时间, 优先级比 Cache-Control 低, 同时设置 Expires 和 Cache-Control 则后者生效。也就是说要注意一点: Cache-Control 的优先级高于 Expires。

`expires` 起到控制页面缓存的作用，合理配置 `expires` 可以减少很多服务器的请求，`expires` 的配置可以在 HTTP 段中或者 server 段中或者 location 段中。比如控制图片等过期时间为 30 天, 可以配置如下:

```nginx
# 对 html 文件缓存 24 小时
location ~ .*\.(htm|html)$ {
  expires 24h;

  root /var/www/html;
}

# 对常见格式的图片在浏览器本地缓存 30 天
location ~ .*\.(gif|jpg|jpeg|png|bmp|ico)$ {
  expires 30d;

  root /var/www/img/
}

# 设置无限的缓存时间
location ~ \.(wma|wmv|asf|mp3|mmf|zip|rar|swf|flv)$ {
  expires max;

  root /var/www/upload/;
}
```

### 设置相对过期时间

Cache-Control 通用消息头字段被用于在 HTTP 请求和响应中通过指定指令来实现缓存机制。缓存指令是单向的, 这意味着在请求设置的指令，在响应中不一定包含相同的指令。

指令不区分大小写，并且具有可选参数，可以用令牌或者带引号的字符串语法。多个指令以逗号分隔。

- 可缓存性
  - `public`： 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存。表示相应会被缓存，并且在多用户间共享。默认是 `public`
  - `private`：表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）,可以缓存响应内容。响应只作为私有的缓存，不能在用户间共享。如果要求 HTTP 认证，响应会自动设置为 `private`
  - `no-cache`： 在释放缓存副本之前，强制高速缓存将请求提交给原始服务器进行验证。指定不缓存响应，表明资源不进行缓存。但是设置了 `no-cache` 之后并不代表浏览器不缓存，而是在缓存前要向服务器确认资源是否被更改。因此有的时候只设置 `no-cache` 防止缓存还是不够保险，还可以加上 `private` 指令，将过期时间设为过去的时间
  - `only-if-cached`：表明客户端只接受已缓存的响应，并且不要向原始服务器检查是否有更新的拷贝
- 到期
  - `max-age=<seconds>`：设置缓存存储的最大周期，超过这个时间缓存被认为过期（单位秒）。与 `Expires` 相反，时间是相对于请求的时间。`max-age` 会覆盖掉 `Expires`
  - `s-maxage=<seconds>`：覆盖 `max-age` 或者 `Expires` 头，但是仅适用于共享缓存（比如各个代理），并且私有缓存中它被忽略。也就是说 `s-maxage` 只用于共享缓存，比如 CDN 缓存（`s -> share`）。与 `max-age` 的区别是：`max-age` 用于普通缓存，而 `s-maxage` 用于代理缓存。如果存在 `s-maxage`，则会覆盖 `max-age` 和 `Expires`
  - `max-stale[=<seconds>]`：表明客户端愿意接收一个已经过期的资源。 可选的设置一个时间（单位秒），表示响应不能超过的过时时间
  - `min-fresh=<seconds>`： 表示客户端希望在指定的时间内获取最新的响应
  - `stale-while-revalidate=<seconds>`：表明客户端愿意接受陈旧的响应，同时在后台异步检查新的响应。秒值指示客户愿意接受陈旧响应的时间长度
  - `stale-if-error=<seconds>`：表示如果新的检查失败，则客户愿意接受陈旧的响应。秒数值表示客户在初始到期后愿意接受陈旧响应的时间
- 重新验证和重新加载
  - `must-revalidate`：缓存必须在使用之前验证旧资源的状态，并且不可使用过期资源。表示如果页面过期，则去服务器进行获取
  - `proxy-revalidate`：与 `must-revalidate` 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略
  - `immutable`：表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如 `If-None-Match` 或 `If-Modified-Since`）来检查更新，即使用户显式地刷新页面
- 其他
  - `no-store`：缓存不应存储有关客户端请求或服务器响应的任何内容。表示绝对禁止缓存!
  - `no-transform`： 不得对资源进行转换或转变。`Content-Encoding`、`Content-Range` 和 `Content-Type` 等 HTTP 头不能由代理修改。例如，非透明代理可以对图像格式进行转换，以便节省缓存空间或者减少缓慢链路上的流量。 `no-transform` 指令不允许这样做。

设置相对过期时间, `max-age` 指明以秒为单位的缓存时间. 若对静态资源只缓存一次, 可以设置 `max-age` 的值为 315360000000（一万年）。比如对于提交的订单，为了防止浏览器回退重新提交，可以使用 Cache-Control 之 `no-store` 绝对禁止缓存，即便浏览器回退依然请求的是服务器，进而判断订单的状态给出相应的提示信息！

```nginx
# 匹配 URI 时返回的静态资源缓存 3600 毫秒
if ($request_uri ~* "^/$|^/search/.+/|^/company/.+/") {
   add_header    Cache-Control  max-age=3600;
}

# 应用中不会改变的文件，通常可以再发送响应头前添加积极缓存
location ~* \.(js|css|png|jpg|gif)$ {
    add_header  Cache-Control public,max-age=31536000;
}

# 缓存前要向服务器确认资源是否被更改
location ~* \.(js|css|png|jpg|gif)$ {
    add_header  Cache-Control no-cache;
}

# 禁止缓存
location ~* \.(js|css|png|jpg|gif)$ {
    add_header  Cache-Control no-store,no-cache,must-revalidate;
}
```

特别区分：

- `no-cache`：浏览器和缓存服务器都不应该缓存页面信息
- `no-store`： 请求和响应的信息都不应该被存储在对方的磁盘系统中

### 资源最后修改时间

该资源的最后修改时间，在浏览器下一次请求资源时，浏览器将先发送一个请求到服务器上, 并附上 `If-Unmodified-Since` 头来说明浏览器所缓存资源的最后修改时间, 如果服务器发现没有修改, 则直接返回 304（Not Modified）回应信息给浏览器（内容很少），如果服务器对比时间发现修改了，则照常返回所请求的资源。

需要注意：

1. `Last-Modified` 属性通常和 `Expires` 或 `Cache-Control` 属性配合使用, 因为即使浏览器设置缓存, 当用户点击 **刷新** 按钮时, 浏览器会忽略缓存继续向服务器发送请求, 这时 `Last-Modified` 将能够很好的减小回应开销
2. ETag 将返回给浏览器一个资源 ID, 如果有了新版本则正常发送并附上新 ID，否则返回 304，但是在服务器集群情况下，每个服务器将返回不同的 ID，因此不建议使用 `ETag`

### 资源缓存策略

浏览器缓存 Header：`expires`、`cache-control`、`last-modified`、`etag`。

1. 200 状态：当浏览器本地没有缓存或者下一层失效时，或者用户强制刷新时，浏览器直接去服务器获取最新资源
2. 304 状态：由 Last-Modified / Etag 控制。当下一层失效时活用户刷新时，浏览器就会发送请求给服务器，如果服务端没有变更，则返回 304 给浏览器
3. 200 状态（from cache）：由 Expires / Cache-Control 控制，Expires 是绝对时间，Cache-Control 是相对时间，两者都存在时，Cache-Control 覆盖 Expires 只要没有失效，浏览器只访问自己的缓存

通用策略：

1. 对于 HTML 文件，`cache-control` 设置为 `no-cache`
2. 对于 JS、图片、CSS、字体等，设置 `max-age=2592000`，也就是 30 天

```nginx
location ~ .* \.(js)$ {
  add_header Cache-Control public;

  expires 24h;
}

location ~ .* \.(css)$ {
  add_header Cache-Control public;

  expires 86400;

  etag on;
}

location ~ .*\(gif|jpg|jpeg|png)$ {
  add_header Cache-Control must-revalidate;

  etag on;
}
```

集群分布式部署建议关闭 Etag，因为每台机器生成的 Hash 是不同的。

## 配置 CORS 跨域访问

假设有两个域名 `mrsingsing.com` 和 `api.mrsingsing.com`，如果 `mrsingsing.com` 域名想请求 `api.mrsingsing.com` 域名下的资源会因为 `host` 不一致存在跨域的问题。

### 反向代理解决跨域

为了绕开浏览器的跨域安全限制，需要将请求的域名由 `api.mrsingsing.com` 改为 `mrsingsing.com`。同时约定 URL 规则来表明代理请求的身份，然后 Nginx 通过匹配该规则，将请求代理回原来的域。

```nginx
server {
    listen 9001;
    server_name mrsingsing.com;

    location / {
        proxy_pass api.mrsingsing.com;
    }
}
```

这里对静态文件的请求和后端服务的请求都以 `mrsingsing.com` 开始，不易区分，所以通常为了实现对后端服务请求的统一转发，通常我们会约定对后端服务的请求加上 `/api/` 的前缀或者其他的 `path` 来和静态资源的请求加以区分：

```nginx
# 请求跨域，约定代理后端服务请求 path 以 /api/ 开头
location ^~/api/ {
    # 这里重写了请求，讲正则匹配中的一个分组的 path 拼接到真正的请求后面，并用 break 停止后续匹配
    rewrite ^/api/(.*)$ /$1 break;
    poxy_pass api.mrsingsing.com;

    # 两个域名之间 Cookie 的传递与回写
    proxy_cookie_domain api.mrsingsing.com mrsingsing.com;
}
```

这样其实是通过 Nginx，用类似于 Hack 的方式规避了浏览器的跨域限制，实现了跨域访问。

这样，静态资源我们使用 `mrsingsing.com/index.html`，动态资源我们使用 `mrsingsing.com/api/getOrderList`，浏览器页面看起来仍然访问的前端服务器，绕过了浏览器的通源策略，毕竟我们看起来并没有跨域。

### 配置 header 解决跨域

在 Nginx 配置中配置对应二级域名 `api.mrsingsing.com`：

```nginx
# /etc/nginx/conf.d/api.mrsingsing.com.conf

server {
    listen       80;
    server_name  api.mrsingsing.com;

    add_header 'Access-Control-Allow-Origin' $http_origin;                              # 全局变量获得当前请求 origin，带 Cookie 的请求不支持 *（通配符）
    add_header 'Access-Control-Allow-Credentials' 'true';                               # 为 true 可带上 cookie
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';                     # 允许请求方法
    add_header 'Access-Control-Allow-Headers' $http_access_control_request_headers;     # 允许请求的 header，可以为 *（通配符）
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Max-Age' 1728000;                                    # OPTIONS 请求的有效期，在有效期内不用发出另一条预检请求
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;

        return 204;  # 200 也可以
    }

    location / {
        root  /usr/share/nginx/html/be;
        index index.html;
    }
}
```

## 防盗链

防盗链机制的目的是防止服务器上的资源（例如图片、文件等）被其它用户采用其它的技术手段来访问或下载。

实现方式：区别哪些请求是非正常的用户请求

基于 `http_refer` 防盗链配置模块：

```nginx
location ~* \.(gif|jpg|png|jpeg)$ {
    # 只允许 192.168.0.1 请求资源
    # none 表示没带 refer
    # blocked 表示不是标准 HTTP 请求
    valid_referers none blocked 192.168.0.1;

    if ($invalid_referer) {
        rewrite ^/ http://$host/logo.png;
    }
}
```

- 设置防盗链文件类型，自行修改，每个后缀用 `|` 符号分隔
- 允许文件链出的域名白名单，自行修改成己方域名，域名与域名之间使用空格隔开

## 图片处理

在前端开发中，经常需要不同尺寸的图片。现在的云储存基本对图片都提供有处理服务（一般是通过在图片链接上加参数）。其实用 Nginx，可以通过几十行配置，搭建出一个属于自己的本地图片处理服务，完全能够满足日常对图片的裁剪/缩放/旋转/图片品质等处理需求。要用到 `ngx_http_image_filter_module` 模块。这个模块是非基本模块，需要安装。

下面是图片缩放功能部分的 Nginx 配置：

```nginx
# 图片缩放处理
# 这里约定的图片处理 url 格式：以 example.com/img/ 路径访问
location ~* /img/(.+)$ {
    # 图片服务端储存地址
    alias /Users/cc/Desktop/server/static/image/$1;
    # 图片宽度默认值
    set $width -;
    # 图片高度默认值
    set $height -;
    if ($arg_width != "") {
        set $width $arg_width;
    }
    if ($arg_height != "") {
        set $height $arg_height;
    }
    #设置图片宽高
    image_filter resize $width $height;
    #设置Nginx读取图片的最大buffer
    image_filter_buffer 10M;
    # 是否开启图片图像隔行扫描
    image_filter_interlace on;
    # 图片处理错误提示图，例如缩放参数不是数字
    error_page 415 = 415.png;
}
```

---

**参考资料：**

- [Nginx 从入门到实践](https://juejin.im/post/5a2600bdf265da432b4aaaba#heading-76)
- [后端必备 Nginx 配置](https://juejin.im/entry/5d7e4540f265da03b76b50cc)
- [📝 Nginx 下关于缓存控制字段 cache-control 的配置说明](https://www.cnblogs.com/kevingrace/p/10459429.html)
