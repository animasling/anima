const componentMenus = [
  {
    title: 'Custom Theme',
    'title.zh-CN': '定制主题',
    children: ['Theme'],
  },
  {
    title: 'Input Component',
    'title.zh-CN': '输入组件',
    children: ['KeywordInput'],
  },
];

function getComponentMenus(locale: string) {
  return componentMenus.map(item => ({
    title: item[locale === 'zh-CN' ? 'title.zh-CN' : 'title'],
    children: item.children,
  }));
}

export default {
  title: 'Anima 组件库',
  mode: 'site',
  exportStatic: {},
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  hash: true,
  favicon: 'https://devstatic.56qq.com/finance-mobile/logo.png',
  logo: 'https://devstatic.56qq.com/finance-mobile/logo.png',
  menus: {
    '/en-US/components': getComponentMenus('en-US'),
    '/components': getComponentMenus('zh-CN'),
  },
  outputPath: 'docs-dist',
  devServer: {
    port: '8001',
  },
  // 用于替换 __VERSION__ pkg.version
  extraBabelPlugins: ['version'],
};
