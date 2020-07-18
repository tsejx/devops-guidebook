---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 结构化命令
order: 5
---

# 结构化命令

## if else

```bash
if condition
then
  statements(s)
fi
```

- `condition` 是判断条件
  - 如果 condition 成立（返回 `true`），那么 `then` 后边的语句将会被执行
  - 如果 condition 不成立（返回 `false`），那么不会执行任何语句

注意，最后必须以 `fi` 来闭合，`fi` 就是 `if` 倒过来写。也正式有了 `fi` 来结尾，所以即使有神调语句也不需要用 `{}` 包围起来。

### if else 语句

```bash
#!/bin/bash

read a
read b

if (($a == $b))
then
  echo "a 和 b 相等"
else
  echo "a 和 b 不想等，输入错误"
fi
```

### if elif else 语句

```bash
if condition1
then
  statement1
elif condition2
then
  statement2
elif condition3
then
  statement3
...
else
  statementN
fi
```

⚠️ 注意，`if` 和 `elif` 后边都得跟着 `then`。

### 嵌套 if 语句

`if` 条件测试中可以再嵌套 `if` 条件测试

```bash
if [ 测试条件成立 ]
then 执行相应命令
  if [ 测试条件成立 ]
  then 执行相应命令
  fi
fi 结束
```

## case in

和其它编程语言类似，Shell 也支持两种分支结构（选择结构），分别是 if else 语句和 case in 语句。

基本格式：

```bash
case expression in
  pattern1) statement1;;
  pattern2) statement2;;
  pattern3 | pattern4) statement3;;
  *) default statement
esac
```

`case` 命令会将指定的变量与不同模式进行比较。如果变量和模式是匹配的，那么 Shell 会执行该模式指定的命令。可以通过竖线操作符在一行中分隔出多个模式。星号会捕获所有与已知模式不匹配的值。

示例：

```bash
$ cat case-in.sh
#!/bin/bash
# using the case command
#

case $USER in
rich | barbara)
    echo "Welcom $USER"
    echo "Please enjoy your visit";;
testing)
    echo "Special testing account";;
jessica)
    echo "Do not forget to log off when you're done";;
*)
    echo "Sorry, you are not allowed here";;
esac

$ ./case-in.sh
```

## for

`for` 命令用于创建遍历系列值的循环。每次迭代都是用其中一个值来执行已定义好的一组命令。

基本格式：

```bash
for var in list
do
  commands
done
```

> 可以将 do 语句和 for 语句放在同一行，但必须用分号将其同列表中的值分开：`for var in list; do`

```bash
#!/bin/bash
# basic for command

for item in Guangdong Sichuan Henan Heilongjiang Zhejiang Jiangsu
do
  echo The next province is $item
done
```

- `for` 循环假定每个值都是用空格分割的
- 当列表的值含有特殊字符，可以使用转义字符解决
- 当在某个值的两边使用双引号时，Shell 并不会将双引号当成值的一部分

### 从命令中读取值

生成列表中所需值的另外一个途径就是使用命令的输出。可以用命令替换来执行任何能产生输出的命令，然后在 `for` 命令中使用该命令的输出。

```bash
# for-read-values-from-a-file.sh

# !/bin/bash
# reading values from  a file

file="provinces"

for province in $(cat $file)
do
  echo "Visit beautiful $province"
done
```

同目录下的 `provinces.txt` 文件中：

```
Guangdong
Sichuan
Henan
Heilongjiang
Zhejiang
Jiangsu
```

该例子在命令替换中使用了 `cat` 命令来输出文件 `provinces` 的内容。`for` 命令仍然以每次一行的方式遍历了 `cat` 命令的输出，假定每个值都是在单独的一行上。但这并没有解决数据中有空格的问题。如果你列出了一个名字中有空格的值，`for` 命令仍然会将每个单词当作单独的值。

> 上述示例文件执行路径为相同目录，如果是其他目录下，需要使用全路径名来引用文件位置。

### 更改字段分隔符

造成上述无法分隔含有空格的值原因是特殊的环境变量 `IFS`，叫作 **内部字段分隔符**（internal field separator）。IFS 环境变量定义了 Bash Shell 用作字段分隔符的一系列字符。默认情况下，Bash Shell 会将下列字符当作字符分隔符：

