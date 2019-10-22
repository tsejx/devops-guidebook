# 中间件 Middleware

中间件（`pre` 和 `post` 钩子）是在异步函数执行时函数传入的控制函数。

Mongoose 4.x 有四种中间件：

* document 中间件
* model 中间件
* aggregate 中间件
* query 中间件

对于 document 中间件，`this` 指向当前 document。

Document 中间件支持以下 document 操作：

* `init`
* `validate`
* `save`
* `remove`

对于 `query` 中间件，`this` 指向当前 `query`。

Query 中间件支持以下 Model 和 Query 操作：

* `count`
* `find`
* `findOne`
* `findOneAndRemove`
* `findOneAndUpdate`
* `update`

Aggregate 中间件作用于 `MyModel.aggregate()`，它会在你对 aggregate 对象调用 `exec()` 执行。对于 aggregate 中间件，`this` 指向当前 `aggregation` 对象。

* `aggregate`

对于 Model 中间件，`this` 指向当前 model。

Model 中间件支持以下 Model 操作：

* `insertMany`

所有中间件支持 `pre` 和 `post` 钩子。

⚠️ **注意**：Query 是没有 `remove()` 钩子的，只有 document 有，如果你设定了 `remove` 钩子，他将会在你调用 `myDoc.remove()`（而不是 `MyModel.remove()`）时触发。

## Pre

`pre` 钩子分串行和并行两种。

### 串行

串行中间件是一个接一个地执行。

具体来说，上一个中间件调用 `next` 函数时，下一个执行。

```js
const schema = new Schema(..);

schema.pre('save', function(next){
    // do stuff
    next();
})
```

`next()` 不会阻止剩余代码运行。你可以使用提早 `return` 模式阻止 `next()` 后面的代码运行。

```js
const schema = new Schema(..);

schema.pre('save', function(next){
    if (foo()){
        console.log('calling next!')
        // `return next()` will make sure the rest of this function does't run
        /* return */
        next();
    }
    // Unless you comment out the `return` above, 'after next' will print
    console.log('after next');
})
```

### 并行

并行中间件提供细粒度流控制。

```js
const schema = new Schema(..);

// `true` means this is a parallel middleware. You **must** specify `true`
// as the second parameter if you want to use parallel middleware.
schema.pre('save', true, function(next, done){
    // calling next kicks off the next middleware in parallel
    next();
    setTimeout(done, 100);
})
```

在这个示例中，`save` 方法将在所有中间件都调用了 `done` 的时候才会执行。

### 使用场景

中间件对原子化模型逻辑很有帮助。这里有一些其它建议：

* 复杂的数据校验
* 删除依赖文档（删除用户后删除他的所有文章）
* asynchronous defaults
* asynchronous tasks that a certain action triggers

### 错误处理

如果 `pre` 钩子出错，mongoose 将不会执行后面的函数。Mongoose 会向回调函数传入 `err` 参数，或者 `reject` 返回的 Promise。

🌰 **示例：**

```js
schema.pre('save', funciton(next){
    const err = new Error('something went wrong');
    // If you call `next()` with an argument, that argument is assumed to be
    next(err);
})

schema.pre('save', function(){
    // You can also return a promise that rejects
    return new Promise((resolve, reject) => {
        reject(new Error('something went wrong'));
    })
})

schema.pre('save', function(){
    // You can also return a promise that rejects
    throw new Error('something went wrong')
})

schema.pre('save', function(){
    await Promise.resolve();
    // You can also throw an error in an `async` function
    throw new Error('something went wrong');
})

// later...

// Changes will not be persisted to MongoDB becasue a pre hook errored out
myDoc.save(function(err){
    console.log(err.message);
    // something went wrong
})
```

多次调用 `next()` 是无效的。如果你调用 `next()` 带有错误参数 `err1`，然后你再抛一个 `err2`，mongoose 只会传递 `err1`。

## Post

`post` 中间件在方法执行之后 调用，这个时候每个 pre 中间件都已经完成。

```js
schema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});

schema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

schema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});

schema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});
```

## 异步 post 钩子

如果你给回调函数传入两个参数，Mongoose 会认为第二个参数是 `next()` 函数，你可以通过 `next` 触发下一个中间件。

```js
// Takes 2 parameters: this is an asynchronous post hook
schema.post('save', function(doc, next) {
  setTimeout(function() {
    console.log('post1');
    // Kick off the second post hook
    next();
  }, 10);
});

// Will not execute until the first middleware calls `next()`
schema.post('save', function(doc, next) {
  console.log('post2');
  next();
});
```


