---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: 基本概要
order: 1
---

# 基本概要

## 课程大纲

- 基础
  - 安装
  - 配置语法
  - 默认模块
  - 日志
  - 访问限制
  - 虚拟主机配置
- 场景实践
  - 静态资源服务
  - 代理服务
  - 常用的负载均衡实现方式
  - 数据缓存实现
- 深度学习
  - 实现动静分离及场景配置
  - rewrite / Nginx 防盗链
  - 网站访问加速常用方法
  - HTTPS 服务
  - Nginx 和 Lua 开发
  - 进阶模块配置
- 架构
  - 常见问题
  - 基于中间件性能优化
  - Nginx 与安全
  - 新版本特性
  - 中间件架构设计

## 使用场景

- 静态资源服务器
  - 通过本地文件系统提供服务
- 反向代理服务
  - Nginx 的强大性能
  - 缓存
  - 负载均衡
- API 服务
  - OpenResty

* 解决跨域
* 请求过滤
* 配置 Gzip
* 负载均衡

[CentOS7 nginx 安装/启动/进程状态/杀掉进程](https://www.cnblogs.com/hailang8/p/8664413.html)

## 组成部分

- Nginx 二进制可执行文件：由各模块源码编译出的一个文件
- Nginx.conf 配置文件：控制 Nginx 的行为
- access.log 访问日志：记录每一条 HTTP 请求信息
- error.log 错误日志：定位问题

## 其他资料

- [慕课网：Nginx 入门到实践－Nginx 中间件](https://coding.imooc.com/class/121.html)
- [慕课网：新版 Nginx 体系化深度精讲，从青铜到王者的飞跃](https://coding.imooc.com/class/chapter/405.html)
- [极客课程](https://www.bilibili.com/video/av67670336?p=2)
- [Nginx 从入门到实践（慕课网课程笔记）](https://juejin.im/post/5a2600bdf265da432b4aaaba)
- [Nginx 开发从入门到精通](https://github.com/taobao/nginx-book)
- [前端开发者必备的 Nginx 知识](https://zhuanlan.zhihu.com/p/68948620?utm_source=wechat_session&utm_medium=social&utm_oi=58000878338048)
