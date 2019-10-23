# 填充 Populate

Populate 可以自动替换 document 中的指定字段，替换内容从其它 collection 获取。我们可以填充单个或多个 document、单个或多个纯对象，甚至是 query 返回的一切对象。

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
```

现在我们创建了两个 Model。`Person` model 的 `stories` 字段设为 `ObjectId` 数组。`ref` 选项告诉 Mongoose 在填充的时候使用哪个 model，本例中为 `Story` model。所有储存在此的 `_id` 都必须是 `Story` model 中 document `_id`。

## 保存 refs

保存 refs 与保存普通属性一样，把 `_id` 的值赋给它就好了：

```js
const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50,
});

author.save(function(err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id,
    // assign the _id from the person
  });

  story1.save(function(err) {
    if (err) return hanleError(err);
    // thats it!
  });
});
```

## Population

至此我们做的东西还是跟平常差不多，只是创建了 `Person` 和 `Story`。

```js
Story.findOne({ title: 'Casino Royale' })
  .populate('author')
  .exec(function(err, story) {
    if (err) return handleError(error);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
  });
```

被填充的字段已经不是原来的 `_id`，而是被指定的 document 代替，这个 document 由另一条 query 从数据库返回。`refs` 数组的远离也与此相似。对 query 对象调用 populate 方法，就能返回装载对应 `_id` 的 document 数组。

## 设置被填充字段

```js
Story.findOne({ title: 'Casino Royale' }, function(error, story) {
  if (error) {
    return handleError(error);
  }
  story.author = author;
  console.log(story.author.name); // prints 'Ian Fleming'
});
```

## 字段选择

如果我们只需要填充的 document 其中一部分字段怎么办。第二参数传入 `find name syntax` 就能实现。

```js
Story.
  .findOne({ title: /casino royale/i })
  .populate('author', 'name') // only return the Persons name
  .exec(function (err, story) {
    if (err) return handleError(err);

    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"

    console.log('The authors age is %s', story.author.age);
    // prints "The authors age is null'
  });
```

## 填充多个字段

一次填充多个字段。

```js
Story
  .find(...)
  .populate('fans')
  .populate('author')
  .exec()
```

如果对同一路径 `populate()` 两次，只有最后一次生效。

```js
// 第二个 `populate()` 覆盖了第一个，因为它们都填充 fans
Story.find()
  .populate({ path: 'fans', select: 'name' })
  .populate({ path: 'fans', select: 'email' });
// The above is equivalent to:

Story.find().populate({ path: 'fans', select: 'email' });
```

## Query 条件与其它选项

如果要根据年龄来填充，只填充 name，并且，只返回最多 5 个数据。

```js
Story.
  find(...).
  populate({
    path: 'fans',
    match: { age: { $gte: 21 }},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
    options: { limit: 5 }
  }).
  exec();
```
