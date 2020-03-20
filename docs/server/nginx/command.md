---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 命令行操作
order: 20
---

# 命令行操作

```bash
# 幫助
nginx -h

# 使用指定的配置文件
nginx -c

# 指定配置指令
nginx -g

# 指定运行目录
nginx -p

# 发送信号
nginx -s

# 立即停止服务
nginx -s stop

# 优雅地停止服务
nginx -s quit

# 重载配置文件
nginx -s reload

# 重新开始记录日志文件
nginx -s reopen

# 测试配置文件是否有语法错误
nginx -t

# 版本信息
nginx -v
```