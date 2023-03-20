---
nav:
  title: 博客
  order: 2
group:
  title: 前端工程化
  order: 1
title: 初始化
description: 初始化
order: 1
---

本文档主要记录重头开始创建一个脚手架 webpack5+react18+typescript4，主要的参考文档如下：

[【前端工程化】篇四 席卷八荒-Webpack（进阶）](https://juejin.cn/post/6888528583623933966#heading-36)
[【前端工程化】webpack5从零搭建完整的react18+ts开发和打包环境](https://juejin.cn/post/7111922283681153038#heading-18)
[【前端工程化】配置React+ts项目完整的代码及样式格式和git提交规范](https://juejin.cn/post/7101596844181962788#heading-32)
需要完整源码可以到[github](https://github.com/animasling/webpack5)自取。


## 一.初始化项目
在开始webpack配置之前，先手动初始化一个基本的 __react+ts__ 项目，新建项目文件夹 __webpack5__, 在项目下执行

```
yarn init -y
```

初始化好 __package.json__ 后,在项目下新增以下所示目录结构和文件.

```
├── config
|   ├── webpack.common.js # 公共配置
|   ├── webpack.dev.js  # 开发环境配置
|   └── webpack.prod.js # 打包环境配置
├── public # 公共内容 
├── src
|   ├── app.tsx # react应用入口页面
│   ├── Home
|         ├──index.tsx # 首页
|── index.html # html模板 
├── tsconfig.json  # ts配置
└── package.json
```
安装webpack依赖
```
yarn add webpack webpack-cli -D
```
安装react依赖
```
yarn add @types/react @types/react-dom -D
```
添加index.html内容
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5-react-ts</title>
</head>
<body>
  <!-- 容器节点 -->
  <div id="root"></div>
</body>
</html>
```
添加 __tsconfig.json__ 内容。为了避免引入图片，css， less 等找不到模块，可以新加一个 __typings.d.ts__ 。然后在 __tsconfig.json__ 将该文件包含进来。
```
// typings.d.ts
declare module '*.css';
declare module '*.less';
declare module '*.png';
```
```
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "experimentalDecorators": true, // 开启装饰器使用
    "jsx": "react-jsx", // react18这里也可以改成react-jsx
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
    },
  },
   "include": ["src/**/*", "typings.d.ts"],
}
```
添加 __src/Home/index.tsx__ 内容
```
const Home: React.FC = () => {
  return (
    <div>hello, animasling !!!</div>
  )
}
export default Home;
```
添加 __src/app.tsx__ 内容
```
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Home />);
}
```

## 二. 配置基础版React+ts环境
### 2.1. webpack公共配置
修改 __webpack.common.js__
#### 1. 配置入口文件
```
// webpack.common.js
const path = require('path')

const commonConfig = {
  entry: {
    index: path.join(__dirname, '../src/app.tsx') // 入口文件
  }
}

