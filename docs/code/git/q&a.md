---
nav:
  title: 代码管理
  order: 5
title: Q&A
order: 100
---

# Q&A

## Please enter a commit message to explain why this merge is necessary

Please enter a commit message to explain why this merge is necessary.

请输入提交消息来解释为什么这种合并是必要的

demo_image

git 在 `pull` 或者 `merge` 合并分支的时候有时会遇到这个界面。如果要输入解释的话就需要按照以下不着解决。（若无需解释，可以跳过第 1、2 步，直接从下面第 3 步开始）

解决方法：

1.按键盘字母 `i` 进入 insert 模式。

2.修改最上面那行黄色合并信息，可以不修改。

3.按键盘左上角 `Esc`。

4.输入 `:wq`，注意是 `冒号+wq`，按回车键 `Enter` 即可。

## git rm 和 rm 的區別

用 `git rm` 来删除文件，同时还会将这个删除的操作记录下来。
用 rm ，仅仅是删除了物理文件，没有将其从 git 的记录中删除。

直观的来讲，`git rm` 删除过的文件，执行 `git commit -m "abc"` 提交时，会自动将删除该文件的操作提交上去。

而用 `rm` 命令直接删除的文件，单纯执行 `git commit -m "abc"` 提交时，则不会将删除该文件的操作提交上去，需要在执行 commit 的时候，多加一个-a 参数，
即 `rm` 删除后，需要使用 `git commit -am "abc"` 提交才会将删除文件的操作提交上去。

比如：

删除文件 `test.file`

```bash
git rm test.file
git commit -m "delete test.file"
git push
```

或者

```bash
rm test.file
git commit -am "delete test.file"
git push
```

删除目录 work

```bash
git rm work -r -f
git commit -m "delete work"
git push
```

## 初始化版本库

```bash
# 1.Checkout
git checkout --orphan latest_branch

# Add all the files
git add -A

# Commit the changes
git commit -am "commit message"

# Delete the branch
git branch -D master

#5.Rename the current branch to master
git branch -m master

# 6.Finally, force update your repository
git push -f origin master
```

## Github fork 项目如何保持与原项目同步更新？

给 fork 配置远程库

```bash
# 使用
git remote -v

# 查看远程状态

# 确定一个被同步给 fork 远程的上游仓库
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY

# 再次查看状态确认是否配置成功
```

同步 fork

```bash
# 从上游仓库 fetch 分支和提交点，提交给本地 master，并会被存储在一个本地分支 upstream/master
git fetch upstream

# 切换到本地主分支（如果不在的话）
git fetch upstream

# 把 upstream/master 分支合并到本地 master 上，这样就完成了同步，并且不会丢掉本地修改的内容。
git merge upstream/master

# 如果想更新到 Github 的 fork 上，直接
git push origin master
```

## 重命名文件和文件夹

```
git mv -f oldfolder newfolder
```

```
git add -u newfolder
```

`-u` 选项会更新已经追踪的文件和文件夹。

```
git commit -m "changed the foldername whaddup"
```

```
git mv foldername tempname && git mv tempname folderName
```

在大小写不敏感的系统中，如 windows，重命名文件的大小写,使用临时文件名

```
git mv -n foldername folderName
```

(显示重命名会发生的改变，不进行重命名操作)

## 退出提交日志界面

英文状态下 按 `Q`

## github 远程仓库名或地址修改本地同步

```bash
# old
https://github.com/tsejx/git-guidebook.git

# new
https://github.com/tsejx/Git-Guidebook.git
```

查看当前项目链接远程仓库地址

```bash
git remote -v
```

第一种：通过命令行直接修改远程地址

```bash
cd 本地仓库目录

# 查看所有远程仓库，git remote xx 查看远程仓库地址（如 xxx 为 origin）
git remote

git remote set-url origin https://github.com/tsejx/Git-Guide.git
```

第二种：先删除远程仓库再添加远程仓库

```bash
cd 本地仓库目录

# 查看所有远程仓库，git remote xx 查看远程仓库地址（如 xxx 为 origin）
git remote

git remote rm origin

git remote add origin https://github.com/tsejx/Git-Guide.git
```

第三种：直接修改配置文件

