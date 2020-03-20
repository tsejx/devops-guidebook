---
nav:
  title: 服务器
  order: 2
group:
  title: 接口规范
  order: 3
title: RESTful API
order: 1
---

# RESTful API

REST（Representational State Transfer），即表现层状态传输。

## 设计原则

### URI

- 应该将 API 部署在专用域名之下，例如：`api.example.com`
- 不用大写
- 用中杠 `-` 而不用下杠 `_`
- 参数列表要 `encode`
- URI 中不应该出现动词，动词应该使用 HTTP 方法表示，但是如果无法表示，也可使用动词，例如 `search` 没有对应的 HTTP 方法，可以在路径中使用 `search`，更加直观
- URI 中的名词表示资源集合，使用复数形式
- 虽然 `/` 在 URI 中表达层级，但是避免为了追求 REST 导致层级过深，适当使用参数表示

```bash
GET /comments/uid?uid=1&pageNo=1
```

### Request

通过标准 HTTP 方法对资源进行 CRUD

**GET：查询资源**

```bash
# 获取所有评论
GET /comments
# 获取 aid 为 1 的文章的所有评论
GET /comments/aid/1
```

**POST：创建资源**

```bash
# 为 aid 为 1 的文章创建评论
POST /comments/aid/1
```

**PUT：更新资源**

```bash
# 为 cid 为 1 的评论点赞
PUT /comments/cid/like/1
```

**DELETE：删除资源**

```bash
# 删除 cid 为 1 的评论
DELETE /comments/cid/1
```

## Response

- 采用 JSON，不要使用 XML
- 默认情况下 JSON 外层不需要嵌套大括号，API 需要支持 JSONP 跨域访问或者客户端无法访问 HTTP header 才需要加上嵌套大括号
- 默认情况下不要过滤 API 输出中的空格，并且要支持 gzip

## API 版本控制

- 在 URI 中存放：`GET /v1/comments`
- 客户端在 Accept Header 中存放：`Accept: application/vnd.github.v3+json`，服务器自定义 Header 返回当前版本信息：`X-GitHub-Media-Type: github.v3;format=json`（Github 在用）
- 以上两种方法根据情况选择，Github 用的方式是 REST 中所要求的方式
- 测试 API 和正式 API 要进行区分，方式通过如上两种方式实现

## 速度限制

为了避免请求泛滥，给 API 设置速度限制很重要。为此 [RFC 6585](https://tools.ietf.org/html/rfc6585) 引入了 HTTP 状态码 429（too many requests）。加入速度设置之后，应该提示用户，至于如何提示标准上没有说明，不过流行的方法是使用 HTTP 的返回头。

下面是几个必须的返回头：

- `X-Rate-Limit`：当前时间段允许的并发请求数
- `X-Rate-Limit-Remaining`：当前时间段保留的请求数
- `X-Rate-Limit-Reset`：当前时间段剩余秒数

为什么使用当前时间段剩余秒数而不是时间戳？

时间戳保存的信息很多，但是也包含了很多不必要的信息，用户只需要知道还剩几秒就可以再发请求了这样也避免了 clock skew 问题。

## 缓存

HTTP 提供了自带的缓存框架。你需要做的是在返回的时候加入返回头信息，在接受输入的时候加入输入验证。基本两种方法：

- `ETag`：当生成请求的时候，在 HTTP 头里面加入 ETag，其中包含请求的校验和哈希值，这个值和在输入变化的时候也应该变化。如果输入的 HTTP 请求包含 If-None-Match 头以及一个 ETag 值，那么 API 应该返回 `304 not modified` 状态码，而不是常规的输出结果。
- `Last-Modified`：和 ETag 一样，只是多了一个时间戳。返回头里的 Last-Modified：包含了 RFC 1123 时间戳，它和 If-Modified-Since 一致。HTTP 规范里面有三种 date 格式，服务器应该都能处理。

## 覆盖 HTTP 方法

一些 HTTP 客户端只支持 GET 和 POST 请求。为了能够加强这些客户端的访问能力，API 需要能够覆盖 HTTP 方法。尽管这里没有任何强制的标准，但流行的做法是 API 会接收一个请求头 X-HTTP-Method-Override，它的值可以是 PUT、PATCH 或者 DELETE 三者之一。

注意，用来覆盖 HTTP 方法的 header 只能在 POST 请求中被接受。GET 请求永远不能修改服务器上的数据。

## 过滤信息

如果记录数量很多，服务器不可能都将它们返回给用户。API 应该提供参数，过滤返回结果。
下面是一些常见的参数：

```bash
# 指定返回记录的数量
?limit=10

# 指定返回记录的开始位置
?offset=10

# 指定第几页，以及每页的记录数
?page=2&per_page=100

# 指定返回结果按照哪个属性排序，以及排序顺序
?sortby=name&order=asc

# 指定筛选条件
?animal_type_id=1
```

## 错误处理

就像 HTML 的出错页面向访问者展示了有用的错误消息一样，API 也应该用之前熟悉易读的格式来提供有用的错误消息。错误的表现形式应该跟其他资源保持一致，只是用一些自己的字段。

API 应该一直返回合理的 HTTP 状态码。API 错误一般情况下分成两类：代表客户端错误的 400 系列状态码和代表服务端错误的 500 系列状态码。API 至少把所有 400 系列错误统一用易读的 JSON 格式来展示。如果可能（比如，如果负载均衡和反向代理能够创建自定义错误内容的话），500 系列的状态码也这么弄。

JSON 错误内容应该为开发者提供一些东西 - 有用的错误消息，唯一的错误码（通过它可以在文档中找到更多错误细节），可能的话提供错误细节描述。用 JSON 格式来输出错误看起来这样：

```json
{
  "code": 1234,
  "message": "Something bad happened :(",
  "description": "More details about the error here"
}
```

对于 PUT、PATCH 和 POST 的请求进行的校验错误需要嵌套多个字段。最佳做法是用固定的错误码来表示校验失败，然后在额外的 errors 字段中提供错误的细节，像这样：

```json
{
  "code": 1024,
  "message": "Validation Failed",
  "errors": [
    {
      "code": 5432,
      "field": "first_name",
      "message": "First name cannot have fancy characters"
    },
    {
      "code": 5622,
      "field": "password",
      "message": "Password cannot be blank"
    }
  ]
}
```

## HTTP 状态码

HTTP 定义了很多有意义的状态码，你可以在你的 API 中使用。这些状态码可以帮助 API 消费者用来路由它们获取到的响应内容。整理了一个你肯定会用到的状态码列表：

- 200 OK - 对成功的 GET、PUT、PATCH 或 DELETE 操作进行响应。也可以被用在不创建新资源的 POST 操作上
- 201 Created - 对创建新资源的 POST 操作进行响应。应该带着指向新资源地址的 Location header)
- 204 No Content - 对不会返回响应体的成功请求进行响应（比如 DELETE 请求）
- 304 Not Modified - HTTP 缓存 header 生效的时候用
- 400 Bad Request - 请求异常，比如请求中的 body 无法解析
- 401 Unauthorized - 没有进行认证或者认证非法。当 API 通过浏览器访问的时候，可以用来弹出一个认证对话框
- 403 Forbidden - 当认证成功，但是认证过的用户没有访问资源的权限
- 404 Not Found - 当一个不存在的资源被请求
- 405 Method Not Allowed - 所请求的 HTTP 方法不允许当前认证用户访问
- 410 Gone - 表示当前请求的资源不再可用。当调用老版本 API 的时候很有用
- 415 Unsupported Media Type - 如果请求中的内容类型是错误的
- 422 Unprocessable Entity - 用来表示校验错误
- 429 Too Many Requests - 由于请求频次达到上限而被拒绝访问

