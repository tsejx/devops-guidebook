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
  - `service` 控制系统服务的实用工具
  - `w` 显示目前登入系统的用户信息
  - `watch` 周期性执行给定的指令
  - `pidof` 查找指定名称的进程的进程 ID 号
  - `ps` 报告当前系统的进程状态
  - `telint` 切换当前正在运行系统的运行等级
  - `init` 所有 Linux 进程的父进程
  - `at` 在指定时间执行一个任务
  - `crontab` 提交和管理用户的需要周期性执行的任务
  - `nohup` 将程序以忽略挂起信号的方式运行起来
  - `kill` 删除执行中的程序或工作
  - `pkill` 可以按照进程名杀死进程
  - `skill` 向选定的进程发送信号冻结进程
  - `killall` 使用进程的名称来杀死一组进程
- 用户和工作组
  - `useradd` 新建用户
  - `userdel` 删除用户
  - `passwod` 修改用户密码
  - `usermod` 修改用户属性
  - `chage` 修改用户属性
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

`systemctl` 命令是系统服务管理器指令。它实际上将 `service` 和 `chkconfig` 这两个命令组合到一起。

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
# 启动服务
$ systemctl start nginx.service

# 关闭服务
$ systecmtl stop nginx.service

# 重启服务
$ systemctl restart nginx.service

# 查看服务当前状态
$ systemctl status postfix.service

# 开机时自动启动服务
$ systemctl enable nginx.service

# 开机时自动禁用服务
$ systemctl disable nginx.service

# 查看服务是否开机启动
$ systemctl is-enabled nginx.service

# 查看已启动的服务列表
$ systemctl list-unit-files | grep enabled

# 查看启动失败的服务列表
$ systemctl --failed
```

对于普通的进程，就要使用 `kill` 命令进行更佳详细的控制了。`kill` 命令有很多信号，如果你在用 `kill -9`，你一定想要了解 `kill -15` 以及 `kill -3` 的区别和用途。

### ps

ps 命令能够看到进程/线程状态。和 top 有些内容重叠，常用。

```bash
# 查看进程信息
ps <pid>

# 找到 java 进程
ps -ef | grep java

# 在所有程序中查找 nginx
# -a 显示所有终端机下执行的程序
# -u 列出该用户的程序的状况
# -v 同 -a
ps aux | grep nginx

#
ps -elf

#
ps -e | more
```

- 进程也是树形结构
- 进程和权限有着密不可分的关系

### pstree

```bash
# 以树状结构显示线程结构
pstree
```

### nice

```bash
# 新建进程并设置优先级，将当前目录下的 documents 目录打包，但不希望 tar 占用太多 CPU
nice -10 tar zcf pack.tar.gz documents
```

### kill

`kill` 命令用来删除执行中的程序或工作。

```bash
# 列出所有信号名称
kill -l

# 无条件结束 pid 为 22817 的进程
kill -9 22817
```

可以先通过 `ps` 查找进程，然后用 `kill` 杀掉：

```bash
$ ps -ef | grep vim
root      3268  2884  0 16:21 pts/1    00:00:00 vim install.log
root      3370  2822  0 16:21 pts/0    00:00:00 grep vim

$ kill 3268
```

常用的信号：

- `HUP`（1）：终端断线
- `INT`（2）：中断（同 Ctrl + C）
- `QUIT`（3）：退出（同 Ctrl + \）
- `TERM`(15)：终止
- `KILL`（9）：强制终止
- `CONT`（18）：继续（与 STOP 相反）
- `STOP`（19）：暂停（同 Ctrl + Z）

### nohup

`nohup` 命令可以将程序以忽略挂起信号的方式运行起来，被运行的程序的输出信息将不会显示到终端。

```bash
# 以忽略挂起信号运行 /var/log/message
nohup tail -f /var/log/messages &
```

## 用户和工作组

只有 `root` 用户采用创建/删除/修改用户的权限。

### useradd

```bash
# 创建用户，名为 user1
useradd user1

# 新建用户 user2 时，直接指定组 group1
useradd -g group1 user2

# 创建新用户，用户不允许登录（通过 ftp 可以连接）
adduser ftpusername -s /sbin/nologin
```

### userdel

```bash
# 永久性删除用户账号 user1（保留用户数据）
userdel user1

# 彻底永久性删除用户账号 user2（及其 home 目录下的数据）
userdel -r user2
```

### usermod

修改用户账号的相对应信息。

```bash
# 修改用户 home 目录地址（放到 ben1 目录下）
usermode -d /home/ben1 user1

# 将 user1 的用户组改为 group1
usermode -group1 user1
```

### groupadd

```bash
# 新建用户组
groupadd

# 新建用户组 group1
groupadd group1
```

### groupdel

```bash
# 永久性删除用户工作组 group1
groupdel group1
```

### groupmode

```bash
# 修改用户组
groupmod
```

### passwd

```bash
# 为用户 ben 设置密码
passwd ben

# 为当前用户修改密码
passwd
```

### su

su 用来切换用户。比如你现在是 root，想要用 `ben` 用户做一些勾当，就可以使用 su 切换。

```bash
# 切换到 ben 用户（使用 login shell 方式切换用户）
su - ben

# 不完全切换（不带减号）
su ben
```

可以让你干净纯洁的降临另一个账号，不出意外，推荐。

### sudo

sudo 以其他用户身份执行命令

```bash
# 设置需要使用 sudo 的用户（组）
visudo
```

### id

查看用户信息及所属组别。

```bash
# 查看名为 ben 的用户信息
id ben
```

```bash
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

### 用户和用户组的配置文件

查看用户信息的一些命令：

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
```

查看用户配置文件：

```bash
# 查看用户 user1 自己的 /home 目录（查看时要打开隐藏文件可见）
ls -a /home/user1

# 创建用户的信息也会记录在 /etc/passwd 文件中
tail -10 /etc/passwd

# 创建用户也会在 /etc/shadow 保留用户信息
tail -10 /etc/shadow

# 删除用户 user1 目录
rm -rf /var/spool mail/user1
rm -rf /home/user1
```

修改用户配置文件：

```bash
# 编辑用户配置文件
vim /etc/passwd

# 编辑用户组配置文件
vim /etc/group
```