module.exports = commonConfig;
```
#### 2. 配置出口文件
```
// webpack.common.js
const commonConfig = {
  // ...
  output: {
    filename: 'static/js/[name].js', // 输出文件名字
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  }
}
```
#### 3. 配置loader解析ts和jsx
由于 webpack 默认只能识别 js文件,不能识别 jsx 语法,需要配置loader的预设预设 `@babel/preset-typescript` 来先ts语法转换为 js 语法,再借助预设 `@babel/preset-react` 来识别jsx语法。
安装babel核心模块和babel预设
```
yarn add babel-loader @babel/core @babel/preset-react @babel/preset-typescript -D
```
在 __webpack.common.js__ 添加 __module.rules__ 配置。
```
// webpack.common.js
const commonConfig = {
  // ...
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  }
}
```
#### 4. 配置extensions
__extensions__ 是 webpack 的 resolve 解析配置下的选项，在引入模块时不带文件后缀时，会来该配置数组里面依次添加后缀查找文件，因为ts不支持引入以 .ts, tsx为后缀的文件，所以要在extensions中配置，而第三方库里面很多引入js文件没有带后缀，所以也要配置下js。
注意把高频出现的文件后缀放在前面。配置合理，不要太多，太多会增加自动匹配，文件路径查询的时间。
```
// webpack.common.js
const commonConfig = {
  // ...
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  }
}
```
这里只配置js, tsx和ts，其他文件引入都要求带后缀，可以提升构建速度。
#### 5. 添加html-webpack-plugin插件
自动生成html文件，并将构建好的静态资源都引入到一个html文件中。
```
yarn add html-webpack-plugin -D
```
```
// webpack.common.js
const commonConfig = {
  // ...
  pulugins: {
    // HtmlWebpackPlugin 会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html文件中
    new HtmlWebpackPlugin({
      // react 版
      title: 'HtmlWebpackPlugin_title', // html title
      filename: `${item}.html`, // 构建的html的名字（index.html）
      template: 'index.html', // 启用的模板（src/index.ejs）(该demo里，react入口需要开启模板，es入口不需要)
      // templateParameters: { param: 'test' }, // 模板参数
      inject: 'body', // 将静态资源注入到模板里面，true， body： 注入body里面， head： 注入head里面， false: 不注入（true）
      // favico: './beauty.jpg', // html 的tab默认图标（''）
      meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }, // html 里面head的meta设置（{}）
      // base: 'https://example.com/path/page.html', // 注入base tag（false）
      minify: true, // html 是否压缩（mode = ‘production’ 的时候是true，其他false）
      hash: false, // 如果true， 会给注入的script 和 css 文件追加额外的惟一的compilation hash，对缓存有效，
      cache: true, // 只有改变的文件才发出
      chunksSortMode: 'auto',
      excludeChunks: '',
      xhtml: false, // true：link 自己关闭
      chunks: ['runtime', 'vendors', item] // 要引入的文件
    })
  }
}
```
### 2.2. webpack开发环境配置
#### 1. 安装 webpack-dev-server
配置 `webpack-dev-server` 在开发环境启动服务器来辅助开发,使用 `webpack-merge` 来合并基本配置,安装依赖:
```
yarn add webpack-dev-server webpack-merge -D
```
修改webpack.dev.js代码,添加开发模式配置。
```
const path = require('path');

const devConfig = {
  // 打包模式，默认为'production'(js 被压缩)
  mode: 'development', // js 不被压缩
  devServer: {
    open: true, // 自动打开浏览器
    port: 8010,
    hot: true, // 启用webpack 的模块热替换特性(原理： 一种是websocket， 一种是pull 轮询)
    /**
     * 用BrowserRouter 配置路由需要设置（访问任何一个页面都会转到访问index.html）(可以用rewrites 单独配置访问的映射)
     * 只能在dev环境用， 生成环境需要后端设置配合
     */
    historyApiFallback: true, // 解决history路由404问题
    compress: false, // 是否启用gzip 压缩，
    static: {
      directory: path.join(__dirname, '../public') //托管静态资源public文件夹
    },
  }
}
```
修改 __webpack.common.js__ ,将dev 配置合并进去。
```
// webpack.common.js
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');

const isProd = process.env.NODE_ENV === 'production';

const commonConfig = {...};
module.exports = merge(commonConfig, isProd ? commonConfig : devConfig);
```
#### 2. package.json添加dev脚本
在 __package.json__ 的scripts中添加。
```
// package.json
"scripts": {
  "start": "webpack-dev-server -c config/webpack.common.js"
},
```
执行yarn start,就能看到项目已经启动起来了,访问http://localhost:8010/,就可以看到项目界面,具体完善的react模块热替换在下面会讲到。

### 2.3. webpack打包环境配置
1. 修改 __webpack.prod.js__ 代码
```
// webpack.prod.js
module.exports = {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
}
```
修改 __webpack.common.js__ ,将prod 配置合并进去。
```
// webpack.common.js
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const isProd = process.env.NODE_ENV === 'production';

const commonConfig = {...};
module.exports = merge(commonConfig, isProd ? prodConfig : devConfig);
```
2. __package.json__ 添加build打包命令脚本
在package.json的scripts中添加build打包命令
```
"scripts": {
    "start": "webpack-dev-server -c config/webpack.common.js"
    "build": "webpack -c config/webpack.common.js"
},
```
执行`yarn run build`,最终打包在dist文件中, 打包结果:

dist                    
├── static
|   ├── js
|     ├── index.js
├── index.html

3. 浏览器查看打包结果
打包后的dist文件可以在本地借助 node 服务器 serve 打开,全局安装serve。
```
yarn add serve -g
```
在package.json 中添加命令
```
"serve": "serve -s dist"
```
然后在项目根目录命令行执行 `yarn run serve` ,就可以启动打包后的项目了。
