import { defineConfig } from 'dumi';
import AntdMomentWebpackPlugin from '@ant-design/moment-webpack-plugin';

const publicPath = {
  development: '/',
  production: '/anima/',
}[process.env.NODE_ENV as string];

const base = {
  development: '/',
  production: '/anima',
}[process.env.NODE_ENV as string];

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'anima',
    logo: `${publicPath}logo.png`,
    footer: 'Open-source MIT Licensed | Copyright © 2023<br />Powered by [Anima]',
    // nav: {
    //   mode: "override",
    //   value: [
    //     { title: '组件', link: '/components' },
    //     { title: '博客', link: '/blog' },
    //     { title: '面试', link: '/interview' }
    //   ]
    // }
  },
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'English' }
  ],
  hash: true,
  favicons: [`${publicPath}logo.png`],
  base,
  publicPath,
  // 用于替换 __VERSION__ pkg.version
  extraBabelPlugins: ['version'],
  resolve: {
    atomDirs: [
      { type: 'components', dir: 'packages/anima/src' }
    ]
  },
  alias: {
    'anima-zoey': require.resolve('./packages/anima/src')
  },
  copy: [{from: 'public', to: 'docs-dist/public'}],
  chainWebpack(memo: any) {
    // 使用moment 代替 days.js
    memo.plugin('antdMoment').use(new AntdMomentWebpackPlugin())
    return memo;
  },
});