- 空格
- 制表符
- 换行符

如果 Bash Shell 在数据中看到了这些字符中的任意一个，它就会假定这表明了列表中一个新数据字段的开始。在处理可能含有空格的数据（比如文件名）时，这会非常麻烦，就像你上一个脚本示例中看到的。

在 Shell 脚本中临时更改 IFS 环境变量，可以限制被 Bash Shell 当作字段分隔符的字符。

```bash
#/bin/bash
# reading values from a file

file="provinces"

IFS=$'\n'
for province in $(cat $file)
do
  echo "Visit beautiful $province"
done
```

### 用通配符读取目录

要用 `for` 命令来自动遍历目录中的文件，必须在文件名或路径名中使用通配符。文件扩展匹配是生成匹配指定通配符的文件名或路径名的过程。

如果不知道所有文件名，这个特性在处理目录中的文件时就非常有用。

```bash
#!/bin/bash
# iterate through all the files in a directory

for file in ./*
do
  if [ -d "$file"]
  then
    echo "$file is a directory"
  elif [ -f "$file" ]
  then
    echo "$file is a file"
  fi
done
```

### C 语言风格的 for 命令

基本格式：

```bash
for (( variable assignment ; condition ; iteration process ))
```

示例：

```bash
for (( i=1; i<= 10; i++ ))
do
  echo "The next number is $i"
done
```

## while

`while` 命令某种意义上是 `if-then` 语句和 `for` 循环的混合体。`while` 命令允许定义一个要测试的命令，然后循环执行一组命令，只要定义的测试命令返回的是退出状态码 0。它会在每次迭代的一开始测试 `test` 命令。在 `test` 命令返回非零退出状态码时，`while` 命令会停止执行那组命令。

基本格式：

```bash
while test command
do
  other commands
done
```

常见的用法是方括号来检查循环命令中用到的 Shell 变量的值：

```bash
#/bin/bash
# while command test

var1=10
while [ $var1 -gt 0 ]
do
  echo $var1
  var1=$[ $var1 - 1 ]
done
```

只要测试条件成立，`while` 命令就会不停地循环执行定义好的命令。在这些命令中，测试条件中用到的变量必须修改，否则就会陷入无限循环。

## until

`util` 命令和 `while` 命令工作的方式完全相反。`util` 命令要求你指定一个通常返回非零退出状态码的测试命令。只要测试命令的退出状态码不为 0，Bash Shell 才会执行循环中列出的命令。一旦测试命令返回了退出状态码 0，循环就结束了。

基本格式：

```bash
util test commands
do
  other commands
done
```

示例：

```bash
#!/bin/bash
# using the until command

num=100

until [ $num -eq 0 ]
do
    echo $num
    num=$[ $num - 25 ]
done
```

## break

`break` 命令是退出循环的一个简单方法。可以用 `break` 命令来退出任意类型的循环，包括 `while` 和 `until` 循环。

**跳出单体循环**

```bash
#!/bin/bash
# breaking out of a for loop

for num in 1 2 3 4 5 6 7 8 9 10
do
  if [ $num -eq 5 ]
  then
    break
  fi
  echo "Iteration number: $num"
done
echo "The for loop is completed"
```

`for` 循环通常都会遍历列表中指定的所有值。但当满足 `if-then` 的条件时，Shell 会执行 `break` 命令，停止 `for` 循环。

**跳出内部循环**

在处理多个循环时，`break` 命令会自动终止你所在的最内层的循环。

```bash
#!/bin/bash
# breaking out of an inner loop

for (( a = 1; a < 4; a++ ))
do
  echo "Outer loop: $a"
  for (( b = 1; b < 100; b++ ))
  do
    if [ $b -eq 5 ]
    then
      break
    fi
    echo "Inner loop: $b"
  done
done
```

**跳出外部循环**

有时你再内部循环，但需要停止外部循环。`break` 命令接受单个命令行参数值：

```bash
break n
```

其中 `n` 指定了要跳出的循环层级。默认情况下，`n` 为 1，表明跳出的是当前的循环。如果你将 `n` 设为 2，`break` 命令就会停止下一级的外部循环。

