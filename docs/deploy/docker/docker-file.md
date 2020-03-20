---
nav:
  title: 部署
  order: 4
group:
  title: Docker
  order: 1
title: 配置脚本
order: 3
---

# 配置脚本

Dockerfile 是由一系列命令和参数构成的脚本，一个 Dockerfile 里面包含了构建整个 Image 的完整命令。Docker 通过 `docker build` 执行 Dockerfile 中的一系列命令自动构建 Image。

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

## RUN

RUN：后面跟的是在容器中要执行的命令。有两种形式：

- `RUN <command>` shell 形式，命令在 Shell 中运行，Linux 上为 `/bin/sh/ -c`，Windows 上为 `cmd /S/C`
- `RUN ["executable", "param1", "param2"]` exec 形式

详细说明：每一个 `RUN` 指令都会新建立一层，在其上执行这些命令，我们频繁使用 `RUN` 指令会创建大量镜像层，然而 `Union FS` 是有最大层数限制的，不能超过 `127` 层，而且我们应该把每一层中我用文件清除，比如一些没用的依赖，来防止镜像臃肿。

## CMD

`CMD` 指令有三种形式：

```dockerfile
# exec form
CMD ["executable", "param1", "param2"]

# shell form
CMD command param1 param2

# as default parameters to ENTRYPOINT
CMD ["param1", "param2"]
```

在 Dockerfile 中只能有一个 `CMD` 指令。如果您列出多个 `CMD`，则只有最后一个 `CMD` 将生效。

CMD 后面的命令是容器每次启动执行的命令，多个命令之间可以使用 && 链接，例如 CMD git pull && npm start。

容器中的应用都应该以前台执行，而不是启动后台服务，容器内没有后台服务的概念。 对于容器而言，其启动程序就是容器应用进程，容器就是为了主进程而存在的，主进程退出，容器就失去了存在的意义。 比如 `CMD service nginx start` 它等同于 `CMD [ "bash", "-c", "service nginx start"]` 主进程实际上是 `bash`，`bash` 也就结束了，`bash` 作为主进程退出了。

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

## ENV

```dockerfile
ENV <key> <value>

ENV <key>=<value> ...
```

ENV 指令将环境变量 `<key>` 设置为值 `<value>`。

ENV 指令有两种形式。

- 第一种形式，`ENV <key> <value>`，将单个变量设置为一个值。第一个空格后面的整个字符串将被视为 `<value>` - 包括空格和引号等字符。
- 第二种形式，`ENV <key> = <value> ...`，允许一次设置多个变量。

注意，第二种形式在语法中使用等号 `=`，而第一种形式不使用。与命令行解析类似，引号和反斜杠可用于在值内包含空格。

## ADD

```dockerfile
ADD <src> <dest>

# 对于包含空格的路径，此形式是必需的
ADD ["<src>", ..., "<dest>"]
```

`ADD` 指令从 `<src>` 复制到新文件，目录或远程文件 `URL`，并将它们添加到容器的文件系统，路径 `<dest>`。

`ADD` 遵守以下规则：

- `<src>` 路径必须在构建的上下文中;你不能 `ADD ../something /something`，因为 Docker 构建的第一步是发送上下文目录（和子目录）到 Docker 守护进程。如果 `<src>` 是 `URL` 并且 `<dest>` 不以尾部斜杠结尾，则从 `URL` 下载文件并将其复制到 `<dest>`。如果 `<src>` 是 `URL` 并且 `<dest>` 以尾部斜杠结尾，则从 `URL` 中推断文件名，并将文件下载到 `<dest>/<filename>`。例如，`ADD http://example.com/foobar /` 会创建文件 `/ foobar`。网址必须有一个非平凡的路径，以便在这种情况下可以发现一个适当的文件名（`http://example.com` 不会工作）。如果 `<src>` 是目录，则复制目录的整个内容，包括文件系统元数据。

## WORKDIR

```dockerfile
WORKDIR /path/to/workdir
```

`WORKDIR` 指令为 Dockerfile 中的任何 `RUN`、`CMD`、`ENTRYPOINT`、`COPY` 和 `ADD` 指令设置工作目录。

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

## COPY

拷贝文件至容器的工作目录下，.dockerignore 指定的文件不会拷贝

```dockerfile
COPY <src> .. <dest>

COPY ["<src>", ..., "<dest>"]
```

与 ADD 类似，不过 `COPY` 的 `<src>` 不能为 URL。

## EXPOSE

```dockerfile
EXPOSE <port> [<port>...]
```

`EXPOSE` 指令通知 Docker 容器在运行时侦听指定的网络端口。`EXPOSE` 不使主机的容器的端口可访问。为此，必须使用 `-p` 标志发布一系列端口，或者使用 `-P` 标志发布所有暴露的端口。您可以公开一个端口号，并用另一个端口号在外部发布。

要在主机系统上设置端口重定向，请参阅 [使用 `-P` 标志](https://docs.docker.com/engine/reference/run/#expose-incoming-ports)。Docker 网络功能支持创建网络，无需在网络中公开端口，有关详细信息，请参阅 [网络通信功能的概述](https://docs.docker.com/engine/userguide/networking/)。

## ENTRYPOINT

```dockerfile
ENTRYPOINT ["executable", "param1", "param2"]

ENTRYPOINT command param1 param2
```

`ENTRYPOINT` 允许您配置容器，运行执行的可执行文件。

例如，以下将使用其默认内容启动 Nginx，侦听端口 80：

```bash
$ docker run -it --rm -p 80:80 nginx
```

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

`ARG` 变量不会持久化到构建的 Image 中，因为 `ENV` `变量是。但是，ARG` 变量会以类似的方式影响构建缓存。如果一个 Dockerfile 定义一个 `ARG` 变量，它的值不同于以前的版本，那么在它的第一次使用时会出现一个 `“cache miss”`，而不是它的定义。特别地，在 `ARG` 指令之后的所有 RUN 指令都隐式地使用 `ARG` 变量（作为环境变量），因此可能导致高速缓存未命中。

## VOLUME

`VOLUME` 指令创建具有指定名称的挂载点，并将其标记为从本机主机或其他容器保留外部挂载的卷。该值可以是 JSON 数组 `VOLUME ["/var/log"]` 或具有多个参数的纯字符串，例如 `VOLUME /var/log` 或 `VOLUME /var/log /var/db`。

## USER

`USER` 指令设置运行 Image 时使用的用户名或 UID，以及 Dockerfile 中的任何 RUN，`CMD` 和 `ENTRYPOINT` 指令。

## MAINTAINER

```dockerfile
MAINTAINER <name>
```

`MAINTAINER` 指令允许您设置生成的 Images 的作者字段

---

**参考资料：**

- [📝 Dockerfile 和 Docker Compose file 参考文档](https://juejin.im/post/5d9c0224f265da5b76373451)
- [如何编写最佳的 Dockerfile](https://juejin.im/post/5922e07cda2f60005d602dcd)
- [Dockerfile 最佳实践指南：构建缓存部分](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#build-cache)
