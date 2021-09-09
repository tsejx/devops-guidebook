---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 命令行指令
order: 4
---

# 命令行指令

## 常用命令

要启动 Nginx，请运行可执行文件。一旦启动 Nginx，就可以通过使用 `-s` 参数调用可执行文件来对其进行控制。

使用以下语法：

```
nginx -s <signal>
```

`-s` 的意思是向主进程发送信号，`signal` 可以是以下信号之一：

- `stop`：快速关闭
- `quit`：正常关闭
- `reload`：重新加载配置文件
- `reopen`：重新打开日志文件

```bash
# 启动
nginx -c /etc/nginx/nginx.conf

# 发送信号
nginx -s

# 立即停止服务
nginx -s stop

# 优雅地停止服务
nginx -s quit

# 重载配置文件
nginx -s reload

# 指定配置文件
nginx -s reload -c /etc/nginx/nginx.conf

# 重新开始记录日志文件
nginx -s reopen
```

当运行 `nginx -s quit` 时，Nginx 会等待工作进程处理完成当前请求，然后将其关闭。当你修改配置文件后，并不会立即生效，而是等待重启或者收到 `nginx -s reload` 信号。

当 Nginx 收到 `nginx -s reload` 信号后，首先检查配置文件的语法。语法正确后，主线程会开启新的工作线程并向旧的工作线程发送关闭信号，如果语法不正确，则主线程回滚变化并继续使用旧的配置。当工作进程收到主进程的关闭信号后，会在处理完当前请求之后退出。

## 查看安装目录

列出服务的安装目录：

```bash
rpm -ql nginx
```

## 编译参数

列出编译参数的命令：

```bash
nginx -V

# 幫助
nginx -h

# 使用指定的配置文件
nginx -c

# 指定配置指令
nginx -g

# 指定运行目录
nginx -p

# 版本信息
nginx -v

# 测试配置文件是否有语法错误
# 同时显示主配置文件路径
nginx -t

# 检查指定的配置文件
nginx -t -c /etc/nginx/nginx.conf

# 重启 Nginx 服务
systemctl restart nginx.service
```
