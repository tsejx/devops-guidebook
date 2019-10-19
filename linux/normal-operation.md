# 日常运维

- shutdown
- mount
- chmod
- chown
- su
- yum
- password
- service - systemctl

## mount

mount 命令可以挂在一些外接设备，比如 u 盘，比如 iso，比如刚申请的 ssd。可以放心的看小电影了。

```bash
mount /dev/sdb1 /xiaodianying
```

## chown

chown 用来改变文件的所属用户和所属组
chmod 用来改变文件的访问权限

这两个命令，都和 Linux 的文件权限 777 有关。

示例：

```bash
# 毁灭性命令
chmod 000 -R /

# 修改 a 目录的用户和组为 xjj
chown -R xjj:xjj a

# 给 a.sh 文件增加执行权限（常用）
chmod a+x a.sh
```

## yum

假定你用的是 CentOS，则包管理工具就是 yum。
如果你的系统没有 wget 命令，就可以使用如下命令进行安装。

```bash
yum install wget -y
```

## systemctl

当然 CentOS 管理后台服务也有一些套路。service 命令就是。
systemctl 兼容了 service 命令，我们看一下怎么重启 mysql 服务。推荐用下面这个。

`systemctl` 是 CentOS7 的服务管理工具中主要的工具，它融合之前 service 和 chkconfig 的功能于一体。

```bash
# 启动一个服务
$ systemctl start nginx.service

# 关闭一个服务
$ systecmtl stop nginx.service

# 重启一个服务
$ systemctl restart nginx.service

# 显示一个服务状态
$ systemctl status postfix.service

# 开机时自动启动服务
$ systemctl enable nginx.service

# 禁用开机时自启动服务
$ systemctl disable nginx.service

# 查看服务是否开机启动
$ systemctl is-enabled nginx.service

# 查看已启动的服务列表
$ systemctl list-unit-files | grep enabled

# 查看启动失败的服务列表
$ systemctl --failed

#
```

对于普通的进程，就要使用 kill 命令进行更佳详细的控制了。kill 命令有很多信号，如果你在用 `kill -9`，你一定想要了解 `kill -15` 以及 `kill -3` 的区别和用途。

### Unit

#### 含义

Systemd 可以管理所有系统资源。不同的资源统称为 Unit（单位）。

Unit 一共分成 12 种。

- Service unit：系统服务
- Target unit：多个 Unit 构成的一个组
- Device Unit：硬件设备
- Mount Unit：文件系统的挂载点
- Automount Unit：自动挂载点
- Path Unit：文件或路径
- Scope Unit：不是由 Systemd 启动的外部进程
- Slice Unit：进程组
- Snapshot Unit：Systemd 快照，可以切回某个快照
- Socket Unit：进程间通信的 socket
- Swap Unit：swap 文件
- Timer Unit：定时器

`systemctl list-units` 命令可以查看当前系统的所有 Unit。

```bash
# 列出正在运行的 Unit
$ systemctl list-status

# 列出所有 Uni，包括没有找到配置文件的或者启动失败的
$ systemctl list-units -all

# 列出所有没有运行的 Unit
$ systemctl list-units -all --state=inactive
```

## su

su 用来切换用户。比如你现在是 root，想要用 xjj 用户做一些勾当，就可以使用 su 切换。

```bash
su xjj

su - xjj
```

可以让你干净纯洁的降临另一个账号，不出意外，推荐。

---

**参考资料：**

- [Systemd 指令](https://www.cnblogs.com/zwcry/p/9602756.html)
