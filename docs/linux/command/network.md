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
  - [`curl`](#curl) 利用 URL 规则在命令行下工作的文件传输工具
  - [`wget`](#wget) 下载文件工具
  - [`telnet`](#telnet) 登录远程主机和管理
- 高级网络
  - [`ip`](#ip) 网络配置工具
  - [`iptables`](#iptables) 防火墙软件
- 网络测试
  - [`iperf`](#iperf) 网络性能测试工具，可用于测试 TCP 和 UDO 带宽质量
  - [`host`](#host) 常用的分析域名查询工具
  - [`nslookup`](#nslookup) 查询域名 DNS 信息的工具
  - [`dig`](#dig) 域名查询工具
  - [`ping`](#ping) 测试主机之间网络的联通性
  - [`netstat`](#netstat) 查看网络系统状态信息
  - [`traceroute`](#traceroute) 追踪数据包在网络上的传输时的全部路径
  - [`tcpdump`](#tcpdump) 打印所有经过网络接口的数据包的头信息
- 网络安全
  - [`ssh`](#ssh) openssh 套件中的客户端连接工具
  - [`ssh-keyscan`](#ssh-keyscan)
  - [`ssh-copy-id`](#ssh-copy-id)
  - [`ssh-keygen`](#ssh-keygen) 为 SSH 生成、管理和转换认证密钥
  - [`ssh-add`](#ssh-add) 把专用密钥添加到 `ssh-agent` 的高速缓存中
  - [`ssh-agent`](#ssh-agent) 控制用来保存公钥身份验证所使用的私钥程序
- 网络配置
  - [`ifconfig`](#ifconfig) 配置和显示系统网卡的网络参数
  - [`route`](#route) 查看网关命令

## 网络应用

### curl

`curl` 命令是一个利用 URL 规则在命令行下工作的文件传输工具。

[详细命令参数](https://wangchujiang.com/linux-command/c/curl.html)

```bash
# 文件下载（不显示进度）
curl URL --silent

# 使用选项 -o 将下载的数据写入到文件，必须使用文件的绝对地址
curl http://example.com/text.iso --o filename.iso --progress

# 使用选项 -H 设置请求的头部信息
curl -H "accept-language:zh-cn" URL

# 读取本地文本文件的数据，向服务器发送
curl -d '@data.txt' https://example.com/upload

# JSON 格式的 POST 请求
curl -l -H "Content-Type: application/json" -X POST -d '{"phone": "13800138000", "password": "test"}' https://example.com/api/users.json

# 将 Cookie 写入文件
curl -c cookies.txt https://www.mrsingsing.com

# 上传二进制文件
# 下面的命令会给 HTTP 请求加上标头 Content-Type: multipart/form-data，然后将文件 photo.png 作为 file 字段上传
curl -F 'file=@photo.png' https://mrsingsing.com/profile

# 调试参数
curl -v https://www.example.com

# 获取本机外网 IP
curl ipecho.net/plain

curl -L ip.tool.lu

```

请求后打印本次请求的统计数据到标准输出

```bash
curl -w https://www.mrsingsing.com
```

curl 提供了很多置换变量，可以在格式化字符串中通过 %{var} 的形式使用。完整的变量列表可以在 curl 的 manpage 中查看。简单介绍一下我们使用的这几个变量：

- `url_effective`: 执行完地址重定向之后的最终 URL；
- `time_namelookup`: 从请求开始至完成名称解析所花的时间，单位为秒，下同；
- `time_redirect`: 执行所有重定向所花的时间；
- `time_connect`: 从请求开始至建立 TCP 连接所花的时间；
- `time_appconnect`: 从请求开始至完成 SSL/SSH 握手所花的时间；
- `time_pretransfer`: 从请求开始至服务器准备传送文件所花的时间，包含了传送协商时间；
- `time_starttransfer`: 从请求开始至服务器准备传送第一个字节所花的时间；
- `time_total`: 完整耗时。

然后执行请求，通过 `@filename` 指定保存了格式化字符串的文件：

```bash
curl -L -s -w @fmt.txt -o /dev/null https://www.mrsingsing.com
```

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

防火墙分为软件防火墙和硬件防火墙。

防火墙又可以分为包过滤防火墙和应用层的防火墙。

- CentOS 6 默认的防火墙是 `iptables`
- CentOS 7 默认的防火墙是 `firewallD`（底层使用 `netfilter`）

规则表：

- filter
- nat
- mangle
- raw

规则链：

- INPUT / OUTPUT / FORWARD
- PREROUTING / POSTROUTING

```bash
# 查看 filter 表的几条链规则（INPUT 链可以看出开放了哪些端口）
iptables -t filter -L -n

# filter 表是默认查询的表，可以省略 -t 选项
iptables -L -n

# 查看 NAT 表的链规则
iptables -t nat -L -n

# 查看所有 iptables 规则
iptables -vnL

# 为 INPUT 链添加规则（开放 8080 端口）
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

# 清除防火墙所有规则
# 删除所有自定义链
iptables -F

iptables -X

iptables -Z

# 查找规则所在行号
iptables -L INPUT --line-numbers -n

# 根据行号删除过滤规则（关闭 8080 端口），下面的 1 是上面找到的规则所在的行号
iptables -D INPUT 1

# 放行 TCP 80 端口
firewall-cmd --add-port=80/tcp --permanent

# 搜索 iptables 规则
# $table 改为你想搜索的表，$string 改为你要搜索的字符串
iptables -L $table -v -n | grep $string
```

-A 参数就看成是添加一条 INPUT 的规则
-p 指定是什么协议，常用的 tcp 协议，当然也有 udp 例如 53 端口的 DNS

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
```

常用的防火墙规则：

```bash
# 屏蔽某个 IP 地址
iptables -A INPUT -s xxx.xxx.xxx.xxx -j DROP

# 如果只想屏蔽来自某个 IP 地址的 TCP 流量，可以用 -p 指定协议
iptables -A INPUT -p tcp -s xxx.xxx.xxx.xxx -j DROP

# 取消屏蔽某个 IP 地址
iptables -D INPUT -s xxx.xxx.xxx.xxx -j DROP

# 屏蔽基于某个端口的传出连接
iptables -A OUTPUT -p tcp --dport xxx -j DROP

# 允许基于某个端口的传入连接
iptables -A INPUT -p tcp --dport xxx -j ACCEPT

# 将某个服务的流量转发到另一个端口
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25 -j REDIRECT --to-port 2525

# DDoS 屏蔽
iptables -A INPUT -p tcp --dport 80 -m limit --limit 100/minute --limit-burst 200 -j ACCEPT
```

`iptables` 防火墙的配置文件：

- `/etc/sysconfig/iptables`
- CentOS 6
  - `service iptables save | start | stop | restart`
- CentOS 7
  - `yum install iptables-services`

扩展资料：

- [Linux iptables 命令](https://wangchujiang.com/linux-command/c/iptables.html)
- [Linux：25 个有用的 iptables 防火墙规则](http://www.codebelief.com/article/2017/08/linux-25-useful-iptables-firewall-rules/)
- [CentOS7 firewalld 打开关闭端口](https://www.cnblogs.com/mymelody/p/10490776.html)

## 网络测试

### host

`host` 命令是常用的分析域名查询工具，可以用来测试域名系统工作是否正常。

```bash
# 基本用法
host mrsingsing.com

# 显示详细的 DNS 信息
host -a mrsingsing.com
```

### nslookup

```bash
# 查询域名 的 A 记录
# - domain 查询的域名
# - dns-server 指定解析的 DNS 服务器
nslookup <domain> <dns-server>

nslookup baidu.com

nslookup baidu.com 8.8.8.8

# 查询其他记录
nslookup -qt = <type> <domain>

nslookup -qt=mx baidu.com 8.8.8.8

# 查询更距离的信息
nslookup -d <domain>

nslookup -d baidu.com

# 完全响应信息
nslookup -debug baidu.com
```

`type` 参数：

- `A`：地址记录
- `AAAA`：地址记录
- `CNAME`：别名记录

建议使用 [dig](#dig) 替代 `nslookup` 命令。

### dig

```bash
# 基本用法
dig mrsingsing.com

# 反向解析
dig -x 140.205.94.189

# 查看域授权的 DNS 服务器
dig mrsingsing.com +nssearch
```

### ping

用于检测网络的联通情况和分析网络速度，并根据域名得到服务器 IP（不包括那些禁 ping 的网站）

```bash
# 检查网络联通
ping xx.xx.xx.xx

ping mrsingsing.com
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

# 或者
netstat -alnt | grep tcp

# 根据端口查看这个进程的 PID
netstat -lnp | grep 8080

# 查看网络状况
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
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

# 在 Github 添加了公钥后进行连接，用于验证 Key
ssh -T git@github.com
```

### ssh-keygen

查看是否已经存在 SSH 密钥：

```bash
cd ~/.ssh
ls
```

如果，提示不存在此目录，则进行第二步操作，否则，你本机已经存在 SSH 公钥和私钥，可以略过第二步，直接进入第三步操作。

```bash
# 生成 SSH 秘钥
ssh-keygen -t rsa -C "your_email@example.com"
```

- `-t`：指定密钥类型，默认是 RSA，可以省略
- `-C`：设置注释文字，比如邮箱
- `-f`：指定密钥文件存储文件名

根据提示，需要指定文件位置和密码，如果是你足够放心，其实都可以直接回车，不需要什么密码。执行完以后，可在 `/C/Users/you/.ssh/` 路径下看到刚生成的文件：`id_rsa` 和 `id_rsa.pub`，即公钥和私钥。

```bash
# 查看是否已经添加了对应主机的 SSH 密钥
ssh-keygen -F hostname

# 删除对应主机的 SSH 访问密钥
ssh-keygen -R hostname
```

### ssh-add

`ssh-add` 命令用于把专用密钥添加到 `ssh-agent` 的高速缓存中。

```bash
# 把专用密钥添加到 ssh-agent 的高速缓存中
ssh-add ~/.ssh/id_rsa

# 从 ssh-agent 中删除密钥
ssh-add -d ~/.ssh/id_xxx.pub

# 删除 ssh-agent 中所有密钥
ssh-add -D

# 查看 ssh-agent 中的密钥
ssh-add -l

# 查看 ssh-agent 中的公钥
ssh-add -L

# 设置密钥超时时间，超时 ssh-agent 将自动卸载密钥
ssh-add -t <life>
```

### ssh-agent

`ssh-agent` 命令是一种控制用来保存公钥身份验证所使用的私钥程序。

`ssh-agent` 在 X 会话或登录会话之初启动，所有其他窗口或程序则以客户端程序的身份启动并加入到 `ssh-agent` 程序中。通过使用环境变量，可定位代理并在登录到其他使用 `ssh` 机器上时使用代理自动进行身份验证。

```bash
# 生成 Bourne Shell 风格命令输出
ssh-agent -s
```

## 网络配置

### ifconfig

`ifconfig` 是 Linux 的网络状态查看命令

查看 IP 地址，替代品是 `ip addr` 命令。

`eth0` 第一块网卡（网络接口）

你的第一个网络接口可能叫做下面的名字：

- `eno1`：板载网卡
- `ens33`：PCI-E 网卡
- `enp0s3`：无法获取物理信息的 PCI-E 网卡

CentOS 7 使用了一致性网络设备命名，以上都不匹配则使用 `eth0`。

网络接口命名修改

网卡命名规则受 biosdevname 和 net.ifnames 两个参数影响。

编辑 `/etc/default/grub` 文件，增加 `biosdevname=0 net.ifnames=0`

```bash
# 查看网络配置
ifconfig

lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>
inet 127.0.0.1 netmask 0xff000000
inet6 ::1 prefixlen 128
inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1
nd6 options=201<PERFORMNUD,DAD>
```

- `en5`：网卡名称
- `inet`：网卡 IP 地址
- `netmask`：对应子网掩码
- `ether`：网卡 MAC 地址
- `RX & TX`：发送/接受数据大小

```bash
# 修改网卡后重启
reboot
```

修改网络配置

```bash
ifconfig <接口> <IP地址> [netmask 子网掩码]

ifup <接口>

ifdown <接口>
```

### route

`route` 命令用于显示并设置 Linux 内核中的网络路由表。

```bash
# 不执行 DNS 反向查找，直接显示数字形式的 IP 地址
route -n

# 新增一条到达 244.0.0.0 的路由
route add -net 224.0.0.0 netmask 240.0.0.0 dev eth0

# 屏蔽一条路由，目的地为 244.x.x.x 将被拒绝
route add -net 224.0.0.0 netmask 240.0.0.0 reject
```

### ip

```bash
# ifconfig
ip addr ls

# ifup eth0
ip link set dev eth0 up

# ifconfig eth1 10.0.0.1 netmask 255.255.255.0
ip addr add 10.0.0.1/24 dev eth1

# route add -net 10.0.0.0 netmask 255.255.255.0 gw 192.168.0.1
ip route add 10.0.0/24 via 192.168.0.1
```
