---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
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

### image

指定为镜像名称或镜像 ID。如果镜像在本地不存在，Compose 将会尝试拉取这个镜像。

```yml
image: ubuntu
image: orchardup/postgresql
image: a4bc65fd
```

### build

基于 Dockerfile，指定 Dockerfile 所在路径，Compose 会利用它自动构建镜像，然后启动服务容器。

```yml
# 绝对路径
build: /path/build

# 相对路径
build: ./dir

# 设定上下文和目录，以此目录指定 Dockerfile
build:
  context: ../
  dockerfile: path/dockerfile

# 给 Dockerfile 构建的镜像命名
build: ./dir
images: nginx:latest

# 构建过程中指定环境变量，构建成功后取消
# 与 EVN 不同 ARG 允许空值
build:
  context: ./dir
  dockerfile: Dockerfile-alternate
  args:
    buildno: 1
    password: secret
  caceh_form:
    - alpine:latest
    - corp/web_app:3.14
```

- `context`：路径
- `dockerfile`：需要替换默认 `docker-compose` 的文件名
- `args`：为构建（build）过程的环境变量，用于替换 Dockerfile 里定义的 ARG 参数，容器中不可用
- `cache_from`：指定构建镜像的缓存

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

> ⚠️ **注意：** `web` 服务不会等待 数据库（例如 `redis` 和 `db`）完全启动之后才启动，也就是 `depends_on` 只是决定开启顺序，容器内数据库是否已经初始化启动完毕后 Web 服务才能连接上，这里是很坑的一个地方。

**解决方法**

