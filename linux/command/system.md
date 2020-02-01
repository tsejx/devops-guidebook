# 系统管理

- `service`：控制系统服务的实用工具
- `systemctl`：系统服务管理器指令
- `skill`：向选定的进程发送信号冻结进程
- `telint`：切换当前正在运行系统的运行等级
- `ps`：报告当前系统的进程状态
- `top`：显示或管理执行中的程序
- `at`：在指定时间执行一个任务

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

## uname

uname 命令可以输出当前的内核信息，让你了解到用的是什么机器。

```bash
uname -e
```

## ps

ps 命令能够看到进程/线程状态。和 top 有些内容重叠，常用。

```bash
# 查看进程信息
ps <pid>

# 找到 java 进程
ps -ef | grep java
```

## top

显示或管理执行中的程序。

可以实时动态地查看系统的整体运行情况，是一个综合了多方信息监测系统性能和运行信息的实用工具。

```bash
top -H -p pid
```

## free

top 也能看内容，但不友好，free 是专门用来查看内存的。包括物理内存和虚拟内存 swap。

## df

df 命令用来查看系统中磁盘的使用量，用来查看磁盘是否已经到达上限。参数 h 可以以友好的方式进行展示。

```bash
df -h
```

## kill

杀掉进程

```sh
# 强迫进程立即停止
kill -9 <pid>
```

## netstat

`netstat` 命令用于显示与 IP、TCP、UDP 和 ICMP 协议相关的统计数据，一般用于检验本机各端口的网络连接情况。`netstat` 是在内核中访问网络及相关信息的程序，它能提供 TCP 连接，TCP 和 UDP 监听，进程内存管理的相关报告。

```sh
netstat
```

从整理上来看，`netstat` 输出结果可以分为两个部分：

- Active Internet connections，称为有源 TCP 连接，其中 `Recv-Q` 和 `Send-Q` 指的是接收队列和发送队列。这些数字一版都应该是 0。如果不是则表示软件包正在队列中堆积。这种情况只能在非常少的情况见到。
- Active UNIX domain sockets，称为有源 Unix 域套接口（和网络套接字一样，但是只能用于本机通信，性能可以提高一倍）

Proto 显示连接使用的协议，RefCnt 表示连接到本套接口上的进程号，Types 显示套接口的类型，State 显示套接口当前的状态，Path 表示连接到套接口的其它进程使用的路径名。

**状态说明：**

```sh
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

## lsof

lsof（list open files）是一个列出当前系统打开文件的工具。在 Linux 环境下，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。所以如传输控制协议（TCP）和用户数据报协议（UDP）套接字等，系统在后台能为该应用程序分配了一个文件描述符，无论这个文件的本质如何，该文件描述符为应用程序与操作系统之间的交互提供了通用接口。因为应用程序打开文件的描述符列表提供了大量关于这个应用程序本身的信息，因此通过 lsof 工具能够查看这个列表对系统及排错将是很有帮助的。

https://www.cnblogs.com/sparkbj/p/7161669.html

https://www.cnblogs.com/fps2tao/p/10042553.html

```bash
lsof -i:端口号
```

### 常用命令

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

---

**参考资料：**

- [Linux netstat 命令详解](https://www.cnblogs.com/ftl1012/p/netstat.html)
