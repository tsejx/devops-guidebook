# MongoDB

Mongo 来源于 Humongous 意为「庞大」

面向文档存储的开源数据库

- 性能好（内存计算）
- 大规模数据存储（可拓展性）
- 可靠安全（本地复制、自动故障转移）
- 方便存储复杂数据结构（Schema Free）

MongoDB 是一个基于分布式文件存储的开源文档数据库。由 C++ 语言编写。旨在为 Web 应用提供高性能、高可用性和高伸缩数据存储解决方案。

## 使用场景

![MongoDB优点](../../snaptshots/mongodb-advantage.png)

- **数据缓存**：由于性能很高，MongoDB 适合作为信息基础设施的缓存层。在系统重启之后，由 MongoDB 搭建的持久化缓存层可以避免下层的数据源过载。
- **对象和 JSON 存储**：MongoDB 的 BSON(二进制 JSON)数据格式非常适合文档化格式的存储及查询,而且 JSON 格式存储最接近真实对象模型，对开发者友好，方便快速开发迭代,灵活的模式让你不在为了不断变化的需求而去频繁修改数据库字段和结构。
- **高伸缩性场景**：MongoDB 通过分片集群，使 MongoDB 服务能力易于水平扩展。
- **弱事务类型业务**：MongoDB 不支持多文档事务，所以像银行系统这种需要大量原子性复杂事务的程序不适合使用 MongoDB。（注：MongoDB 4.0 将支持跨文档的事务）。

## 概念

通过和关系型数据库 MySQL 的对照，让我们更容易理解 MongoDB 的一些概念。

### 数据库

- 一个 MongoDB 中可以建立多个数据库
- MongoDB 的默认数据库为 `db`，该数据库存储在 `data` 目录中

### 集合

- 集合不能以 `system.` 开头
- 关系型数据库中的表（table）中的每一条数据（row）的格式是事先约定好的的，而 MongoDB 中的集合（collection）中文档（document）的数据格式是不固定的，也就是说我们可以将如下数据插入统一文档中。

```js
{"site":"www.wuhuan.me"}
{"site":"www.baidu.com","name":"百度"}
```

### 文档

- 文档中的值不仅可以是双引号里面的字符串，还可以是其它几种数据类型（甚至可以是整个嵌入的文档）

例如：在关系型数据库中有一张 students 表和 course 表，表的结构和数据如下：

**students 表**

**course 表**

以上数据和结构在 MongoDB 中可以使用内嵌文档来表示（一对多）的关系：

```js
{
  "_id":ObjectId("5349b4ddd2781d08c09890f3"),
  "name":"李雷",
  "sex":"0",
  "age":"12",
  "course":[{
    "course_id":1,
    "course_name":"语文",
    "score":99,
  },{
    "course_id":2,
    "course_name":"数学",
    "score":100,
  }]
}
{
  "_id":ObjectId("5349b4ddd2781d08c09890f4"),
  "name":"韩梅梅",
  "sex":"1",
  "age":"12",
  "course":[{
    "course_id":1,
    "course_name":"语文",
    "score":96,
  },{
    "course_id":2,
    "course_name":"数学",
    "score":98,
  }]
}
```

- 文档中的键/值对是有序的，文档中的键是不能重复的，且区分大小写

### 数据类型

### ObjectId

MongoDB 文档必须有一个默认的 `_id` 键，且在一个集合里 `_id` 始终唯一。`_id` 键可以是任何类型的，默认是个 ObjectId 对象，它由 MongoDB 数据库自动创建。MongoDB 使用 ObjectId 而不是使用常规做法（自增主键）主要原因是，在多个服务器（分布式）同步自动增加主键费力费时。

ObjectId 由 12 个字节的 BSON 组成：

- 前 4 个字节表示时间戳
- 接下来的 3 个字节是机器标识码
- 紧接的两个字节由进程 id 组成（PID）
- 最后三个字节是随机数

**创建新的 ObjectId**

我们可以在命令行通过如下语句来创建一个新的 ObjectId

```sh
> newId = ObjectId()
```

上面语句将返回一个唯一 `_id`
