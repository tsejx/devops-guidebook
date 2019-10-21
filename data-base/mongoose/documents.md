# 文档 Documents

Mongoose document 代表着 MongoDB 文档的一对一映射。每个 document 都是他的 Model 的实例。

## 检索

MongoDB 有很多检索数据的方法。详情查看 [查询](queries.md)

## 更新

传统实现，使用 `findById` 查询到相对应的文档，修改后通过 `save()` 保存。

```js
Tank.findById(id, function(err, tank){
    if (err) return handleError(err);

    tank.size = 'large';
    // 或者使用 `.set()`
    tank.set({ size: 'large' })

    tanke.save(function(err, updatedTank){
        if (err) return handleError(err);
        res.send(updatedTank);
    })
})
```

如果我们仅仅需要更新而不需要获取该数据，`

## 覆盖

使用 `.set()` 覆盖整个文档。如果你要修改在中间件中被保存的文档，这样处理会比较方便。

```js
Tank.findById(id, function(err, tank){
    if (err) return hanleError(err);
    // Now `otherTank` is a copy of `tank`
    otherTank.set(tank);
})
```