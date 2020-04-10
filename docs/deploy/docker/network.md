---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 网络通信
order: 7
---

# 网络通信

要实现网络通信，机器需要至少一个网络接口（物理接口或虚拟接口）来收发数据包；此外，如果不同子网之间要进行通信，需要路由机制。

Docker 中的网络接口默认都是虚拟的接口。虚拟接口的优势之一是转发效率较高。 Linux 通过在内核中进行数据复制来实现虚拟接口之间的数据转发，发送接口的发送缓存中的数据包被直接复制到接收接口的接收缓存中。对于本地系统和容器内系统看来就像是一个正常的以太网卡，只是它不需要真正同外部网络设备通信，速度要快很多。

Docker 容器网络就利用了这项技术。它在本地主机和容器内分别创建一个虚拟接口，并让它们彼此连通（这样的一对接口叫做 `veth pair`）。

Docker 中使用 Network 来管理容器之间的通信，只要两个 Conteiner 处于同一个 Network 之中，就可以通过容器名去互相通信。

## 网络模式类型

Docker 创建一个容器的时候，会执行如下操作：

- 创建一对虚拟接口，分别放到本地主机和新容器中
- 本地主机一端桥接到默认的 `docker0` 或指定网桥上，并具有一个唯一的名字，如 `veth65f9`
- 容器一端放到新容器中，并修改名字作为 `eth0`，这个接口 **只在** 容器的名字空间可见
- 从网桥可用地址段中获取一个空闲地址分配给容器的 `eth0`，并配置默认路由到桥接网卡 `veth65f9`

完成这些之后，容器就可以使用 `eth0` 虚拟网卡来连接其他容器和其他网络。

可以在 `docker run` 的时候通过 `--net` 参数来指定容器的网络配置，有四个可选值，下面逐个进行解释。

### Bridge 模式

Bridge 模式（`--net=bridge`）为 Docker 容器默认创建后的网络模式，这中模式创建后即加入 `docker0` 网桥。其特点如下：

- 使用一个 Linux bridge，默认为 `docker0`
- 使用 veth 对，一头在容器的网络 namespace 中，一头在 `docker0` 上
- 该模式下 Docker Container 不具有一个公有 IP，因为宿主机的 IP 地址与 veth pair 的 IP 地址不在同一个网段内
- Docker 采用 NAT 方式，将容器内部的服务监听的端口与宿主机的某一个端口 port 进行**绑定**，使得宿主机以外的世界可以主动将网络报文发送至容器内部
- 外界访问容器内的服务时，需要访问宿主机的 IP 以及宿主机的端口 port
- NAT 模式由于是在三层网络上的实现手段，故肯定会影响网络的传输效率
- 容器拥有独立、隔离的网络栈；让容器和宿主机以外的世界通过 NAT 建立通信

### Host 模式

Host 模式（`--net=host`）并没有为容器创建一个隔离的网络环境（network namespace），这就意味着容器不会有自己的网卡信息，而是与宿主机共用网络环境，亦即拥有完全的本地主机接口的访问权限。

容器进程可以跟宿主机其他 root 进程一样打开低范围的端口，可以访问本地网络服务比如 D-Bus，还可以让容器做一些影响整个主机系统的事情。这种情况下，容器除了网络，其他都是隔离的。

此时容器内获取 IP 为宿主机 IP，端口绑定直接绑定在宿主机网卡上，有点是网络传输不用经过 NAT 转换，效率更高速度更快。

其特点包括：

- 这种模式下的容器没有隔离的 network namespace
- 容器的 IP 地址同 Docker host（容器的宿主机）的 IP 地址
- 需要注意容器中服务的端口号不能与 Docker host 上已经使用的端口号相冲突
- host 模式能够和其它模式共存

### Container 模式

Container 模式（`--net=container:<NAME_OR_ID>`）是 Docker 中一种较为特别的网络的模式。处于这个模式下的 Docker 容器会共享其他容器的网络环境（共享 network namespace），因此，至少这两个容器之间不存在网络隔离，而这两个容器又与宿主机以及除此之外其他的容器存在网络隔离。

两个容器有自己的文件系统、进程列表和资源限制，但会和已存在的容器共享 IP 地址和端口等网络资源，两者进程可以直接通过 I/O 环回接口通信。

### None 模式

None 模式（`--net=none`），即容器获取独立的 network namespace，但不为容器进行任何网络配置，需要手动配置。一旦 Docker 容器采用了 none 网络模式，那么容器内部就只能使用 `loopback` 网络设备，不会再有其他的网络资源。Docker Container 的 none 网络模式意味着不给该容器创建任何网络环境，容器只能使用 `127.0.0.1` 的本机网络。

## 多容器通信


```bash
 # 通过link指令建立连接
 $ docker run --name <Name> -d -p <path1>:<path2> --link <containerName>:<alias> <containerName:tag/imageID>

- --link 容器连接指令
- < containerName > : < alias >
- < 被连接容器名称 > : < 容器访问别名 >
- 注：别名在主动建立连接的容器中访问被连接容器使用
- 以下指令在容器检测连接状态
    $ curl <alias>
```


## 相关指令

Docker 中常用的 network 指令：

```bash
$ docker network create

# 将容器 container-name 连接到新建网络 network-name
$ docker network connect <network-name> <contaienr-name>

$ docker network ls

# 将 container-name 从 network-name 网络中移除连接
$ docker network disconnect <network-name> <container-name>

# 与 disconnect 相似，但是要求容器关闭或断开与此网络的连接
$ docker network rm <network-name> <container-name>

# 查看容器的网络情况
$ docker network inspect <container-name>
```

---

**参考资料：**

- [📖 Docker：Networking overview](https://docs.docker.com/network/)
- [📝 Docker 系列教程 - network 命令](https://www.jianshu.com/p/9ea182393c0e)
- [📝 Docker 网络实现](https://www.cnblogs.com/zzsdream/p/11193096.html)