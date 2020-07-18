---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 函数
order: 6
---

# 函数

函数用于包含重复使用的命令集合。

自定义函数：

```bash
function fname() {
  # 命令 Command
}
```

函数名后的空括号表明正在定义的是一个函数。这种格式的命令规则和之前定义 Shell 脚本函数的格式一样。

要在脚本中使用函数，只需要像其他 Shell 命令一样，在行中指定函数名就行了。

函数的执行：

```bash
fname
```

## 参数变量

### 传递参数

函数的参数：

```bash
$1 $2 $3 ... $n
```

### 局部变量

函数作用范围的变量：

```bash
local 变量名
```

以下例子在函数内部声明变量 `index` 避免迭代过程索引受到外部影响

```bash
#!/bin/bash
# functions

checkpid() {
  local index

  for index in $* ; do
    [ -d "/proc/$i" ] && return 0
  done
  return 1
}

```

## 返回值

## 系统脚本

系统自建了函数库，可以在脚本中引用，目录是：`/etc/init.d/functions`

自建函数库：使用 `source` 函数脚本文件导入函数
