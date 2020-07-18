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

## 基本操作

### 定义变量

变量名的命名规则：

- 字母、数字、下划线
- 不以数字开头

为变量赋值的过程，称为 **变量替换**。

```bash
# 变量名=变量值，等号两边不能有空格
variable=value

# 赋值字符，可以是单引号
variable='value'

# 也可以是双引号
variable="value"

# 使用 let 为变量赋值
let a=10+20

# 将命令赋值给变量
l=ls

# 将命令结果赋值给变量，使用 $() 或 ``
letc=$(ls -l /etc)
echo $letc

# 在列表中添加值
list="Guangzhou Shenzhen Zhuhai"
list=$list" Huizhou"
echo $list
```

变量值有空格等特殊字符可以包含在 `""`（双引号）或 `''`（单引号）中。

`variable` 是变量，`value` 是赋给变量的值。

如果 `value` 不包含任何空白符（例如空格 Tab 缩进等），那么可以不使用引号；如果 `value` 包含了空白符，那么久必须使用引号包围起来。

> ⚠️ 注意，赋值号 `=` 的周围不能有空格，这可能和你熟悉的大部分编程语言都不一样

### 使用变量

使用定义过的变量，需要在变量名前加美元符号 `$` 即可：

```bash
# 将字符串 "Steven" 赋值给变量 author
author="Steven"
```

变量的引用：

- `${变量名}` 称作对变量的引用
- `echo ${变量名}` 查看变量的值
- `${变量名}` 在部分情况下可以省略为 `$变量名`

```
# 使用 echo 输出变量 author
echo ${author}

echo $author
```

### 修改变量

```bash
author="Steven"

echo ${author}

author="Irenene"

echo ${author}
```

### 只读变量

```bash
slogan="Hello world!"

readyonly slogan

slogan="Hello Slogan."
```

### 删除变量

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

### 作用范围

变量作用范围只在

```bash
# 将 1 赋值给变量 a
a=1

# 打开新的子进程 bash
bash

# 输出变量 a，无内容
echo $a

# 将 2 赋值给变量 a（还是在子进程）
a=2

# 退出子进程
exit

# 输出变量 $a，值为 1
echo $a

# 执行某个脚本也是开启子进程，所以脚本内定义的变量对当前操作终端不生效
bash xx.sh
```

如果要在当前终端执行环境内生效，可以采用下面的命令：

```bash
source xx.sh
```

### 导出变量

使用 `export` 关键字可以让子进程获取到父进程的变量：

```bash
author="Steven"

export $author
```

## 系统环境变量

系统换机功能变量是每个 Shell 打开都可以或得到的变量。

查看环境变量：

```bash
# 分页查看环境变量配置文件
env | more

# 查看某个单独变量
echo $USER
echo $UID
echo $PATH
```

添加命令到当前环境变量路径：

```bash
# 编写一个 Shell 脚本文件
vim a.sh

# （脚本文件）内含以下命令
export "Hello Linux"

# 编写保存后，查看当前脚本文件所在路径
/root

# 将当前路径添加到 $PAHT
PAHT= $PATH:/root

# 直接执行脚本文件，输出 "Hello Linux"
a.sh
```

提示信息变量 `$PS1`。

## 特殊变量

- `$0` 当前脚本的文件名
- `$n` 传递给脚本或函数的参数。`n` 是一个数字，表示第几个参数。例如，第一个参数是 `$1`，第二个参数是 `$2`，第 10 个以上参数是 `${10}`、`${100}`
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

### 获取上个命令的退出状态

`$?` 是一个特殊变量，用来获取上一个命令的退出状态，或者上一个函数的返回值。

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

# 上条命令是否正确执行，0-正确，1-不正确
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

### 空的参数

当执行脚本文件时，第二个参数为空时

```bash
./a.sh -a
```

可以使用替换值：

```bash
#!/bin/bash

echo $1

# 当第二个参数为空，输出后面值 _
echo ${2}_

# 参数替换，如果 $2 取值为空值，将下划线 `_` 为位置二赋值
echo ${2-_}
```

## 环境变量配置文件

配置文件：

- `/etc/profile`
- `/etc/profile.d/`
- `~/.bash_profile`
- `~/.bashrc`
- `/etc/bashrc`

凡是 `/etc` 下的配置文件是所有用户通用的配置文件。

用户家目录 `~` 配置文件保存用户特有的配置文件。