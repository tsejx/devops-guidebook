---
nav:
  title: 数据库
  order: 3
group:
  title: MongoDB
  order: 2
title: 基本操作
order: 3
---

# 基本操作

- 安装 Install
- 创建 Create
- 读取 Read
- 更新 Update
- 删除 Delete

## 启动数据库

启动数据库使用 `mongod` 命令。

```bash
# 方式一：普通方式启动
# 不实用默认端口的话可以加上 --port=[端口号]参数
mongod --dbpath ~/data/db

# 方式二：通过配置文件启动
mongod --config ~/mongo.conf
```

配置文件内容：

```bash
# 服务端口
port=27017
# 数据文件路径
dbpath=
# 日志文件路径
logpath=
# 打开日志输出操作
logappend=true
# 不使用任何的验证方式登陆
noauth=true
```

## 连接数据库

连接数据库使用 `mongo [, 链接字符串]`

```js
mongodb://<username>:<password>@<host>:<port1>,<host2>:<port2>,...,<hostN>:<portN>/<database>?<options>
```

登陆本地默认数据库服务器，无用户名密码，端口默认 27017，链接默认的 db 数据库。

```bash
# 连接数据库
mongo mongodb://localhost/db
```

🌰 **示例：**

或，使用用户名 admin、密码 123456，登陆本地端口为 27017 的 test 数据库。

```bash
# 实战示例
mongo mongodb://admin:123456@localhost:27017/test
```

**以下代码可以帮助我们连接到本地 Docker 容器上运行的 mongod 进程**

```js
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/demo';
mongoose.conncet(mongoDB, {useNewUrlParser: true});

const db.mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接异常'));
```

## 切换数据库

切换数据库用 `use <db_name>`，如果该数据库不存在，则会新建一个数据库。

🌰 **示例：**

例如创建一个 test 的数据库：

```bash
# 切换数据库
use <db_name>

# 查看当前所在数据库
db
```

`<db_name>` 为数据库名称。

显示当前所有的数据库可以使用命令 `show dbs`

```bash
# 查看全部数据库
show dbs

# 查看当前数据库中的集合（类似关系型数据库中的表）
show collections

# 查看当前数据的用户信息
show users
```

查看 `db.[集合名称].find()` 刚才添加的数据。

```bash
> use test
switched to db test
> db.coll.find()
{ "_id" : ObjectId("5a66e39914fea5f8ff237420"), "title" : "not data!" }
```

使用 `use` 命令如果数据库不存在则创建，存在则切换到指定的数据库。

## 获取帮助信息

```bash
# 显示数据库操作命令
db.help()

# 显示集合操作命令，同样有很多命令
# foo 指当前数据库下，一个叫 foo 的集合，并非真正意义上的命令
db.foo.help()
```

## 删除数据库

删除数据库使用 `db.dropDataBase()` 函数进行。

```bash
# 查看所有数据库
> show dbs
db    0.001GB
local 0.000GB
test  0.000GB

# 切换到要删除的数据库 test
> use test
switched to db test

# 删除当前数据库
> db.dropDatabase()
{ "dropped" : "test123", "ok" : 1 } # 删除成功
```

## 数据增加

数据添加方法：

- `insert()`
- `insertOne()`
- `insertMany()`

```bash
# insert 插入一条数据
db.collection.insert({ name: "Ben", sex: "male" });

# insert 也可以插入多条数据
db.collection.insert([{ name: "Ben", sex: "male"}, { name: "Amy", sex: "female" }])

# insertOne 只能插入一条数据
db.collection.insertOne({ name: "Ben", sex: "male" })

# insertMany 可以插入一条或多条数据，但是必须以列表的形式组织数据
db.collection.insertMany([{ name: "Ben", sex: "male" }])

# 如果不指定 _id，save 的功能与 insert 一样
db.collection.save([{ name: "Ben" }, { name: "Amy" }])

# 如果指定 _id，mongodb 就不为该条记录自动生成 _id 了，只有 save 可以指定 _id，insert、insertOne、insertMany 都不可以
db.collection.save({ _id: ObjectId("..."), name: "Ben" })
```

## 数据修改

### update

修改方法：`update()`

```bash
db.collection.update(
  <query>, # update 的查询条件，类似于 sql update 语句 where 后面部分
  <update>, # update 的对象和一些更新的操作符等，也可以理解为 sql update 语句 set 后面的部分
  {
    upsert: <boolean>, # 可选，这个参数的意思是，如果不存在 update 的记录，是否插入 objNew，true 为插入，默认 false，不插入
    multi: <boolean>, # 可选，mongodb 默认是 false，只更新找到的第一条记录，如果这个参数为 true，就把按条件查出来多条记录全部更新
    writeConcern: <document> # 可选，抛出异常的级别
  }
)
```

