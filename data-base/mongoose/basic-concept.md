# Mongoose

## 概述

Mongoose 是 NodeJS 的驱动，不能作为其它语言的驱动。Mongoose 有两个特点：

1. 通过关系型数据库的思想来设计非关系型数据库
2. 基于 MongoDB 驱动，简化操作

Mongoose 中，有三个比较重要的概念，分别是 Schema、Model 和 Entity。它们的关系是：Schema 生成 Model，Model 创造 Document，Model 和 document 都可对数据库操作造成影响，但 Model 比 document 更具操作性。


* Schema ：一种以文件形式存储的数据库模型骨架，用于定义数据库的结构。类似创建表时的数据定义（不仅可以定义文档的结构和属性，还可以定义文档的实例方法、静态模型方法、复合索引等），每个 Schema 会映射到 MongoDB 中的一个 Collection，Schema 不具备操作数据库的能力。
* Model：由 Schema 编译而成的构造器，具有抽象属性和行为，可以对数据库进行增删查改。Model 的每个实例就是一个文档 Document。
* Entity：由 Model 创建的实体，他的操作也会影响数据库

> 如果使用程序操作数据库，就要使用 MongoDB 驱动。MongoDB 驱动实际上就是应用程序提供的一个接口，不同的语言对应不同的驱动，NodeJS 驱动不能应用在其他后端语言中。

## Schema

定义文档结构和属性类型。

还能定义：

- document 的 instance methods
- model 的 static model methods
- 复合索引
- 文档的生命周期钩子，也成为中间件

通过 mongoose.Schema 来调用 Schema，然后使用 `new` 调用来创建 Schema 对象。

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, data: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
})
```

⚠️ 注意：创建 Schema 对象时，声明字段类型有两种方法，一种时首字母大写的字段类型，另一种是引号包含的消协字段类型。

```js
const mySchema = new Schema({ title: String, author: String });
// or
const mySchema = new Schema({ title: 'string', author: 'string' });
```

## SchemaTypes

处理字段路径各种属性定义。

合法类型：

- String 字符串
- Number 数字
- Date 日期
- Buffer 二进制
- Boolean 布尔值
- Mixed 混合类型
- ObjectId 对象ID
- Array 数组
- Decimal128

### 选项

- `required`：布尔值或函数，如果值为真，为此属性添加 required 验证器
- `default`：任何值或函数，设置此路径默认值。如果是函数，函数返回值为默认值
- `select`：布尔值，指定 query 的默认 projections
- `validate`：函数 adds a validator function for this property
- `get`：函数使用 `Object.defineProperty()` 定义自定义 getter
- `set`：函数使用 `Object.defineProperty()` 定义自定义 setter
- `alias`：字符串仅 mongoose >= 4.10.0，为该字段路径定义虚拟值 gets/sets

### 索引相关

- `index`：布尔值，是否对这个属性创建索引
- `unique`：布尔值，是否对这个属性创建唯一索引
- `sparse`：布尔值，是否对这个属性创建稀疏索引

```js
const schema = new Schema({
    test: {
        type: String,
        index: true,
        unique: true
    }
})
```

**String**

- `lowercase`: 布尔值，是否在保存前对此值调用 `.toLowerCase()`
- `uppercase`: 布尔值，是否在保存前对此值调用 `.toUpperCase()`
- `trim`: 布尔值，是否在保存前对此值调用 `.trim()`
- `match`: 正则表达式，创建验证器检查这个值是否匹配给定正则表达式
- `enum`: 数组，创建验证器检查这个值是否包含于给定数组

**Number**

- `min`: 数值，创建验证器检查属性是否大于或等于该值
- `max`: 数值，创建验证器检查属性是否小于或等于该值

**Date**

- `min`: Date
- `max`: Date

## Connections

使用 `mongoose.connect()` 方法连接 MongoDB。

```js
// url 参数为数据库地址
mongoose.connect(url);

// 连接到本地 localhost 的 db 服务器
mongoose.connect('mongodb://localhost/db')