```bash
#!/bin/bash
# breaking out of an outer loop

for (( a = 1; a < 4; a++ ))
do
  echo "Outer loop: $a"
  for (( b = 1; b < 100; b++ ))
  do
    if [ $b -gt 4 ]
    then
      break 2
    fi
    echo "Inner loop: $b"
  done
done
```

## continue

`continue` 命令可以提前中止某次循环中的命令，但并不会完全终止整个循环。可以在循环内部设置 Shell 不执行命令的条件。这里有个在 `for` 循环中使用 `continue` 命令的简单例子。

```bash
#!/bin/bash
# using the continue command

for (( num = 1; num < 15; num++ ))
do
  if [ $num -gt 5 ] && [ $num -lt 10 ]
  then
    continue
  fi
  echo "Iteration number: $num"
done
```

当 `if-then` 语句的条件被满足时，Shell 会执行 `continue` 命令，跳过此次循环中剩余的命令，但整个循环还会继续。当 `if-then` 语句不再被满足时，一切又回到正轨。

也可以在 `while` 和 `until` 循环中使用 `continue` 命令，但要特别小心。记住，当 Shell 执行 `continue` 命令时，它会跳过剩余的命令。如果你在其中某个条件里对测试条件变量进行增值，问题就会出现。

```bash
#!/bin/bash
# improperly using the continue command in a while loop

num=0

while echo "while iteration: $num"
  [ $num -lt 15 ]
do
  if [ $num -gt 15 ] && [ $num -lt 10 ]
  then
    continue
  fi
  echo "Inside iteration number: $num"
  num=$[ $num + 1 ]
done
```

## 嵌套循环

循环语句可以在循环内使用任意类型的命令，包括其他循环命令。这种循环叫作嵌套循环（nested loop）。注意，在使用嵌套循环时，你是在迭代中使用迭代，与命令运行的次数是乘积关系。不注意着点话，有可能会在脚本中造成问题。

```bash
#!/bin/bash
# nesting for loops

for (( a = 1; a <= 3; a++ ))
do
  echo "Starting loop $a"
  for (( b = 1; b <= 3; b++ ))
  do
    echo " Inside loop: $b"
  done
done
```

`while` 循环内部放置一个 `for` 循环：

```bash
#!/bin/bash
# placing a for loop inside a while loop

num1=5

while [ $num1 -ge 0 ]
do
  echo "Output loop: $num1"
  for (( num2 = 1; num2 < 3; num2++ ))
  do
    num3=$[ $num1 * $num2 ]
    echo " Inner loop: $num1 * $num2 = $num3"
  done
  $num1=$[ $num1 - 1 ]
done
```

## 处理循环输出

如果需要对循环的输出使用管道或进行重定向，可以通过在 `done` 命令之后添加一个处理命令来实现。

```bash
for file in /home/rich/*
  do
    if [ -d "$file" ]
    then
      echo "$file is a direcoty"
    elif
      echo "$file is a file"
    fi
done > output.txt
```

## 实践应用

### 查找可执行文件

循环环境变量 `$PATH` 中的目录迭代。

```bash
#!/bin/bash
# finding files in the PATH

IFS=:
for folder in $PATH
do
  echo "$folder:"
  for file in $folder/*
  do
    if [ -x $file ]
    then
      echo "    $file"
    fi
  done
done
```

运行这段代码时，你会得到一个可以在命令行中使用的可执行文件的列表。

### 创建多个用户账户

通过添加新用户账户放在一个文本文件中，然后创建一个简单的脚本处理。

文本文件的格式：

```
userid,user name
```

`read` 命令会自动读取 `.csv` 文本的下一行内容，所以不需要专门再写一个循环来处理。当 `read` 命令返回 FALSE（也就是读取完整个文件时），`while` 命令就会退出。

```bash
#!/bin/bash
# process new user accounts

input="users.csv"
while IFS=',' read -r userid name
do
  echo "adding $userid"
  useradd -c "$name" -m $userid
done < "$input"
```

必须作为 `root` 用户才能运行这个脚本，因为 `useradd` 命令需要 `root` 权限。