Ben 同学发现老是把她的 C++ 课程分数录错了，需要修改为 75 分：

```bash
db.collection.update({ _id: ObjectId('...')}, { $set: { score: 75 }})
```

老师发现把 Ben 同学的名字录错了，需要全部修改过来：

```bash
# 这样是不对的，只会修改一条记录
db.collection.update({ _id: ObjectId('...')}, { $set: { score: 75 }})

# 这样才对
db.collection.update({ name: 'Ben', class: 'Java' }, { $set: { score: 95 }}, { multi: true })
```

将 Ben 的 Java 课程分数改为 95 分，如果找不到，就插入一条记录：

```bash
db.collection.update({ name: 'Ben', class: 'Java' }, { $set: { score: 95 }}, true)
```

### save

save 方法通过传入的文档来替换已有文档。语法格式如下：

```bash
db.collection.save(
  <document>, # 文档数据
  {
    writeConcern: <document>, # 可抛，抛出的异常级别
  }
)
```

## 数据查询

数据查询的方法有 `findOne` 和 `find`，二者参数等用法一致，但是 `findOne` 只返回一条匹配的数据，`find` 返回全部的匹配数据。

### 条件操作符

| 操作     | SQL 查询写法                                 | MongoDB 查询写法                            |
| -------- | -------------------------------------------- | ------------------------------------------- |
| 等于     | `select * from collection where score = 75`  | `db.collection.find({ score: 75})`          |
| 小于     | `select * from collection where score < 75`  | `db.collection.find({ score: { $lt: 75}})`  |
| 小于等于 | `select * from collection where score = 75`  | `db.collection.find({ score: { $lte: 75}})` |
| 大于     | `select * from collection where score > 75`  | `db.collection.find({ score: { $gt: 75}})`  |
| 大于等于 | `select * from collection where score >= 75` | `db.collection.find({ score: { $gte: 75}})` |
| 不等于   | `select * from collection where score != 75` | `db.collection.find({ score: { $ne: 75}})`  |

### 排序和分页

以分数从高到低显示学生的 C++ 课程成绩，只显示第 10 名到第 20 名的学生：

```bash
db.collection.find({ class: 'C++'}).sort({ score: -1 }).skip(9).limit(11)
# sort: 1 为升序, -1 为降序, 默认升序
# limit: 显示多少条数据
# skip: 跳过多少条数据
```

### 复合条件查询

`and`：`find` 方法可以传入多个键值对，每个键值对以逗号隔开，即常规 SQL 的 AND 条件。

查询 Ben 同学的 C++ 课程成绩：

```sql
db.collection.find({ name: 'Ben', class: 'C++' })
```

查询分数在 75 到 85 之间的成绩记录：

```sql
db.collection.find({ socre: { $gt: 75, $lt: 85 }})
```

`or`：MongoDB OR 条件语句使用了关键字 `$or`，语法格式如下：

```sql
db.collection.find(
  {
    $or: [
      { key1: value1 }, { key2: value2 }
    ]
  }
)
```

查询 Ben 或 Jack 的课程成绩：

```sql
db.collection.find({ $or: [{ name: 'Ben' }, { name: 'Jack' }] })
```

`and` 和 `or` 复合查询：

查询 Ben 的 C++ 或 Python 课程的成绩：

```sql
db.collection.find({ name: 'Ben', $or: [{ class: 'C++' }, { class: 'Python' }]})
```

### 包含与全部

- 包含 `in`
- 不包含 `nin`
- 全部 `all`

查询 Ben、Jack 和 Amy 的成绩：

```sql
db.collection.find({ name: { $in: ['Ben', 'Jack', 'Amy'] } })
```

查询除了 Ben、Jack 和 Amy 之外，其他人的成绩：

```sql
db.collection.find({ name: { $nin: ['Ben', 'Jack', 'Amy'] })
```

`in` 和 `nin` 比较好理解，跟 SQL 的用法类似，`all` 类似于 `in`，不同的地方是，`in` 只需要满足列表中的一个值即可，而 `all` 需要满足列表中的全部值。

```bash
# 用 all 操作符，表示需要满足 C++ 和 Java 两项
db.collection.find({ course: { $all: ['C++', 'Java']}})
```

### 判断字段是否存在

需要找出没有 `tel` 字段的学生：

```bash
# 字段不存在就用false，存在就用true
db.collection.find({"tel": {$exists: false}})
```

### 空值处理

如果只想找 `tel` 值为 `null` 的情况：

```bash
db.collection.find({ tel: { $in: [null], $exists: true } })
```

### 取模运算

比如，查找学生成绩取模 10 等于 0 的数据（即 100、90 、80 等等）

```bash
db.collection.find({ tel: { $in: [null], $exists: true }})
```

### 正则匹配

查询学生名字以 `a` 开头的学生成绩：