## 认证

RESTful API 应该是无状态。这意味着对请求的认证不应该基于 cookie 或者 session。相反，每个请求应该带有一些认证凭证。

如果一直使用 SSL，认证凭证可以简单的使用随机生成的 access token，把其做为 HTTP Basic Auth 中 user name 字段的值传给 API。这么做的好处是可以通过浏览器访问 - 如果浏览器从服务器收到 401 Unauthorized 状态码，它将会弹出一个对话框让人输出认证凭证。

当然，这种基于 token 来进行基本认证的方法只能当用户从 API 管理后台拷贝了一个 token 到自己的代码中才行。如果搞不到 token，只能使用 OAuth 2 来把安全 token 传递给第三方。OAuth 2 使用 Bearer token，并且也是基于 SSL 来保证传输安全。

支持 JSONP 的 API 可能需要第三种方法来实现认证，因为 JSONP 的请求没法发送 HTTP Basic Auth 凭证或者 Bearer token。这种情况下，可以使用一个额外的查询参数 access_token。注意：使用查询参数来传递 token 存在一个固有的安全隐患，因为大多数 web 服务器会在服务器日志中保存查询参数。

不管怎么样，以上三种方法是用来在 API 之间传输 token 的方法。实际传输的 token 可以是一样的。

## 使用 SSL

一定要使用 SSL。没有例外。如今，你的 web API 可以从任何有互联网的地方（像图书馆，咖啡馆，机场等等）被访问到。这些地方并不都是安全的。很多地方根本没有对网络连接进行加密，如果认证凭证被劫持的话，这样访问者很容易被窃听或者被冒充。

一直使用 SSL 的另一个优势是，加密的连接简化了用户认证的工作 - 你可以使用简单的 access token，而不需要对每个 API 请求进行签名。

需要注意的一件事是以非 SSL 的形式访问 API 的 URL。不要把请求跳转到它们的 SSL 版本上。直接抛出一个严重错误！

## Hypermedia API

RESTful API 最好做到 Hypermedia，即返回结果中提供链接，连向其他 API 方法，使得用户不查文档，也知道下一步应该做什么。
比如，当用户向http://api.example.com的根目录发出请求，会得到这样一个文档。

```json
{
  "link": {
    "rel": "collection https://www.example.com/comments",
    "href": "https://api.example.com/comments",
    "title": "List of comments",
    "type": "application/vnd.yourformat+json"
  }
}
```

上面代码表示，文档中有一个 link 属性，用户读取这个属性就知道下一步该调用什么 API 了。rel 表示这个 API 与当前网址的关系（collection 关系，并给出该 collection 的网址），href 表示 API 的路径，title 表示 API 的标题，type 表示返回类型。
Hypermedia API 的设计被称为 HATEOAS。

在进行分页查询时可以返回下一页的 URI，如果没有说明服务器已经取到最后一条数据了，客户端可以减少不必要的请求以及 URI 的构造，建议在分页的情况下使用。

---

**参考资料：**

- [RESTful API 编写指南](https://blog.igevin.info/posts/restful-api-get-started-to-write/)
