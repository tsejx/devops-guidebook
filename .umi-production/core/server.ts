// @ts-nocheck
// umi.server.js
import '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/regenerator-runtime@0.13.5/node_modules/regenerator-runtime/runtime.js';
import { format } from 'url';
import renderServer from '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+preset-built-in@3.5.43_react-dom@16.14.0_react@16.14.0__react@16.14.0/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/renderServer/renderServer.js';
import { stripBasename, cheerio, handleHTML } from '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+preset-built-in@3.5.43_react-dom@16.14.0_react@16.14.0__react@16.14.0/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/utils.js';
import { IServerRender } from '@umijs/types';

import { ApplyPluginsType, createMemoryHistory, dynamic } from '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+runtime@3.5.43_react@16.14.0/node_modules/@umijs/runtime';
import { plugin } from './plugin';
import './pluginRegister';

// origin require module
// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

/**
 * server render function
 * @param params
 */
const render: IServerRender = async (params) => {
  let error;
  const {
    origin = '',
    path,
    htmlTemplate = '',
    mountElementId = 'root',
    context = {},
    mode = 'string',
    basename = '/devops-guidebook/',
    staticMarkup = false,
    forceInitial = false,
    removeWindowInitialProps = false,
    getInitialPropsCtx,
  } = params;
  let manifest = params.manifest;
  const env = 'production';

  let html = htmlTemplate || "\u003C!DOCTYPE html\u003E\n\u003Chtml\u003E\n  \u003Chead\u003E\n    \u003Cmeta charset=\"utf-8\" \u002F\u003E\n    \u003Cmeta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"\n    \u002F\u003E\n    \u003Clink rel=\"shortcut icon\" type=\"image\u002Fx-icon\" href=\".\u002Ffavicon.ico\" \u002F\u003E\n    \u003Clink rel=\"stylesheet\" href=\"\u002Fdevops-guidebook\u002Fumi.css\" \u002F\u003E\n    \u003Cscript\u003E\n      window.routerBase = \"\u002Fdevops-guidebook\u002F\";\n    \u003C\u002Fscript\u003E\n    \u003Cscript\u003E\n      \u002F\u002F! umi version: 3.5.43\n    \u003C\u002Fscript\u003E\n    \u003Cscript\u003E\n      !(function () {\n        var e =\n            navigator.cookieEnabled && void 0 !== window.localStorage\n              ? localStorage.getItem(\"dumi:prefers-color\")\n              : \"auto\",\n          o = window.matchMedia(\"(prefers-color-scheme: dark)\").matches,\n          t = [\"light\", \"dark\", \"auto\"];\n        document.documentElement.setAttribute(\n          \"data-prefers-color\",\n          e === t[2] ? (o ? t[1] : t[0]) : t.indexOf(e) \u003E -1 ? e : t[0]\n        );\n      })();\n    \u003C\u002Fscript\u003E\n    \u003Ctitle\u003EDevOps Guidebook\u003C\u002Ftitle\u003E\n  \u003C\u002Fhead\u003E\n  \u003Cbody\u003E\n    \u003Cdiv id=\"root\"\u003E\u003C\u002Fdiv\u003E\n\n    \u003Cscript src=\"\u002Fdevops-guidebook\u002Fumi.js\"\u003E\u003C\u002Fscript\u003E\n  \u003C\u002Fbody\u003E\n\u003C\u002Fhtml\u003E\n";
  let rootContainer = '';
  try {
    // handle basename
    const location = stripBasename(basename, `${origin}${path}`);
    const { pathname } = location;
    // server history
    const history = createMemoryHistory({
      initialEntries: [format(location)],
    });
    /**
     * beforeRenderServer hook, for polyfill global.*
     */
    await plugin.applyPlugins({
      key: 'ssr.beforeRenderServer',
      type: ApplyPluginsType.event,
      args: {
        env,
        path,
        context,
        history,
        mode,
        location,
      },
      async: true,
    });

    /**
     * routes init and patch only once
     * beforeRenderServer must before routes init avoding require error
     */
    // 主要为后面支持按需服务端渲染，单独用 routes 会全编译
    const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [require('../dumi/layout').default],
    "component": ((props) => dynamic({
          loader: async () => {
            const React = await import('react');
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+preset-dumi@1.1.54_react-dom@16.14.0_react@16.14.0__react-router@5.2.0_react@16._089b0434d3e2a4d0aaa20e3ef448dc10/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/es/builtins/Previewer.js');
            const { usePrefersColor, context } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          },
          loading: () => null,
        }))()
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [require('../dumi/layout').default, require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/dumi-theme-default@1.1.24_@umijs+preset-dumi@1.1.54_react-dom@16.14.0_react@16.14.0__re_cd8f19a99b03dd29ac7dba53ca32472d/node_modules/dumi-theme-default/es/layout.js').default],
    "routes": [
      {
        "path": "/",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/index.md",
          "updatedTime": 1594453482000,
          "title": "DevOps Guidebook - 📚 React 知识图谱 关于概念、技巧、生态、前沿、源码核心",
          "order": 10,
          "hero": {
            "title": "DevOps Guidebook",
            "desc": "<div class=\"markdown\"><p>📚 DevOps 知识图谱 关于Linux、服务器、数据库、部署等相关体系</p></div>",
            "actions": [
              {
                "text": "开始阅读",
                "link": "/linux"
              }
            ]
          },
          "features": [
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png",
              "title": "完整体系",
              "desc": "<div class=\"markdown\"><p>根据官方文档及社区建设构建尽可能实用的知识体系，宏观掌握技术体系</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png",
              "title": "深度分析",
              "desc": "<div class=\"markdown\"><p>尽览社区精品技术文章，将最受业界欢迎的使用方法收录其中</p></div>"
            },
            {
              "icon": "https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png",
              "title": "开发指南",
              "desc": "<div class=\"markdown\"><p>体系化整理，随时查阅具体技术细节，方便前端开发者日常开发</p></div>"
            }
          ],
          "footer": "<div class=\"markdown\"><p>Open-source MIT Licensed | Copyright © 2019-present<br />Powered by tsejx</p></div>",
          "slugs": [
            {
              "depth": 2,
              "value": "工具链",
              "heading": "工具链"
            },
            {
              "depth": 3,
              "value": "成功的关键",
              "heading": "成功的关键"
            },
            {
              "depth": 2,
              "value": "能力需求",
              "heading": "能力需求"
            },
            {
              "depth": 3,
              "value": "自动化能力",
              "heading": "自动化能力"
            },
            {
              "depth": 3,
              "value": "持续交付能力",
              "heading": "持续交付能力"
            },
            {
              "depth": 3,
              "value": "合作文化",
              "heading": "合作文化"
            },
            {
              "depth": 2,
              "value": "CI/CD",
              "heading": "cicd"
            },
            {
              "depth": 3,
              "value": "CI 持续集成",
              "heading": "ci-持续集成"
            },
            {
              "depth": 3,
              "value": "CD 持续交付和持续部署",
              "heading": "cd-持续交付和持续部署"
            },
            {
              "depth": 2,
              "value": "提倡原则",
              "heading": "提倡原则"
            }
          ]
        },
        "title": "DevOps Guidebook - 📚 React 知识图谱 关于概念、技巧、生态、前沿、源码核心 - DevOps Guidebook",
        "_chunkName": "docs__index.md"
      },
      {
        "path": "/code/git/add",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/add.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/add.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "添加 git add",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "添加 git add",
              "heading": "添加-git-add"
            },
            {
              "depth": 2,
              "value": "添加修改记录至暂存区",
              "heading": "添加修改记录至暂存区"
            },
            {
              "depth": 2,
              "value": "分次添加修改至暂存区",
              "heading": "分次添加修改至暂存区"
            },
            {
              "depth": 2,
              "value": "添加跟踪修改至暂存区",
              "heading": "添加跟踪修改至暂存区"
            },
            {
              "depth": 2,
              "value": "添加修改到暂存区",
              "heading": "添加修改到暂存区"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "添加 git add - DevOps Guidebook",
        "_chunkName": "docs__code__git__add.md"
      },
      {
        "path": "/code/git/branch",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/branch.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/branch.md",
          "updatedTime": 1756812030000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "分支 git branch",
          "order": 12,
          "slugs": [
            {
              "depth": 1,
              "value": "分支 git branch",
              "heading": "分支-git-branch"
            },
            {
              "depth": 2,
              "value": "查看分支",
              "heading": "查看分支"
            },
            {
              "depth": 3,
              "value": "查看本地分支",
              "heading": "查看本地分支"
            },
            {
              "depth": 3,
              "value": "查看远程分支",
              "heading": "查看远程分支"
            },
            {
              "depth": 3,
              "value": "按照特定规则查看分支",
              "heading": "按照特定规则查看分支"
            },
            {
              "depth": 2,
              "value": "新建分支",
              "heading": "新建分支"
            },
            {
              "depth": 3,
              "value": "关联远程分支",
              "heading": "关联远程分支"
            },
            {
              "depth": 2,
              "value": "切换分支",
              "heading": "切换分支"
            },
            {
              "depth": 2,
              "value": "修改分支",
              "heading": "修改分支"
            },
            {
              "depth": 2,
              "value": "删除分支",
              "heading": "删除分支"
            },
            {
              "depth": 3,
              "value": "删除本地分支",
              "heading": "删除本地分支"
            },
            {
              "depth": 3,
              "value": "删除远程分支",
              "heading": "删除远程分支"
            },
            {
              "depth": 3,
              "value": "批量删除分支",
              "heading": "批量删除分支"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "分支 git branch - DevOps Guidebook",
        "_chunkName": "docs__code__git__branch.md"
      },
      {
        "path": "/code/git/cat-file",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/cat-file.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/cat-file.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "查询 git cat-file",
          "order": 27,
          "slugs": [
            {
              "depth": 1,
              "value": "查询 cat-file",
              "heading": "查询-cat-file"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "查询 git cat-file - DevOps Guidebook",
        "_chunkName": "docs__code__git__cat-file.md"
      },
      {
        "path": "/code/git/check-ignore",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/check-ignore.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/check-ignore.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "排除文件 check-ignore",
          "order": 28,
          "slugs": [
            {
              "depth": 1,
              "value": "排除文件 check-ignore",
              "heading": "排除文件-check-ignore"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "排除文件 check-ignore - DevOps Guidebook",
        "_chunkName": "docs__code__git__check-ignore.md"
      },
      {
        "path": "/code/git/checkout",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/checkout.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/checkout.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "查看 git checkout",
          "order": 13,
          "slugs": [
            {
              "depth": 1,
              "value": "查看 git checkout",
              "heading": "查看-git-checkout"
            },
            {
              "depth": 2,
              "value": "撤销文件修改",
              "heading": "撤销文件修改"
            },
            {
              "depth": 2,
              "value": "切换分支",
              "heading": "切换分支"
            },
            {
              "depth": 2,
              "value": "切换标签",
              "heading": "切换标签"
            },
            {
              "depth": 2,
              "value": "创建分支并切换分支",
              "heading": "创建分支并切换分支"
            },
            {
              "depth": 2,
              "value": "从储藏库中拿出指定提交",
              "heading": "从储藏库中拿出指定提交"
            },
            {
              "depth": 2,
              "value": "恢复误删的文件",
              "heading": "恢复误删的文件"
            },
            {
              "depth": 2,
              "value": "恢复误删的本地分支",
              "heading": "恢复误删的本地分支"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "查看 git checkout - DevOps Guidebook",
        "_chunkName": "docs__code__git__checkout.md"
      },
      {
        "path": "/code/git/cherry-pick",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/cherry-pick.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/cherry-pick.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "移植 git cherry-pick",
          "order": 26,
          "slugs": [
            {
              "depth": 1,
              "value": "移植 git cherry-pick",
              "heading": "移植-git-cherry-pick"
            },
            {
              "depth": 2,
              "value": "基本用法",
              "heading": "基本用法"
            },
            {
              "depth": 2,
              "value": "其他命令",
              "heading": "其他命令"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "移植 git cherry-pick - DevOps Guidebook",
        "_chunkName": "docs__code__git__cherry-pick.md"
      },
      {
        "path": "/code/git/clone",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/clone.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/clone.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "克隆 git clone",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "克隆 git clone",
              "heading": "克隆-git-clone"
            },
            {
              "depth": 2,
              "value": "克隆至本地仓库",
              "heading": "克隆至本地仓库"
            },
            {
              "depth": 2,
              "value": "克隆仓库至指定到分支",
              "heading": "克隆仓库至指定到分支"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "克隆 git clone - DevOps Guidebook",
        "_chunkName": "docs__code__git__clone.md"
      },
      {
        "path": "/code/git/commit-tree",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/commit-tree.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/commit-tree.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "提交对象 commit-tree",
          "order": 29,
          "slugs": [
            {
              "depth": 1,
              "value": "提交对象 commit-tree",
              "heading": "提交对象-commit-tree"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "提交对象 commit-tree - DevOps Guidebook",
        "_chunkName": "docs__code__git__commit-tree.md"
      },
      {
        "path": "/code/git/commit",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/commit.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/commit.md",
          "updatedTime": 1624530359000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "提交 git commit",
          "order": 8,
          "slugs": [
            {
              "depth": 1,
              "value": "提交 git commit",
              "heading": "提交-git-commit"
            },
            {
              "depth": 2,
              "value": "提交至本地仓",
              "heading": "提交至本地仓"
            },
            {
              "depth": 2,
              "value": "提交跟踪文件",
              "heading": "提交跟踪文件"
            },
            {
              "depth": 2,
              "value": "提交时查看文件修改详情",
              "heading": "提交时查看文件修改详情"
            },
            {
              "depth": 2,
              "value": "增补提交",
              "heading": "增补提交"
            },
            {
              "depth": 2,
              "value": "修改提交备注内容",
              "heading": "修改提交备注内容"
            },
            {
              "depth": 2,
              "value": "修改历史记录",
              "heading": "修改历史记录"
            },
            {
              "depth": 2,
              "value": "初始化提交记录",
              "heading": "初始化提交记录"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "提交 git commit - DevOps Guidebook",
        "_chunkName": "docs__code__git__commit.md"
      },
      {
        "path": "/code/git/config",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/config.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/config.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "配置 git config",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "配置 git config",
              "heading": "配置-git-config"
            },
            {
              "depth": 2,
              "value": "查看配置信息",
              "heading": "查看配置信息"
            },
            {
              "depth": 2,
              "value": "配置开发者信息",
              "heading": "配置开发者信息"
            },
            {
              "depth": 2,
              "value": "添加配置项",
              "heading": "添加配置项"
            },
            {
              "depth": 2,
              "value": "删除配置项",
              "heading": "删除配置项"
            },
            {
              "depth": 2,
              "value": "简化命令",
              "heading": "简化命令"
            },
            {
              "depth": 2,
              "value": "忽略文件的权限变化",
              "heading": "忽略文件的权限变化"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "配置 git config - DevOps Guidebook",
        "_chunkName": "docs__code__git__config.md"
      },
      {
        "path": "/code/git/count-objects",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/count-objects.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/count-objects.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "计算 count-objects",
          "order": 30,
          "slugs": [
            {
              "depth": 1,
              "value": "计算 count-objects",
              "heading": "计算-count-objects"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "计算 count-objects - DevOps Guidebook",
        "_chunkName": "docs__code__git__count-objects.md"
      },
      {
        "path": "/code/git/diff-index",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/diff-index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/diff-index.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "差异索引 diff-index",
          "order": 31,
          "slugs": [
            {
              "depth": 1,
              "value": "差异索引 diff-index",
              "heading": "差异索引-diff-index"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "差异索引 diff-index - DevOps Guidebook",
        "_chunkName": "docs__code__git__diff-index.md"
      },
      {
        "path": "/code/git/diff",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/diff.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/diff.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "差异 git diff",
          "order": 22,
          "slugs": [
            {
              "depth": 1,
              "value": "差异 git diff",
              "heading": "差异-git-diff"
            },
            {
              "depth": 2,
              "value": "查看工作区与暂存区差异",
              "heading": "查看工作区与暂存区差异"
            },
            {
              "depth": 2,
              "value": "查暂存区与最近版本的差异",
              "heading": "查暂存区与最近版本的差异"
            },
            {
              "depth": 2,
              "value": "查看工作区与最近版本间差异",
              "heading": "查看工作区与最近版本间差异"
            },
            {
              "depth": 2,
              "value": "查看提交版本间的差异",
              "heading": "查看提交版本间的差异"
            },
            {
              "depth": 2,
              "value": "查看工作区、暂存区和最近版本间的差异",
              "heading": "查看工作区暂存区和最近版本间的差异"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "差异 git diff - DevOps Guidebook",
        "_chunkName": "docs__code__git__diff.md"
      },
      {
        "path": "/code/git/extensions",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/extensions.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/extensions.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "扩展",
          "order": 99,
          "slugs": [
            {
              "depth": 1,
              "value": "扩展",
              "heading": "扩展"
            },
            {
              "depth": 2,
              "value": "资源",
              "heading": "资源"
            },
            {
              "depth": 2,
              "value": "生态",
              "heading": "生态"
            },
            {
              "depth": 2,
              "value": "工具",
              "heading": "工具"
            },
            {
              "depth": 2,
              "value": "插件",
              "heading": "插件"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "扩展 - DevOps Guidebook",
        "_chunkName": "docs__code__git__extensions.md"
      },
      {
        "path": "/code/git/fetch",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/fetch.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/fetch.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "提取 git fetch",
          "order": 17,
          "slugs": [
            {
              "depth": 1,
              "value": "提取 git fetch",
              "heading": "提取-git-fetch"
            },
            {
              "depth": 2,
              "value": "获取远程分支列表",
              "heading": "获取远程分支列表"
            },
            {
              "depth": 2,
              "value": "本地删除远程已废弃分支",
              "heading": "本地删除远程已废弃分支"
            },
            {
              "depth": 2,
              "value": "获取远程指定分支提交记录",
              "heading": "获取远程指定分支提交记录"
            },
            {
              "depth": 2,
              "value": "跟随远程删除分支的操作",
              "heading": "跟随远程删除分支的操作"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "提取 git fetch - DevOps Guidebook",
        "_chunkName": "docs__code__git__fetch.md"
      },
      {
        "path": "/code/git/for-each-ref",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/for-each-ref.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/for-each-ref.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "参考输出 for-each-ref",
          "order": 32,
          "slugs": [
            {
              "depth": 1,
              "value": "参考输出 for-each-ref",
              "heading": "参考输出-for-each-ref"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "参考输出 for-each-ref - DevOps Guidebook",
        "_chunkName": "docs__code__git__for-each-ref.md"
      },
      {
        "path": "/code/git/git-flow",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/git-flow.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/git-flow.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "工作流",
          "order": 51,
          "slugs": [
            {
              "depth": 1,
              "value": "工作流",
              "heading": "工作流"
            },
            {
              "depth": 2,
              "value": "分支管理",
              "heading": "分支管理"
            },
            {
              "depth": 2,
              "value": "提交规范",
              "heading": "提交规范"
            },
            {
              "depth": 3,
              "value": "提交类型",
              "heading": "提交类型"
            },
            {
              "depth": 3,
              "value": "格式要求",
              "heading": "格式要求"
            },
            {
              "depth": 3,
              "value": "辅助工具",
              "heading": "辅助工具"
            },
            {
              "depth": 2,
              "value": "标签版本管理",
              "heading": "标签版本管理"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "工作流 - DevOps Guidebook",
        "_chunkName": "docs__code__git__git-flow.md"
      },
      {
        "path": "/code/git/help",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/help.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/help.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "帮助 git help",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "帮助 git help",
              "heading": "帮助-git-help"
            },
            {
              "depth": 2,
              "value": "展示帮助信息",
              "heading": "展示帮助信息"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "帮助 git help - DevOps Guidebook",
        "_chunkName": "docs__code__git__help.md"
      },
      {
        "path": "/code/git/hooks",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/hooks.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/hooks.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "钩子",
          "order": 51,
          "slugs": [
            {
              "depth": 1,
              "value": "钩子",
              "heading": "钩子"
            },
            {
              "depth": 2,
              "value": "作用域",
              "heading": "作用域"
            },
            {
              "depth": 2,
              "value": "客户端钩子",
              "heading": "客户端钩子"
            },
            {
              "depth": 3,
              "value": "提交工作流钩子",
              "heading": "提交工作流钩子"
            },
            {
              "depth": 4,
              "value": "pre-commit",
              "heading": "pre-commit"
            },
            {
              "depth": 4,
              "value": "prepare-commit-msg",
              "heading": "prepare-commit-msg"
            },
            {
              "depth": 4,
              "value": "commit-msg",
              "heading": "commit-msg"
            },
            {
              "depth": 4,
              "value": "post-commit",
              "heading": "post-commit"
            },
            {
              "depth": 3,
              "value": "电子邮件工作流钩子",
              "heading": "电子邮件工作流钩子"
            },
            {
              "depth": 4,
              "value": "pplypatch-msg",
              "heading": "pplypatch-msg"
            },
            {
              "depth": 4,
              "value": "post-applypatch",
              "heading": "post-applypatch"
            },
            {
              "depth": 3,
              "value": "其他客户端钩子",
              "heading": "其他客户端钩子"
            },
            {
              "depth": 2,
              "value": "服务端钩子",
              "heading": "服务端钩子"
            },
            {
              "depth": 4,
              "value": "pre-receive",
              "heading": "pre-receive"
            },
            {
              "depth": 4,
              "value": "update",
              "heading": "update"
            },
            {
              "depth": 4,
              "value": "post-receive",
              "heading": "post-receive"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "钩子 - DevOps Guidebook",
        "_chunkName": "docs__code__git__hooks.md"
      },
      {
        "path": "/code/git",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/index.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "概述",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "版本控制",
              "heading": "版本控制"
            },
            {
              "depth": 2,
              "value": "命令目录",
              "heading": "命令目录"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "概述 - DevOps Guidebook",
        "_chunkName": "docs__code__git__index.md"
      },
      {
        "path": "/code/git/init",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/init.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/init.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "初始化 git init",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "初始化 git init",
              "heading": "初始化-git-init"
            },
            {
              "depth": 2,
              "value": "初始化版本仓库",
              "heading": "初始化版本仓库"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "初始化 git init - DevOps Guidebook",
        "_chunkName": "docs__code__git__init.md"
      },
      {
        "path": "/code/git/log",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/log.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/log.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "日志 git log",
          "order": 21,
          "slugs": [
            {
              "depth": 1,
              "value": "日志 git log",
              "heading": "日志-git-log"
            },
            {
              "depth": 2,
              "value": "查看提交日志",
              "heading": "查看提交日志"
            },
            {
              "depth": 2,
              "value": "查看提交改动细节",
              "heading": "查看提交改动细节"
            },
            {
              "depth": 2,
              "value": "查看命令日志",
              "heading": "查看命令日志"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "日志 git log - DevOps Guidebook",
        "_chunkName": "docs__code__git__log.md"
      },
      {
        "path": "/code/git/ls-files",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/ls-files.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/ls-files.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "文件信息 ls-files",
          "order": 33,
          "slugs": [
            {
              "depth": 1,
              "value": "文件信息 ls-files",
              "heading": "文件信息-ls-files"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "文件信息 ls-files - DevOps Guidebook",
        "_chunkName": "docs__code__git__ls-files.md"
      },
      {
        "path": "/code/git/merge-base",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/merge-base.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/merge-base.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "合并祖先 merge-base",
          "order": 34,
          "slugs": [
            {
              "depth": 1,
              "value": "合并祖先 merge-base",
              "heading": "合并祖先-merge-base"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "合并祖先 merge-base - DevOps Guidebook",
        "_chunkName": "docs__code__git__merge-base.md"
      },
      {
        "path": "/code/git/merge",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/merge.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/merge.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "合并 git merge",
          "order": 14,
          "slugs": [
            {
              "depth": 1,
              "value": "合并 git merge",
              "heading": "合并-git-merge"
            },
            {
              "depth": 2,
              "value": "合并分支",
              "heading": "合并分支"
            },
            {
              "depth": 2,
              "value": "快速向前合并",
              "heading": "快速向前合并"
            },
            {
              "depth": 2,
              "value": "非快速向前合并",
              "heading": "非快速向前合并"
            },
            {
              "depth": 2,
              "value": "合并冲突解决",
              "heading": "合并冲突解决"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "合并 git merge - DevOps Guidebook",
        "_chunkName": "docs__code__git__merge.md"
      },
      {
        "path": "/code/git/mv",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/mv.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/mv.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "移动和重命名 git mv",
          "order": 11,
          "slugs": [
            {
              "depth": 1,
              "value": "移动和重命名 git mv",
              "heading": "移动和重命名-git-mv"
            },
            {
              "depth": 2,
              "value": "重命名文件",
              "heading": "重命名文件"
            },
            {
              "depth": 2,
              "value": "移动文件",
              "heading": "移动文件"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "移动和重命名 git mv - DevOps Guidebook",
        "_chunkName": "docs__code__git__mv.md"
      },
      {
        "path": "/code/git/pull",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/pull.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/pull.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "拉取 git pull",
          "order": 18,
          "slugs": [
            {
              "depth": 1,
              "value": "拉取 git pull",
              "heading": "拉取-git-pull"
            },
            {
              "depth": 2,
              "value": "获取版本修改记录",
              "heading": "获取版本修改记录"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "拉取 git pull - DevOps Guidebook",
        "_chunkName": "docs__code__git__pull.md"
      },
      {
        "path": "/code/git/push",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/push.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/push.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "推送 git push",
          "order": 19,
          "slugs": [
            {
              "depth": 1,
              "value": "推送 git push",
              "heading": "推送-git-push"
            },
            {
              "depth": 2,
              "value": "推送到远程仓库",
              "heading": "推送到远程仓库"
            },
            {
              "depth": 2,
              "value": "删除指定的远程分支",
              "heading": "删除指定的远程分支"
            },
            {
              "depth": 2,
              "value": "推送标签修改",
              "heading": "推送标签修改"
            },
            {
              "depth": 2,
              "value": "推送分支修改",
              "heading": "推送分支修改"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "推送 git push - DevOps Guidebook",
        "_chunkName": "docs__code__git__push.md"
      },
      {
        "path": "/code/git/q&a",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/q&a.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/q&a.md",
          "updatedTime": 1756804866039,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "Q&A",
          "order": 100,
          "slugs": [
            {
              "depth": 1,
              "value": "Q&A",
              "heading": "qa"
            },
            {
              "depth": 2,
              "value": "Please enter a commit message to explain why this merge is necessary",
              "heading": "please-enter-a-commit-message-to-explain-why-this-merge-is-necessary"
            },
            {
              "depth": 2,
              "value": "git rm 和 rm 的區別",
              "heading": "git-rm-和-rm-的區別"
            },
            {
              "depth": 2,
              "value": "初始化版本库",
              "heading": "初始化版本库"
            },
            {
              "depth": 2,
              "value": "Github fork 项目如何保持与原项目同步更新？",
              "heading": "github-fork-项目如何保持与原项目同步更新"
            },
            {
              "depth": 2,
              "value": "重命名文件和文件夹",
              "heading": "重命名文件和文件夹"
            },
            {
              "depth": 2,
              "value": "退出提交日志界面",
              "heading": "退出提交日志界面"
            },
            {
              "depth": 2,
              "value": "github 远程仓库名或地址修改本地同步",
              "heading": "github-远程仓库名或地址修改本地同步"
            },
            {
              "depth": 2,
              "value": "撤销 git merge",
              "heading": "撤销-git-merge"
            },
            {
              "depth": 2,
              "value": "git 文件名大小写变更后未产生变化",
              "heading": "git-文件名大小写变更后未产生变化"
            },
            {
              "depth": 2,
              "value": "github fork 项目与原项目保持同步",
              "heading": "github-fork-项目与原项目保持同步"
            },
            {
              "depth": 2,
              "value": "未关联分支合并请求失败",
              "heading": "未关联分支合并请求失败"
            },
            {
              "depth": 2,
              "value": "本地仓库与远程地址的 SSH 不匹配",
              "heading": "本地仓库与远程地址的-ssh-不匹配"
            },
            {
              "depth": 2,
              "value": "删除远程已不存在的 Tag",
              "heading": "删除远程已不存在的-tag"
            },
            {
              "depth": 2,
              "value": "Git 连接 Failed connect to github.com:443 解决方法",
              "heading": "git-连接-failed-connect-to-githubcom443-解决方法"
            },
            {
              "depth": 2,
              "value": "CentOS7 每次从 github git pull 都需要输入账号密码",
              "heading": "centos7-每次从-github-git-pull-都需要输入账号密码"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "Q&A - DevOps Guidebook",
        "_chunkName": "docs__code__git__q&a.md"
      },
      {
        "path": "/code/git/read-tree",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/read-tree.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/read-tree.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "读入索引 read-tree",
          "order": 35,
          "slugs": [
            {
              "depth": 1,
              "value": "读入索引 read-tree",
              "heading": "读入索引-read-tree"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "读入索引 read-tree - DevOps Guidebook",
        "_chunkName": "docs__code__git__read-tree.md"
      },
      {
        "path": "/code/git/rebase",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/rebase.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/rebase.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "变基 git rebase",
          "order": 23,
          "slugs": [
            {
              "depth": 1,
              "value": "变基 git rebase",
              "heading": "变基-git-rebase"
            },
            {
              "depth": 2,
              "value": "变基至主分支",
              "heading": "变基至主分支"
            },
            {
              "depth": 2,
              "value": "交互式变基",
              "heading": "交互式变基"
            },
            {
              "depth": 2,
              "value": "分支合并",
              "heading": "分支合并"
            },
            {
              "depth": 2,
              "value": "黄金法则",
              "heading": "黄金法则"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "变基 git rebase - DevOps Guidebook",
        "_chunkName": "docs__code__git__rebase.md"
      },
      {
        "path": "/code/git/reflog",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/reflog.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/reflog.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "操作日志 git reflog",
          "order": 25,
          "slugs": [
            {
              "depth": 1,
              "value": "操作日志 git reflog",
              "heading": "操作日志-git-reflog"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "操作日志 git reflog - DevOps Guidebook",
        "_chunkName": "docs__code__git__reflog.md"
      },
      {
        "path": "/code/git/remote",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/remote.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/remote.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "远程 git remote",
          "order": 20,
          "slugs": [
            {
              "depth": 1,
              "value": "远程 git remote",
              "heading": "远程-git-remote"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "远程 git remote - DevOps Guidebook",
        "_chunkName": "docs__code__git__remote.md"
      },
      {
        "path": "/code/git/reset",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/reset.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/reset.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "撤销 git reset",
          "order": 9,
          "slugs": [
            {
              "depth": 1,
              "value": "撤销 git reset",
              "heading": "撤销-git-reset"
            },
            {
              "depth": 2,
              "value": "撤销暂存",
              "heading": "撤销暂存"
            },
            {
              "depth": 3,
              "value": "已提交本地需撤回",
              "heading": "已提交本地需撤回"
            },
            {
              "depth": 3,
              "value": "用新更改替换撤回的更改",
              "heading": "用新更改替换撤回的更改"
            },
            {
              "depth": 3,
              "value": "本地提交错误文件",
              "heading": "本地提交错误文件"
            },
            {
              "depth": 2,
              "value": "中断工作流程处理",
              "heading": "中断工作流程处理"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "撤销 git reset - DevOps Guidebook",
        "_chunkName": "docs__code__git__reset.md"
      },
      {
        "path": "/code/git/rev-list",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/rev-list.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/rev-list.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "反序列提交 rev-list",
          "order": 36,
          "slugs": [
            {
              "depth": 1,
              "value": "反序列提交 rev-list",
              "heading": "反序列提交-rev-list"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "反序列提交 rev-list - DevOps Guidebook",
        "_chunkName": "docs__code__git__rev-list.md"
      },
      {
        "path": "/code/git/rev-parse",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/rev-parse.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/rev-parse.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "rev-parse",
          "order": 37,
          "slugs": [
            {
              "depth": 1,
              "value": "rev-parse",
              "heading": "rev-parse"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "rev-parse - DevOps Guidebook",
        "_chunkName": "docs__code__git__rev-parse.md"
      },
      {
        "path": "/code/git/revert",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/revert.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/revert.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "还原 git revert",
          "order": 24,
          "slugs": [
            {
              "depth": 1,
              "value": "还原 git revert",
              "heading": "还原-git-revert"
            },
            {
              "depth": 2,
              "value": "还原提交",
              "heading": "还原提交"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "还原 git revert - DevOps Guidebook",
        "_chunkName": "docs__code__git__revert.md"
      },
      {
        "path": "/code/git/rm",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/rm.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/rm.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "删除 git rm",
          "order": 10,
          "slugs": [
            {
              "depth": 1,
              "value": "删除 git rm",
              "heading": "删除-git-rm"
            },
            {
              "depth": 2,
              "value": "删除物理文件",
              "heading": "删除物理文件"
            },
            {
              "depth": 2,
              "value": "删除文件修改记录",
              "heading": "删除文件修改记录"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "删除 git rm - DevOps Guidebook",
        "_chunkName": "docs__code__git__rm.md"
      },
      {
        "path": "/code/git/show-ref",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/show-ref.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/show-ref.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "show-ref",
          "order": 38,
          "slugs": [
            {
              "depth": 1,
              "value": "show-ref",
              "heading": "show-ref"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "show-ref - DevOps Guidebook",
        "_chunkName": "docs__code__git__show-ref.md"
      },
      {
        "path": "/code/git/stash",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/stash.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/stash.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "储藏 git stash",
          "order": 15,
          "slugs": [
            {
              "depth": 1,
              "value": "储藏 git stash",
              "heading": "储藏-git-stash"
            },
            {
              "depth": 2,
              "value": "储藏文件修改",
              "heading": "储藏文件修改"
            },
            {
              "depth": 2,
              "value": "查看储藏记录",
              "heading": "查看储藏记录"
            },
            {
              "depth": 2,
              "value": "重回指定储藏版本",
              "heading": "重回指定储藏版本"
            },
            {
              "depth": 2,
              "value": "重回最后储藏版本",
              "heading": "重回最后储藏版本"
            },
            {
              "depth": 2,
              "value": "移除储藏",
              "heading": "移除储藏"
            },
            {
              "depth": 2,
              "value": "清空储藏",
              "heading": "清空储藏"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "储藏 git stash - DevOps Guidebook",
        "_chunkName": "docs__code__git__stash.md"
      },
      {
        "path": "/code/git/status",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/status.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/status.md",
          "updatedTime": 1596277428000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "状态 git status",
          "order": 7,
          "slugs": [
            {
              "depth": 1,
              "value": "状态 git status",
              "heading": "状态-git-status"
            },
            {
              "depth": 2,
              "value": "查看版本修改",
              "heading": "查看版本修改"
            },
            {
              "depth": 2,
              "value": "查看忽略文件",
              "heading": "查看忽略文件"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "状态 git status - DevOps Guidebook",
        "_chunkName": "docs__code__git__status.md"
      },
      {
        "path": "/code/git/symbolic-ref",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/symbolic-ref.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/symbolic-ref.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "symbolic-ref",
          "order": 39,
          "slugs": [
            {
              "depth": 1,
              "value": "symbolic-ref",
              "heading": "symbolic-ref"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "symbolic-ref - DevOps Guidebook",
        "_chunkName": "docs__code__git__symbolic-ref.md"
      },
      {
        "path": "/code/git/tag",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/tag.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/tag.md",
          "updatedTime": 1628057284000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "标签 git tag",
          "order": 16,
          "slugs": [
            {
              "depth": 1,
              "value": "标签 git tag",
              "heading": "标签-git-tag"
            },
            {
              "depth": 2,
              "value": "查看标签",
              "heading": "查看标签"
            },
            {
              "depth": 2,
              "value": "新建标签",
              "heading": "新建标签"
            },
            {
              "depth": 2,
              "value": "删除标签",
              "heading": "删除标签"
            },
            {
              "depth": 2,
              "value": "推送标签",
              "heading": "推送标签"
            },
            {
              "depth": 2,
              "value": "拉取标签",
              "heading": "拉取标签"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "标签 git tag - DevOps Guidebook",
        "_chunkName": "docs__code__git__tag.md"
      },
      {
        "path": "/code/git/update-index",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/update-index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/update-index.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "update-index",
          "order": 40,
          "slugs": [
            {
              "depth": 1,
              "value": "update-index",
              "heading": "update-index"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "update-index - DevOps Guidebook",
        "_chunkName": "docs__code__git__update-index.md"
      },
      {
        "path": "/code/git/update-ref",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/update-ref.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/update-ref.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "update-ref",
          "order": 41,
          "slugs": [
            {
              "depth": 1,
              "value": "update-ref",
              "heading": "update-ref"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "update-ref - DevOps Guidebook",
        "_chunkName": "docs__code__git__update-ref.md"
      },
      {
        "path": "/code/git/verify-pack",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/verify-pack.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/verify-pack.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "verify-pack",
          "order": 41,
          "slugs": [
            {
              "depth": 1,
              "value": "verify-pack",
              "heading": "verify-pack"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "verify-pack - DevOps Guidebook",
        "_chunkName": "docs__code__git__verify-pack.md"
      },
      {
        "path": "/code/git/write-tree",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/git/write-tree.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/git/write-tree.md",
          "updatedTime": 1628241980000,
          "nav": {
            "title": "代码管理",
            "order": 5,
            "path": "/code"
          },
          "title": "write-tree",
          "order": 42,
          "slugs": [
            {
              "depth": 1,
              "value": "write-tree",
              "heading": "write-tree"
            }
          ],
          "group": {
            "path": "/code/git",
            "title": "Git"
          }
        },
        "title": "write-tree - DevOps Guidebook",
        "_chunkName": "docs__code__git__write-tree.md"
      },
      {
        "path": "/code/gitlab/gitlab-flow",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/gitlab/gitlab-flow.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/gitlab/gitlab-flow.md",
          "updatedTime": 1624530359000,
          "slugs": [
            {
              "depth": 1,
              "value": "GitLab Flow",
              "heading": "gitlab-flow"
            },
            {
              "depth": 2,
              "value": "上游优先",
              "heading": "上游优先"
            },
            {
              "depth": 2,
              "value": "持续发布模式",
              "heading": "持续发布模式"
            },
            {
              "depth": 2,
              "value": "版本发布模式",
              "heading": "版本发布模式"
            }
          ],
          "title": "GitLab Flow",
          "nav": {
            "path": "/code",
            "title": "代码管理"
          },
          "group": {
            "path": "/code/gitlab",
            "title": "Gitlab"
          }
        },
        "title": "GitLab Flow - DevOps Guidebook",
        "_chunkName": "docs__code__gitlab__gitlab-flow.md"
      },
      {
        "path": "/code/gitlab/gitlab",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/code/gitlab/gitlab.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/code/gitlab/gitlab.md",
          "updatedTime": 1596277428000,
          "slugs": [
            {
              "depth": 1,
              "value": "GitLab",
              "heading": "gitlab"
            }
          ],
          "title": "GitLab",
          "nav": {
            "path": "/code",
            "title": "代码管理"
          },
          "group": {
            "path": "/code/gitlab",
            "title": "Gitlab"
          }
        },
        "title": "GitLab - DevOps Guidebook",
        "_chunkName": "docs__code__gitlab__gitlab.md"
      },
      {
        "path": "/deploy/docker/command",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/command.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/command.md",
          "updatedTime": 1624588951000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "常用命令",
          "order": 20,
          "slugs": [
            {
              "depth": 1,
              "value": "常用命令",
              "heading": "常用命令"
            },
            {
              "depth": 2,
              "value": "管理命令",
              "heading": "管理命令"
            },
            {
              "depth": 2,
              "value": "普通命令",
              "heading": "普通命令"
            },
            {
              "depth": 3,
              "value": "容器生命周期管理",
              "heading": "容器生命周期管理"
            },
            {
              "depth": 3,
              "value": "容器操作",
              "heading": "容器操作"
            },
            {
              "depth": 3,
              "value": "容器 rootfs 命令",
              "heading": "容器-rootfs-命令"
            },
            {
              "depth": 3,
              "value": "镜像仓库",
              "heading": "镜像仓库"
            },
            {
              "depth": 3,
              "value": "本地镜像管理",
              "heading": "本地镜像管理"
            },
            {
              "depth": 3,
              "value": "相关信息",
              "heading": "相关信息"
            },
            {
              "depth": 2,
              "value": "宿主机操作",
              "heading": "宿主机操作"
            },
            {
              "depth": 3,
              "value": "端口和磁盘目录的映射",
              "heading": "端口和磁盘目录的映射"
            },
            {
              "depth": 3,
              "value": "宿主机关于 Docker 的操作",
              "heading": "宿主机关于-docker-的操作"
            },
            {
              "depth": 2,
              "value": "Docker Hub",
              "heading": "docker-hub"
            },
            {
              "depth": 2,
              "value": "原版指令指引",
              "heading": "原版指令指引"
            }
          ]
        },
        "title": "常用命令 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__command.md"
      },
      {
        "path": "/deploy/docker/container",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/container.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/container.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "操作容器",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "操作容器",
              "heading": "操作容器"
            },
            {
              "depth": 2,
              "value": "生命周期",
              "heading": "生命周期"
            },
            {
              "depth": 2,
              "value": "启动容器",
              "heading": "启动容器"
            },
            {
              "depth": 2,
              "value": "后台运行",
              "heading": "后台运行"
            },
            {
              "depth": 2,
              "value": "终止容器",
              "heading": "终止容器"
            },
            {
              "depth": 2,
              "value": "进入容器",
              "heading": "进入容器"
            },
            {
              "depth": 3,
              "value": "exec 命令",
              "heading": "exec-命令"
            },
            {
              "depth": 3,
              "value": "attach 命令",
              "heading": "attach-命令"
            },
            {
              "depth": 2,
              "value": "导出和导入容器",
              "heading": "导出和导入容器"
            },
            {
              "depth": 3,
              "value": "导出容器",
              "heading": "导出容器"
            },
            {
              "depth": 3,
              "value": "导入容器",
              "heading": "导入容器"
            },
            {
              "depth": 2,
              "value": "删除容器",
              "heading": "删除容器"
            }
          ]
        },
        "title": "操作容器 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__container.md"
      },
      {
        "path": "/deploy/docker/docker-compose",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/docker-compose.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/docker-compose.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "多容器部署",
          "order": 10,
          "slugs": [
            {
              "depth": 1,
              "value": "多容器部署",
              "heading": "多容器部署"
            },
            {
              "depth": 2,
              "value": "为什么拆分",
              "heading": "为什么拆分"
            },
            {
              "depth": 2,
              "value": "阅读建议",
              "heading": "阅读建议"
            }
          ]
        },
        "title": "多容器部署 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__docker-compose.md"
      },
      {
        "path": "/deploy/docker/docker-file",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/docker-file.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/docker-file.md",
          "updatedTime": 1624588951000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "配置脚本",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "配置脚本",
              "heading": "配置脚本"
            },
            {
              "depth": 2,
              "value": "使用方法",
              "heading": "使用方法"
            },
            {
              "depth": 2,
              "value": "环境变量",
              "heading": "环境变量"
            },
            {
              "depth": 2,
              "value": "FROM",
              "heading": "from"
            },
            {
              "depth": 2,
              "value": "MAINTAINER",
              "heading": "maintainer"
            },
            {
              "depth": 2,
              "value": "WORKDIR",
              "heading": "workdir"
            },
            {
              "depth": 2,
              "value": "ENV",
              "heading": "env"
            },
            {
              "depth": 2,
              "value": "ARG",
              "heading": "arg"
            },
            {
              "depth": 2,
              "value": "RUN",
              "heading": "run"
            },
            {
              "depth": 2,
              "value": "ADD",
              "heading": "add"
            },
            {
              "depth": 2,
              "value": "COPY",
              "heading": "copy"
            },
            {
              "depth": 2,
              "value": "EXPOSE",
              "heading": "expose"
            },
            {
              "depth": 2,
              "value": "ENTRYPOINT",
              "heading": "entrypoint"
            },
            {
              "depth": 2,
              "value": "CMD",
              "heading": "cmd"
            },
            {
              "depth": 3,
              "value": "传递参数",
              "heading": "传递参数"
            },
            {
              "depth": 4,
              "value": "固定参数",
              "heading": "固定参数"
            },
            {
              "depth": 4,
              "value": "动态参数",
              "heading": "动态参数"
            },
            {
              "depth": 3,
              "value": "与 ENTRYPOINT 对比",
              "heading": "与-entrypoint-对比"
            },
            {
              "depth": 3,
              "value": "EXEC 模式的缺陷",
              "heading": "exec-模式的缺陷"
            },
            {
              "depth": 2,
              "value": "VOLUME",
              "heading": "volume"
            },
            {
              "depth": 2,
              "value": "USER",
              "heading": "user"
            },
            {
              "depth": 2,
              "value": "LABEL",
              "heading": "label"
            }
          ]
        },
        "title": "配置脚本 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__docker-file.md"
      },
      {
        "path": "/deploy/docker/extensions",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/extensions.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/extensions.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "扩展资源",
          "order": 21,
          "slugs": [
            {
              "depth": 1,
              "value": "扩展资源",
              "heading": "扩展资源"
            },
            {
              "depth": 2,
              "value": "知识体系",
              "heading": "知识体系"
            },
            {
              "depth": 2,
              "value": "资源链接",
              "heading": "资源链接"
            },
            {
              "depth": 3,
              "value": "安装教程",
              "heading": "安装教程"
            },
            {
              "depth": 3,
              "value": "文档教程",
              "heading": "文档教程"
            },
            {
              "depth": 3,
              "value": "视频教程",
              "heading": "视频教程"
            },
            {
              "depth": 3,
              "value": "实战教程",
              "heading": "实战教程"
            },
            {
              "depth": 2,
              "value": "技术社区",
              "heading": "技术社区"
            },
            {
              "depth": 2,
              "value": "行业实践",
              "heading": "行业实践"
            },
            {
              "depth": 2,
              "value": "业务实践",
              "heading": "业务实践"
            },
            {
              "depth": 3,
              "value": "微服务",
              "heading": "微服务"
            },
            {
              "depth": 3,
              "value": "容器监控",
              "heading": "容器监控"
            },
            {
              "depth": 3,
              "value": "性能优化",
              "heading": "性能优化"
            },
            {
              "depth": 3,
              "value": "容器协作",
              "heading": "容器协作"
            },
            {
              "depth": 3,
              "value": "应用实践",
              "heading": "应用实践"
            },
            {
              "depth": 2,
              "value": "其他",
              "heading": "其他"
            },
            {
              "depth": 3,
              "value": "教程系列",
              "heading": "教程系列"
            },
            {
              "depth": 3,
              "value": "路线大纲",
              "heading": "路线大纲"
            },
            {
              "depth": 3,
              "value": "工具技术",
              "heading": "工具技术"
            },
            {
              "depth": 3,
              "value": "容器平台",
              "heading": "容器平台"
            }
          ]
        },
        "title": "扩展资源 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__extensions.md"
      },
      {
        "path": "/deploy/docker/image",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/image.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/image.md",
          "updatedTime": 1594453405000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "构建镜像",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "构建镜像",
              "heading": "构建镜像"
            },
            {
              "depth": 2,
              "value": "获取镜像",
              "heading": "获取镜像"
            },
            {
              "depth": 2,
              "value": "查看镜像信息",
              "heading": "查看镜像信息"
            },
            {
              "depth": 2,
              "value": "查看镜像列表",
              "heading": "查看镜像列表"
            },
            {
              "depth": 3,
              "value": "系统占用空间",
              "heading": "系统占用空间"
            },
            {
              "depth": 3,
              "value": "虚悬镜像",
              "heading": "虚悬镜像"
            },
            {
              "depth": 2,
              "value": "删除镜像",
              "heading": "删除镜像"
            },
            {
              "depth": 2,
              "value": "制作镜像",
              "heading": "制作镜像"
            },
            {
              "depth": 3,
              "value": "定制镜像",
              "heading": "定制镜像"
            },
            {
              "depth": 2,
              "value": "导入导出镜像",
              "heading": "导入导出镜像"
            },
            {
              "depth": 3,
              "value": "压缩包导入",
              "heading": "压缩包导入"
            },
            {
              "depth": 3,
              "value": "命令导入",
              "heading": "命令导入"
            },
            {
              "depth": 3,
              "value": "导出镜像",
              "heading": "导出镜像"
            },
            {
              "depth": 2,
              "value": "上传镜像",
              "heading": "上传镜像"
            }
          ]
        },
        "title": "构建镜像 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__image.md"
      },
      {
        "path": "/deploy/docker/mongodb",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/mongodb.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/mongodb.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "部署 MongoDB",
          "order": 30,
          "slugs": [
            {
              "depth": 1,
              "value": "部署 MongoDB",
              "heading": "部署-mongodb"
            },
            {
              "depth": 2,
              "value": "镜像安装",
              "heading": "镜像安装"
            },
            {
              "depth": 2,
              "value": "容器创建",
              "heading": "容器创建"
            },
            {
              "depth": 3,
              "value": "容器基本创建方法和数据目录挂载",
              "heading": "容器基本创建方法和数据目录挂载"
            },
            {
              "depth": 3,
              "value": "容器的数据迁移",
              "heading": "容器的数据迁移"
            },
            {
              "depth": 3,
              "value": "设置登录权限问题",
              "heading": "设置登录权限问题"
            },
            {
              "depth": 2,
              "value": "容器数据目录挂载",
              "heading": "容器数据目录挂载"
            },
            {
              "depth": 2,
              "value": "数据迁移",
              "heading": "数据迁移"
            },
            {
              "depth": 2,
              "value": "常用 Docker 命令",
              "heading": "常用-docker-命令"
            }
          ]
        },
        "title": "部署 MongoDB - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__mongodb.md"
      },
      {
        "path": "/deploy/docker/network",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/network.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/network.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "网络通信",
          "order": 7,
          "slugs": [
            {
              "depth": 1,
              "value": "网络通信",
              "heading": "网络通信"
            },
            {
              "depth": 2,
              "value": "网络模式类型",
              "heading": "网络模式类型"
            },
            {
              "depth": 3,
              "value": "Bridge 模式",
              "heading": "bridge-模式"
            },
            {
              "depth": 3,
              "value": "Host 模式",
              "heading": "host-模式"
            },
            {
              "depth": 3,
              "value": "Container 模式",
              "heading": "container-模式"
            },
            {
              "depth": 3,
              "value": "None 模式",
              "heading": "none-模式"
            },
            {
              "depth": 2,
              "value": "多容器通信",
              "heading": "多容器通信"
            },
            {
              "depth": 2,
              "value": "相关指令",
              "heading": "相关指令"
            }
          ]
        },
        "title": "网络通信 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__network.md"
      },
      {
        "path": "/deploy/docker/operations-and-monitor",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/operations-and-monitor.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/operations-and-monitor.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "运维和监控",
          "order": 8,
          "slugs": [
            {
              "depth": 1,
              "value": "运维和监控",
              "heading": "运维和监控"
            }
          ]
        },
        "title": "运维和监控 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__operations-and-monitor.md"
      },
      {
        "path": "/deploy/docker/overview",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/overview.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/overview.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "基本概述",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "基本概述",
              "heading": "基本概述"
            },
            {
              "depth": 2,
              "value": "组成",
              "heading": "组成"
            },
            {
              "depth": 3,
              "value": "镜像 Image",
              "heading": "镜像-image"
            },
            {
              "depth": 3,
              "value": "容器 Container",
              "heading": "容器-container"
            },
            {
              "depth": 3,
              "value": "仓库 Registry",
              "heading": "仓库-registry"
            },
            {
              "depth": 2,
              "value": "作用",
              "heading": "作用"
            },
            {
              "depth": 2,
              "value": "优点",
              "heading": "优点"
            },
            {
              "depth": 2,
              "value": "使用场景",
              "heading": "使用场景"
            },
            {
              "depth": 2,
              "value": "虚拟机架构",
              "heading": "虚拟机架构"
            }
          ]
        },
        "title": "基本概述 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__overview.md"
      },
      {
        "path": "/deploy/docker/storage-patterns-for-persistence",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker/storage-patterns-for-persistence.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker/storage-patterns-for-persistence.md",
          "updatedTime": 1586533804000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker",
            "order": 2,
            "__fallback": true,
            "path": "/deploy/docker"
          },
          "title": "持久存储模式",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "持久存储模式",
              "heading": "持久存储模式"
            },
            {
              "depth": 2,
              "value": "默认模式",
              "heading": "默认模式"
            },
            {
              "depth": 2,
              "value": "数据卷",
              "heading": "数据卷"
            },
            {
              "depth": 3,
              "value": "创建数据卷",
              "heading": "创建数据卷"
            },
            {
              "depth": 3,
              "value": "只包含数据的容器",
              "heading": "只包含数据的容器"
            },
            {
              "depth": 3,
              "value": "查看数据卷的具体信息",
              "heading": "查看数据卷的具体信息"
            },
            {
              "depth": 3,
              "value": "启动挂载数据卷的容器",
              "heading": "启动挂载数据卷的容器"
            },
            {
              "depth": 3,
              "value": "只读数据卷",
              "heading": "只读数据卷"
            },
            {
              "depth": 3,
              "value": "删除数据卷",
              "heading": "删除数据卷"
            },
            {
              "depth": 2,
              "value": "挂载主机目录",
              "heading": "挂载主机目录"
            },
            {
              "depth": 3,
              "value": "从主机映射而得的数据卷",
              "heading": "从主机映射而得的数据卷"
            },
            {
              "depth": 3,
              "value": "挂载主机目录作为数据卷",
              "heading": "挂载主机目录作为数据卷"
            },
            {
              "depth": 3,
              "value": "挂载本地主机文件作为数据卷",
              "heading": "挂载本地主机文件作为数据卷"
            },
            {
              "depth": 3,
              "value": "从主机映射而得的数据卷，存储后端是共享存储",
              "heading": "从主机映射而得的数据卷存储后端是共享存储"
            },
            {
              "depth": 2,
              "value": "非持久化的数据存储",
              "heading": "非持久化的数据存储"
            },
            {
              "depth": 3,
              "value": "使用方法",
              "heading": "使用方法"
            },
            {
              "depth": 2,
              "value": "使用场景总结",
              "heading": "使用场景总结"
            },
            {
              "depth": 3,
              "value": "Volumes",
              "heading": "volumes"
            },
            {
              "depth": 3,
              "value": "Bind mounts",
              "heading": "bind-mounts"
            },
            {
              "depth": 3,
              "value": "tmpfs mounts",
              "heading": "tmpfs-mounts"
            }
          ]
        },
        "title": "持久存储模式 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker__storage-patterns-for-persistence.md"
      },
      {
        "path": "/deploy/docker-compose/advanced-topics",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/advanced-topics.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/advanced-topics.md",
          "updatedTime": 1775617231399,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "网络、数据与配置进阶",
          "order": 9,
          "slugs": [
            {
              "depth": 1,
              "value": "网络、数据与配置进阶",
              "heading": "网络数据与配置进阶"
            },
            {
              "depth": 2,
              "value": "bridge 网络的基本理解",
              "heading": "bridge-网络的基本理解"
            },
            {
              "depth": 2,
              "value": "容器 DNS",
              "heading": "容器-dns"
            },
            {
              "depth": 2,
              "value": "跨 Compose 项目通信",
              "heading": "跨-compose-项目通信"
            },
            {
              "depth": 3,
              "value": "方式一：使用外部网络",
              "heading": "方式一使用外部网络"
            },
            {
              "depth": 3,
              "value": "方式二：通过宿主机端口通信",
              "heading": "方式二通过宿主机端口通信"
            },
            {
              "depth": 2,
              "value": "volume 生命周期",
              "heading": "volume-生命周期"
            },
            {
              "depth": 2,
              "value": "数据备份与恢复",
              "heading": "数据备份与恢复"
            },
            {
              "depth": 3,
              "value": "备份思路",
              "heading": "备份思路"
            },
            {
              "depth": 3,
              "value": "恢复思路",
              "heading": "恢复思路"
            },
            {
              "depth": 2,
              "value": ".env 的优先级理解",
              "heading": "env-的优先级理解"
            },
            {
              "depth": 3,
              "value": "常见优先关系",
              "heading": "常见优先关系"
            },
            {
              "depth": 2,
              "value": "secrets 的敏感信息管理",
              "heading": "secrets-的敏感信息管理"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "网络、数据与配置进阶 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__advanced-topics.md"
      },
      {
        "path": "/deploy/docker-compose/build-and-delivery",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/build-and-delivery.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/build-and-delivery.md",
          "updatedTime": 1775617168559,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "构建流程与交付",
          "order": 8,
          "slugs": [
            {
              "depth": 1,
              "value": "构建流程与交付",
              "heading": "构建流程与交付"
            },
            {
              "depth": 2,
              "value": "build 与 image",
              "heading": "build-与-image"
            },
            {
              "depth": 3,
              "value": "build",
              "heading": "build"
            },
            {
              "depth": 3,
              "value": "image",
              "heading": "image"
            },
            {
              "depth": 3,
              "value": "两者结合",
              "heading": "两者结合"
            },
            {
              "depth": 2,
              "value": "build 与 Dockerfile 的关系",
              "heading": "build-与-dockerfile-的关系"
            },
            {
              "depth": 2,
              "value": "多阶段构建",
              "heading": "多阶段构建"
            },
            {
              "depth": 2,
              "value": "私有镜像仓库",
              "heading": "私有镜像仓库"
            },
            {
              "depth": 2,
              "value": "CI/CD 与 Docker Compose",
              "heading": "cicd-与-docker-compose"
            },
            {
              "depth": 3,
              "value": "1. CI 测试依赖环境",
              "heading": "1-ci-测试依赖环境"
            },
            {
              "depth": 3,
              "value": "2. 构建后做集成验证",
              "heading": "2-构建后做集成验证"
            },
            {
              "depth": 3,
              "value": "3. 服务器部署入口",
              "heading": "3-服务器部署入口"
            },
            {
              "depth": 2,
              "value": "服务器上的典型交付流程",
              "heading": "服务器上的典型交付流程"
            },
            {
              "depth": 2,
              "value": "适合本地构建还是远程拉镜像",
              "heading": "适合本地构建还是远程拉镜像"
            },
            {
              "depth": 3,
              "value": "本地/服务器构建适合：",
              "heading": "本地服务器构建适合"
            },
            {
              "depth": 3,
              "value": "远程仓库拉镜像适合：",
              "heading": "远程仓库拉镜像适合"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "构建流程与交付 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__build-and-delivery.md"
      },
      {
        "path": "/deploy/docker-compose/compose-yml-basics",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/compose-yml-basics.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/compose-yml-basics.md",
          "updatedTime": 1775617070697,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "compose.yml 基本结构",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "compose.yml 基本结构",
              "heading": "composeyml-基本结构"
            },
            {
              "depth": 2,
              "value": "基本结构",
              "heading": "基本结构"
            },
            {
              "depth": 2,
              "value": "顶层字段说明",
              "heading": "顶层字段说明"
            },
            {
              "depth": 3,
              "value": "services",
              "heading": "services"
            },
            {
              "depth": 3,
              "value": "networks",
              "heading": "networks"
            },
            {
              "depth": 3,
              "value": "volumes",
              "heading": "volumes"
            },
            {
              "depth": 3,
              "value": "configs",
              "heading": "configs"
            },
            {
              "depth": 3,
              "value": "secrets",
              "heading": "secrets"
            },
            {
              "depth": 2,
              "value": "YAML 书写规则",
              "heading": "yaml-书写规则"
            },
            {
              "depth": 3,
              "value": "缩进要统一",
              "heading": "缩进要统一"
            },
            {
              "depth": 3,
              "value": "列表使用 -",
              "heading": "列表使用--"
            },
            {
              "depth": 3,
              "value": "布尔值和端口建议加引号",
              "heading": "布尔值和端口建议加引号"
            },
            {
              "depth": 3,
              "value": "相对路径以 Compose 文件所在目录为基准",
              "heading": "相对路径以-compose-文件所在目录为基准"
            },
            {
              "depth": 2,
              "value": "一个完整但最小可运行的示例",
              "heading": "一个完整但最小可运行的示例"
            },
            {
              "depth": 2,
              "value": "常用检查命令",
              "heading": "常用检查命令"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "compose.yml 基本结构 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__compose-yml-basics.md"
      },
      {
        "path": "/deploy/docker-compose/deployment-faq-and-comparison",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/deployment-faq-and-comparison.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/deployment-faq-and-comparison.md",
          "updatedTime": 1775617231403,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "部署方案、常见问题与对比",
          "order": 10,
          "slugs": [
            {
              "depth": 1,
              "value": "部署方案、常见问题与对比",
              "heading": "部署方案常见问题与对比"
            },
            {
              "depth": 2,
              "value": "部署方案设计",
              "heading": "部署方案设计"
            },
            {
              "depth": 3,
              "value": "单机部署",
              "heading": "单机部署"
            },
            {
              "depth": 3,
              "value": "多机部署",
              "heading": "多机部署"
            },
            {
              "depth": 2,
              "value": "服务器部署架构建议",
              "heading": "服务器部署架构建议"
            },
            {
              "depth": 2,
              "value": "常见问题",
              "heading": "常见问题"
            },
            {
              "depth": 3,
              "value": "端口冲突",
              "heading": "端口冲突"
            },
            {
              "depth": 3,
              "value": "数据丢失",
              "heading": "数据丢失"
            },
            {
              "depth": 3,
              "value": "容器无法启动",
              "heading": "容器无法启动"
            },
            {
              "depth": 3,
              "value": "网络无法访问",
              "heading": "网络无法访问"
            },
            {
              "depth": 2,
              "value": "优化建议",
              "heading": "优化建议"
            },
            {
              "depth": 3,
              "value": "合理设置 restart",
              "heading": "合理设置-restart"
            },
            {
              "depth": 3,
              "value": "资源限制",
              "heading": "资源限制"
            },
            {
              "depth": 3,
              "value": "日志轮转",
              "heading": "日志轮转"
            },
            {
              "depth": 3,
              "value": "固定镜像版本",
              "heading": "固定镜像版本"
            },
            {
              "depth": 2,
              "value": "Compose vs Kubernetes",
              "heading": "compose-vs-kubernetes"
            },
            {
              "depth": 3,
              "value": "Compose 更适合",
              "heading": "compose-更适合"
            },
            {
              "depth": 3,
              "value": "Kubernetes 更适合",
              "heading": "kubernetes-更适合"
            },
            {
              "depth": 2,
              "value": "Compose 的局限与方向",
              "heading": "compose-的局限与方向"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "部署方案、常见问题与对比 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__deployment-faq-and-comparison.md"
      },
      {
        "path": "/deploy/docker-compose/network-and-volume",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/network-and-volume.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/network-and-volume.md",
          "updatedTime": 1775617070719,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "网络与数据持久化",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "网络与数据持久化",
              "heading": "网络与数据持久化"
            },
            {
              "depth": 2,
              "value": "Compose 默认网络",
              "heading": "compose-默认网络"
            },
            {
              "depth": 2,
              "value": "自定义 networks",
              "heading": "自定义-networks"
            },
            {
              "depth": 2,
              "value": "network_mode",
              "heading": "network_mode"
            },
            {
              "depth": 2,
              "value": "为什么容器删除后数据会丢",
              "heading": "为什么容器删除后数据会丢"
            },
            {
              "depth": 2,
              "value": "volumes",
              "heading": "volumes"
            },
            {
              "depth": 2,
              "value": "bind mount 与 named volume",
              "heading": "bind-mount-与-named-volume"
            },
            {
              "depth": 3,
              "value": "bind mount",
              "heading": "bind-mount"
            },
            {
              "depth": 3,
              "value": "named volume",
              "heading": "named-volume"
            },
            {
              "depth": 2,
              "value": "常见写法示例",
              "heading": "常见写法示例"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "网络与数据持久化 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__network-and-volume.md"
      },
      {
        "path": "/deploy/docker-compose/overview",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/overview.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/overview.md",
          "updatedTime": 1775617070609,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "概览",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "概览",
              "heading": "概览"
            },
            {
              "depth": 2,
              "value": "Docker Compose 解决什么问题",
              "heading": "docker-compose-解决什么问题"
            },
            {
              "depth": 2,
              "value": "与 docker run、Dockerfile 的关系",
              "heading": "与-docker-rundockerfile-的关系"
            },
            {
              "depth": 2,
              "value": "与 Kubernetes 的区别",
              "heading": "与-kubernetes-的区别"
            },
            {
              "depth": 2,
              "value": "核心概念",
              "heading": "核心概念"
            },
            {
              "depth": 3,
              "value": "service",
              "heading": "service"
            },
            {
              "depth": 3,
              "value": "container",
              "heading": "container"
            },
            {
              "depth": 3,
              "value": "image",
              "heading": "image"
            },
            {
              "depth": 3,
              "value": "network",
              "heading": "network"
            },
            {
              "depth": 3,
              "value": "volume",
              "heading": "volume"
            },
            {
              "depth": 2,
              "value": "第一个 Compose 项目",
              "heading": "第一个-compose-项目"
            },
            {
              "depth": 2,
              "value": "系列阅读导航",
              "heading": "系列阅读导航"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "概览 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__overview.md"
      },
      {
        "path": "/deploy/docker-compose/practical-cases",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/practical-cases.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/practical-cases.md",
          "updatedTime": 1775617168555,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "常见组合案例",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "常见组合案例",
              "heading": "常见组合案例"
            },
            {
              "depth": 2,
              "value": "案例一：Node.js + MySQL + Redis",
              "heading": "案例一nodejs--mysql--redis"
            },
            {
              "depth": 3,
              "value": "关键点",
              "heading": "关键点"
            },
            {
              "depth": 2,
              "value": "案例二：Nginx + 前端静态资源",
              "heading": "案例二nginx--前端静态资源"
            },
            {
              "depth": 3,
              "value": "关键点",
              "heading": "关键点-1"
            },
            {
              "depth": 2,
              "value": "案例三：Nginx + 前端 + 后端 API",
              "heading": "案例三nginx--前端--后端-api"
            },
            {
              "depth": 3,
              "value": "关键点",
              "heading": "关键点-2"
            },
            {
              "depth": 2,
              "value": "案例四：应用 + PostgreSQL",
              "heading": "案例四应用--postgresql"
            },
            {
              "depth": 2,
              "value": "这些案例的共同模式",
              "heading": "这些案例的共同模式"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "常见组合案例 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__practical-cases.md"
      },
      {
        "path": "/deploy/docker-compose/practical-details",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/practical-details.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/practical-details.md",
          "updatedTime": 1775617168557,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "实战细节",
          "order": 7,
          "slugs": [
            {
              "depth": 1,
              "value": "实战细节",
              "heading": "实战细节"
            },
            {
              "depth": 2,
              "value": "启动顺序与健康检查",
              "heading": "启动顺序与健康检查"
            },
            {
              "depth": 3,
              "value": "使用 healthcheck",
              "heading": "使用-healthcheck"
            },
            {
              "depth": 2,
              "value": "日志查看与问题定位",
              "heading": "日志查看与问题定位"
            },
            {
              "depth": 2,
              "value": "容器重建",
              "heading": "容器重建"
            },
            {
              "depth": 2,
              "value": "镜像更新",
              "heading": "镜像更新"
            },
            {
              "depth": 2,
              "value": "平滑调整思路",
              "heading": "平滑调整思路"
            },
            {
              "depth": 2,
              "value": "常见坑点",
              "heading": "常见坑点"
            },
            {
              "depth": 3,
              "value": "1. 容器起来了，但服务还没准备好",
              "heading": "1-容器起来了但服务还没准备好"
            },
            {
              "depth": 3,
              "value": "2. 应用里把数据库地址写成 localhost",
              "heading": "2-应用里把数据库地址写成-localhost"
            },
            {
              "depth": 3,
              "value": "3. 改了配置却没生效",
              "heading": "3-改了配置却没生效"
            },
            {
              "depth": 3,
              "value": "4. 删除容器后数据没了",
              "heading": "4-删除容器后数据没了"
            },
            {
              "depth": 2,
              "value": "一组常用命令",
              "heading": "一组常用命令"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "实战细节 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__practical-details.md"
      },
      {
        "path": "/deploy/docker-compose/reuse-and-config",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/reuse-and-config.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/reuse-and-config.md",
          "updatedTime": 1775617168546,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "配置拆分与复用",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "配置拆分与复用",
              "heading": "配置拆分与复用"
            },
            {
              "depth": 2,
              "value": "为什么要拆分配置",
              "heading": "为什么要拆分配置"
            },
            {
              "depth": 2,
              "value": "多文件拆分思路",
              "heading": "多文件拆分思路"
            },
            {
              "depth": 2,
              "value": "环境变量管理",
              "heading": "环境变量管理"
            },
            {
              "depth": 3,
              "value": "给 Compose 文件做变量替换",
              "heading": "给-compose-文件做变量替换"
            },
            {
              "depth": 3,
              "value": "给容器传递环境变量",
              "heading": "给容器传递环境变量"
            },
            {
              "depth": 2,
              "value": ".env 文件",
              "heading": "env-文件"
            },
            {
              "depth": 2,
              "value": "env_file",
              "heading": "env_file"
            },
            {
              "depth": 2,
              "value": "YAML Anchor 与复用配置",
              "heading": "yaml-anchor-与复用配置"
            },
            {
              "depth": 2,
              "value": "按开发、测试、生产组织配置",
              "heading": "按开发测试生产组织配置"
            },
            {
              "depth": 3,
              "value": "开发环境",
              "heading": "开发环境"
            },
            {
              "depth": 3,
              "value": "测试环境",
              "heading": "测试环境"
            },
            {
              "depth": 3,
              "value": "生产环境",
              "heading": "生产环境"
            },
            {
              "depth": 2,
              "value": "示例：公共配置 + 生产覆盖",
              "heading": "示例公共配置--生产覆盖"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "配置拆分与复用 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__reuse-and-config.md"
      },
      {
        "path": "/deploy/docker-compose/services",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/docker-compose/services.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/docker-compose/services.md",
          "updatedTime": 1775617070716,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "Docker Compose",
            "order": 3,
            "__fallback": true,
            "path": "/deploy/docker-compose"
          },
          "title": "services 详解",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "services 详解",
              "heading": "services-详解"
            },
            {
              "depth": 2,
              "value": "image 与 build",
              "heading": "image-与-build"
            },
            {
              "depth": 3,
              "value": "image",
              "heading": "image"
            },
            {
              "depth": 3,
              "value": "build",
              "heading": "build"
            },
            {
              "depth": 2,
              "value": "depends_on",
              "heading": "depends_on"
            },
            {
              "depth": 2,
              "value": "command 与 entrypoint",
              "heading": "command-与-entrypoint"
            },
            {
              "depth": 3,
              "value": "command",
              "heading": "command"
            },
            {
              "depth": 3,
              "value": "entrypoint",
              "heading": "entrypoint"
            },
            {
              "depth": 2,
              "value": "ports 与 expose",
              "heading": "ports-与-expose"
            },
            {
              "depth": 3,
              "value": "ports",
              "heading": "ports"
            },
            {
              "depth": 3,
              "value": "expose",
              "heading": "expose"
            },
            {
              "depth": 2,
              "value": "restart",
              "heading": "restart"
            },
            {
              "depth": 2,
              "value": "environment",
              "heading": "environment"
            },
            {
              "depth": 2,
              "value": "服务之间如何通信",
              "heading": "服务之间如何通信"
            },
            {
              "depth": 2,
              "value": "综合示例",
              "heading": "综合示例"
            },
            {
              "depth": 2,
              "value": "注意事项",
              "heading": "注意事项"
            }
          ]
        },
        "title": "services 详解 - DevOps Guidebook",
        "_chunkName": "docs__deploy__docker-compose__services.md"
      },
      {
        "path": "/deploy/theory/blue-green-deployment",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/blue-green-deployment.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/blue-green-deployment.md",
          "updatedTime": 1596277629000,
          "slugs": [
            {
              "depth": 1,
              "value": "蓝绿部署",
              "heading": "蓝绿部署"
            }
          ],
          "title": "蓝绿部署",
          "nav": {
            "path": "/deploy",
            "title": "部署"
          },
          "group": {
            "path": "/deploy/theory",
            "title": "部署理论"
          }
        },
        "title": "蓝绿部署 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__blue-green-deployment.md"
      },
      {
        "path": "/deploy/theory/continuous-deployment",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/continuous-deployment.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/continuous-deployment.md",
          "updatedTime": 1596277629000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "部署理论",
            "order": 1,
            "__fallback": true,
            "path": "/deploy/theory"
          },
          "title": "持续部署",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "持续部署",
              "heading": "持续部署"
            }
          ]
        },
        "title": "持续部署 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__continuous-deployment.md"
      },
      {
        "path": "/deploy/theory/continuous-dilivery",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/continuous-dilivery.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/continuous-dilivery.md",
          "updatedTime": 1596277629000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "部署理论",
            "order": 1,
            "__fallback": true,
            "path": "/deploy/theory"
          },
          "title": "持续交付",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "持续交付",
              "heading": "持续交付"
            }
          ]
        },
        "title": "持续交付 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__continuous-dilivery.md"
      },
      {
        "path": "/deploy/theory/continuous-integration",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/continuous-integration.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/continuous-integration.md",
          "updatedTime": 1596277629000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "部署理论",
            "order": 1,
            "__fallback": true,
            "path": "/deploy/theory"
          },
          "title": "持续集成",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "持续集成",
              "heading": "持续集成"
            }
          ]
        },
        "title": "持续集成 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__continuous-integration.md"
      },
      {
        "path": "/deploy/theory/environment",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/environment.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/environment.md",
          "updatedTime": 1596277629000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "部署理论",
            "order": 1,
            "__fallback": true,
            "path": "/deploy/theory"
          },
          "title": "环境区分",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "环境区分",
              "heading": "环境区分"
            },
            {
              "depth": 2,
              "value": "开发环境",
              "heading": "开发环境"
            },
            {
              "depth": 2,
              "value": "测试环境",
              "heading": "测试环境"
            },
            {
              "depth": 2,
              "value": "回归环境",
              "heading": "回归环境"
            },
            {
              "depth": 2,
              "value": "镜像环境",
              "heading": "镜像环境"
            },
            {
              "depth": 2,
              "value": "预发布环境",
              "heading": "预发布环境"
            },
            {
              "depth": 2,
              "value": "灰度环境",
              "heading": "灰度环境"
            },
            {
              "depth": 2,
              "value": "生产环境",
              "heading": "生产环境"
            }
          ]
        },
        "title": "环境区分 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__environment.md"
      },
      {
        "path": "/deploy/theory/gray-release",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/gray-release.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/gray-release.md",
          "updatedTime": 1596277629000,
          "slugs": [
            {
              "depth": 1,
              "value": "灰度部署",
              "heading": "灰度部署"
            },
            {
              "depth": 2,
              "value": "优点",
              "heading": "优点"
            },
            {
              "depth": 2,
              "value": "要素",
              "heading": "要素"
            },
            {
              "depth": 2,
              "value": "原理",
              "heading": "原理"
            },
            {
              "depth": 2,
              "value": "方式",
              "heading": "方式"
            }
          ],
          "title": "灰度部署",
          "nav": {
            "path": "/deploy",
            "title": "部署"
          },
          "group": {
            "path": "/deploy/theory",
            "title": "部署理论"
          }
        },
        "title": "灰度部署 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__gray-release.md"
      },
      {
        "path": "/deploy/theory",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/index.md",
          "updatedTime": 1596277629000,
          "nav": {
            "title": "部署",
            "order": 4,
            "path": "/deploy"
          },
          "group": {
            "title": "部署理论",
            "order": 1,
            "__fallback": true,
            "path": "/deploy/theory"
          },
          "title": "基本概述",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "基本概述",
              "heading": "基本概述"
            }
          ]
        },
        "title": "基本概述 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__index.md"
      },
      {
        "path": "/deploy/theory/rolling-update",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/deploy/theory/rolling-update.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/deploy/theory/rolling-update.md",
          "updatedTime": 1596277629000,
          "slugs": [
            {
              "depth": 1,
              "value": "滚动部署",
              "heading": "滚动部署"
            }
          ],
          "title": "滚动部署",
          "nav": {
            "path": "/deploy",
            "title": "部署"
          },
          "group": {
            "path": "/deploy/theory",
            "title": "部署理论"
          }
        },
        "title": "滚动部署 - DevOps Guidebook",
        "_chunkName": "docs__deploy__theory__rolling-update.md"
      },
      {
        "path": "/devops/devops",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/devops/devops.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/devops/devops.md",
          "updatedTime": 1594453482000,
          "nav": {
            "title": "DevOps",
            "order": 6,
            "path": "/devops"
          },
          "group": {
            "title": "DevOps",
            "order": 1,
            "__fallback": true,
            "path": "/devops"
          },
          "title": "DevOps",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "DevOps",
              "heading": "devops"
            },
            {
              "depth": 2,
              "value": "Ledge",
              "heading": "ledge"
            }
          ]
        },
        "title": "DevOps - DevOps Guidebook",
        "_chunkName": "docs__devops__devops.md"
      },
      {
        "path": "/devops/extensions/extensions",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/devops/extensions/extensions.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/devops/extensions/extensions.md",
          "updatedTime": 1624530359000,
          "nav": {
            "title": "DevOps",
            "order": 6,
            "path": "/devops"
          },
          "group": {
            "title": "扩展资料",
            "order": 100,
            "__fallback": true,
            "path": "/devops/extensions"
          },
          "title": "扩展资料",
          "order": 100,
          "slugs": [
            {
              "depth": 1,
              "value": "扩展资料",
              "heading": "扩展资料"
            },
            {
              "depth": 2,
              "value": "Linux",
              "heading": "linux"
            },
            {
              "depth": 2,
              "value": "Nginx",
              "heading": "nginx"
            },
            {
              "depth": 2,
              "value": "ELK",
              "heading": "elk"
            },
            {
              "depth": 2,
              "value": "MongoDB",
              "heading": "mongodb"
            },
            {
              "depth": 2,
              "value": "Git",
              "heading": "git"
            },
            {
              "depth": 2,
              "value": "Docker",
              "heading": "docker"
            },
            {
              "depth": 2,
              "value": "Rancher",
              "heading": "rancher"
            }
          ]
        },
        "title": "扩展资料 - DevOps Guidebook",
        "_chunkName": "docs__devops__extensions__extensions.md"
      },
      {
        "path": "/devops/extensions/open-source",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/devops/extensions/open-source.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/devops/extensions/open-source.md",
          "updatedTime": 1624530359000,
          "nav": {
            "title": "DevOps",
            "order": 6,
            "path": "/devops"
          },
          "group": {
            "title": "扩展资料",
            "order": 100,
            "__fallback": true,
            "path": "/devops/extensions"
          },
          "title": "开源项目",
          "order": 101,
          "slugs": [
            {
              "depth": 1,
              "value": "开源项目",
              "heading": "开源项目"
            },
            {
              "depth": 2,
              "value": "ELK",
              "heading": "elk"
            },
            {
              "depth": 2,
              "value": "Docker",
              "heading": "docker"
            }
          ]
        },
        "title": "开源项目 - DevOps Guidebook",
        "_chunkName": "docs__devops__extensions__open-source.md"
      },
      {
        "path": "/devops/extensions/utils",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/devops/extensions/utils.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/devops/extensions/utils.md",
          "updatedTime": 1633000576000,
          "slugs": [
            {
              "depth": 1,
              "value": "实用工具",
              "heading": "实用工具"
            },
            {
              "depth": 2,
              "value": "Nginx",
              "heading": "nginx"
            }
          ],
          "title": "实用工具",
          "nav": {
            "path": "/devops",
            "title": "DevOps"
          },
          "group": {
            "path": "/devops/extensions",
            "title": "扩展资料"
          }
        },
        "title": "实用工具 - DevOps Guidebook",
        "_chunkName": "docs__devops__extensions__utils.md"
      },
      {
        "path": "/linux/command/collection",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/collection.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/collection.md",
          "updatedTime": 1626778549000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "命令大全",
          "order": 20,
          "slugs": [
            {
              "depth": 1,
              "value": "命令大全",
              "heading": "命令大全"
            },
            {
              "depth": 2,
              "value": "文件管理",
              "heading": "文件管理"
            },
            {
              "depth": 2,
              "value": "文档编辑",
              "heading": "文档编辑"
            },
            {
              "depth": 2,
              "value": "文件传输",
              "heading": "文件传输"
            },
            {
              "depth": 2,
              "value": "磁盘管理",
              "heading": "磁盘管理"
            },
            {
              "depth": 2,
              "value": "磁盘维护",
              "heading": "磁盘维护"
            },
            {
              "depth": 2,
              "value": "网络通讯",
              "heading": "网络通讯"
            },
            {
              "depth": 2,
              "value": "系统管理",
              "heading": "系统管理"
            },
            {
              "depth": 2,
              "value": "系统设置",
              "heading": "系统设置"
            },
            {
              "depth": 2,
              "value": "备份压缩",
              "heading": "备份压缩"
            },
            {
              "depth": 2,
              "value": "设备管理",
              "heading": "设备管理"
            },
            {
              "depth": 2,
              "value": "其他",
              "heading": "其他"
            }
          ]
        },
        "title": "命令大全 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__collection.md"
      },
      {
        "path": "/linux/command/combination",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/combination.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/combination.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "命令组合",
          "order": 19,
          "slugs": [
            {
              "depth": 1,
              "value": "命令组合",
              "heading": "命令组合"
            },
            {
              "depth": 2,
              "value": "文件管理",
              "heading": "文件管理"
            },
            {
              "depth": 2,
              "value": "MacOS",
              "heading": "macos"
            }
          ]
        },
        "title": "命令组合 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__combination.md"
      },
      {
        "path": "/linux/command/devices",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/devices.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/devices.md",
          "updatedTime": 1626095331000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "设备管理",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "设备管理",
              "heading": "设备管理"
            },
            {
              "depth": 2,
              "value": "磁盘管理",
              "heading": "磁盘管理"
            },
            {
              "depth": 2,
              "value": "fdisk",
              "heading": "fdisk"
            },
            {
              "depth": 3,
              "value": "df",
              "heading": "df"
            },
            {
              "depth": 3,
              "value": "du",
              "heading": "du"
            },
            {
              "depth": 2,
              "value": "内核与模块管理",
              "heading": "内核与模块管理"
            },
            {
              "depth": 3,
              "value": "uname",
              "heading": "uname"
            },
            {
              "depth": 2,
              "value": "性能监测与优化",
              "heading": "性能监测与优化"
            },
            {
              "depth": 3,
              "value": "lsof",
              "heading": "lsof"
            },
            {
              "depth": 3,
              "value": "free",
              "heading": "free"
            },
            {
              "depth": 3,
              "value": "top",
              "heading": "top"
            }
          ]
        },
        "title": "设备管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__devices.md"
      },
      {
        "path": "/linux/command/directory",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/directory.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/directory.md",
          "updatedTime": 1594221041000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "目录管理",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "目录管理",
              "heading": "目录管理"
            },
            {
              "depth": 2,
              "value": "install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "tree",
              "heading": "tree"
            },
            {
              "depth": 2,
              "value": "popd",
              "heading": "popd"
            },
            {
              "depth": 2,
              "value": "pushd",
              "heading": "pushd"
            },
            {
              "depth": 2,
              "value": "dirs",
              "heading": "dirs"
            },
            {
              "depth": 2,
              "value": "rmdir",
              "heading": "rmdir"
            },
            {
              "depth": 2,
              "value": "mkdir",
              "heading": "mkdir"
            },
            {
              "depth": 2,
              "value": "rm",
              "heading": "rm"
            },
            {
              "depth": 2,
              "value": "pwd",
              "heading": "pwd"
            },
            {
              "depth": 2,
              "value": "ls",
              "heading": "ls"
            },
            {
              "depth": 2,
              "value": "mv",
              "heading": "mv"
            },
            {
              "depth": 2,
              "value": "cp",
              "heading": "cp"
            },
            {
              "depth": 2,
              "value": "cd",
              "heading": "cd"
            },
            {
              "depth": 2,
              "value": "通配符",
              "heading": "通配符"
            }
          ]
        },
        "title": "目录管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__directory.md"
      },
      {
        "path": "/linux/command/environment-variable",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/environment-variable.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/environment-variable.md",
          "updatedTime": 1594453424000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "常用命令",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "环境变量",
          "order": 100,
          "slugs": [
            {
              "depth": 1,
              "value": "环境变量",
              "heading": "环境变量"
            },
            {
              "depth": 2,
              "value": "export",
              "heading": "export"
            }
          ]
        },
        "title": "环境变量 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__environment-variable.md"
      },
      {
        "path": "/linux/command/file",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/file.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/file.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "文件管理",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "文件管理",
              "heading": "文件管理"
            },
            {
              "depth": 2,
              "value": "文件传输",
              "heading": "文件传输"
            },
            {
              "depth": 3,
              "value": "scp",
              "heading": "scp"
            },
            {
              "depth": 2,
              "value": "文件处理",
              "heading": "文件处理"
            },
            {
              "depth": 3,
              "value": "ln",
              "heading": "ln"
            },
            {
              "depth": 3,
              "value": "cat",
              "heading": "cat"
            },
            {
              "depth": 2,
              "value": "文件查找和比较",
              "heading": "文件查找和比较"
            },
            {
              "depth": 3,
              "value": "diff",
              "heading": "diff"
            },
            {
              "depth": 3,
              "value": "which",
              "heading": "which"
            },
            {
              "depth": 3,
              "value": "find",
              "heading": "find"
            },
            {
              "depth": 2,
              "value": "文件查看",
              "heading": "文件查看"
            },
            {
              "depth": 3,
              "value": "tail",
              "heading": "tail"
            },
            {
              "depth": 3,
              "value": "head",
              "heading": "head"
            },
            {
              "depth": 3,
              "value": "less",
              "heading": "less"
            },
            {
              "depth": 3,
              "value": "cut",
              "heading": "cut"
            },
            {
              "depth": 3,
              "value": "wc",
              "heading": "wc"
            },
            {
              "depth": 3,
              "value": "cksum",
              "heading": "cksum"
            },
            {
              "depth": 2,
              "value": "文件编辑",
              "heading": "文件编辑"
            },
            {
              "depth": 3,
              "value": "vi / vim",
              "heading": "vi--vim"
            },
            {
              "depth": 3,
              "value": "sed",
              "heading": "sed"
            },
            {
              "depth": 2,
              "value": "文件权限",
              "heading": "文件权限"
            },
            {
              "depth": 3,
              "value": "chmod",
              "heading": "chmod"
            },
            {
              "depth": 3,
              "value": "chown",
              "heading": "chown"
            },
            {
              "depth": 3,
              "value": "chgrp",
              "heading": "chgrp"
            },
            {
              "depth": 3,
              "value": "stat",
              "heading": "stat"
            },
            {
              "depth": 3,
              "value": "file",
              "heading": "file"
            },
            {
              "depth": 2,
              "value": "文件过滤分割与合并",
              "heading": "文件过滤分割与合并"
            },
            {
              "depth": 3,
              "value": "grep",
              "heading": "grep"
            },
            {
              "depth": 3,
              "value": "sort",
              "heading": "sort"
            },
            {
              "depth": 2,
              "value": "文件压缩与解压",
              "heading": "文件压缩与解压"
            },
            {
              "depth": 3,
              "value": "tar",
              "heading": "tar"
            },
            {
              "depth": 3,
              "value": "gzip & gunzip",
              "heading": "gzip--gunzip"
            },
            {
              "depth": 3,
              "value": "zip & unzip",
              "heading": "zip--unzip"
            },
            {
              "depth": 2,
              "value": "文件备份和恢复",
              "heading": "文件备份和恢复"
            },
            {
              "depth": 3,
              "value": "dd",
              "heading": "dd"
            },
            {
              "depth": 4,
              "value": "原地修改数据",
              "heading": "原地修改数据"
            },
            {
              "depth": 4,
              "value": "用随机数据生成文件",
              "heading": "用随机数据生成文件"
            }
          ]
        },
        "title": "文件管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__file.md"
      },
      {
        "path": "/linux/command/network",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/network.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/network.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "网络管理",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "网络管理",
              "heading": "网络管理"
            },
            {
              "depth": 2,
              "value": "网络应用",
              "heading": "网络应用"
            },
            {
              "depth": 3,
              "value": "curl",
              "heading": "curl"
            },
            {
              "depth": 3,
              "value": "wget",
              "heading": "wget"
            },
            {
              "depth": 2,
              "value": "高级网络",
              "heading": "高级网络"
            },
            {
              "depth": 3,
              "value": "iptables",
              "heading": "iptables"
            },
            {
              "depth": 2,
              "value": "网络测试",
              "heading": "网络测试"
            },
            {
              "depth": 3,
              "value": "host",
              "heading": "host"
            },
            {
              "depth": 3,
              "value": "nslookup",
              "heading": "nslookup"
            },
            {
              "depth": 3,
              "value": "dig",
              "heading": "dig"
            },
            {
              "depth": 3,
              "value": "ping",
              "heading": "ping"
            },
            {
              "depth": 3,
              "value": "netstat",
              "heading": "netstat"
            },
            {
              "depth": 2,
              "value": "网络安全",
              "heading": "网络安全"
            },
            {
              "depth": 3,
              "value": "ssh",
              "heading": "ssh"
            },
            {
              "depth": 3,
              "value": "ssh-keygen",
              "heading": "ssh-keygen"
            },
            {
              "depth": 3,
              "value": "ssh-add",
              "heading": "ssh-add"
            },
            {
              "depth": 3,
              "value": "ssh-agent",
              "heading": "ssh-agent"
            },
            {
              "depth": 2,
              "value": "网络配置",
              "heading": "网络配置"
            },
            {
              "depth": 3,
              "value": "ifconfig",
              "heading": "ifconfig"
            },
            {
              "depth": 3,
              "value": "route",
              "heading": "route"
            },
            {
              "depth": 3,
              "value": "ip",
              "heading": "ip"
            }
          ]
        },
        "title": "网络管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__network.md"
      },
      {
        "path": "/linux/command/other",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/other.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/other.md",
          "updatedTime": 1626778549000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "其他命令",
          "order": 7,
          "slugs": [
            {
              "depth": 1,
              "value": "其他命令",
              "heading": "其他命令"
            },
            {
              "depth": 2,
              "value": "date",
              "heading": "date"
            },
            {
              "depth": 2,
              "value": "xargs",
              "heading": "xargs"
            }
          ]
        },
        "title": "其他命令 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__other.md"
      },
      {
        "path": "/linux/command/package",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/package.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/package.md",
          "updatedTime": 1594396124000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "软件包管理",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "软件包管理",
              "heading": "软件包管理"
            },
            {
              "depth": 2,
              "value": "rpm",
              "heading": "rpm"
            },
            {
              "depth": 2,
              "value": "yum",
              "heading": "yum"
            },
            {
              "depth": 2,
              "value": "man",
              "heading": "man"
            },
            {
              "depth": 2,
              "value": "help",
              "heading": "help"
            },
            {
              "depth": 2,
              "value": "info",
              "heading": "info"
            },
            {
              "depth": 2,
              "value": "grub",
              "heading": "grub"
            }
          ]
        },
        "title": "软件包管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__package.md"
      },
      {
        "path": "/linux/command/system",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/command/system.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/command/system.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "命令分类",
            "order": 1,
            "__fallback": true,
            "path": "/linux/command"
          },
          "title": "系统管理",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "系统管理",
              "heading": "系统管理"
            },
            {
              "depth": 2,
              "value": "进程信息",
              "heading": "进程信息"
            },
            {
              "depth": 2,
              "value": "进程和作业",
              "heading": "进程和作业"
            },
            {
              "depth": 3,
              "value": "systemctl",
              "heading": "systemctl"
            },
            {
              "depth": 3,
              "value": "ps",
              "heading": "ps"
            },
            {
              "depth": 3,
              "value": "pstree",
              "heading": "pstree"
            },
            {
              "depth": 3,
              "value": "at",
              "heading": "at"
            },
            {
              "depth": 3,
              "value": "nice",
              "heading": "nice"
            },
            {
              "depth": 3,
              "value": "renice",
              "heading": "renice"
            },
            {
              "depth": 3,
              "value": "kill",
              "heading": "kill"
            },
            {
              "depth": 3,
              "value": "nohup",
              "heading": "nohup"
            },
            {
              "depth": 2,
              "value": "用户和工作组",
              "heading": "用户和工作组"
            },
            {
              "depth": 3,
              "value": "useradd",
              "heading": "useradd"
            },
            {
              "depth": 3,
              "value": "userdel",
              "heading": "userdel"
            },
            {
              "depth": 3,
              "value": "usermod",
              "heading": "usermod"
            },
            {
              "depth": 3,
              "value": "groupadd",
              "heading": "groupadd"
            },
            {
              "depth": 3,
              "value": "groupdel",
              "heading": "groupdel"
            },
            {
              "depth": 3,
              "value": "groupmode",
              "heading": "groupmode"
            },
            {
              "depth": 3,
              "value": "passwd",
              "heading": "passwd"
            },
            {
              "depth": 3,
              "value": "su",
              "heading": "su"
            },
            {
              "depth": 3,
              "value": "sudo",
              "heading": "sudo"
            },
            {
              "depth": 3,
              "value": "id",
              "heading": "id"
            },
            {
              "depth": 3,
              "value": "mount",
              "heading": "mount"
            },
            {
              "depth": 3,
              "value": "crontab",
              "heading": "crontab"
            },
            {
              "depth": 3,
              "value": "用户和用户组的配置文件",
              "heading": "用户和用户组的配置文件"
            }
          ]
        },
        "title": "系统管理 - DevOps Guidebook",
        "_chunkName": "docs__linux__command__system.md"
      },
      {
        "path": "/linux/common-directory",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/common-directory.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/common-directory.md",
          "updatedTime": 1624588951000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "常见目录",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "常见目录",
              "heading": "常见目录"
            },
            {
              "depth": 2,
              "value": "常用的系统文件目录",
              "heading": "常用的系统文件目录"
            },
            {
              "depth": 2,
              "value": "其他文件目录",
              "heading": "其他文件目录"
            },
            {
              "depth": 2,
              "value": "虚拟文件系统",
              "heading": "虚拟文件系统"
            },
            {
              "depth": 3,
              "value": "系统信息",
              "heading": "系统信息"
            },
            {
              "depth": 3,
              "value": "进程信息",
              "heading": "进程信息"
            },
            {
              "depth": 2,
              "value": "数据文件系统",
              "heading": "数据文件系统"
            }
          ]
        },
        "title": "常见目录 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__common-directory.md"
      },
      {
        "path": "/linux/file-permission",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/file-permission.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/file-permission.md",
          "updatedTime": 1594453424000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "文件权限",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "文件权限",
              "heading": "文件权限"
            },
            {
              "depth": 2,
              "value": "文件类型",
              "heading": "文件类型"
            },
            {
              "depth": 2,
              "value": "文件权限的表示方法",
              "heading": "文件权限的表示方法"
            },
            {
              "depth": 2,
              "value": "目录权限的表示方法",
              "heading": "目录权限的表示方法"
            },
            {
              "depth": 2,
              "value": "特殊权限",
              "heading": "特殊权限"
            }
          ]
        },
        "title": "文件权限 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__file-permission.md"
      },
      {
        "path": "/linux/firewall",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/firewall.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/firewall.md",
          "updatedTime": 1594453424000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "防火墙",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "防火墙",
              "heading": "防火墙"
            },
            {
              "depth": 2,
              "value": "添加端口到防火墙",
              "heading": "添加端口到防火墙"
            },
            {
              "depth": 3,
              "value": "基本操作",
              "heading": "基本操作"
            },
            {
              "depth": 2,
              "value": "设置端口",
              "heading": "设置端口"
            }
          ]
        },
        "title": "防火墙 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__firewall.md"
      },
      {
        "path": "/linux",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/index.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "基本概要",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "基本概要",
              "heading": "基本概要"
            },
            {
              "depth": 2,
              "value": "抽象级别和层次",
              "heading": "抽象级别和层次"
            },
            {
              "depth": 2,
              "value": "硬件系统",
              "heading": "硬件系统"
            },
            {
              "depth": 2,
              "value": "内核",
              "heading": "内核"
            },
            {
              "depth": 3,
              "value": "系统调用和系统支持",
              "heading": "系统调用和系统支持"
            },
            {
              "depth": 3,
              "value": "系统内存管理",
              "heading": "系统内存管理"
            },
            {
              "depth": 3,
              "value": "软件程序管理",
              "heading": "软件程序管理"
            },
            {
              "depth": 3,
              "value": "硬件设备管理",
              "heading": "硬件设备管理"
            },
            {
              "depth": 3,
              "value": "文件系统管理",
              "heading": "文件系统管理"
            }
          ]
        },
        "title": "基本概要 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__index.md"
      },
      {
        "path": "/linux/package",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/package.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/package.md",
          "updatedTime": 1594453424000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "软件包",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "软件包",
              "heading": "软件包"
            },
            {
              "depth": 2,
              "value": "其他方式安装",
              "heading": "其他方式安装"
            },
            {
              "depth": 2,
              "value": "升级内核",
              "heading": "升级内核"
            }
          ]
        },
        "title": "软件包 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__package.md"
      },
      {
        "path": "/linux/process",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/linux/process.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/linux/process.md",
          "updatedTime": 1594453424000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Linux 系统",
            "order": 1,
            "__fallback": true,
            "path": "/linux"
          },
          "title": "进程",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "进程",
              "heading": "进程"
            },
            {
              "depth": 2,
              "value": "进程的概念",
              "heading": "进程的概念"
            },
            {
              "depth": 2,
              "value": "进程通信",
              "heading": "进程通信"
            },
            {
              "depth": 2,
              "value": "守护进程",
              "heading": "守护进程"
            }
          ]
        },
        "title": "进程 - DevOps Guidebook",
        "_chunkName": "docs__linux__linux__process.md"
      },
      {
        "path": "/linux/shell/command",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/command.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/command.md",
          "updatedTime": 1594453351000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "命令",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "命令",
              "heading": "命令"
            },
            {
              "depth": 2,
              "value": "内建命令",
              "heading": "内建命令"
            },
            {
              "depth": 2,
              "value": "alias",
              "heading": "alias"
            },
            {
              "depth": 2,
              "value": "echo",
              "heading": "echo"
            },
            {
              "depth": 2,
              "value": "read",
              "heading": "read"
            },
            {
              "depth": 2,
              "value": "exit",
              "heading": "exit"
            },
            {
              "depth": 2,
              "value": "let",
              "heading": "let"
            },
            {
              "depth": 2,
              "value": "expr",
              "heading": "expr"
            },
            {
              "depth": 2,
              "value": "bc",
              "heading": "bc"
            },
            {
              "depth": 2,
              "value": "test",
              "heading": "test"
            },
            {
              "depth": 3,
              "value": "文件检测",
              "heading": "文件检测"
            },
            {
              "depth": 3,
              "value": "逻辑运算",
              "heading": "逻辑运算"
            }
          ]
        },
        "title": "命令 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__command.md"
      },
      {
        "path": "/linux/shell/expression",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/expression.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/expression.md",
          "updatedTime": 1645450801000,
          "slugs": [
            {
              "depth": 1,
              "value": "表达式",
              "heading": "表达式"
            },
            {
              "depth": 2,
              "value": "文件表达式",
              "heading": "文件表达式"
            },
            {
              "depth": 2,
              "value": "整数变量表达式",
              "heading": "整数变量表达式"
            },
            {
              "depth": 2,
              "value": "字符串变量表达式",
              "heading": "字符串变量表达式"
            }
          ],
          "title": "表达式",
          "nav": {
            "path": "/linux",
            "title": "Linux"
          },
          "group": {
            "path": "/linux/shell",
            "title": "Shell 编程"
          }
        },
        "title": "表达式 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__expression.md"
      },
      {
        "path": "/linux/shell/function",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/function.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/function.md",
          "updatedTime": 1595087390000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "函数",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "函数",
              "heading": "函数"
            },
            {
              "depth": 2,
              "value": "参数变量",
              "heading": "参数变量"
            },
            {
              "depth": 3,
              "value": "传递参数",
              "heading": "传递参数"
            },
            {
              "depth": 3,
              "value": "局部变量",
              "heading": "局部变量"
            },
            {
              "depth": 2,
              "value": "返回值",
              "heading": "返回值"
            },
            {
              "depth": 2,
              "value": "系统脚本",
              "heading": "系统脚本"
            }
          ]
        },
        "title": "函数 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__function.md"
      },
      {
        "path": "/linux/shell",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/index.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "概述",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "Shell",
              "heading": "shell"
            },
            {
              "depth": 2,
              "value": "Shell 脚本",
              "heading": "shell-脚本"
            },
            {
              "depth": 2,
              "value": "参考资料",
              "heading": "参考资料"
            }
          ]
        },
        "title": "概述 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__index.md"
      },
      {
        "path": "/linux/shell/shell-control",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/shell-control.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/shell-control.md",
          "updatedTime": 1595087390000,
          "slugs": [
            {
              "depth": 1,
              "value": "脚本控制",
              "heading": "脚本控制"
            },
            {
              "depth": 2,
              "value": "处理信号",
              "heading": "处理信号"
            },
            {
              "depth": 3,
              "value": "生成信号",
              "heading": "生成信号"
            },
            {
              "depth": 3,
              "value": "捕获信号",
              "heading": "捕获信号"
            },
            {
              "depth": 3,
              "value": "捕获脚本退出",
              "heading": "捕获脚本退出"
            },
            {
              "depth": 2,
              "value": "以后台模式运行脚本",
              "heading": "以后台模式运行脚本"
            },
            {
              "depth": 2,
              "value": "调度优先级控制",
              "heading": "调度优先级控制"
            },
            {
              "depth": 2,
              "value": "计划任务",
              "heading": "计划任务"
            },
            {
              "depth": 3,
              "value": "一次性计划任务",
              "heading": "一次性计划任务"
            },
            {
              "depth": 3,
              "value": "周期性计划任务",
              "heading": "周期性计划任务"
            },
            {
              "depth": 3,
              "value": "计划任务加锁",
              "heading": "计划任务加锁"
            }
          ],
          "title": "脚本控制",
          "nav": {
            "path": "/linux",
            "title": "Linux"
          },
          "group": {
            "path": "/linux/shell",
            "title": "Shell 编程"
          }
        },
        "title": "脚本控制 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__shell-control.md"
      },
      {
        "path": "/linux/shell/sign",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/sign.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/sign.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "特殊符号",
          "order": 10,
          "slugs": [
            {
              "depth": 1,
              "value": "特殊符号",
              "heading": "特殊符号"
            },
            {
              "depth": 2,
              "value": "井号",
              "heading": "井号"
            },
            {
              "depth": 2,
              "value": "账户 Home 目录",
              "heading": "账户-home-目录"
            },
            {
              "depth": 2,
              "value": "分号",
              "heading": "分号"
            },
            {
              "depth": 2,
              "value": "连续分号",
              "heading": "连续分号"
            },
            {
              "depth": 2,
              "value": "逗号",
              "heading": "逗号"
            },
            {
              "depth": 2,
              "value": "单引号",
              "heading": "单引号"
            },
            {
              "depth": 2,
              "value": "双引号",
              "heading": "双引号"
            },
            {
              "depth": 2,
              "value": "倒引号",
              "heading": "倒引号"
            },
            {
              "depth": 2,
              "value": "逗点",
              "heading": "逗点"
            },
            {
              "depth": 2,
              "value": "斜线",
              "heading": "斜线"
            },
            {
              "depth": 2,
              "value": "倒斜线",
              "heading": "倒斜线"
            },
            {
              "depth": 2,
              "value": "管道",
              "heading": "管道"
            },
            {
              "depth": 2,
              "value": "惊叹号",
              "heading": "惊叹号"
            },
            {
              "depth": 2,
              "value": "冒号",
              "heading": "冒号"
            },
            {
              "depth": 2,
              "value": "问号",
              "heading": "问号"
            },
            {
              "depth": 2,
              "value": "星号",
              "heading": "星号"
            },
            {
              "depth": 2,
              "value": "次方运算",
              "heading": "次方运算"
            },
            {
              "depth": 2,
              "value": "钱号",
              "heading": "钱号"
            },
            {
              "depth": 2,
              "value": "指令群组",
              "heading": "指令群组"
            },
            {
              "depth": 2,
              "value": "大括号",
              "heading": "大括号"
            },
            {
              "depth": 2,
              "value": "中括号",
              "heading": "中括号"
            },
            {
              "depth": 2,
              "value": "逻辑符号",
              "heading": "逻辑符号"
            },
            {
              "depth": 2,
              "value": "后台工作",
              "heading": "后台工作"
            },
            {
              "depth": 2,
              "value": "特殊字符",
              "heading": "特殊字符"
            },
            {
              "depth": 3,
              "value": "转义符号",
              "heading": "转义符号"
            },
            {
              "depth": 2,
              "value": "赋值运算符",
              "heading": "赋值运算符"
            },
            {
              "depth": 2,
              "value": "算数运算符",
              "heading": "算数运算符"
            },
            {
              "depth": 2,
              "value": "数字常量",
              "heading": "数字常量"
            },
            {
              "depth": 2,
              "value": "双圆括号",
              "heading": "双圆括号"
            },
            {
              "depth": 2,
              "value": "重定向符号",
              "heading": "重定向符号"
            }
          ]
        },
        "title": "特殊符号 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__sign.md"
      },
      {
        "path": "/linux/shell/structured-command",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/structured-command.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/structured-command.md",
          "updatedTime": 1595039025000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "结构化命令",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "结构化命令",
              "heading": "结构化命令"
            },
            {
              "depth": 2,
              "value": "if else",
              "heading": "if-else"
            },
            {
              "depth": 3,
              "value": "if else 语句",
              "heading": "if-else-语句"
            },
            {
              "depth": 3,
              "value": "if elif else 语句",
              "heading": "if-elif-else-语句"
            },
            {
              "depth": 3,
              "value": "嵌套 if 语句",
              "heading": "嵌套-if-语句"
            },
            {
              "depth": 2,
              "value": "case in",
              "heading": "case-in"
            },
            {
              "depth": 2,
              "value": "for",
              "heading": "for"
            },
            {
              "depth": 3,
              "value": "从命令中读取值",
              "heading": "从命令中读取值"
            },
            {
              "depth": 3,
              "value": "更改字段分隔符",
              "heading": "更改字段分隔符"
            },
            {
              "depth": 3,
              "value": "用通配符读取目录",
              "heading": "用通配符读取目录"
            },
            {
              "depth": 3,
              "value": "C 语言风格的 for 命令",
              "heading": "c-语言风格的-for-命令"
            },
            {
              "depth": 2,
              "value": "while",
              "heading": "while"
            },
            {
              "depth": 2,
              "value": "until",
              "heading": "until"
            },
            {
              "depth": 2,
              "value": "break",
              "heading": "break"
            },
            {
              "depth": 2,
              "value": "continue",
              "heading": "continue"
            },
            {
              "depth": 2,
              "value": "嵌套循环",
              "heading": "嵌套循环"
            },
            {
              "depth": 2,
              "value": "处理循环输出",
              "heading": "处理循环输出"
            },
            {
              "depth": 2,
              "value": "实践应用",
              "heading": "实践应用"
            },
            {
              "depth": 3,
              "value": "查找可执行文件",
              "heading": "查找可执行文件"
            },
            {
              "depth": 3,
              "value": "创建多个用户账户",
              "heading": "创建多个用户账户"
            }
          ]
        },
        "title": "结构化命令 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__structured-command.md"
      },
      {
        "path": "/linux/shell/tools",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/tools.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/tools.md",
          "updatedTime": 1594453351000,
          "slugs": [
            {
              "depth": 1,
              "value": "实用工具",
              "heading": "实用工具"
            }
          ],
          "title": "实用工具",
          "nav": {
            "path": "/linux",
            "title": "Linux"
          },
          "group": {
            "path": "/linux/shell",
            "title": "Shell 编程"
          }
        },
        "title": "实用工具 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__tools.md"
      },
      {
        "path": "/linux/shell/type",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/type.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/type.md",
          "updatedTime": 1626843756000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "类型",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "类型",
              "heading": "类型"
            },
            {
              "depth": 2,
              "value": "字符串",
              "heading": "字符串"
            },
            {
              "depth": 3,
              "value": "字符串长度",
              "heading": "字符串长度"
            },
            {
              "depth": 3,
              "value": "字符串拼接",
              "heading": "字符串拼接"
            },
            {
              "depth": 3,
              "value": "字符串比较",
              "heading": "字符串比较"
            },
            {
              "depth": 3,
              "value": "字符串截取",
              "heading": "字符串截取"
            },
            {
              "depth": 4,
              "value": "从字符串左边开始计数",
              "heading": "从字符串左边开始计数"
            },
            {
              "depth": 4,
              "value": "从字符串右边开始计数",
              "heading": "从字符串右边开始计数"
            },
            {
              "depth": 2,
              "value": "数组",
              "heading": "数组"
            },
            {
              "depth": 3,
              "value": "获取数组元素",
              "heading": "获取数组元素"
            },
            {
              "depth": 3,
              "value": "数组拼接",
              "heading": "数组拼接"
            },
            {
              "depth": 3,
              "value": "删除数组元素",
              "heading": "删除数组元素"
            }
          ]
        },
        "title": "类型 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__type.md"
      },
      {
        "path": "/linux/shell/variable",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/linux/shell/variable.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/linux/shell/variable.md",
          "updatedTime": 1645450801000,
          "nav": {
            "title": "Linux",
            "order": 1,
            "path": "/linux"
          },
          "group": {
            "title": "Shell 编程",
            "order": 5,
            "__fallback": true,
            "path": "/linux/shell"
          },
          "title": "变量",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "变量",
              "heading": "变量"
            },
            {
              "depth": 2,
              "value": "基本操作",
              "heading": "基本操作"
            },
            {
              "depth": 3,
              "value": "定义变量",
              "heading": "定义变量"
            },
            {
              "depth": 3,
              "value": "使用变量",
              "heading": "使用变量"
            },
            {
              "depth": 3,
              "value": "修改变量",
              "heading": "修改变量"
            },
            {
              "depth": 3,
              "value": "只读变量",
              "heading": "只读变量"
            },
            {
              "depth": 3,
              "value": "删除变量",
              "heading": "删除变量"
            },
            {
              "depth": 3,
              "value": "作用范围",
              "heading": "作用范围"
            },
            {
              "depth": 3,
              "value": "导出变量",
              "heading": "导出变量"
            },
            {
              "depth": 2,
              "value": "特殊变量",
              "heading": "特殊变量"
            },
            {
              "depth": 3,
              "value": "向脚本文件传递参数",
              "heading": "向脚本文件传递参数"
            },
            {
              "depth": 3,
              "value": "向函数传递参数",
              "heading": "向函数传递参数"
            },
            {
              "depth": 3,
              "value": "获取上个命令的退出状态",
              "heading": "获取上个命令的退出状态"
            },
            {
              "depth": 3,
              "value": "获取函数的返回值",
              "heading": "获取函数的返回值"
            },
            {
              "depth": 3,
              "value": "空的参数",
              "heading": "空的参数"
            },
            {
              "depth": 2,
              "value": "系统环境变量",
              "heading": "系统环境变量"
            },
            {
              "depth": 3,
              "value": "$HOME",
              "heading": "home"
            },
            {
              "depth": 3,
              "value": "$PATH",
              "heading": "path"
            },
            {
              "depth": 4,
              "value": "新增自定义路径",
              "heading": "新增自定义路径"
            },
            {
              "depth": 4,
              "value": "删除自定义路径",
              "heading": "删除自定义路径"
            },
            {
              "depth": 2,
              "value": "环境变量配置文件",
              "heading": "环境变量配置文件"
            }
          ]
        },
        "title": "变量 - DevOps Guidebook",
        "_chunkName": "docs__linux__shell__variable.md"
      },
      {
        "path": "/server/elk/elasticsearch",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/elk/elasticsearch.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/elk/elasticsearch.md",
          "updatedTime": 1597995871000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "ELK",
            "order": 3,
            "__fallback": true,
            "path": "/server/elk"
          },
          "title": "Elasticsearch",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "Elasticsearch",
              "heading": "elasticsearch"
            },
            {
              "depth": 2,
              "value": "应用场景",
              "heading": "应用场景"
            },
            {
              "depth": 2,
              "value": "技术架构",
              "heading": "技术架构"
            },
            {
              "depth": 2,
              "value": "基本概念",
              "heading": "基本概念"
            },
            {
              "depth": 3,
              "value": "文档",
              "heading": "文档"
            },
            {
              "depth": 3,
              "value": "元数据",
              "heading": "元数据"
            },
            {
              "depth": 3,
              "value": "索引",
              "heading": "索引"
            },
            {
              "depth": 3,
              "value": "类型",
              "heading": "类型"
            },
            {
              "depth": 3,
              "value": "节点",
              "heading": "节点"
            },
            {
              "depth": 3,
              "value": "分片",
              "heading": "分片"
            },
            {
              "depth": 2,
              "value": "倒排索引",
              "heading": "倒排索引"
            },
            {
              "depth": 2,
              "value": "Analyzer 分词",
              "heading": "analyzer-分词"
            },
            {
              "depth": 2,
              "value": "搜索 API",
              "heading": "搜索-api"
            },
            {
              "depth": 3,
              "value": "URL 查询",
              "heading": "url-查询"
            },
            {
              "depth": 4,
              "value": "使用基本的查询",
              "heading": "使用基本的查询"
            },
            {
              "depth": 4,
              "value": "指定所有字段的泛查询",
              "heading": "指定所有字段的泛查询"
            },
            {
              "depth": 4,
              "value": "指定字段的查询",
              "heading": "指定字段的查询"
            },
            {
              "depth": 4,
              "value": "Term 查询",
              "heading": "term-查询"
            },
            {
              "depth": 4,
              "value": "Phrase 查询",
              "heading": "phrase-查询"
            },
            {
              "depth": 4,
              "value": "分组查询",
              "heading": "分组查询"
            },
            {
              "depth": 3,
              "value": "Request Body 查询",
              "heading": "request-body-查询"
            },
            {
              "depth": 4,
              "value": "基本的查询",
              "heading": "基本的查询"
            },
            {
              "depth": 4,
              "value": "分页查询",
              "heading": "分页查询"
            },
            {
              "depth": 4,
              "value": "排序查询",
              "heading": "排序查询"
            },
            {
              "depth": 4,
              "value": "过滤要查询的字段",
              "heading": "过滤要查询的字段"
            },
            {
              "depth": 4,
              "value": "使用脚本查询",
              "heading": "使用脚本查询"
            },
            {
              "depth": 4,
              "value": "Term 查询",
              "heading": "term-查询-1"
            },
            {
              "depth": 4,
              "value": "Math_Phrase 查询",
              "heading": "math_phrase-查询"
            },
            {
              "depth": 2,
              "value": "Dynamic Mapping",
              "heading": "dynamic-mapping"
            },
            {
              "depth": 3,
              "value": "如何写 Mapping",
              "heading": "如何写-mapping"
            },
            {
              "depth": 2,
              "value": "Aggregation 聚合分析",
              "heading": "aggregation-聚合分析"
            },
            {
              "depth": 3,
              "value": "Bucket 分析示例",
              "heading": "bucket-分析示例"
            },
            {
              "depth": 3,
              "value": "Metric 分析示例",
              "heading": "metric-分析示例"
            }
          ]
        },
        "title": "Elasticsearch - DevOps Guidebook",
        "_chunkName": "docs__server__elk__elasticsearch.md"
      },
      {
        "path": "/server/elk/filebeat",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/elk/filebeat.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/elk/filebeat.md",
          "updatedTime": 1597995871000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "ELK",
            "order": 3,
            "__fallback": true,
            "path": "/server/elk"
          },
          "title": "Filebeat",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "Filebeat",
              "heading": "filebeat"
            }
          ]
        },
        "title": "Filebeat - DevOps Guidebook",
        "_chunkName": "docs__server__elk__filebeat.md"
      },
      {
        "path": "/server/elk",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/elk/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/elk/index.md",
          "updatedTime": 1597995871000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "ELK",
            "order": 3,
            "__fallback": true,
            "path": "/server/elk"
          },
          "title": "ELK",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "ELK",
              "heading": "elk"
            },
            {
              "depth": 2,
              "value": "架构介绍",
              "heading": "架构介绍"
            },
            {
              "depth": 3,
              "value": "架构一",
              "heading": "架构一"
            },
            {
              "depth": 3,
              "value": "架构二",
              "heading": "架构二"
            },
            {
              "depth": 3,
              "value": "架构三",
              "heading": "架构三"
            },
            {
              "depth": 3,
              "value": "架构四",
              "heading": "架构四"
            }
          ]
        },
        "title": "ELK - DevOps Guidebook",
        "_chunkName": "docs__server__elk__index.md"
      },
      {
        "path": "/server/elk/kibana",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/elk/kibana.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/elk/kibana.md",
          "updatedTime": 1597995871000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "ELK",
            "order": 3,
            "__fallback": true,
            "path": "/server/elk"
          },
          "title": "Kibana",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "Kibana",
              "heading": "kibana"
            }
          ]
        },
        "title": "Kibana - DevOps Guidebook",
        "_chunkName": "docs__server__elk__kibana.md"
      },
      {
        "path": "/server/elk/logstash",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/elk/logstash.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/elk/logstash.md",
          "updatedTime": 1597995871000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "ELK",
            "order": 3,
            "__fallback": true,
            "path": "/server/elk"
          },
          "title": "Logstash",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "Logstash",
              "heading": "logstash"
            }
          ]
        },
        "title": "Logstash - DevOps Guidebook",
        "_chunkName": "docs__server__elk__logstash.md"
      },
      {
        "path": "/server/nginx/architect",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/architect.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/architect.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "架构原理",
          "order": 20,
          "slugs": [
            {
              "depth": 1,
              "value": "架构原理",
              "heading": "架构原理"
            },
            {
              "depth": 2,
              "value": "进程架构",
              "heading": "进程架构"
            },
            {
              "depth": 2,
              "value": "配置文件重载原理",
              "heading": "配置文件重载原理"
            },
            {
              "depth": 2,
              "value": "模块化管理机制",
              "heading": "模块化管理机制"
            }
          ]
        },
        "title": "架构原理 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__architect.md"
      },
      {
        "path": "/server/nginx/best-practice",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/best-practice.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/best-practice.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "最佳实践",
          "order": 80,
          "slugs": [
            {
              "depth": 1,
              "value": "最佳实践",
              "heading": "最佳实践"
            }
          ]
        },
        "title": "最佳实践 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__best-practice.md"
      },
      {
        "path": "/server/nginx/command-line",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/command-line.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/command-line.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "命令行指令",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "命令行指令",
              "heading": "命令行指令"
            },
            {
              "depth": 2,
              "value": "常用命令",
              "heading": "常用命令"
            },
            {
              "depth": 2,
              "value": "查看安装目录",
              "heading": "查看安装目录"
            },
            {
              "depth": 2,
              "value": "编译参数",
              "heading": "编译参数"
            }
          ]
        },
        "title": "命令行指令 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__command-line.md"
      },
      {
        "path": "/server/nginx/configuration-grammar",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/configuration-grammar.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/configuration-grammar.md",
          "updatedTime": 1633000576000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "配置语法",
          "order": 5,
          "slugs": [
            {
              "depth": 1,
              "value": "配置语法",
              "heading": "配置语法"
            },
            {
              "depth": 2,
              "value": "配置结构",
              "heading": "配置结构"
            },
            {
              "depth": 2,
              "value": "main 全局块",
              "heading": "main-全局块"
            },
            {
              "depth": 3,
              "value": "user",
              "heading": "user"
            },
            {
              "depth": 3,
              "value": "pid",
              "heading": "pid"
            },
            {
              "depth": 3,
              "value": "worker_rlimit_nofile_number",
              "heading": "worker_rlimit_nofile_number"
            },
            {
              "depth": 3,
              "value": "worker_rlimit_core",
              "heading": "worker_rlimit_core"
            },
            {
              "depth": 3,
              "value": "worker_processes_number",
              "heading": "worker_processes_number"
            },
            {
              "depth": 3,
              "value": "worker_cpu_affinity",
              "heading": "worker_cpu_affinity"
            },
            {
              "depth": 3,
              "value": "worker_priority",
              "heading": "worker_priority"
            },
            {
              "depth": 3,
              "value": "worker_shutdown_timeout",
              "heading": "worker_shutdown_timeout"
            },
            {
              "depth": 3,
              "value": "timer_resolution",
              "heading": "timer_resolution"
            },
            {
              "depth": 3,
              "value": "daemon",
              "heading": "daemon"
            },
            {
              "depth": 2,
              "value": "events 块",
              "heading": "events-块"
            },
            {
              "depth": 3,
              "value": "use",
              "heading": "use"
            },
            {
              "depth": 3,
              "value": "worker_connections",
              "heading": "worker_connections"
            },
            {
              "depth": 3,
              "value": "accept_mutex",
              "heading": "accept_mutex"
            },
            {
              "depth": 2,
              "value": "http 块",
              "heading": "http-块"
            },
            {
              "depth": 2,
              "value": "server 块",
              "heading": "server-块"
            },
            {
              "depth": 3,
              "value": "server_name",
              "heading": "server_name"
            },
            {
              "depth": 3,
              "value": "root",
              "heading": "root"
            },
            {
              "depth": 3,
              "value": "try_files",
              "heading": "try_files"
            },
            {
              "depth": 2,
              "value": "location 块",
              "heading": "location-块"
            },
            {
              "depth": 3,
              "value": "匹配命令",
              "heading": "匹配命令"
            },
            {
              "depth": 3,
              "value": "匹配优先级",
              "heading": "匹配优先级"
            },
            {
              "depth": 3,
              "value": "反斜线",
              "heading": "反斜线"
            },
            {
              "depth": 3,
              "value": "alias",
              "heading": "alias"
            },
            {
              "depth": 3,
              "value": "return",
              "heading": "return"
            },
            {
              "depth": 3,
              "value": "rewrite",
              "heading": "rewrite"
            },
            {
              "depth": 3,
              "value": "if 指令",
              "heading": "if-指令"
            },
            {
              "depth": 3,
              "value": "autoindex",
              "heading": "autoindex"
            },
            {
              "depth": 2,
              "value": "变量",
              "heading": "变量"
            },
            {
              "depth": 3,
              "value": "自定义变量",
              "heading": "自定义变量"
            },
            {
              "depth": 3,
              "value": "内置预定义变量",
              "heading": "内置预定义变量"
            },
            {
              "depth": 2,
              "value": "配置文件目录",
              "heading": "配置文件目录"
            },
            {
              "depth": 2,
              "value": "参考资料",
              "heading": "参考资料"
            }
          ]
        },
        "title": "配置语法 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__configuration-grammar.md"
      },
      {
        "path": "/server/nginx/dynamic-cache",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/dynamic-cache.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/dynamic-cache.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "动态缓存",
          "order": 10,
          "slugs": [
            {
              "depth": 1,
              "value": "动态缓存",
              "heading": "动态缓存"
            },
            {
              "depth": 2,
              "value": "代理缓存",
              "heading": "代理缓存"
            },
            {
              "depth": 2,
              "value": "动态匹配",
              "heading": "动态匹配"
            }
          ]
        },
        "title": "动态缓存 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__dynamic-cache.md"
      },
      {
        "path": "/server/nginx/https-service",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/https-service.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/https-service.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "HTTPS 服务",
          "order": 16,
          "slugs": [
            {
              "depth": 1,
              "value": "HTTPS 服务",
              "heading": "https-服务"
            },
            {
              "depth": 2,
              "value": "强制跳转",
              "heading": "强制跳转"
            },
            {
              "depth": 3,
              "value": "无 www 跳转至有 www",
              "heading": "无-www-跳转至有-www"
            },
            {
              "depth": 4,
              "value": "HTTP 跳转至 HTTPS",
              "heading": "http-跳转至-https"
            },
            {
              "depth": 2,
              "value": "基本配置",
              "heading": "基本配置"
            }
          ]
        },
        "title": "HTTPS 服务 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__https-service.md"
      },
      {
        "path": "/server/nginx",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/index.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "基本概要",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "基本概要",
              "heading": "基本概要"
            },
            {
              "depth": 2,
              "value": "工作原理",
              "heading": "工作原理"
            },
            {
              "depth": 3,
              "value": "多进程的工作模式",
              "heading": "多进程的工作模式"
            },
            {
              "depth": 3,
              "value": "惊群现象",
              "heading": "惊群现象"
            },
            {
              "depth": 2,
              "value": "中间件架构",
              "heading": "中间件架构"
            },
            {
              "depth": 3,
              "value": "CPU 亲和",
              "heading": "cpu-亲和"
            },
            {
              "depth": 2,
              "value": "安装目录",
              "heading": "安装目录"
            },
            {
              "depth": 2,
              "value": "编译参数",
              "heading": "编译参数"
            }
          ]
        },
        "title": "基本概要 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__index.md"
      },
      {
        "path": "/server/nginx/install",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/install.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/install.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "安装教程",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "安装教程",
              "heading": "安装教程"
            },
            {
              "depth": 2,
              "value": "四项确认",
              "heading": "四项确认"
            },
            {
              "depth": 2,
              "value": "两项安装",
              "heading": "两项安装"
            },
            {
              "depth": 2,
              "value": "安装源",
              "heading": "安装源"
            },
            {
              "depth": 2,
              "value": "进行安装",
              "heading": "进行安装"
            },
            {
              "depth": 2,
              "value": "查看版本",
              "heading": "查看版本"
            }
          ]
        },
        "title": "安装教程 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__install.md"
      },
      {
        "path": "/server/nginx/load-balance",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/load-balance.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/load-balance.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "负载均衡",
          "order": 9,
          "slugs": [
            {
              "depth": 1,
              "value": "负载均衡",
              "heading": "负载均衡"
            },
            {
              "depth": 2,
              "value": "全局负载均衡",
              "heading": "全局负载均衡"
            },
            {
              "depth": 2,
              "value": "负载均衡",
              "heading": "负载均衡-1"
            },
            {
              "depth": 3,
              "value": "四层负载均衡",
              "heading": "四层负载均衡"
            },
            {
              "depth": 3,
              "value": "七层负载均衡",
              "heading": "七层负载均衡"
            },
            {
              "depth": 2,
              "value": "均衡策略",
              "heading": "均衡策略"
            },
            {
              "depth": 2,
              "value": "动态负载均衡",
              "heading": "动态负载均衡"
            },
            {
              "depth": 3,
              "value": "自身监控",
              "heading": "自身监控"
            },
            {
              "depth": 3,
              "value": "可扩展性",
              "heading": "可扩展性"
            },
            {
              "depth": 3,
              "value": "配置修改",
              "heading": "配置修改"
            }
          ]
        },
        "title": "负载均衡 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__load-balance.md"
      },
      {
        "path": "/server/nginx/log",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/log.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/log.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "访问日志",
          "order": 19,
          "slugs": [
            {
              "depth": 1,
              "value": "访问日志",
              "heading": "访问日志"
            },
            {
              "depth": 2,
              "value": "日志挖掘",
              "heading": "日志挖掘"
            },
            {
              "depth": 2,
              "value": "数据统计",
              "heading": "数据统计"
            },
            {
              "depth": 2,
              "value": "日志切割",
              "heading": "日志切割"
            },
            {
              "depth": 2,
              "value": "参考资料",
              "heading": "参考资料"
            }
          ]
        },
        "title": "访问日志 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__log.md"
      },
      {
        "path": "/server/nginx/modules",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/modules.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/modules.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "配置模块",
          "order": 6,
          "slugs": [
            {
              "depth": 1,
              "value": "配置模块",
              "heading": "配置模块"
            },
            {
              "depth": 3,
              "value": "官方模块",
              "heading": "官方模块"
            },
            {
              "depth": 2,
              "value": "upstream",
              "heading": "upstream"
            },
            {
              "depth": 3,
              "value": "server",
              "heading": "server"
            },
            {
              "depth": 3,
              "value": "keepalive",
              "heading": "keepalive"
            },
            {
              "depth": 3,
              "value": "keepalive_requests",
              "heading": "keepalive_requests"
            },
            {
              "depth": 3,
              "value": "keepalive_timeout",
              "heading": "keepalive_timeout"
            },
            {
              "depth": 2,
              "value": "proxy_pass",
              "heading": "proxy_pass"
            }
          ]
        },
        "title": "配置模块 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__modules.md"
      },
      {
        "path": "/server/nginx/practical-configuration",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/practical-configuration.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/practical-configuration.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "实用配置",
          "order": 20,
          "slugs": [
            {
              "depth": 1,
              "value": "实用配置",
              "heading": "实用配置"
            },
            {
              "depth": 2,
              "value": "静态服务",
              "heading": "静态服务"
            },
            {
              "depth": 2,
              "value": "图片防盗链",
              "heading": "图片防盗链"
            },
            {
              "depth": 2,
              "value": "请求过滤",
              "heading": "请求过滤"
            },
            {
              "depth": 2,
              "value": "配置静态文件缓存",
              "heading": "配置静态文件缓存"
            },
            {
              "depth": 2,
              "value": "单页面应用 history 路由配置",
              "heading": "单页面应用-history-路由配置"
            },
            {
              "depth": 2,
              "value": "HTTP 请求转发到 HTTPS",
              "heading": "http-请求转发到-https"
            },
            {
              "depth": 2,
              "value": "泛域名路径分离",
              "heading": "泛域名路径分离"
            },
            {
              "depth": 2,
              "value": "泛域名转发",
              "heading": "泛域名转发"
            },
            {
              "depth": 2,
              "value": "合并请求",
              "heading": "合并请求"
            },
            {
              "depth": 2,
              "value": "页面内容修改",
              "heading": "页面内容修改"
            },
            {
              "depth": 2,
              "value": "配置动静分离",
              "heading": "配置动静分离"
            },
            {
              "depth": 2,
              "value": "配置高可用集群（双机热备）",
              "heading": "配置高可用集群双机热备"
            },
            {
              "depth": 2,
              "value": "适配 PC 或移动设备",
              "heading": "适配-pc-或移动设备"
            },
            {
              "depth": 2,
              "value": "持久连接",
              "heading": "持久连接"
            },
            {
              "depth": 2,
              "value": "其他配置",
              "heading": "其他配置"
            }
          ]
        },
        "title": "实用配置 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__practical-configuration.md"
      },
      {
        "path": "/server/nginx/proxy-service",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/proxy-service.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/proxy-service.md",
          "updatedTime": 1633000576000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "代理服务器",
          "order": 8,
          "slugs": [
            {
              "depth": 1,
              "value": "代理服务器",
              "heading": "代理服务器"
            },
            {
              "depth": 2,
              "value": "代理区别",
              "heading": "代理区别"
            },
            {
              "depth": 3,
              "value": "正向代理",
              "heading": "正向代理"
            },
            {
              "depth": 3,
              "value": "反向代理",
              "heading": "反向代理"
            },
            {
              "depth": 2,
              "value": "基本配置",
              "heading": "基本配置"
            },
            {
              "depth": 2,
              "value": "通用配置",
              "heading": "通用配置"
            },
            {
              "depth": 2,
              "value": "单端口部署多个应用",
              "heading": "单端口部署多个应用"
            },
            {
              "depth": 3,
              "value": "子域名区分",
              "heading": "子域名区分"
            },
            {
              "depth": 3,
              "value": "子路径区分",
              "heading": "子路径区分"
            }
          ]
        },
        "title": "代理服务器 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__proxy-service.md"
      },
      {
        "path": "/server/nginx/rewrite",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/rewrite.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/rewrite.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "地址重定向",
          "order": 11,
          "slugs": [
            {
              "depth": 1,
              "value": "地址重定向",
              "heading": "地址重定向"
            },
            {
              "depth": 2,
              "value": "常用 301 跳转",
              "heading": "常用-301-跳转"
            },
            {
              "depth": 2,
              "value": "跨端适配",
              "heading": "跨端适配"
            }
          ]
        },
        "title": "地址重定向 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__rewrite.md"
      },
      {
        "path": "/server/nginx/static-resource-server",
        "component": require('/Users/bigo/Development/mrsingsing-books/devops-guidebook/docs/server/nginx/static-resource-server.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/server/nginx/static-resource-server.md",
          "updatedTime": 1631168373000,
          "nav": {
            "title": "服务器",
            "order": 2,
            "path": "/server"
          },
          "group": {
            "title": "Nginx",
            "order": 1,
            "__fallback": true,
            "path": "/server/nginx"
          },
          "title": "静态资源服务器",
          "order": 7,
          "slugs": [
            {
              "depth": 1,
              "value": "静态资源服务器",
              "heading": "静态资源服务器"
            },
            {
              "depth": 2,
              "value": "静态资源",
              "heading": "静态资源"
            },
            {
              "depth": 2,
              "value": "基本配置",
              "heading": "基本配置"
            },
            {
              "depth": 2,
              "value": "文件读取配置",
              "heading": "文件读取配置"
            },
            {
              "depth": 2,
              "value": "文件压缩配置",
              "heading": "文件压缩配置"
            },
            {
              "depth": 3,
              "value": "Nginx 配置 gzip",
              "heading": "nginx-配置-gzip"
            },
            {
              "depth": 3,
              "value": "Webpack 的 gzip 配置",
              "heading": "webpack-的-gzip-配置"
            },
            {
              "depth": 2,
              "value": "浏览器缓存",
              "heading": "浏览器缓存"
            },
            {
              "depth": 3,
              "value": "设置绝对过期时间",
              "heading": "设置绝对过期时间"
            },
            {
              "depth": 3,
              "value": "设置相对过期时间",
              "heading": "设置相对过期时间"
            },
            {
              "depth": 3,
              "value": "资源最后修改时间",
              "heading": "资源最后修改时间"
            },
            {
              "depth": 3,
              "value": "资源缓存策略",
              "heading": "资源缓存策略"
            },
            {
              "depth": 2,
              "value": "配置 CORS 跨域访问",
              "heading": "配置-cors-跨域访问"
            },
            {
              "depth": 3,
              "value": "反向代理解决跨域",
              "heading": "反向代理解决跨域"
            },
            {
              "depth": 3,
              "value": "配置 header 解决跨域",
              "heading": "配置-header-解决跨域"
            },
            {
              "depth": 2,
              "value": "防盗链",
              "heading": "防盗链"
            },
            {
              "depth": 2,
              "value": "图片处理",
              "heading": "图片处理"
            }
          ]
        },
        "title": "静态资源服务器 - DevOps Guidebook",
        "_chunkName": "docs__server__nginx__static-resource-server.md"
      },
      {
        "path": "/code",
        "meta": {
          "order": 5
        },
        "exact": true,
        "redirect": "/code/git"
      },
      {
        "path": "/code/gitlab",
        "meta": {},
        "exact": true,
        "redirect": "/code/gitlab/gitlab"
      },
      {
        "path": "/deploy/docker",
        "meta": {
          "order": 2,
          "__fallback": true
        },
        "exact": true,
        "redirect": "/deploy/docker/overview"
      },
      {
        "path": "/deploy",
        "meta": {
          "order": 4
        },
        "exact": true,
        "redirect": "/deploy/docker-compose/overview"
      },
      {
        "path": "/deploy/docker-compose",
        "meta": {
          "order": 3,
          "__fallback": true
        },
        "exact": true,
        "redirect": "/deploy/docker-compose/overview"
      },
      {
        "path": "/devops",
        "meta": {
          "order": 1,
          "__fallback": true
        },
        "exact": true,
        "redirect": "/devops/devops"
      },
      {
        "path": "/devops/extensions",
        "meta": {
          "order": 100,
          "__fallback": true
        },
        "exact": true,
        "redirect": "/devops/extensions/extensions"
      },
      {
        "path": "/linux/command",
        "meta": {
          "order": 1,
          "__fallback": true
        },
        "exact": true,
        "redirect": "/linux/command/system"
      },
      {
        "path": "/server",
        "meta": {
          "order": 2
        },
        "exact": true,
        "redirect": "/server/elk"
      }
    ],
    "title": "DevOps Guidebook",
    "component": (props) => props.children
  }
];
    // allow user to extend routes
    plugin.applyPlugins({
      key: 'patchRoutes',
      type: ApplyPluginsType.event,
      args: { routes },
    });

    // for renderServer
    const opts = {
      path,
      history,
      pathname,
      getInitialPropsCtx,
      basename,
      context,
      mode,
      plugin,
      staticMarkup,
      routes,
      isServer: process.env.__IS_SERVER,
    }
    const dynamicImport =  true;
    if (dynamicImport && !manifest) {
      try {
        // prerender not work because the manifest generation behind of the prerender
        manifest = requireFunc(`./asset-manifest.json`);
      } catch (_) {}
    }
    // renderServer get rootContainer
    const { pageHTML, pageInitialProps, routesMatched } = await renderServer(opts);
    rootContainer = pageHTML;
    if (html) {
      // plugin for modify html template
      html = await plugin.applyPlugins({
        key: 'ssr.modifyServerHTML',
        type: ApplyPluginsType.modify,
        initialValue: html,
        args: {
          context,
          cheerio,
          routesMatched,
          dynamicImport,
          manifest
        },
        async: true,
      });
      html = await handleHTML({ html, rootContainer, pageInitialProps, mountElementId, mode, forceInitial, removeWindowInitialProps, routesMatched, dynamicImport, manifest });
    }
  } catch (e) {
    // downgrade into csr
    error = e;
  }
  return {
    rootContainer,
    error,
    html,
  }
}

export default render;