```bash
db.collection.find({ name: { $regex: /^a.*/ }})
```

### 获取查询结果数量

查询学生名字以 `a` 开头的学生成绩：

```bash
db.collection.find().count()
```

当使用 `limit` 方法限制返回的记录数时，默认情况下 `count` 方法仍然返回全部记录条数。如果希望返回限制之后的记录数量，要使用 `count(true)`。

```bash
db.collection.find().count()

db.collection.find().limit().count()

db.collection.find().limit(1).count(true)
```

### distinct

查询课程成绩表中所有学生的名单：

```bash
db.collection.distinct('name')
```

## 数据删除

### deleteOne 和 deleteMany

```bash
# 删除 Ben 的一条成绩记录
db.collection.deleteOne({ name: 'Ben' })

# 删除 Ben 的所有成绩记录
db.collection.deleteMany({ name: 'Ben' })

# 删除成绩表里所有内容
db.collection.deleteMany({})
```

### remove

```bash
db.collection.remove(
  <query>, # 可选，查询条件
  {
    justOne: <boolean>, # 可选，设置为 true 或者 1，表示只删除一个文档，设置为 false，表示删除所有匹配的文档，默认为 false
    writeConcern: <document> # 可选，抛出异常的级别
  }
)
```

删除 Ben 的所有成绩记录：

```bash
db.collection.remove({ name: 'Ben' });

# remove 方法并不会真正释放空间，需要继续执行 db.repairDatabase() 来回收磁盘空间
db.repairDatabase()

# 与上一句等效，仍以执行一句即可
db.runCommand({ repairDatabase: 1})
```

`remove` 现在已经过时了，官方推荐使用 `deleteOne` 和 `deleteMany` 方法。

## 索引

索引通常能够极大的提高查询的效率，就像书的目录一样，如果没有索引 mongodb 就会去扫描集合中的每个文件并选取符合查询条件的数据，在数据量大的时候这种查询相率很低下。

使用 `db.集合名称.getIndexed()` 获取集合索引。

### 创建索引

创建索引的方法：`createIndex()`

```bash
# 在 person 集合中针对 name 字段创建一个升序排列的索引
db.person.createIndex({ "name": 1 });

db.person.getIndexes();
[
  {
    "v": 1,
    "key": {
      "_id": 1
    },
    "name": "_id",
    "ns": "test.person"
  },
  {
    "v": 1,
    "key": {
      "name": 1
    },
    "name": "name_1",
    "ns": "test.person"
  }
]
```

### 删除索引

删除索引的方法：`dropIndex()`

```bash
# 删除指定索引
db.person.dropIndex({ "name": 1 });
{ "nIndexesWas": 2, "ok": 1 }

db.person.getIndexes();
[
  {
    "v": 1,
    "key": {
      "_id": 1
    },
    "name": "_id",
    "ns": "test.person"
  }
]

# 删除全部索引
db.person.dropIndexes()
```

## 导出数据文件

```bash
mongodump -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 -o 文件存在路径
```

- 如果没有用户谁，可以去掉 `-u` 和 `-p`。
- 如果导出本机的数据库，可以去掉 `-h`。
- 如果是默认端口，可以去掉 `--port`。
- 如果想导出所有数据库，可以去掉 `-d`。

## 导入数据文件

```bash
mongorestore -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 --drop
```

`--drop` 的意思是，先删除所有的记录，然后恢复

## 副本集

使用 Docker 创建 MongoDB 副本集

```bash
# 创建 Docker Network
$ docker network create mynetwork

$ docker network ls
```

创建需要使用的复制集节点

```bash
# 运行三个 Docker 容器，每个容易一个 mongod 节点
$ docker run --net mynetwork --name mongol -v /mymongo/data1:/data/db -p 27017:27017 -d mongo:4 --replSet myset --port 27017

$ docker run --net mynetwork --name mongo2 -v /mymongo/data2:/data/db -p 27018:27018 -d mongo:4 --replSet myset --port 27018

$ docker run --net mynetwork --name mongo3 -v /mymongo/data3:/data/db -p 27019:27019 -d mongo:4 --replSet myset --port 27019
```

创建复制集

```bash
# 创建一个拥有三个节点的复制集
$ docker exec -it mongo1 mongo
> rs.initiate(
  {
    _id: "myset",
    members: [
    	# mongo1 是 docker 容器名称，27017 是 docker 暴露宿主机的端口
      { _id: 0, host: "mongo1:27017" },
      { _id: 1, host: "mongo2:27018" },
      { _id: 2, host: "mongo3:27019" }
    ]
  }
)
```

查看复制集状态

```bash
$ rs.status()
```

---

**参考资料：**

- [MongoDB 学习笔记纯干货](https://blog.csdn.net/weixin_34095889/article/details/89046540)
