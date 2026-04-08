// @ts-nocheck
import './core/polyfill';

import { plugin } from './core/plugin';
import './core/pluginRegister';
import { createHistory } from './core/history';
import { ApplyPluginsType } from '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+runtime@3.5.43_react@16.14.0/node_modules/@umijs/runtime';
import { renderClient } from '/Users/bigo/Development/mrsingsing-books/devops-guidebook/node_modules/.pnpm/@umijs+renderer-react@3.5.43_react-dom@16.14.0_react@16.14.0__react-router@5.2.0_react@16.14.0__react@16.14.0/node_modules/@umijs/renderer-react/dist/index.js';
import { getRoutes } from './core/routes';




const getClientRender = (args: { hot?: boolean; routes?: any[] } = {}) => plugin.applyPlugins({
  key: 'render',
  type: ApplyPluginsType.compose,
  initialValue: () => {
    const opts = plugin.applyPlugins({
      key: 'modifyClientRenderOpts',
      type: ApplyPluginsType.modify,
      initialValue: {
        routes: args.routes || getRoutes(),
        plugin,
        history: createHistory(args.hot),
        isServer: process.env.__IS_SERVER,
        ssrProps: {},
        dynamicImport: true,
        rootElement: 'root',
        defaultTitle: `DevOps Guidebook`,
      },
    });
    return renderClient(opts);
  },
  args,
});

const clientRender = getClientRender();
export default clientRender();


    window.g_umi = {
      version: '3.5.43',
    };
  

// hot module replacement
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./core/routes', () => {
    const ret = require('./core/routes');
    if (ret.then) {
      ret.then(({ getRoutes }) => {
        getClientRender({ hot: true, routes: getRoutes() })();
      });
    } else {
      getClientRender({ hot: true, routes: ret.getRoutes() })();
    }
  });
}
