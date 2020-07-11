---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 变量
order: 2
---

# 变量

## 定义变量

```bash
variable=value

variable='value'

variable="value"
```

`variable` 是变量，`value` 是赋给变量的值。

如果 `value` 不包含任何空白符（例如空格 Tab 缩进等），那么可以不使用引号；如果 `value` 包含了空白符，那么久必须使用引号包围起来。

> ⚠️ 注意，赋值号 `=` 的周围不能有空格，这可能和你熟悉的大部分编程语言都不一样

## 使用变量

使用定义过的变量，需要在变量名前加美元富豪 `$` 即可：

```bash
author="Steven"

echo ${author}
```

## 修改变量

```bash
author="Steven"

echo ${author}

author="Irenene"

echo ${author}
```

## 只读变量

```bash
slogan="Hello world!"

readyonly slogan

slogan="Hello Slogan."
```

## 删除变量

使用 `unset` 命令可以删除变量

```bash
unset variable_name
```

变量被删除后不能再次使用，`unset` 命令不能删除只读变量。

```bash
#!/bin/sh
repository="http://tsejx.github.com/"
unset repository
echo $repository
```

## 特殊变量

- `$0` 当前脚本的文件名
- `$n` 传递给脚本或函数的参数。`n` 是一个数字，表示第几个参数。例如，第一个参数是 `$1`，第二个参数是 `$2`。
- `$#` 传递给脚本或函数的参数个数
- `$*` 传递给脚本或函数的所有参数
- `$@` 传递给脚本或函数的所有参数

### 向脚本文件传递参数

```bash
#!/bin/bash

echo "Process ID: $$"
echo "File Name: $0"
echo "First Parameter: $1"
echo "Second Parameter: $2"
echo "All Parameters 1: $@"
echo "All Parameters 2: $*"
echo "Total: $#"
```

运行该脚本，并附带参数

```bash
$ . ./test.sh Shell Linux

Process ID: 10032
File Name: test.sh
First Parameter : Shell
Second Parameter : Linux
All parameters 1: Shell Linux
All parameters 2: Shell Linux
Total: 2
```

### 向函数传递参数

```bash
#!/bin/bash
#定义函数
function func(){
    echo "Language: $1"
    echo "URL: $2"
    echo "First Parameter : $1"
    echo "Second Parameter : $2"
    echo "All parameters 1: $@"
    echo "All parameters 2: $*"
    echo "Total: $#"
}
#调用函数
func Java Foo
```

运行结果：

```bash
Language: Java
URL: Foo
First Parameter : Java
Second Parameter : Foo
All parameters 1: Java Foo
All parameters 2: Java Foo
Total: 2
```

## \$?

`$?` 是一个特殊变量，用来获取上一个命令的退出状态，或者上一个函数的返回值。

### 获取上个命令的退出状态

```bash
#!/bin/bash

if [ "$1" === 100 ]
then
    exit 0 # 参数正确，退出状态为 0
then
    exit 1 # 参数错误，退出状态为 1
fi
```

`exit` 表示退出当前 Shell 进程，我们必须在新进程中运行 `test.sh`，否则当前 Shell 会话（终端窗口）会被关闭，我们就无法取得它的退出状态了。

```bash
$ bash ./test.sh 100

$ echo $?
0
```

### 获取函数的返回值

```bash
#!/bin/bash
#得到两个数相加的和
function add(){
    return `expr $1 + $2`
}

add 30 50  #调用函数

echo $?  #获取函数返回值
```

运行结果 `80`。

有 C++、C#、Java 等编程经验的读者请注意：严格来说，Shell 函数中的 `return` 关键字用来表示函数的退出状态，而不是函数的返回值；Shell 不像其它编程语言，没有专门处理返回值的关键字。
