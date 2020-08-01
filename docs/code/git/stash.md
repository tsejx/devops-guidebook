---
nav:
  title: 代码管理
  order: 5
title: 储藏 git stash
order: 15
---

# 储藏 git stash

> Stash the changes in a dirty working directory away
>
> 将更改储藏在脏工作目录中

## 储藏文件修改

储藏文件修改，但是不用提交到版本库。

```bash
# 将所有文件修改添加至暂时储藏库
git stash

# 暂时储藏库包括未跟踪（untracked）的文件
git stash -u
```

## 查看储藏记录

```bash
git stash list
```

## 重回指定储藏版本

重新应用你刚刚实施的储藏（但是储藏的内容仍然在栈上）。

```bash
git stash apply <stash@{n}>
```

也可以应用更早的储藏，你需要通过名称指定它。如果你不指明，Git 默认使用最近的储藏并尝试使用它。

📍 **示例：**

```bash
git stash apply stash@{2}
```

## 重回最后储藏版本

重回最后一个储藏的版本，并删除这个储藏版本库中的版本。

```bash
git stash pop
```

## 移除储藏

你可以运行 `git stash drop` 加上你希望移除的储藏的名称来移除储藏。

```bash
git stash drop <stash@{n}>
```

📍 **示例：**

```bash
git stash drop stash@{0}
```

## 清空储藏

```bash
git stash clear
```
