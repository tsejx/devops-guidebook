---
nav:
  title: 数据库
  order: 3
group:
  title: MongoDB
  order: 2
title: 备份与恢复
order: 7
---

# 索引

**索引**是对指定字段进行排序的数据结构。

在 Mongodb 典型的数据库查询场景中，索引 index 扮演着非常重要的作用，如果没有索引，MongoDB 需要为了找到一个匹配的文档而扫描整个 collection，代价非常高昂。

Mongodb 的索引使用的 B-tree 这一特殊的数据结构，借助索引 Mongodb 可以高效的匹配到需要查询的数据：


作者：wecatch
链接：https://juejin.im/post/5ad1d2836fb9a028dd4eaae6
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

![](../../snapshots/mongodb/mongodb-indexes.jpg)

- 索引通常能够极大的提高查询的效率，如果没有索引，MongoDB在读取数据时必须扫描集合中的每个文件并选取那些符合查询条件的记录。
- 这种扫描全集合的查询效率是非常低的，特别在处理大量的数据时，查询可以要花费几十秒甚至几分钟，这对网站的性能是非常致命的。
- 索引是特殊的数据结构，索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构



**复合键索引可以对多个字段进行排序**





合适的索引可以大大提升数据库搜索性能

集合层面的索引



## 索引类型

### 单键索引

![](../../snapshots/mongodb/mongodb-single-index.jpg)

### 复合键索引

![](../../snapshots/mongodb/mongodb-compound-index.jpg)

### 多键索引





## 索引特性

### 唯一性

文档主键上创建的默认索引 `_id`。

手动创建一个具有唯一性的索引

```bash
# 设置 unique 使得 <field> 具有唯一性
# 写入文档的每一个 <field> 字段的值都要是不同的，不可能存在相同字段值的文档
$ db.<collection>.createIndex({ <field>: <sort-value> }, { unique: true })
```

如果已有文档中的某个字段出现了重复值，就不可以再这个字段上创建唯一性索引。

如果新增的文档不包含唯一性索引字段，只有第一篇缺失该字段的文档可以被写入数据看，索引中该文档的键值呗默认为 `null`。

符合键索引也可以具有唯一性，在这种情况下，不同的文档之间，其所包含的符合键字段值的组合，不可以重复。

### 稀疏性

只将包含索引键字段的文档加入到索引中（即使索引键字段值为 `null`）

```bash
$ db.<collection>.createIndex({ <field>: <sort-value> }, { sparse: true })
```

如果同一个索引既具有唯一性，又具有稀疏性，就可以保存多篇缺失索引键值的文档了。

复合键索引也可以具有稀疏性，在这种情况下，只有在缺失复合键所包含的所有字段的情况下，文档才不会被加入到索引中。

### 生存时间

针对日期字段，或者包含日期元素的数组字段，可以使用设定了生存时间的索引，来自动删除字段值超过生存时间的文档。

索引的生存时间只应用单键索引，而复合键索引不具备生存时间特性。

当索引键是包含日期元素的数组字段时，数组中最小的日期将被用来计算文档是否已经过期。

数据库使用一个后台线程来检测和删除过期的文档，删除操作可能有一定的延迟。

## 索引的选择

- 如何创建一个合适的索引
- 索引对数据写入操作的影响



## 创建索引

```bash
# <keys> 参数指定了创建索引的文档字段
$ db.<collection>.createIndex(<keys>, <options>)


```

创建单键索引

```bash
# 创建一个单键索引
$ db.<collection>.createIndex({ <field>: <value> })

# 列出集合中已存在的索引
$ db.<collection>.getIndexes()
```

创建复合键索引

```bash
$ db.<collection>.createIndex({ <field1>: <sort-value1>, <field2>: <sort-value2> })
```

创建多键索引

```bash
# <field> 字段为数组类型字段
# <sort-value> 为 1 时正向排序
$ db.<collection>.createIndex({ <field>: <sort-value> })
```

`<options>` 文档定义了创建索引时可以使用的一些参数。`<options>` 文档也可以设定索引的特性。



## 查看索引





## 删除索引

```bash
$ db.<collection>.dropIndex()
```

如果需要更改某些字段上已经创建的索引，必须首先删除原有索引，再重新创建新索引，否则新索引不会包含原有文档。

```bash
# 可以通过名称删除索引，例如删除 name 字段
db.<collection>.dropIndex("name_1")

# 可以通过对象键值删除索引，同样是删除 name 字段
db.<collection>.dropIndex({ name: 1 })
```







## 索引效果



`db.<collection>.explain().<method(...)>`

可以使用 `explain` 进行分析的命令包括 `aggregate()`、`count()`、`distinct()`、`find()`、`group()`。





winningPlan 数据库认为最有效的查询方法



- COLLSCAN 低效查询
- IXSCAN 高效













