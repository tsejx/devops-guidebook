---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 2
title: 配置脚本
order: 3
---

# 配置脚本

Dockerfile 是由一系列命令和参数构成的脚本，一个 Dockerfile 里面包含了构建整个 Image 的完整命令。Docker 通过 `docker build` 执行 Dockerfile 中的一系列命令自动构建 Image。

一般地，Dockerfile 分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令。

| 部分               | 指令                      |
| :----------------- | :------------------------ |
| 基础镜像信息       | FROM                      |
| 维护者信息         | MAINTAINER                |
| 镜像操作指令       | RUN、COPY、ADD、EXPOSE 等 |
| 容器启动时执行指令 | CMD、ENTRYPOINT           |

[Dockerfile 最佳实践](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## 使用方法

`docker build` 命令从 Dockerfile 和 `context` 构建镜像（Image）。`context` 是 `PATH` 或 `URL` 处的文件。`PATH` 本地文件目录。`URL` 是 Git Repository 的位置。

`context` 以递归方式处理。因此，`PATH` 包括任何子目录，`URL` 包括 repository 及 submodules。

一个使用当前目录作为 `context` 的简单构建命令：

```bash
$ docker build .
Sending build context to Docker daemon 6.51.MB
...
```

构建 Docker 守护程序运行，而不是由 CLI 运行。构建过程所做的第一件事是将整个 `context`（递归地）发送给守护进程。大多数情况下，最好是将 Dockerfile 和所需文件复制到一个空的目录，再到这个目录进行构建。

> ⚠️ 注意：不要使用根目录 `/` 作为 `PATH`，因为它会导致构建将硬盘驱动器的所有内容传输到 Docker 守护程序。

`build` 时添加文件，通过 Dockerfile 引用指令中指定的文件，例如 `COPY` 指令。要增加构建的性能，请通过将 `.dockerignore` 文件添加到 `context` 目录中排除文件和目录。（有关如何创建 [.dockerignore](https://deepzz.com/post/dockerfile-reference.html#toc_6) 文件的信息）

一般的，Dockerfile 位于 `context` 的根中。但使用 `-f` 标志可指定 Dockerfile 的位置。

```bash
$ docker build -f /path/to/Dockerfile
```

如果 build 成功，您可以指定要保存新 Image 的 Repository 和 Tag：

```bash
$ docker build -t tsejx/devops .
```

要在构建后将 Image 标记为多个 Repositories，请在运行构建命令时添加多个 `-t` 参数：

```bash
$ docker build -t tsejx/myapp:1.0.2 -t tsejx/myapp:latest .
```

Docker 守护程序一个接一个地运行 Dockerfile 中的指令，如果需要，将每个指令的结果提交到一个新的 Image，最后输出新映像的 ID。Docker 守护进程将自动清理您发送的 `context`。

请注意，每个指令独立运行，并导致创建一个新的 Image，因此 `RUN cd / tmp` 对下一个指令不会有任何映像。

只要有可能，Docker 将重新使用中间 Images（缓存），以显著加速 `docker build` 过程。这由控制台输出中的使用缓存消息指示。

构建完成后，就可以准备推送至项目仓库。

## 环境变量

环境变量（使用 `ENV` 语句声明）也可以在某些指令中用作要由 Dockerfile 解释的变量。还可以处理转义，以将类似变量包含在语句中。

环境变量在 Dockefile 中用 `$variable_name` 或 `${variable_name}` 表示。它们被等同对待，并且括号语法通常用于解决不带空格的变量名的问题，例如 `${foo}_bar`。

`${variable_name}` 语法还支持以下指定的一些标准 `bash` 修饰符：

- `${variable:-word}` 表示如果设置了 `variable`，则结果将是该值。如果 `variable` 未设置，那么 `word` 将是结果。
- `${variable:+word}` 表示如果设置了 `variable`，那么 `word` 将是结果，否则结果是空字符串

在所有情况下，`word` 可以是任何字符串，包括额外的环境变量。

可以通过在变量之前添加 `\` 来转义：`\$foo` 或 `\${foo}`，分别转换为 `$foo` 和 `${foo}`。

🌰 **示例**

```dockerfile
FROM busybox
ENV foo /bar
WORKDIR ${foo}    # WORKDIR /bar
ADD . $foo        # ADD . /bar
COPY \$foo /quux  # COPY $foo /quux
```

Dockerfile 中的以下指令列表支持环境变量：

- ADD
- COPY
- ENV
- EXPOSE
- LABEL
- USER
- WORKDIR
- VOLUME
- STOPSIGNAL

## FROM

```dockerfile
FROM <image>
# 或则
FROM <image>:<tag>
# 或则
FROM <image>@<digest>
```

FROM：FROM 是构建镜像的基础源镜像（Base Image）。因此，有效的 Dockerfile 必须具有 FROM 作为其第一条指令。

- `FROM` 必须是 Dockerfile 中的第一个非注释指令。
- `FROM` 可以在单个 Dockerfile 中多次出现，以创建多个图像。只需记下在每个新的 `FROM` 命令之前由提交输出的最后一个 Image ID
- `tag` 或 `digest` 是可选的。如果省略其中任何一个，构建器将默认使用 `latest`。如果构建器与 `tag` 值不匹配，则构建器将返回错误。

详细说明：Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令！ 它引入一个镜像作为我们要构建镜像的基础层，就好像我们首先要安装好操作系统，才可以在操作系统上面安装软件一样。

## MAINTAINER

```dockerfile
MAINTAINER <name>
```

`MAINTAINER` 指令允许您设置生成的 Images 的作者字段

## WORKDIR

`WORKDIR` 指令为 Dockerfile 中的任何 `RUN`、`CMD`、`ENTRYPOINT`、`COPY` 和 `ADD` 指令设置工作目录。

```dockerfile
WORKDIR /path/to/workdir
```

如果 `WORKDIR` 不存在，它将会被创建，即使它没有任何后续的 Dockerfile 指令中使用。

它可以在一个 Dockerfile 中多次使用，如果提供了相对路径，它将相对于先前 `WORKDIR` 指令的路径。

🌰 **示例**

```dockerfile
WORKDIR /foo
WORKDIR bar
WORKDIR baz
RUN pwd
```

在这个 Dockerfile 中的最终 `pwd` 命令的输出是 `/foo/bar/baz`。

`WORKDIR` 指令可以解析先前使用 `ENV` 设置的环境变量。您只能使用 Dockerfile 中显式设置的环境变量。

🌰 **示例**

```dockerfile
ENV DIRPATH /path
WORKDIR $DIRPATH/$DIRNAME
RUN pwd
```

`pwd` 命令在该 Dockerfile 中输出的最后结果是 `/path/$DIRNAME`。

## ENV

```dockerfile
ENV <key> <value>

ENV <key>=<value> ...
```

ENV 指令将环境变量 `<key>` 设置为值 `<value>`。

ENV 指令有两种形式。

- 第一种形式，`ENV <key> <value>`，将单个变量设置为一个值。第一个空格后面的整个字符串将被视为 `<value>` - 包括空格和引号等字符。
- 第二种形式，`ENV <key>=<value> ...`，允许一次设置多个变量。

注意，第二种形式在语法中使用等号 `=`，而第一种形式不使用。与命令行解析类似，引号和反斜杠可用于在值内包含空格。

更多示例：

```dockerfile
FROM node
ENV API_URL=google.com \
    NODE_ENV=production
    COMMAND=dev
RUN yarn
CMD yarn ${COMMAND}
```

启动时运行 `docker run --rm -e COMMAND=start -e API_URL=development node`

或者要执行的命令复杂的话，可以用 shell script 包在 image 里面，再依照 `NODE_ENV` 写入需要的环境变量。

## ARG

```dockerfile
ARG <name>[=<default value>]
```

`ARG` 指令定义一个变量，用户可以使用 `docker build` 命令使用 `--build-arg <varname>=<value>` 标志，在构建时将其传递给构建器。如果用户指定了一个未在 Dockerfile 中定义的构建参数，构建将输出错误。

Dockerfile 作者可以通过指定 `ARG` 一个或多个变量，通过多次指定 `ARG` 来定义单个变量。例如，一个有效的 Dockerfile：

```dockerfile
FROM myapp
ARG foo
ARG bar
```

也可以可选地指定 `ARG` 指令的默认值：

```dockerfile
FROm myapp
ARG foo=xyz
ARG bar=123
```

如果 `ARG` 值具有缺省值，并且如果在构建时没有传递值，则构建器使用缺省值。

🌰 **示例**

可以使用 `ARG` 或 `ENV` 指令来指定 `RUN` 指令可用的变量。使用 `ENV` 指令定义的环境变量总是覆盖同名的 `ARG` 指令。思考这个 Dockerfile 带有 `ENV` 和 `ARG` 指令。

```dockerfile
FROM ubuntu
ARG CONT_IMG_VER
ENV CONT_IMG_VER v1.0.0
RUN echo $CONT_IMG_VER
```

构建命令：

```bash
$ docker build --build-arg CONT_IMG_VER=v2.0.1 Dockerfile
```

在这种情况下，`RUN` 指令使用 v1.0.0 而不是用户传递的 `ARG` 设置：`v2.0.1` 此行为类似于 shell 脚本，其中本地作用域变量覆盖作为参数传递或从环境继承的变量，从其定义点。

🌰 **示例**

使用上述示例，但使用不同的 `ENV` 规范，您可以在 `ARG` 和 `ENV` 指令之间创建更有用的交互：

```dockerfile
FROM ubuntu
ARG CONT_IMG_VER
ENV CONT_IMG_VER ${CONT_IMG_VER:-v1.0.0}
RUN echo $CONT_IMG_VER
```

与 `ARG` 指令不同，`ENV` 值始终保留在 Image 中。考虑一个没有 `-build-arg` 标志的 docker 构建：

```bash
$ docker build Dockerfile
```

使用这个 Dockerfile 示例，`CONT_IMG_VER` 仍然保留在映像中，但它的值将是 `v1.0.0`，因为它是 `ENV` 指令在第 3 行中的默认设置。

[环境变量替代](https://docs.docker.com/engine/reference/builder/#environment-replacement)

`ARG` 变量不会持久化到构建的 Image 中，而 `ENV` 变量则会。但是，`ARG` 变量会以类似的方式影响构建缓存。如果一个 Dockerfile 定义一个 `ARG` 变量，它的值不同于以前的版本，那么在它的第一次使用时会出现一个 `“cache miss”`，而不是它的定义。特别地，在 `ARG` 指令之后的所有 RUN 指令都隐式地使用 `ARG` 变量（作为环境变量），因此可能导致高速缓存未命中。

## RUN

RUN：后面跟的是在容器中要执行的命令。有两种形式：

- `RUN <command>` shell 形式，命令在 Shell 中运行，Linux 上为 `/bin/sh/ -c`，Windows 上为 `cmd /S/C`
- `RUN ["executable", "param1", "param2"]` exec 形式

⚠️ **注意**：每一个 `RUN` 指令都会新建立一层，在其上执行这些命令，当运行多个指令时，会产生一些非常臃肿、非常多层的镜像，不仅仅增加了构建部署的时间，也很容易出错因此，在很多情况下，我们可以合并指令并运行，例如 `RUN apt-get update && apt-get install -y libgdiplus`。在命令过多时，一定要注意格式，比如换行、缩进、注释等，会让维护、排障更为容易。除此之外，`Union FS` 是有最大层数限制的，不能超过 `127` 层，而且我们应该把每一层中我用文件清除，比如一些没用的依赖，来防止镜像臃肿。

## ADD

```dockerfile
ADD <src> <dest>

# 对于包含空格的路径，此形式是必需的
ADD ["<src>", ..., "<dest>"]
```

ADD 指令与 COPY 指令非常类似，但它包含更多功能。除了将文件从主机复制到容器映像，ADD 指令还可以使用 URL 规范从远程位置复制文件。

```bash
ADD https://www.python.org/ftp/python/3.5.1/python-3.5.1.exe /temp/python-3.5.1.exe
```

`ADD` 遵守以下规则：

- `<src>` 路径必须在构建的上下文中;你不能 `ADD ../something /something`，因为 Docker 构建的第一步是发送上下文目录（和子目录）到 Docker 守护进程。如果 `<src>` 是 `URL` 并且 `<dest>` 不以尾部斜杠结尾，则从 `URL` 下载文件并将其复制到 `<dest>`。如果 `<src>` 是 `URL` 并且 `<dest>` 以尾部斜杠结尾，则从 `URL` 中推断文件名，并将文件下载到 `<dest>/<filename>`。例如，`ADD http://example.com/foobar /` 会创建文件 `/ foobar`。网址必须有一个非平凡的路径，以便在这种情况下可以发现一个适当的文件名（`http://example.com` 不会工作）。如果 `<src>` 是目录，则复制目录的整个内容，包括文件系统元数据。

## COPY

拷贝文件至容器的工作目录下，`.dockerignore` 指定的文件不会拷贝。

```dockerfile
COPY <src> .. <dest>

COPY ["<src>", ..., "<dest>"]
```

与 ADD 类似，不过 `COPY` 的 `<src>` 不能为 URL。

如果源或目标包含空格，请将路径括在方括号和双引号中。

## EXPOSE

```dockerfile
EXPOSE <port> [<port>...]
```

`EXPOSE` 指令通知 Docker 容器在运行时侦听指定的网络端口。`EXPOSE` 不使主机的容器的端口可访问。为此，必须使用 `-p` 标志发布一系列端口，或者使用 `-P` 标志发布所有暴露的端口。您可以公开一个端口号，并用另一个端口号在外部发布。

要在主机系统上设置端口重定向，请参阅 [使用 `-P` 标志](https://docs.docker.com/engine/reference/run/#expose-incoming-ports)。Docker 网络功能支持创建网络，无需在网络中公开端口，有关详细信息，请参阅 [网络通信功能的概述](https://docs.docker.com/engine/userguide/networking/)。

## ENTRYPOINT

`ENTRYPOINT` 允许您配置容器，运行执行的可执行文件。

```dockerfile
# 使用 exec 执行
ENTRYPOINT ["executable", "param1", "param2"]

# 使用 shell 执行
ENTRYPOINT command param1 param2
```

每个 Dockerfile 中只能有一个 ENTRYPOINT，当指定多个时，只有最后一个起效。

例如，以下将使用其默认内容启动 Nginx，侦听端口 80：

```bash
$ docker run -it --rm -p 80:80 nginx
```

## CMD

`CMD` 指令有三种形式：

```dockerfile
# 使用 exec 执行，推荐方式
# 这类格式在解析时会被解析为 JSON 数组，因此一定要使用双引号
CMD ["executable", "param1", "param2"]

# 在 /bin/sh 中执行，提供给需要交互的应用
# 实际命令会被包装为 sh -c 的参数形式进行执行
CMD command param1 param2

# 提供给 ENTRYPOINT 的默认参数
CMD ["param1", "param2"]
```

示例：

```dockerfile
# shell
CMD echo $HOME

# 转化为 exec 即
CMD ["sh", "-c", "echo $HOME"]
```

指定启动容器时执行命令，每个 Dockerfile 只能有一个 `CMD` 指令。如果指定了多条命令，则只有最后一条会被执行。

如果用户启动容器时候指定了运行的命令，则会覆盖掉 CMD 指定的命令。

CMD 后面的命令是容器每次启动执行的命令，多个命令之间可以使用 `&&` 链接，例如 `CMD git pull && npm start`。

容器中的应用都应该以前台执行，而不是启动后台服务，容器内没有后台服务的概念。 对于容器而言，其启动程序就是容器应用进程，容器就是为了主进程而存在的，主进程退出，容器就失去了存在的意义。 比如 `CMD service nginx start` 它等同于 `CMD [ "bash", "-c", "service nginx start"]` 主进程实际上是 `bash`，`bash` 也就结束了，`bash` 作为主进程退出了。

### 传递参数

#### 固定参数

Dockerfile 如下：

```dockerfile
FROM python:2.7-slim

COPY startup.sh /opt

RUN chmod +x /opt/startup.sh

ARG envType=xxx
ENV envType ${envType}

CMD ["/opt/startup.sh", "foo"]
```

构建并启动：

```bash
# docker build
docker build -t yellow:1.0 --build-arg envType=dev .

# docker run
docker run -it --rm=true yellow:1.0
```

#### 动态参数

[Docker Documentation：CMD](https://docs.docker.com/engine/reference/builder/#cmd)

- `exec` 形式的 `CMD`，是 docker 来运行命令，是不支持参数替换的
- `shell` 形式的 `CMD`，是 docker 来运行 `sh`，`sh` 再运行我们写的命令，而 `sh` 是支持参数替换的

Dockerfile 最后一行：

```dockerfile
CMD /opt/startup.sh ${envType}
```

构建并启动：

```bash
# docker build
docker build -t yellow:4.0 --build-arg envType=dev .

# docker run
docker run -ti --rm=true yellow:4.0
```

### 与 ENTRYPOINT 对比

共同点：

1. 都可以指定 Shell 或 exec 函数调用的方式执行命令
2. 当存在多个 `CMD` 指令或 `ENTRYPOINT` 指令时，只有最后一个生效

差异：

1. `CMD` 指令指定的容器启动时命令可以被 `docker run` 指定的命令覆盖，而 `ENTRYPOINT` 指令指定的命令不能被覆盖，而是将 `docker run` 指定的参数当做 `ENTRYPOINT` 指定命令的参数

2. `CMD` 指令可以为 `ENTRYPOINT` 指令设置默认参数，而且可以被 `docker run` 指定的参数覆盖

总结：

- 如果 ENTRYPOINT 使用了 shell 模式，CMD 指令会被忽略
- 如果 ENTRYPOINT 使用了 exec 模式，CMD 指定的内容被追加为 ENTRYPOINT 指定命令的参数
- 如果 ENTRYPOINT 使用了 exec 模式，CMD 也应该使用 exec 模式

`exec` 模式是建议的使用模式，因为当运行任务的进程作为容器中的 1 号进程时，我们可以通过 docker 的 stop 命令优雅地结束容器。

### EXEC 模式的缺陷

⚠️ **注意：** `exec` 模式不能使用环境变量。因为 `exec` 模式的特点是不会通过 shell 执行相关的命令。

🌰 **示例：Shell 模式**

```bash
$ cat Dockerfile
FROM oraclelinux

ADD ./docker-entry.sh   /docker-entry.sh

ENV VAR Hello

ENTRYPOINT  "/docker-entry.sh" "${VAR}"

$ docker run --rm testimage
Entry of ENTRYPOINT, ARGS[#]=1
ENTRYPOINT ARGS[0]=[/docker-entry.sh]
ENTRYPOINT ARGS[1]=[Hello]
$@=[Hello]
```

🌰 **示例：EXEC 模式**

```bash
$ cat Dockerfile
FROM oraclelinux

ADD ./docker-entry.sh   /docker-entry.sh

ENV VAR Hello

ENTRYPOINT  [ "/docker-entry.sh", "${VAR}" ]

$ docker run --rm testimage
Entry of ENTRYPOINT, ARGS[#]=1
ENTRYPOINT ARGS[0]=[/docker-entry.sh]
ENTRYPOINT ARGS[1]=[${VAR}]
$@=[${VAR}]
```

这个环境变量 `$VAR` 没有被替换掉，而是源文本的方式穿下去了。

解决这个问题的办法使用 `"bash -c"` 来调用 ENTRYPOINT 指令：

🌰 **示例：EXEC 模式**

```bash
$ cat Dockerfile
FROM oraclelinux

ADD ./docker-entry.sh   /docker-entry.sh

ENV VAR Hello

ENTRYPOINT  [ "/bin/bash", "-c", "/docker-entry.sh ${VAR}" ]

$ docker run --rm testimage
Entry of ENTRYPOINT, ARGS[#]=1
ENTRYPOINT ARGS[0]=[/docker-entry.sh]
ENTRYPOINT ARGS[1]=[Hello]
$@=[Hello]
```

## VOLUME

`VOLUME` 指令创建具有指定名称的挂载点，并将其标记为从本机主机或其他容器保留外部挂载的卷。该值可以是 JSON 数组 `VOLUME ["/var/log"]` 或具有多个参数的纯字符串，例如 `VOLUME /var/log` 或 `VOLUME /var/log /var/db`。

## USER

`USER` 指令设置运行 Image 时使用的用户名或 UID，以及 Dockerfile 中的任何 `RUN`、`CMD` 和 `ENTRYPOINT` 指令。

## LABEL

```dockerfile
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```

`LABEL` 指令向 Image 添加元数据。`LABEL` 是键值对。要在 `LABEL` 值中包含空格，请使用引号和反斜杠，就像在命令行解析中一样：

```dockerfile
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

Image 可以有多个 Label。要指定多个 Label，Docker 建议在可能的情况下将标签合并到单个 `LABEL` 指令中。每个 `LABEL` 指令产生一个新层，如果使用许多标签，可能会导致效率低下的图像。该示例产生单个图像层。

```dockerfile
LABEL multi.label1="value1" multi.label2="value2" other="value3"
```

标签是添加的，包括 `LABEL` 在 `FROM images` 中。如果 Docker 遇到已经存在的 `label/key`，则新值将覆盖具有相同键的任何先前标签。

要查看 Image 的 labels，请使用 `docker inspect` 命令。

---

**参考资料：**

- [📝 Dockerfile 和 Docker Compose file 参考文档](https://juejin.im/post/5d9c0224f265da5b76373451)
- [📝 如何编写最佳的 Dockerfile](https://juejin.im/post/5922e07cda2f60005d602dcd)
- [📝 Dockerfile 最佳实践指南：构建缓存部分](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#build-cache)
- [📝 Dockerfile 中的 CMD 与 ENTRYPOINT](https://www.cnblogs.com/sparkdev/p/8461576.html)
