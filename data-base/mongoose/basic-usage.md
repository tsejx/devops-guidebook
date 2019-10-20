# 基本用法

## 连接数据库

### connect

连接本地数据库 `blog`，同时绑定事件监听器来监听数据库是否连接成功。

```js
// 1. 引入数据库
const mongoose = require('mongoose');

// 2. 建立连接
mongoose.connect('mongodb://localhost/blog', { useMongoClient: true });

// 设置回调元函数
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.on('open', () => {
    console.log('connected db: blog');
})
```

在启动文件中调用，当然也可以将两个代码放在同个文件中。

```js
// app.js
const db = require('./db/connect');

db.start();
```

如果连接需要用户名和密码：

```js
// 语法
mongoose.connect('mongodb://root:password@localhost/blog')

// 例如：连接名为 eggcms 的数据库，账户名 eggadmin，密码123456
mongoose.connect('mongodb://eggadmin:123456@localhost:27017/eggcms');
```

### disconnect

使用 `disconnect()` 方法可以断开连接。

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://root:password@localhost/blog', function(err) {
    if (err) {
        console.log('连接失败')
    } else {
        console.log('连接成功')
    }
})

setTimeout(function() {
    mongoose.disconect(function() {
        console.log('断开连接')
    })
})
```

## 定义模型

### model

定义数据库模型：

model 里面的第一个参数，要注意：

1. 首字母大写
2. 要和数据库表（集合）名称对应

第一个参数是结构对象，每个键就是一个字段，你可以定义类型/默认值/验证/索引等。
第二个参数是可选的（默认是取 `model` 的第一个参数加 `s`），用来自定义 Collection 的名称。

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 先创建 Schema
const ArticleSchema = new Schema({
    articleId: { type: String },
    title: { type: String },
    content: { type: String },
    by: { type: String },
    modifyOn: { type: Date, default: Date.now },
}, { collection: 'articles' })

// 通过 Schema 创建 Model
const Article = mongoose.model('Article', ArticleSchema);
```

⚠️ **注意**：我们不需要手动去创建 Collection，当你操作时，如 Collection 不存在，会自动创建。

```js
// 默认会操作 users 表（集合）
const User = mongoose.model('User', UserSchema);

// 默认会操作第三个参数配置的表 user 表（集合）
const User = mongoose.model('User', UserSchema, 'user')
```

如果需要在 Schema 定义后添加其它字段，可以使用 `add` 方法。

```js
const MySchema = new Schema;
MySchema.add({ name: 'string', color: 'string', price: 'number' })
```

**timestamps**

在 Schema 中设置 timestamps 为 `true`，Schema 映射的文档 document 会自动添加 `createdAt` 和 `updatedAt` 这两个字段，代表创建时间和更新时间。

```js
const UserSchema = new Schema(
    {...},
    { timestamps: true }
)
```

**_id**

每个文档 document 都会被 Mongoose 添加一个唯一的 `_id`，`_id` 的数据类型不是字符串，而是 ObjectId 类型。如果在查询语句中要使用 `_id`，则需要使用 `findById` 语句，而不能使用 `find` 或 `findOne` 语句。

### 文档保存 save

```js
const Tank = mongoose.model('Tank', schema);

// 实例化文档 document
const tank = new Tank({ size: 'small' });

// 实例化后的文档必须通过 save 方法，才能将创建的文档保存到数据库的集合中，集合名称为模型名称的小写复数版
tank.save(function (err, doc) {
    if (err) return handleError(error)
})
```

## 自定义方法

Model 的实例是 document，内置实例方法有很多，如 `save`，可以通过 Schema 对象的 `methods` 属性给实例自定义扩展方法。

### 实例方法 methods

这里通过添加方法查询某个字段符合指定条件的文档。

```js
// 定义 Schema
const animalSchema = new mongoose.Schema({
    name: String,
    type: String
})

animalSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
}
```

现在，所有 `animal` 实例均有 `findSimilarTypes` 方法。

```js
const Animal = mongoose.model('Animal', animalSchema);

const dog = new Animal({ type: 'dog' })

dog.findSimilarTypes(function(err, dogs){
  console.log(dogs); // woof
})
```

* 重写 Mongoose 文档的方法可以会导致不可预测的结果
* 上述示例使用 `Schema.methods` 对象直接赋值实例方法，你也可以使用 `Schema.method()` 描述方法
* 不要使用 ES6 的箭头函数，箭头函数会阻止执行上下文的绑定

### 静态方法 statics

