---
nav:
  title: 博客
  order: 2
group:
  title: 前端工程化
  order: 1
title: 自定义loader和plugin
description: 自定义loader和plugin
order: 5
---

### 1.自定义loader
loader让webpack能够解析更多类型的文件。本质上loader即是一个函数，接收参数并对其进行处理，而后返回处理结果（须为buffer或string）。
开发loader要遵循职责单一原则，一个loader只做一种转换，如果需要对源文件进行多次转换处理，则需要多个loader来实现。
调用多个loader来处理一个文件时，默认情况下loader会从后到前链式顺序执行，最后一个loader将会拿到文件的原始内容，处理后会将结果传递给下一个loader继续处理，直到最前面的loader处理完成返回给webpack。
下面我们来自己建一个。首先新建 __/loaders/replaceLoader.js__。
```
module.exports = function (source) {
  // 可以获取到引用文件的源代码(source),不能用箭头函数，不然会改变this 指向
  const options = this.getOptions(); // getOptions会自动地帮我们分析this.query,然后把参数的所有内容放在options里面去
  const result = source.replace(options.patterns, options.text);
  return result; // 1. (同步)直接返回内容
};
```
然后配置自定义的loader，有3种方式。
1.直接require对应的loader（适用于单个loader）
```
// webpack.common.js
const commonConfig = {
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: path.resolve('./loaders/replaceLoader.js')
      }
    ]
  }
}

```
2.使用`resolveLoader`配置项（适用于多个loader）
```
// webpack.common.js
const commonConfig = {
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../loaders')] // 当你引用一个loader的时候会先到node_modules里面去找，如果找不到，会到loaders文件夹里面找
  },
    module: {
      rules: [
        {
          test: /.(ts|tsx)$/,
          // 借助多核cpu开启多线程loader解析，提升loader解析速度。
          // 将thread-loader 放置在其他loader 之前，之后的loader 会在一个独立的worker池中运行。
          // 开启多线程需要启动时间，大约600ms左右，所以适合规模比较大的项目。
          use: [
            'thread-loader',
            { loader: 'replaceLoader', options: { patterns: /animasling/gi, text: 'world' } }, // 用一个自己写的loader
            'babel-loader'
          ],
          include: [path.resolve(__dirname, '../src')] // 只对项目src文件的ts,tsx进行loader解析
        },
      ]
    }
}
```
3.如果准备将loader发布到npm，也可以使用 `npm-link`。
这样一个简单的loader 就实现了。但有时会更加复杂。
其实，loader函数会接收三个参数：content、map、meta

* `content`：模块内容，可以是字符串或者buffer
* `map`：sourcemap 对象
* `meta`：一些元数据信息

如果仅仅是返回处理结果，直接返回content即可。但如果需要生成sourcemap 对象、meta元数据或者抛出异常，需要将return换成`this.callback(err, content, map, meta)`来传递数据。
```
this.callback(
    // 当无法转换原内容时，给 Webpack 返回一个 Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    abstractSyntaxTree?: AST
);
```
另外，loader也是支持异步任务处理的，可以借助this.async()实现。
```
module.exports = function (source) {
  // 可以获取到引用文件的源代码(source),不能用箭头函数，不然不能用this
  console.log(this.query); // 获取到配置文件里面的options的内容
  const options = this.getOptions();

  // 3.有异步调用
  const callback = this.async(); // 有异步调用
  setTimeout(() => {
    const result = source.replace('world', options.name);
    callback(null, result); // 和this.callback里面的参数是一样的
  }, 2000);
};
```
### 2.自定义开发plugin
plugin可以参与打包过程中每个阶段。plugin其实就是一个类，在调用构造函数的时候传入配置参数。
> webpack的plugin命名需要遵循 `插件名字-webpack-plugin` 的格式。

plugin内部的实现也是比较简单的，由以下几部分组成：
* 一个可以通过new调用的类函数
* 在该函数的prototype上定义一个apply方法，参数为compiler
* 在apply方法中注册要监听的钩子名称、插件名称、回调函数
* 在回调函数中通过注入的参数，读取或操纵修改 Webpack 内部实例数据
* 异步类型的事件钩子，插件处理完成需要调用callback或者返回promise

