---
slug: front-webpack
title: 前端-webpack-构建方案
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [front, webpack]
---


## webpack
webpack 是模块打包工具(构建工具), 作用:
- 将js文件打包在一起
- es6+ => es5
- js 代码混淆
- 资源文件内容: 格式化、去空格删注释、压缩
- 各类资源打包成浏览器可以识别的`js`、`css`、`jpg`、`png`


<!--truncate-->


## webpack概念
- 1.树结构: 在入口文件中引入所有资源,形成的依赖关系
- 2.模块: js/css/img,每个资源都是一个`模块`
- 3.chunk: 打包过程中被操作的`模块`,一个或多个组合
- 4.bundle: 打包后的文件



## 7个主配置
- mode: 打包模式,生产(开启资源压缩)-production,开发调试-development
- devtool: 调试资源模式,常用 'source-map'
- entry: 打包入口文件的配置,可配置多入口
- output: 打包输出的配置,输出的目录和打包后的文件名
- target(v5+): js的转换目标, 转es5-> ['web','es5']
- module: 各类资源的打包处理,写loader,翻译资源
- plugins: 插件,辅助loader、处理更广的操作:打包、优化、压缩
- devServer: 本地服务器



## webpack4 主要依赖与插件:
	- postcss-loader / autoprefixer: 添加css兼容性前缀
	- babel-core / babel-loader / babel-preset-latest: es6+ -> es5
	- babel-plugin-transform-runtime: 配置.babelrc 支持async/await语法
	- css-loader / style-loader: 处理css样式表(内嵌模式)
	- html-loader / html-webpack-plugin: 处理html文件
	- file-loader / url-loader: 处理文件资源(图片等)
	- node-sass / sass-loader: 编译sass语法
	- ejs / ejs-loader: 处理模板文件
	- mini-css-extract-plugin: 单独提取css样式文件(与内嵌相反,抽离)
	- uglifyjs-webpack-plugin: 压缩混淆js代码
	- cross-env: 兼容所有平台动态设置NODE_ENV环境变量
	- ** webpack 4 成功打包的版本记录 **
		- webpack 4.30.0
		- webpack-cli 3.3.0
		- webpack-dev-server 3.7.2


<!--truncate-->



## webpack 成功方案一: 
- webpack4
- 已经解决依赖的问题, 请优先用 cnpm 安装依赖
```javascript
{
  ...
  "scripts": {
    "dev": "webpack-dev-server",
    "serve": "cross-env NODE_ENV=development webpack-dev-server --host localhost --content-base dist/ --hot --watch-cli --config webpack.config.js --progress --display-modules --colors --display-reasons",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
  },
  "devDependencies": {
    "autoprefixer": "^9.5.1",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-latest": "^6.24.1",
    "cross-env": "^7.0.3",
    "css-loader": "^2.1.1",
    "ejs": "^3.1.5",
    "ejs-loader": "^0.5.0",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "image-webpack-loader": "^4.6.0",
    "mini-css-extract-plugin": "^0.7.0",
    "node-sass": "^4.11.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "uglifyjs-webpack-plugin": "^2.1.2",
    "url-loader": "^1.1.2",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.7.2"
  }
}
```
- webpack4 - webpack.config.js
```javascript
const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
	// 开发:development / 生产:production
	mode: 'development';
	// 入口js(可配置多入口)
	entry: {
		index: path.resolve(__dirname, 'src/js/index.js')
	},
	// 打包输出配置：输出目录,打包入口文件名称
	output: {
		path: path.resolve(__dirname, '/dist'),
		filename: 'js/[name].js'
	},
	// 模块文件解析
	module: {
		rules: [
			// js 解析 es6 ->es5
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: path.resolve(__dirname, 'node_modules'),
				query: {
					'presets': ['latest']
				}
			},
			// ejs tpl-html模板文件 解析
			{
				test: /\.tpl$/,
				loader: 'ejs-loader'
			},
			// css解析
			{
        		test: /\.css$/,
		        use: [
		          	// 多loader使用use: [],处理次序:后 -> 前
		          	{
						loader: miniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development'
						}
					}, // 单独提取个小文件
		          	// 'style-loader', // 嵌入内联样式
		          	'css-loader',
		          	{
		            	loader: 'postcss-loader',
		            	options: {
		              // 兼容-自动适配插件
		              plugins: function () {
		                return [autoprefixer('last 5 versions')]
		              }
		            }
		          }
		        ]
      		},
			// scss 解析 文件提取
			{
				test: /\.scss$/,
				use: [
					{
						loader: miniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development'
						}
					}, // 单独提取个小文件
		          	// 'style-loader', // 嵌入内联样式
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function()	{
								return [autoprefixer('last 5 versions')]	
							}
						}
					},
					'sass-loader'
				]
			},
			// 图片 解析+压缩
			{
				test: /\.(png|jpg|jpeg|gif|webp|ico|eot|woff|svg|ttf)$/i,
				use: [
					{
						loader: 'url-loader?limit=1024&name=img/[name]-[hash:16].[ext]',
						options: {
							esModule: false,
						}
					},
					'image-webpack-loader'
				]
			},
		]
	},
	// 压缩混淆js、入口html模板配置
	plugin: {
		new ungify(),
		new htmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, 'src/index.html'),
			title: '首页',
			chunks: ['index'],
			chunksSortMode: 'manual',
			excludeChunks: ['node_modules'],
			hash: true,
			minify: {
				removeComments: true, // 删除注释
				collapseWhites: true  // 移除空格、换行
			}
		}),
		// 如果单独抽离css
		new miniCssExtractPlugin({
			filename: 'css/[name].css'
		})
	},
	devServer: {
		watchOptions: {
	      ignored: /node_modules/,
	    },
	    open: true,
	    host: 'localhost',
	    port: 3000,
	},
}
```