// 账户和密码
mongoose.connect('mongodb://username:password@host:port/database?options')
```

这是连接到本地 `db` 数据库默认接口（27017）的最小配置。本地连接失败可以尝试连接 `127.0.0.1`。

`connect()` 方法还接受一个选项对象 `options`，该对象将传递给底层驱动程序。这里所包含的所有选项优先于连接字符串中传递的选项。

**可选项：**

- `db`：数据库设置
- `server`：服务器设置
- `replset`：副本集设置
- `user`：用户名
- `pass`：密码
- `auth`：鉴权选项
- `mongos`：连接多个数据库

对于长期运行的后台应用，启用毫秒级 `keepAlive` 是精明的操作。

```js
mongoose.connect(url, { keepAlive: 120 })
```

函数还可以接受一个回调参数：

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', function(err) {
    if (err) {
        console.log('连接失败')
    } else {
        console.log('连接成功')
    }
})
```

### 副本集（Replica Set）连接

要连接到副本集，你可以用逗号分隔，传入多个地址。

```js
mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options])
```

要连接到单节点副本集，需指定 `replicaSet` 选项。

```js
mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');
```

### 多 mongos 支持

使用高性能分片集群，需要连接多个 mongos（MongoDB Shard）实例。

### 连接池

无论使用 `mongoose.connect` 或是 `mongoose.createConnection` 创建的连接，都被纳入默认最大为 5 的连接池，可以通过 `poolSize` 选项调整。

```js
// With object options
mongoose.createConnection(uri, { poolSize: 4 })

const uri = 'mongodb://localhost/test?poolSize=4';
mongoose.createConnection(uri);
```

## Model

Model 是从 Schema 编译来的构造函数。 它们的实例就代表着可以从数据库保存和读取的 documents。 从数据库创建和读取 document 的所有操作都是通过 model 进行的。

```js
const schema = new Schema({ name: String, size: String })
const Tank = mongoose.model('Tank', schema);
```

第一个参数是跟 model 对应的集合（ collection ）名字的单数形式。 Mongoose 会自动找到名称是 model 名字复数形式的 collection 。

⚠️ **注意**：务必将 `model()` 方法的第一个参数和其返回值设置为相同的值，否则会出现不可预知的结果。

### 构造 documents

documents 是 model 的实例。创建它们并保存到数据库非常简单：

```js
const Tank = mongoose.model('Tank', schema);

// 实例化文档 document
const tank = new Tank({ size: 'small' });

// 实例化后的文档必须通过 save 方法，才能将创建的文档保存到数据库的集合中，集合名称为模型名称的小写复数版
tank.save(function (err, doc) {
    if (err) return handleError(error)
})

// or

Tank.create({ size: 'small' }, function (err, doc) {
    if (err) return handleError(error);
    // saved
})
```

### 新增

文档新增有三种方法，一种是使用上面介绍过的文档的 `save()` 方法，另一种是使用模型 model 的 `create()` 方法，最后一种是模型 model 的 `insertMany()` 方法。



### 查询

支持 MongoDB 的高级（rich）查询语法。查询文档可以用 model 的 `find`、`findById`、`findOne` 和 `where` 这些静态方法。

```js
Tank.find({ size: 'small' }).where('createDate').gt(oneYearAgo).exec(callback);

```

查询 [Query API](query.md);

### 删除

`model` 的 `remove` 方法可以删除所有匹配查询条件（`conditions`）的文档。

```js
Tank.remove({ size: 'large' }, function (err) {
    if (err) return handleError(err);
})

```

### 更多

model 的 update 方法可以修改数据库中的文档，不过不会把文档返回给应用层。

如果想更新单独一条文档并且返回给应用层，可以使用 `findOneAndUpdate` 方法。

## documents

Mongoose document 代表着 MongoDB 文档的一对一映射。

## Queries

Model 的多个静态辅助方法都可以查询文档。

