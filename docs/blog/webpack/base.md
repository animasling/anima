---
nav:
  title: 博客
  order: 2
group:
  title: 前端工程化
  order: 1
title: 基础配置
description: 基础配置
order: 2
---

### 1. 配置环境变量
环境变量按作用来分分两种。

1. 区分是开发模式还是打包构建模式
2. 区分项目业务环境,开发/测试/预测/正式环境

区分开发模式还是打包构建模式可以用 `process.env.NODE_ENV`。

区分项目接口环境可以自定义一个环境变量 `process.env.BASE_ENV`,设置环境变量可以借助 `cross-env` 和 `webpack.DefinePlugin` 来设置。

* `cross-env`：兼容各系统的设置环境变量的包
* `webpack.DefinePlugin`：webpack内置的插件,可以为业务代码注入环境变量

安装 `cross-env`
```
yarn add cross-env -D
```
修改 __package.json__ 的scripts脚本字段,删除原先的dev和build,改为
```
  "start": "cross-env NODE_ENV=development BASE_ENV=dev webpack-dev-server -c config/webpack.common.js",
  "start:qa": "cross-env NODE_ENV=development BASE_ENV=qa webpack-dev-server -c config/webpack.common.js",
  "start:pre": "cross-env NODE_ENV=development BASE_ENV=pre webpack-dev-server -c config/webpack.common.js",
  "start:prod": "cross-env NODE_ENV=development BASE_ENV=prod webpack-dev-server -c config/webpack.common.js",
  "build": "cross-env NODE_ENV=production BASE_ENV=dev webpack -c config/webpack.common.js",
  "build:qa": "cross-env NODE_ENV=production BASE_ENV=qa webpack -c config/webpack.common.js",
  "build:pre": "cross-env NODE_ENV=production BASE_ENV=pre webpack -c config/webpack.common.js",
  "build:prod": "cross-env NODE_ENV=production BASE_ENV=prod webpack -c config/webpack.common.js",
```
dev开头是开发模式,build开头是打包模式,冒号后面对应的__dev/qa/pre/prod__是对应的业务环境的__开发/测试/预测/正式环境__。

`process.env.NODE_ENV` 环境变量webpack会自动根据设置的mode字段来给业务代码注入对应的 __development__ 和 __prodction__ ,这里在命令中再次设置环境变量NODE_ENV是为了在webpack和babel的配置文件中访问到。

将 `process.env.BASE_ENV` 注入到业务代码里面，借助 `webpack.DefinePlugin` 插件实现。

新建一个 __generatorPlugin__ 函数来根据 `process.env.BASE_ENV` 构建不同环境下的 plugins。
```
// webpack.common.js
const generatorPlugin = configs => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV), //把process.env.BASE_ENV注入到业务代码里面
    }),
  ]
  return plugins;
}

commonConfig.plugins = generatorPlugin(commonConfig);
```
### 2. 处理css和less文件
webpack默认只认识js,是不识别css文件的,需要使用loader来解析css, 安装依赖` style-loader css-loader`。
```
yarn add style-loader css-loader -D
```
* `style-loader`: 把解析后的css代码从js中抽离,放到头部的style标签中(在运行时做的)
* `css-loader`: 解析css文件代码

如果用了css 预处理器，则需安装依赖 `less-loader`处理less文件。
```
yarn add less-loader less -D
```
* `less-loader`: 解析less文件代码,把less编译为css
* `less`: less核心

为了兼容一些低版本浏览器,我们借助插件 `postcss-loader` 给css3加浏览器前缀。
```
yarn add postcss-loader autoprefixer -D
```
* `postcss-loader`：处理css的一个插件
* `autoprefixer`：处理css时自动加前缀

因为解析css和less有很多重复配置,可以将`postcss-loader`配置单独提出来。在根目录下新建 __postcss.config.js__。
```
module.exports = {
  plugins: ['autoprefixer']
}
```
为了配置兼容哪些浏览器，可以在根目录创建 __.browserslistrc__ 文件。和浏览器兼容的配置都可以直接使用它。
```
IE 9 # 兼容IE 9
chrome 35 # 兼容chrome 35
```
最后，修改 __webpack.common.js__,添加 处理css，less，自动添加前缀的配置。
```
const commonConfig = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /.less$/, //匹配 css和less 文件
        use: [
          // 4.将解析后的css 插入到头部style标签中(做了样式的热替换功能)
          style-loader'
          // 3.解析css 为浏览器可以识别的。 开启cssModule， @import 的css文件也通过后面2个loader的处理
          { loader: 'css-loader', options: { modules: true, importLoaders: 2 } },
          // 2. 给css 添加兼容浏览器的前缀
          'postcss-loader',
          // 1.将less 解析为css
          'less-loader'
        ]
      },
    ]
  }
}
```
### 3. babel预设处理js兼容
为了使最新的标准语法转换为低版本语法,把非标准语法转换为标准语法让浏览器能识别解析，我们需要用babel来处理.
```
yarn add babel-loader @babel/core @babel/preset-env core-js -D
```
* `babel-loader`: 使用 babel 加载最新js代码并将其转换为 ES5（上面已经安装过）
* `@babel/corer`: babel 编译的核心包
* `@babel/preset-env`: babel 编译的预设,可以转换目前最新的js标准语法
* `core-js`: 使用低版本js语法模拟高版本的库,也就是垫片

