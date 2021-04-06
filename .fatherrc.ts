export default {
  esm: 'babel',
  cjs: 'babel',
  pkgs: ['anima-styles', 'anima'],
  // 用于替换 __VERSION__ pkg.version
  extraBabelPlugins: [
    'version',
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
