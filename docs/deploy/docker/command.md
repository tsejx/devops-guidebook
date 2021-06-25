---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 常用命令
order: 20
---

# 常用命令

## 管理命令

| 管理命令  | 说明                |
| :-------- | :------------------ |
| builder   | 管理构建            |
| config    | 管理配置            |
| container | 管理容器            |
| context   | 管理上下文          |
| engine    | 管理引擎            |
| image     | 管理镜像            |
| network   | 管理网络            |
| node      | 管理 Swarm 节点     |
| plugin    | 管理插件            |
| secret    | 管理 Docker secrets |
| service   | 管理服务            |
| stack     | 管理 Docker stacks  |
| swarm     | 管理 Swarm 集群     |
| system    | 查看系统信息        |
| trust     | 管理 Docker trust   |
| volume    | 管理卷              |

## 普通命令

### 容器生命周期管理

| 命令                                   | 说明                           |
| :------------------------------------- | :----------------------------- |
| run                                    | 创建一个新的容器并运行一个命令 |
| <span style="color: red">start</span>  | 启动容器                       |
| <span style="color: red">stop</span>   | 停止容器                       |
| restart                                | 重启容器                       |
| <span style="color: red">kill</span>   | kill 运行中的容器              |
| rm                                     | 删除容器                       |
| pause                                  | 暂停一个或多个容器中的所有进程 |
| unpause                                | 恢复容器中所有的进程           |
| <span style="color: red">create</span> | 创建一个新容器                 |
| exec                                   | 在正在运行的容器中运行命令     |

### 容器操作

| 命令                                   | 说明                               |
| :------------------------------------- | :--------------------------------- |
| ps                                     | 查看容器列表                       |
| inspect                                | 返回 Docker 对象的低级信息         |
| top                                    | 展示一个容器中运行的进程           |
| attach                                 | 进入一个运行的容器                 |
| <span style="color: red">events</span> | 从服务器获取实时事件               |
| logs                                   | 获取一个容器的日志                 |
| wait                                   | 阻塞直到容器停止，然后打印退出代码 |
| <span style="color: red">export</span> | 将容器的文件系统导出为 tar 存档    |
| port                                   | 查看端口映射或容器的特定映射列表   |
| stats                                  | 实时显示容器资源使用情况的统计信息 |
| <span style="color: red">update</span> | 更新容器配置                       |

### 容器 rootfs 命令

| 命令                                   | 说明                                   |
| :------------------------------------- | :------------------------------------- |
| <span style="color: red">commit</span> | 从容器变更记录中创建一个镜像           |
| cp                                     | 在容器和宿主机文件系统之间拷贝文件     |
| diff                                   | 检查对容器文件系统上的文件或目录的更改 |

### 镜像仓库

| 命令                                   | 说明                                          |
| :------------------------------------- | :-------------------------------------------- |
| login                                  | 登陆 Docker 镜像仓库                          |
| logout                                 | 登出 Docker 镜像仓库                          |
| pull                                   | 从镜像仓库拉取镜像                            |
| push                                   | 将本地的镜像上传到镜像仓库,要先登陆到镜像仓库 |
| <span style="color: red">search</span> | 从 Docker Hub 搜索镜像                        |

### 本地镜像管理

| 命令                                   | 说明                           |
| :------------------------------------- | :----------------------------- |
| images                                 | 查看镜像列表                   |
| rmi                                    | 删除镜像                       |
| tag                                    | 标记本地镜像，将其归入某一仓库 |
| build                                  | 根据 DockerFile 构建镜像       |
| history                                | 显示镜像的构建历史记录         |
| <span style="color: red">save</span>   | 将指定镜像保存成 tar 归档文件  |
| <span style="color: red">load</span>   | 从存档或者 STDIN 加载镜像      |
| <span style="color: red">import</span> | 从归档文件中创建镜像           |
| <span style="color: red">rename</span> | 重命名容器                     |

### 相关信息

| 命令                                    | 说明                   |
| :-------------------------------------- | :--------------------- |
| <span style="color: red">wait</span>    |                        |
| info                                    | 显示系统范围的信息     |
| <span style="color: red">version</span> | 显示 Docker 的版本信息 |

## 宿主机操作

### 端口和磁盘目录的映射

```bash
# 将宿主机的 81 端口映射到容器的 80 端口
# 将宿主机的 /develop/data 卷 映射到容器的 /data 卷
$ docker run -i -t -p 81:80 -v /develop/data:/data centos /bin/bash
```

- `-p`：映射端口号
- `-v`：磁盘目录映射

Docker 更改端口号映射：

运行中的容器无法映射新的端口号，也无法更改端口号映射，但可以通过两种方法解决。

1. iptable 转发端口

```bash
# 查看容器 IP
$ docker insepct 36afde543eb5 | grep IPAddress
> "IPAddress": "172.17.0.2"

# 将主机的 8081 端口映射到宿主机的 8080 端口
$ iptables -t nat -A DOCKER -p tcp --dport 8081 -j DNAT --to-destination 172.17.0.2:8080
```

2. 先提交容器为镜像，再运行这个容器，同时指定新的端口映射

```bash
# 提交容器为镜像
$ docker commit 9995ffa15f46  mycentos:0.1

# 停止旧的容器
$ docker stop 9995ffa15f46

# 重新从旧的镜像启动容器
$ docker run -i -t  -p 8081:8080  mycentos:0.1
```

### 宿主机关于 Docker 的操作

```bash
# 开启 docker
service docker start

# 重启
service docker restart

# 暂停
service docker stop
```

## Docker Hub

创建和使用私有仓库

```bash
#
docker run -eSEARCH_BACKEND=sqlalchemy-eSQLALCHEMY_INDEX_DATABASE=sqlite:////tmp/docker-registry.db-d -name registry -p 5000:5000 registry
```

## 原版指令指引

按首字母大小写排列

- `attach` Attach local standard input, output, and error streams to a running container
- `build` Build an image from a Dockerfile
- `commit` Create a new image from a container's changes
- `cp` Copy files/folders between a container and the local filesystem
- `create` Create a new container
- `diff` Inspect changes to files or directories on a container's filesystem
- `events` Get real time events from the server
- `exec` Run a command in a running container
- `export` Export a container's filesystem as a tar archive
- `history` Show the history of an image
- `images` List images
- `import` Import the contents from a tarball to create a filesystem image
- `info` Display system-wide information
- `inspect` Return low-level information on Docker objects
- `kill` Kill one or more running containers
- `load` Load an image from a tar archive or STDIN
- `login` Log in to a Docker registry
- `logout` Log out from a Docker registry
- `logs` Fetch the logs of a container
- `pause` Pause all processes within one or more containers
- `port` List port mappings or a specific mapping for the container
- `ps` List containers
- `pull` Pull an image or a repository from a registry
- `push` Push an image or a repository to a registry
- `rename` Rename a container
- `restart` Restart one or more containers
- `rm` Remove one or more containers
- `rmi` Remove one or more images
- `run` Run a command in a new container
- `save` Save one or more images to a tar archive (streamed to STDOUT by default)
- `search` Search the Docker Hub for images
- `start` Start one or more stopped containers
- `stats` Display a live stream of container(s) resource usage statistics
- `stop` Stop one or more running containers
- `tag` Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
- `top` Display the running processes of a container
- `unpause` Unpause all processes within one or more containers
- `update` Update configuration of one or more containers
- `version` Show the Docker version information
- `wait` Block until one or more containers stop, then print their exit codes
