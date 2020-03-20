---
nav:
  title: 服务器
  order: 2
group:
  title: 守护进程
  order: 2
title: PM2
order: 2
---


# PM2 服务常驻

性能监控
自动重启
负载均衡

## 命令

```bash
# 开启服务
pm2 start app.js

# 监视器
pm2 monit

# 查看所有进程
pm2 list

# 查看某个进程的详细
pm2 show <id|name>
uuuuuuuuuuuuuuuuuu
# 清空所有日志文件
pm2 flush

# 停止 id 为 0 的应用程序
pm2 stop

# 停止所有应用
pm2 stop all

# 重启
pm2 restart

# 删除
pm2 delete

# 不间断重启
pm2 reload

```

```bash
--log-date-format "YYYY-MM-DD HH:MM"
```

- [pm2 start 命令中的 JSON 格式详解](https://www.cnblogs.com/bq-med/p/9012438.html)

- [CentOS 下查看端口占用情况，杀死进程](https://www.cnblogs.com/coder-lzh/p/8977232.html)

- [PM2 配置文件介绍](https://www.jianshu.com/p/e2a929ea8cfd)

- [使用 PM2 部署 Node Koa2 项目并实现自动重启](https://blog.csdn.net/ziwoods/article/details/72833233)