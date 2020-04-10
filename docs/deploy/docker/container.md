---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 操作容器
order: 4
---

# 操作容器

简单的说，容器是独立运行的一个或一组应用，以及它们的运行态环境。对应的，虚拟机可以理解为模拟运行的一整套操作系统（提供了运行态环境和其他系统环境）和跑在上面的应用。

## 生命周期

这是一张容器运行的状态流转图：

```jsx | inline
import React from 'react';
import img from '../../assets/docker/container-running-flow.jpg';

export default () => <img alt="容器状态流转图" src={img} width="900" />;
```


图中展示了几种常见对 Docker 容器的操作命令，以及执行它们之后容器运行状态的变化。这里我们撇开命令，着重看看容器的几个核心状态，也就是图中色块表示的：**Created**、**Running**、**Paused**、**Stopped**、**Deleted**。

## 启动容器

启动容器方式有两种，一种是基于镜像新建容器并启动，另一种是将在终止状态（`stopped`）的容器重新启动。

```bash
# 启动一个容器并在后台运行
$ docker run -it <image-name> <command> # 格式
$ docker run -it centos /bin/bash # 示例

# 按住 Ctrl + P + Q 退出容器

# 查看容器状态
$ docker ps
```

常见的启动参数：

- `-p`：向宿主机暴露端口，格式 `宿主机端口:容器端口`
- `-P`：将容器端口映射为宿主机的随机端口
- `-t`：让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
- `-i`：让容器的标准输入保持打开
- `-v`：映射数据卷，例如 `/home/project:/usr/src`，宿主机 `/home/project` 映射容器 `/usr/src`
- `-d`：将容器放在后台运行
- `--rm`：容器推出后清除资源
- `--privileged`：最高权限


当利用 `docker run` 来创建容器时，Docker 在后台运行的标准操作包括：

1. 检查本地是否存在制定的镜像，不存在就从公有仓库下载
2. 利用本地镜像创建并启动一个容器
3. 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
4. 从宿主机配置的网桥接口桥接一个虚拟接口到容器中去
5. 从地址池配置一个 IP 地址给容器
6. 执行用户的指定的用户程序
7. 执行完毕后容器被终止

**重新启动**

```bash
# 处于终止状态的容器重新启动
$ docker restart <container-name>
```

## 后台运行

更多时候，需要让 Docker 在后台运行而不是直接把执行命令的结果输出在当前宿主机下。

这时候可以添加 `-d` 参数来实现。

```bash
# 格式
$ docker run -d <image-name> <command>

# 示例
$ docker run -d ubuntu:18.04 /bin/sh -c "Hello world!"
```

容器是否会持续运行，是和 `docker run` 指定的命令相关，和 `-d` 参数无关。

## 终止容器

```bash
# 终止容器
$ docker stop <container-name>

# 相同效果
$ docker container stop <container-name>
```

处于终止状态的容器，可以通过 `docker start <container-name>` 命令来重新启动。

此外，`docker restart` 命令会将一个运行态的容器终止，然后再重新启动它。

## 进入容器

### exec 命令

```bash
# 进入容器内部
# <container-name> 为容器 ID 或者名称
docker exec -it <container-name> /bin/bash
```

原理实际上是启动了容器内的 `/bin/bash`，此时你就可以通过 `bash shell` 与容器内交互了。就像远程连接了 SSH 一样。

- `-i`：只有该参数时，由于没有分配伪终端，界面没有我们熟悉的 Linux 命令提示符，但命令执行结果仍然可以返回
- `-it`：当合并使用时，则可以看到我们熟悉的 Linux 命令提示符

如果从这个 stdin 中 exit，不会导致容器的停止。

✅ 推荐使用这种方式进入容器内部

### attach 命令

```bash
# 启动容器
$ docker run -dit bunt

# 查看容器列表
$ docker ps

# 连接容器
$ docker attach <container-name>
```

如果从这个 stdin 中 exit，会导致容器的停止。

## 导出和导入容器

### 导出容器

```bash
# 查看全部容器列表
$ docker ps -a

# 导出容器
$ docker export  <container-name> > <file-name>.<file-suffix>
```

### 导入容器

从容器快照文件中导入镜像。

```bash
# 导入容器
$ cat <import-file-name> | docker import - <image-name> # 格式
$ cat ubuntu.tar | docker import - test/ubuntu:v1.0 # 示例

# 查看镜像列表
$ docker images
```

此外，也可以通过指定 URL 或某个目录来导入：

```bash
# 格式
$ docker import <url>

# 示例
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```

⚠️ 注意：用户既可以使用 `docker load` 来导入镜像存储文件到本地镜像库，也可以是哟功能 `docker import` 来导入一个容器快照到本地镜像库。这两者的区别在于容器快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状态），而镜像存储文件将保存完整记录，体积也要大。此外，从容器快照文件导入可以重新指定标签等元数据信息。

## 删除容器

```bash
# 删除处于终止状态的容器
$ docker rm <container-name>

# 删除运行状态的容器
$ docker rm -f <container-name>
```

清理所有处于终止状态的容器

用 `docker ps -a` 命令可以查看所有已经创建的包括终止状态的容器，如果数量太多要逐个删除会很麻烦，用下面的命令可以清理掉所有处于终止状态的容器。

```bash
$ docker container prune
```
