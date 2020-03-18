---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 1
title: 多容器部署
order: 10
---

# 多容器部署

Docker Compose（多容器部署）是一个工具，这个工具可以通过一个 YML 文件定义多容器的 Docker 应用。通过一条命令就可以根据 YML 文件的定义去创建或者管理多个容器。

## 模版文件

模版文件是使用 Compose 的核型，设计到的指令关键字较多。但是大部分指令与 `docker run` 相关参数的含义都是类似的。

默认的模版文件名称为 `docker-compose.yml`，格式为 YAML 格式。

```yml
version: '3'

services:
  webapp:
    image: examples/web
    ports:
      - '80:80'
    volumes:
      - '/data'
```

⚠️ 注意每个服务都必须通过 `image` 指令指定镜像或 `build` 指令（需要 Dockerfile）等来自动构建生成镜像。

如果使用 `build` 指令，在 Dockerfile 中设置的选项（例如：`CMD`、`EXPOSE`、`VOLUME` 和 `ENV` 等）将会自动被获取，无需在 `docker-compose.yml` 中重复设置。

下面罗列了常用的模版文件指令配置项，详细的配置项参考 [📖 Compose file reference for Version 3](https://docs.docker.com/compose/compose-file/)，或者 [Docker 实战手册：模版文件](https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html)。

### 顶层结构

顶层结构由 `version`、`services`、`networks` 和 `volumes` 等等标签构成。

**services**

- 一个 service 代表一个 container，这个 container 可以从 dockerHub 中的镜像来创建，也可以使用本地 dockerfile build 出来的镜像来创建
- service 的启动类似 docker run，可以给 service 指定 network 和 volume 的引用

### build

用于指定一个包含 Dockerfile 文件的路径。一般是当前目录 `.`。

```yml
build: ./dir

build:
  context: ./dir
  dockerfile: Dockerfile-alternate
  args:
    buildno: 1
  caceh_form:
    - alpine:latest
    - corp/web_app:3.14
```

- `context`：路径
- `dockerfile`：需要替换默认 `docker-compose` 的文件名
- `args`：为构建（build）过程的环境变量，用于替换 Dockerfile 里定义的 ARG 参数，容器中不可用
- `cache_from`：指定构建镜像的缓存

### image

指定为镜像名称或镜像 ID。如果镜像在本地不存在，Compose 将会尝试拉取这个镜像。

```yml
image: ubuntu
image: orchardup/postgresql
image: a4bc65fd
```

### depends_on

解决容器的依赖、启动先后问题。

🌰 **示例：**

以下例子会先启动 `redis` 和 `db` 再启动 `web`

```yml
version: '3'

services:
  web:
    build: .
    depends_on:
      - db
      - redis

  redis:
    image: redis

  db:
    image: postgres
```

> `web` 服务不会等待 `redis` 和 `db` 完全启动之后才启动

### env_file

从文件中获取环境变量，可以为单独的文件路径或列表。

如果通过 `docker-compose -f FILE` 方式来指定 Compose 模板文件，则 `env_file` 中变量的路径会基于模板文件路径。

如果有变量名称与 `environment` 指令冲突，则按照惯例，以后者为准。

```yml
env_file: .env

env_file:
  - ./common.env
  - ./apps/web.env
  - /opt/secrets.env
```

环境变量文件中每一行必须符合格式，支持 # 开头的注释行。

```yml
# common.env: Set development environment
PROG_ENV=development
```

### environment

设置环境变量。你可以使用**数组**或**字典**两种格式。

只给定名称的变量会自动获取运行 Compose 主机上对应变量的值，可以用来防止泄露不必要的数据。

```yml
environment:
  RACK_ENV: development
  SESSION_SECRET:

environment:
  - RACK_ENV=development
  - SESSION_SECRET
```

如果变量名称或者值中用到 `true|false`，`yes|no` 等表达 **布尔** 含义的词汇，最好放到引号里，避免 YAML 自动解析某些内容为对应的布尔语义。这些特定词汇，包括

```
y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF
```

### secrets

存储敏感数据，例如 mysql 服务密码。

```yml
version: '3.1'
services:

mysql:
  image: mysql
  environment:
    MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
  secrets:
    - db_root_password
    - my_other_secret

secrets:
  my_secret:
    file: ./my_secret.txt
  my_other_secret:
    external: true
```

### expose

暴露端口，但不映射到宿主机，只被连接的服务访问。

仅可以指定内部端口为参数

```yml
expose:
  - '3000'
  - '8000'
```

### ports

暴露端口信息。

使用 `宿主端口：容器端口` (`HOST:CONTAINER`) 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）都可以。

```yml
ports:
  - '3000'
  - '8000:8000'
  - '49100:22'
  - '127.0.0.1:8001:8001'
```

⚠️ **注意**：当使用 `HOST:CONTAINER` 格式来映射端口时，如果你使用的容器端口小于 60 并且没放到引号里，可能会得到错误结果，因为 YAML 会自动解析 `xx:yy` 这种数字格式为 60 进制。为避免出现这种问题，建议数字串都采用引号包括起来的字符串格式。

### network_mode

设置网络模式。使用和 `docker run` 的 `--network` 参数一样的值。

```yml
network_mode: "bridge"
network_mode: "host"
network_mode: "none"
network_mode: "service:[service name]"
network_mode: "container:[container name/id]"
```

### networks

配置容器连接的网络。相当于执行 `docker network create xxx`。

```yml
version: '3'
services:
  some-service:
    networks:
      - some-network
      - other-network

networks:
  some-network:
  other-network:
```

### volumes

数据卷所挂载路径设置。可以设置为宿主机路径（`HOST:CONTAINER`）或者数据卷名称（`VOLUME:CONTAINER`），并且可以设置访问模式 （`HOST:CONTAINER:ro`）。

相当于执行 `docker volume create xxx`。

该指令中路径支持相对路径。

```yml
volumes:
  - /var/lib/mysql
  - cache/:/tmp/cache
  - ~/configs:/etc/configs/:ro
```

如果路径为数据卷名称，必须在文件中配置数据卷。

```yml
version: '3'

services:
  my_src:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### labels

为容器添加 Docker 元数据（metadata）信息。例如可以为容器添加辅助说明信息。

```yml
labels:
  com.startupteam.description: 'webapp for a startup team'
  com.startupteam.department: 'devops department'
  com.startupteam.release: 'rc3 for v1.0'
```

### 其他指令

- `container_name`：指定容器名称，默认使用 `项目名称_服务名称_序号` 这样的格式
- `devices`：指定设备映射关系
- `dns`：自定义 DNS 服务器，可以是一个值，也可以是一个列表
- `dns_search`：配置 DNS 搜索域，可以是一个值，也可以是一个列表
- `logging`：配置日志选项
- `entrypoint`：指定服务容器启动后执行的入口文件
- `user`：指定容器中运行应用的用户名
- `working_dir`：指定容器中工作目录

## 操作指令

https://blog.51cto.com/9291927/2310444

docker-compose up 自动完成包括构建镜像、（重新）创建服务、启动服务，并关联服务相关容器的一系列操作
docker-compose build

### docker-compose up

```
docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
```

- `-d`：在后台运行服务容器
- `-no-color`：不使用颜色来区分不同的服务的控制输出
- `-no-deps`：不启动服务所链接的容器
- `-force-recreate`：强制重新创建容器，不能与 `–no-recreate` 同时使用
- `-no-recreate`：如果容器已经存在，则不重新创建，不能与 `–force-recreate` 同时使用
- `-no-build`：不自动构建缺失的服务镜像
- `-build`：在启动容器前构建服务镜像
- `-abort-on-container-exit`：停止所有容器，如果任何一个容器被停止，不能与 `-d` 同时使用
- `-t`、`-timeout TIME`：停止容器时候的超时（默认为 10 秒）
- `-remove-orphans`：删除服务中没有在 compose 文件中定义的容器
- `-scale SERVICE=NUM`：设置服务运行容器的个数，将覆盖在 compose 中通过 scale 指定的参数

### docker-compose build

实际项目中，不可能只单单依赖于一个服务，例如一个常见的 Web 项目可能依赖于: 静态文件服务器，应用服务器，Mysql 数据库等。我们可以通过分别启动单个镜像，并把镜像绑定到本地对应端口的形式进行部署，达到容器可通信的目的。但是为了更方便的管理多容器的情况，官方提供了 docker-compose 的方式。docker-compose 是 Docker 的一种编排服务，是一个用于在 Docker 上定义并运行复杂应用的工具，可以让用户在集群中部署分布式应用。

compose 中有两个重要的概念：

- 服务（service）：一个应用的容器，实际上可以包括若干运行相同镜像的容器示例
- 项目（project）：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义

一个项目可以由多个服务（容器）关联而成，compose 面向项目进行管理，通过自命令对项目中的一组容器进行便捷的生命周期管理。

常用命令

https://cloud.tencent.com/developer/article/1494959

---

**参考资料：**

- [📖 Compose file reference for Version 3](https://docs.docker.com/compose/compose-file/)
- [📝 Docker Compose 编排指南 v3.7（内容比较详实）](https://juejin.im/post/5d76e977e51d4557dc774f1c)
- [📝 Docker 实战手册：模版文件](https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html)


