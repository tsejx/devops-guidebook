---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 构建镜像
order: 2
---

# 构建镜像

Docker 运行容器前需要本地存在对应的镜像，如果本地不存在该镜像，Docker 会从镜像仓库下载该镜像。

## 获取镜像

从 Docker 镜像仓库获取镜像的命令是 `docker pull`。

```bash
# 格式
docker pull [选项] [Docker Registry 地址[:端口号]/] 仓库名[:标签]

# 默认官方镜像库拉取，latest 标签
$ docker pull ubuntu

# 指定版本标签
$ docker pull ubuntu:18.04

# 指定仓库域名（默认官方仓库）
$ docker pull library/ubuntu

# 第三方服务商或私有镜像仓库
$ docker pull daocloud.io/library/ubuntu:latest
```

- Docker 镜像仓库地址：地址的格式一般是 `<域名/IP>[:端口号]` 默认地址是 Docker Hub
- 仓库名：这里的仓库名是两段名称，即 `<用户名>/<镜像名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

从下载过程中可以看到我们之前提及的分层存储的概念，镜像是由多层存储所构成。下载也是一层层的去下载，并非单一文件。下载过程中给出了每一层的 ID 的前 12 位。并且下载结束后，给出该镜像完整的 `sha256` 的摘要，以确保下载一致性。

在使用上面命令的时候，你可能会发现，你所看到的层 ID 以及 sha256 的摘要和这里的不一样。这是因为官方镜像是一直在维护的，有任何新的 bug，或者版本更新，都会进行修复再以原来的标签发布，这样可以确保任何使用这个标签的用户可以获得更安全、更稳定的镜像。

有了镜像后，就能够以该镜像为基础启动并运行容器。如果打算启动后在容器内运行 `bash` 进行交互操作的话，可以执行下面的命令。

```bash
# 基于镜像创建容器
$ docker run -it --rm <image-name> bash
```

- `-i`：交互式操作
- `-t`：终端
- `--rm`：容器退出后随之删除（一般不需要，这里是展示需求）
- `<image-name>`：指定启动容器的镜像名称（全称）
- `bash`：放在镜像名后的是命令 启动后执行容器内命令行

## 查看镜像信息

```bash
# 先查询需要查看的详细信息的镜像 ID
$ docker images

# 查看详细的镜像信息
$ docker inspect <iamge-id>

# 查看镜像的某一个详细信息（.Os 是其中一个属性）
$ docker inspect -f {{.Os}} <image-id>
```

## 查看镜像列表

```bash
# 或者
$ docker images
```

列表包含了 `仓库名`、`标签`、`镜像 ID`、`创建时间` 以及所占用的空间。

镜像 ID 是镜像的唯一标识，一个镜像可以对应多个标签。

### 系统占用空间

```bash
# 查看镜像、容器、数据卷所占用系统空间
$ docker system off
```

### 虚悬镜像

在镜像列表中，有一些特殊的镜像，这个镜像既没有仓库名，也没有标签，均为 `<none>`。

这些镜像原本是有镜像名和标签的，但随着官方镜像维护，发布了新版本后，`docker pull` 后原来的镜像名称将会被转移到新下载的镜像身上，而旧的镜像上这个名称则被取消，从而成为了 `<none>`。

由于新旧镜像重名，旧镜像名称被取消，从而出现仓库名、标签名均为 `<none>` 的镜像。这类无标签镜像也被称为 **虚悬镜像（dangling image）**，可以用下面的命令专门显示这类镜像。

```bash
# 显示所有 虚悬镜像
$ docker image ls -f dangling=true

# 一般虚悬镜像已经失去存在的价值，可以随意删除
$ docker image prune
```

查看中间层镜像：

```bash
$ docker image ls -a
```

中间层镜像与虚悬镜像虽有类似，但是这些镜像为其他镜像所依赖，因此这些无标签镜像不应该被删除，否则会导致上层镜像因为依赖丢失而出错。

## 删除镜像

删除本地的镜像，删除前确保镜像未被正在运行的容器所引用。

```bash
# 格式
$ docker rmi [选项] <image-id> <image-id> ...

# 示例
$ docker rmi 7ba3cc636d5f
```

其中，`<镜像>` 可以是 `镜像短 ID`、`镜像长 ID`、`镜像名` 或者 `镜像摘要`。

## 制作镜像

### 定制镜像

```bash
# -t 指定镜像名称和标签，格式为 `name:tag` ，最后的点代表当前目录，也可以换成其他的路径
$ docker build -t <image-name>:v1 .
```

## 导入导出镜像

### 压缩包导入

除了标准的使用 Dockerfile 生成镜像的方法外，由于各种特殊需求和历史原因，还提供了一些其它方法用以生成镜像。

```bash
$ docker import [选项] <文件>|<URL>|- [<仓库名>[:<标签>]]
```

压缩包可以是本地文件、远程 Web 文件，甚至是从标准输入中得到。压缩包将会在镜像 `/` 目录展开，并直接作为镜像第一层提交。

```bash
# 导入镜像
$ docker import \

# 查看导入的导入的镜像
$ docker image ls <image-name>

# 查看其构建历史
$ docker history <image-name>
```

### 命令导入

Docker 还提供了 `docker save` 和 `docker load` 命令，用以将镜像保存为一个文件，然后传输到另一个位置上，再加载进来。这是在没有 Docker Registry 时的做法，现在已经不推荐，镜像迁移应该直接使用 Docker Registry，无论是直接使用 Docker Hub 还是使用内网私有 Registry 都可以。

```bash
# 保存镜像（将镜像保存为归档文件）
$ docker image ls <image-name>

# 保存镜像
$ docker save <image-name> -o filename
```

### 导出镜像

```bash
# 查询官方镜像
$ docker search java

# 获取镜像
$ docker pull java

# 导入镜像
$ docker save java > /home/java.tar.gz

# 导出镜像
$ docker load < /home/java.tar.gz

# 移除镜像
$ docker rmi java
```

## 上传镜像

```bash
# 先到 https://hub.docker.com/ 注册账号，保存账户密码

# 控制台登录 dockerhub 账户
$ docker login

# 查看镜像
$ docker images

# 选择需要上传的镜像，重命名为指定的格式
# name 为镜像名称 new-name 为自己镜像起的名称 v1 为任意设置的版本号
$ docker tag <name> username/<new-name>:v1

# 提交镜像到自己的仓库
$ docker push username/<new-name>:v1
```



镜像加速
https://www.jianshu.com/p/5a911f20d93e