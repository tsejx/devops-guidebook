---
nav:
  title: Linux
  order: 1
group:
  title: 命令分类
  order: 1
title: 文件管理
order: 3
---

# 文件管理

- 文件传输
  - `ftp` 用来设置文件系统相关功能
  - `scp` 加密的方式在本地主机和远程主机之间复制文件
- 文件处理
  - `touch` 创建新的空文件
  - `rename` 用字符串替换的方式批量改变文件名
  - `dirname` 去除文件名中的非目录部分
  - `ln` 用来为文件创建连接
  - `cat` 连接文件并打印到标准输出设备上
- 文件查找和比较
  - `diff` 比较给定的两个文件的不同
  - `which` 查找并显示给定命令的绝对路径
  - `find` 在指定目录下查找文件
  - `whereis` 查找二进制程序、代码等相关文件路径
- 文件内容查看
  - `tail` 在屏幕上显示指定文件的末尾若干行
  - `head` 在屏幕上显示指定文件的开头若干行
  - `less` 分屏上下范爷浏览文件内容
  - `more` 显示文件内容，每次显示一屏
  - `cut` 用来显示行的指定部分，删除文件中的指定字段
- 文件编辑
  - `vi` 功能强大的纯文本编辑器
  - `sed` 自动编辑文件，简化对文件的反复操作
- 文件权限属性设置
  - `chmod` 用来变更文件或目录的权限
  - `chown` 用来变更文件或目录的拥有者或所属群组
  - `stat` 用于显示文件的状态信息
  - `file` 用来探测给定文件的类型
- 文件过滤分隔与合并
  - `grep` 强大的文本搜索工具
  - `look` 显示文件中以指定字符串开头的任意行
  - `tac` 将文件已行为单位的反序输出
  - `sort` 将文件进行排序并输出
- 文件压缩与解压
  - `tar` Linux 下的归档使用工具，用于打包和备份
  - `gzip` 用于压缩文件
  - `gunzip` 用于解压缩文件
  - `zip` 可以用来解压缩文件
  - `unzip` 用于解压缩由 zip 命令压缩的压缩包
- 文件备份和恢复

## 文件传输

### scp

scp（secure copy）用来进行文件传输。也可以用来传输目录。也有更高级的 `sftp` 命令。

```bash
# 本地复制远程文件
# scp <remote-address> <local-address>
scp username@hostname:/usr/test/test.tar.gz /temp/test.tar.gz

# 远程复制本地文件
# scp <local-address> <remote-address>
scp /temp/test.tar.gz username@hostname:/usr/test/test.tar.gz

# 本地复制远程目录
# scp -r <remote-address> <loacal-address>
scp -r username@hostname:/usr/test/test.tar.gz /temp/test.tar.gz

# 远程目录复制至本地目录
# scp -r <local-address> <remote-address>
scp -r /temp/test.tar.gz username@hostname:/usr/test/test.tar.gz

# 本地复制远程文件到指定目录
# scp <remote-address> <local-address>
scp username@hostname:/usr/test/test.tar.gz /temp/test/

# 远程复制到本地文件到指定目录
# scp -r <local-address> <remote-address>
scp /temp/test.tar.gz username@hostname:/usr/test/test/tar.gz
```

## 文件处理

### ln

`ln` 命令用来为文件创件连接，连接类型分为硬连接和符号连接两种，默认的连接类型是硬连接。

使用 `-s` 选项，则源文件可以是文件或目录。创建硬链接时，则源文件参数只能是文件。

```bash
# 将当前目录的 afile 链接到当前目录下的文件 bfile
ln afile bfile

# 对源文件 afile 建立与 bfile 的符号连接，而非硬连接
ln -s afile bfile
```

