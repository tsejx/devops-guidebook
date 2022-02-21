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
  - [`ps`](#ps) 报告当前系统的进程状态
  - `telint` 切换当前正在运行系统的运行等级
  - `init` 所有 Linux 进程的父进程
  - `at` 在指定时间执行一个任务
  - `crontab` 提交和管理用户的需要周期性执行的任务
  - `nohup` 将程序以忽略挂起信号的方式运行起来
  - `nice` 指定的进程调度优先级启动其他程序
  - `renice` 修改正在运行的进程的调度优先级
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
  - `logname` 打印执行该命令的用户名
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

`ps` 命令用于报告当前系统的进程状态。

```bash
# 查看进程信息
ps <pid>

# 找到 java 进程
ps -ef | grep java

#
ps -elf

#
ps -e | more
```

- 进程也是树形结构
- 进程和权限有着密不可分的关系

列出目前所有正在内存当中的程序：

```bash
ps aux

# Output
# USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND
# kenny             6155  21.3  1.7  7969944 284912   ??  S    二03下午 199:14.14 /Appl...OS/WeChat
# kenny              559  20.4  0.8  4963740 138176   ??  S    二03下午  33:28.27 /Appl...S/iTerm2
# _windowserver      187  18.0  0.6  7005748  95884   ??  Ss   二03下午 288:44.97 /Syst...Light.WindowServer -daemon
# kenny             1408  10.7  2.1  5838592 347348   ??  S    二03下午 138:51.63 /Appl...nts/MacOS/Google Chrome
# kenny              327   5.8  0.5  5771984  79452   ??  S    二03下午   2:51.58 /Syst...pp/Contents/MacOS/Finder

# 在所有程序中查找 nginx
# -a 显示所有终端机下执行的程序
# -u 列出该用户的程序的状况
# -v 同 -a
ps aux | grep nginx

# 列出类似程序树的程序显示
ps -axjf
```

- USER：该 process 属于那个使用者账号的
- PID ：该 process 的号码
- %CPU：该 process 使用掉的 CPU 资源百分比
- %MEM：该 process 所占用的物理内存百分比
- VSZ ：该 process 使用掉的虚拟内存量 (Kbytes)
- RSS ：该 process 占用的固定的内存量 (Kbytes)
- TTY ：该 process 是在那个终端机上面运作，若与终端机无关，则显示 ?，另外， tty1-tty6 是本机上面的登入者程序，若为 pts/0 等等的，则表示为由网络连接进主机的程序。
- STAT：该程序目前的状态，主要的状态有
- R ：该程序目前正在运作，或者是可被运作
- S ：该程序目前正在睡眠当中 (可说是 idle 状态)，但可被某些讯号 (signal) 唤醒。
- T ：该程序目前正在侦测或者是停止了
- Z ：该程序应该已经终止，但是其父程序却无法正常的终止他，造成 zombie (疆尸) 程序的状态
- START：该 process 被触发启动的时间
- TIME ：该 process 实际使用 CPU 运作的时间
- COMMAND：该程序的实际指令

### pstree

```bash
# 以树状结构显示线程结构
pstree
```

### at

基本格式：

```bash
at [-f filename] time
```

时间格式：

- 标准的消失和分钟格式，比如 10:15
- AM/PM 指示符，比如 10:15 PM
- 特定可命名时间，比如 `now`、`noon`、`midnigh` 或者 `teatime`（4 PM）

除了指定运行作业的时间，也可以通过不同功能的日期格式指定特定的日期。

- 标准日期格式，比如 `MMDDYY`、`MM/DD/YY` 或 `DD.MM.YY`
- 文本日期，比如 `Jul 4` 或 `Dec 25`，加不加年份均可
- 你也可以指定时间增量
  - 当前时间 `+25min`
  - 明天 `10:15 PM`
  - `10:15+7天`

```bash
# -f 指明执行的脚本文件，now 指明 at 命令立即执行该脚本
at -f timer.sh now

# 如果不想在 at 命令中使用邮件或重定向，最好加上 -M 选项来屏蔽作业产生的输出信息
at -M -f timer.sh tomorrow

# 查询待执行作业列表
atq

# 删除作业
# 先通过 atq 查询待执行作业，删除作业号为 10 的作业
atrm 10
```

### nice

`nice` 命令允许你设置命令启动时的调度优先级。要让命令以更低的优先级运行，只要用 `nice` 的 `-n` 命令来指定新的优先级级别。

```bash
# -n 选项并非必须的，只要在破折号后跟上优先级即可
nice -n 10 ./test.sh > test.out &

# 新建进程并设置优先级，将当前目录下的 documents 目录打包，但不希望 tar 占用太多 CPU
nice -10 tar zcf pack.tar.gz documents
```

### renice

```bash
# 对运行中的 PID 为 5055 的进程调整调度优先级
renice -n 10 -p 5055
```

限制：

- 只能对属于你的进程执行 `renice`
- 只能通过 `renice` 降低进程的优先级
- root 用户可以通过 `renice` 来任意调整进程的优先级

如果想完全控制运行进程，必须以 root 账户身份登录或使用 `sudo` 命令。

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
