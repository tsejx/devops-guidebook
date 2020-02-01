# 工作常用

## export

很多安装了 jdk 的同学找不到 java 命令，export 就可以帮你办到它。export 用来设定一些环境变量，env 命令能看到当前系统中所有的环境变量。比如，下面设置的就是 jdk 的。

```bash
export PATH=$PATH:/home/xjj/jdk/bin
```

有时候，你想要知道所执行命令的具体路径。那么就可以使用 whereis 命令，我是假定了你装了多个版本的 jdk。

## crontab

这就是 Linux 本地的 job 工具。不是分布式的，你要不是运维，就不要用了。比如，每 10 分钟提醒喝茶上厕所。

```bash
_/10 _ \* \* \* /home/xjj/wc10min
```

## date

date 命令用来输出当前的系统时间，可以使用 `-s` 参数指定输出格式。但设置时间涉及到设置硬件，所以有另外一个命令叫做 hwclock。

## xargs

xargs 读取输入源，然后逐行处理。这个命令非常有用。举个栗子，删除目录中的所有 class 文件。

```bash
find . | grep .class$ | xargs rm -rvf

#把所有的rmvb文件拷贝到目录
ls *.rmvb | xargs -n1 -i cp {} /mount/xiaodianying
```

---
https://www.cnblogs.com/xuxinstyle/p/9609551.html
find
ls
cd
tree
cp
rm
mv
pwd
tar
mkdir
rmdir
gzip
进程
ps
kill
killall
crontab
free
top
权限
chmod
chown
chgrp
useradd
usermod
userdel
groupadd
groupdel
sudo
passwd
groups
文本查看编辑
vi/vim
cat
more
less
tail
head
diff
网络
ping
ssh
scp
telnet
wget
ifconfig
route
搜索文件
whereis
locate
which
其他
grep
clear
date
ln

查看系统位数

```bash
getconf LONG_BIT
```