Linux 具有为一个文件起多个名字的功能，称为链接。被链接的文件可以存放在相同的目录下，但是必须有不同的文件名，而不用在硬盘上为同样的数据重复备份。另外，被链接的文件也可以有相同的文件名，但是存放在不同的目录下，这样只要对一个目录下的该文件进行修改，就可以完成对所有目录下同名链接文件的修改。对于某个文件的各链接文件，我们可以给它们指定不同的存取权限，以控制对信息的共享和增强安全性。

文件链接有两种形式，即硬链接和符号链接。

**硬链接**

建立硬链接时，在另外的目录或本目录中增加目标文件的一个目录项，这样，一个文件就登记在多个目录中。如上述示例所示的 `m2.c` 文件就在目录 `mub1` 和 `liu` 中都建立了目录项。

创建硬链接后，己经存在的文件的 I 节点号（Inode）会被多个目录文件项使用。一个文件的硬链接数可以在目录的长列表格式的第二列中看到，无额外链接的文件的链接数为 `l`。

在默认情况下，`ln` 命令创建硬链接。`ln` 命令会增加链接数，`rm` 命令会减少链接数。一个文件除非链接数为 `0`，否则不会从文件系统中被物理地删除。

对硬链接有如下限制：

- 不能对目录文件做硬链接。
- 不能在不同的文件系统之间做硬链接。就是说，链接文件和被链接文件必须位于同一个文件系统中。

**符号链接**

符号链接也称为软链接，是将一个路径名链接到一个文件。这些文件是一种特别类型的文件。事实上，它只是一个文本文件，其中包含它提供链接的另一个文件的路径名，如图中虚线箭头所示。另一个文件是实际包含所有数据的文件。所有读、写文件内容的命令被用于符号链接时，将沿着链接方向前进来访问实际的文件。

### cat

`cat` 命令用于将文本内容显示到终端。

最常用，注意，如果文件很大的话，`cat` 命令的输出结果会疯狂在终端上输出，可以多按几次 `ctrl + c` 终止

```bash
# 查看文件大小
du -h file

# 查看文件内容
cat file
```

## 文件查找和比较

### diff

diff 命令用来比较两个文件是否的差异。当然，在 ide 中都提供了这个功能，diff 只是命令行下的原始折衷。对了，diff 和 patch 还是一些平台源码的打补丁方式，你要是不用，就 pass 吧。

### which

which 寻找可执行文件

```bash
which ifconfig
```

### find

`find` 命令用于在指定目录下查找文件。任何位于参数之前的字符串都将被视为欲查找的目录名。如果使用该命令时，不设置任何参数，则 `find` 命令将在当前目录下查找子目录与文件。并且将查找到的子目录和文件全部进行显示。

