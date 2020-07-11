---
nav:
  title: Linux
  order: 1
group:
  title: Linux 系统
  order: 1
title: 软件包
order: 5
---

# 软件包

软件包管理器是方便软件安装、卸载，解决软件以来关系的重要工具：

- CentOS、RedHat 使用 `yum` 包管理器，软件安装包格式为 `rpm`
- Debian、Ubuntu 使用 `apt` 包管理器，软件安装包格式为 `deb`

rpm 包格式：

```
vim-common-7.4.10-5.el7.x86_64.rpm
```

- `vim-common`：软件名称
- `7.4.10-5`：软件版本
- `el7`：系统版本
- `x86_64`：平台

## 其他方式安装

- 二进制安装
- 源代码变异安装

```bash
# 下载软件安装包
wget https://openrestry.org/download/openrestry-1.15.8.1.tar.gz

# 解压缩
tar -zxf openrestry-VERSION.tar.gz

# 切换目录
cd openrestry-VERSIOn/

./configure--prefix=/usr/local/openrestry

make -j2

# 把编译好的软件安装到指定目录
make install
```

## 升级内核

`rpm` 格式内核

```bash
# 查看内核版本
uname -f

# 升级内核版本 kernel-3.10.0
yum install kernel-3.10.0

# 升级已安装的其他软件包和补丁
yum update
```

源代码编译安装内核：

```bash
# 安装依赖包
yum install gcc gcc-c++ make ncurses-devel openssl-devel elfutils-libelf-devel

# 下载并解压缩内核
tar xvf linux-5.1..10.tar.xz-C /usr/src/kernels

# 配置内核编译参数
cd /usr/src/kernels/linux-5.1.10/

make menuconfig | allyesconfig | allnoconfig

# 使用当前系统内核配置
cp /boot/config-kernelversion.platform /usr/src/kernels/linux-5.1.10/.config

# 查看 CPU
lscpu

# 编译
make -j2 all

# 安装内核
make modules_install

make install
```