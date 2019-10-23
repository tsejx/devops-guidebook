# 模式 Schema



## 索引 index

索引可以加快查询速度。索引分字段级别和 Schema 级别。

🌰 **示例：**

```js
const animalSchema = new Schema({
    name: String,
    type: String,
    tags: { type: [String], index: true } // field level
})

animalSchema.index({ name: 1, type: -1 }); // schema level
// 1 表示正序，-1 表示逆序
```

⚠️ **注意**：需要注意的是，当应用启动的时候，Mongoose 会自动为 Schema 中每个定义了索引的调用 `ensureIndex`，确保生成索引，并在所有的 `ensureIndex` 调用成功或出现错误时，在 Model 上发出一个 `index` 事件。开发环境用这个很好，但是建议在生产环境不要使用这个。

禁用 `ensureIndex` 方式：

```js
mongoose.connect('mongodb://localhost/blog', { config: { authoIndex: false } }) // 推荐

mongoose.createConenction('mongodb://localhost/blog', { config: { autoIndex: false} }) // 不推荐

animalSchema.set('autoIndex', false); // 推荐

new Schema({..}, { autoIndex: false }) // 不推荐
```

对于添加的每条索引，每次写操作（插入、更新、删除）都将耗费更多的时间。则是因为，当数据发生变化时，不仅要更新文档，还要更新集合上的所有索引。因此 MongoDB 限制每个集合最多有 64 个索引。通常，在一个特定的集合上，不应该拥有两个以上的索引。

### 唯一索引

```js
const ArticlesSchema = new Schema({
    title: {
        ...,
        index: true,
        unique: true
    }
}, { collection: 'articles' })
```


### 复合索引

```js
ArticlesSchema.index({ name: 1, by: -1 });
ArticlesSchema.index({ name: 1, by: -1 }, { unique: true })
```