为了避免webpack配置文件过于庞大,我们可以把`babel-loader`的配置抽离出来, 新建 __babel.config.js__ 文件,使用js作为配置文件,是因为可以访问到`process.env.NODE_ENV`环境变量来区分是开发还是打包模式。
```
// 用js 因为可以访问到process.env.NODE_ENV环境变量来区分是开发还是打包模式。
module.exports = {
  // 将最新的标准语法转换为低版本语法,把非标准语法转换为标准语法才能让浏览器识别解析
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      // 3. 将有些高级语法转换为低版本语法，兼容浏览器
      '@babel/preset-env',
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3 // 配置使用core-js使用的版本（低版本js语法模拟高版本的库,也就是垫片）
      }
    ],
    // 2.处理jsx 语法为浏览器能识别的语法
    [
      '@babel/preset-react',
      {
        runtime: 'automatic' // 解决 "React is not defined" 问题
      }
    ],
    // 1. 将ts 处理为js
    '@babel/preset-typescript'
  ]
};
```
修改 __webpack.common.js__ 将`babel-loader` 加入 mudule.rules。
```
const commonConfig = {
  // ...
   module: {
    rules: [
      //...
      {
        test: /.(ts|tsx)$/,
        use: 'babel-loader'
      },
   }
}
```
### 4. babel处理js非标准语法
现在react主流开发都是函数组件和react-hooks,但有时也会用类组件,可以用装饰器简化代码。
需要开启一下ts装饰器支持,修改 __tsconfig.json__ 文件。
```
// tsconfig.json
{
  "compilerOptions": {
    // ...
    // 开启装饰器使用
    "experimentalDecorators": true
  }
}
```
需要借助`babel-loader`插件,安装支持装饰器语法的依赖。
```
yarn add @babel/plugin-proposal-decorators -D
```
在 __babel.config.js__ 中添加插件。
```
module.exports = { 
  // ...
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```
### 5. 复制public文件夹
一般public文件夹都会放一些静态资源,可以直接根据绝对路径引入,比如图片,css,js文件等,不需要webpack进行解析,只需要打包的时候把public下内容复制到构建出口文件夹中,可以借助`copy-webpack-plugin`插件,安装依赖。
开发环境已经在devServer中配置了static托管了public文件夹,在开发环境使用绝对路径可以访问到public下的文件,但打包构建时不做处理会访问不到,所以现在需要在打包配置文件 __webpack.common.js__ 的 __generatorPlugin__ 中 新增copy插件配置。

```
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');

const generatorPlugin = configs => {
    const plugins = [ // ... ];
    if (isProd) {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'), // 复制public下文件
            to: path.resolve(__dirname, '../dist') // 复制到dist目录中
            // filter: source => {
            //   return !source.includes('xx.xx') // 时复制忽略某个文件
            // }
          }
        ]
      }),
    );
  }
  return plugins;
}
```
### 6. 处理图片文件
对于图片文件,webpack4使用`file-loader`和`url-loader`来处理的,但webpack5不使用这两个loader了,而是采用自带的`asset-module`来处理。
修改 __webpack.common.js__ 添加图片解析配置。
```
// webpack.common.js
const commonConfig = {
    module: {
    rules: [
      // ...
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/images/[name][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```
当图片小于10kb时被转成了base64位格式被引入，减少http的请求数量。在css中的背景图片一样也可以解析。
### 7. 处理字体和媒体文件
字体文件和媒体文件这两种资源处理方式和处理图片是一样的,只需要把匹配的路径和打包后放置的路径修改一下就可以了。修改 __webpack.common.js__ 文件：
```
// webpack.common.js
const commonConfig = {
  // ...
  module: {
    rules: [
      // ...
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/fonts/[name][ext]', // 文件输出目录和命名
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/media/[name][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```
### 8. 配置react模块热更新
热更新上面已经在devServer中配置hot为true, 在webpack4中,还需要在插件中添加了HotModuleReplacementPlugin,在webpack5中,只要devServer.hot为true了,该插件就已经内置了。
现在开发模式下修改css和less文件，页面样式可以在不刷新浏览器的情况实时生效，因为此时样式都在style标签里面，style-loader做了替换样式的热替换功能。但js是浏览器在自动刷新后再显示修改后的内容。为了保留react 组件状态,我们使用`@pmmmwh/react-refresh-webpack-plugin`插件来实现,该插件又依赖于`react-refresh`。
```
yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```
修改 __webpack.common.js__ 添加热更新插件。
```
// webpack.common.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const generatorPlugin = configs => {
  const plugins = [ // ... ];
  if (!isProd) {
    plugins.push(
      new ReactRefreshWebpackPlugin() // 添加热更新插件
    );
  }
  return plugins;
}
```
为`babel-loader`配置`react-refesh`刷新插件,修改 __babel.config.js__ 文件
```
  plugins: [
    process.env.isProd && require.resolve('react-refresh/babel')
  ].filter(Boolean)
```
