---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 网络管理
order: 2
---

# 网络管理

- 网络应用
  - `curl` 利用 URL 规则在命令行下工作的文件传输工具
  - `wget` 下载文件工具
  - `telnet` 登录远程主机和管理
- 高级网络
  - `ip` 网络配置工具
  - `iptables` 防火墙软件
- 网络测试
  - `iperf` 网络性能测试工具
  - `host` 常用的分析域名查询工具
  - `nslookup` 查询域名 DNS 信息的工具
  - `dig` 域名查询工具
  - `ping` 测试主机之间网络的联通性
  - `netstat` 查看网络系统状态信息
- 网络安全
  - `ssh` openssh 套件中的客户端连接工具
  - `ssh-keygen` 为 SSH 生成、管理和转换认证密钥
- 网络配置
  - `ifconfig` 配置和显示系统网卡的网络参数

## 网络应用

### wget

Linux 系统下载文件工具。

你想要在服务器上安装 JDK，不会现在本地下载下来，然后使用 scp 传到服务器上吧（有时候不得不这样）。wget 命令可以让你直接使用命令下载文件，并支持断点续传。

```bash
# 下载单个文件
wget http://www.jsdig.com/testfile.zip

# 下载并以不同的文件名保存
wget -O wordpress.zip http://www.jsdig.com/download.aspx?id=1080

# 限速下载
wget --limit-rate=300k http://www.jsdig.com/download.aspx?id=1080

# 断点续传
wget -c http://www.jsdig.com/testfile.zip

# FTP 下载
wget --ftp-user=USERNAME --ftp-parssword=PASSWORD url
```

## 高级网络

### iptables

防火墙

```bash
启动： systemctl start firewalld
关闭： systemctl stop firewalld
查看状态： systemctl status firewalld
开机禁用  ： systemctl disable firewalld
开机启用  ： systemctl enable firewalld
```

https://www.cnblogs.com/mymelody/p/10490776.html

放行 TCP 80 端口

```bash
firewall-cmd --add-port=80/tcp --permanent
```

```bash
iptables -L -n
```

-A 参数就看成是添加一条 INPUT 的规则
-p 指定是什么协议，常用的 tcp 协议，当然也有 udp 例如 53 端口的 DNS

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
```

## 网络测试

### nslookup

```bash
# 查询域名
$ nslookup <domain>

# 查询其他记录
$ nslookup -qt = <type> <domain>
```

**type 参数**

- `A` 地址记录
- `AAAA` 地址记录
- `CNAME` 别名记录

### ping

用于探测网络通不通（不包括那些禁 ping 的网站）

```bash
# 检查 网络
ping xx.xx.xx.xx
```

### netstat

`netstat` 命令用于显示与 IP、TCP、UDP 和 ICMP 协议相关的统计数据，一般用于检验本机各端口的网络连接情况。`netstat` 是在内核中访问网络及相关信息的程序，它能提供 TCP 连接，TCP 和 UDP 监听，进程内存管理的相关报告。

```bash
netstat
```

从整理上来看，`netstat` 输出结果可以分为两个部分：

- Active Internet connections，称为有源 TCP 连接，其中 `Recv-Q` 和 `Send-Q` 指的是接收队列和发送队列。这些数字一版都应该是 0。如果不是则表示软件包正在队列中堆积。这种情况只能在非常少的情况见到。
- Active UNIX domain sockets，称为有源 Unix 域套接口（和网络套接字一样，但是只能用于本机通信，性能可以提高一倍）

Proto 显示连接使用的协议，RefCnt 表示连接到本套接口上的进程号，Types 显示套接口的类型，State 显示套接口当前的状态，Path 表示连接到套接口的其它进程使用的路径名。

**状态说明：**

```bash
# 侦听来自远方的TCP端口的连接请求
LISTEN

# 再发送连接请求后等待匹配的连接请求（如果有大量这样的状态包，检查是否中招了）
SYN-SENT：

# 再收到和发送一个连接请求后等待对方对连接请求的确认（如有大量此状态，估计被flood攻击了）
SYN-RECEIVED：

# 代表一个打开的连接
ESTABLISHED：

# 等待远程TCP连接中断请求，或先前的连接中断请求的确认
FIN-WAIT-1：

# 从远程TCP等待连接中断请求
FIN-WAIT-2：

# 等待从本地用户发来的连接中断请求
CLOSE-WAIT：

# 等待远程TCP对连接中断的确认
CLOSING：

# 等待原来的发向远程TCP的连接中断请求的确认（不是什么好东西，此项出现，检查是否被攻击）
LAST-ACK：

# 等待足够的时间以确保远程TCP接收到连接中断请求的确认
TIME-WAIT：

# 没有任何连接状态
CLOSED：
```

```bash
# 显示网卡列表
netstat -i

# 显示网络统计
netstat -s

# 显示以太网统计数据（包括传送的数据报的总字节数、错误数、删除数、数据报和数量和广播的数量）
netstat -e

# 常用组合（l:listening;n:num;t:tcp;u:udp;p:process）
netstat -lntup

# 显示路由信息
netstat -r

# 显示机器中网络连接各个状态个数
netstat -lant

# 把状态取出来后使用 uniq -c 统计后再进行排序
netstat -ant | awk '{print $6}' | sort | uniq -c

# 查看连接某服务端口最多的 IP 地址
netstat -ant | grep "192.168.25.*" | awk '{print $5}' | awk -F: '{print $1}' | sort -nr | uniq -c

# 找出程序运行的端口
netstat -ap | grep ssh

# 根据端口查看这个进程的 PID
netstat -lnp | grep 8080
```

此命令，在找一些本地起了什么端口之类的问题上，作用很大。

- [Linux netstat 命令详解](https://www.cnblogs.com/ftl1012/p/netstat.html)

## 网络安全

### ssh

ssh 命令是 openssh 套件中的客户端连接工具，可以给予 ssh 加密协议实现安全的远程登录服务器。

```bash
# ssh 连接远程主机 `ssh name@ip`
# 默认连接到目标主机的 22 端口
ssh user@hostname

# ssh 连接远主机并指定端口
ssh -p 10022 user@hostname

# 打开调试模式
ssh -v user@hostname

# 对所有请求压缩
# 所有通过 ssh 发送或接收的数据将会被压缩，并且仍然是加密的。
ssh -C user@hostname

# 指定 ssh 源地址
如果你的 ssh 客户端多于两个以上的 IP 地址，可以使用 `-b` 选项来指定一个 IP地址。

# 查看是否已经添加了对应主机的s ssh 密钥
ssh-keygen -F hostname

# 删除对应主机的 SSH 访问密钥
ssh-keygen -R hostname

# 登录远程主机后执行某个命令
ssh username@hostname "ls /home/omd"

# 登录远程服务器后执行某个脚本
ssh username@hostname -t "bash/home/omd/ftl.bash"
```

查看 ssh 密钥目录

```bash
# 当前用户的 .ssh 目录
ll /root/.ssh/known_hosts
```

```bash
# ssh 配置文件
cat /etc/ssh/sshd_config

# 开启 ssh 服务
service sshd start

# 关闭 ssh 服务
service sshd stop
```

## 网络配置

### iconfig

查看 IP 地址，替代品是 `ip addr` 命令。
