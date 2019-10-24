# 配置

执行目录 `/usr/local/nginx/sbin/nginx`
模块所在目录 `/usr/lib64/nginx/modules`
配置所在目录 `/etc/nginx`
主要配置文件 `/etc/nginx/nginx.conf` 指向 `/etc/nginx/conf.d/default.conf`
默认站点目录 `/usr/share/nginx/html`

## 配置结构

[Nginx 快速入门配置篇](https://mp.weixin.qq.com/s/1Y-B5HdOB2N8z27X-mWc7w)

```bash
# 全局块
# Events 块
events {

}
# Http 块
http {
    # Server 块
    server {
        # Location 块
        location [PATTERN] {

        }
        location [PATTERN] {

        }
    }
}
```

### 全局块

该部分配置用于设置影响 Nginx 全局的指令，通常包括以下几个部分：

- 配置运行 Nginx 服务器用户（组）
- worker process 数
- Nginx 进程 PID 存放路径
- 错误日志的存放路径
- 配置文件引入

### events 块

该部分配置主要影响 Nginx 服务器与用户的网络连接，主要包括：

- 设置网络连接的序列化
- 是否允许同时接收多个网络连接
- 事件驱动模型的选择
- 最大连接数的配置

### http 块

- 定义 MIMI-Type
- 自定义服务日志
- 允许 sendfile 方式传输文件
- 连接超时时间
- 单连接请求数上限

### server 块

- 配置网络监听
- 基于名称的虚拟主机配置
- 基于 IP 的虚拟主机配置

### location 块

- location 配置
- 请求根目录配置
- 更改 location 的 URI
- 网站默认首页配置

### 配置运行服务器用户（组）

指令格式：

```nginx
user user[group]
```

- user 指定可以运行 Nginx 服务器的用户
- group 可选项，可以运行 Nginx 服务器的用户组

2. events 块：配置影响 nginx 服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

3) http 块：可以嵌套多个 server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type 定义，日志自定义，是否使用 sendfile 传输文件，连接超时时间，单连接请求数等。

4. server 块：配置虚拟主机的相关参数，一个 http 中可以有多个 server。

5) location 块：配置请求的路由，以及各种页面的处理情况。
   不同模块指令关系：server 继承 main；location 继承 server；upstream 既不会继承指令也不会被继承，它有自己的特殊指令，不需要在其他地方的应用
