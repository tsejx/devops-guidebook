# 插件 Plugins

Schema 是可拓展的，你可以用打包好的功能拓展你的 Schema。

试想数据库中有很多个 collection，我们需要对它们都添加记录「最后修改」的功能。创建一次插件，然后应用到每个 Schema 就好了。

```js
// lastMode.js
module.exports = exports = function lastModifiedPlugin(schema, options){
    schema.add({ lastMode: Date })

    schema.pre('save', function(next){
        this.lastMod = new Date();
        next();
    });

    if (options && options.index){
        schema.path('lastMod').index(options.index);
    }
}

// game-schema.js
const lastMod = require('./lastMod');
const Game = new Schema({ ... });
Game.plugin(lastMod, { index: true });

// player-schema.js
const lastMod = require('./lastMod');
const Player = new Schema({ ... });
Player.plugin(lastMod);
```

这样就已经在 `Game` 和 `Player` 添加了记录最后修改功能， 同时对 `game` 的 `lastMod` 添加索引。这寥寥几行代码，看起来不错。

## 全局插件

想对所有 schema 注册插件？可以使用 mongoose 单例提供的 .plugin() 函数，请看例子：

```js
const mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));

const gameSchema = new Schema({ ... });
const playerSchema = new Schema({ ... });
// `lastModifiedPlugin` gets attached to both schemas
const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);
```
