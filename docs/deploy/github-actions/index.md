# Github Actions

大家知道，持续集成由很多操作组成，比如抓取代码、运行测试、登录远程服务器，发布到第三方服务等等。GitHub 把这些操作就称为 actions。

很多操作在不同项目里面是类似的，完全可以共享。GitHub 注意到了这一点，想出了一个很妙的点子，允许开发者把每个操作写成独立的脚本文件，存放到代码仓库，使得其他开发者可以引用。

如果你需要某个 action，不必自己写复杂的脚本，直接引用他人写好的 action 即可，整个持续集成过程，就变成了一个 actions 的组合。这就是 GitHub Actions 最特别的地方。

GitHub 做了一个官方市场，可以搜索到他人提交的 actions。另外，还有一个 awesome actions 的仓库，也可以找到不少 action。

## 基本概念

GitHub Actions 有一些自己的术语。

- workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。
- job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
- step（步骤）：每个 job 由多个 step 构成，一步步完成。
- action （动作）：每个 step 可以依次执行一个或多个命令（action）。

## workflow 文件

GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的 `.github/workflows` 目录。

workflow 文件采用 YAML 格式，文件名可以任意取，但是后缀名统一为 `.yml`，比如 `foo.yml`。一个库可以有多个 workflow 文件。GitHub 只要发现 `.github/workflows` 目录里面有 `.yml` 文件，就会自动运行该文件。

workflow 文件的配置字段非常多，详见 [官方文档](https://help.github.com/en/articles/workflow-syntax-for-github-actions)。下面是一些基本字段。

---

**参考资料：**

- [Github Actions Market](https://github.com/marketplace?utf8=%E2%9C%93&type=actions&query=deploy)
- [真香！GitHub Action 一键部署](https://didiheng.com/front/2019-12-11.html#github-action%E9%85%8D%E7%BD%AE)
- [Github Actions 介绍&自动构建 Github Pages 博客](https://www.dazhuanlan.com/2020/01/21/5e2703d7a9999/)
- [手把手教你使用 Netify 实现前端的自动部署+HTTPS](https://www.cnblogs.com/codernie/p/9062104.html)
- [定制你私有的前端部署到 ECS 服务器（Github CI/CD）](https://yq.aliyun.com/articles/725419?type=2)
- [Alibaba Cloud Cli](https://github.com/aliyun/aliyun-cli/blob/master/README-CN.md)
- [使用 Github Action 进行前端自动化发布](https://yq.aliyun.com/articles/750065)
- [Github Actions 手册](https://www.jianshu.com/p/161b4241bc09)
- [Github 操作文档](https://docs.github.com/cn/actions)
- [编写自己的 GitHub Action，体验自动化部署](https://zhuanlan.zhihu.com/p/103552188)