```js
animalSchema.statics.findByName = function(name, cb) {
    return this.find({ name: new RegExp(name, 'i')}, cb);
}
// 或者
animalSchema.static('findByBreed', function(breed){
  return this.find({ breed })
})

const Animal = mongoose.model('Animal'. animalSchema);

const animals = await Animal.findByName('fido');

ani = animals.concat(await Animal.findByBreed('Poodle'));
```

通过上述示例可以看出，实例方法和静态方法的区别在于，静态方法是通过 Schema 对象的 `statics` 属性给个 model 添加方法，实例方法是通过 Schema 对象的 `methods` 是给 document 添加方法。

### 查询方法

通过 Schema 对象的 `query` 属性，给 model 添加查询方法。

```js
animalSchema.query.byName = function(name) {
    return this.where({ name: new RegExp(name, 'i') });
}

const Animal = mongoose.model('Animal', schema);

Animal.find().byName('fido').exec(function(err, docs){
    console.log(docs);
})

Animal.findOne().byName('fido').exec(function(err, doc){
    console.log(doc);
})
```

## 文档查询

### 查询所有数据项 find

**语法：**

```js
Model.find(conditions, [projection], [options], [callback])
```

第一个参数表示查询条件，第二个参数用于控制返回的字段，第三个参数用于配置查询参数，第四个参数是回调函数。

```js
const schema = new mongoose.Schema({ age: Number, name: String })

const model = mongoose.model('model', schema);

model.find(function(err, docs) {
    console.log(docs);
    // [{ _id: xxx, name: 'xie', age: 18 },
    //  { _id: xxx, name: 'jun', age: 20 },
    //  { _id: xxx, name: 'xing', age: 22 },
    //  { _id: xxx, name: 'star', age: 24 } ]
})
```

找出年龄大于 20 的数据：

```js
model.find({ age: { $gte: 20 }}, function(err, docs) {
    console.log(docs);
    // [ { _id: xxx, name: 'jun', age: 20 },
    //  { _id: xxx, name: 'xing', age: 22 },
    //  { _id: xxx, name: 'star', age: 24 } ]
})
```

找出年龄大于 20 且名字中包含 `xing` 的数据：

```js
model.find({ name: /xing/, age: { $gte: 20 }}, function(err, docs) {
    console.log(docs);
    // [ { _id: xxx, name: 'xing', age: 22 } ]
})
```

找出名字中存在 `x` 的数据，且只输出 `name` 字段。

```js
model.find({ name: /x/ }, 'name', function(err, docs) {
    console.log(docs);
    // [{ name: 'xie' }, { name: 'xing' }]
})
```

如果确实不需要 `_id` 字段输出，可以进行如下设置：

```js
model.find({ name: /x/ }, { name: 1, _id: 0 }, function(err, docs){
    console.log(docs);
    // [{ name: 'xie' }, { name: 'xing' }]
})
```

### findById

**语法：**

```js
Model.findById(id, [projection], [options], [callback])
```

```js
const id = 'xxx'

model.findById(id, { lean: true }).exec(function(err, doc){
    console.log(doc);
    // { _id: xxx }
})
```

### findOne

该方法返回查找到的所有实例的第一个实例。

**语法：**

```js
Model.findOne([conditions], [projection], [options], [callback])
```

查询 `age > 20` 的文档中的第一个文档。

```js
model.findOne({ age: { $gt: 20 }}, function(err, doc) {
    console.log(doc);
    // { _id: xxx, name: 'jun', age: 22 }
})
```

查询 `age > 20` 的文档中的第一个文档，且只输出 `nmae` 字段。

```js
model.findOne({ age: { $gt: 20 }}, { name: 1, _id: 0 }, function(err, doc) {
    console.log(doc);
    // { name: 'jun' }
})
```

查询 `age > 20` 的文档中的第一个文档，且输出包含 `name` 字段在内的最短字段。

```js
model.findOne({ age: { $gt: 20 }}, 'name', { lean: true }, function(err, doc){
    console.log(doc);
    // { _id: xxx, name: 'jun' }
})
```

文档查询中，常用的查询条件：

