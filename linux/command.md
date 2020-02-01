# Command

```bash
ps aux | grep nginx
```

```bash
./nginx

./nginx -s reload

./nginx -s stop

./nginx -t
```

https://www.cnblogs.com/bluestorm/p/4574688.html

检查 网络

```bash
ping xx.xx.xx.xx
```

```bash
netstat -ntlp
```

查看 nginx 服务是否已经开启

```bash
systemctl status nginx

systemctl start nginx
```

查看端口在实例中是否正常被监听

```bash
netstat -an | grep 80
```

```bash
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
```

防火墙

```bash
启动： systemctl start firewalld
关闭： systemctl stop firewalld
查看状态： systemctl status firewalld
开机禁用  ： systemctl disable firewalld
开机启用  ： systemctl enable firewalld
```

https://www.cnblogs.com/mymelody/p/10490776.html

放行 TCP 80 端口

```bash
firewall-cmd --add-port=80/tcp --permanent
```

```bash
iptables -L -n
```

-A 参数就看成是添加一条 INPUT 的规则
-p 指定是什么协议，常用的 tcp 协议，当然也有 udp 例如 53 端口的 DNS

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
```
