# 网络管理

Linux 是一个多作业的网络操作系统，所以网络系统命令有很多。

## ssh

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
ssh username@hostname -t "sh/home/omd/ftl.sh"
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

## scp

scp（secure copy）用来进行文件传输。也可以用来传输目录。也有更高级的 sftp 命令。

```bash
# 本地复制远程文件
scp username@hostname:/usr/test/test.tar.gz /temp/test.tar.gz

# 远程复制本地文件
scp /temp/test.tar.gz username@hostname:/usr/test/test.tar.gz

# 本地复制远程目录
scp -r username@hostname:/usr/test/test.tar.gz /temp/test.tar.gz

# 远程目录复制至本地目录
scp -r /temp/test.tar.gz username@hostname:/usr/test/test.tar.gz

# 本地复制远程文件到指定目录
scp username@hostname:/usr/test/test.tar.gz /temp/test/

# 远程复制到本地文件到指定目录
scp /temp/test.tar.gz username@hostname:/usr/test/test/tar.gz
```

## wget

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

## iconfig

查看 IP 地址，替代品是 `ip addr` 命令。

## ping

用于探测网络通不通（不包括那些禁 ping 的网站）

