const componentMenus = [
  {
    title: 'test component',
    'title.zh-CN': '测试组件',
    children: ['KeywordInput'],
  },
  {
    title: 'Hubble component',
    'title.zh-CN': 'Hubble 组件',
    children: ['KeywordInput'],
  },
];

function getComponentMenus(locale) {
  return componentMenus.map(item => ({
    title: item[locale === 'zh-CN' ? 'title.zh-CN' : 'title'],
    children: item.children,
  }));
}

export default {
  title: 'Anima 组件库',
  mode: 'site',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  hash: true,
  menus: {
    '/components': getComponentMenus('en-US'),
    '/zh-CN/components': getComponentMenus('zh-CN'),
  },
  outputPath: 'dist',
};
