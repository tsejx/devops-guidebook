# 子文档 Subdocuments

子文档是指嵌套在另一个文档中的文档。在 Mongoose 中，这意味着你可以在里嵌套另一个 Schema。

Mongoose 子文档有两种不同的概念：**子文档数组**和**单个嵌套子文档**。

```js
const childSchema = new Schema({ name: 'string' });

const parentSchema = new Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments.
  // Caveat: single nested subdocs only work
  // in mongoose >= 4.2.0
  child: childSchema,
});
```

子文档与普通 document 类似。嵌套 Schema 可以有自己的中间件、自定义检验逻辑、虚拟值以及其它顶层 Schemas 可用的特性。两者主要的不同点是子文档不能单独保存，他们会在他们的顶级文档保存时保存。

```js
const Parent = mongoose.model('Parent', parentSchema);

const parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] });

parent.children[0].name = 'Matthew';

// `parent.children[0].save()` 无操作，虽然他们触发了中间件
// 但是没有保存文档，你需要 save 他的父文档
parent.save(callback);
```

子文档与普通 document 一样有 `save` 和 `validate` 中间件。调用父文档的 `save()` 会触发其所有子文档 `save()` 中间件，`validate()` 中间件同理。

```js
childSchema.pre('save', function(next) {
  if ('invalid' === this.name) {
    return next(new Error('#sadpanda'));
  }
  next();
});

const parent = new Parent({ children: [{ name: 'invalid' }] });

parent.save(function(err) {
  console.log(err.message); // #sadpanda
});
```

子文档的 `pre('save')` 和 `pre('validate')` 中间件执行于顶层 document 的 `pre('save')` 之前，顶层 document 的 `pre('validate')` 之后。因为 `save()` 前的验证就是一个内置中间件。

```js
// 以下代码顺序打印出 1-4
const childSchema = new mongoose.Schema({ name: 'string' });

childSchema.pre('validate', function(next) {
  console.log('2');
  next();
});

childSchema.pre('save', function(next) {
  console.log('3');
  next();
});

const parentSchema = new mongoose.Schema({
  child: childSchema,
});

parentSchema.pre('validate', function(next) {
  console.log('1');
  next();
});

parentSchema.pre('save', function(ert) {
  console.log('4');
  next();
});
```

## 查找子文档

每个子文档都有一个默认的 `_id`。

Mongoose document 数组有一个特别的 `id` 方法，这个方法只要传入 `_id` 就能返回文档数组中特定文档。

```js
const doc = parent.children.id(_id);
```

## 添加子文档到数组

Mongoose 数组方法有 `push`、`unshift`、`addToSet` 及其它。

```js
const Parent = mongoose.model('Parent');
const parent = new Parent();

// Create a comment
parent.children.push({ name: 'Lies1' });
const subdoc = parent.children[0];

console.log(subdoc);
// { _id: 'xxx', name: 'Lies1' }

subdoc.isNew;
// true

parent.save(function(err) {
  if (err) return handleError(err);
  console.log('Success!');
});
```

## 删除子文档

每个子文档都有 `remove` 方法。另外，对于子文档数组，有一个等效方法 `.pull()`。对于单个嵌套子文档，`remove()` 与把这个文档的值设为 `null` 等效。

```js
// 等效于 `parent.children.pull(_id)`
parent.children.id(_id).remove();

// 等效于 `parent.child = null`
parent.child.remove();
paernt.save(function(err) {
  if (err) return handleError(err);
  console.log('The subdocs were removed');
});
```
