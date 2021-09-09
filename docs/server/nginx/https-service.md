---
nav:
  title: 服务器
  order: 2
group:
  title: Nginx
  order: 1
title: HTTPS 服务
order: 16
---

# HTTPS 服务

如果不使用 HTTPS 服务：

- 传输数据会被中间人盗用，信息泄漏
- 数据内容劫持、篡改

## 强制跳转

### 无 www 跳转至有 www

```nginx
server {
    listen 80;
    server_name example.com;

    return 301 http://www.example.com$request_uri;
}

server {
    listen 80;
    server_name www.example.com;

    location / {
        proxy_pass          http://localhost:8080;
        proxy_set_header    X-Forwared-Proto    $scheme;
        proxy_set_header    Host                $host;
        proxy_set_header    X-Real-IP           $remote_addr;
    }
}
```

#### HTTP 跳转至 HTTPS

HTTP 默认端口强制跳转 HTTPS 配置

```nginx
server {
    listen 80;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
}
```

## 基本配置

```nginx
server {
    listen  80;
    listen  443 ssl http2 default_server;

    # 公钥，发送到连接服务器的客户端
    ssl_certificate         cert/example.com.pem;
    # 私钥，权限要得到保护但 Nginx 的主进程能够读取
    ssl_certificate_key     cert/example.com.key;
    # 设置 SSL/TLS 会话缓存的类型和大小
    ssl_session_cache       shared:SSL:10m;
    # 客户端可以重用会话缓存中 SSL 参数的过期时间
    ssl_session_timeout     10m;

    ssl_protocols               SSLv2 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers                 ECDHE-RSA-AES256-SHA384:AES256-SHA256:RC4:HIGH:!MD5:!aNULL:!eNULL:!NULL:!DH:!EDH:!AESGCM;
    ssl_prefer_server_ciphers   on;

    server_name m.example.com;

    location /test/ {
        proxy_pass      https://h5.example.com;
        rewrite /test/(.*) /$1 break;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass          https://m.example.com;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    access_log /var/log/nginx/example.access.log main;
}
```

---

**参考资料：**

- [使用 Let's Encrypt 签署免费 SSL 证书](https://blog.timeliar.com/2017/03/11/%E4%BD%BF%E7%94%A8Let-s-Encrypt%E7%AD%BE%E7%BD%B2%E5%85%8D%E8%B4%B9SSL%E8%AF%81%E4%B9%A6/)
- [免费申请 HTTPS 证书，开启全站 HTTPS](https://juejin.im/post/5d969a696fb9a04e046bb8e5)
- [Let's Encrypt 初体验](https://deadlion.cn/2016/09/28/Let's-Encrypt/)
- [服务器配置 HTTPS 协议，三种免费的方法](https://blog.csdn.net/t6546545/article/details/80508554)
- [CentOS 7 下给 通过 Certbot 快速部署 HTTPS 证书](https://www.jianshu.com/p/a0c81ae14adc)
- [教你在 Nginx 上使用 CertBot 把自己网站设置成 HTTPS](https://blog.csdn.net/weixin_43064185/article/details/104971719)
- [Certbot 命令行工具使用说明](https://www.4spaces.org/certbot-command-line-tool-usage-document/)
- [Certbot - Centosrhel7 Nginx](https://certbot.eff.org/lets-encrypt/centosrhel7-nginx)
