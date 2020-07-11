---
nav:
  title: Linux
  order: 1
group:
  title: Shell 编程
  order: 5
title: 语句
order: 5
---

# 语句

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

**if else 语句**

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

**if elif else 语句**

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

## case in

## while

## until

## for

## for int

## select in

## break

## continue