| 查询标识        | 描述                                                     |
| --------------- | -------------------------------------------------------- |
| `$or`           | 或关系                                                   |
| `$nor`          | 或关系取反                                               |
| `$gt`           | 大于                                                     |
| `$gte`          | 大于等于                                                 |
| `$lt`           | 小于                                                     |
| `$lte`          | 小于等于                                                 |
| `$ne`           | 不等于                                                   |
| `$in`           | 在多个值范围内                                           |
| `$nin`          | 不在多个值范围内                                         |
| `$all`          | 匹配数组中多个值                                         |
| `$regex`        | 正则，用于模糊查询                                       |
| `$size`         | 匹配数组大小                                             |
| `$maxDistance`  | 范围查询，距离（基于LBS）                                |
| `$mod`          | 取模运算                                                 |
| `$near`         | 领域查询，查询附近的位置（基于LBS）                      |
| `$exists`       | 字段是否存在                                             |
| `$elemMatch`    | 匹配内数组内的元素                                       |
| `$within`       | 范围查询（基于LBS）                                      |
| `$box`          | 范围查询，矩形范围（基于LBS）                            |
| `$center`       | 范围查询，圆形范围（基于LBS）                            |
| `$centerSphere` | 范围查询，球形查询（基于LBS）                            |
| `$slice`        | 查询字段集合中的元素（比如从第几个之后，第N到第M个元素） |

### $where

如果要进行更复杂的查询，需要使用 `$where` 操作符，`$where` 操作符功能强大而灵活，它可以使用任意的 JavaScript 作为查询的一部分，包含 JavaScript 表达式的字符串或 JavaScript 函数。

```dash
> db.model.find()
< "_id": ObjecId<001>, "name": 'xie', "age": 18, "x": 1, "y": 2 >
< "_id": ObjecId<002>, "name": 'jun', "age": 20, "x": 1, "y": 1 >
< "_id": ObjecId<003>, "name": 'xing', "age": 22, "x": 2, "y": 1 >
< "_id": ObjecId<004>, "name": 'star', "age": 24, "x": 2, "y": 2 >
```

**字符串**

```js
model.find({ $where: 'this.x === this.y' }, function(err, docs){
  console.log(docs);
  // [ { _id: '002', name: 'jun', age: 20, x: 1, y: 1 },
  //   { _id: '004', name: 'star', age: 24, x: 2, y: 2 } ]
})
```

**函数**

```js
model.find({ $where: function() {
  return this.x !== this.y
}}, function(err, docs){
  console.log(docs);
  // [ { _id: '002', name: 'jun', age: 20, x: 1, y: 1 },
  //   { _id: '004', name: 'star', age: 24, x: 2, y: 2 } ]
})
```

## 文档更新

文档更新的方法：

* `update()`
* `updateMany()`
* `find()` + `save()`
* `findByIdAndUpdate()`
* `findOneAndUpdate()`

### update

**语法：**

```js
Model.update(conditions, doc, [options], [callback])
```

配置选项：

| 选项                | 默认值 | 说明                                  |
| ------------------- | ------ | ------------------------------------- |
| safe                | true   | 安全模式                              |
| upsert              | false  | 如果不存在则创建新纪录                |
| multi               | false  | 是否更新多个查询记录                  |
| runValidators       | false  | 执行 Validation 验证                  |
| setDefaultsOnInsert | true   | 在新建插入文档定义的默认值            |
| strict              |        | 以 strict 模式进行更新                |
| overwrite           | false  | 禁用 `update-only` 模式，允许覆盖记录 |

🌰 **示例：**

通过 `update()` 查询 `age` 大于 20 的数据，并将年龄更改为 40 岁。

```js
Model.update({ age: { $gte: 20 }}, { age: 40 }, function(err, raw) {
  console.log(raw)
  // { n: 1, nModified: 1, ok: 1 }
})
```

更改后数据库中，只有第一个数据更改为 40 岁，而其它三个数据没有发生变化：

```bash
> db.model.find()
< "_id": ObjecId<001>, "name": 'xie', "age": 18 >
< "_id": ObjecId<002>, "name": 'jun', "age": 40>
< "_id": ObjecId<003>, "name": 'xing', "age": 22>
< "_id": ObjecId<004>, "name": 'star', "age": 24>
```

如果要同时更新多个记录，需要设置 options 参数中的`multi` 为 `true`。

下面将名字中有 `'x'` 字符的年龄设置为 10 岁。

```js
Model.update({ name: /x/ }, { age: 10 }, { multi: true }, function(err, raw){
  console.log(raw);
  // { n: 2, nModified: 2, ok: 1}
})
```

如果设置的查找条件，数据库中的数据并不满足，默认什么事都不会发生。

### updateMany

`updateMany()` 与 `update()`  方法唯一的区别就是默认更新多个文档，即使设置 `{ multi: false }` 也无法只更新第一个文档。

```js
Model.updateMany(conditions, doc, [options], [callback])
```

更新数据库中名称带有 `'x'` 的数据，年龄变为 50 岁：

```js
Model.updateMany({ name: /x/ }, { age: 50 }, function(err, raw) {
  console.log(raw);
  // { n: 2, nModified: 2, ok: 1 }
})
```

