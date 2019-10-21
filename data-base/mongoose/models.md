# 模型 Models

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
## Model

Model 是从 Schema 编译来的构造函数。 它们的实例就代表着可以从数据库保存和读取的 documents。 从数据库创建和读取 document 的所有操作都是通过 model 进行的。

```js
const schema = new Schema({ name: String, size: String });
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
tank.save(function(err, doc) {
  if (err) return handleError(error);
});

// or

Tank.create({ size: 'small' }, function(err, doc) {
  if (err) return handleError(error);
  // saved
});
```

### 新增

文档新增有三种方法，一种是使用上面介绍过的文档的 `save()` 方法，另一种是使用模型 model 的 `create()` 方法，最后一种是模型 model 的 `insertMany()` 方法。

### 查询

支持 MongoDB 的高级（rich）查询语法。查询文档可以用 model 的 `find`、`findById`、`findOne` 和 `where` 这些静态方法。

```js
Tank.find({ size: 'small' })
  .where('createDate')
  .gt(oneYearAgo)
  .exec(callback);
```

查询 [Query API](query.md);

### 删除

`model` 的 `remove` 方法可以删除所有匹配查询条件（`conditions`）的文档。

```js
Tank.remove({ size: 'large' }, function(err) {
  if (err) return handleError(err);
});
```

### 更多

model 的 update 方法可以修改数据库中的文档，不过不会把文档返回给应用层。

如果想更新单独一条文档并且返回给应用层，可以使用 `findOneAndUpdate` 方法。


