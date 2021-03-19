---
slug: front-webpack
title: 前端-webpack-构建方案
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [front, webpack]
---

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


## webpack 方案一: 
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

##### webpack 4 配置模板  wepack.config.js
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




## webpack 5 配置变更


## 兼容问题事项:
```bash
babel-loader 8.x 对应 babel-core 7.x
使用 @babel/core

babel-loader 7.x 对应 babel-core 6.x
使用 babel-core
```