---
nav:
  title: 部署
  order: 4
group:
  title: 部署理论
  order: 1
title: 基本概述
order: 2
---

# 基本概述

- 部署方案规划
- 待部署项目分析
- 选购及备案域名
- 厂商对比与选配阿里云服务器
- 初步 SSH 无密码登录连接和配置
- 搭建 Nodejs/MongoDB/Nginx 环境
- 配置 IPTables/Fail2Ban 防火墙及主动防御
- 域名 DNS 转移及 A 记录/CNAME 解析配置
- MongoDB 角色配置与安全规则设置
- 线上 MongoDB 单表单库导入导出与跨机迁移备份上传
- PM2 发布环境配置
- 服务器与 Git 仓库读写配置
- PM2 一键部署线上 Nodejs 项目
- 电影网站/ReactNative App 后台/微信公众号/微信小程序后台等项目实战部署
- SSL 证书申请及 Nginx 证书集成提供 HTTPS 协议
- 上线方案复盘总结

环境搭建

安全防护

服务环境部署

应用端口映射

数据配置部署

证书安装

项目部署与进程守护

- 项目介绍
  - 部署方案
  - 待部署项目介绍
- 准备工作
  - 域名选购备案
  - 厂商对比与服务器选配
- 服务器
  - SSH 无密码登录连接
  - NodeJS/MongoDB/Nginx 环境
  - IPTables/Fail2Ban 防火墙及主动防御
  - MongoDB 角色配置与安全规则
  - MongoDB 单表单库导入导出与跨机迁移
  - PM2 环境配置
- 部署上线
  - 服务器与 Git 仓库读写配置
  - PM2 一键部署线上 Nodejs 项目
  - 无数据库静态内容站点
  - Vue 前端静态站点
  - Node+MongoDB 服务端渲染的站点
  - React/Egg Node 服务托管前端站点
  - PM2 构建、编译与部署前端资源
  - 数据库的定时备份任务配置
- 收尾工作
  - 域名 DNS 转移及 A 记录/CNAME 解析
  - SSL 证书与 Nginx 证书
  - 课程总结

<!-- ![deploy](../deploy-chart.jpg) -->

- 不同内容站点类型
- 无论是否有数据库
- 是否是 SPA 应用

---

纯静态建议站点，只需把资源同步到服务器上即可

对于 Vue 的前端网站，部署时候需要把必要的资源编译上传号，最后把 HTML 同步到服务器上后，通过 Nginx 代理即可，我们同样给他一个域名访问。

对于 React 的前后端网站，我们可以通过 Egg 提供的服务来提供静态资源服务访问，前端资源上传可参考案例 2 中 Vue 上传图床部分。

最后，对于有数据库的站点，我们部署的时候，主要是更新代码重启服务，但需要额外把数据库相关的事件处理好，包括 SSL 证书的集成，

---

线上环境

- 购买域名
  - IP 地址不够友好
  - 苹果和微信小程序不支持 IP 绑定
  - 域名的解析是 HTTPS 比较安全
- 购买服务器
  - 带有外网 IP 的电脑
  - 部署 NodeJS 代码
  - 监听 80 端口
  - 通过 Nginx 进行端口转发到我们的 NodeJS 服务端口
- 备案
- 服务环境配置
  - 用户权限和无密码登录
  - Nodejs 环境和必备包组件安装搭建
  - 端口转发
  - HTTPS 证书的生成配置
  - Nginx 的安装配置
  - 防火墙
  - 本地数据库
  - 自动备份机制等
- 数据库配置运维
- 项目部署发布
  - 付费/免费但私密的第三方 Git 仓库平台
  - 用户权限/密码
  - Nodejs 环境搭建
  - 防火墙配置
  - Nginx 的安装和进行端口转发
  - 本地数据库，线上数据库自动备份机制

---

- travis-ci
- azure-pipelines

- [花椒前端基于 GitLab CI/CD 的自动化构建、发布实践](https://zhuanlan.zhihu.com/p/69513606)
- [使用 Gitlab CI 实现前端资源自动发布](https://zhuanlan.zhihu.com/p/37325902)
- [Gitlab CI 在前端 CI/CD 中的运用](https://zhuanlan.zhihu.com/p/136876843)
- [Gitlab CI&CD 实战经验分享](https://zhuanlan.zhihu.com/p/51163261)
- [前端 Docker + Gitlab CI 的持续集成](https://zhuanlan.zhihu.com/p/44748907)
- [部署基于 Gitlab + Docker + Rancher + Harbor 的前端项目这一篇就够了](https://zhuanlan.zhihu.com/p/94844844)
- [从零开始搭建一个前端资源自动化构建发布系统](https://zhuanlan.zhihu.com/p/38139513)
- [这些年的体验技术部：Node.js 基础服务 摸爬滚打才不负功名尘土](https://zhuanlan.zhihu.com/p/84176287)
