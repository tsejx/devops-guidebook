# 命令大全

以下罗列使用 Mongo Shell 命令行对数据库的操作常用方法。

## 数据库

### 查看数据库状态

```bash
# 显示当前数据库服务上的数据库
$ show dbs

# 显示当前数据库的所有集合
$ show collections

# 查看当前数据库的用户信息
$ show users

# 切换到指定的数据库进行操作
$ use <db_name>

# 查看当前所在数据库
$ db

# 查看数据库操作命令
$ db.help()

# 查看集合操作命令，foo 是当前数据库下名为 foo 的集合名称
$ db.foo.help()

# 查看数据库状态
$ db.stats()
$ db.serverStatus()

# 查看数据库版本
$ db.version()

# 查看数据库所在机器地址
$ db.getMongo()

# 查询指定数据库的统计信息
$ use admin
$ db.stat()
```

## 删除信息

```sh
# 删除数据库
db.dropDatabase()

# 删除用户
db.removeUser('userName')
```

## 文档

### 创建文档

创建文档的相关方法：

- [db.collection.insert()](https://docs.mongodb.com/manual/reference/method/db.collection.insert/)
- [db.collection.save()](https://docs.mongodb.com/manual/reference/method/db.collection.save/)
- [db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)
- [db.collection.insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/)

#### 创建文档

创建文档并插入集合中

```bash
# 不指定 _id 的新文档插入集合，会自动创建 ObjectId
db.<collection>.insert({ <field1>: <value1>, <field2>: <value2> })

# 指定 _id 的新文档插入集合
db.<collection>.insert({ _id: <value1>, <field1>: <value2>, <field2>: <value3> })
```

创建多个文档并同时插入集合中

```bash
db.<collection>.insert(
  [
    { _id: 11, <field1>: <value1>, <field2>: <value2>, <field3>: <value3> },
    { <field1>: <value1>, <field2>: 20 },
    { <field1>: <value1>, <field2>: 25 }
  ]
)
```

无序地创建多个文档，通过 `insert` 方法第二个参数的 `ordered` 为 `false` 创建。

```bash
db.<collection>.insert(
   [
     { _id: 20, <field1>: <value1>, <field2>: <value2>, <field3>: <value3> },
     { _id: 21, <field1>: <value1>, <field2>: <value2>, <field3>: <value3> },
     { _id: 22, <field1>: <value1>, <field2>: <value2> }
   ],
   { ordered: false }
)
```

#### 创建单个文档

```bash
# 基本使用方法
db.<collection>.insertOne({ <field1>: <value1>, <field2>: <value2> })

# 定义文档创建的安全写级别
db.<collection>.insertOne(
  { <field1>: <value1>, <field2>: <value2>, <field3>: <value3> },
  { writeConcern: { w: "majority", wtimeout: 100 } }
)
```

返回结果中参数说明：

- acknowedged 安全写级别被启用
- insertedId 写入文档的主键

这里的 `writeConcern` 文档定义了本次文档创建操作的安全写级别。

简单来说，安全写级别用来判断一次数据库写入操作是否成功。

安全写级别越高，丢失数据的风险越低，然而写入操作的延迟也可能更高。

如果不提供 `writeConcern` 文档，MongoDB 使用**默认**的安全写级别。

#### 创建多个文档

```sh
# 创建多个文档
db.<collection>.insertMany( [
  { <field1>: <value1>, <field2>: <value2> },
  { <field1>: <value1>, <field2>: <value2> },
  { <field1>: <value1> , <field2>: <value2> }
] );

# `ordered` 参数用来决定 MongoDB 是否要按顺序来写入这些文档。
# 如果将 `ordered` 参数设置为 `false`，MongoDB 可以打乱文档写入的顺序，以便优化写入操作的性能。
db.products.insertMany( [
  { _id: 10, <field1>: <value1>, <field2>: <value2> },
  { _id: 11, <field1>: <value1>, <field2>: <value2> },
  { _id: 11, <field1>: <value1>, <field2>: <value2> },
  { _id: 12, <field1>: <value1>, <field2>: <value2> },
  { _id: 13, <field1>: <value1>, <field2>: <value2> },
  { _id: 13, <field1>: <value1>, <field2>: <value2> },
  { _id: 14, <field1>: <value1>, <field2>: <value2> }
], { ordered: false } );
```

在顺序写入时，一旦遇到错误，操作便会退出，剩余的文档无论正确与否，都不会被写入。

在乱序写入时，即使某些文档造成了错误，剩余的正确文档仍然会被写入。

### 读取文档

- [db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/)
- [db.collection.findAndModify()](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/)
- [db.collection.findOne()](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/)
- [db.collection.findOneAndDelete()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/)
- [db.collection.findOneAndReplace()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndReplace/)
- [db.collection.findOneAndUpdate()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/)

**游标**

- 查询操作返回的结果游标

**投射**

- 只返回部分字段
- 内嵌文档的投射
- 数组的投射

```bash
# 读取全部文档（既不筛选，也不投射）
$ db.<collection>.find()

# 更清楚地查看文件
$ db.<collection>.find().pretty()

# 匹配查询（例如读取字段 <field> 为 <value> 的文档）
$ db.<collection<>.find({ <field>: <value>})

# 匹配查询（精确匹配多个字段）
$ db.<collection>.find({<field1>: <value1>, <field2>: <value2>})
```

#### 比较操作符

比较操作符（Comparison Query Operators）

⚠️ **注意：**文档后续示例中 `<comparasion-operators>` 表示比较操作符统称。

| 比较操作符 | 说明                             |
| ---------- | -------------------------------- |
| `$eq`      | 匹配字段值相等的文档             |
| `$ne`      | 匹配字段值不等的文档             |
| `$gt`      | 匹配字段值大于查询值的文档       |
| `$gte`     | 匹配字段值大于或等于查询值的文档 |
| `$lt`      | 匹配字段值小于查询值的文档       |
| `$lte`     | 匹配字段值小于或等于查询值的文档 |

##### \$eq

匹配严格相等值的文档

```bash
# 查找 <collection> 集合中，字段 <field> 等于 <value> 的文档
db.<collection>.find({ <field>: { $eq: <value> } })

# 等价于
db.<collection>.find({ <field>: <value> })
```

根据内嵌文档的字段查询

```bash
# 被查询的文档
{ _id: <ObjectId>, <field1>: { <field2>: <value1>, <field3>: <value2> }, <field4>: <value3>, <filed5>: [<value4>, <value5>, ..., <valueN>] }

# 查询内嵌文档字段 fiedl 的 field2 字段的值为 <value> 的文档
db.<collection>.find({ "<field1>.<field2>": <value> })
```

查询数组成员

```bash
# 被查询的文档
{ _id: 1, <field>: [ <value> ] }

# 查询数组成员（所有文档中 <field> 字段数组中，包含 "y" 的数组成员就算匹配上）
# 查询文档中数组类型字段 <field> 中，包含 <value> 的文档
db.<collection>.find({ <field>: { $eq: <value> } })
```

##### \$in

匹配字段值与任一查询值相等的文档

```bash
# field 只要和查询语句数组中的任意一个 value（value1、value2 或 valueN）相同，那么该文档就会被检索出来
$ db.<collection>.find({ <field>: { $in: [ <value1>, <value2>, ..., <valueN>] } })

# 文档中 field1 字段数组中与任意一个 value 相同，那么就将该文档的 field2 字段更改为 value3
$ db.<collection>.update(
  { <field1>: { $in: [ <value1>, <value2>] } },
  { $set: { <field2>: <value3> } }
)
```

##### \$nin

匹配字段值与任何查询值都不等的文档

```bash
# 查询集合文档中字段 field 与任何 value（value1、value2 或 valueN）不想等的文档
$ db.<collection>.find( { <field>: { $nin: [<value1>, <value2>, ..., <valueN>] } } )
```

#### 逻辑操作符

| 操作符   | 说明                             |
| -------- | -------------------------------- |
| `$not`： | 匹配筛选条件不成立的文档         |
| `$and`： | 匹配多个筛选条件全部成立的文档   |
| `$or`：  | 匹配至少一个筛选条件成立的文档   |
| `$nor`： | 匹配多个筛选条件全部不成立的文档 |

##### \$not

匹配筛选条件不成立的文档

**相斥**表示与实际文档中相反的意思。例如：比较操作符使用 `$eq` 即，该语句表示 **不想等**。

```bash
# 查询集合文档中字段 <field> 与 <value> 相斥的文档
$ db.<collection>.find( { <field>: { $not: { <comparasion-operators>: <value> } } } )

# 查询集合文档中的嵌套文档 <field1> 的 <field2> 字段 与 <value> 相斥的文档
$ db.<collection>.find(
  { "<field1>.<field2>":
    { $not:
      {
        <comparasion-operators>: <value>
      }
    }
  }
)
```

##### \$and

使用比较操作符时需要注意：

- 如果比较的是数值类型，则按照大小排序
- 如果比较的是字符串等类型，则按照先后顺序

```bash
# 查询字段 <field1> 符合比较操作符的 <value1> 与字段 <field2> 符合比较操作符的 <value2> 的文档
$ db.<collection>.find({
  $and: [
    { <field1>: { <comparasion-operators1>: <value1> } },
    { <field2>: { <comparasion-operators2>: <value2> } }
  ]
})

# 简便写法
$ db.<collection>.find({
  <field1>: { <comparasion-operators1>: <value1> },
  <field2>: { <comparasion-operators2>: <value2> },
})

# 当筛选条件应用在同一个字段上时，也可以简化命令
# 查询字段 <field> 符合一个或多个比较操作符比较值后匹配的文档
$ db.<collection>.find(
  {
    <field>: {
      <comparasion-operators1>: <value1>,
      <comparasion-operators2>: <value2>
    }
  }
)
```

##### \$or

```bash
{ $or: [ {<expression>], {<expressions2}, ..., {<expressionN} ] }
```

```bash
# 查询字段 field1 符合比较操作符比较 value1 后符合条件或字段 field2 符合比较操作符比较 value2 后符合条件的文档
db.<collection>.find({
  $or: [
    { <field1>: { <comparasion-operators1>: <value1> },
    { <field2>: { <comparasion-operators2>: <value2> } }
  ]
})

# 当 $or 操作符下使用的都是 $eq 时，可以直接使用 $in
$ db.<collection>.find({ <field>: { $in: [ <value1>, <value2>, ..., <valueN>] } })
```

##### \$nor

```bash
# 读取不属于 alice 和 charlie 且余额不少于 100 的银行账户文档

# 查询既不符合 `<field1>.<field2>` 比较条件，也不符合 <field3> 比较条件的文档
$ db.<collection>.find({
  $nor: [
    { "<field1>.<field2>": <value1> },
    { <field3>: { <comparasion-operators>: <value2> } }
  ]
})
```

#### 字段操作符

- `$exists`：匹配包含查询字段的文档
- `$type`：匹配字段类型复合查询值的文档

##### \$exists

```bash
{ field: { $exists: <boolean> } }
```

```bash
# 查询集合中存在内嵌文档 <field1> 的 <field2> 字段的文档
$ db.<collection>.find({ "<field1>.<field2>": { $exists: true } } )

# 查询集合中存在内嵌文档 <field1> 的 <field2> 字段，并且该字段值符合比较操作符比较得到值的文档
$ db.<collection>.find({ "<field1>.<field2>": { <comparasion-operators>: <value1>, $exists: true } })
```

##### \$type

匹配字段类型复合查询值的文档

```
{ field: { $type: <BSON type> } }

{ field: { $type: [<BSON type1>, <BJSON type2>, ...] } }
```

```bash
# 查询文档 _id 字段类型为 <value> 的文档
$ db.<collection>.find({ _id: { $type: <value> } })

# 可以指定多种类型
$ db.<collection>.find({ _id: { $type: [<value1>, <value2>] } } )

# 查询字段 <field> 的值为 null 的文档
$ db.<collection>.find({ <field>: { $type: "null" } } )
```

#### 数组操作符

- `$all`：匹配数组字段中包含所有查询值的文档
- `$elemMatch`：匹配数组字段中至少存在一个值满足筛选条件的文档

##### \$all

这个操作符跟 SQL 语法的 in 类似，但不同的是, in 只需满足 `()` 内的某一个值即可, 而 `$all` 必须满足 `[]` 内的所有值。

```bash
{ field: { $all: [ <value>, <value> ...] } }
```

```bash
# 查询集合中文档 <field> 字段（数组类型）并至少存在 $all 定义数组中所有值
$ db.<collection>.find({ <field>: { $all: [ <value1>, <value2>] } } )
```

##### \$elemMatch

匹配数组字段中至少存在一个值满足筛选条件的文档

```bash
{ <field>: { $elemMatch: { <query1>, ..., <queryN> }} }
```

```bash
# 读取联系电话范围在 1000 至 2000 之间的银行账户文档

# 查询集合中
$ db.<collection>.find(
  {
    <field>: {
      $elemMatch: {
        $gt: <value1>,
        $lt: <value2>
      }
    }
  }
)

# 读取包含一个在 1000 至 2000之间，和一个 2000 至 3000 之间的联系电话的银行账户文档

# 查询集合中存在（大于）value1 至 （小于）value2，和一个（大于）value3 至（小于）value4 之间的 <field> 字段的文档
$ db.<collection>.find({
  <field>: {
    "all": [
      { $elemMatch: { $gt: <value1>, $lt: <value2> } },
      { $elemMatch: { $gt: <value3>, $lt: <value4> }}
    ]
  }
})
```

#### 正则表达式操作符

```bash
# 语法
{ <field>: { : /pattern/, : '<option>' } }

{ <field>: { : /pattern/<options> } }
```

在和 `$in` 操作符一起使用时，智能使用 `/pattern/<options>`

```bash
# 查询集合中文档字段 <field> 匹配正则 <pattern1> 或 <pattern2> 的文档
$ db.<collection>.find({ <field>: { $in: [ <pattern1>, <pattern2> ] } } )

# 查询集合中文档字段 <field> 匹配正则 <pattern>，且符合配置项的文档
 db.<collection>.find({ <field>: { $regx: <pattern>, $options: 'i' } } )
```

#### 文档游标

文档查询方法 `db.collection.find()` 会返回一个文档集合游标。

在不迭代游标的情况下，只会列出前 20 个文档。

```bash
const myCursor = db.<collection>.find();
```

游历完游标中所有的文档之后，或者 10 分钟之后，游标便会自动关闭

可以使用 `noCursorTimeout()` 函数来保持游标一直有效

```bash
const cursor = db.<collection>.find().noCursorTimeout()

cursor.close()
```

在这之后，在不遍历游标的情况下，你需要主动关闭游标。

其他游标函数：

| 游标函数                         | 说明                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cursor.hasNext()`               | 游标指向还有剩余的文档，会返回 `true`，否则 `false`                                                                                                                     |
| `cursor.next()`                  | 游标文档集合的下一个文档                                                                                                                                                |
| `cursor.forEach()`               | 对游标指向的每个文档遍历                                                                                                                                                |
| `cursor.limit(<number>)`         | 只是返回指定数量的结果                                                                                                                                                  |
| `cursor.skip(<offset>)`          | 跳过指定数量文档                                                                                                                                                        |
| `cursor.count(<applySkopLimit>)` | 集合文档的总量（默认忽略 `limit` 和 `skip`，除非 applySkipLimit 为 `true`）会从集合的元数据 Metadata 中取得结果，当数据库分布式结构较为复杂时，元数据中的文档数量不准确 |
| `cursor.sort(<document>)`        | 排序，`<document>` 定义排序的要求，`1` 表示又小及大，`-1` 表示逆向排序                                                                                                  |

⚠️ **注意：**游标函数方法执行顺序要准确

- `skip` 必然在 `limit` 执行前执行。

```bash
# 示例
$ db.<collection>.find().limit(<number>).skip(<number>)
```

- `sort` 必然在 `skip` 和 `limit` 之前执行

```bash
# 示例
$ db.<collection>.find().skip(<number>).limit(<number>).sort({ <field>: <sort-number> })
```

`<sort-number>` 表示文档排序，用数值表示：

- `0` 表示正序
- `1` 表示逆序

当结合在一起使用时，游标函数的应用顺序是 `sort()`、`skip()` 再到 `limit()`。

#### 文档投影

```bash
db.collection.find(<query>, <projection>)
```

不实用投影时，`db.collection.find()` 返回复合筛选字段的完整文档。

而使用投影可以有选择性地返回文档中的部分字段。

```bash
# 语法
{ field: inclusion }
```

- 1：表示返回字段
- 0：表示不返回字段

🌰 **示例：**

```bash
# 查询结果只返回 <field> 字段
$ db.<collection>.find({}, { <field>: 1 })

# 查询结果只返回 <field> 字段（不包括文档主键）
$ db.<collection>.find({}, { <field>: 1, _id: 0 })

# 查询结果既不返回 <field> 字段，也不返回文档主键
$ db.<collection>.find({}, { <field>: 0, _id: 0 })
```

除了文档主键之外，我们不可以在投影文档中混合使用包含和不包含这两种投影操作。

要么在投影文档中列出所有应该包含的字段，要么列出所有不应该包含的字段。

**在数组字段上使用投影**

- `$slice`：可以返回**数组**字段中的部分元素

```bash
$ db.<collection>.find({}, { _id: 0, <field1>: 1, <field2>: 1})

# 只返回数组中的正向数第一个数组成员
$ db.<collection>.find({}, { _id: 0, <field1>: 1, <field2>: { $slice: 1 }})

# 只返回数组中的倒向数第一个数组成员
$ db.<collection>.find({}, { _id: 0, <field1>: 1, <field2>: { $slice: -1 }})

# 只返回数组中的倒向数第二个数组成员
$ db.<collection>.find({}, { _id: 0, <field1>: 1, <field2>: { $slice: -2 }})

# 传数组，必然有两个成员，第一个 limit，第二个 skip
$ db.<collection>.find({}, { _id: 0, <field1>: 1, <field2>: { $slice: [1, 2] }})
```

`$elemMatch` 和 `$` 操作符可以返回数组字段中满足筛选条件的第一个元素。

```bash

$ db.<collection>.find({}, {
  { _id: 0, <field1>: 1, <field2>: { $elemMatch: { $gt: <value> } }
})
```

### 更新文档

```bash
db.<collection>.update(<query>, <update>, <options>)
```

- `<query>`：文档定义了更新操作时筛选文档的条件，与 `find()` 参数 `<query>` 涵义相同
- `<update>`：提供了更新的内容
- `<options>`：声明一些更新操作的参数

⚠️ **注意：**在更新文档的方法中 `<query>` 与查询文档的查询涵义相同，所以后续更新文档的示例第一个参数 `<query>` 直接以 `<query>` 表示。

#### 更新整篇文档

如果 `<update>` 文档不包含任何更新操作符，`db.collection.update()` 将会使用 `<update>` 文档直接替换集合中符合 `<query>` 文档筛选条件的文档。

```sh
# 查看集合中字段 <field> 的值为 <value> 的文档
$ db.<collection>.find({ <field>: <value> })
{ "_id": <object-id>, <field1>: <value1>, <field2>: <value2> }

# 将 alice 的账户余额更改为 123
# 将集合中字段 <field1> 的值为 <value1> 的文档中的 <field2> 的值该为 <value2>
$ db.<collection>.update({ <field1>: <value1> }, { <field1>: <value1>, <field2>: <value2> })
WriteResult({ "nMatched": 1, "nUpserted": 0, "nModified": 1 })
# nMatched 匹配的文档数量
# nModified 更改的文档数量
```

⚠️ **注意：**

- 文档主键 `_id` 是不可以更改的
- 在使用 `<update>` 文档替换整篇被更新文档时，只有第一篇符合 `<query>` 文档筛选条件的文档会被更新

#### 字段更新操作符

| 操作符    | 说明           |
| --------- | -------------- |
| `$set`    | 更新或新增字段 |
| `$unset`  | 删除字段       |
| `$rename` | 重命名字段     |
| `$inc`    | 加减字段值     |
| `$mul`    | 相乘字段值     |
| `$min`    | 比较减小字段值 |
| `$max`    | 比较增大字段值 |

##### \$set

更新或新增字段

```bash
# 查询集合中文档字段 <field> 的值为 <value> 的文档
$ db.<collection>.find({ <field>: <value> }).pretty()

# 在查询所得文档中，新增 <field2> 字段和 <field3> 内嵌文档
$ db.<collection>.update(
  <query>,
  {
    $set: {
      <field2>: <value2>,
      <field3>: {
        <field4>: <value3>,
        <field4>: <value4>,
      }
    }
  }
)
```

更新或新增内嵌文档的字段

```bash
# 更改查询所得文档中内嵌文档的值
$ db.<collection>.update(
  <query>,
  {
    $set: {
      "<field2>.<field3>": <value2>
    }
  }
)
```

更新或新增数组内的字段

```bash
# 更改查询所得文档中数组类型字段 <field2> 指定索引 <index> 的值
$ db.<collection>.update(
  <query>,
  {
    $set: {
      "<field2>.<index>": <value2>
:    }
  }
)

# 添加 <field2>.<index> 的值 <value2>
$ db.<collection>.update(
  <query>,
  {
    $set: {
      "<field2>.<index>": <value2>
    }
  }
)
```

如果向现有数组字段范围以外的位置添加新值，数组字段的长度会扩大，未被赋值的数组成员将被设置为 `null`。

**\$unset**

删除字段

```bash
{ $unset: { <field1>: "", ... } }
```

```bash
# 删除查询所得文档中的 <field1> 字段和内嵌文档 <field2> 中的 <field3> 字段
$ db.<collection>.update(
  <query>,
  {
    $unset: {
      <field1>: <value1>,
      "<field2>.<field3>": <value2>,
    }
  }
)

# 删除查询所得文档中的 <field1> 数组字段中的索引为 <index> 的值
$ db.<collection>.update(
  <query>,
  {
    $unset: {
      "<field1>.<index>": <value>
    }
  }
)
```

**\$rename**

重命名字段

如果 `$rename` 命令要重命名的字段并不存在，那么文档内容不会被改变。

```bash
$ db.<collection>.update(
  <query>,
  {
    $rename: {
      <field>: <value>
    }
  }
)
```

当 `$renmae` 命令中的新字段存在的时候，`$rename` 命令会先 `$unset` 新旧字段，然后再 `$set` 新字段。

重命名内嵌文档的字段

```bash
# 重命名查询所得文档的内嵌文档 <field1> 和数组字段 <field4> 索引为 <index> 的值
$ db.<collection>.update(
  <query>,
  {
    $rename: {
      <field1>: {
        <field2>: <value2>,
        <field3>: <value3>
      },
      "<field4>.<index>": {
        <fiedl5>: <value5>,
        <fiedl6>: <value6>
      }
    }
  }
)

# 重命名内嵌文档 <field> 字段 <field2> 的值
# 并将字段 <field3> 字段的值，改为 `<value2>.<value3>`
$ db.<collection>.update(
  <query>,
  {
    $rename: {
      "<field1>.<field2>": <value1>,
      "<field3>": "<value2>.<value3>"
    }
  }
)

# 数组内元素既不能内嵌文档字段拿到外部，也不能外部字段放到内部元素的内嵌文档中
$ db.<collection>.update(
  <query>,
  {
    $rename: {
      <field>: "<field1>.<index>.<field2>"
    }
  }
)
```

**\$inc** 和 **\$mul**

更新字段值，只适用于 Number 类型值。

- `$inc`：增加
- `$mul`：乘以

```bash
# 查询文档
$ db.<collection>.find({ <field>: <value> })
{ "_id": ObjectId("5bd446035b45a8e25a491832"), <field1>: <value1>, <field2>: <value2> }

# 更改查询所得文档的的 <field> 字段值
$ db.<collection>.update(
  <query>,
  {
    "$inc": {
      <field>: <value>
    }
  }
)

# 更新 David 的账户余额
$ db.<collection>.update(
  <query>,
  {
    "$mul": {
      <field>: <value>
    }
  }
)
```

如果被更新的字段不存在，`$inc` 会创建字段，并且将字段值设为命令中的增减值而 `$mul` 会创建字段，但是把字段值设为 0。

**\$min** 和 **\$max**

比较之后更新字段值。

```bash
# 实际文档中指定字段值与 <value> 作比较，保留较小的值
db.<collection>.update(
  <query>,
  {
    $min: {
      "<field1>.<field2>": <value>
    }
  }
)

# 类似的，实际文档中指定字段值与 <value> 作比较，保留较大的值
db.<collection>.update(
  <query>,
  {
    $max: {
      "<field1>.<field2>": <value>
    }
  }
)
```

时间相关

```bash
$ db.<collection>.update(
  <query>,
  {
    $min: {
      # 原值 ISODate("2050-02-01T22:00:00Z")，新值更早，所以会更新文档
      "<field1>.<field2>": ISODate("2020-02-01T22:00:00Z")
    }
  }
)
```

如果被更新的字段不存在，本来不存在的字段值会自动创建并设置为对应字段值。

如果被更新的字段类型和更新值类型不一致，`$min` 和 `$max` 命令会按照 BSON 数据类型排序规则进行比较。

1. Null
2. Numbers（ints、longs、doubles、decimals）
3. Symbol、String
4. Object
5. Array
6. BinData
7. ObjectId
8. Boolean
9. Date
10. Timestamp
11. Regular Expression

#### 数组更新操作符

| 操作符      | 说明                       |
| ----------- | -------------------------- |
| `$addToSet` | 向数组中增添元素           |
| `$pop`      | 从数组中移除元素           |
| `$pull`     | 从数组中选择性地一处元素   |
| `$pullAll`  | 从数组中有选择性地移除元素 |
| `$push`     | 想数组中增添元素           |

##### \$addToSet

向数组中增添元素

```bash
# 查看 Karen 的账户文档中添加联系方式
$ db.<collection>.update(
  <query>,
  {
    $addToSet: {
      <field>: <value>
    }
  }
)

# 插入对象
$ db.<collection>.update(
  <query>,
  {
    $addToSet: {
      <field1>: {
        <field2>: <value1>,
        <field3>: <value2>
      }
    }
  }
)
```

如果要插入的值已经存在数组字段中时，则 `$addToSet` 不会再添加重复值。

⚠️ **注意：**使用 `$addToSet` 插入数组和文档时，插入值中的**字段顺序**也和已有值重复的时候，才被算作重复值被忽略

向数组添加多个元素：

```bash
# 会将数组插入被更新的数组字段中，成为内嵌数组
$ db.<collection>.update(
  <query>,
  {
    $addToSet: {
      <field>: [ <value1>, <value2> ]
    }
  }
)
```

##### \$each

```bash
# 将多个成员的数组合并到数组字段中，而不是作为一个成员合并到数组字段中
$ db.<collection>.update(
  <query>,
  {
    $addToSet: {
      <field>: {
        $each: [ <value1>, <value2>, ..., <valueN>]
      }
    }
  }
)
```

##### \$pop

从数组字段中删除元素

```bash
# 将查询所得文档的 <field> 数组字段中删除最后一个值
$ db.<collection>.update(
  <query>,
  {
    $pop: {
      <field>: 1
    }
  }
)

# 将查询所得文档的 <field> 内嵌数组字段中删除第一个元素
$ db.<collection>.update(
  <query>,
  {
    $pop: {
      "<field>.<index>": -1
    }
  }
)
```

删除掉数组中最后一个元素后，会留下空数组

⚠️ 注意：`$pop` 操作符只能用于数组类型字段

##### \$pull

从数组字段中删除特定元素

```bash
# 删除查询所得文档中，数组字段 <field> 中包含符合 <pattern> 正则的成员的值
$ db.<collection>.update(
  <query>,
  {
    $pull: {
      <field>: {
        $regex: <pattern>
      }
    }
  }
)
```

如果要删除的元素是一个数组，数组元素的值和排列顺序都必须和被删除的数组完全一样。元素的数量、元素的值都需要完全一样。

##### \$push

向数组字段中添加元素

和 `$addToSet` 命令一样，如果 `$push` 命令中指定的数组字段不存在，这个字段会被添加到原文档中。

```bash
# 将 <value> 添加到数组字段 <field> 的成员中
$ db.<collection>.update(
  <query>,
  {
    $push: {
      <field>: <value>
    }
  }
)
```

##### \$pullAll

```bash
# 移除文档中数组字段 <field> 值为 <value1> 和 <value2> 的数组成员
$ db.survey.update({ _id: 1}, { $pullAll: { <field>: [ <value1>, <value2>, ..., <valueN>] } })
```

### 删除文档

```bash
# 删除所有文档
$ db.<collection>.remove({})

# 删除符合条件的文档
$ db.<collection>.remove({ <field>: { <comparasion-operators>: <value> } })
```

在默认情况下，`remove` 命令会删除所有符合筛选条件的文档。

如果只想删除满足筛选条件的第一篇文档，可以使用 `justOne` 选项。

[db.collection.drop()](https://docs.mongodb.com/manual/reference/method/db.collection.drop/)

删除集合，之前的 `remove` 命令可以删除集合内的所有文档，但是不会删除集合。

`drop` 命令可以删除整个集合，包括集合中的所有文档，以及集合的索引。

```bash
# 查看数据库集合列表
$ show collections
<collection>

# 删除 <collection> 集合
$ db.<collection>.drop()
> true

# 再查看集合列表就没有了
```

如果集合中的文档数量很多，使用 `remove` 命令删除所有文档的效率不高。

这种情况下，更加有效率的方法，是使用 `drop` 命令删除集合，然后再创建空集合并创建索引。

### 拷贝文档

拷贝一个

```bash
# 将 <field> 为 <value1> 的文档拷贝为 <value2> 的文档
$ db.<collection>.find(
  <query>,
  { _id: 0 }
).forEach(function(doc){
  var newDoc = doc;
  newDoc.<field> = <value>;
  db.<collection>.insert(newDoc);
})
```

## 数据库服务

## 启动数据库

```bash
$ cd /usr/local/mongodb/bin

$ sudo mongod
```

新建终端：

```bash
$ cd /usr/local/mongodb/bin

# 连接成功 MongoDB
$ ./mongo
```

关闭 MongoDB 服务：

```bash
$ use admin;

$ db.shutdownserver();
```