## webpack方案二
(ps: 下面的配置非最优方案, 最新版本webpack5内已包含部分插件配置可省去使用某些loader、plugin)
- webpack 5 已校验过,可以正常使用
针对webpack5,需要切换成如下的依赖配置:
```bash
{
	...
	"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack serve",
    "serve": "cross-env NODE_ENV=development webpack serve --host localhost --content-base dist/ --hot --config webpack.config.js --progress",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
  },
  "dependencies": {},
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/plugin-transform-runtime": "^7.13.10",
    "@babel/preset-env": "^7.13.10",
    "autoprefixer": "^10.2.5",
    "babel-loader": "^8.2.2",
    "cross-env": "^7.0.3",
    "css-loader": "^5.1.3",
    "ejs": "^3.1.6",
    "ejs-loader": "^0.5.0",
    "file-loader": "^6.2.0",
    "html-loader": "^2.1.2",
    "html-webpack-plugin": "^5.3.1",
    "mini-css-extract-plugin": "^1.3.9",
    "node-sass": "^5.0.0",
    "postcss-loader": "^5.2.0",
    "sass-loader": "^11.0.1",
    "style-loader": "^2.0.0",
    "uglifyjs-webpack-plugin": "^2.2.0",
    "url-loader": "^4.1.1",
    "webpack": "^5.26.3",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

##### webpack5 - webpack.config.js 和 postcss.config.js 参考配置
- postcss.config.js
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      // 浏览器兼容配置
      overrideBrowserslist: [
        '> 0.2%', // 兼容80的浏览器
        'last 5 versions', // 所有主流浏览器最近5个版本
        'not dead' // 不要已淘汰的浏览器
      ]
    }),
  ],
}
```
- webpack.config.js
```javascript
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const uglify = require('uglifyjs-webpack-plugin')

const isProductionMode = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  devtool: !isProductionMode && 'source-map',
  entry: {
    index: path.resolve(__dirname, 'src/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]-[hash:16].js',
  },
  target: ['web', 'es5'],
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.css$/,
        use: [
          isProductionMode ? miniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProductionMode ? miniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '../img/',
              outputPath: 'img/',
              name: '[name]-[hash:16].[ext]',
              limit: 1024 * 8, // < 8kb 的图片文件将转成base64
              esModule: false // 关闭esModule,启用Command
            },
          },
        ],
      },
      // html-img标签等外部资源引入
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      // 字体资源
      {
        test: /\.(woff|eot|svg|ttf)$/i,
        loader: 'file-loader',
        options: {
          publicPath: '../fonts/',
          outputPath: 'fonts/',
          name: '[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new uglify(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.ejs'),
      title: '测试页面',
      chunks: ['index'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
    }),
    new miniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  devServer: {
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
    open: true,
    compress: true,
    hot: true, // 部分热重启,css,js
    host: 'localhost',
    port: 3001,
  },
}
```




## 项目代码优化
- 去除没有用到的js代码
	+ mode: 'production'
	+ es6模块化
	+ tree-shaking
- 去除没有用到的css
	+ 使用插件: purgecss-webpack-plugin
>>> const glob = require('glop')
>>> const PATHS = { src: join(__dirname, 'src') }
>>> new purgecssWebpackPlugin({ path: glob.sync(`${PATH.src}/**/*`, {nodir: true}) })



## 兼容问题事项:
- 1.babel-loader 关联依赖的版本问题
```bash
babel-loader 8.x 对应 babel-core 7.x
使用 @babel/core

babel-loader 7.x 对应 babel-core 6.x
使用 babel-core
```

- 2.postcss-loader、autoprefix 版本的问题
作用: 这两个依赖/插件是为了解决 css在不同浏览器的兼容前缀问题
如果发现配置了这2个依赖/插件,但css仍然没有兼容型前缀的情况。应该特别关注`autoprefix`插件是否正确使用。
```bash
# webpack 4.x + postcss-loader 3.x +  autoprefixer 9.x
# 注意 loader 的写法才生效:
{
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
      	autoprefixer('last 5 versions')
      ]
    },
  },
}
```

- 3.关于图片资源引入的问题
	+ 注意:在html/css里头,使用`src`的绝对路径
	+ `url-loader`:默认esmodule导入, html-loader:默认command导入
	+ `html-loader`: 默认能识别 `.html` 和 `.ejs`
```bash
## webpack5 针对html-img标签图片引入的识别,使用`html-loader`
{
  test: /\.html$/,
  loader: 'html-loader'
}

## 解决 html-img标签 本地图片地址正确导入的问题
## 原因: 冲突点: `url-loader`:默认esmodule导入, html-loader:默认command导入
## 解决: 
##		1.关闭url-loader esmodule的导入方式,false->使用command方式
##    2.模板文件换成 `.ejs`,htmlWebpackPlugin的template记得要改后缀
##    3.img标签换ejs引入资源的方式 <img src="<%= require('xxx.png') %>">
{
	test: /\.(png|jpg|jpeg|gif|ico)$/i,
	loader: 'url-loader',
	options: {
		...
		esModule: false
	}
}
```