#### findByIdAndUpdate

```js
Model.findByIdAndUpdate(id, { name: 'xxx', age: 'xxx' })
```

## 文档删除

有三种方法用于文档删除：

* `remove()`
* `findOneAndRemove()`
* `findByIdAndRemove()`

### remove

`remove` 有两种形式，一种文档的 `remove()` 方法，一种是 Model 的 `remove()` 方法。

**语法：**

```js
Model.remove(conditions, [callback])
```

删除数据库中名称包括  30 的数据。

```js
model.remove({ name: /30/ }, function(err){})
```

⚠️ **注意**：`remove()` 方法中的回调函数不能省略，否则数据不会被删除。当然，可以使用 `exec()` 方法来简写代码。

```js
model.remove({ name: /30/ }).exec()
```

文档的 `remove()` 方法：

```js
document.remvoe([callback])
```

删除数据库中名称包含 `xie` 的数据：

```js
model.find({ name: /xie/ }, function(err, doc){
  doc.forEach(function(item, index, arr){
    item.remove(function(err, doc){
      console.log(doc);
      // { _id: xxx, name: 'xie', age: 18 }
    })
  })
})
```

## 前后钩子

前后钩子即 `pre()` 和 `post()` 方法，又称为中间件，是在执行某些操作时可以执行的函数。中间件在 Schema 上指定，类似于静态方法或实例方法等。

可以在数据库执行下列操作时，设置前后钩子：

* `init()`
* `validate()`
* `save()`
* `remove()`
* `count()`
* `find()`
* `findOne()`
* `findOneAndRemove()`
* `findOneAndUpdate()`
* `insertMany()`
* `update()`

### pre

以 `find()` 为例，在执行 `find()` 方法之前，执行 `pre()` 方法。

```js
const schema = new mongoose.Schema({
  age: Number,
  name: String,
  x: Number,
  y: Number,
})

schema.pre('find', function(next){
  console.log('1')
  next()
})

schema.pre('find', function(next){
  console.log('2')
})

const model = mongoose.model('model', schema);

model.find(function(err, docs){
  console.log(docs[0])
  // 1
  // 2
  // { _id: xxx, name: 'xie', age: 18, x: 1, y: 2 }
})
```

### post

`post()` 方法并不是在执行某些操作后再去执行的方法，而在执行某些操作前最后执行的方法，`post()` 方法里不可以使用 `next()`。

```js
const schema = new mongoose.Schema({ age: Number, name: String, x: Number, y: Number });
schema.post('find', function(docs){
  console.log('1')
})
schema.post('find', function(docs){
  console.log('2')
})

const model = mongoose.model('model', schema);
model.find(function(err, docs){
  console.log(docs[0])
  // 1
  // 2
  // { _id: xxx, name: 'xie', age: 18, x: 1, y: 2 }
})
```

## 查询后处理

常用的查询后处理方法：

| 方法     | 说明     |
| -------- | -------- |
| sort     | 排序     |
| skip     | 跳过     |
| limit    | 限制     |
| select   | 显示字段 |
| exect    | 执行     |
| count    | 计数     |
| distinct | 去重     |

### sort

按 `age` 字段从大到小排序，按 `x` 从小到大。

```js
model.find().sort('-age').exec(function(err, docs){
  console.log(docs);
  // [{ _id: xxx, name: 'star', age: 24, x: 2, y: 2 },
  //  { _id: xxx, name: 'xing', age: 22, x: 2, y: 1 },
  //  { _id: xxx, name: 'jun', age: 20, x: 1, y: 2 },
  //  { _id: xxx, name: 'xie', age: 18, x: 1, y: 1 }]
})
```

### skip

跳过 2 个，显示其它。

```js
model.find().skip(2).exec(function(err, docs){
  console.log(docs);
})
```

### limit

显示 2 个。

```js
model.find().limit(2).exec(function(err, docs){
  console.log(docs);
})
```

### select

显示 `name`、`age` 字段，不显示 `_id` 字段。

```js
model.find().select('name age -_id').exec(function(err, docs){
  console.log(docs);
})
```

```jS
model.find().select({ name: 1, age: 1, _id: 0 }).exec(function(err, docs){
  console.log(docs);
})
```

### count

显示集合中的文档数量。

```js
model.find().count()
```

### distinct

获取集合中某个字段的值。

```js
model.find().distinct('age', function(err, distinct){
  console.log(distinct);
})
```

## 文档验证

常用验证包括以下几种：

