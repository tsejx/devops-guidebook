---
nav:
  title: Linux
  order: 1
group:
  title: Linux 系统
  order: 1
title: 防火墙
order: 6
---

# 防火墙

## 添加端口到防火墙

```bash
firewall-cmd --zone=public --add-port=你的端口/tcp permanet
systemctl restart firewalld.service
```

### 基本操作

3.配置 firewalld-cmd

- 查看版本： firewall-cmd --version
- 查看帮助： firewall-cmd --help
- 显示状态： firewall-cmd --state
- 查看所有打开的端口： firewall-cmd --zone=public --list-ports
- 更新防火墙规则： firewall-cmd --reload
- 查看区域信息: firewall-cmd --get-active-zones
- 查看指定接口所属区域： firewall-cmd --get-zone-of-interface=eth0
- 拒绝所有包：firewall-cmd --panic-on
- 取消拒绝状态： firewall-cmd --panic-off
- 查看是否拒绝： firewall-cmd --query-panic

开启端口

```bash
# 添加
firewall-cmd --zone=public --add-port=80/tcp --permanent （--permanent 永久生效，没有此参数重启后失效）

# 重新载入
firewall-cmd --reload

# 查看
firewall-cmd --zone= public --query-port=80/tcp

# 删除
firewall-cmd --zone= public --remove-port=80/tcp --permanent
```

## 设置端口

Ali 阿里云有防火墙

开放新端口

1. 实例安全组添加端口
2. 服务器添加新端口到防火墙配置中

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

---

**参考资料：**

- [iptables 详解](http://www.zsythink.net/archives/1199/)
- [Linux (centos7) 防火墙命令](https://blog.csdn.net/chenshiai/article/details/53639167)