Model 的方法中包含查询条件参数的（`find`、`findById`、`count`、`update`）都可以按以下两种方式执行：

- 传入 `callback` 参数，操作会被立即执行，查询结果被传给回调函数（callback）
- 不传 `callback` 参数，Query 的一个实例（一个 query 对象）被返回，这个 query 提供了构建查询器的特殊接口

Query 实例有一个 `.then()` 函数，用法类似 Promise。

如果执行查询时传入 `callback` 参数，就需要 JSON 文档的格式指定查询条件。JSON 文档的语法跟 [MongoDB Shell](http://docs.mongodb.org/manual/tutorial/query-documents/) 一致。

```js
const Person = mongoose.model('Person', personSchema);

// 查询每个 last name 是 'Ghost' 的 person， select `name` 和 `occupation` 字段
Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host".
  console.log('%s %s is a %s.', person.name.first, person.name.last,
    person.occupation);
});

```

上例中查询被立即执行，查询结果被传给回调函数。Mongoose 中所有的回调函数都使用 `callback(error, result)` 这种模式。如果查询时发生错误，`error` 参数即是错误文档，`result` 参数会是 `null`。如果查询成功，`error` 参数是 `null`，`result` 即是查询的结果。

Mongoose 中每一处查询，被传入的回调函数都遵循 `callback(error, result)` 这种模式。查询结果的格式取决于做什么操作：`findOne()` 是单个文档（有可能是 `null`），`find()` 是文档列表， `count()` 是文档数量，`update()` 是被修改的文档数量。 Models API 文档中有详细描述被传给回调函数的值。

下面来看不传入 callback 这个参数会怎样：

```js
// 查询每个 last name 是 'Ghost' 的 person
var query = Person.findOne({ 'name.last': 'Ghost' });

// select `name` 和 `occupation` 字段
query.select('name occupation');

// 然后执行查询
query.exec(function (err, person) {
  if (err) return handleError(err);
  // Prints "Space Ghost is a talk show host."
  console.log('%s %s is a %s.', person.name.first, person.name.last,
    person.occupation);
});

```

以上代码中，query 是个 Query 类型的变量。 Query 能够用链式语法构建查询器，无需指定 JSON 对象。 下面2个示例等效。

```js
// With a JSON doc
Person
  .find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  })
  .limit(10)
  .sort({ occupation: -1 })
  .select({ name: 1, occupation: 1 })
  .exec(callback);

// Using query builder
Person
  .find({ occupation: /host/ })
  .where('name.last').equals('Ghost')
  .where('age').gt(17).lt(66)
  .where('likes').in(['vaporizing', 'talking'])
  .limit(10)
  .sort('-occupation')
  .select('name occupation')
  .exec(callback);

```

### 引用其它文档

MongoDB 没有表连接，但引用其它集合的文档有时也会需要。Population 即为此而生。

### Streaming

你可以流式（stream）处理 MongoDB 的查询结果，需要调用 `Query.cursor()` 函数获得 QueryCursor 的实例。

```js
const cursor = Person.find({ occupation: /host/ }).cursor();

cursor.on('data', function(doc) {
    // Called once for every document
});

cursor.on('close', function() {
    // Called when done
})

```

## Validation

如果你要使用验证，注意几个点：

- 验证定义于 SchemaType
- 验证是一个中间件，它默认作为 `pre('save')` 钩子注册在 schema 上
- 你可以使用 `doc.validate(callback)` 或 `doc.validateSync()` 手动验证
- 验证器不对为定义的值进行验证，唯一例外是 `required` 验证器
- 验证是异步递归的。当你调用 `Model#save`，子文档验证也会执行，出错的话 `Model#save` 回调会接收错误
- 验证是可定制的

```js
const schema = new Schema({
    name: {
        type: String,
        required: true
    }
})
const Cat = db.model('Cat', schema);

// This cat has no name
const cat = new Cat();
cat.save(function(error) {
    assert.equal(error.errors['name'].message, 'Path `name` is required');

    error = cat.validateSync();
})
```
