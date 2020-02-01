# 备份压缩

- **文件压缩与解压**
  - **tar**：Linux 下的归档使用工具，用于打包和备份
  - **gzip**：用于压缩文件
  - **gunzip**：用于解压缩文件
  - **gzexe**：用于压缩可执行文件
  - **zip**：可以用来解压缩文件
  - **unzip**：用于解压缩由 zip 命令压缩的压缩包
  - **zipsplit**：将较大的 zip 压缩包分割成各个较小的压缩包
  - **compress**：使用 Lempress-Ziv 编码压缩数据文件
  - **uncompress**：用来解压 `.z` 文件
  - **zcat**：显示压缩包中文件的内容
  - **zfore**：强制为 gzip 格式的压缩文件添加 `.gz` 后缀
  - **znew**：将 `.z` 压缩包重新转化为 gzip 命令压缩的 `.gz` 压缩包
  - **zipinfo**：用来列出压缩文件信息
  - **bzip2**：将文件压缩成 `.bz2` 格式
  - **bunzip2**：创建一个 `.bz2` 文件压缩包
  - **bzdiff**：直接比较两个 `.bz2` 压缩包中文件的不同
  - **bzip2recover**：恢复被破坏的 `.bz2` 压缩包中的文件
  - **bzgrep**：使用正则表达式搜索 `.bz2` 压缩包中文件
  - **bzcat**：解压缩指定的 `.bz2` 文件
  - **bzless**：增强 `.bz2` 压缩包查看器
  - **bzmore**：查看 bzip2 压缩过的文本文件的内容
  - **bzcmp**：比较两个压缩包中的文件
  - **lha**：压缩或解压缩 `.lzh` 格式文件
  - **arj**：用于创建和管理 `.arj` 压缩包
  - **unarj**：解压缩由 `.arj` 命令创建的压缩包
- **文件备份和恢复**
  - **cpio**：用于建立、还原备份档的工具程序
  - **restore**：所进行的操作和 dunp 指令相反
  - **dump**：用于备份 ext2 或 ext3 文件系统

## 文件压缩与解压

为了减小传输文件的大小，一般都开启压缩。Linux 下常见的压缩文件有 tar、bzip2、zip、rar 等，7z 这种用的相对较少。

- `.tar` 使用 tar 命令压缩或解压
- `.bz2` 使用 bzip2 命令操作
- `.gz` 使用 gzip 命令操作
- `.zip` 使用 unzip 命令解压
- `.rar` 使用 unrar 命令解压

压缩率：

tar.bz2 > tar.gz > zip > tar

压缩率越高，压缩以及解压的时间也就越长

### tar

可为 Linux 的文件和目录创建档案。利用 `tar`，可以为某一特定文件创建档案（备份文件），也可以在档案中改变文件，或者向档案中加入新的文件。

- 打包：将一大堆文件或目录变成一个总的文件
- 压缩：将一个大的文件通过一些压缩算法变成一个小文件

**参数：**

- `-c`：打包
- `-v`：显示过程
- `-f`：指定打包后的文件名
- `-t`：列出备份文件的内容
- `-x`：从备份文件中还原文件
- `-z`：通过 gzip 指令处理文件

```bash
# 打包
tar -czvf filename.tar filename

# 查阅包内文件
tar -ztvf filename.tar.gz

# 解包
tar -zxvf /opt/soft/test/filename.tar.gz
```

### gzip & gunzip

**压缩**

```bash
# 压缩为 .gz 格式的压缩文件，源文件会消失
gzip filename.txt

# 压缩为 .gz 格式的压缩文件，源文件不会消失
gzip -c filename.txt > filename.txt.gz

# 压缩目录下的所有子文件，但是不压缩目录
gzip -r /directory/
```

**解压**

```bash
# 解压缩文件，不保留压缩包
gzip -d filename.txt.gz

# 解压缩文件
gunzip filename.gz
```

### zip & unzip

用来解压缩文件，或者对文件进行打包操作。

- `-k` 保留源文件
- `-d` 解开压缩文件
- `-r` 表示递归处理，将指定目录下的所有文件及子目录一并处理
- `-q` 不显示指令执行过程
- `-v` 显示指令执行过程
- `<压缩效率>` 压缩效率是一个介于 1-9 的数值。

**压缩**

```bash
# 将 /usr/html 目录下所有文件和文件夹打包为当前目录下的 html.zip
zip -q -r filename.zip /usr/filename

# 指定压缩率打包文件
zip -r8 filename.zip test/*

# 向压缩包增加文件（test.txt）
zip -u filename.zip test.txt

# 压缩时加密（密码为666666）
zip -r filename.zip test1 test -P 666666

# 删除压缩包的特定文件（删除 test 文件）
zip -d filename.zip test
```

**解压**

```bash
# 查看压缩包文件信息
unzip -l filename.zip

# 解压压缩包
unzip filename.zip

# 解压压缩包中指定文件
unzip -o filename.zip "test.txt"

# 解压压缩包至指定文件夹
unzip filename.zip -d dir/
```

## 文件备份和恢复

