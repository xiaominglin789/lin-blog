---
slug: vue-img-require
title: vue-img-require缘由
author: Lin
author_title: xiaominglin789
author_url: https://github.com/xiaominglin789/lin-blog
author_image_url: https://avatars2.githubusercontent.com/u/74356262?s=400&u=51bc963a308dd3748ba5133c9cfd29eb3bc0c207&v=4
tags: [front, vue, router]
---

## 关于 vue-本地img require方式疑问
为何vue工程有时候在img中使用本地图片需要用require的方式？
有的项目却不需要？两眼一抹黑...
![问号](https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1311220781,1465468650&fm=26&gp=0.jpg)

<!--truncate-->

## vue-cli创建的项目
> 测试:vue-cli4.5 -> vue2 + babel 项目
默认配置下:
- 在经过webpack构建后,会将`用到的`src/assets资源都打进 dist/ 下,
默认分别有:
	- dist/css 所有页面的外部样式或style标签样式都会打成： [
	name][hash].css
	- dist/img 图片资源,assets目录下的图片资源都打进这个目录
	- dist/js 页面分割的js代码

- 打包构建,遇到img标签使用相对路径时,src=assets/xxx.[图片格式]的图片资源,最终会变成:/img/xxx.[图片格式] js

- 正是因为图片资源都被打进 /dist 目录下, /img/xxx.[图片格式] 就能正确找到服务器目录下的图片、
```bash
# 截取部分构建后的代码片段: 没有 require
<img src="./assets/logo.jpg">
...cf05:function(e,t,r){e.exports=r.p+"img/logo.82b9c7a5.png"}
# 直接在src使用了 require,最终编译出来的代码基本是相同结构的
<img :src="require('./assets/content.jpg')">
..."0548":function(e,t,r){e.exports=r.p+"img/content.787876c4.jpg"}
```


## 关键是有时候我们想绑定 img.src = 变量 的方式加载本地图片地址
变量是在程序读取到时,才执行回调返回结果。
>> 1.你需要告诉构建工具 => require('本地图片相对路径') 转换 成服务器根目录的图片地址
>> 2.没有使用 require() 包裹图片地址, 构建后的路径: `link3:{type:String,default:"../assets/logo.gif"}`,程序运行读取变量值:找不到正确图片路径,将抛出错误.
```bash
# 
c = function() {
	var e = this,
	  t = e.$createElement,
	  n = e._self._c || t
	return n('div', { staticClass: 'hello' }, [
	  e._m(0),
	  n('div', [e._v(' 2 '), n('img', { attrs: { src: e.link2 } })]),
	  n('div', [e._v(' 3 '), n('img', { attrs: { src: e.link3 } })]),
	])
},
# 
data: function() {
  return { link2: n('6a89') }
},
# 
'6a89': function(e, t, n) {
  e.exports = n.p + 'img/content.f7e3450f.png'
},
```

## 正确的变量指定本地图片的方式
- 变量 = require(本地图片地址)
- computed,watch来过的转换都会导致失效的
	+ a = '../assets/content.png'
	+ b = computed->require(a) 它将是个静态字符串: '../assets/content.png'
```javascript
# 正确的方式
<template>
  <img :src="link2">
  <img :src="link3">
</template>
<script>
{
  props: {
	link3: {
	  type: String,
	  default: require('../assets/logo.gif')
	},
  },
  data() {
    return {
      link2: require('../assets/content.png')
    }
  },
}
</script>
```

