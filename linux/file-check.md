# 文本查看

## 查看文件

### cat

最常用，注意，如果文件很大的话，cat 命令的输出结果会疯狂在终端上输出，可以多按几次 ctrl + c 终止

```bash
# 查看文件大小
du -h file

# 查看文件内容
cat file
```

### less

既然 cat 有这个问题，针对比较大的文件，我们就可以使用 less 命令打开某个文件。
类似 vim，less 可以在输入/后进入查找模式，然后按 n(N)向下(上)查找。
有许多操作，都和 vim 类似，你可以类比看下。

### tail

大多数做服务端开发的同学，都了解这么命令。比如，查看 nginx 的滚动日志。

```bash
tail -f access.log
```

tail 命令可以静态的查看某个文件的最后 n 行，与之对应的，head 命令查看文件头 n 行。但 head 没有滚动功能，就像尾巴是往外长的，不会反着往里长。

```bash
tail -n100 access.log

head -n100 access.log
```

## 统计

sort 和 uniq 经常配对使用
sort 可以是哟功能 `-t` 指定分隔符，使用 `-k` 指定要排序的列。

下面这个命令输出 nginx 日志的 ip 和每个 ip 的 pv，pv 最高的前 10。

```bash
#2019-06-26T10:01:57+08:00|nginx001.server.ops.pro.dc|100.116.222.80|10.31.150.232:41021|0.014|0.011|0.000|200|200|273|-|/visit|sign=91CD1988CE8B313B8A0454A4BBE930DF|-|-|http|POST|112.4.238.213

awk -F"|" '{print $3}' access.log | sort | uniq -c | sort -nk1 -r | head -n10
```

## 其他

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

### diff

diff 命令用来比较两个文件是否的差异。当然，在 ide 中都提供了这个功能，diff 只是命令行下的原始折衷。对了，diff 和 patch 还是一些平台源码的打补丁方式，你要是不用，就 pass 吧。
