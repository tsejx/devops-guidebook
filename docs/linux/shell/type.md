---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 类型
order: 3
---

# 类型

## 字符串

字符串是 Shell 编程中最常用的数据类型之一（除了数字和字符串，也没有其他类型了）。

字符串可以由单引号 `''` 包围，也可以由双引号 `""` 包围，也可以不用引号。它们之间是有区别的，稍后我们会详解。

```bash
str1=helloworld

str2="helloworld"

str3='helloworld'
```

下面我们说一下三种形式的区别：

- 由单引号 `''` 包围的字符串：
  - 任何字符都会原样输出，在其中使用变量是无效的
  - 字符串中不能出现单引号，即使对单引号进行转义也不行
- 由双引号 `""` 包围的字符串：
  - 如果其中包含了某个变量，那么该变量会被解析（得到该变量的值），而不是原样输出
  - 字符串中可以出现双引号，只要它被转义了就行
- 不被引号包围的字符串
  - 不被引号包围的字符串中出现变量时也会被解析，这一点和双引号 `""` 包围的字符串一样
  - 字符串中不能出现空格，否则空格后边的字符串会作为其他变量或者命令解析

### 字符串长度

- 获取字符串变量的长度

```bash
STR="Hello world!"

echo ${#STR}
# 输出：12
```

- 获取字符串字节数

```bash
STR="Hello world!"

COUNT_BYTE=`echo "$STR" | wc -c`

echo $COUNT_BYTE
# 输出：13
```

- 获取字符串字数

```bash
STR="I am a man"
COUNT_WORD=`echo "$STR" | wc -w`

echo $COUNT_WORD　　
# 输出：4
```

### 字符串拼接

```bash
foo="Hello"
bar="world"

#中间不能有空格
str1=$foo$bar

#如果被双引号包围，那么中间可以有空格
str2="$foo $bar"

#中间可以出现别的字符串
str3=$foo": "$bar

#这样写也可以
str4="$foo: $bar"

#这个时候需要给变量名加上大括号
str5="${foo}Script: ${bar}index.html"
```

### 字符串比较

字符串相等：

```bash
USER_NAME="terry"

if [[ "$USER_NAME" = "terry" ]]; then
  echo "I am terry"
fi
```

字符串不相等：

```bash
USER_NAME="tom"

if [[ "$USER_NAME" != "terry" ]]; then
  echo "I am not terry"
fi
```

### 字符串截取

这种方式需要两个参数：除了指定起始位置，还需要截取长度，才能最终确定要截取的字符串。

获取后缀名：

```bash
ls -al | cut -d “.” -f2
```

#### 从字符串左边开始计数

```bash
${string: start :length}
```

- `string` 是要截取的字符串
- `start` 是起始位置（从左边开始，从 0 开始计数）
- `length` 是要截取的长度（省略的话表示直到字符串的末尾）

🌰 **示例：**

```bash
url="www.github.com"
echo ${url: 5: 6}
# github
```

#### 从字符串右边开始计数

```bash
${string: 0-start :length}
```

同第一种格式相比，第二种格式仅仅多了 `0-`，这是固定的写法，专门用来表示从字符串右边开始计数。

这里需要强调两点：

- 从左边开始计数时，起始数字是 `0`（这符合程序员思维）；从右边开始计数时，起始数字是 `1`（这符合常人思维）。计数方向不同，起始数字也不同。
- 不管从哪边开始计数，截取方向都是从左到右。

## 数组

在 Shell 中，用括号 `()` 来表示数组，数组元素之间用空格来分隔。由此，定义数组的一般形式为：

```bash
# 定义数组
arr=(ele1 ele2 ele3 ele4)
```

注意，赋值号 `=` 两边不能有空格，必须紧挨着数组名和数组元素。

Shell 属于弱类型的，它并不要求所有数组元素的类型必须相同。

```bash
nums=(20 40 "https://github.com")
```

第三个元素就是一个“异类”，前面两个元素都是整数，而第三个元素是字符串。

Shell 数组的长度不是固定的，定义之后还可以增加元素。例如，对于上面的 `arr` 数组，它的长度是 4，使用下面的代码会在最后增加一个元素，使其长度扩展到 5：

```bash
arr[4]=ele5
```

### 获取数组元素

```bash
# 显示数组指定索引的元素
${arr[index]}

# 显示数组第一个元素
${arr[0]}
```

其中 `arr` 是数组名，`index` 是下标。

使用 `@` 和 `*` 可以获取数组中的所有元素：

```bash
# 显示数组所有元素
${arr[*]}
${arr[@]}

# 显示数组元素个数
${#arr[@]}
```

### 数组拼接

拼接数组的思路是：先利用 `@` 或 `*`，将数组扩展成列表，然后再合并到一起。具体格式如下：

```bash
array_new=(${array1[@]}  ${array2[@]})
array_new=(${array1[*]}  ${array2[*]})
```

两种方式是等价的，选择其一即可。其中，`array1` 和 `array2` 是需要拼接的数组，`array_new` 是拼接后形成的新数组。

### 删除数组元素

```bash
unset array_name[index]
```

其中，`array_name` 表示数组名，`index` 表示数组下标。

如果不写下标，而是写成下面的形式：

```bash
unset array_name
```

那么就是删除整个数组，所有元素都会消失。
