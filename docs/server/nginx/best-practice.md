---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 最佳实践
order: 80
---

# 最佳实践

1. 为了使 Nginx 配置更易于维护，建议为每个服务创建一个单独的配置文件，存储在 `/etc/nginx/conf.d` 目录，根据需求可以创建任意多个独立的配置文件。
2. 独立的配置文件，建议遵循以下命名约定 `<服务>.conf`，比如域名是 `mrsingsing.com`，那么你的配置文件的应该是这样的 `/etc/nginx/conf.d/mrsingsing.com.conf`，如果部署多个服务，也可以在文件名中加上 Nginx 转发的端口号，比如 `mrsingsing.com.8080.conf`，如果是二级域名，建议也都加上 `test.mrsingsing.com.conf`。
3. 常用的、复用频率比较高的配置可以放到 `/etc/nginx/snippets` 文件夹，在 Nginx 的配置文件中需要用到的位置 `include` 进去，以功能来命名，并在每个 `snippet` 配置文件的开头注释标明主要功能和引入位置，方便管理。比如之前的 `gzip、cors` 等常用配置，我都设置了 `snippet`。
4. Nginx 日志相关目录，内以 `<host域名>.type.log` 命名（比如 `test.mrsingsing.com.access.log` 和 `test.mrsingsing.com.error.log` ）位于 `/var/log/nginx/` 目录中，为每个独立的服务配置不同的访问权限和错误日志文件，这样查找错误时，会更加方便快捷。