##### 执行流程
plugin内部核心就是apply，使用插件的时候，webpack会自动调用插件实例的apply方法，并将compiler作为参数传入。在apply内部，我们可以在compiler的hooks中特定的钩子上注册各种监听函数（发布订阅模式），当webpack执行到这些钩子的时候，就会调用对应的监听函数，从而实现对构建流程的处理。

插件主要是通过 `<instance>.hooks.<hook name>.<tap API>('<plugin name>', callback)` 进行hooks事件注册。
  * `instance`： compiler 或 compilation 实例
  * `hook name`：挂载目标钩子的名称
    1. `entryOption`: entry 配置项处理完成后执行(同步)
    2. `compile`: 打包的时候(同步)
    3. `done`: 编译完成的时刻(同步)
    4. `emit`: 打包完成后，将要放到 output 的时刻(异步)
    5. `afterEmit`: 生成资源到 output 后执行(异步)
  更多的hooks和用法可以查看 Plugin-Compiler Hooks。
  * `tap API` 有三种：
    1. 同步的钩子用 `tap`。
    2. 异步的钩子要用 `tapAsync`，2个参数，第一个参数是插件名，第二个是个fn，用于操作完后调用交回流程控制权。
    3. `tapPromise` 和 `tapAsync` 的作用和限制类似，不同在于要求返回一个 __Promise__ 实例，并且这个 __Promise__ 一定会被决议（无论 resolve 或 reject ）

hooks的实现是基于`tapable`这个库，这个库提供了大量的钩子。这些钩子大概分为如下几类：
* 并行的：名称带有parallel，该类函数注册后会并行调用。
* 顺序的：名称带有bail，该类函数注册后会顺序调用。
* 流式的：名称带有waterfall，该类函数注册后，调用时会流式处理，将上一个函数的返回结果作为下一个函数的参数。
* 组合的：也存在上述三种规则结合在一起的钩子。
  
在钩子上注册的函数，接收两个参数，第一个为插件的名字，第二个为回调函数。这个回调函数即为处理函数的主要内容，接收的参数由钩子决定。

下面我们来实现一个自定义plugin。先建一个 __/plugins/copyright-webpack-plugin.js__。
```
// copyright-webpack-plugin.js
class CopyRightWebpackPlugin {
  constructor(options) {
    // 通过options获取插件的入参对象
    console.log(options, '插件被使用了');
  }
  apply(compiler) {

    compiler.hooks.entryOption.tap('CopyRightWebpackPlugin', (context, entry) => {
      // context保存了当前目录信息，entry保存了入口文件信息
      console.log(context, entry);
    });

    // 异步
    compiler.hooks.emit.tapAsync('CopyRightWebpackPlugin', (compilation, cb) => {
      // debugger; // 插件编写的调试
      /**
       * compilation: 记录本次打包相关的内容
       * compilation.assets: 保存本次打包出来的所有文件信息
       */
      compilation.assets['copyright.txt'] = {
        // 向文件中添加一个txt文件
        source: function () {
          // 文件的内容
          return 'copyright by animasling';
        },
        size: function () {
          // 文件的长度
          return 23;
        }
      };
      cb(); // 调用tapAsync 必须要使用cb();
    });

    // 异步 promise
    compiler.hooks.emit.tapPromise('CopyRightWebpackPlugin', compilation => {
      return new Promise((resolve, reject) => {
        // console.log(compilation, 'promise');
        resolve('promise');
      });
    });

    // 异步 async function
    compiler.hooks.emit.tapPromise('CopyRightWebpackPlugin', async compilation => {
      await new Promise((resolve, reject) => {
        // console.log(compilation, 'async function');
        resolve('async function');
      });
    });
  }
}

module.exports = CopyRightWebpackPlugin;
```
然后修改 __webpack.common.js__。
```
// webpack.common.js
const CopyRightWebpackPlugin = require('../plugins/copyright-webpack-plugin'); // 自定义插件

const generatorPlugin = configs => {
  const plugins = [
    // ..
    new CopyRightWebpackPlugin({
      options: {
        name: 'animasling'
      }
    })
  ]
}
```
















