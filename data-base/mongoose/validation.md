# 验证 Validation

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