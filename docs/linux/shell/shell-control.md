# 脚本控制

- 脚本优先级控制
- 捕获信号

## 处理信号

Linux 利用信号与运行在系统中的进程进行通信。

| 信号 | 值      | 描述                           |
| :--- | :------ | :----------------------------- |
| 1    | SIGHUP  | 挂起进程                       |
| 2    | SIGINT  | 终止进程                       |
| 3    | SIGQUIT | 停止进程                       |
| 9    | SIGKILL | 无条件终止进程                 |
| 15   | SIGTERM | 尽可能终止进程                 |
| 17   | SIGSTOP | 无条件停止进程，但不是终止进程 |
| 18   | SIGTSTP | 停止或暂停进程，但不终止进程   |
| 19   | SIGCONT | 继续运行停止的进程             |

Shell 会将这些信号传给 Shell 脚本程序来处理。而 Shell 脚本的默认行为是忽略这些信号的。它们可能会不利于脚本的运行。要避免这些情况，你可以脚本中加入识别信号的代码，并执行命令来处理信号。

### 生成信号

Bash Shell 允许用键盘上的组合键生成两种基本的 Linux 信号。

- Ctrl + C 会发送 SIGINT 2 号信号，停止 Shell 中当前运行的进程。
- Ctrl + Z 会发送 SIGTSTP 信号，停止 SHell 中运行的任何进程。

停止（stopping）进程和终止（terminating）进程不同：停止进程会让程序继续保留在内存中，并能从上次停止的位置继续运行。

如果有已停止作业存在的情况下，你仍然想退出 Shell，只要再输入一遍 `exit` 命令即可。或者，如果你已知作业的 PID，通过 `kill` 命令来发送一个 SIGKILL 信号来终止它。

### 捕获信号

也可以不忽略信号，在信号出现时捕获它们并执行其他命令。`trap` 命令允许你来指定 Shell 脚本要监看并从 Shell 中拦截的 Linux 信号。如果脚本收到了 `trap` 命令中列出的信号，该信号不再由 Shell 处理，而是交由本地处理

捕获信号脚本的编写：

- `kill` 默认会发送 15 号信号给应用程序
- Ctrl + C 发送 2 号信号给应用程序
- 9 号信号不可阻塞

⚠️ 注意：以下命令会导致 CPU 满负载运行

```bash
#!/bin/bash
# signal demo

trap "echo sig 15" 15

echo $$

while :
do
    :
done
```

### 捕获脚本退出

除了在 Shell 脚本中捕获信号，你也可以在 Shell 脚本退出时进行捕获。这是在 Shell 完成任务时执行命令的一种简便方法。

要捕获 Shell 脚本的退出，只要在 `trap` 命令后加上 EXIT 信号即可。

```bash
#!/bin/bash
# Trapping the script exit
#

count=1
while [ $count -le 5 ]
do
    echo "Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done
```

当脚本运行到正常的退出位置时，捕获就被触发了，Shell 会执行在 `trap` 命令行指定的命令。

## 以后台模式运行脚本

在命令后加 `&` 即可后台运行脚本：

```bash
$ ./run-in-background.sh &

#!/bin/bash
# Test running in the background
#

count=1
while [ $count -le 10 ]
do
  sleep 1
  count=$[ $count + 1 ]
done
```

当 `&` 放到命令后，它会将命令和 Bash Shell 分离开来，将命令作为系统中的一个独立的后台进程运行。

运行后，会返回后台运行进程的 PID。

## 调度优先级控制

在多任务操作系统中，内核负责将 CPU 时间分配给系统上运行的每个进程。调度优先级（shceduling priority）是内核分配给进程的 CPU 时间（相对于其他进程）。在 Linux 系统中，由 Shell 启动的所有进程的调度优先级默认都是相同的。

调度优先级是个整数值，从 -20（最高优先级）到 +19（最低优先级）。默认情况下，Bash Shell 以优先级 0 来启动所有程序。

可以使用 [nice](../command/system#nice) 和 [renice](../command/system#renice) 调整脚本优先级

避免不可控的死循环：

- 死循环导致 CPU 占用过高
- 死循环导致死机

## 计划任务

### 一次性计划任务

使用 `at` 命令运行一次性计划任务。`at` 命令会将作业提交到队列中，指定 Shell 何时运行该作业。`at` 的守护进程 `atd` 会以后台模式运行，检查作业队列来运行作业。

`atd` 守护进程会检查系统上的一个特殊目录（通常位于 `/var/spool/at`）来获取用 `at` 命令提交的作业。默认情况下，`atd` 守护进程会每 60 秒检查一下这个目录。有作业时，`atd` 守护进程会检查作业设置运行的时间。如果时间跟当前时间匹配，`atd` 守护进程就会运行此作业。

使用方法参阅 [at](../command/system#at)

### 周期性计划任务

Linux 系统使用 `cron` 程序来安排要定期执行的作业。`cron` 程序会在后台运行并检查一个特殊的表（被称作 cron 时间表），以获知已安排执行的作业。

配置方式：

```bash
crontab -e
```

配置格式：

```
分钟 小时  日期       月份   星期      执行的命令
min  hour dayofmonth month dayofweek command
```

`cron` 允许你用特定值、取值范围（比如 1 ～ 5）或者是通配符（星号）来指定特定条目。

```bash
# 在每天 10:15 运行命令，使用 cron 时间表条目
15 10 * * * command
```

在 dayofmonth、month 以及 dayofweek 字段中使用了通配符，表明 `cron` 会在每个月每天的 10:15 执行该命令。

可以用三字符的文本值（mon、tue、wed、thu、fri、sat、sun）或数值（0 为周日，6 为周六）来指定 dayofweek 表项。

```bash
# 每个月第一天中午 12 点执行命令
00 12 1 * * command
```

设置每个月 UI 后一天执行的命令：

```bash
# 它会在每天中午 12 点来检查是不是当月的最后一天，如果是，cron 将会运行该命令
00 12 * * * if [`date +%d -d tomorrow` = 01 ] ; then ; command
```

注意命令的路径问题

如果你创建的脚本对精确的执行时间要求不高，用与配置的 `cron` 脚本目录会更方便。有四个基本目录：hourly、daily、monthly 和 weekly。

```bash
ls /etc/cron.*ly
```

查看调用记录：

```bash
# 启动计划任务后，查看日志文件
cd /var/log

# cron 文件记录了计划任务的日志
tail -f cron
```

### 计划任务加锁

flock

如果计算机不能按照预期时间运行

anacontab 演示计划任务

flock 锁文件

```bash
vim /etc/cron.d

vim /etc/crond.d/0hourly
```
