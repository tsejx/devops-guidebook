# 模式类型 SchemaTypes

处理字段路径各种属性定义。

合法类型：

- String 字符串
- Number 数字
- Date 日期
- Buffer 二进制
- Boolean 布尔值
- Mixed 混合类型
- ObjectId 对象 ID
- Array 数组
- Decimal128

## 选项

你可以直接声明 schema type 为某一种 type，或者赋值一个含有 `type` 属性的对象。

```js
var schema1 = new Schema({
  test: String, // `test` is a path of type String
});

var schema2 = new Schema({
  test: { type: String }, // `test` is a path of type string
});
```

除了 type 属性，你还可以对这个字段路径指定其他属性。 如果你要在保存之前要把字母都改成小写：

```js
var schema2 = new Schema({
  test: {
    type: String,
    lowercase: true, // Always convert `test` to lowercase
  },
});
```

### 全部可用

- `required`：布尔值或函数，如果值为真，为此属性添加 required 验证器
- `default`：任何值或函数，设置此路径默认值。如果是函数，函数返回值为默认值
- `select`：布尔值，指定 query 的默认 projections
- `validate`：函数 adds a validator function for this property
- `get`：函数使用 `Object.defineProperty()` 定义自定义 getter
- `set`：函数使用 `Object.defineProperty()` 定义自定义 setter
- `alias`：字符串仅 mongoose >= 4.10.0，为该字段路径定义虚拟值 gets/sets

### 索引相关

你可以使用 Schema Type 选项定义 MongoDB Indexes

- `index`：布尔值，是否对这个属性创建索引
- `unique`：布尔值，是否对这个属性创建唯一索引
- `sparse`：布尔值，是否对这个属性创建稀疏索引

```js
const schema = new Schema({
  test: {
    type: String,
    index: true,
    unique: true, // Unique index. If you specify `unique: true`
    // specifying `index: true` is optional if you do `unique: true`
  },
});
```

### String

- `lowercase`: 布尔值，是否在保存前对此值调用 `.toLowerCase()`
- `uppercase`: 布尔值，是否在保存前对此值调用 `.toUpperCase()`
- `trim`: 布尔值，是否在保存前对此值调用 `.trim()`
- `match`: 正则表达式，创建验证器检查这个值是否匹配给定正则表达式
- `enum`: 数组，创建验证器检查这个值是否包含于给定数组

### Number

- `min`: 数值，创建验证器检查属性是否大于或等于该值
- `max`: 数值，创建验证器检查属性是否小于或等于该值

### Date

- `min`: Date
- `max`: Date