[详细命令参数](https://wangchujiang.com/linux-command/c/find.html)

```bash
# 列出当前目录及子目录下所有文件和文件夹
find .

# 在 /home 目录下查找以 .txt 结尾的文件名
find /home -name "*.txt"

# 查找用户遗留的文件和目录
find / -name ftpusername

# 任意字符以 wd 结尾
find /etc -regex .*wd

# 找到某个文件多久以前创建的（8 小时前更新）
find /etc/ -atime 8
```

根据文件类型进行搜索

```bash
find . type <类型参数>
```

类型参数列表：

- `f`：普通文件
- `l`：符号连接
- `d`：目录
- `c`：字符设备
- `b`：块设备
- `s`：套接字
- `p`：Fifo

基于目录深度搜索：

```bash
# 向下最大深度限制为 3
find . -maxdepth 3 -type f

# 搜索出深度距离当前目录至少 2 个子目录的所有文件
find . mindepth 2 -type f
```

## 文件查看

### tail

`tail` 命令用于查看文件结尾

```bash
# 查看文件 demo 的结尾
tail demo

# 查看文件 demo 最后三行
tail -3 demo
```

大多数做服务端开发的同学，都了解这么命令。比如，查看 Nginx 的滚动日志。

```bash
# 跟踪文件变化
# 常用参数 -f 文件内容更新后，显示信息同步更新
tail -f access.log
```

用 `ctrl + c` 退出跟踪文件变化。

`tail` 命令可以静态的查看某个文件的最后 n 行，与之对应的，`head` 命令查看文件头 n 行。但 head 没有滚动功能，就像尾巴是往外长的，不会反着往里长。

```bash
tail -n100 access.log

head -n100 access.log
```

### head

`head` 命令用于查看文件开头。

```bash
# 输出前 100 行，再通过 pipe，输出最后一行
head -100 README.md | tail -1
```

### less

既然 cat 有这个问题，针对比较大的文件，我们就可以使用 less 命令打开某个文件。
类似 vim，less 可以在输入/后进入查找模式，然后按 n(N)向下(上)查找。
有许多操作，都和 vim 类似，你可以类比看下。

### cut

```bash
# 查看 /etc/passwd 文件中使用最多的 Shell 脚本
cut -d ":" -f7 /etc/passwd | sort | uniq -c | sort -r
```

### wc

`wc` 命令用于统计文件内容信息。

```bash
# 查看文件 demo 行数
wc -l demo
```

可以先用 `wc` 命令查看文件行数，再决定用 `head` 或 `tail` 查看文件内容。

## 文件编辑

### vi / vim

多模式文本编辑器

四种模式：

- 正常模式（Normal-mode）
- 插入模式（Insert-mode）
- 命令模式（Command-mode）
- 可视模式（Visual-mode）

```bash
# 进入编辑器
vi

# 退出编辑器，<Enter> 为回车键
:q <Enter>
```

插入模式

```bash
# 进入插入模式
i

# 进入插入模式，并且光标跳转至当前光标的下一行
# 并且将原有下一行向下移动
o

# 与上个命令类似，只是该命令跳转为上一行
<Shift> 0
```

光标操作

```bash
# 向左
h

# 向下
j

# 向上
k

# 向右
l
```

复制粘贴

```bash
# 复制行（按下后界面没有任何提示）
yy

# 复制光标位置到结尾
y$

# 粘贴行
p

# 复制多行（有提示）
# 示例：复制连续三行
3yy

# 复制局部字符
# 光标移到复制字符开头
# <Shift> 4

# 剪切
dd

# 剪切光标位置到结尾
d$

# 撤销
u

# 撤销重做（返回上一次撤销）
u <Ctrl> + r

# 删除单个字符
x

# 显示行
:set nu

# 光标移动到指定行
# 移动到第 10 行
10G

# 移动到当前行开头（Shift + 6）
^

# 移动到当前行结尾（Shift + 4）
$
```

可视模式

三种进入可视模式的方式：

- `v`：字符可视模式
- `V`：行可视模式
- `ctrl + v`：块可视模式

```bash
# 进入可视模式
v
```

### sed

通常使用 `sed` 命令打印特定行

```bash
# -n：按特定格式打印
# 100p：指打印第一百行
sed -n 100p README.md
```

也可以打印一段范围的行

```bash
# 打印文件中第 100~200 行
sed -n 100,200p README.md
```

## 文件权限

- chown 用来改变文件的所属用户和所属组
- chmod 用来改变文件的访问权限

这两个命令，都和 Linux 的文件权限 777 有关。

### chmod

- 权限
  - `u`：针对属主操作
  - `g`：针对属组操作
  - `o`：针对其他用户操作
  - `a` 全部操作
- 操作类型
  - `+`：增加权限
  - `-`：减少权限
  - `=`：权限赋值
- 权限类型：
  - `r`：读
  - `w`：写
  - `x`：执行

例如：

- `u+r`：针对属主增加读取权限
- `g-w`：针对属组减少写进权限
- `o=x`：针对其他用户赋予执行权限

```bash
# 对 test 文件夹，属主增加「可执行」权限
chmod u+x /test

# 对 test 文件夹，属组增加「可执行」权限
chmod g+x /test

# 对 test 文件夹，属主减少「读取」权限
chmod u-r /test

# 数字表达（最大权限）
chmod 777 /test

# 毁灭性命令
chmod 000 -R /

# 修改 a 目录的用户和组为 ben
chown -R ben:ben a

# 给 a.bash 文件增加执行权限（常用）
chmod a+x a.bash
```

### chown

`chown` 用于更改属主、属组

```bash
# 修改 test 文件夹所属用户组为 group1
chown :group1 /test
```

### chgrp

`chgrp` 命令可以单独更改属组，不常用。

```bash
# 修改 test 文件夹所属用户组为 group1
chgrp /test group1
```

### stat

### file

## 文件过滤分割与合并

### grep

grep 用来对内容进行过滤，带上 `--color` 参数，可以在支持的终端打印彩色，参数 n 则输出具体的行数，用来快速定位。

比如：查看 nginx 日志中的 POST 请求。

```bash
grep -rn --color POST access.log
```

推荐每次都是用这样的参数。

如果我想要看某个异常前后相关的内容，就可以使用 ABC 参数。它们是几个单词的缩写，经常被使用。
A after 内容后 n 行
B before 内容前 n 行
C count? 内容前后 n 行

```bash
grep -rn --color Exception -A10 -B2 error.log
```

### sort

sort 和 uniq 经常配对使用
sort 可以是哟功能 `-t` 指定分隔符，使用 `-k` 指定要排序的列。

下面这个命令输出 nginx 日志的 ip 和每个 ip 的 pv，pv 最高的前 10。

```bash
#2019-06-26T10:01:57+08:00|nginx001.server.ops.pro.dc|100.116.222.80|10.31.150.232:41021|0.014|0.011|0.000|200|200|273|-|/visit|sign=91CD1988CE8B313B8A0454A4BBE930DF|-|-|http|POST|112.4.238.213

awk -F"|" '{print $3}' access.log | sort | uniq -c | sort -nk1 -r | head -n10
```

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

- 最早的 Linux 备份介质是磁带，使用的命令是 `tar`
- 可以打包后的磁带文件进行压缩储存，压缩的命令是 `gzip` 和 `bzip2`
- 经常使用的扩展名 `.tar.gz`、`.tar.bz2`、`.tgz`

### tar

可为 Linux 的文件和目录创建档案。利用 `tar`，可以为某一特定文件创建档案（备份文件），也可以在档案中改变文件，或者向档案中加入新的文件。

- 打包：将一大堆文件或目录变成一个总的文件
- 压缩：将一个大的文件通过一些压缩算法变成一个小文件

参数：

- `-c`：打包
- `-v`：显示过程
- `-f`：指定操作类型为文件
- `-t`：列出备份文件的内容
- `-x`：解包，从备份文件中还原文件
- `-z`：通过 gzip 指令处理文件

⚠️ **注意：**`tar` 命令参数没有 `-` 引导符

```bash
# 打包（将 /etc 目录打包到 /tmp/etc-backup.tar）
tar cf /tmp/etc-backup.tar /etc

tar czvf taget.tar destination

# 查阅包内文件
tar ztvf filename.tar.gz

# 解包（将 /tmp/etc-backup.tar 解压到 /root）
tar xf /tmp/etc-backup.tar -C /root

tar zxvf /opt/soft/test/filename.tar.gz
```

可以使用 `ls -l filename` 查看打包后文件的权限、创建事件、包大小等。

`tar` 集成了 `gzip` 命令和 `bzip2` 命令。

```bash
# gzip
tar czf /tmp/etc-backup.tar.gz /etc

# bzip2
tar cjf /tmp/etc-backup.tar.bz2 /etc
```

### gzip & gunzip

压缩

```bash
# 压缩为 .gz 格式的压缩文件，源文件会消失
gzip filename.txt

# 压缩为 .gz 格式的压缩文件，源文件不会消失
gzip -c filename.txt > filename.txt.gz

# 压缩目录下的所有子文件，但是不压缩目录
gzip -r /directory/
```

解压

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

压缩

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

解压

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
