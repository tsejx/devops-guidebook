# 查询 Queries

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






# 高级查询

`$inc` 增减修改器，只对数字有效。下面的实例：找到 `age = 22` 的文档,修改文档的 age 值自增 1

```js
Model.update(
  {
    age: 22,
  },
  {
    $inc: {
      age: 1,
    },
  }
);
// 执行后：age = 23
```

### 存在创建修改器

`$set` 指定一个键的值，这个键不存在就创建它。可以是任何 MondoDB 支持的类型。

```js
Model.update(
  {
    age: 22,
  },
  {
    $set: {
      age: 'haha',
    },
  }
);
// 执行后: age = 'haha'
```

### 存在删除修改器

`$unset` 同上取反，删除一个键。

```js
Model.update(
  {
    age: 22,
  },
  {
    $unset: {
      age: 'haha',
    },
  }
);
// 执行后: age 键不存在
```

## 数组修改器

`$push` 给一个键 push 一个数组成员,键不存在会创建

```js
Model.update(
  {
    age: 22,
  },
  {
    $push: {
      array: 10,
    },
  }
);
// 执行后: 增加一个 array 键，类型为数组, 有一个成员 10
```

`$addToSet` 向数组中添加一个元素，如果存在就不添加

```js
Model.update(
  {
    age: 22,
  },
  {
    $addToSet: {
      array: 10,
    },
  }
);
// 执行后: array 中有 10 所以不会添加
```

`$each` 遍历数组, 和 `$push` 修改器配合可以插入多个值

```js
Model.update(
  {
    age: 22,
  },
  {
    $push: {
      array: {
        $each: [1, 2, 3, 4, 5],
      },
    },
  }
);
// 执行后: array : [10,1,2,3,4,5]
```

`$pop` 向数组中尾部删除一个元素

```js
Model.update(
  {
    age: 22,
  },
  {
    $pop: {
      array: 1,
    },
  }
);
// 执行后: array : [10,1,2,3,4]  tips: 将1改成-1可以删除数组首部元素
```

`$pull` 向数组中删除指定元素

```js
Model.update(
  {
    age: 22,
  },
  {
    $pull: {
      array: 10,
    },
  }
);
// 执行后: array : [1,2,3,4]  匹配到 array 中的 10 后将其删除
```

## 条件查询

- `$lt` 小于
- `$lte` 小于等于
- `$gt` 大于
- `$gte` 大于等于
- `$ne` 不等于

```js
Model.find({
  age: {
    $gte: 18,
    $lte: 30,
  },
});
// 查询 age 大于等于 18 并小于等于 30 的文档
```

或查询 OR:

- `$in` 一个键对应多个值
- `$nin` 同上取反, 一个键不对应指定值
- `$or` 多个条件匹配, 可以嵌套 `$in` 使用
- `$not` 同上取反, 查询与特定模式不匹配的文档

```js
Model.find({
  age: {
    $in: [20, 21, 22, 'haha'],
  },
});
// 查询 age 等于 20 或 21 或 22 或 'haha' 的文档
```

```js
Model.find({
  $or: [
    {
      age: 18,
    },
    {
      name: 'xueyou',
    },
  ],
});
// 查询 age 等于 18 或 name 等于 'xueyou' 的文档
```

## 类型查询

`null` 能匹配自身和不存在的值，想要匹配键的值 为 `null`，就要通过 `$exists` 条件判定键值已经存在。

`$exists` (表示是否存在的意思)

```js
// 查询 age 值为 null 的文档
Model.find("age": {
  "$in": [null],
  "exists": true
});
```

```js
// 查询所有存在 name 属性的文档
Model.find(
  {
    name: { $exists: true },
  },
  function(error, res) {}
);
```

```js
// 查询所有不存在 telephone 属性的文档
Model.find(
  {
    telephone: {
      $exists: false,
    },
  },
  function(error, res) {
    // do something
  }
);
```

## 正则表达式

MongoDb 使用 Prel 兼容的正则表达式库来匹配正则表达式

```js
Model.find({
  name: /joe/i,
});
// 查询 name 为 joe 的文档, 并忽略大小写
```

```js
Model.find({
  name: /joe?/i,
});
// 查询匹配各种大小写组合
```

## 查询数组

```js
Model.find({
  array: 10,
});
//查询 array（数组类型）键中有 10 的文档, array : [1,2,3,4,5,10] 会匹配到
```

```js
Model.find({
  'array[5]': 10,
});
// 查询 array（数组类型）键中下标 5 对应的值是 10, array : [1,2,3,4,5,10] 会匹配到
```

`$all` 匹配数组中多个元素

```js
Model.find({
  array: [5, 10],
});
//查询 匹配 array 数组中 既有 5 又有 10 的文档
```

`$size` 匹配数组长度

```js
Model.find({
  array: {
    $size: 3,
  },
});
//查询 匹配 array 数组长度为 3 的文档
```

`$slice` 查询子集合返回

```js
Model.find({
  array: {
    $skice: 10,
  },
});
//查询 匹配 array 数组的前 10 个元素
```

```js
Model.find({
  array: {
    $skice: [5, 10],
  },
});
//查询 匹配 array 数组的第 5 个到第 10 个元素
```