| 验证项   | 说明                       |
| -------- | -------------------------- |
| required | 必填项                     |
| default  | 默认值                     |
| validate | 自定义匹配                 |
| min      | 最小值（只适用于数字）     |
| max      | 最大值（只适用于数字）     |
| match    | 正则匹配（只适用于字符串） |
| enum     | 枚举匹配（只适用于字符串） |

```js
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 18, min: 0, max: 20 },
  desc: { type: String, match: /a/, validate: validateLength },
  color: { type: String, enum: ['red', 'blue', 'yellow', 'green'],
})

function validateLength = function(arg){
  if (arg.length > 4){
    return true
  }
  return false
}
```

## 联表操作

联表操作：`population`

以类别 category 和文章 article 之间的关联为例：

```js
// 类别模型定义
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatrgotySchema = new Schema({
  name: { type: String, required: true, validate: { validator: (v) => v.trim().length, message: '名称不能为空' } },
  description: { type: String },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  recommend: { type: Boolean },
  index: { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Category', CategorySchema);
```

```js
// 文章模型定义
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true, unique: true },
	description: { type: String },
  content: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ types: Schema.Types.ObjectId, ref: 'Like' }],
  imgUrl: { type: String },
  recommend: { type: Boolean },
  index: { type: Number }
}, {
  timestamps: true
})
```

在对类别的操作中，都需要使用 `populate` 操作符显示出所包括的 Article 中的 `title`。

```js
/* 加载所有类别 */
app.get('/catrgories', (req, res) => {
  Category.find().populate('articles', 'title').select('number name description recommend index').exec((err, doc) => {
    if (err) return res.status(500).json({ code: 0, message: err.message, err })

    return res.status(200).json({ code: 1, message: '获取类别成功', result:{ doc } })
  })
})

/* 新增一个类别 */
app.post('/categories', adminAuth, (req, res) => {
  new Category(req.body).save((err, doc) => {
    if (err) return res.status(500).json({ code: 0, message: err.message, err })
    doc.populate({ path: 'articles', select: 'title' }, (err, doc) => {
      if (err) return res.status(500).json({ code: 0, message: err.message, err })

			return res.status(200).json({ code: 1, message: '新增成功', result: { doc } })
    })
  })
})
```

在对文章的操作中，则需要显示出类别 catrgory 的 number 属性。

```js
/* 按照ID加载一篇文章 */
app.get('/articles/:id', (req, res) => {
  Article.findById(req.params.id).populate('category', 'number').exec((err, doc) => {
    if (err) return res.status(500).json({ code: 0, message: err.message, err })

    if (doc === null) return res.status(404).json({ code: 0, message: '文章不存在' })

    return res.status(200).json({ code: 1, message: '获取文章成功', result: { doc } })
  })
})

/* 加载所有文章 */
app.get('/articles', (req, res) => {
  Article.find().select('title likes comments recommend imgUrl index').populate('category', 'number').sort('-createdAt').exec((err, docs) => {
    if (err) return res.status(500).json({ code: 0, message: err.message, err })
  })
})
```

在新增、更新和删除文章的操作中，都需要重建与 catrgory 的关联。

```js
/* 关联 category 的 articles 数组 */
relateCategory = (id) => {
  Category.findById(id).exec((err, categoryDoc) => {
    if (err) return res.status(500).json({ code: 0, message: err.message, err })

    if (categoryDoc === null) return res.status(404).json({ code: 0, message: '该类别不存在，请刷新后再试' })

    Article.find({ category: id }).exec((err, articleDocs) => {
      if (err) return res.status(500).json({ code: 0, message: err.message, err })

      categoryDoc.articles = articleDocs.map(t => t._id)
      categoryDoc.save(err => {
        if (err) return res.status(500).json({ code: 0, message: err.message, err })
      })
    })
  })
}

/* 按照 ID 更新一篇文章 */
app.put('/articles/:id', adminAuth, (req, res) => {
  Article.findById(req.params.id).exec((err, doc) => {
    if (err) return res.status(500).json({ status: 0, message: err.message, err })

    if (doc === null) return res.status(404).json({ code: 0, message: '文章不存在，请刷新后再试' });
    for (prop in req.body) {
      doc[prop] = req.body[prop]
    }
    doc.save((err) => {
      if (err) return res.status(500).json({ code: 0, message: err.message, err })
      doc.populate({ path: 'category', select: 'number' }, (err, doc) => {
        if (err) return res.status(500).json({ code: 0, message: err.message, err })

        relateCategory(doc.category._id);

        return res.status(200).json({ code: 1, message: '更新成功', result: { doc } })
      })
    })
  })
})
```

