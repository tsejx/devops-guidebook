---
nav:
  title: 数据库
  order: 3
group:
  title: MongoDB
  order: 2
title: 备份与恢复
order: 5
---

# 备份与恢复

## 备份

配置参数：

- `-h`：MongoDB 所在服务器地址，例如 127.0.0.1 或 localhost，当然也可以指定端口号 127.0.0.1:27017
- `-d`：需要备份的数据库实例名
- `-o`：指定备份的数据存放目录位置，例如 `/root/mongdbbak/`，当然该目录需要提前建立，在备份完成后，系统自动在 `/root/mongodbbak` 目录下建立一个 users 目录，这个目录里面存放该数据库实例的备份数据。数据形式是以 JSON 的格式文件存储

```bash
mongodump -h localhost -d users -o /root/mongodbbak/
```

## 恢复

- `--host <:port>, -h <:port>`：MongoDB 所在服务器地址，默认为 localhost:27017
- `-d`：需要恢复的数据库实例名，例如：users，当然这个名称也可以和备份时候的不一样，比如 user2
- `--drop`：恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，谨慎使用！
- `--dir`：指定备份的目录。

```bash
mongorestore -h localhost -d users --dir /root/mongdbbak/users
```
