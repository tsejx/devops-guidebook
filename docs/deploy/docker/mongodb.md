---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 部署 MongoDB
order: 30
---

# 部署 MongoDB

## 镜像安装

MongoDB 提供官方镜像，下载安装镜像方法如下：

```bash
# 最新版本 MongoDB
$ docker pull mongo

# 或者，指定需要的版本
$ docker pull mongo:4.0.4
```

## 容器创建

MongoDB Docker 容器创建有以下几个问题：

1. MongoDB 容器基本创建方法和数据目录挂载
2. MongoDB 容器的数据迁移
3. MongoDB 设置登录权限问题

### 容器基本创建方法和数据目录挂载

MongoDB 容器基本创建命令如下：

```bash
$ docker run -p 27017:27017 -v <LocalDirectoryPath>:/data/db --name docker_mongodb -d mongo
```

在上面的命令中，几个命令参数的详细解释如下：

- `-p`：映射容器服务的 27017 端口到宿主机的 27017 端口，mongodb 默认端口为 27017。容器外部可以通过宿主机 IP 27017 端口访问到容器内的 mongodb 服务
- `-v`：为设置容器的挂载目录，这里是将 `<LocalDirectoryPath>` 即本机中的目录挂载到容器中的 `/data/db`中，作为 mongodb 的存储目录（建议为 `/mongodb/data`）
- `--name`：为设置该容器的名称
- `-d`：设置容器以守护进程方式运行

其他：`--auth` 需要密码才能访问容器服务

进入 mongodb 服务的容器内运行 mongodb

```bash
# docker_mongodb 是装载 mongodb 服务容器名称
# mongo 是代表执行容器内的 mongo 命令，即进入 mongodb 命令行操作界面
$ docker exec -it docker_mongodb mongo
```

### 容器的数据迁移

```bash
# 停止原有的 docker_mongodb 容器
$ docker stop docker_mongodb

# 再创建一个 docker 容器，挂载原容器的数据目录
$ docker run -p 27017:27017 -v <LocalDirectoryPath>:/data/db --name docker_mongodb_migration -d mongo

# 查询当前 docker 容器状态
$ docker container ls -a

# 从输出结果可以看到，这时 docker_mongodb 的状态是 exited，表示已经退出
# 而新创建的 docker_mongodb_migration 的状态显示为 Up 表明数据库正在运行
```

### 设置登录权限问题

## 容器数据目录挂载

## 数据迁移

## 常用 Docker 命令

拉取镜像、运行容器

```bash
# 查看镜像
docker images

#
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4

#
docker ps -a

# 关闭
docker stop mongodb

# 再重启
docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4

#
docker ps

# 进入容器
docker exec -it mongodb mongo

show dbs

# this is a database name
use thepolyglotdeveloper

db.people.save({firstname: "Nic", lastname: "Raboy"})

db.people.find({})

db.people.save({firstname: "Maria", lastname: "Raboy"})

db.people.find({})

db.people.find({firstname: "Maria" })

exit

clear

docker stop mongodb

docker rm mongodb

# 查看 docker 容器状态
docker ps

# 查看数据库服务器日志
docker logs mongodb
```

Mongo Express 一个基于网络的 MongoDB 数据管理界面

```bash
docker pull mongo-express

# 运行
docker run --link mongodb:mongo -p 8081:8081 mongo-express
```

1. 数据库连接不成功？容器内部的服务无法被外部访问？

- 检查 Docker 宿主机器是否开启了防火墙，如果有请关闭防火墙。或者将宿主机器的端口加入到防火墙白名单。容器的端口没有关系，不需要做什么。
- Docker 运行容器时，千万不能忘记 `-p` 参数，这个参数决定了 Docker 容器内部的服务可以被外部访问
- 用 `docker container ls` 检查你的容器是否启动成功了，很多情况不要忘记了 `-d` 参数，这个参数可以让容器后台运行。

2. 几天后再使用 Docker，找不到此命令？容器也不在了？

很可能是你的宿主机器重启了，你需要重新启动 Docker 服务，这很简单，尝试：

```bash
service start docker

# 或者
systemctl start docker
```

同理既然你的 Docker 服务都重启了，那么你的容器也是需要被重启的，因为他们现在都处于 `stop` 状态，可以尝试：

```bash
# 查看所有的docker容器，包括运行中的、停止的。
$ docker container ls -a

# 输入你要启动的容器名称，它可以是一个名字也可以是一串字符串ID
$ docker start <your container name>
```

3. 如果你怎么都尝试不成功，可以试试 docker 重启大法，这不是开玩笑，非常有效！

```bash
systemctl stop docker

systemctl start docker
```

构建 MongoDB 容器

```bash
$ docker pull mongo:latest

$ docker run --name docker_mongodb -d -p 27017:27017 mongo:latest --auth
```

`--auth` 指令开启了 mongo 的连接身份校验 开启校验 是由于 node 跨容器连接时 不设置身份校验 开启服务端无法连接上 mongo 数据库

由于我们 mongo 开启了身份验证，所以我们要进入 mongo 容器配置一下 node 连接时使用的账号

```bash
$ docker exec -it docker_mongodb /bin/bash

$ mongo admin

$ db.createUser({user: "admin", pwd: "admin", roles: [{role: "dbAdmin", db: "admin"}]})

$ db.auth('admin', 'admin')
```

构建 node 容器并与 mongo 容器建立连接

在开始构建 node 容器前我们要先约定好 mongo 容器别名，端口号及账号密码

- mongo 容器别名：db
- mongo 端口号：27017
- 账号密码： `admin:admin`

我们先修改 node 服务端的配置

文件配置 dockerfile/api-mocker/server/config/config.default.js 修改 mongo 连接配置，db 为预先设定的 mock-mongo 容器的别名

```
mongoose: {
  url: 'mongodb://admin:admin@db:27017/api-mock?authSource=admin'
}
```

构建镜像

```dockerfile
  # 指定基础镜像
  FROM node:latest

  # 维护者
  MAINTAINER qiushiyuan1994@qq.com

  # 工作目录
  WORKDIR /www

  # 将本地文件添拷贝到容器中，不会解压
  COPY api-mocker node-server/api-mocker

  EXPOSE 7001

  WORKDIR /www/node-server/api-mocker/server

  RUN npm install

  WORKDIR /www/node-server/api-mocker

  # 构建容器后调用，在容器启动时才进行调用
  CMD ["make", "prod_server"]
```

使用编写好的 dockerfile 构建镜像

```bash
docker build -t="mock-server:1.0.0"
```

运行镜像

```bash
docker run -d -i -t -p 7001:7001 --name mock-server1 --link mock-mongo:db mock-server:1.0.0 /bin/bash
```

让我们再看看现在正在运行的容器

检测 node 容器和 mongo 容器的连接状态

```bash
docker exec -it mock-server /bin/bash

curl db
```

---

**参考资料：**

- [📝 Docker MongoDB 部署](https://www.jianshu.com/p/6fdb2bcb4b43)
- [📝 MongoDB 容器化](https://www.cnblogs.com/codelove/p/10312692.html)
- [📝 Docker 之安装和管理 MongoDB（含副本集相关）](https://www.cnblogs.com/cwp-bg/p/10403327.html)