```bash
# 1. cd 本地仓库目录

# 2. vim config

# 3. 修改 [remote "origin"] 下的 url 即可
```

## 撤销 git merge

撤销最近一次 git merge

```bash
git reset --merge HEAD^
```

## git 文件名大小写变更后未产生变化

由于拼写错误导致需要修改文件名大小写后重新提交代码，结果发现 git status 中并未找到该变化，究其原因是 Git 默认配置了忽略大小写敏感。

解决方法：

```bash
# 查看忽略大小写配置项
git config core.ignorecase

# 设置大小写敏感为敏感
git config core.ignorecase false
```

## github fork 项目与原项目保持同步

假设我把 vuejs fork 到了我的账户下，但是原项目会一直保持更新，我的账户下的 vuejs 并不是最新的代码，因此需要保持与原项目代码保持一致。

- 我的仓库地址 https://github.com/tsejx/vue.git
- 原项目地址 https://github.com/vuejs/vue.git

```bash
# 1. 把 fork 后的仓库克隆到本地
git clone https://github.com/tsejx/vue.git

# 2. 进入根目录，增加远程分支（fork 的分支），名为 update_stream（自定义）到本地
git remote add update_stream https://github.com/vue/vue.git

# 3. 检查状态
# 通过以下命令会发现多出 update_stream 的远程分支
git remote -v

# 4. 把远程分支 update_stream 的代码拉取到本地
git fetch update_stream

# 5. 合并对方远程原始分支 update_stream 的代码
git merge update_stream/master

# 6. 把最新的代码推送到你的 Github 上
git push origin master

# 7. 如果需要给 update_stream 发送 Pull Request
```

打开 Github 上你的仓库

点击 Pull Request => 点击 New Pull Request => 输入 Title 和功能说明 => 点击 Send pull request

## 未关联分支合并请求失败

在使用 Git 创建项目时候，在两个分支合并的时候会出现以下情况。
有时会在 `git pull` 或 `git push` 时候遇到，因为两个分支没有取得关系，也就是原本是独立非关联的。

```
fatal: refusing to merge unrelated histories
```

只需要在操作命令后加上 `--allow-unrelated-histories` 即可解决。

```bash
git merge master --allow-unrelated-histories

git pull origin master --allow-unrelated-histories
```

## 本地仓库与远程地址的 SSH 不匹配

1. 出现 `Are you sure you want to continue connecting (yes/no)?` 时，选择 yes
2. `ls -al ~/.ssh`
3. `ssh-keygen -t rsa -C "Github UserName"`（双引号内为 Github 用户名），按三次回车
4. `cat ~/.ssh/id_rsa.pub` 生成新的 SSH
5. 登陆 Github，点击头像 -> settings-new SSH，复制新生成的 SSH

## 删除远程已不存在的 Tag

场景

1. 同事 A 在本地创建 tag 并 git push 同步到远程仓库
2. 同事 B 在本地 fetch 了远程 tagA
3. 同事 A 工作需要将远程标签 tag A 删除
4. 同事 B 用 git fetch 同步远端信息，git tag 后发现本地记录仍有 tagA

分析

对于远程仓库中已经删除了的 tag，即使使用 git fetch --prune，甚至 git fetch --tags 确保下载所有 tags，也不会让其在本地也将其删除的。而且，似乎 git 目前也没有提供一个直接的命令和参数选项可以删除本地的在远程已经不存在的 tag

解决方法

```bash
# 删除所有本地分支
git tag -l | xargs git tag -d

# 从远程拉去所有信息
git fetch origin --prune
```

## Git 连接 Failed connect to github.com:443 解决方法

参考：https://blog.csdn.net/lyc_stronger/article/details/51954852

解决方法：

1. 编辑文件 `vim /etc/hosts`
2. 将 `github.com`相关的 dns ip 注释

```
# 192.30.252.129 github.com
# 192.30.252.131 github.com
# 204.13.251.16 github.com
```

估计是 github.com 的动态 IP 导致相关问题

## CentOS7 每次从 github git pull 都需要输入账号密码

解决方式：

```bash
# 格式
git remote set-url origin git+ssh://git@github.com/<username>/<repository-name>.git

# 例如
git remote set-url origin git+ssh://git@github.com/tsejx/git-guidebook.git
```
