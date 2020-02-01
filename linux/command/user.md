# 用户管理

```bash
# 查看系统中所有用户
cut -d : -f 1 /etc/passwd

# 查看可以登录系统的用户
cat /etc/passwd | grep -v /sbin/nologin | cut -d : -f 1

# 查看登录用户
who

# 查看某一用户
w mysql

# 查看用户登录历史记录
last

# 创建新用户
adduser ftpusername

# 创建新用户，用户不允许登录（通过 ftp 可以连接）
adduser ftpusername -s /sbin/nologin

# 给用户设置密码
passwd ftpusername

# 创建用户工作组
groupadd clent

# 给已有的用户增加工作组
usermod -G clent ftpusername

# 永久性删除用户账号
userdel ftousername

# 永久性删除用户工作组
groupdel clent

# 查找用户遗留的文件和目录
find / -name ftpusername

# 删除用户目录
rm -rf /var/spool mail/ftpusername
rm -rf /home/ftpusername

# 编辑用户列表文件
vim /etc/passwd

# 编辑用户组列表文件
vim /etc/group

# 添加用户
useradd
# 为用户设置密码
passwd
# 删除用户
userdel
# 修改用户信息
usermod
# 添加用户组
groupadd
# 删除用户组
groupdel
# 修改用户组
groupmod
# 显示当前进程用户所属用户组
grouos
```