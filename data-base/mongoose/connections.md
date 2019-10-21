# 连接 Connections

## 连接数据库 connect

通过 `mongoose.connect()` 连接数据库，同时可以通过绑定事件监听器来监听数据库是否连接成功。

```js
// 1. 引入数据库驱动
const mongoose = require('mongoose');

// 2. 建立连接
mongoose.connect('mongodb://localhost/myapp', { useMongoClient: true });

// 设置回调函数
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', () => {
  console.log('connected db: myapp');
});
```

你可以在 URI 中指定多个参数：

```js
mongoose.connect('mongodb://username:password@host:port/database?options');
```

这是连接到本地 `db` 数据库默认接口（27017）的最小配置。本地连接失败可以尝试连接 `127.0.0.1`。

`connect()` 方法还接受一个选项对象 `options`，该对象将传递给底层驱动程序。这里所包含的所有选项优先于连接字符串中传递的选项。

**可选项：**

- `db`：数据库设置
- `server`：服务器设置
- `replset`：副本集设置
- `user`：用户名
- `pass`：密码
- `auth`：鉴权选项
- `mongos`：连接多个数据库

对于长期运行的后台应用，启用毫秒级 `keepAlive` 是精明的操作。

```js
mongoose.connect(url, { keepAlive: 120 })
```

如果连接需要**用户名**和**密码**：

```js
// 语法
mongoose.connect('mongodb://root:password@localhost/myapp');

// 例如：连接名为 eggcms 的数据库，账户名 eggadmin，密码123456
mongoose.connect('mongodb://eggadmin:123456@localhost:27017/eggcms');
```

## 操作缓存

你不必等待连接建立就可以使用你的 Mongoose models。

```js
mongoose.connect('mongodb://localhost:myapp');
const MyModel = mongoose.model('Test', new Schema({ name: String }));
// 可行
MyModel.findOne(function(err, result) {
  /* ... */
});
```

Mongoose 会缓存你的 model 操作。这个操作很方便，但也会引起一些疑惑，因为如果你没连上，Mongoose 不会抛错。

```js
const MyModel = mongoose.model('Test', new Schema({ name: String }));
// 连接成功前操作会被挂起
MyModel.findOne(function(error, result) {
  /* ... */
});

setTimeout(function() {
  mongoose.connect('mongodb://localhost/myapp');
}, 60000);
```

要禁用缓存，请修改 `bufferCommands` 配置。如果你打开了 `bufferCommands` 连接被挂起，尝试关闭 `bufferCommands` 检查你是否正确打开连接。你也可以全局禁用 `bufferCommands`：

```js
mongoose.set('bufferCommands', false);
```

## 选项

`connect` 方法接受 `options` 参数，这些参数会传入底层 MongoDB 驱动。

```js
mongoose.connect(uri, options);
```

重要选项：

- `autoReconnect`：底层 MongoDB 驱动在连接丢失后将自动重连。除非你是可以自己管理连接池的高手，否则不要吧这个选项设为 `false`
- `poolSize`：MongoDB 保持的最大 Socket 连接数。`poolSize` 的默认值是 5。
- `bufferMaxEntries`：MongoDB 驱动同样有自己的离线时缓存机制。如果你希望链接错误时终止数据库操作，请将此选项设为 0 以及把 `bufferCommands` 设为 `false`。

## 连接字符串选项

你也可以在连接字符串填写驱动选项，但是这只适用于 MongoDB 驱动使用的选项，所以类似于 `bufferCommands` 的 Mongoose 专用选项不能在连接字符串使用。

```js
mongoose.connect('mongodb://localhost:27017/test?connectTimeoutMs=1000&bufferCommands=false');
// The above is equivalent to:
mongoose.connect('mongodb://localhost:27017/test', {
  connectTimeoutMS: 1000,
  // Note that mongoose will **not** pull `bufferCommands` from the query string
});
```

把选项放在连接字符串的劣势是不便与阅读，优势是你只需要写一条连接而不需要把所有设定分开写。最佳实践是把区分**生产环境**和**开发环境**的选项如 `socketTimeoutMS` 、 `connectTimeoutMS` 放在 `uri` ， 把通用的常量如 `connectTimeoutMS` 、 `poolSize` 放在选项对象里。

## 副本集连接

要连接到副本集，你可以用逗号分隔，传入多个地址。

```js
mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);)
```

要连接到单节点副本集，需指定 `replicaSet` 选项。

```js
mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');
```

## 多 mongos 支持

使用高性能分片集群，需要连接多个 Mongos（MongoDB Shard）实例。

```js
// Connect to 2 mongos servers
mongoose.connect('mongodb://mongosA:27501,mongosB:27501', cb);
```

## 断开连接 disconnect

使用 `disconnect()` 方法可以断开连接。

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://root:password@localhost/blog', function(err) {
  if (err) {
    console.log('连接失败');
  } else {
    console.log('连接成功');
  }
});

setTimeout(function() {
  mongoose.disconect(function() {
    console.log('断开连接');
  });
});
```
