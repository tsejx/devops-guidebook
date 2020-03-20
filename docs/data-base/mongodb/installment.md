---
nav:
  title: 数据库
  order: 3
group:
  title: MongoDB
  order: 2
title: 安裝使用
order: 2
---

# 安裝使用

官网下载地址：[MongoDB Download](https://www.mongodb.com/download-center/community?jmp=nav)

## CentOS7

[安装教程](https://www.jianshu.com/p/7241f7c83f4a)
安装后将 MongoDB 安装目录下的 `bin` 目录加入到系统的环境变量中。

### 创建文件

```bash
cd /usr/local

mkdir mongodb

cd ./mongodb/

mkdir data

mkdir log

cd ./data/

mkdir db
```

### 下载

因为 CentOS 是红帽操作系统的开源分支，所以安装 RHEL 7 Linux 64-bit x64 这个版本。

```bash
cd /usr/local/

# 将下载地址替代下面的地址
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.2.0.tgz
```

### 解压

```bash
# 解压后可删除压缩文件
tar -zxvf mongodb-linux-x86_64-4.0.1.tgz

# 将解压后文件夹内文件移动到 mongodb 目录下，同样的移动后可删除文件夹
mv /usr/local/mongodb-linux-x86_64-4.0.1/* /usr/local/mongodb/
```

### 配置

```bash
cd /usr/local/mongodb/bin

touch mongodb.conf

vim mongodb.conf
```

配置文件 `mongodb.conf`：

```nginx
# 数据文件存放目录
dbpath=/usr/local/mongodb/data/db

# 日志文件存放目录
logpath=/usr/local/mongodb/log/mongodb.log

# 端口，默认27017，可以自定义
port=27017

# 开启日志追加添加日志
logappend=true

# 以守护程序的方式启用，即在后台运行
fork=true

# 默认是127.0.0.1,开启远程访问
bind_ip=0.0.0.0

# auth=true（这项暂时不动，因为涉及到auth认证，调试好所有的mongodb的问题后在来弄权限）
```

### 添加环境

编辑 `/etc/profile` 文件：

```bash
vim /etc/profile
```

添加一下代码到文件最后一行：

```vim
export MONGODB_HOME=/usr/local/mongodb

export PATH=$PATH:$MONGODB_HOME/bin
```

立即生效：

```bash
source /etc/profile
```

### 开机自动启动

```bash
cd /usr/lib/systemd/system

touch mongod.service
```

创建 `mongod.service` 文件后，填写以下配置：

```nginx
[Unit]

Description=mongodb
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
ExecStart=/usr/local/mongodb/bin/mongod --config /usr/local/mongodb/bin/mongodb.conf
ExecReload=/usr/kill -s HUP $MAINPID
ExecStop=/usr/local/mongodb/mongod --shutdown --config /usr/local/mongodb/bin/mongodb.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

以上关于地址部分按照实际情况修改。

保存后执行

```bash
systemctl daemon-reload

# 启动 mongod 服务
systemctl start mongod

# 查看 mongod 状态
systemctl status mongod

# 开机自启动
systemctl enable mongod
```

### 测试

```bash
# 切换至名为 test 的数据库
use test

db.test.insert({ id: 1 })
```

---

**参考资料：**

- [CentOS7 安装 MongoDB4.0](https://blog.csdn.net/MiaodXindng/article/details/81774273)
- [Mongodb 安装及开机自动启动](https://blog.csdn.net/jz1993/article/details/79187918)
