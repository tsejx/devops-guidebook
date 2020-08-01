---
nav:
  title: 代码管理
  order: 5
title: 移动和重命名 git mv
order: 11
---

# 移动和重命名 git mv

> Move or rename a file, a directory, or a symlin
>
> 用于移动或重命名文件，目录或符号链接。

## 重命名文件

如果你想重命名文件，并且将这个改名放入暂存区。`source` 必须存在，并且是文件，符号链接或目录。`destination` 为重命名后的名称。

```bash
git mv <source> <destination>
```

## 移动文件

移动 `<source>` 到 `<destination directory>` 。最后一个参数必须是目标目录。

索引在成功完成后更新，但仍必须提交更改。

```bash
git mv <source> ... <destination directory>
```
