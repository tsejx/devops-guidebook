---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 系统管理
order: 1
---

# 系统管理

- 系统安全
  - `sudo` 以其他身份来执行命令
- 进程和作业
  - `systemctl` 系统服务管理器指令
  - `w` 显示目前登入系统的用户信息
  - `watch` 周期性执行给定的指令
  - `pidof` 查找指定名称的进程的进程 ID 号
  - `skill` 向选定的进程发送信号冻结进程
  - `service` 控制系统服务的实用工具
  - `telint` 切换当前正在运行系统的运行等级
  - `killall` 使用进程的名称来杀死一组进程
  - `ps` 报告当前系统的进程状态
  - `init` 所有 Linux 进程的父进程
  - `pkill` 可以按照进程名杀死进程
  - `at` 在指定时间执行一个任务
  - `crontab` 提交和管理用户的需要周期性执行的任务
- 用户和工作组
  - `change` 修改账号和密码的有效期限
  - `id` 显示用户的 ID 以及所属群组的 ID
  - `su` 用于切换当前用户身份到其他用户身份
- 系统关机和重启
  - `shutdown` 执行系统关机命令

## 进程信息

- PID：进程 ID，进程的唯一标识
- USER：进程所有者的实际用户名
- PR：进程的调度优先级
- NI：进程的 nice 值（优先级）越小的值代表优先级越高
- VIRT：进程使用的虚拟内存
- RES：驻留内存大小。驻留内存是任务使用的非交换物理内存大小。
- SHR：进程使用的共享内存。
- S：进程的状态
  - D = 不可中断的睡眠态
  - R = 运行态
  - S = 睡眠态
  - T = 被跟踪或已停止
  - Z = 僵尸态
- %CPU：自从上一次更新时到现在任务所使用的 CPU 时间百分比。
- %MEM：进程使用的可用物理内存百分比。
- TIME+：任务启动后到现在所使用的全部 CPU 时间，精确到百分之一秒。
- COMMAND：运行进程所使用的命令。

## 进程和作业

### systemctl

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
```

对于普通的进程，就要使用 kill 命令进行更佳详细的控制了。kill 命令有很多信号，如果你在用 `kill -9`，你一定想要了解 `kill -15` 以及 `kill -3` 的区别和用途。

### ps

ps 命令能够看到进程/线程状态。和 top 有些内容重叠，常用。

```bash
# 查看进程信息
ps <pid>

# 找到 java 进程
ps -ef | grep java

ps aux | grep nginx

```

## 用户和工作组

### su

su 用来切换用户。比如你现在是 root，想要用 xjj 用户做一些勾当，就可以使用 su 切换。

```bash
su xjj

su - xjj
```

可以让你干净纯洁的降临另一个账号，不出意外，推荐。

## 其他

```bash
# 查看系统中所有用户
cut -d : -f 1 /etc/passwd

# 查看可以登录系统的用户
cat /etc/passwd | grep -v /sbin/nologin | cut -d : -f 1

# 查看登录用户
who

# 查看某一用户
w mysql

# 查看用户登录历史记录
last

# 创建新用户
adduser ftpusername

# 创建新用户，用户不允许登录（通过 ftp 可以连接）
adduser ftpusername -s /sbin/nologin

# 给用户设置密码
passwd ftpusername

# 创建用户工作组
groupadd clent

# 给已有的用户增加工作组
usermod -G clent ftpusername

# 永久性删除用户账号
userdel ftousername

# 永久性删除用户工作组
groupdel clent



# 删除用户目录
rm -rf /var/spool mail/ftpusername
rm -rf /home/ftpusername

# 编辑用户列表文件
vim /etc/passwd

# 编辑用户组列表文件
vim /etc/group

# 添加用户
useradd
# 为用户设置密码
passwd
# 删除用户
userdel
# 修改用户信息
usermod
# 添加用户组
groupadd
# 删除用户组
groupdel
# 修改用户组
groupmod
# 显示当前进程用户所属用户组
grouos
```

### mount

mount 命令可以挂在一些外接设备，比如 u 盘，比如 iso，比如刚申请的 ssd。可以放心的看小电影了。

```bash
mount /dev/sdb1 /xiaodianying
```

### crontab

这就是 Linux 本地的 job 工具。不是分布式的，你要不是运维，就不要用了。比如，每 10 分钟提醒喝茶上厕所。

```bash
_/10 _ \* \* \* /home/xjj/wc10min
```