可能官方也知道这里很坑，官方文档中给出了解决方案（[startup-order](https://docs.docker.com/compose/startup-order/)）。

### env_file

从文件中获取环境变量，可以为单独的文件路径或列表。

如果通过 `docker-compose -f FILE` 方式来指定 Compose 模板文件，则 `env_file` 中变量的路径会基于模板文件路径。

如果有变量名称与 `environment` 指令冲突，则按照惯例，以后者为准。

```yml
# 若与 environment 指令冲突，以后者为准
env_file: .env

# 可设置多个
# 此变量不对 build 构建过程生效
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

启动后的容器会包含这些变量设置。

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
  # 只指定一个路径，Docker 会自动在创建一个数据卷（这个路径是容器内部的）
  - /var/lib/mysql

  # 使用绝对路径挂在数据卷
  - /opt/data:/var/lib/mysql

  # 以 Compose 配置文件为中心的相对路径作为数据卷挂载到容器。
  - ./cache:/tmp/cache

  # 使用用户的相对路径（~/ 表示目录是 /home/<用户目录>/ 或者 /root/）
  - ~/configs:/etc/configs/:ro

  # 已经存在的命令的数据卷
  - datavolume:/var/lib/mysql
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

### command

覆盖容器启动后默认执行的命令

```yml
command: bundle exec thin -p 3000

# 或 写成 exec 形式
command: [bundle exec thin -p, 3000]
```

### 其他指令

```yml
# 指定容器名称，默认使用 `项目名称_服务名称_序号` 这样的格式
container_name: docker-container

# 指定设备映射关系
devices:
  - "/dev/ttyUSB0:/dev/ttyUSB0"

# 自定义 DNS 服务器，可以是一个值，也可以是一个列表
dns: 8.8.8.8
dns:
  - 8.8.8.8
  - 9.9.9.9

# 配置 DNS 搜索域，可以是一个值，也可以是一个列表
dns_search: example.com
dns_search:
  - dc1.example.com
  - dc2.example.com

# 配置日志选项
logging:
  driver: "syslog"
  options:
    syslog-address: "tcp://192.168.0.42:123"

# 指定服务容器启动后执行的入口文件
entrypoint: /code/entrypoint.sh

# 指定容器中运行应用的用户名
user: postgresql

# 指定容器中工作目录
working_dir: /code

# 挂在临时目录到容器内部，与 run 参数效果一致
tmpfs: /run
tmpfs:
  - /run
  - /tmp

# 连接到其他服务器中的容器
links:
  - db
  - db:mysql
  - redis
```

## 命令行指令

docker-compose up 自动完成包括构建镜像、（重新）创建服务、启动服务，并关联服务相关容器的一系列操作
docker-compose build

```bash
# -f  指定使用的 Compose 模板文件，默认为 docker-compose.yml，可以多次指定。
docker-compose -f docker-compose.yml up -d

# 启动所有容器，-d 将会在后台启动并运行所有的容器
docker-compose up -d

# 查看服务容器的输出
docker-compose logs

# 列出项目中目前的所有容器
docker-compose ps

# 构建（重新构建）项目中的服务容器
# 服务容器一旦构建后，将会带上一个标记名，例如对于 web 项目中的一个 db 容器，可能是 web_db
# 可以随时在项目目录下运行 docker-compose build 来重新构建服务
docker-compose build

# 拉取服务依赖的镜像
docker-compose pull

# 重启项目中的服务
# 如果对 docker-compose.yml 配置进行更改，则运行此命令后不会反映这些更改
docker-compose restart

# 删除所有（停止状态的）服务容器
# 推荐先执行 docker-compose stop 命令来停止容器
# 默认情况下，不删除附加到容器的匿名卷
# 任何不在卷中的数据都将丢失
docker-compose rm

# 在指定服务上执行一个命令。
docker-compose run ubuntu ping docker.com

# 设置指定服务运行的容器个数
# 通过 service=num 的参数来设置数量
docker-compose scale web=3 db=2

# 启动已经存在的服务容器。
docker-compose start

# 停止已经处于运行状态的容器，但不删除它
# 通过 docker-compose start 可以再次启动这些容器。
docker-compose stop
```

### up

```bash
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

当 `docker-compose up` 命令汇总每个容器的输出（本质上是 `docker-compose logs -f`）。当命令退出时，所有容器都将停止。运行 `docker-compose up -d` 将在后台启动容器并使它们继续运行。

### build

实际项目中，不可能只单单依赖于一个服务，例如一个常见的 Web 项目可能依赖于: 静态文件服务器，应用服务器，Mysql 数据库等。我们可以通过分别启动单个镜像，并把镜像绑定到本地对应端口的形式进行部署，达到容器可通信的目的。但是为了更方便的管理多容器的情况，官方提供了 docker-compose 的方式。docker-compose 是 Docker 的一种编排服务，是一个用于在 Docker 上定义并运行复杂应用的工具，可以让用户在集群中部署分布式应用。

compose 中有两个重要的概念：

- 服务（service）：一个应用的容器，实际上可以包括若干运行相同镜像的容器示例
- 项目（project）：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义

一个项目可以由多个服务（容器）关联而成，compose 面向项目进行管理，通过自命令对项目中的一组容器进行便捷的生命周期管理。

```bash
docker-compose build [options] [--build-arg key=val...] [SERVICE]
```

选项包括：

- `--compress`：通过 gzip 压缩构建上下环境
- `--force-rm`：删除构建过程中的临时容器
- `--no-cache`：构建镜像过程中不使用缓存
- `--pull`：始终尝试通过拉取操作来获取更新版本的镜像
- `-m, --memory`： MEM 为构建的容器设置内存大小
- `--build-arg key=val`：为服务设置 build-time 变量
- `--parallel`：并行构建映像

### exec

```bash
docker-compose exec [options] SERVICE COMMAND [ARGS...]
```

等同于 `docker exec`，使用此子命令，可以在服务中运行任意命令。默认情况下，命令是分配给 TTY 的，因此您可以使用命令 `docker-compose exec web sh` 来获得交互式提示。

- `-d`：分离模式，后台运行命令
- `--privileged`：获取特权
- `-u`：指定运行的用户
- `-T`：禁用分配 TTY
- `--index=index`：当一个服务拥有多个容器时，可通过该参数登陆到该服务下的任何服务，例如： `docker-compose exec –index=1 web /bin/bash`，Web 服务中包含多个容器
- `-e, --env KEY=VAL`：设置环境变量
- `-w, --workdir`：指向此命令的 workdir 目录的路径

## 环境变量

在 compose file 中引用环境变量

参考：[Docker Compose 引用环境变量](https://www.cnblogs.com/sparkdev/p/9826520.html)

```yml
version: '3'

services:
  web:
    image: ${IMAGETAG}
    ports:
      - '5000:5000'
  redis:
    image: 'redis:alpine'
```

通过环境变量 `${IMAGETAG}` 指定了 web 的镜像，下面通过 `export` 的方式来 compose 配置文件中的环境变量传值：

⚠️ 注意：如果对应的环境变量没有被设置，那么 compose 就会把它替换为一个空字符串

这种情况，可以为变量设置默认值：

```yml
version: '3'

services:
  web:
    image: ${IMAGETAG: -defaultwebimage}
    ports:
      - "5000:5000"
  redis:
    image: "redis:alpine"
```

`defaultwebimage` 是默认值。

### 把环境变量传递给容器

compose file 中为容器设置环境变量：

```yml
web:
  environment:
    DEBUG: 1
```

compose file 中的 environment 节点用来为容器设置环境变量，上面的写法等同于：

```bash
$ docker run -e DEBUG=1
```

要把当前 shell 环境变量的值传递给容器的环境变量也很简单，去掉上面代码中的赋值部分即可：

```yml
web:
  environment:
    DEBUG:
```

尝试导出环境变量 `DEBUG` 的情况：

```bash
$ export DEBUG=1
```

### 环境变量文件

当我们在 `docker-compose.yml` 文件中引用了大量的环境变量时，对每个环境变量都设置默认值将是繁琐的，并且也会影响 `docker-compose.yml` 简洁程度。此时我们可以通过 .`env` 文件来为 `docker-compose.yml` 文件引用的所有环境变量设置默认值。

修改 `docker-compose.yml` 文件的内容如下：

```yml
version: '3'
services:
  web:
    image: ${IMAGETAG}
    environment:
      APPNAME:
      AUTHOR:
      VERSION:
    ports:
      - '5000:5000'
  redis:
    image: 'redis:alpine'
```

然后在相同的目录下创建 `.env` 文件，编辑其内容如下：

```
# define env var default value.
IMAGETAG=defaultwebimage
APPNAME=default app name
AUTHOR=default author name
VERSION=default version is 1.0
```

### 配置不同场景下的环境变量

从前面的部分中我们可以看到，docker compose 提供了足够的灵活性来让我们设置 docker-compose.yml 文件中引用的环境变量，它们的优先级如下：

1. Compose file
2. Shell environment variables
3. Environment file
4. Dockerfile
5. Variable is not defined

- 首先，在 docker-compose.yml 文件中直接设置的值优先级是最高的。
- 然后是在当前 shell 中 export 的环境变量值。
- 接下来是在环境变量文件中定义的值。
- 再接下来是在 Dockerfile 中定义的值。
- 最后还没有找到相关的环境变量就认为该环境变量没有被定义。

根据上面的优先级定义，我们可以把不同场景下的环境变量定义在不同的 shell 脚本中并导出，然后在执行 `docker-compose` 命令前先执行 `source` 命令把 shell 脚本中定义的环境变量导出到当前的 shell 中。通过这样的方式可以减少维护环境变量的地方，下面的例子中我们分别在 `docker-compose.yml` 文件所在的目录创建 `test.sh` 和 `prod.sh`。

`test.sh` 的内容如下：

```bash
#!/bin/bash
# define env var default value.
export IMAGETAG=web:v1
export APPNAME=HelloWorld
export AUTHOR=Nick Li
export VERSION=1.0
```

`prod.sh` 的内容如下：

```bash
#!/bin/bash
# define env var default value.
export IMAGETAG=webpord:v1
export APPNAME=HelloWorldProd
export AUTHOR=Nick Li
export VERSION=1.0LTS
```

在测试环境下，执行下面的命令：

```bash
$ source test.sh

$ docker-compose config
```

此时 docker-compose.yml 中的环境变量应用的都是生产环境相关的设置。

---

**参考资料：**

- [📖 Compose file reference for Version 3](https://docs.docker.com/compose/compose-file/)
- [📝 Docker Compose 编排指南 v3.7（内容比较详实）](https://juejin.im/post/5d76e977e51d4557dc774f1c)
- [📝 Docker 实战手册：模版文件](https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html)
