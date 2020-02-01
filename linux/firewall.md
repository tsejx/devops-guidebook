# 防火墙

## 添加端口到防火墙

```bash
firewall-cmd --zone=public --add-port=你的端口/tcp permanet
systemctl restart firewalld.service
```

## 防火墙服务

firewalld 的基本使用

启动： systemctl start firewalld

关闭： systemctl stop firewalld

查看状态： systemctl status firewalld

开机禁用 ： systemctl disable firewalld

开机启用 ： systemctl enable firewalld

### 基本操作

启动一个服务：systemctl start firewalld.service
关闭一个服务：systemctl stop firewalld.service
重启一个服务：systemctl restart firewalld.service
显示一个服务的状态：systemctl status firewalld.service
在开机时启用一个服务：systemctl enable firewalld.service
在开机时禁用一个服务：systemctl disable firewalld.service
查看服务是否开机启动：systemctl is-enabled firewalld.service
查看已启动的服务列表：systemctl list-unit-files|grep enabled
查看启动失败的服务列表：systemctl --failed

3.配置 firewalld-cmd

查看版本： firewall-cmd --version

查看帮助： firewall-cmd --help

显示状态： firewall-cmd --state

查看所有打开的端口： firewall-cmd --zone=public --list-ports

更新防火墙规则： firewall-cmd --reload

查看区域信息: firewall-cmd --get-active-zones

查看指定接口所属区域： firewall-cmd --get-zone-of-interface=eth0

拒绝所有包：firewall-cmd --panic-on

取消拒绝状态： firewall-cmd --panic-off

查看是否拒绝： firewall-cmd --query-panic

那怎么开启一个端口呢

添加

firewall-cmd --zone=public --add-port=80/tcp --permanent （--permanent 永久生效，没有此参数重启后失效）

重新载入

firewall-cmd --reload

查看

firewall-cmd --zone= public --query-port=80/tcp

删除

firewall-cmd --zone= public --remove-port=80/tcp --permanent

## 设置端口

Ali 阿里云有防火墙

开放新端口

1. 实例安全组添加端口
2. 服务器添加新端口到防火墙配置中

https://blog.csdn.net/chenshiai/article/details/53639167

```bash
# 对外开放端口
firewall-cmd --permanent --add-port=8080-8085/tcp

# 重载端口
firewall-cmd --reload

# 删除端口
firewall-cmd --permanent --remove-port=8080-8085/tcp

# 查看防火墙开放端口
firewall-cmd --permanent --list-ports

# 查看使用互联网的服务
firewall-cmd --permanent --list-services
```

## iptables

---

**参考资料：**

- [iptables 详解](http://www.zsythink.net/archives/1199/)
