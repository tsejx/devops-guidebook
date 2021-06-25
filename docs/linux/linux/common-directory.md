---
nav:
  title: Linux
  order: 1
group:
  title: Linux 系统
  order: 1
title: 常见目录
order: 2
---

# 常见目录

Linux 将整个文件系统看作一棵树，这棵树的树根叫做根文件系统，用 `/` 表示。

## 常用的系统文件目录

| 目录           | 语义                   | 描述                                              |
| :------------- | :--------------------- | :------------------------------------------------ |
| /root          | Root Directories       | 系统管理员的主目录                                |
| /home/username | Home Directories       | 普通用户的主目录                                  |
| /bin           | User Binaries          | 供所有用户使用的完成 `基本维护任务的命令`         |
| /sbin          | System Binaries        | 存放系统管理员使用的 `管理程序命令`               |
| /lib           | System Libraries       | 系统最基本的 `共享链接库和内核模块`               |
| /etc           | Configuration Files    | 系统和应用软件的 `配置文件`                       |
| /tmp           | Temporary Files        | 临时文件的存放目录                                |
| /proc          | Process Information    | 虚拟文件系统                                      |
| /var           | Variable Files         | 存放在系统 `运行时可能会更改的数据`               |
| /usr           | Unix Software Resource | Unix 操作系统软件资源所放置的目录，而非用户的数据 |

`/usr` 不是 `user` 的缩写，其实 `usr` 是 Unix Software Resource，也就是 Unix 操作系统软件资源所放置的目录，而非用户的数据；所有系统默认的软件都会放置到 `/usr`，系统安装完时，这个目录会占用最多的硬盘容量。

| 目录            | 语义 | 描述                                                           |
| :-------------- | :--- | :------------------------------------------------------------- |
| /usr/bin        |      | 用户需要执行的命令，例如压缩、文件查找、客户端等程序           |
| /usr/sbin       |      | 系统运行不必须的命令，例如服务端程序、用户管理等程序           |
| /usr/include    |      | C / C++ 头文件                                                 |
| /usr/lib        |      | 普通用户使用的库文件                                           |
| /usr/local      |      | 个人安装的软件，通常需要手动指定；与 `/usr` 目录的目录结构相似 |
| /usr/libexec    |      |                                                                |
| /usr/share      |      |                                                                |
| /usr/standalone |      |                                                                |

## 其他文件目录

| 目录        | 语义                 | 描述                                       |
| :---------- | :------------------- | :----------------------------------------- |
| /boot       | Boot Loader Files    | 启动 Linux 时的核心文件                    |
| /dev        | Device Files         | 所有 Linux 的外围设备                      |
| /lost+found |                      | 无家可归文件的避难所                       |
| /mnt        | Mount Directory      | 空目录，用于提供给用户临时挂接别的文件系统 |
| /opt        | Optional add-on Apps | 第三方工具使用的安装目录                   |
| /srv        | Service Data         |                                            |
| /media      | Removable Devices    |                                            |

## 虚拟文件系统

`/proc` 目录挂载了一个**虚拟文件系统**，以**虚拟文件**的形式映射系统与进程在内存中的运行时信息。

### 系统信息

`/proc` 下的直接子目录通常存储系统信息。

| 目录          | 描述             | 举例                                        |
| :------------ | :--------------- | :------------------------------------------ |
| /proc/cpuinfo | 处理器的相关信息 | physical id、cpu cores、siblings、processor |
| /proc/version | 系统的内核版本号 | Linux version 3.10.                         |

### 进程信息

重点是 `/proc/` 目录映射的进程信息。以

| 目录                  | 描述                                                                                                              |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `/proc/<pid>/cmdline` | 启动当前进程的完整命令                                                                                            |
| `/proc/<pid>/cwd`     | 当前进程工作目录的软链                                                                                            |
| `/proc/<pid>/environ` | 当前进程的环境变量列表                                                                                            |
| `/proc/<pid>/exe`     | 启动当前进程的可执行文件的软链                                                                                    |
| `/proc/<pid>/fd`      | 目录，保持当前进程持有的文件描述符（以软链形式存在，指向实际文件）                                                |
| `/proc/<pid>/limits`  | 当前进程使用资源的软限制、硬限制（和单位）                                                                        |
| `/proc/<pid>task`     | 目录，保存当前进程所运行的每一个线程的相关信息；<br/>以 `<tid>` 作为各线程的目录名，目录结构与 `/proc/<pid>` 相似 |

## 数据文件系统

`/var` 目录存放数据文件，如程序数据、日志等；但线上通常只将日志放在 `/var` 目录。

通过 rsyslog 记录系统级日志，配置文件为 `/etc/rsyslog.conf`。重点看 `/var/log/messages` 的配置：

```
# Log anything (except mail) of level info or higher.
# Don't log private authentication messages!
*.info;mail.none;authpriv.none;cron.none                /var/log/messages
```

> `*.info`表示所有服务大于等于 info 优先级的信息都会记录到 `/var/log/messages` 中； `mail.none` 表示不记录任何 mail 的信息到 `/var/log/messages` 中。

以上配置表示：**除安全认证、邮件、定时任务外，输出到 stdout、stderr 的 info 及更高级别的日志记录在 `/var/log/messages` 中**。

---

**参考资料：**

- [📝 File Structure in Linux](https://ossbymanu.blogspot.com/2012/02/file-structure-in-linux.html)
- [📝 Linux 文件系统目录结构](https://juejin.im/post/5aaf1975f265da239d4918b9)
- [浅谈 Linux 线程模型和线程切换](<[https://monkeysayhi.github.io/2017/11/29/%E6%B5%85%E8%B0%88linux%E7%BA%BF%E7%A8%8B%E6%A8%A1%E5%9E%8B%E5%92%8C%E7%BA%BF%E7%A8%8B%E5%88%87%E6%8D%A2/](https://monkeysayhi.github.io/2017/11/29/浅谈linux线程模型和线程切换/)>)
