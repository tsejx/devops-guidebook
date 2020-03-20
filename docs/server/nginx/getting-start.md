---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 快速开始
order: 2
---

# 快速开始

## 环境

### 四项确认

- 确认系统网络（`ping`）
- 确认 `yum` 可用（`yum list | grep gcc`）
- 确定关闭 `iptables`（`iptables -F`）
- 确认停用 `selinux`

### 两项安装

```bash
yum -y install gcc gcc-c++ autoconf pcre pcre-devel make automake
yum -y install wget httpd-tools vim
```

### 安装源

```bash
cd /etc/yum.repos.d
vim nginx.repo

添加：

name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
```

### 安装

```bash
yum list | grep nginx
yum install nginx
```

### 启动

```bash
# 启动
nginx -c /etc/nginx/nginx.conf

# 重启
systemctl restart nginx.service

# 柔和重启
nginx -s reload -c /etc/nginx/nginx.conf

# 检查配置文件
nginx -t -c /etc/nginx/nginx.conf
```

### 版本

查看版本

```bash
nginx -v
```

## 基本参数

列出服务的安装目录：

```bash
rpm -ql nginx
```

**目录解释**：

| 路径                                                         | 类型           | 作用                                           |
| ------------------------------------------------------------ | -------------- | ---------------------------------------------- |
| /etc/logrotate.d/nginx                                       | 配置文件       | nginx 日志轮转，用于 logrotate 服务的日志切割  |
| /etc/nginx/<br/>/etc/nginx/conf.d<br/>/etc/nginx/conf.d/default.conf<br/>/etc/nginx/nginx.conf | 目录、配置文件 | nginx 主配置文件                               |
| /etc/nginx/fastcgi_params<br/>/etc/nginx/scgi_params<br/>/etc/nginx/uwsgi_params | 配置文件       | cgi 配置相关，fastcgi 配置                     |
| /etc/nginx/koi-utf<br/>/etc/nginx/koi-win<br/>/etc/nginx/win-utf | 配置文件       | 编码映射转化文件                               |
| /etc/nginx/mime.types                                        | 配置文件       | 设置 HTTP 协议的 Content-Type 与扩展名对应关系 |
| /etc/sysconfig/nginx<br/>/etc/sysconfig/nginx-debug<br/>/usr/lib/systemd/system/nginx-debug.service<br/>/usr/lib/systemd/system/nginx.service | 配置文件       | 用于配置出系统守护进程管理器管理方式           |
| /etc/nginx/modules<br/>/usr/lib64/nginx/modules              | 目录           | nginx 模块目录                                 |
| /usr/sbin/nginx<br/>/usr/sbin/nginx-debug                    | 命令           | nginx 服务的启动管理的终端命令                 |
| /usr/share/doc/nginx-1.12.2<br/>/usr/share/doc/nginx-1.12.2/COPYRIGHT<br/>/usr/share/man/man8/nginx.8.gz | 文件目录       | nginx 的手册和帮助文件                         |
| /var/cache/nginx                                             | 目录           | nginx 的缓存目录                               |
| /var/log/nginx                                               | 目录           | nginx 的日志目录                               |

## 编译参数

列出编译参数的命令：

```bash
nginx -V
```

**参数解释**：