---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 命令组合
order: 19
---

# 命令组合

## 文件管理

**获取指定目录下最新修改的文件的文件名**

参数：

- `<dirname>`：查找的目录
- `<filename>`：匹配文件名

```bash
ls -lt /<dirname>/ | grep <filename> | head -n 2 |awk '{print $9}'
```

如果不匹配文件名，可以把 `grep` 的命令去除

**获取当前目录名称**

```bash
basename $(pwd)

# or
basename $(pwd)
```
