---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 访问日志
order: 19
---

# 访问日志

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

## 日志挖掘

## 数据统计

## 日志切割

## 参考资料

- [📝 Nginx 经典案例挖掘 accessLog 日志](https://wylong.top/nginx/06-nginx%E7%BB%8F%E5%85%B8%E6%A1%88%E4%BE%8B%E6%8C%96%E6%8E%98accessLog%E6%97%A5%E5%BF%97.html)
